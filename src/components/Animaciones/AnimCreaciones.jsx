import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

export function animacionCreaciones({
    
  }) {
    // Aquí llamas la función global
    const cleanupBtn = setupButtonFillEffect(".crea-web-btn");
  
    // Puedes devolver la limpieza si deseas
    return () => {
      cleanupBtn && cleanupBtn();
    };
}

function setupButtonFillEffect(selector) {
    const buttons = document.querySelectorAll(selector);
    if (!buttons.length) return;
  
    buttons.forEach((btn) => {
      let circle = null;
  
      btn.style.position = btn.style.position || "relative";
      btn.style.overflow = "hidden";
      btn.style.zIndex = 0;
  
      const onMouseEnter = (e) => {
        const rect = btn.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const radius = Math.sqrt(width ** 2 + height ** 2) / 2 * 1.2;
  
        if (!circle) {
          circle = document.createElement("span");
          circle.classList.add("btn-fill-circle");
          btn.prepend(circle);
  
          Object.assign(circle.style, {
            position: "absolute",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#42e8ff",
            transform: "translate(-50%, -50%) scale(0)",
            pointerEvents: "none",
            zIndex: -1,
          });
        }
  
        gsap.killTweensOf(circle);
        gsap.killTweensOf(btn);
  
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
  
        gsap.to(circle, {
          scale: radius / 20,
          duration: 0.35,
          ease: "power2.out",
        });
  
        gsap.to(btn, { color: "#000", duration: 0.2 });
      };
  
      const onMouseMove = (e) => {
        if (!circle) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
  
        gsap.to(circle, {
          x: x - circle.offsetLeft,
          y: y - circle.offsetTop,
          duration: 0.2,
        });
      };
  
      const onMouseLeave = (e) => {
        if (!circle) return;
  
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
  
        gsap.killTweensOf(circle);
  
        gsap.to(circle, {
          x: x - circle.offsetLeft,
          y: y - circle.offsetTop,
          scale: 0,
          duration: 0.3,
          ease: "power2.in",
        });
  
        gsap.to(btn, { color: "#fff", duration: 0.2 });
      };
  
      btn.addEventListener("mouseenter", onMouseEnter);
      btn.addEventListener("mousemove", onMouseMove);
      btn.addEventListener("mouseleave", onMouseLeave);
    });
  }
  