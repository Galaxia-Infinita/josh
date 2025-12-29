import { useEffect } from "react";
import { gsap } from "gsap";

export function useGsapButton() {
  useEffect(() => {
    const buttons = document.querySelectorAll(".boton-gsap");

    buttons.forEach((btn) => {
      const shapes = btn.querySelectorAll(".shape");

      btn.addEventListener("mouseenter", () => {
        shapes.forEach((shape) => {
          const x = gsap.utils.random(-40, 40);
          const y = gsap.utils.random(-60, -100);
          const s = gsap.utils.random(0.6, 1.4);
          const r = gsap.utils.random(-90, 90);

          gsap.fromTo(
            shape,
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
            },
            {
              x,
              y,
              scale: s,
              rotation: r,
              opacity: 0,
              duration: gsap.utils.random(0.8, 1.5),
              ease: "power2.out",
            }
          );
        });
      });
    });
  }, []);
}
