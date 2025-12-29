import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export default function Inicio({loaderFinished }) {
  useEffect(() => {
    window.dispatchEvent(new Event("reset-zoom"));
  }, []); 
  
  useEffect(() => {
    if (!loaderFinished) return;

    const items = document.querySelectorAll(".item a");
    gsap.set(items, { opacity: 0, y: 60 });
    gsap.to(items, {opacity: 1,y: 0,duration: 1,ease: "power2.out",stagger: 0.15,});

  }, [loaderFinished]); 

  return (
    <>
      <h1 className="item">
      <Link 
        to="/sobre-mi"
        onClick={() => {
          window.dispatchEvent(new Event("contenedor-hide"));
          window.dispatchEvent(new Event("zoom-merc"));
        }}
      >
        SOBRE MI
      </Link>
      </h1>
      <h1 className="item">
      <Link 
        to="/experiencia"
        onClick={() => {
          window.dispatchEvent(new Event("contenedor-hide"));
          window.dispatchEvent(new Event("zoom-venus"));
        }}
      >
        PROYECTOS
      </Link>
      </h1>
      <h1 className="item">
      <Link 
        to="/creaciones"
        onClick={() => {
          window.dispatchEvent(new Event("contenedor-hide"));
          window.dispatchEvent(new Event("zoom-earth"));
        }}
      >
        CREACIONES
      </Link>
      </h1>
      <h1 className="item">
      <Link 
        to="/contacto"
        onClick={() => {
          window.dispatchEvent(new Event("contenedor-hide"));
          window.dispatchEvent(new Event("zoom-mars"));
        }}
      >
        CONTACTO
      </Link>
      </h1>
    </>
  );
}
