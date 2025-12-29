import { useEffect } from "react";
import gsap from "gsap";
import "./BrilloLaptop.css";

export default function BrilloLaptop() {
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3, yoyo: true });
    tl.to(".brillo-laptop", {
      x: "150%",
      opacity: 1,
      duration: 1.5,
      ease: "power2.inOut",
    });
  }, []);

  return <div className="brillo-laptop"></div>;
}
