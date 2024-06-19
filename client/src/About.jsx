import "./styles/NavBar.css";
import "./styles/Footer.css";
import "./styles/About.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { Link } from "react-router-dom";
import { useState } from "react";

const About = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="about-page">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Miesto Renginiai</Link>
        </div>
        <div className="navbar-toggle" onClick={toggleNav}></div>
        <div className={`navbar-links ${isNavOpen ? "show" : ""}`}>
          <ul>
            <li>
              <Link to="/" className="nav-link">
                Pagrindinis
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link active">
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
        <h1>Miesto Renginiai</h1>
        <section className="profile-section">
          <h2>Mūsų Vizija</h2>
          <p>
            Miesto Renginiai vizija yra tapti lyderiu renginių
            organizavimo srityje, kuriant inovatyvius ir įsimintinus renginius,
            kurie praturtina vietos bendruomenės gyvenimą.
          </p>
        </section>
        <section className="profile-section">
          <h2>Mūsų Misija</h2>
          <p>
            Mūsų misija - suteikti aukščiausios kokybės renginių organizavimo
            paslaugas, kurios atspindi mūsų įsipareigojimą kurti neįtikėtiną
            renginių patirtį mūsų klientams ir jų svečiams.
          </p>
        </section>
        <section className="profile-section">
          <h2>Mūsų Vertybės</h2>
          <ul>
            <li>
              <strong>Kokybė:</strong> Teikiame aukščiausios kokybės paslaugas,
              kuriomis didžiuojamės ir kurias mūsų klientai vertina.
            </li>
            <li>
              <strong>Inovacijos:</strong> Nuolatos ieškome naujų idėjų ir
              sprendimų, siekdami pasiūlyti unikalias renginių patirtis.
            </li>
            <li>
              <strong>Bendruomenė:</strong> Esame įsipareigoję bendruomenei,
              kurioje veikiame, prisidėti ir būti geriems piliečiams.
            </li>
            <li>
              <strong>Klientų Orientacija:</strong> Skiriame dėmesį kiekvieno
              kliento poreikiams ir siekiame viršyti jų lūkesčius.
            </li>
            <li>
              <strong>Patirtis:</strong> Turime daugiametę patirtį renginių
              organizavimo srityje, kurią taikome kiekviename mūsų projekte.
            </li>
          </ul>
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

export default About;
