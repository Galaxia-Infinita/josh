import React from 'react';
import '../AnimacionesEstilos/Loader.css';

export default function Loader({ progress, hide }) {
    return (
        <div className={`loader-container ${hide ? "fade-out" : ""}`}>
            
            <div className="cosmic-loader">
                <div className="orbit">
                    <div className="planet"></div>
                </div>

                <div className="loader-progress-text">
                    {progress}%
                </div>
            </div>

            <p className="loader-text">Cargando experiencia...</p>
        </div>
    );
}
