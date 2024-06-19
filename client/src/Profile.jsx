import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import pfp from "./assets/pfp.png";

const Profile = ({ user, handleLogout }) => {
  const [events, setEvents] = useState([]);
  const [eventData, setEventData] = useState({
    name: "",
    category: "",
    time: "",
    place: "",
    photo: "",
  });
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventCreated, setEventCreated] = useState(null);
  const [categories, setCategories] = useState([
    { id: 1, name: "Kultūra" },
    { id: 2, name: "Muzika" },
    { id: 3, name: "Sportas" },
    { id: 4, name: "Festivaliai" },
    { id: 5, name: "Kiti" },
  ]);
  const staticPost = {
    title: "Naujenu Svente",
    content: "This is some sort of a caption",
    category: "Kiti",
    time: "2024-06-19T12:00",
    place: "Internet",
    photo: "not uploaded",
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const response = await fetch(`api/events?organizer_id=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const eventData = await response.json();
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleEventCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      // Clear input fields after successful creation
      setEventData({
        name: "",
        category: "",
        time: "",
        place: "",
        photo: "",
      });

      // Fetch updated list of events after creating a new event
      fetchUserEvents();
      setEventCreated(true);
    } catch (error) {
      console.error("Error creating event:", error);
      setEventCreated(false);
    }
  };

  const handleEventDelete = async (eventId) => {
    try {
      const response = await fetch(`api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Fetch updated list of events after deleting an event
      fetchUserEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditClick = (event) => {
    setEventToEdit(event);
    setEventData({
      name: event.name,
      category: event.category,
      time: event.time,
      place: event.place,
      photo: event.photo,
    });
  };

  const handleEventUpdate = async (e) => {
    e.preventDefault();

    const { id } = eventToEdit;

    try {
      const response = await fetch(`api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      // Clear input fields and reset eventToEdit after successful update
      setEventData({
        name: "",
        category: "",
        time: "",
        place: "",
        photo: "",
      });
      setEventToEdit(null);

      // Fetch updated list of events after updating an event
      fetchUserEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ background: "#f0f0f0", minHeight: "100vh" }}>
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-4 col-md-5 mb-4">
            <div className="card mb-3">
              <div className="card-body text-center">
                <img
                  src={pfp}
                  alt="User Profile"
                  className="rounded-circle mb-3"
                  style={{ width: "120px", height: "120px" }}
                />
                <h2>{user.email}</h2>
                <p>El. paštas: {user.email}</p>
                <button className="btn btn-primary" onClick={handleLogout}>
                  Atsijungti
                </button>
                <Link to="/" className="btn btn-primary ml-3">
                  Į pagrindinį
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-md-7">
            <div className="card mb-3">
              <div className="card-body">
                <h3 className="mb-4">
                  {eventToEdit ? "Redaguoti renginį" : "Sukurti naują renginį"}
                </h3>
                <form onSubmit={eventToEdit ? handleEventUpdate : handleEventCreate}>
                  <div className="form-group">
                    <label htmlFor="eventName">Pavadinimas</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventName"
                      name="name"
                      value={eventData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventCategory">Kategorija</label>
                    <select
                      className="form-control"
                      id="eventCategory"
                      name="category"
                      value={eventData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pasirinkite kategoriją</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventTime">Laikas</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="eventTime"
                      name="time"
                      value={eventData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventPlace">Vieta</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventPlace"
                      name="place"
                      value={eventData.place}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventPhoto">Nuotrauka (URL)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventPhoto"
                      name="photo"
                      value={eventData.photo}
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {eventToEdit ? "Atnaujinti renginį" : "Kurti renginį"}
                  </button>
                  {eventCreated === true && (
                    <p className="text-success mt-2">
                      Renginys sukurtas sėkmingai!
                    </p>
                  )}
                  {eventCreated === false && (
                    <p className="text-danger mt-2">
                      Klaida kuriant renginį. Bandykite dar kartą.
                    </p>
                  )}
                </form>
              </div>
            </div>
            <div className="card mb-3">
              <div className="card-body">
                <h3 className="mb-4">Renginiai</h3>
                {events.map((event) => (
                  <div className="card mb-3" key={event._id}>
                    <div className="card-body">
                      <h5 className="card-title">{event.name}</h5>
                      <p className="card-text">
                        <strong>Kategorija:</strong> {event.category}
                      </p>
                      <p className="card-text">
                        <strong>Laikas:</strong> {new Date(event.time).toLocaleString()}
                      </p>
                      <p className="card-text">
                        <strong>Vieta:</strong> {event.place}
                      </p>
                      {event.photo && (
                        <img
                          src={event.photo}
                          alt={event.name}
                          className="img-fluid mb-2"
                          style={{ maxHeight: "150px" }}
                        />
                      )}
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => handleEditClick(event)}
                      >
                        Redaguoti
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleEventDelete(event._id)}
                      >
                        Ištrinti
                      </button>
                    </div>
                  </div>
                ))}
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{staticPost.title}</h5>
                    <p className="card-text">{staticPost.content}</p>
                    <p className="card-text">
                      <strong>Kategorija:</strong> {staticPost.category}
                    </p>
                    <p className="card-text">
                      <strong>Laikas:</strong> {new Date(staticPost.time).toLocaleString()}
                    </p>
                    <p className="card-text">
                      <strong>Vieta:</strong> {staticPost.place}
                    </p>
                    {staticPost.photo && (
                      <img
                        src={staticPost.photo}
                        alt={staticPost.title}
                        className="img-fluid mb-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  handleLogout: PropTypes.func.isRequired,
};

export default Profile;
