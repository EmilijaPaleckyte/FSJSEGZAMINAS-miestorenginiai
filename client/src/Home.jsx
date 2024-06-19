import "./styles/NavBar.css";
import "./styles/Footer.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { Link } from "react-router-dom";

const Home = () => {
  const homeContainerStyle = {
    background: "#f0f0f0",
    minHeight: "100vh",
    paddingTop: "60px",
    boxSizing: "border-box",
    paddingBottom: "60px",
  };

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
      </nav>
      <div className="content">
        <h1>Sveikas atvykęs į Miesto Renginiai!</h1>
        <p>Jaukis lyg namuose</p>
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
