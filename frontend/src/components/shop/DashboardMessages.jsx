import axios from "axios";

import { useEffect, useRef } from "react";
import { backend_url, server } from "../../../server";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import styles from "../../styles/styles";
import { TfiGallery } from "react-icons/tfi";
import { format } from "timeago.js";
import socketIO from "socket.io-client";

const ENDPOINT = "http://localhost:4000/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);

  const [conversations, setConversations] = useState([]);
  const [open, setOpen] = useState(false);
  // socket
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  //
  useEffect(() => {
    axios
      .get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversations);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [seller]);

  useEffect(() => {
    if (seller) {
      const userId = seller._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };
  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });
    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });
    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImages(file);
    await imageSendingHandler(file);
  };
  const imageSendingHandler = async (file) => {
    const formData = new FormData();
    formData.append("images", file);
    formData.append("sender", seller._id);
    formData.append("text", "");

    formData.append("conversationId", currentChat._id);

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );
    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: file,
    });
    try {
      await axios
        .post(`${server}/message/create-new-message`, formData)
        .then((res) => {
          setImages({});
          setMessages([...messages, res.data.message]);
          updateLastMessageImage();
        });
    } catch (error) {
      console.log(error);
    }
    const updateLastMessageImage = async () => {
      socketId.emit("updateLastMessage", {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      });
      axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: "Photo",
          lastMessageId: seller._id,
        }
      );
    };
  };
  return (
    <div className=" w-[90%] bg-white m-3 h-[86vh] overflow-y-scroll rounded ">
      {!open && (
        <>
          <h1 className=" text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {/* All messages list */}
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={seller._id}
                userData={userData}
                setUserData={setUserData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
              />
            ))}
        </>
      )}
      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          setUserData={setUserData}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  userData,
  setUserData,
  online,
  setActiveStatus,
}) => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };
  const [user, setUser] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const userId = data.members.find((user) => user != me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);
  return (
    <div
      className={`cursor-pointer  ml-2  shadow-sm w-full flex py-2 px-3 my-1 ${
        active === index ? `bg-[#0b0b0b13]` : `bg-transparent`
      }  rounded-[3px]`}
      onClick={() => {
        setActive(index) ||
          handleClick(data._id) ||
          setCurrentChat(data) ||
          setUserData(user) ||
          setActiveStatus(online);
      }}
    >
      <div className="relative">
        <img
          src={`${backend_url}/${user?.avatar?.public_id}`}
          alt=""
          className=" w-[50px] h-[50px] rounded-full"
        />
        {online ? (
          <div className=" w-[12px] h-[12px] bg-green-500 rounded-full absolute top-9 left-9 "></div>
        ) : (
          <div className=" w-[12px] h-[12px] bg-[#b6b5b5] rounded-full absolute top-9 left-9 "></div>
        )}
      </div>
      <div className="pl-3">
        <h1 className=" text-[18px]"> {user?.name} </h1>

        <p className="text-[15px] text-[#000c]">{data?.lastMessage}</p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className=" w-full h-[84vh] flex flex-col justify-between ">
      {/* Message Header */}
      <div className="bg-gray-300 w-full flex px-2 py-1 items-center justify-between">
        <div className="flex">
          <img
            className=" w-[60px] h-[60px] rounded-full "
            src={`${backend_url}/${userData?.avatar?.public_id}`}
            alt=""
          />
          <div className=" pl-3 ">
            <h1 className=" text-[18px] font-[600] mt-4 "> {userData?.name}</h1>
            <h1> {activeStatus === true ? "Active Now" : ""} </h1>
          </div>
        </div>
        <AiOutlineArrowRight
          className="cursor-pointer"
          size={20}
          onClick={() => setOpen(false)}
        />
      </div>
      {/* Messages */}

      <div className="px-3 h-[57vh] py-1 overflow-y-scroll ">
        {messages &&
          messages.map((item, index) => (
            <div
              key={index}
              className={`flex w-full my-1 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
              ref={scrollRef}
            >
              {item.sender !== sellerId && (
                <img
                  src={`${backend_url}/${userData?.avatar}`}
                  alt=""
                  className=" w-[40px] h-[40px] rounded-full mx-3"
                />
              )}
              {item.images && (
                <img
                  src={`${backend_url}/${item.images}`}
                  alt=""
                  className={`flex my-1 w-[200px] h-[200px] rounded-[20px] object-cover${
                    item.sender === sellerId ? "justify-end" : "justify-start"
                  }`}
                />
              )}
              {item.text !== "" && (
                <div>
                  <div className=" w-max p-2 bg-green-400 rounded h-min ">
                    <p className="text-white">{item.text}</p>
                  </div>

                  <p className=" text-[12px] pb-1 text-[#939393]">
                    {format(item.createdAt)}{" "}
                  </p>
                </div>
              )}
            </div>
          ))}
        <div ref={scrollRef} />
      </div>
      {/* send Message input */}
      <form
        onSubmit={sendMessageHandler}
        aria-required={true}
        className=" p-3 relative w-full flex justify-between items-center"
      >
        <div className="w-[3%]">
          <input
            type="file"
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery size={20} className=" cursor-pointer" />
          </label>
        </div>
        <div className="w-[97%]">
          <input
            type="text"
            required
            placeholder="Enter Your Message"
            className={`${styles.input}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={25}
              className=" cursor-pointer absolute right-4 top-4"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;
