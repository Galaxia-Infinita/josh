// animInicio.jsx
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animacionInicio({ hoyo, circulo }) {
  const cleanups = [];

  // Animación 1
  cleanups.push(animHoyoYCirculo({ holeRef: hoyo, circleRef: circulo }));
  animarDescripcion(".left");

  return () => {
    cleanups.forEach(fn => fn && fn());
  };
}


function animHoyoYCirculo({ holeRef, circleRef }) {
  const hole = holeRef?.current;
  const circle = circleRef?.current;

  if (!hole || !circle) return;

  const tl = gsap.timeline();

  tl.fromTo(
    hole,
    { scale: 0, transformOrigin: "50% 50%" },
    { scale: 1, duration: 0.6, ease: "back.out(1.7)" }
  );

  tl.fromTo(
    circle,
    { y: -40, opacity: 1 },
    { y: 23, duration: 1.1, ease: "bounce.out" },
    ">-0.1"
  );

  tl.to(hole, {
    scaleX: 0,
    scaleY: 0.2,
    transformOrigin: "50% 50%",
    duration: 0.4,
    ease: "power2.inOut",
  });

  return () => tl.kill();
}

function animarEntradaLinks() {
  const items = document.querySelectorAll(".item a");
  if (!items.length) return;

  // Inicial: ocultos
  gsap.set(items, {
    opacity: 0,
    y: 60,
    pointerEvents: "none"
  });

  // Animación 100% controlada por GSAP
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.15,
    onComplete: () => {
      // habilitar hover/click recién aquí
      items.forEach(i => (i.style.pointerEvents = "auto"));
    }
  });
}

function animarDescripcion(selector, delay = 0) {
  const elemento = document.querySelector(selector);
  if (!elemento) return;

  gsap.set(elemento, { opacity: 0, y: 20 });

  gsap.to(elemento, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out",
    delay,
    onComplete: () => {
      animarEntradaLinks(); // ← ahora sin selector
    }
  });
}
