import { useEffect } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";

export function viajeEspacial() {
  const location = useLocation();

  // Fade IN al entrar una nueva pantalla
  useEffect(() => {
    const container = document.querySelector(".contenedorR");
    if (!container) return;

    gsap.fromTo(
      container,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }
    );
  }, [location.pathname]);
}
