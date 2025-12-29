import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

export function animacionContacto({
  horizontalSectionRef,
  panelsContainerRef,
  tituloRef,
  holeRef,
  circleRef,
  tazaRef,
  laptopRef,
  cerebroRef,
  carcasaRef,
  panel4TitleRef,
  nextTitleRef,
  btnRef,
}) {
  const horizontalSection = horizontalSectionRef.current;
  const panelsContainer = panelsContainerRef.current;

  if (!horizontalSection || !panelsContainer) return;

  const panels = gsap.utils.toArray(".panel");
  const headerWidth = window.innerWidth * 0.03;
  const visibleWidth = window.innerWidth - headerWidth;
  const totalPanels = panels.length;
  const scrollLength = (totalPanels - 1) * visibleWidth;

  // 🔹 Scroll horizontal
  const horizontalTl = gsap.timeline({
    scrollTrigger: {
      trigger: horizontalSection,
      start: "top top",
      end: `+=${scrollLength}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  horizontalTl.to(panelsContainer, {
    x: () => -scrollLength,
    ease: "none",
  });

  // 🔹 Animación automática del título (independiente del scroll)
  if (tituloRef?.current) {
    document.fonts.ready.then(() => {
      const split = new SplitText(tituloRef.current, { type: "lines" });
      const tl = gsap.timeline();

      tl.from(split.lines, {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2,
      });

      if (holeRef?.current) {
        tl.fromTo(
          holeRef.current,
          { scale: 0, transformOrigin: "50% 50%" },
          { scale: 1, duration: 0.6, ease: "back.out(1.7)" },
          "<+0.4"
        );
      }

      if (circleRef?.current) {
        tl.fromTo(
          circleRef.current,
          { y: -87, opacity: 1 },
          { y: 50, duration: 1.1, ease: "bounce.out" },
          ">-0.1"
        );
      }

      if (holeRef?.current) {
        tl.to(holeRef.current, {
          scaleX: 0,
          scaleY: 0.2,
          transformOrigin: "50% 50%",
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    });
  }

  // 🔹 Animación del SVG (independiente del panel 1)
  animCircularFillSVG({
    svgRef: tazaRef,
    containerAnimation: horizontalTl,
    duration: 1,
    start: "left 60%", // animar al ver la mitad derecha
  });
  
  animCircularFillSVG({
    svgRef: laptopRef,
    containerAnimation: horizontalTl,
    duration: 1,
    start: "left 60%",
  });
  
  animCircularFillSVG({
    svgRef: cerebroRef,
    containerAnimation: horizontalTl,
    duration: 1,
    start: "left 60%",
  });

  // 🔹 Animación de partículas en el botón
  const botones = document.querySelectorAll(".boton-gsap");
  const limpiadores = [];
  
  botones.forEach(boton => {
    limpiadores.push(animarBotonGSAP(boton));
  });
  
  // 🔹 Animación de titulo y descripcion
  animarTituloYDescripcionEnPanel({
    panel: ".panel-2",
    titulo: ".sobre-titulo1",
    descripcion: ".sobre-descripcion1",
    horizontalTl,
  });

  animarTituloYDescripcionEnPanel({
    panel: ".panel-3",
    titulo: ".exp-titulo2",
    descripcion: ".exp-descripcion2",
    horizontalTl,
  });

  animTituloEtiqueta({
    element: ".cereb-titulo1",
    trigger: ".panel-4",
    containerAnimation: horizontalTl,
    start: "left 70%",
    onComplete: () => {
      animTituloPuente({    
        panel4TitleRef,
        nextTitleRef,
        horizontalSectionRef
      });
    }
  });

  animarTituloYDescripcionEnPanel({
    panel: ".contacto-contenido",
    titulo: ".contacto-titulo1",
    descripcion: ".contacto-descripcion",
    start: "top 50%",
  });

  animLineaCompleta(".contacto-correo", 0.8, 50, () => {
    animRedesEscala(".contacto-redes.bottom .icon-wrap", 0.15, 0.6, 3);
  });

  animCarcasa({
    svgRef: carcasaRef, btnRef,
    duration: 1,
  });

  
  ScrollTrigger.refresh();

  // 🔹 Cleanup: remueve listeners y ScrollTriggers al desmontar
  return () => {
    limpiadores.forEach(fn => fn && fn());
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}

/************************ FUNCIONES AUXILIARES *********************/
/* animacion controlada de titulos y descripciones de cada panel */
function animTituloEtiqueta({
  element,
  trigger = null,
  containerAnimation = null,
  start = "start center",
  onComplete = null,
}) {
  // Normalizar el elemento
  let el = null;

  if (typeof element === "string") {
    el = document.querySelector(element);
  } else if (element instanceof HTMLElement) {
    el = element;
  } else if (element?.current instanceof HTMLElement) {
    el = element.current;
  }

  if (!el) return;

  // Preparar texto
  const fullText = el.textContent.trim();
  const innerText = fullText.replace(/[<\/>]/g, "").trim();

  const letters = innerText
    .split("")
    .map((char) => `<span class="titulo-letra1">${char}</span>`)
    .join("");

  el.innerHTML = `
    <span class="titulo-tag1">&lt;/</span>
    <span class="titulo-text1">${letters}</span>
    <span class="titulo-tag1 right">&gt;</span>
  `;

  const textSpan = el.querySelector(".titulo-text1");
  const lettersEls = el.querySelectorAll(".titulo-letra1");
  const rightTag = el.querySelector(".titulo-tag1.right");

  gsap.set(lettersEls, { opacity: 0 });
  gsap.set(textSpan, { width: 0, overflow: "hidden", display: "inline-block" });
  gsap.set(rightTag, { marginLeft: 0 });

  // Crear timeline
  const tl = gsap.timeline({
    paused: true,       // 🔥 muy importante: evita que ScrollTrigger lo "pierda"
    onComplete,
  });

  // Animación
  tl.to(textSpan, {
    width: "auto",
    duration: 1.2,
    ease: "power2.inOut",
    onUpdate: () => {
      const currentWidth = textSpan.offsetWidth;
      gsap.set(rightTag, { marginLeft: currentWidth * 0.02 + "px" });
    },
  });

  tl.to(
    lettersEls,
    {
      opacity: 1,
      stagger: 0.05,
      ease: "power2.out",
      duration: 0.4,
    },
    "<+0.1"
  );

  // Crear ScrollTrigger
  if (trigger) {
    const st = ScrollTrigger.create({
      trigger,
      containerAnimation,
      start,
      once: true,
      toggleActions: "play none none none",
      anticipatePin: 1.2,            // 🔥 suaviza scrolls rápidos
      fastScrollEnd: true,           // 🔥 compensa scroll MUY acelerado
      invalidateOnRefresh: true,     // recalcula siempre
      immediateRender: false,
      onEnter: () => tl.play(),      // 🔥 si entra desde arriba
      onEnterBack: () => tl.play(),  // por si viene desde abajo
    });

    // 🔥 Si el usuario YA PASÓ el trigger mientras cargaba la página
    if (st.progress > 0) {
      tl.play(0);
    }
  } else {
    tl.play();
  }

  return tl;
}

function animDescripcion({
  element,
  trigger = null,
  start = "top center",
  stagger = 0.02,
  containerAnimation = null
}) {
  // Normalizar selector / DOM / ref
  let el = null;

  if (typeof element === "string") {
    el = document.querySelector(element);
  } else if (element instanceof HTMLElement) {
    el = element;
  } else if (element?.current instanceof HTMLElement) {
    el = element.current;
  }

  if (!el) return;

  // Preparar texto
  const text = el.textContent.trim();
  el.textContent = "";

  text.split(" ").forEach(word => {
    const wordSpan = document.createElement("span");
    wordSpan.style.display = "inline-block";
    wordSpan.style.whiteSpace = "nowrap";

    word.split("").forEach(char => {
      const charSpan = document.createElement("span");
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
    });

    el.appendChild(wordSpan);
    el.appendChild(document.createTextNode(" "));
  });

  const chars = el.querySelectorAll("span span");

  gsap.set([el, chars], { opacity: 0, y: 20 });

  // Timeline pausada para evitar que ScrollTrigger la pierda
  const tl = gsap.timeline({
    paused: true
  });

  tl.to(el, { opacity: 1, duration: 0.2 });

  tl.to(chars, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger
  });

  // Si hay trigger → aplicar ScrollTrigger
  if (trigger) {
    const st = ScrollTrigger.create({
      trigger,
      containerAnimation,
      start,
      once: true,
      toggleActions: "play none none none",
      anticipatePin: 1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      immediateRender: false,
      onEnter: () => tl.play(),
      onEnterBack: () => tl.play()
    });

    // Fallback si ya pasó el trigger antes de cargar
    if (st.progress > 0) {
      tl.play(0);
    }
  } else {
    tl.play();
  }

  return tl;
}

function animarTituloYDescripcionEnPanel({
  panel,
  titulo,
  descripcion,
  horizontalTl
}) {
  const panelEl = document.querySelector(panel);
  if (!panelEl) return;

  const tituloEl = panelEl.querySelector(titulo);
  const descripcionEl = panelEl.querySelector(descripcion);

  if (!tituloEl || !descripcionEl) return;

  // Timelines hijos sin ScrollTrigger
  const tlTitulo = animTituloEtiqueta({
    element: tituloEl,
    trigger: null,
    containerAnimation: null,
  });

  const tlDescripcion = animDescripcion({
    element: descripcionEl,
    trigger: null,
    containerAnimation: null,
    stagger: 0.02,
  });

  const durTitulo = tlTitulo?.duration?.() ?? 0.8;
  const offset = durTitulo * 0.5;

  // Timeline maestro
  const tlMaster = gsap.timeline({
    scrollTrigger: {
      trigger: panelEl,
      containerAnimation: horizontalTl,
      start: "left 50%",
      toggleActions: "play none none none",
      once: true,
    },
  });

  tlMaster.add(tlTitulo, 0);
  tlMaster.add(tlDescripcion, offset);
}

/* animacion circular para cualquier svg */
function animCircularFillSVG({
  svgRef,
  containerAnimation = null,
  duration = 1.2,
  delay = 0,
  start = "left 60%", // cuándo se dispara la animación
}) {
  if (!svgRef?.current) return;

  const svgEl = svgRef.current.querySelector("svg") || svgRef.current;
  if (!svgEl) return;

  const svgNS = "http://www.w3.org/2000/svg";

  // === Obtener dimensiones del SVG ===
  const vb = svgEl.viewBox.baseVal;
  const width = vb.width || svgEl.clientWidth;
  const height = vb.height || svgEl.clientHeight;

  // === Crear defs y clipPath ===
  const defs =
    svgEl.querySelector("defs") ||
    (() => {
      const d = document.createElementNS(svgNS, "defs");
      svgEl.insertBefore(d, svgEl.firstChild);
      return d;
    })();

  const clipId = `clip-${crypto.randomUUID().slice(0, 8)}`;
  const clipPath = document.createElementNS(svgNS, "clipPath");
  clipPath.setAttribute("id", clipId);

  // === Crear círculo inicial (r = 0) para relleno circular ===
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", width / 2);
  circle.setAttribute("cy", height / 2);
  circle.setAttribute("r", 0);
  clipPath.appendChild(circle);
  defs.appendChild(clipPath);

  // === Grupo de relleno con clipPath circular ===
  const fillGroup = document.createElementNS(svgNS, "g");
  fillGroup.setAttribute("clip-path", `url(#${clipId})`);
  svgEl.insertBefore(fillGroup, svgEl.firstChild);

  // === Clonar paths y aplicar relleno según stroke ===
  const paths = svgEl.querySelectorAll("path");
  paths.forEach((p) => {
    const clone = p.cloneNode(true);
    const color = p.getAttribute("stroke") || "#fff";

    clone.setAttribute("fill", color);
    clone.setAttribute("stroke", "none");
    clone.removeAttribute("filter");
    clone.style.filter = "none";

    fillGroup.appendChild(clone);
  });

  // === Animación del círculo ===
  const animate = () => {
    gsap.to(circle, {
      duration,
      delay,
      ease: "power2.inOut",
      attr: { r: Math.hypot(width, height) / 2 }, // cubrir todo el SVG
    });
  };

  // === Activar animación con ScrollTrigger si aplica ===
  if (svgRef?.current) {
    ScrollTrigger.create({
      trigger: svgRef.current,
      containerAnimation, // scroll horizontal
      start,              // cuándo se dispara la animación
      once: true,
      onEnter: animate,
    });
  } else {
    animate();
  }
}

/* animacion de particulas de botones de panel */
function animarBotonGSAP(boton) {
  if (!boton) return;

  const shapes = boton.querySelectorAll(".shape");
  let isAnimating = false; // evita animaciones simultáneas

  const handleEnter = () => {
    if (isAnimating) return; // si ya se está animando, no hacer nada
    isAnimating = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating = false; // desbloquear hover cuando termina el timeline
      },
    });

    shapes.forEach((shape, i) => {
      const startX = 0;
      const startY = 5;

      gsap.set(shape, {
        x: startX,
        y: startY,
        scale: 0.3,
        opacity: 0,
        transformOrigin: "center center",
      });

      const dur = gsap.utils.random(0.9, 1.5);
      const delay = gsap.utils.random(0, 0.15);
      const direction = i % 2 === 0 ? 1 : -1;
      const distanceX = gsap.utils.random(30, 80) * direction;
      const height = gsap.utils.random(40, 80);

      // Animación de cada shape dentro del mismo timeline
      tl.to(
        shape,
        {
          x: startX + distanceX / 2,
          y: startY - height,
          scale: gsap.utils.random(1, 1.6),
          opacity: 1,
          duration: dur * 0.7,
          ease: "power2.out",
        },
        delay // cada shape tiene su pequeño delay independiente
      ).to(
        shape,
        {
          x: startX + distanceX,
          y: startY + 20,
          opacity: 0,
          scale: 0.2,
          duration: dur * 0.3,
          ease: "power1.in",
        },
        `>0` // sigue inmediatamente después del primer tween del mismo shape
      );
    });
  };

  boton.addEventListener("mouseenter", handleEnter);

  // Devuelve la función de limpieza
  return () => boton.removeEventListener("mouseenter", handleEnter);
}

/* animacion para que baje verticalmente de un h2 a otro*/
function animTituloPuente({ 
  panel4TitleRef, 
  nextTitleRef, 
  horizontalSectionRef 
}) {
  const titulo = panel4TitleRef.current;
  const destino = nextTitleRef.current;

  if (!titulo || !destino) return;

  // Asegura que no haya reflows repetidos
  gsap.set(titulo, { willChange: "transform" });

  // --- Mide SIEMPRE la distancia real ---
  function medirDistancia() {
    const tituloY = titulo.getBoundingClientRect().top + window.scrollY;
    const destinoY = destino.getBoundingClientRect().top + window.scrollY;
    return destinoY - tituloY;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: horizontalSectionRef.current,
      start: "bottom bottom",
      end: "+=400",
      scrub: 1,       // ← suaviza AÚN más, evita saltos si scrolleas rápido
      anticipatePin: 1
    }
  });

  tl.fromTo(
    titulo,
    { y: 0 },
    { 
      y: () => medirDistancia(), // recalcula SIEMPRE
      ease: "none"
    }
  );

  window.addEventListener("resize", ScrollTrigger.refresh);

  return () => {
    window.removeEventListener("resize", ScrollTrigger.refresh);
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

/* CONJUNTO DE ANIMACIONES DE MANDO GAMER */
function animCarcasa({ svgRef, btnRef, duration = 2 }) {
  if (!svgRef?.current) return;
  const svg = svgRef.current;

  const shapes = svg.querySelectorAll("path, circle, rect, polygon, polyline");

  // Guardar colores originales
  const originalFills = [];
  shapes.forEach((shape, i) => {
    let fill = shape.getAttribute("fill");
    if (!fill || fill === "none" || fill === "transparent") {
      fill = shape.getAttribute("stroke") || "#fff";
    }
    originalFills[i] = fill;

    // Preparar para animación de contorno
    shape.setAttribute("fill", "transparent");
    const length = shape.getTotalLength?.() || 300;
    shape.style.strokeDasharray = length;
    shape.style.strokeDashoffset = length;
  });

  // Timeline principal: contorno + relleno
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: svg,
      start: "top 75%",
      once: true
    }
  });

  tl.to(shapes, {
    strokeDashoffset: 0,
    duration,
    ease: "power2.inOut",
    stagger: 0.05
  });

  tl.to(shapes, {
    fill: (i) => originalFills[i],
    duration: 1,
    ease: "power2.out"
  }, "-=0.5");

  // 🔹 Animaciones dependientes del relleno: se ejecutan **después del timeline**
  tl.add(() => {
    animJoystick(svg);    
    animTriangulos(svg);      
    animCirculosRojos(svg); 
    animHazLuzAzules(svg);
    animHazDiagonalPantalla();
  });

  function setupButtonFillEffect(btnRef) {
    if (!btnRef.current) return;
  
    let circle = null;
    const btn = btnRef.current;
  
    btn.style.position = btn.style.position || "relative";
    btn.style.overflow = "hidden";
  
    const onMouseEnter = (e) => {
      const rect = btn.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const radius = Math.sqrt(width ** 2 + height ** 2) / 2 * 1.2;
  
      // Crear el círculo si no existe
      if (!circle) {
        circle = document.createElement("span");
        circle.classList.add("btn-fill-circle");
        btn.prepend(circle);
  
        Object.assign(circle.style, {
          position: "absolute",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          transform: "translate(-50%, -50%) scale(0)",
          pointerEvents: "none",
          zIndex: 0,
        });
      }
  
      // Cancelar animaciones anteriores
      gsap.killTweensOf(circle);
      gsap.killTweensOf(btn);
  
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
  
      // Animar crecimiento más rápido
      gsap.to(circle, {
        scale: radius / 20,
        duration: 0.35, // antes 0.5 → más rápido
        ease: "power2.out",
      });
  
      gsap.to(btn, { color: "#000", duration: 0.2 });
    };
  
    const onMouseMove = (e) => {
      if (!circle) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(circle, { x: x - circle.offsetLeft, y: y - circle.offsetTop, duration: 0.2 });
    };
  
    const onMouseLeave = (e) => {
      if (!circle) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      gsap.killTweensOf(circle);
  
      // Animación de reducción más rápida
      gsap.to(circle, {
        x: x - circle.offsetLeft,
        y: y - circle.offsetTop,
        scale: 0,
        duration: 0.3, // antes 0.4 → más rápido
        ease: "power2.in",
      });
  
      gsap.to(btn, { color: "#fff", duration: 0.2 });
    };
  
    btn.addEventListener("mouseenter", onMouseEnter);
    btn.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);
  
    return () => {
      btn.removeEventListener("mouseenter", onMouseEnter);
      btn.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }

  if (btnRef?.current) {
    setupButtonFillEffect(btnRef);
    // Si quieres, puedes guardar `cleanup` para remover event listeners cuando sea necesario
  }

  return tl;
}

