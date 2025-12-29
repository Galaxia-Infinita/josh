import React from "react";
import "./Horizontal-header.css";

const HorizontalHeader = () => {
  const buttons = ["SOBRE MÍ", "EXPERIENCIA", "CONTACTO"];

  return (
    <header className="horizontal-header">
      <nav className="nav-buttons">
        <button className="nav-btn home-btn" aria-label="Inicio">
          <svg
            width="40"
            height="40"
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="home-icon"
          >
            <path
              d="M4.0714 68.2444L67.3846 4.11229C71.2631 0.183623 77.5915 0.141155 81.5223 4.01741L146.256 67.8514C150.197 71.7371 147.445 78.4461 141.911 78.4461C138.493 78.4461 135.723 81.2167 135.723 84.6344V139C135.723 144.523 131.245 149 125.723 149H105.258C99.7347 149 95.2576 144.523 95.2576 139V108.318C95.2576 102.795 90.7804 98.3178 85.2576 98.3178H61.9429C56.42 98.3178 51.9429 102.795 51.9429 108.318V139C51.9429 144.523 47.4657 149 41.9429 149H24.3275C18.8047 149 14.3275 144.523 14.3275 139V84.4381C14.3275 81.1288 11.6448 78.4461 8.33551 78.4461C3.01576 78.4461 0.334015 72.0301 4.0714 68.2444Z"
              stroke="#3CE0C3"
              strokeWidth="2"
            />
          </svg>
        </button>

        {buttons.map((text, i) => (
          <button className="nav-btn" key={i}>
            {/* Capa trasera (borde blanco) */}
            <span className="btn-layer back">
              <span className="btn-text">{text}</span>
              <span className="btn-circle"></span>
            </span>

            {/* Capa delantera (menta) */}
            <span className="btn-layer front">
              <span className="btn-text">{text}</span>
              <span className="btn-circle"></span>
            </span>
          </button>
        ))}
      </nav>
    </header>
  );
};

export default HorizontalHeader;
