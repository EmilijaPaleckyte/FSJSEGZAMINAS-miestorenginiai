import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import pfp from "./assets/pfp.png";

const Profile = ({ user, handleLogout }) => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventPhoto, setEventPhoto] = useState("");
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventCreated, setEventCreated] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchUserEvents();
    fetchEventCategories();
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

  const fetchEventCategories = async () => {
    // Replace with actual endpoint to fetch categories
    const fetchedCategories = [
      { id: 1, name: "Kultūra" },
      { id: 2, name: "Muzika" },
      { id: 3, name: "Sportas" },
      { id: 4, name: "Festivaliai" },
      { id: 5, name: "Kiti" },
    ];
    setCategories(fetchedCategories);
  };

  const handleEventCreate = async (e) => {
    e.preventDefault();
    const eventData = {
      name: eventName,
      category: eventCategory,
      time: eventTime,
      place: eventPlace,
      photo: eventPhoto,
      organizer_id: user.id,
    };

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

      setEventName("");
      setEventCategory("");
      setEventTime("");
      setEventPlace("");
      setEventPhoto("");
      setEventCreated(true);

      fetchUserEvents();
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

      fetchUserEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditClick = (event) => {
    setEventToEdit(event);
    setEventName(event.name);
    setEventCategory(event.category);
    setEventTime(event.time);
    setEventPlace(event.place);
    setEventPhoto(event.photo);
  };

  const handleEventUpdate = async (e) => {
    e.preventDefault();
    const updatedEventData = {
      id: eventToEdit.id,
      name: eventName,
      category: eventCategory,
      time: eventTime,
      place: eventPlace,
      photo: eventPhoto,
      organizer_id: user.id,
    };

    try {
      const response = await fetch(`api/events/${eventToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEventData),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      setEventName("");
      setEventCategory("");
      setEventTime("");
      setEventPlace("");
      setEventPhoto("");
      setEventToEdit(null);

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
            <div className="card mb-4">
              <div className="card-body text-center">
                <img
                  src={pfp}
                  alt="User Profile"
                  className="rounded-circle mb-3"
                  style={{ width: "150px", height: "150px" }}
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
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="mb-4">Sukurti naują renginį</h3>
                <form
                  onSubmit={eventToEdit ? handleEventUpdate : handleEventCreate}
                >
                  <div className="form-group">
                    <label htmlFor="eventName">Pavadinimas</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventName"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventCategory">Kategorija</label>
                    <select
                      className="form-control"
                      id="eventCategory"
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
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
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventPlace">Vieta</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventPlace"
                      value={eventPlace}
                      onChange={(e) => setEventPlace(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="eventPhoto">Nuotrauka (URL)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventPhoto"
                      value={eventPhoto}
                      onChange={(e) => setEventPhoto(e.target.value)}
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
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="mb-4">Mano renginiai</h3>
                <div className="list-group">
                  {events.map((event) => (
                    <div key={event.id} className="list-group-item">
                      <h5>{event.name}</h5>
                      <p>
                        <strong>Kategorija:</strong> {event.category}
                      </p>
                      <p>
                        <strong>Laikas:</strong> {event.time}
                      </p>
                      <p>
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
                      <div>
                        <button
                          className="btn btn-sm btn-info mr-2"
                          onClick={() => handleEditClick(event)}
                        >
                          Redaguoti
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleEventDelete(event.id)}
                        >
                          Ištrinti
                        </button>
                      </div>
                    </div>
                  ))}
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
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
  }),
  handleLogout: PropTypes.func.isRequired,
};

export default Profile;