function animJoystick(svg) {
  if (!svg) return;

  gsap.registerPlugin(MotionPathPlugin);

  const animateLine = (circleId, pathId, duration = 2) => {
    gsap.to(svg.querySelector(circleId), {
      duration,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      motionPath: {
        path: svg.querySelector(pathId),
        align: svg.querySelector(pathId),
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      }
    });
  };

  animateLine("#circulo1", "#ruta1", 2.3);
  animateLine("#circulo2", "#ruta2", 2.5);
}

function animTriangulos(svg) {
  if (!svg) return;

  const tris = ["#tri1", "#tri2", "#tri3", "#tri4"];
  const brightColor = "#FF7328"; // Color de “iluminación”

  // Guardar colores actuales después de que la carcasa se rellenó
  const originalColors = tris.map(id => {
    const tri = svg.querySelector(id);
    return {
      fill: tri.getAttribute("fill") || "#FFA45A",
      stroke: tri.getAttribute("stroke") || "#FFA45A",
    };
  });

  // Timeline secuencial de iluminación
  const tl = gsap.timeline({ repeat: -1 });

  tris.forEach((id, i) => {
    const tri = svg.querySelector(id);
    const orig = originalColors[i];

    tl.to(tri, {
      fill: brightColor,
      stroke: brightColor,
      duration: 0.5,
      ease: "power1.inOut"
    })
    .to(tri, {
      fill: orig.fill,
      stroke: orig.stroke,
      duration: 0.5,
      ease: "power1.inOut"
    });
  });

  return tl;
}

