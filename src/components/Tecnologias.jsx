import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "../components/Tecnologias.css";
import Python from "../assets/images/python.webp";  
import Javal from "../assets/images/java.webp";  
import Csharp from "../assets/images/csharp.webp";  
import Nodel from "../assets/images/node.webp"; 
import Reac from "../assets/images/react.webp";  
import Angul from "../assets/images/angular.webp";  
import Javascri from "../assets/images/javascript.webp";  
import Bootstra from "../assets/images/bootstrap.webp";  

import Vscom from "../assets/images/vscom.png";  
import VScod from "../assets/images/vscod.png";  
import Intell from "../assets/images/intell.png";  
import Androi from "../assets/images/androi.webp";  
import Sqlser from "../assets/images/sqlserv.png";  
import Mysq from "../assets/images/mysq.png";  
import Firebas from "../assets/images/firebas.webp";  
import Postgr from "../assets/images/postgre.png";  

export default function Tecnologias({ isReady }) {
  const root = useRef(null);
  const navigate = useNavigate();

  function handleVolver() {
    navigate("/");
  }

  useLayoutEffect(() => {
    if (!isReady) return;
  
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 0.6 }
      });
  
      tl.from(".tech-card", {
        scale: 0.95,
        autoAlpha: 0,
        stagger: 0.12
      })
      .from(".tech-title", {
        y: 10,
        autoAlpha: 0,
        stagger: 0.1
      }, "-=0.6")
      .from(".tech-grid img", {
        y: 14,
        autoAlpha: 0,
        stagger: 0.05
      }, "-=0.5");
    }, root);
  
    return () => ctx.revert();
  }, [isReady]);
  

  if (!isReady) return null;

  return (
    <div className="tech-wrapper" ref={root}>
      <div className="tech-overlay">
        <div className="tech-content">
          {/* HEADER FIJO / STICKY */}
          <div className="tech-volver-wrapper">
            <button className="tech-volver" onClick={handleVolver}>
              VOLVER
            </button>
          </div>
          {/* BACKEND */}
          <div className="tech-group top-t">
            <div className="tech-card">
              <span className="tech-title">Backend</span>
              <div className="tech-grid">
                <img src={Csharp} alt="C#" />
                <img src={Javal} alt="Java" />
                <img src={Python} alt="Python" />
                <img src={Nodel} alt="Node" />
              </div>
            </div>
          </div>

          {/* FRONTEND */}
          <div className="tech-group left-t">
            <div className="tech-card">
              <span className="tech-title">Frontend</span>
              <div className="tech-grid">
                <img src={Reac} alt="React" />
                <img src={Angul} alt="Angular" />
                <img src={Javascri} alt="JavaScript" />
                <img src={Bootstra} alt="Bootstrap" />
              </div>
            </div>
          </div>

          {/* TOOLS */}
          <div className="tech-group right-t">
            <div className="tech-card">
              <span className="tech-title">IDE</span>
              <div className="tech-grid">
                <img src={Vscom} alt="Visual Studio Community" />
                <img src={VScod} alt="Visual Studio Code" />
                <img src={Intell} alt="IntelliJ IDEA" />
                <img src={Androi} alt="Android Studio" />
              </div>
            </div>
          </div>

          {/* DATABASE */}
          <div className="tech-group bottom-t">
            <div className="tech-card">
              <span className="tech-title">Databases</span>
              <div className="tech-grid">
                <img src={Sqlser} alt="SQL Server" />
                <img src={Postgr} alt="PostgreSQL" />
                <img src={Mysq} alt="MySQL" />
                <img src={Firebas} alt="Firebase" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

