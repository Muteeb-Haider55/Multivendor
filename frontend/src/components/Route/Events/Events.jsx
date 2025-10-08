import React, { useEffect } from "react";
import styles from "../../../styles/styles";
import EventCard from "./EventCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../../redux/actions/event.js";
const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);
  console.log(allEvents);
  return (
    <div>
      {!isLoading && allEvents.length !== 0 ? (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>
          <div className=" w-full grid">
            {allEvents && <EventCard data={allEvents && allEvents[0]} />}{" "}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Events;