function animCirculosRojos(svg) {
  if (!svg) return;

  const circles = svg.querySelectorAll('circle[stroke="#E03C3C"]');

  circles.forEach(circle => {
    const cx = circle.cx.baseVal.value;
    const cy = circle.cy.baseVal.value;
    const r = circle.r.baseVal.value;

    // Crear círculo de luz difuminada
    const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    glow.setAttribute("cx", cx);
    glow.setAttribute("cy", cy);
    glow.setAttribute("r", r * 0.9); // ligeramente más pequeño que el círculo
    glow.setAttribute("fill", "#FF5A5A"); // color de la iluminación
    glow.setAttribute("opacity", 0);
    glow.setAttribute("pointer-events", "none"); // que no interfiera
    glow.style.filter = "blur(15px)"; // difuminado
    svg.appendChild(glow);

    // Animación de parpadeo
    gsap.to(glow, {
      opacity: 0.6,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
      delay: Math.random() * 0.5 // para que no parpadeen al mismo tiempo
    });
  });
}

function animHazLuzAzules(svg) {
  if (!svg) return;

  const formas = ["#azul1", "#azul2", "#azul3"];

  formas.forEach((id, index) => {
    const shape = svg.querySelector(id);
    if (!shape) return;

    // Clonar la forma y ponerla encima
    const clone = shape.cloneNode(true);
    svg.appendChild(clone); // al final para que quede encima
    clone.setAttribute("fill", "transparent");

    // Crear gradiente lineal brillante
    const gradientId = `grad-${id}`;
    let defs = svg.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      svg.prepend(defs);
    }

    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttribute("id", gradientId);
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%");
    grad.setAttribute("y2", "0%");

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#007BFF");
    stop1.setAttribute("stop-opacity", "1");

    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "50%");
    stop2.setAttribute("stop-color", "#FFFFFF");
    stop2.setAttribute("stop-opacity", "0.8");

    const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop3.setAttribute("offset", "100%");
    stop3.setAttribute("stop-color", "#007BFF");
    stop3.setAttribute("stop-opacity", "1");

    grad.appendChild(stop1);
    grad.appendChild(stop2);
    grad.appendChild(stop3);
    defs.appendChild(grad);

    // Aplicar gradiente al stroke de la copia
    clone.setAttribute("stroke", `url(#${gradientId})`);

    // Animar haz
    gsap.to(stop2, {
      attr: { offset: "100%" },
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: index * 0.2
    });
  });
}

