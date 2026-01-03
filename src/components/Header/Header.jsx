import React, { useState, useRef, useEffect } from "react";
import { Linkedin, Instagram, Github, Volume2, VolumeX, Info } from "lucide-react";
import "./Header.css";


const Header = ({ audioEnabled, onToggleAudio }) => {
  const [theme, setTheme] = useState("dark");

  const handleThemeChange = (mode) => {
    setTheme(mode);
    document.body.setAttribute("data-theme", mode);
  };

  const [showCredits, setShowCredits] = useState(false);
  const creditsRef = useRef(null);

  // cerrar si haces click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (creditsRef.current && !creditsRef.current.contains(e.target)) {
        setShowCredits(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* HEADER LATERAL VERTICAL */}
      <header className="vertical-header">
        <div className="header-section top">
          <a href="https://www.linkedin.com/in/jp-developer" target="_blank" rel="noreferrer">
            <Linkedin size={15} />
          </a>
          <a href="https://www.instagram.com/j_p_dev?igsh=bjQzeWNsczVuY3Yw" target="_blank" rel="noreferrer">
            <Instagram size={15} />
          </a>
          <a href="https://github.com/Galaxia-Infinita/josh" target="_blank" rel="noreferrer">
            <Github size={15} />
          </a>
        </div>

        <div className="header-section middle">
          <span>@2025</span>
        </div>

        <div className="header-section bottom">
          <button
            className={`header-control-btn ${audioEnabled ? "active" : ""}`}
            onClick={onToggleAudio}
            aria-label="Audio"
          >
            {audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
  className="header-control-btn"
  aria-label="Credits"
  title={`Flashlight - Evolving Ambient Track (Loopable) by kjartan_abel 
-- https://freesound.org/s/610747/ -- License: Attribution 4.0`}
>
  <Info size={15} />
</button>
        </div>
      </header>
    </>
  );
};

export default Header;
