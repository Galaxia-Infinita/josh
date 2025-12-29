import gsap from "gsap";


export function transitionFadeOut(callback) {
    gsap.to(".horizontal-scroll-container", {
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: callback,
    });
  }

  export function transitionFadeIn(onComplete) {
    gsap.fromTo(".horizontal-scroll-container",
      { opacity: 0, filter: "blur(10px)" },
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power2.out",
        onComplete
      }
    );
  }
  
  
  function transitionSlideDown(callback) {
    gsap.to(".container", {
      y: 80,
      opacity: 0,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: callback
    });
  }
  function transitionSlideUpIn() {
    gsap.from(".container", {
      y: 80,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  }
    

  function transitionShrink(callback) {
    gsap.to(".container", {
      opacity: 0,
      scale: 0.95,
      filter: "blur(8px)",
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: callback
    });
  }
  function transitionExpandIn() {
    gsap.from(".container", {
      opacity: 0,
      scale: 0.95,
      filter: "blur(8px)",
      duration: 0.6,
      ease: "power2.out",
    });
  }
    