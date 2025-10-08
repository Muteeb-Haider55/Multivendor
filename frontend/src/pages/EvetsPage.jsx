import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import EventCard from "../components/Route/Events/EventCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../redux/actions/event";
import ProductCard from "../components/Route/ProductCard/ProductCard";

const EvetsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);
  const [data, setData] = useState([]);
  return (
    <>
      <Header activeHeading={4} />
      {allEvents && allEvents.length !== 0 ? (
        <>
          {allEvents &&
            allEvents.map((i, index) => <EventCard data={i} active={true} />)}
        </>
      ) : (
        <p className=" flex items-center justify-center font-Poppins text-[25px] p-4 mt-10">
          No Event Yet!
        </p>
      )}
    </>
  );
};

export default EvetsPage;
