import { useEffect } from "react";

export default function CursorPrisma() {
  useEffect(() => {
    const cursor = document.getElementById("cursor-prisma");

    const moverCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const activarHover = () => cursor.classList.add("hover");
    const desactivarHover = () => cursor.classList.remove("hover");

    document.addEventListener("mousemove", moverCursor);

    const interactivos = document.querySelectorAll("a, button, [role='button']");
    interactivos.forEach((el) => {
      el.addEventListener("mouseenter", activarHover);
      el.addEventListener("mouseleave", desactivarHover);
    });

    return () => {
      document.removeEventListener("mousemove", moverCursor);
      interactivos.forEach((el) => {
        el.removeEventListener("mouseenter", activarHover);
        el.removeEventListener("mouseleave", desactivarHover);
      });
    };
  }, []);

  return (
    <div id="cursor-prisma">
      <svg
        viewBox="0 0 375 372"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible" // 👈 evita que se recorte el glow
        className="cursor-svg"
      >
        <path d="M188 38L61 271.5H77.3439L188 65V38Z" />
        <path d="M92 271.5L188 92.5L265.5 245.5V271.5H277H291.686L188 65L77.3439 271.5H92Z" />
        <path d="M249.543 245.5H206V271.5H265.5L249.543 245.5Z" />
        <path d="M265.5 271.5V245.5H249.543L265.5 271.5Z" />
        <path d="M206 245.5L188 271.5H206V245.5Z" />
        <path d="M277 302H307L291.686 271.5H277H265.5H206L188 302H277Z" />
        <path d="M188 271.5V302L206 271.5H188Z" />
        <path d="M307 271.5L188 38V65L291.686 271.5H307Z" />
        <path d="M307 302V271.5H291.686L307 302Z" />
        <path d="M188 92.5V121.5L249.543 245.5H265.5L188 92.5Z" />
        <path d="M188 92.5L92 271.5V302L188 121.5V92.5Z" />
        <path d="M61 302H92V271.5H77.3439L61 302Z" />
        <path d="M61 271.5V302L77.3439 271.5H61Z" />
      </svg>
    </div>
  );
}
