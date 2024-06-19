import "./styles/NavBar.css";
import "./styles/Footer.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { Link } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const [eventCards, setEventCards] = useState([
    {
      id: 1,
      title: "Vasaros Muzikos Festivalis",
      date: "2024-07-20",
      location: "Miesto parkas",
      category: "Muzika",
      rating: 5,
      votes: [],
    },
    {
      id: 2,
      title: "Maisto automobilių mugė",
      date: "2024-08-15",
      location: "Centrinis aikštė",
      category: "Maistas",
      rating: 5,
      votes: [],
    },
    {
      id: 3,
      title: "Menų paroda",
      date: "2024-09-05",
      location: "Menų galerija",
      category: "Menai",
      rating: 5,
      votes: [],
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("Visi");
  const [selectedTime, setSelectedTime] = useState("Visi");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleVote = (eventId, rating) => {
    const updatedEvents = eventCards.map((event) => {
      if (event.id === eventId) {
        const newVotes = [...event.votes, rating];
        const newRating = calculateAverageRating(newVotes);
        return { ...event, rating: newRating, votes: newVotes };
      }
      return event;
    });
    setEventCards(updatedEvents);
  };

  const calculateAverageRating = (votes) => {
    const totalVotes = votes.length;
    if (totalVotes === 0) return 0;
    const sum = votes.reduce((acc, vote) => acc + vote, 0);
    return Math.round((sum / totalVotes) * 10) / 10;
  };

  const homeContainerStyle = {
    background: "#f0f0f0",
    minHeight: "100vh",
    paddingTop: "60px",
    boxSizing: "border-box",
    paddingBottom: "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const categories = [
    "Visi",
    ...new Set(eventCards.map((event) => event.category)),
  ];
  const months = [
    "Visi",
    "Sausis",
    "Vasaris",
    "Kovas",
    "Balandis",
    "Gegužė",
    "Birželis",
    "Liepa",
    "Rugpjūtis",
    "Rugsėjis",
    "Spalis",
    "Lapkritis",
    "Gruodis",
  ];

  return (
    <div style={homeContainerStyle} className="home-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Miesto Renginiai</Link>
        </div>
        <div className="navbar-links">
          <ul>
            <li>
              <Link to="/" className="nav-link">
                Pagrindinis
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                Apie Mus
              </Link>
            </li>
            <li>
              <Link to="/profile" className="nav-link">
                Profilis
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-filters">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedTime}
            onChange={(e) => handleTimeChange(e.target.value)}
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </nav>
      <div className="content">
        <h1>Sveikas atvykęs į Miesto Renginiai!</h1>
        <p>Jaukis lyg namuose</p>

        <div className="event-cards">
          {eventCards
            .filter(
              (event) =>
                selectedCategory === "Visi" ||
                event.category === selectedCategory
            )
            .filter(
              (event) =>
                selectedTime === "Visi" || event.date.includes(selectedTime)
            )
            .map((event) => (
              <div key={event.id} className="card">
                <div className="card-header">
                  <span className="event-rating">
                    <i className="fas fa-star"></i> {event.rating} (
                    {event.votes.length} balsas)
                  </span>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text">
                    <strong>Data:</strong> {event.date}
                    <br />
                    <strong>Vieta:</strong> {event.location}
                  </p>
                  <div className="rating-buttons">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleVote(event.id, star)}
                        className="btn btn-outline-primary"
                      >
                        {star} <i className="fas fa-star"></i>
                      </button>
                    ))}
                  </div>
                  <Link to="/post" className="btn btn-primary">
                    Daugiau...
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
      <footer className="footer">
        <div className="footer-logo">
          <Link to="/">Miesto Renginiai</Link>
        </div>
        <div className="footer-links">
          <ul>
            <li>
              <Link to="/contacts" className="nav-link">
                Kontaktai
              </Link>
            </li>
            <li className="social-icons">
              <a href="https://www.facebook.com" className="nav-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.twitter.com" className="nav-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.linkedin.com" className="nav-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </li>
            <li>
              &copy; {new Date().getFullYear()} © Miesto Renginiai 2024. Visos
              teisės saugomos.
            </li>
            <li>
              <a href="#top" className="nav-link">
                Grįžti į viršų
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Home;
