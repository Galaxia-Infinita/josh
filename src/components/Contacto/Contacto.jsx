import { useEffect, useRef, useLayoutEffect } from "react";
import { animacionContacto } from "../Animaciones/AnimContacto";
import { Linkedin, Instagram, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Contacto.css";
import { gsap } from "gsap";
// import Circle from "../../assets/logos/circulo.svg";
// import Hole from "../../assets/logos/hoyo.svg";
// import TazaSVG from "../../assets/logos/taza.svg?react";
// import LaptopSVG from "../../assets/logos/laptop.svg?react";
// import CerebroSVG from "../../assets/logos/cerebro.svg?react";
// import GamerSVG from "../../assets/logos/gamer.svg?react";
// import Java from "../../assets/logos/tazaRellenada.svg?react";
// import Python from "../../assets/logos/pythonRellenado.svg?react";
// import Csharp from "../../assets/logos/cShartRellenado.svg?react";
// import React from "../../assets/logos/reactRellenado.svg?react";
// import Php from "../../assets/logos/phpRellenado.svg?react";
// import P1 from "../../assets/images/p1.png";

// export default function Contacto() {
//   const horizontalSectionRef = useRef(null);
//   const panelsContainerRef = useRef(null);
//   const tituloRef = useRef(null);
//   const holeRef = useRef(null);
//   const circleRef = useRef(null);
//   const holeWrapperRef = useRef(null);
//   const tazaRef = useRef(null);
//   const laptopRef = useRef(null);
//   const cerebroRef = useRef(null);
//   const carcasaRef = useRef(null);
//   const panel4TitleRef = useRef(null);
//   const nextTitleRef = useRef(null);  
//   const btnRef = useRef(null);

//   useEffect(() => {
//     // Scroll horizontal
//     const cleanup = animacionContacto({
//       horizontalSectionRef,
//       panelsContainerRef,
//       tituloRef,
//       holeRef,
//       circleRef,
//       tazaRef,
//       laptopRef,
//       cerebroRef,
//       panel4TitleRef,
//       nextTitleRef,
//       carcasaRef,
//       btnRef,
//     });

//     return () => cleanup && cleanup();
//   }, []);
  

//   return (
//     <div className="scroll-wrapper">
//       <section className="horizontal-section" ref={horizontalSectionRef}>
//         <div className="eq-bg"></div>
//         <div className="panels-container" ref={panelsContainerRef}>
//           <div className="panel panel-1">
//             <div className="inicio-hero">
//               <h1 className="inicio-titulo" ref={tituloRef}>
//                 J
//                 <span className="highlight-wrapper">
//                   <span ref={holeWrapperRef} className="hole-wrapper">
//                     <img ref={holeRef} src={Hole} alt="hoyo" className="hole-img" />
//                     <img ref={circleRef} src={Circle} alt="circulo" className="circle-img" />
//                   </span>
//                 </span>
//                 P
//                 <br />
//                 &lt;/DESARROLLA<br />
//                 PROGRAMA<br />
//                 CREA&gt;
//               </h1>
//             </div>
//           </div>
//           <div className="coffee-svg" ref={tazaRef}>
//             <TazaSVG />
//           </div>
//           <div className="panel panel-2">
//             <div className="inicio-sobre-mi1">
//               <h2 className="sobre-titulo1">&lt;/SOBRE MÍ&gt;</h2>
//               <p className="sobre-descripcion1">
//                 Desarrollador web y programador Java, siempre en busca de nuevos desafíos.
//               </p>
//               <div className="boton-gsap-wrapper">
//                 <button className="boton-gsap">
//                   <span className="boton-texto">VER MÁS</span>
//                   <div className="cont-particulas">
//                     <svg className="flecha-circular" width="26" height="26" viewBox="0 0 28 28">
//                       <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
//                       <path d="M12 10 L18 14 L12 18" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   </div>
//                   <div className="boton-shapes">
//                     <span className="shape"><Java /></span>
//                     <span className="shape"><Python /></span>
//                     <span className="shape"><Csharp /></span>
//                     <span className="shape"><React /></span>
//                     <span className="shape"><Php /></span>
//                   </div>
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="laptop-svg" ref={laptopRef}>
//             <LaptopSVG/>
//           </div>
//           <div className="panel panel-3">
//             <div className="inicio-experiencia2">{/*falta crear su animacion ya que no permite reutilizar ref*/}
//               <h2 className="exp-titulo2">&lt;/EXPERIENCIA&gt;</h2>
//               <p className="exp-descripcion2">
//                 Mondria Digital: 2011-2025 Desarrollo de página empresarial y E-Comerce Qbify(marca).
//               </p>
//               <div className="boton-gsap-wrapper">
//                   <button className="boton-gsap">
//                     <span className="boton-texto">VER MÁS</span>
//                     <div className="cont-particulas">
//                       <svg className="flecha-circular" width="26" height="26" viewBox="0 0 28 28">
//                         <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
//                         <path d="M12 10 L18 14 L12 18" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </div>
//                     <div className="boton-shapes">
//                       <span className="shape"><Java /></span>
//                       <span className="shape"><Python /></span>
//                       <span className="shape"><Csharp /></span>
//                       <span className="shape"><React /></span>
//                       <span className="shape"><Php /></span>
//                     </div>
//                   </button>
//                 </div>
//             </div>
//           </div>
//           <div className="cerebro-svg" ref={cerebroRef}>
//             <CerebroSVG />
//           </div>
//           <div className="panel panel-4">
//             <div className="inicio-cereb1">
//               <h2 ref={panel4TitleRef} className="cereb-titulo1">&lt;/PROYECTOS&gt;</h2>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="vertical-section">
//         <div className="proyectos-contenido1">
//           <h2 ref={nextTitleRef} className="proyectos-titulo1"></h2>
//           <div className="gameboy-wrapper1">
//             <GamerSVG ref={carcasaRef}/>
//             <div className="contenido-central"> {/* Contenedor que centra los elementos */}
//               <div className="pantalla-img">
//                 <img src={P1} alt="P1" />
//                 <div className="haz-diagonal"></div>
//               </div>

//               <div className="empresa-nombre">MONDRIA DIGITAL</div>

//               <button ref={btnRef} className="btn-ver-mas">
//                 <span className="btn-text">VER MÁS</span>
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="contacto-contenido">
//           <h2 className="contacto-titulo1">&lt;/CONTACTO&gt;</h2>
//           <div className="contacto-info">
//             <p className="contacto-descripcion">
//             ¿Buscas un sitio web profesional que refleje tu marca y 
//             ofrezca una experiencia clara al cliente? Contáctame.
//             </p>
//             <a href="mailto:josuepariona01@gmail.com" className="contacto-correo">
//               josuepariona01@gmail.com
//             </a>
//             <div className="contacto-redes bottom">
//               <div class="icon-wrap">
//                 <a href="https://linkedin.com" target="_blank" rel="noreferrer">
//                     <Linkedin />
//                   </a>
//               </div>
//               <div className="icon-wrap">
//                 <a href="https://instagram.com" target="_blank" rel="noreferrer">
//                   <Instagram/>
//                 </a>
//               </div>
//               <div className="icon-wrap">
//                 <a href="https://github.com" target="_blank" rel="noreferrer">
//                   <Github/>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }

export default function Contacto({ isReady }) {
  const containerRef = useRef(null);

  const navigate = useNavigate();

  function handleVolver() {
    navigate("/");
  }

  useLayoutEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power2.out",
          duration: 0.6
        }
      });

      tl.from(".contacto-titulo1", {y: 20, autoAlpha: 0
      })
        .from(".contacto-descripcion",
          {
            y: 15, autoAlpha: 0
          },
          "-=0.35"
        )
        .from(".contacto-correo",
          {
            y: 10, autoAlpha: 0
          },
          "-=0.35"
        );
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <div className="exp-mi-wrapper2">

      <button className="btn-volver4" onClick={handleVolver}>
        VOLVER
      </button>

      <div className="exp-mi-frosted2" ref={containerRef}>
        <div className="contacto-contenido">
          <h2 className="contacto-titulo1">CONTACTO</h2>

          <div className="contacto-info">
            <p className="contacto-descripcion">
              ¿Buscas un sitio web profesional que refleje tu marca y
              ofrezca una experiencia clara al cliente? Contáctame.
            </p>

            <a
              href="mailto:josuepariona01@gmail.com"
              className="contacto-correo"
            >
              josuepariona01@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}