function animHazDiagonalPantalla() {
  const pantalla = document.querySelector(".pantalla-img");
  const img = pantalla?.querySelector("img");
  const haz = pantalla?.querySelector(".haz-diagonal");
  const empresa = document.querySelector(".empresa-nombre");
  const boton = document.querySelector(".btn-ver-mas");

  if (!pantalla || !img || !haz || !empresa || !boton) return;

  const tl = gsap.timeline();

  // Aparición de imagen + empresa
  tl.to([pantalla, empresa], {
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  });

  // Haz de luz moviéndose dentro de la pantalla (comienza justo al aparecer)
  tl.to(haz, {
    x: "200%",
    duration: 4,
    ease: "power2.inOut",
    repeat: -1
  }, "-=0.6"); // empieza antes para parecer pegado a la aparición

  // Botón aparece al MISMO TIEMPO que la imagen + empresa
  tl.fromTo(boton, {
    opacity: 0,
    y: -40
  }, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out"
  }, 0.5);  // ← APARECE EXACTAMENTE A LA VEZ

  return tl;
}
/**/

function animLineaCompleta(selector, duration = 0.8, offsetY = 50, onComplete) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  elements.forEach((el) => {
    gsap.set(el, { y: offsetY, opacity: 0 });

    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      },
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  });
}

