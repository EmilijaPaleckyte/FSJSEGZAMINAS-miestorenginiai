import "./styles/NavBar.css";
import "./styles/Footer.css";
import "./styles/Contacts.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { Link } from "react-router-dom";

const Contacts = () => {
  return (
    <div className="contacts-page">
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
                Apie mus
              </Link>
            </li>
            <li>
              <Link to="/profile" className="nav-link">
                Profilis
              </Link>
            </li>
            <li>
              <Link to="/contacts" className="nav-link active">
                Kontaktai
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="content">
        <h1>Susisiekite su mumis</h1>
        <section className="contact-section">
          <h2>Biuro adresai</h2>
          <ul>
            <li>
              <strong>Pagrindinis biuras:</strong> 123 Pagrindinis gatvė,
              Miestas
            </li>
            <li>
              <strong>Šakos biuras:</strong> 456 Šakos alėja, Miestelis
            </li>
          </ul>
        </section>
        <section className="contact-section">
          <h2>Klientų aptarnavimas</h2>
          <p>
            Dėl klientų klausimų ir pagalbos prašome susisiekti su mumis el.
            paštu arba telefonu.
          </p>
          <ul>
            <li>
              <strong>El. paštas:</strong>{" "}
              <span className="email-link">info@imone.com</span>
            </li>
            <li>
              <strong>Telefonas:</strong> +1 (123) 456-7890
            </li>
          </ul>
        </section>
        <section className="contact-section">
          <h2>Susisiekite su mumis</h2>
          <p>Sekite mus socialiniuose tinkluose naujausioms naujienoms:</p>
          <div className="social-icons">
            <a href="https://www.facebook.com" className="nav-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com" className="nav-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com" className="nav-link">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </section>
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
              &copy; {new Date().getFullYear()} Miesto Renginiai 2024. Visos teisės
              saugomos.
            </li>
            <li>
              <a href="#top" className="nav-link">
                Į viršų
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Contacts;
