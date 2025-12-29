import { useEffect } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export default function PrismaAnimado() {
  useEffect(() => {
    gsap.to("#punto-luz", {
      duration: 6,
      repeat: -1,
      ease: "none",
      motionPath: {
        path: "#cara-superior",
        align: "#cara-superior",
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
      },
    });
  }, []);

  return (
    <svg
      viewBox="0 0 300 372"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      overflow="visible"
      preserveAspectRatio="xMidYMid meet" // 👈 importante
      className="prisma-svg" // 👈 para estilizar desde CSS
    >
      {/* Prisma base */}
      <path
        d="M61 271.5C110.597 180.313 138.403 129.187 188 38C234.472 129.187 260.528 180.313 307 271.5M61 271.5V302H92M61 271.5H92M307 271.5V302H277H188V271.5M307 271.5H188M188 92.5V121.5M188 92.5L92 271.5M188 92.5L265.5 245.5H249.543M92 271.5V302M92 302L188 121.5M188 121.5L249.543 245.5M188 271.5L206 245.5H249.543"
        stroke="#3CE0C3"
        opacity="0.25"
      />

      {/* Cara superior */}
      <path
        id="cara-superior"
        d="M188 38L61 271.5H91.5L188 92.5L265.5 245.5H205.5L188 271.5H307L188 38Z"
        stroke="#3CE0C3"
        strokeWidth="1.5"
      />

      {/* Punto brillante */}
      <circle
        id="punto-luz"
        r="9"
        fill="#3CE0C3"
        filter="blur(4px) drop-shadow(0 0 12px #3CE0C3) drop-shadow(0 0 30px #3CE0C3) drop-shadow(0 0 60px #3CE0C3)"
      />
    </svg>
  );
}