function animRedesEscala(selector, stagger = 0.2, duration = 0.6, offset = 2) {
  const items = document.querySelectorAll(selector);
  if (!items.length) return;

  gsap.set(items, { scale: 0, opacity: 0 });

  gsap.to(items, {
    scale: 1,
    opacity: 1,
    duration,
    ease: "back.out(" + offset + ")",
    stagger,
    scrollTrigger: {
      trigger: items[0].parentElement,
      start: "top 80%",
      toggleActions: "play none none none",
      once: true,
    },
  });
}

// function startEQ() {
//   const columns = gsap.utils.toArray(".col");
//   let lastMaxFilled = -2; // índice de la última columna llena

//   columns.forEach((col, index) => {
//     const pixels = col.querySelectorAll("path");
//     const reflection = document.querySelector(`.col-ref-${index + 1}`);
//     const pixelsRef = reflection ? reflection.querySelectorAll("path") : [];

//     const colorStart = { r: 60, g: 224, b: 195 }; // #3CE0C3
//     const colorEnd = { r: 21, g: 61, b: 69 };     // #153D45

//     gsap.to({}, {
//       repeat: -1,
//       repeatRefresh: true,
//       onRepeat: () => {
//         const maxPixels = pixels.length;

//         // Ajustar probabilidad de pico según la columna anterior
//         let baseChance = 0.2; // 20% de probabilidad normal de pico
//         if ((index - lastMaxFilled) <= 1) baseChance = 0.05; // si la anterior se llenó, reducir a 5%

