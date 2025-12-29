// LayoutTecnologias.jsx
import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import gsap from "gsap";

export default function LayoutTecnologias() {
  const contenedorR = useRef(null);

  useEffect(() => {
    function hide() {
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
  

  return (
    <div className="layout-tecnologias-full">
      <div className="layout-tecnologias-contenedor" ref={contenedorR}>
        <Outlet />
      </div>
    </div>
  );
}
