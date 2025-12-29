import { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./Experiencia.css";
import Mondria from "../../assets/images/p1.png";
import Concreto from "../../assets/images/p2.png";
import Tevi from "../../assets/images/p3.png";
import AnimE1 from "../../assets/images/animE1.png";
import AnimE2 from "../../assets/images/animE2.png";
import AnimE3 from "../../assets/images/animE3.png";

export default function Experiencia({ isReady }) {
  const [selected, setSelected] = useState("MONDRIA DIGITAL");
  const contentRef = useRef(null);

  const handleChange = (empresa) => {
    if (empresa === selected) return;

    const el = contentRef.current;
    if (!el) return;

    gsap.killTweensOf(el); 
    gsap.to(el, {
      autoAlpha: 0,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        el.scrollTop = 0;
        setSelected(empresa);
      }
    });
  };

  const navigate = useNavigate();

  function handleVolver() {
    navigate("/");
  }

  useLayoutEffect(() => {
    if (!isReady) return;
    const el = contentRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 1, clearProps: "transform" });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 0.5 }
      });

      tl.from(".empresa1", { y: 20, autoAlpha: 0 })
        .from(".exp-data-titulo", { y: 15, autoAlpha: 0 }, "-=0.3")
        .from(
          ".exp-descr1, .exp-descr2, .exp-descr3",
          { y: 10, autoAlpha: 0, stagger: 0.08 },
          "-=0.3"
        )
        .from(".exp-data-subtitulo", { y: 10, autoAlpha: 0 }, "-=0.3")
        .from(".exp-list li", { x: -10, autoAlpha: 0, stagger: 0.06 }, "-=0.3")
        .from(".exp-aportes-img", { scale: 0.95, autoAlpha: 0 }, "-=0.4")
        .from(".expEmpresa1Link", { autoAlpha: 0 }, "-=0.3");
    }, el);

    return () => ctx.revert();
  }, [selected, isReady]);

  const data = {
    "MONDRIA DIGITAL": (
      <div>
        <img src={Mondria} alt="Proyecto 1" className="empresa1"/>
        <h2 className="exp-data-titulo">
          MONDRIA DIGITAL
          <span className="exp-arrow"></span>
        </h2>
        <p className="exp-descr1">
          MONDRIA DIGITAL es una agencia especializada en construir y potenciar 
          marcas a través de estrategias creativas, innovación tecnológica y soluciones 
          digitales orientadas a resultados. En su enfoque integral combinan marketing, 
          diseño y desarrollo para ayudar a empresas a mejorar su presencia online, conectar 
          con su audiencia y escalar sus capacidades digitales.
        </p>
        <h3 className="exp-data-subtitulo">Aportes:</h3>
        <div className="exp-aportes-container">
          <ul className="exp-list">
            <li>Diseñé y desarrollé la página web completa de la agencia.</li>
            <li>Creé mockups profesionales en Photoshop para contenido visual.</li>
            <li>Realicé animaciones web 2D y 3D para secciones y elementos interactivos.</li>
            <li>Participé en la creación de contenido para la página institucional.</li>
            <li>Colaboré en la producción de reels y piezas audiovisuales para redes sociales.</li>
          </ul>
          <img src={AnimE1} alt="Aportes Mondria" className="exp-aportes-img"/>
        </div>
        <a href="https://www.mondriadigital.pe/" className="expEmpresa1Link">https://www.mondriadigital.pe</a>
      </div>
    ),
    "CONCRETO": (
      <div>
        <img src={Concreto} alt="Proyecto 1" className="empresa1"/>
        <h2 className="exp-data-titulo">
          CONCRETO
          <span className="exp-arrow"></span>
        </h2>
        <p className="exp-descr1">
          CONCRETO es una empresa especializada en el desarrollo y ejecución de proyectos 
          de construcción con un enfoque sólido, eficiente y orientado a resultados. 
          Su trabajo integra diseño, ingeniería y gestión para entregar espacios 
          funcionales, modernos y de alto estándar.
        </p>
        <p className="exp-descr2">
          Ofrecen soluciones completas para el sector retail y comercial, abarcando desde
          el diseño inicial hasta la entrega final de cada proyecto. Su experiencia 
          incluye remodelaciones de locales, construcción integral de espacios comerciales, 
          acondicionamiento y mantenimiento, así como la implementación y supervisión 
          especializada de obras, asegurando precisión, cumplimiento de plazos y altos 
          niveles de calidad.
        </p>
        <h3 className="exp-data-subtitulo">Aportes:</h3>
        <div className="exp-aportes-container">
          <ul className="exp-list">
            <li>Diseñé la pagina web empresarial.</li>
            <li>Creé mockups profesionales en Photoshop para contenido visual.</li>
            <li>Realicé animaciones web 2D y 3D para secciones y elementos interactivos.</li>
            <li>Realizacion de brochure de contenido textual y gráfico de la web</li>
            <li>Colaboré en la producción de reels y piezas audiovisuales para redes sociales.</li>
          </ul>
          <img src={AnimE2} alt="Aportes Mondria" className="exp-aportes-img"/>
        </div>
        <a href="https://concreto.com.pe/" className="expEmpresa1Link">https://concreto.com.pe</a>
      </div>
    ),
    "TEVI PERÚ": (
      <div>
        <img src={Tevi} alt="Proyecto 1" className="empresa1"/>
        <h2 className="exp-data-titulo">
          TEVI PERÚ
          <span className="exp-arrow"></span>
        </h2>
        <p className="exp-descr1">
          TEVI es una empresa especializada en soluciones integrales de seguridad contra 
          incendios y protección industrial. Su misión es garantizar entornos seguros y 
          operativos mediante servicios profesionales, certificados y orientados a la prevención.
        </p>
        <p className="exp-descr2">
          La empresa ofrece venta y recarga de extintores, así como instalación y mantenimiento de 
          alarmas contra incendios, asegurando infraestructura de respuesta inmediata y confiable. 
          Además, brindan capacitaciones y formación de brigadas, potenciando la preparación del 
          personal ante emergencias.
        </p>
        <p className="exp-descr3">
          TEVI también complementa su portafolio con venta de gabinetes y pedestales, instalación 
          y mantenimiento de pozo a tierra, y fumigaciones integrales, posicionándose como un 
          aliado completo en seguridad, protección y saneamiento para empresas e instituciones.
        </p>
        <h3 className="exp-data-subtitulo">Aportes:</h3>
        <div className="exp-aportes-container">
          <ul className="exp-list">
            <li>Diseñé y desarrollé la página web completa de la agencia.</li>
            <li>Creé mockups profesionales en Photoshop para contenido visual.</li>
            <li>Realicé animaciones web 2D y 3D para secciones y elementos interactivos.</li>
            <li>Participé en la creación de contenido para la página institucional.</li>
            <li>Colaboré en la producción de reels y piezas audiovisuales para redes sociales.</li>
          </ul>
          <img src={AnimE3} alt="Aportes Mondria" className="exp-aportes-img"/>
        </div>
        <a href="https://teviperu.com/" className="expEmpresa1Link">https://teviperu.com</a>
      </div>
    ),
  };

  return (
    <div className="exp-mi-wrapper">

      <button className="btn-volver2" onClick={handleVolver}>
        VOLVER
      </button>

      <div className="exp-mi-frosted">
        <div className="exp-mi-tabs">
          {Object.keys(data).map((empresa) => (
            <div
              key={empresa}
              data-empresa={empresa}
              className={`exp-tab ${selected === empresa ? "active" : ""}`}
              onClick={() => handleChange(empresa)}
            >
              {empresa}
            </div>
          ))}
        </div>
        <div className="exp-mi-content" ref={contentRef}>
          {data[selected]}
        </div>
      </div>
    </div>
  );
}