//         const maxChance = Math.random() < baseChance;
//         const active = maxChance
//           ? maxPixels
//           : gsap.utils.random(1, Math.floor(maxPixels * 0.7), 1);

//         if (maxChance) lastMaxFilled = index; // actualizar última columna llena

//         // ANIMACIÓN PRINCIPAL
//         pixels.forEach((p, i) => {
//           const isActive = i < active;
//           const tGrad = i / (pixels.length - 1);
//           const r = Math.round(colorStart.r + (colorEnd.r - colorStart.r) * tGrad);
//           const g = Math.round(colorStart.g + (colorEnd.g - colorStart.g) * tGrad);
//           const b = Math.round(colorStart.b + (colorEnd.b - colorStart.b) * tGrad);
//           const color = `rgb(${r},${g},${b})`;

//           gsap.to(p, {
//             fill: isActive ? color : "none",
//             opacity: 0.7, // <-- poquitito de opacidad
//             duration: 0.2,
//             overwrite: true,
//             boxShadow: isActive ? `0 0 12px ${color}` : "none"
//           });
//         });

//         // REFLEJOS SIN BLUR
//         pixelsRef.forEach((p, i) => {
//           const isActive = i < active;
//           gsap.to(p, {
//             fill: isActive ? "#3CE0C3" : "none",
//             opacity: isActive ? 0.3 : 0,
//             duration: 0.2,
//             overwrite: true
//           });
//         });
//       }
//     });
//   });
// }















