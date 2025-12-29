import { useEffect, useRef } from "react"; 
import { useLocation, Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./Inicio.css";
import { animacionInicio } from "../Animaciones/AnimInicio";
import Circle from "../../assets/logos/circulo.svg";
import Hole from "../../assets/logos/hoyo.svg";
import gsap from "gsap";

export default function LayoutInicio() {
  const circulo = useRef(null);
  const hoyo = useRef(null);
  const containerRef = useRef(null);
  const contenedorR = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";
  const isMobile = window.innerWidth <= 768;
  
  useEffect(() => {
    function hide() {
      gsap.set(contenedorR.current, {
        opacity: 0,
      });

      gsap.to(contenedorR.current, {
        opacity: 0,
        duration: 0.2
      });
    }

    function show() {
      gsap.fromTo(
        contenedorR.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }

    window.addEventListener("contenedor-hide", hide);
    window.addEventListener("contenedor-show", show);

    return () => {
      window.removeEventListener("contenedor-hide", hide);
      window.removeEventListener("contenedor-show", show);
    };
  }, []);

  useEffect(() => {
    let cleanupFn = animacionInicio({ circulo, hoyo });
    if (containerRef.current) containerRef.current.style.pointerEvents = "auto";

    return () => cleanupFn && cleanupFn();
  }, []);

  return (
    <div className="horizontal-scroll-container" ref={containerRef}>
      <div className={`container ${isHome ? "home-layout" : ""}`}>

        <div className="left">
          <h1 className="title-main">
            J
            <span className="highlight-wrapper1">
              <span className="hole-wrapper1">
                <img ref={hoyo} src={Hole} alt="hoyo" className="hole-img1" />
                <img ref={circulo} src={Circle} alt="circulo" className="circle-img1" />
              </span>
            </span>
            P
          </h1>
          <hr className="separador" />
          {isHome && (
            <h2 className="subtitle-main">
              Programador Fullstack / Motion Graphics<br />
              Actualmente trabajo como freelance. <br />
              Conoce las{" "}
              <Link
                to="/tecnologias"
                className="highlight"
                onClick={() => {
                  window.dispatchEvent(new Event("contenedor-hide"));
                  window.dispatchEvent(new Event("zoom-satellite"));
                }}
              >
                tecnologías
              </Link>{" "}
              que manejo.
            </h2>
          )}
        </div>
        <div className="right">
          <div className="contenedorR" ref={contenedorR}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
