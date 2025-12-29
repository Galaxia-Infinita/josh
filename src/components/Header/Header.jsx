import React, { useState } from "react";
import { Linkedin, Instagram, Github } from "lucide-react";
import "./Header.css";

const Header = () => {
  const [theme, setTheme] = useState("dark");

  const handleThemeChange = (mode) => {
    setTheme(mode);
    document.body.setAttribute("data-theme", mode);
  };

  return (
    <>
      {/* HEADER LATERAL VERTICAL */}
      <header className="vertical-header">
        <div className="header-section top">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <Linkedin size={15} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <Instagram size={15} />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Github size={15} />
          </a>
        </div>

        <div className="header-section middle">
          <span>@2025</span>
        </div>

        <div className="header-section bottom">
  {/*
  <label>
    <input
      type="radio"
      name="theme"
      value="light"
      checked={theme === "light"}
      onChange={() => handleThemeChange("light")}
    />
    Claro
  </label>
  <label>
    <input
      type="radio"
      name="theme"
      value="dark"
      checked={theme === "dark"}
      onChange={() => handleThemeChange("dark")}
    />
    Oscuro
  </label>
  */}

  {/* Separador centrado */}
  <div className="separator"></div>
</div>

      </header>
    </>
  );
};

export default Header;
