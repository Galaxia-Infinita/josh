import "./SobreMi.css";
import Avatar from "../../assets/images/Avatar.png";
import Idat from "../../assets/images/logoIdat.png";
import Utp from "../../assets/images/logoUTP.png";
import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

export default function SobreMi({ isReady }) {
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
  
      tl.from(".sobre-mi-titulo", { y: 20, autoAlpha: 0 })
      .from(".sobre-mi-avatar", { scale: 0.9, autoAlpha: 0 }, "-=0.3")
      .from(".sobre-mi-textos p", { y: 10, autoAlpha: 0 }, "-=0.3")
      .from(".vinetas-personalizadas li", { x: -10, autoAlpha: 0, stagger: 0.06 }, "-=0.3")
      .from(".logo-item", { y: 10, autoAlpha: 0, stagger: 0.1 }, "-=0.4");
    
    }, root);
  
    return () => ctx.revert();
  }, [isReady]);
  
  return (
    <div className="sobre-mi-wrapper" ref={root}>

      <button className="btn-volver1" onClick={handleVolver}>
        VOLVER
      </button>

      <div className="sobre-mi-frosted">
        <div className="sobre-mi-content">
          <h2 className="sobre-mi-titulo">SOBRE MI</h2>
          <div className="sobre-mi-row">
            <img src={Avatar} alt="avatar" className="sobre-mi-avatar"/>
            <div className="sobre-mi-textos">
              <p>
                Soy un desarrollador front-end creativo apasionado por construir experiencias web 
                inmersivas e interactivas. Me encanta combinar tecnología, diseño y movimiento 
                para crear interfaces que sorprenden y cuentan historias.
              </p>

              <div className="sobre-mi-datos-row">

              {/* COLUMNA IZQUIERDA */}
              <div className="sobre-mi-info">
                <p><strong>Edad:</strong> 26 años</p>
                <p><strong>Ciudad:</strong> Ate, Lima</p>
                
                <p><strong>Pasatiempos:</strong></p>
                <ul className="vinetas-personalizadas">
                  <li>Crear animaciones web 2D o 3D</li>
                  <li>Ver animes de moda o reacciones</li>
                  <li>Jugar juegos online o de moda</li>
                </ul>
              </div>

              {/* COLUMNA DERECHA (LOGOS) */}
              <div className="sobre-mi-logos">
                <img src={Idat} alt="IDAT" className="logo-item" />
                <img src={Utp} alt="UTP" className="logo-item" />
              </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
