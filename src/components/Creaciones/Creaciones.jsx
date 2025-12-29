import { useState, useRef, useEffect, useLayoutEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Inmobiliaria from "../../assets/images/p5.png";
import InmobiliariaV from "../../assets/videos/inmobiliaria.mp4";
import Taigo from "../../assets/images/p6.png";
import TaigoV from "../../assets/videos/taigo.mp4";
import T4g from "../../assets/images/p4.png";
import t4gV from "../../assets/videos/think4good.mp4";
import Qbify from "../../assets/images/p7.png";
import QbifyV from "../../assets/videos/qbify.mp4";
import TaigoApp from "../../assets/images/ap1.png";
import TaigoApp1 from "../../assets/images/ap1-1.png";
import TaigoApp2 from "../../assets/images/ap1-2.png";
import TaigoApp3 from "../../assets/images/ap1-3.png";
import TaigoApp4 from "../../assets/images/ap1-4.png";
import Diseno1 from "../../assets/images/dis1.png";
import Animacion1C from "../../assets/images/burbujaAnim.png";
import Animacion1V from "../../assets/videos/burbujaAnim.mp4";
import Animacion2C from "../../assets/images/cabeza3D.png";
import Animacion2V from "../../assets/videos/cabeza3D.mp4";
import "./Creaciones.css";

import {animacionCreaciones} from "../Animaciones/AnimCreaciones";

export default function Creaciones({ isReady }) {
  const [selected, setSelected] = useState("WEBS");
  const [showWebPopup, setShowWebPopup] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const contentRef = useRef(null);
  const verDemoBtnRef = useRef(null);

  const openVideo = (video) => {
    setActiveVideo(video);
    setShowWebPopup(true);
  };

  const navigate = useNavigate();

  function handleVolver() {
    navigate("/");
  }

  useEffect(() => {
    const cleanup = animacionCreaciones({ verDemoBtnRef });
    return cleanup;
  }, []);

  const handleChange = (item) => {
    if (item === selected) return;

    const el = contentRef.current;
    if (!el) return;

    gsap.killTweensOf(el);

    gsap.to(el, {
      autoAlpha: 0,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        el.scrollTop = 0;
        setSelected(item);
      }
    });
  };

  useLayoutEffect(() => {
    if (!isReady) return;

    const el = contentRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 1, clearProps: "transform" });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 0.5 }
      });

      tl.from(".crea-item", { y: 20, autoAlpha: 0, stagger: 0.08 })
        .from(".crea-title", { y: 15, autoAlpha: 0 }, "-=0.3")
        .from(".crea-desc", { y: 10, autoAlpha: 0 }, "-=0.3")
        .from(".crea-btn", { scale: 0.95, autoAlpha: 0 }, "-=0.3");
    }, el);

    return () => ctx.revert();
  }, [selected, isReady]);

  const data = {
    "WEBS": (
      <>
        <div className="crea-webs-wrapper">
          <div className="crea-web-card">
            <img src={Inmobiliaria} className="crea-web-img" />
            <div className="crea-web-info">
              <h3 className="crea-web-title">MONTENEGRO INMOBILIARIA</h3>
              <p className="crea-web-text">
                Landing page corporativa con enfoque visual, animaciones fluidas
                y navegación moderna.
              </p>
              <button
                className="crea-web-btn"
                onClick={() => openVideo(InmobiliariaV)}
              >
                Ver Demo
              </button>
            </div>
          </div>
        </div>
        <div className="crea-webs-wrapper">
          <div className="crea-web-card">
            <img src={Taigo} className="crea-web-img" />
            <div className="crea-web-info">
              <h3 className="crea-web-title">TAIGO CONTROL</h3>
              <p className="crea-web-text">
                Landing page corporativa con enfoque visual, animaciones fluidas
                y navegación moderna.
              </p>
              <button
                className="crea-web-btn"
                onClick={() => openVideo(TaigoV)}
              >
                Ver Demo
              </button>
            </div>
          </div>
        </div>
        <div className="crea-webs-wrapper3">
          <div className="crea-web-card">
            <img src={T4g} className="crea-web-img" />
            <div className="crea-web-info">
              <h3 className="crea-web-title">THING 4 GROUP</h3>
              <p className="crea-web-text">
                Landing page corporativa con enfoque visual, animaciones fluidas
                y navegación moderna.
              </p>
              <button
                className="crea-web-btn"
                onClick={() => openVideo(t4gV)}
              >
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </>
    ),
    
    "E-COMERCE": (
      <>
        <div className="crea-webs-wrapper2">
          <div className="crea-web-card">
            <img src={Qbify} className="crea-web-img" />
            <div className="crea-web-info">
              <h3 className="crea-web-title">QBIFY</h3>
              <p className="crea-web-text">
                Tienda online dinámica creada con WordPress y WooCommerce,
                enfocada en una experiencia de compra ágil.
              </p>
              <button
                className="crea-web-btn"
                onClick={() => openVideo(QbifyV)}
              >
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </>
    ),

    "APPS": (
      <>
        <div className="apps-wrapper">
          {/* IMAGEN DEL CELULAR */}
          <div className="apps-phone">
            <img
              src={TaigoApp}
              alt="Vista previa de la app"
              className="apps-phone-img"
            />
          </div>
    
          {/* CONTENEDOR DERECHO */}
          <div className="apps-right">
    
            {/* DESCRIPCIÓN */}
            <div className="apps-description">
              <h3 className="apps-title">TAIGO CONTROL</h3>
              <p className="apps-text">
              Plataforma móvil diseñada para registrar y gestionar la entrada y 
              salida del personal, optimizando el control de asistencia con un sistema 
              intuitivo, rápido y seguro.
              </p>
            </div>
    
            {/* CAPTURAS */}
            <div className="apps-screenshots">
              <img src={TaigoApp1} className="apps-shot" alt="captura 1" />
              <img src={TaigoApp2} className="apps-shot" alt="captura 2" />
              <img src={TaigoApp3} className="apps-shot" alt="captura 3" />
              <img src={TaigoApp4} className="apps-shot" alt="captura 4" />
            </div>
    
          </div>
        </div>
        {/* 
        <div className="apps-wrapper2">
          <div className="apps-phone">
            <img
              src={TaigoApp}
              alt="Vista previa de la app"
              className="apps-phone-img"
            />
          </div>
          <div className="apps-right">
            <div className="apps-description">
              <h3 className="apps-title">TAIGO CONTROL</h3>
              <p className="apps-text">
              Plataforma móvil diseñada para registrar y gestionar la entrada y 
              salida del personal, optimizando el control de asistencia con un sistema 
              intuitivo, rápido y seguro.
              </p>
            </div>
            <div className="apps-screenshots">
              <img src={TaigoApp1} className="apps-shot" alt="captura 1" />
              <img src={TaigoApp2} className="apps-shot" alt="captura 2" />
              <img src={TaigoApp3} className="apps-shot" alt="captura 3" />
              <img src={TaigoApp4} className="apps-shot" alt="captura 4" />
            </div>
          </div>
        </div>
        */}
      </>
    ),    

    "ANIMACIONES": (
      <>
        <div className="crea-webs-wrapper">
          <div className="crea-web-card">
            <img src={Animacion1C} className="crea-web-img" />
            <div className="crea-web-info">
              <h3 className="crea-web-title">BURBUJA METALIZADA</h3>
              <button
                className="crea-web-btn"
                onClick={() => openVideo(Animacion1V)}
              >
                Ver Demo
              </button>
            </div>
          </div>
        </div>
  
        <div className="crea-webs-wrapper3">
          <div className="crea-web-card">
            <img src={Animacion2C} className="crea-web-img" />
            <div className="crea-web-info">
              <h3 className="crea-web-title">CABEZA TEXTURIZADA 3D</h3>
              <button
                className="crea-web-btn"
                onClick={() => openVideo(Animacion2V)}
              >
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </>
    ),
    
    "DISEÑO VISUAL": (
      <>
        <div className="crea-webs-wrapper1">
          <div className="crea-web-card">
            <img src={Diseno1} alt="captura web" className="crea-web-img"/>
          </div>
        </div>
      </>
    ),
  };

  return (
    <div className="crea-wrapper">
      
      <button className="btn-volver3" onClick={handleVolver}>
        VOLVER
      </button>

      <div className="crea-frosted">
        <div className="crea-tabs">
          {Object.keys(data).map((item) => (
            <div
              key={item}
              className={`crea-tab ${selected === item ? "active" : ""}`}
              onClick={() => handleChange(item)}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="crea-content" ref={contentRef}>
          {data[selected]}
        </div>

        {showWebPopup && (
          <div
            className="crea-web-popup-overlay"
            onClick={() => {
              setShowWebPopup(false);
              setActiveVideo(null);
            }}
          >
            <div
              className="crea-web-popup"
              onClick={(e) => e.stopPropagation()}
            >
              {activeVideo && (
                <video
                  className="crea-web-video"
                  src={activeVideo}
                  autoPlay
                  controls
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}