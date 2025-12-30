import Ruido from "./assets/images/t1.jpg";
import Halo from "./assets/images/halo.png";
import Mercurio from "./assets/images/planet1.jpg";
import Venus from "./assets/images/planet2.jpg";
import Tierra from "./assets/images/planet3.jpg";
import TierraDia from "./assets/images/t4.jpg";
import TierraNoche from "./assets/images/p3Noche.png";
import Aurora from "./assets/images/aurora.png";
import Nubes from "./assets/images/nubes.png";
import Luna from "./assets/images/moon.jpg";
import Marte from "./assets/images/mars.jpg";
import Jupiter from "./assets/images/planet5.jpg";
import Saturno from "./assets/images/planet6.jpg";
import SaturnoRing from "./assets/images/planet6Ring.png";
import UranoRing from "./assets/images/planet7Ring.png";
import NeptunoRing from "./assets/images/planet8Ring.png";
import Urano from "./assets/images/planet7.jpg";
import Neptuno from "./assets/images/planet8.jpg";
import Asteroides from "./assets/images/asteroids.jpg";
import Destello from "./assets/images/destello.png";
import Estrella2 from "./assets/images/estrellaTipo2.png";
import Franja from "./assets/images/fondo3.png";
import HaloFranja from "./assets/images/haloFranja.png";
import Space from "./assets/images/space.webp";

import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import * as THREE from "three"; // Necesario para THREE.LoadingManager
import Header from "./components/Header/Header";
import HeaderHorizontal from "./components/Header/Horizontal-header";
import Inicio from "./components/Inicio/Inicio";
import SobreMi from "./components/SobreMi/SobreMi";
import Experiencia from "./components/Experiencia/Experiencia";
import Creaciones from "./components/Creaciones/Creaciones";
import Contacto from "./components/Contacto/Contacto";
import Tecnologias from "./components/Tecnologias";
import Loader from "./components/Animaciones/Loader";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css"; 
import LayoutInicio from "./components/Inicio/LayoutInicio";
import LayoutTecnologias from "./components/Inicio/LayoutTecnologias";

  // ----------------------------------------------------
  // ⭐ FUNCIÓN: Estrellas muestreadas por la Franja (Alternando Texturas)
  // ----------------------------------------------------
  const addFranjaStars = async (count, franjaPlane, group, destelloTexture, estrella2Texture, franjaTextureURL) => {

    const rarityFactor = 0.03; 
    // -------------------------------

    const franjaGeometry = franjaPlane.geometry;
    const franjaPosition = franjaPlane.position;
    const franjaWidth = franjaGeometry.parameters.width;
    const franjaHeight = franjaGeometry.parameters.height;
    const franjaRotation = franjaPlane.rotation;

    // Arrays separados para almacenar vértices de cada tipo de estrella
    const starVertices1 = []; // Para destelloTexture (la común)
    const starVertices2 = []; // Para estrella2Texture (la rara)

    // --- Lógica de Carga y Muestreo de Imagen ---
    const franjaImage = await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; 
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = franjaTextureURL;
    });

    const canvas = document.createElement('canvas');
    canvas.width = franjaImage.width;
    canvas.height = franjaImage.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(franjaImage, 0, franjaImage.height - canvas.height, canvas.width, canvas.height); // Asegura dibujar desde la parte inferior si la textura tiene padding
    
    // Función para verificar la opacidad del píxel
    const checkPixel = (u, v) => {
        const xPixel = Math.floor(u * franjaImage.width);
        const yPixel = Math.floor(v * franjaImage.height);
        // Intentamos obtener el píxel en la posición U, V
        try {
            const pixelData = context.getImageData(xPixel, yPixel, 1, 1).data;
            const alpha = pixelData[3];
            // Solo consideramos posiciones donde la opacidad (alpha) sea significativa
            return alpha > 50; 
        } catch(e) {
            return false;
        }
    };
    
    let generatedStars = 0;
    let attempts = 0;
    const maxAttemptsPerStar = 100;

    while (generatedStars < count && attempts < count * maxAttemptsPerStar) {
        const u = THREE.MathUtils.randFloat(0, 1);
        const v = THREE.MathUtils.randFloat(0, 1);

        if (checkPixel(u, v)) {
            const x = (u - 0.5) * franjaWidth;
            const invertedV = 1.0 - v;
            const y = (invertedV - 0.5) * franjaHeight;
            const z = THREE.MathUtils.randFloat(0.1, 5);

            // ✨ LÓGICA DE RAREZA ACTUALIZADA ✨
            const randomCheck = Math.random();
            
            // Si el número aleatorio es menor que el rarityFactor (ej. 0.05)
            if (randomCheck < rarityFactor) {
                // Va a la Malla 2 (la estrella rara)
                starVertices2.push(x, y, z);
            } else {
                // Va a la Malla 1 (la estrella común)
                starVertices1.push(x, y, z);
            }
            generatedStars++;
        }
        attempts++;
    }

    // --- 1. Creación de Malla para DestelloTexture (Común) ---
    const starGeometry1 = new THREE.BufferGeometry();
    starGeometry1.setAttribute('position', new THREE.Float32BufferAttribute(starVertices1, 3));

    const baseStarSize1 = 5;
    const starMaterial1 = new THREE.PointsMaterial({
        color: 0xffffff,
        size: baseStarSize1, 
        sizeAttenuation: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        map: destelloTexture, 
        alphaTest: 0.1,
        depthWrite: false, 
    });

    const franjaStars1 = new THREE.Points(starGeometry1, starMaterial1);
    franjaStars1.position.copy(franjaPosition);
    franjaStars1.rotation.copy(franjaRotation);
    group.add(franjaStars1);


    // --- 2. Creación de Malla para Estrella2Texture (Rara) ---
    const starGeometry2 = new THREE.BufferGeometry();
    starGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(starVertices2, 3));

    const baseStarSize2 = 20; 
    const starMaterial2 = new THREE.PointsMaterial({
        color: 0xffeeaa, 
        size: baseStarSize2, 
        sizeAttenuation: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        map: estrella2Texture, 
        alphaTest: 0.1,
        depthWrite: false, 
    });

    const franjaStars2 = new THREE.Points(starGeometry2, starMaterial2);
    franjaStars2.position.copy(franjaPosition);
    franjaStars2.rotation.copy(franjaRotation);
    group.add(franjaStars2);

    return [franjaStars1, franjaStars2];
  };

  // ===============================================
  // ☄️ CÓDIGO DE LA ÓRBITA DEL COMETA (DEFINICIÓN)
  // ===============================================
  const perihelionDistance = 20;
  const rotationAngle = -0.5;
  const inclineAngle = -1.8;

  const getCometPosition = (t) => {
        const x = perihelionDistance + 0.5 * t * t; 
        const z = t * 25; 
        const position = new THREE.Vector3(x, 0, -z); 
        position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationAngle); 
        position.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclineAngle); 
        
        return position;
  };

  // -----------------------------
  // ✨ Fondo estrellas
  // -----------------------------
  const addStars = (count, range, group, texture) => {
      const starGeometry = new THREE.BufferGeometry();
      const starVertices = [];
      for (let i = 0; i < count; i++) {
          const x = THREE.MathUtils.randFloatSpread(range);
          const y = THREE.MathUtils.randFloatSpread(range);
          const z = THREE.MathUtils.randFloatSpread(range);
          starVertices.push(x, y, z);
      }
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1, 
        sizeAttenuation: true,
        transparent: false,
        blending: THREE.AdditiveBlending,
        map: texture, 
        alphaTest: 0.1,
        depthWrite: false 
      });

      const stars = new THREE.Points(starGeometry, starMaterial);
      group.add(stars);

      return stars;
  };

  function App() {
    const [uiReady, setUiReady] = useState(false);

    const mountRef = useRef(null);
    const cameraRef = useRef(null);

    const mercuryRef = useRef(null);
    const venusRef = useRef(null);
    const earthRef = useRef(null);
    const marsRef = useRef(null);
    const followMercuryRef = useRef(false);
    const followVenusRef = useRef(false);
    const followEarthRef = useRef(false);
    const followMarsRef = useRef(false);
    const solarGroupRef = useRef(null);

    const satelliteRef = useRef(null);
    const satelliteOrbitRef = useRef(null); 
    const followSatelliteRef = useRef(false);
    const freezeSatelliteOrbitRef = useRef(false);

    const sunRef = useRef(null);
    const haloRef = useRef(null);
    const lightRef = useRef(null);
    const isZoomingRef = useRef(false);

    const defaultCameraPosRef = useRef(null);
    const defaultSunScaleRef = useRef(null);
    const defaultHaloScaleRef = useRef(null);
    const defaultLightIntensityRef = useRef(null);

    const franjaStarsMesh1Ref = useRef(null); 
    const franjaStarsMesh2Ref = useRef(null);
    const [sceneReady, setSceneReady] = useState(false);
    const [hideLoader, setHideLoader] = useState(false); 
    const [showLoader, setShowLoader] = useState(true); 
    const [texturesLoaded, setTexturesLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const texturesRef = useRef({});

    const [loaderFinished, setLoaderFinished] = useState(false);

    //constantes para congelar el movimiento al hacer zoom hacia planetas
    const freezeMercuryOrbitRef = useRef(false);
    const freezeVenusOrbitRef = useRef(false);
    const freezeEarthOrbitRef = useRef(false);
    const freezeMarsOrbitRef = useRef(false);
    const activeSectionRef = useRef(null);
    // ----------------------------------------------------
    // ⭐ Función: Agregar la Franja Galáctica (Corregida Sin Rotación Diagonal)
    // ----------------------------------------------------
      const addMilkyWayFranja = (scene, texture) => {
        const width = 200; 
        const height = 400;
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1, 
            side: THREE.DoubleSide, 
            depthWrite: false,
        });
  
        const milkyWayPlane = new THREE.Mesh(geometry, material);
        const depth = -130; 
        const posX = 80; 
        const posY = 0; 
  
        milkyWayPlane.position.set(posX, posY, depth); 
        milkyWayPlane.rotation.z = 0; 
        milkyWayPlane.rotation.y = 0; 
        milkyWayPlane.rotation.x = 0; 
  
        scene.add(milkyWayPlane);
        return milkyWayPlane;
    };
  
    // ----------------------------------------------------
    // ⭐ Función: Agregar la Estela de Resplandor (Halo)
    // ----------------------------------------------------
    const addGlowHalo = (scene, glowTexture) => {
      const width = 250;
      const height = 450;
  
      // Aplicar fade a los bordes del glow
      const fadedGlow = fadeTextureEdges(glowTexture, 200);
  
      const geometry = new THREE.PlaneGeometry(width, height);
      
      const material = new THREE.MeshBasicMaterial({
          map: fadedGlow,
          color: new THREE.Color(0x88CCFF),
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
      });
  
      const glowPlane = new THREE.Mesh(geometry, material);
  
      glowPlane.position.set(80, 0, -131);
      glowPlane.rotation.set(0, 0, 0);
  
      scene.add(glowPlane);
      return glowPlane;
    };

    function SceneController({ sceneReady }) {
      const location = useLocation();
    
      useEffect(() => {
        if (!sceneReady) return;
    
        let target = null;
    
        switch (location.pathname) {
          case "/sobre-mi":
            target = "mercury";
            break;
          case "/experiencia":
            target = "venus";
            break;
          case "/creaciones":
            target = "earth";
            break;
          case "/contacto":
            target = "mars";
            break;
          case "/tecnologias":
            target = "satellite";
            break;
          default:
            target = null;
        }
    
        // 🚫 evita repetir solo si ya hubo una transición válida
        if (
          activeSectionRef.current === target &&
          !isZoomingRef.current
        ) {
          return;
        }
    
        activeSectionRef.current = target;
        setUiReady(false);
    
        if (!target) {
          resetZoom();
        } else {
          switch (target) {
            case "mercury":
              zoomToMercury();
              break;
            case "venus":
              zoomToVenus();
              break;
            case "earth":
              zoomToEarth();
              break;
            case "mars":
              zoomToMars();
              break;
            case "satellite":
              zoomToSatellite();
              break;
          }
        }
      }, [location.pathname, sceneReady]);
    
      return null;
    }

    function zoomToMercury() {
      isZoomingRef.current = true;
      freezeMercuryOrbitRef.current = true;
    
      followVenusRef.current = false;
      followEarthRef.current = false;
      followMarsRef.current = false;
      followSatelliteRef.current = false;
    
      const camera = cameraRef.current;
      const mercury = mercuryRef.current;
      const sun = sunRef.current;
      const halo = haloRef.current;
      const light = lightRef.current;
    
      if (!camera || !mercury || !sun || !halo || !light) return;
    
      const isMobile = window.innerWidth <= 768; // ✅ Detectar móvil
    
      let progress = 0;
    
      // 🎥 OFFSETS SEGÚN DISPOSITIVO
      const CAM_OFFSET  = isMobile ? new THREE.Vector3(0, 0, 4) : new THREE.Vector3(3, 2, 7);
      const LOOK_OFFSET = isMobile ? new THREE.Vector3(0, -1.2, 0) : new THREE.Vector3(3.5, -1.5, 0);
    
      const startPos = camera.position.clone();
      const mercuryPos = new THREE.Vector3();
      mercury.getWorldPosition(mercuryPos);
    
      const finalPos = mercuryPos.clone().add(CAM_OFFSET);
    
      // 🌞 valores iniciales
      const startSunScale = sun.scale.clone();
      const startHaloScale = halo.scale.clone();
      const startLightIntensity = light.intensity;
    
      // 🌑 valores finales (sol reducido)
      const endSunScale  = new THREE.Vector3(0.15, 0.15, 0.15);
      const endHaloScale = new THREE.Vector3(6, 6, 1);
      const endLightIntensity = startLightIntensity * 0.2;
    
      function animateZoom() {
        progress = Math.min(1, progress + 0.02);
    
        camera.position.lerpVectors(startPos, finalPos, progress);
        const customLookAt = mercuryPos.clone().add(LOOK_OFFSET);
        camera.lookAt(customLookAt);
    
        sun.scale.lerpVectors(startSunScale, endSunScale, progress);
        halo.scale.lerpVectors(startHaloScale, endHaloScale, progress);
    
        light.intensity = startLightIntensity + (endLightIntensity - startLightIntensity) * progress;
    
        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        } else {
          freezeMercuryOrbitRef.current = false;
          followMercuryRef.current = true;
          isZoomingRef.current = false;
    
          window.dispatchEvent(new Event("contenedor-show"));
          setUiReady(true);
        }
      }
    
      animateZoom();
    }
     
    function zoomToVenus() {
      isZoomingRef.current = true;
      freezeVenusOrbitRef.current = true;
    
      // apagar otros follows
      followMercuryRef.current = false;
      followEarthRef.current = false;
      followMarsRef.current = false;
    
      const camera = cameraRef.current;
      const venus = venusRef.current;
      const sun = sunRef.current;
      const halo = haloRef.current;
      const light = lightRef.current;
    
      if (!camera || !venus || !sun || !halo || !light) return;
    
      const isMobile = window.innerWidth <= 768;
    
      let progress = 0;
    
      // 🎥 OFFSETS RESPONSIVE
      const CAM_OFFSET = isMobile ? new THREE.Vector3(0, 0, 8) : new THREE.Vector3(15, 5, 15);  
      const LOOK_OFFSET = isMobile ? new THREE.Vector3(0, -2, 0) : new THREE.Vector3(10, -2, 0);
    
      const startPos = camera.position.clone();
    
      const venusPos = new THREE.Vector3();
      venus.getWorldPosition(venusPos);
    
      const finalPos = venusPos.clone().add(CAM_OFFSET);
    
      // 🌞 valores iniciales
      const startSunScale = sun.scale.clone();
      const startHaloScale = halo.scale.clone();
      const startLightIntensity = light.intensity;
    
      // 🌑 valores finales
      const endSunScale  = new THREE.Vector3(0.15, 0.15, 0.15);
      const endHaloScale = new THREE.Vector3(6, 6, 1);
      const endLightIntensity = startLightIntensity * 0.2;
    
      function animateZoom() {
        progress = Math.min(1, progress + 0.02);
    
        camera.position.lerpVectors(startPos, finalPos, progress);
    
        const customLookAt = venusPos.clone().add(LOOK_OFFSET);
        camera.lookAt(customLookAt);
    
        sun.scale.lerpVectors(startSunScale, endSunScale, progress);
        halo.scale.lerpVectors(startHaloScale, endHaloScale, progress);
    
        light.intensity =
          startLightIntensity +
          (endLightIntensity - startLightIntensity) * progress;
    
        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        } else {
          freezeVenusOrbitRef.current = false;
          followVenusRef.current = true;
          isZoomingRef.current = false;
    
          window.dispatchEvent(new Event("contenedor-show"));
          setUiReady(true);
        }
      }
    
      animateZoom();
    } 
    
    function zoomToEarth() {
      isZoomingRef.current = true;
      freezeEarthOrbitRef.current = true;
    
      // apaga otros follows
      followMercuryRef.current = false;
      followVenusRef.current = false;
      followMarsRef.current = false;
      followEarthRef.current = false;
    
      const camera = cameraRef.current;
      const earth = earthRef.current;
      const sun = sunRef.current;
      const halo = haloRef.current;
      const light = lightRef.current;
    
      if (!camera || !earth || !sun || !halo || !light) return;
    
      const isMobile = window.innerWidth <= 768;
      let progress = 0;
    
      // 🎥 OFFSETS RESPONSIVE
      const CAM_OFFSET = isMobile ? new THREE.Vector3(0, 0, 10) : new THREE.Vector3(18, 6, 15);
      const LOOK_OFFSET = isMobile ? new THREE.Vector3(0, -3, 0) : new THREE.Vector3(12, -2, 0);
    
      const startPos = camera.position.clone();
    
      const earthPos = new THREE.Vector3();
      earth.getWorldPosition(earthPos);
    
      const finalPos = earthPos.clone().add(CAM_OFFSET);
    
      // 🌞 valores iniciales
      const startSunScale = sun.scale.clone();
      const startHaloScale = halo.scale.clone();
      const startLightIntensity = light.intensity;
    
      // 🌑 valores finales
      const endSunScale  = new THREE.Vector3(0.15, 0.15, 0.15);
      const endHaloScale = new THREE.Vector3(6, 6, 1);
      const endLightIntensity = startLightIntensity * 0.2;
    
      function animateZoom() {
        progress = Math.min(1, progress + 0.02);
    
        camera.position.lerpVectors(startPos, finalPos, progress);
    
        const customLookAt = earthPos.clone().add(LOOK_OFFSET);
        camera.lookAt(customLookAt);
    
        sun.scale.lerpVectors(startSunScale, endSunScale, progress);
        halo.scale.lerpVectors(startHaloScale, endHaloScale, progress);
    
        light.intensity =
          startLightIntensity +
          (endLightIntensity - startLightIntensity) * progress;
    
        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        } else {
          freezeEarthOrbitRef.current = false;
          followEarthRef.current = true;
          isZoomingRef.current = false;
    
          window.dispatchEvent(new Event("contenedor-show"));
          setUiReady(true);
        }
      }
    
      animateZoom();
    }
      
    function zoomToMars() {
      isZoomingRef.current = true;
      freezeMarsOrbitRef.current = true;
    
      // apaga otros follows
      followMercuryRef.current = false;
      followVenusRef.current = false;
      followEarthRef.current = false;
      followMarsRef.current = false;
    
      const camera = cameraRef.current;
      const mars = marsRef.current;
      const sun = sunRef.current;
      const halo = haloRef.current;
      const light = lightRef.current;
    
      if (!camera || !mars || !sun || !halo || !light) return;
    
      const isMobile = window.innerWidth <= 768;
      let progress = 0;
    
      // 🎥 OFFSETS RESPONSIVE
      const CAM_OFFSET = isMobile ? new THREE.Vector3(0, 0, 12) : new THREE.Vector3(18, 6, 15);
      const LOOK_OFFSET = isMobile ? new THREE.Vector3(0, -3, 0) : new THREE.Vector3(12, -2, 0);
    
      const startPos = camera.position.clone();
    
      const marsPos = new THREE.Vector3();
      mars.getWorldPosition(marsPos);
    
      const finalPos = marsPos.clone().add(CAM_OFFSET);
    
      // 🌞 valores iniciales
      const startSunScale = sun.scale.clone();
      const startHaloScale = halo.scale.clone();
      const startLightIntensity = light.intensity;
    
      // 🌑 valores finales
      const endSunScale  = new THREE.Vector3(0.15, 0.15, 0.15);
      const endHaloScale = new THREE.Vector3(6, 6, 1);
      const endLightIntensity = startLightIntensity * 0.2;
    
      function animateZoom() {
        progress = Math.min(1, progress + 0.02);
    
        camera.position.lerpVectors(startPos, finalPos, progress);
    
        const customLookAt = marsPos.clone().add(LOOK_OFFSET);
        camera.lookAt(customLookAt);
    
        sun.scale.lerpVectors(startSunScale, endSunScale, progress);
        halo.scale.lerpVectors(startHaloScale, endHaloScale, progress);
    
        light.intensity =
          startLightIntensity +
          (endLightIntensity - startLightIntensity) * progress;
    
        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        } else {
          freezeMarsOrbitRef.current = false;
          followMarsRef.current = true;
          isZoomingRef.current = false;
    
          window.dispatchEvent(new Event("contenedor-show"));
          setUiReady(true);
        }
      }
    
      animateZoom();
    }
      
    function zoomToSatellite() {
      isZoomingRef.current = true;
      freezeSatelliteOrbitRef.current = true;
    
      // apaga otros follows
      followMercuryRef.current = false;
      followVenusRef.current = false;
      followEarthRef.current = false;
      followMarsRef.current = false;
      followSatelliteRef.current = false;
    
      const camera = cameraRef.current;
      const satellite = satelliteRef.current;
      const sun = sunRef.current;
      const halo = haloRef.current;
      const light = lightRef.current;
    
      if (!camera || !satellite || !sun || !halo || !light) return;
    
      const isMobile = window.innerWidth <= 768;
      let progress = 0;
    
      // 🎥 OFFSETS RESPONSIVE
      const CAM_OFFSET = isMobile
        ? new THREE.Vector3(0, 1.5, 6)   // 📱 móvil
        : new THREE.Vector3(0, 1.2, 5);  // 🖥️ desktop
    
      const LOOK_OFFSET = isMobile
        ? new THREE.Vector3(0, -1.5, 0)  // 📱 mirar más abajo
        : new THREE.Vector3(0, 0, 0);    // 🖥️ centro exacto
    
      const startPos = camera.position.clone();
    
      const satellitePos = new THREE.Vector3();
      satellite.getWorldPosition(satellitePos);
    
      const finalPos = satellitePos.clone().add(CAM_OFFSET);
    
      // 🌞 valores iniciales
      const startSunScale = sun.scale.clone();
      const startHaloScale = halo.scale.clone();
      const startLightIntensity = light.intensity;
    
      // 🌑 valores finales
      const endSunScale  = new THREE.Vector3(0.1, 0.1, 0.1);
      const endHaloScale = new THREE.Vector3(4, 4, 1);
      const endLightIntensity = startLightIntensity * 0.15;
    
      function animateZoom() {
        progress = Math.min(1, progress + 0.02);
    
        camera.position.lerpVectors(startPos, finalPos, progress);
    
        const customLookAt = satellitePos.clone().add(LOOK_OFFSET);
        camera.lookAt(customLookAt);
    
        sun.scale.lerpVectors(startSunScale, endSunScale, progress);
        halo.scale.lerpVectors(startHaloScale, endHaloScale, progress);
    
        light.intensity =
          startLightIntensity +
          (endLightIntensity - startLightIntensity) * progress;
    
        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        } else {
          freezeSatelliteOrbitRef.current = false;
          followSatelliteRef.current = true;
          isZoomingRef.current = false;
    
          window.dispatchEvent(new Event("contenedor-show"));
          setUiReady(true);
        }
      }
    
      animateZoom();
    }
    

    function resetZoom() {
      isZoomingRef.current = true;
      followMercuryRef.current = false;
      followVenusRef.current = false;
      followEarthRef.current = false;
      followMarsRef.current = false;
      followSatelliteRef.current = false;
      freezeSatelliteOrbitRef.current = false;
      const camera = cameraRef.current;
      const sun = sunRef.current;
      const halo = haloRef.current;
      const light = lightRef.current;
    
      if (!camera || !sun || !halo || !light) return;
    
      let progress = 0;
    
      // ✔ posición original REAL
      const startPos = camera.position.clone();
      const endPos = defaultCameraPosRef.current.clone();
    
      // ✔ escalas originales REALES
      const startSunScale = sun.scale.clone();
      const endSunScale = defaultSunScaleRef.current.clone();
    
      const startHaloScale = halo.scale.clone();
      const endHaloScale = defaultHaloScaleRef.current.clone();
    
      // ✔ luz original REAL
      const startLightIntensity = light.intensity;
      const endLightIntensity = defaultLightIntensityRef.current;
    
      function animateReset() {
        progress = Math.min(1, progress + 0.02);
    
        camera.position.lerpVectors(startPos, endPos, progress);
    
        // mirar al sistema solar
        camera.lookAt(0, 10, -4);
    
        sun.scale.lerpVectors(startSunScale, endSunScale, progress);
        halo.scale.lerpVectors(startHaloScale, endHaloScale, progress);
    
        light.intensity =
          startLightIntensity +
          (endLightIntensity - startLightIntensity) * progress;
    
        if (progress < 1) {
          requestAnimationFrame(animateReset);
        } else {
          isZoomingRef.current = false;
        }
      }
    
      animateReset();
    }
    
    function fadeTextureEdges(texture, fadeSize = 150) {
      const img = texture.image;
    
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
    
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
    
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
    
          // Distancia mínima a cualquier borde
          const distLeft   = x;
          const distRight  = canvas.width - x;
          const distTop    = y;
          const distBottom = canvas.height - y;
    
          const dist = Math.min(distLeft, distRight, distTop, distBottom);
    
          let fade = dist / fadeSize;
          fade = Math.min(1, Math.max(0, fade)); // clamp
    
          const i = (y * canvas.width + x) * 4;
    
          // Fade RGB
          data[i]     *= fade;
          data[i + 1] *= fade;
          data[i + 2] *= fade;
    
          // Fade alpha
          data[i + 3] *= fade;
        }
      }
    
      ctx.putImageData(imageData, 0, 0);
    
      const fadedTexture = new THREE.CanvasTexture(canvas);
      fadedTexture.needsUpdate = true;
    
      return fadedTexture;
    }    
    
    function setPlanetOrbitPosition(planet, radius, angleRad) {
      planet.position.x = Math.cos(angleRad) * radius;
      planet.position.z = Math.sin(angleRad) * radius;
    }

    useEffect(() => {
      const startTime = performance.now();
      texturesRef.current = {};
      const manager = new THREE.LoadingManager();
      manager.onProgress = (url, loaded, total) => {
      const percent = Math.round((loaded / total) * 100);
      setProgress(percent);
      };

      manager.onLoad = () => {
        const sunTexture = texturesRef.current.sunTexture;
        sunTexture.wrapS = THREE.RepeatWrapping;
        sunTexture.wrapT = THREE.RepeatWrapping;
        sunTexture.repeat.set(4, 4); 

        const saturnoRingTexture = texturesRef.current.saturnoRingTexture;
        saturnoRingTexture.wrapS = THREE.RepeatWrapping;
        saturnoRingTexture.wrapT = THREE.RepeatWrapping;
        saturnoRingTexture.repeat.set(1, 1); 
        
        const uranoRingTexture = texturesRef.current.uranoRingTexture;
        uranoRingTexture.wrapS = THREE.RepeatWrapping;
        uranoRingTexture.wrapT = THREE.RepeatWrapping;
        uranoRingTexture.repeat.set(1, 1); 
  
        //LOADER TIEMPO MINIMO
        const MIN_LOAD_TIME = 1000;
        const now = performance.now();
        const elapsed = now - startTime;
        const delay = Math.max(0, MIN_LOAD_TIME - elapsed);
        setTimeout(() => {
          setTexturesLoaded(true);
        }, delay);
      };

      const loader = new THREE.TextureLoader(manager);

      texturesRef.current.sunTexture = loader.load(Ruido);
      texturesRef.current.haloTexture = loader.load(Halo);
      texturesRef.current.mercuryTexture = loader.load(Mercurio);
      texturesRef.current.venusTexture = loader.load(Venus);
      texturesRef.current.tierraTexture = loader.load(Tierra);
      texturesRef.current.tierraDia = loader.load(TierraDia);
      texturesRef.current.tierraNoche = loader.load(TierraNoche);
      texturesRef.current.auroraTexture = loader.load(Aurora);
      texturesRef.current.nubesTexture = loader.load(Nubes);
      texturesRef.current.lunaTexture = loader.load(Luna);
      texturesRef.current.marteTexture = loader.load(Marte);
      texturesRef.current.jupiterTexture = loader.load(Jupiter);
      texturesRef.current.saturnoTexture = loader.load(Saturno);
      texturesRef.current.saturnoRingTexture = loader.load(SaturnoRing);
      texturesRef.current.uranoTexture = loader.load(Urano);
      texturesRef.current.uranoRingTexture = loader.load(UranoRing);
      texturesRef.current.neptunoTexture = loader.load(Neptuno);
      texturesRef.current.neptunoRingTexture = loader.load(NeptunoRing);
      texturesRef.current.asteroidesTexture = loader.load(Asteroides);
      texturesRef.current.destelloTexture = loader.load(Destello);
      texturesRef.current.estrella2Texture = loader.load(Estrella2);
      texturesRef.current.franjaTexture = loader.load(Franja, (tex) => {
        // Cuando cargue, degradamos los bordes
        const faded = fadeTextureEdges(tex, 120); // 120 = suavidad
      
        texturesRef.current.franjaTexture = faded;
      });
      texturesRef.current.haloFranjaTexture = loader.load(HaloFranja);
      texturesRef.current.spaceTexture = loader.load(Space);
    }, []);
    
    useEffect(() => {
      if (!texturesLoaded) return;

      const isMobile = window.innerWidth <= 768;

      const textures = texturesRef.current;
      const mount = mountRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
  
      // 2. ¡CRUCIAL! Asigna el objeto camera a la referencia
      cameraRef.current = camera;

      // ------------------------------------------
      // 🧩 NUEVO: Grupo raíz para mover todo
      // ------------------------------------------
      const solarGroup = new THREE.Group();
      solarGroupRef.current = solarGroup;
      scene.add(solarGroup);
  
      // 📐 POSICIÓN RESPONSIVE
      if (isMobile) {
        solarGroup.position.set(0, 30, -10);
      } else {
        solarGroup.position.set(-45, 20, -4);
      }

      // 📷 CÁMARA RESPONSIVE
      if (isMobile) {
        camera.position.set(0, 45, 40);
        camera.lookAt(0, 8, -10);
        camera.fov = 55;
      } else {
        camera.position.set(0, 25, 80);
        camera.lookAt(0, 10, -4);
        camera.fov = 45;
      }
  
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mount.appendChild(renderer.domElement);
  
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      defaultCameraPosRef.current = camera.position.clone();

      // -----------------------------
      // 🌞 Sol (ACTUALIZADO: Naranja Brillante y Consistente)
      // -----------------------------
      const sun = new THREE.Mesh(
          new THREE.SphereGeometry(14, 32, 32),
          new THREE.MeshStandardMaterial({
              map: textures.sunTexture,
              emissiveMap: textures.sunTexture,
              color: 0xffffff,
              emissive: 0xff6600,
              emissiveIntensity: 3, 
            })
          );
          solarGroup.add(sun);
      sunRef.current = sun;
      defaultSunScaleRef.current = sun.scale.clone();

      // Luz del sol
      const light = new THREE.PointLight(0xffffff, 7000, 500); 
      solarGroup.add(light);
      lightRef.current = light;
      defaultLightIntensityRef.current = light.intensity;
      
      light.castShadow = true;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.bias = -0.0005;
      light.shadow.radius = 6;

      // -----------------------------
      // ✨ Halo del Sol (Glow) - Color Ajustado
      // -----------------------------
  
      const haloMaterial = new THREE.SpriteMaterial({ 
          map: textures.haloTexture, 
          color: 0xF7EEB2,
          transparent: true, 
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
      });
      const halo = new THREE.Sprite(haloMaterial);
      halo.scale.set(45, 40, 1); 
      halo.position.copy(sun.position);
      halo.position.x = -1.2;
      solarGroup.add(halo);
      haloRef.current = halo;
      defaultHaloScaleRef.current = halo.scale.clone();

      // ➡️ LLAMADA: Creación de instancias (Efecto Secundario)
      const stars = addStars(2000, 500, scene, textures.destelloTexture);
  
      const starsObject = scene.children.find(obj => obj.type === 'Points');
      const starMaterial = starsObject ? starsObject.material : null;
      const originalStarSize = starMaterial ? starMaterial.size : 3;
  
      // ===============================================
      // 📏 CÓDIGO DE LA LÍNEA DE ÓRBITA (LLAMADA A LA FUNCION QUE ESTÁ FUERA DEL USEFFECT)
      // ===============================================
      const orbitPoints = [];
      const pointCount = 150;
      const minTime = -3; 
      const maxTime = 3; 
      const step = (maxTime - minTime) / pointCount;
  
      for (let i = 0; i <= pointCount; i++) {
          const t = minTime + i * step;
          const pos = getCometPosition(t); 
          orbitPoints.push(pos);
      }
  
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  
      const orbitMaterial = new THREE.LineBasicMaterial({
          color: 0xffff00,
          opacity:0,
          transparent: true
      });
  
      const cometOrbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      solarGroup.add(cometOrbitLine); 
  
      // ===============================================
      // ☄️ CÓDIGO DEL COMETA (NÚCLEO Y COLA)
      // ===============================================
  
      let cometOrbitTime = -3; 
      const cometSpeed = 0.005;
      const cometRadius = 0.3; 
      const cometBody = new THREE.Mesh(
          new THREE.SphereGeometry(cometRadius, 32, 32),
          new THREE.MeshStandardMaterial({
              color: 0xcccccc,
              emissive: 0xcccccc,
              emissiveIntensity: 1.5,
              transparent: true
          })
      );
  
      const cometGroup = new THREE.Group();
      solarGroup.add(cometGroup); 
      cometGroup.add(cometBody);
  
      const particleCount = 500; 
      const tailRadius = cometRadius * 2; 
      const particleLife = new Float32Array(particleCount); 
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);
      const particleAlphas = new Float32Array(particleCount);
      const tailColorStart = new THREE.Color(0xADD8E6); 
      const tailColorEnd = new THREE.Color(0x3366FF); 
  
      for (let i = 0; i < particleCount; i++) {
          const r = tailRadius * Math.sqrt(Math.random());
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = r * Math.cos(phi);
  
          particlePositions[i * 3] = x;
          particlePositions[i * 3 + 1] = y;
          particlePositions[i * 3 + 2] = z;
          particleLife[i] = Math.random() * 1.0; 
          tailColorStart.toArray(particleColors, i * 3);
          particleAlphas[i] = particleLife[i];
      }
  
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
      particleGeometry.setAttribute('alpha', new THREE.BufferAttribute(particleAlphas, 1));
  
      const particleMaterial = new THREE.PointsMaterial({
          size: 0.1, 
          vertexColors: true, 
          transparent: true,
          blending: THREE.AdditiveBlending, 
          depthWrite: false, 
      });
  
      const cometTail = new THREE.Points(particleGeometry, particleMaterial);
      cometGroup.add(cometTail);
      const cometDirection = new THREE.Vector3(); 
      const posAhead = new THREE.Vector3();
  
      // ----------------------------------------------------
      // ➡️ LLAMADA para añadir la Franja (LA FUNCION QUEDO FUERA COMO BUENA PRACTICA)
      // ----------------------------------------------------
      const milkyWayFranja = addMilkyWayFranja(scene, textures.franjaTexture);
  
      // ----------------------------------------------------
      // ➡️ LLAMADA: Carga y añade la Estela 
      // ----------------------------------------------------
      const glowHalo = addGlowHalo(scene, textures.haloFranjaTexture);
  
      let animationTime = 0;
      let animationTime2 = 0;
      // AVISO: Debes asegurarte de que 'estrella2Texture' esté definida y cargada.
      addFranjaStars(
        1000, 
        milkyWayFranja, 
        scene, 
        textures.destelloTexture,
        textures.estrella2Texture, // ¡Nuevo argumento añadido!
        Franja
      ).then(starsMeshes => {
        franjaStarsMesh1Ref.current = starsMeshes[0]; 
        franjaStarsMesh2Ref.current = starsMeshes[1]; 
      });
          
      const DEG = THREE.MathUtils.degToRad;
      
      // -----------------------------
      // 🪐 Planeta 1 Mercurio
      // -----------------------------
      const orbitRadius1 = 20;
      const planet1 = new THREE.Mesh(
          new THREE.SphereGeometry(1.2, 32, 32),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x594D3C,
            emissiveIntensity: 0.5,
            map: textures.mercuryTexture,
          })
      );
    
      mercuryRef.current = planet1; 

      const orbitGroup1 = new THREE.Group();

      setPlanetOrbitPosition(planet1, orbitRadius1, DEG(35));
      orbitGroup1.rotation.x = 0.5;
      orbitGroup1.add(planet1);
      solarGroup.add(orbitGroup1);
    
      const orbitLine1 = new THREE.RingGeometry(orbitRadius1, orbitRadius1 + 0.2, 64); 
      const orbitMat1 = new THREE.MeshBasicMaterial({
          color: 0xcccccc,
          opacity: 0.1,
          transparent: true,
          side: THREE.DoubleSide,
      });
      const orbitMesh1 = new THREE.Mesh(orbitLine1, orbitMat1);
      orbitMesh1.rotation.x = Math.PI / 2 + 0.5;
      solarGroup.add(orbitMesh1);

      // -----------------------------
      // 🛰️ SATÉLITE MEJORADO (Ajuste Final de Geometría y Materiales)
      // -----------------------------
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envMap = pmremGenerator.fromEquirectangular(textures.spaceTexture).texture;
      textures.spaceTexture.dispose();
      pmremGenerator.dispose();

      const satelliteOrbitRadius = 25;
      const satelliteOrbitGroup = new THREE.Group();
      satelliteOrbitGroup.rotation.x = 0.5;
      const satellite = new THREE.Group();

      /* =============================
          MATERIALES COMUNES
      ============================= */
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xd6d8da,      // gris aluminio claro
        metalness: 0.6,
        roughness: 0.35,
        emissive: 0xd6d8da,
        emissiveIntensity: 0.08, 
      }); 

      const metallicBodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xd6d8da,   // aluminio
        metalness: 0.85,   // bien metálico
        roughness: 0.25,   // reflejo suave (no espejo)
        envMap: envMap,
        envMapIntensity: 1.0,
      }); 

      /* =============================
          CUERPO CENTRAL (Orientación corregida en Z)
      ============================= */
      const mainBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32), 
          metallicBodyMaterial
      );
      mainBody.rotation.x = Math.PI / 2;  
      satellite.add(mainBody);

      const ringGeometry = new THREE.TorusGeometry(0.5, 0.08, 16, 32); 
      const ring1 = new THREE.Mesh(ringGeometry, metallicBodyMaterial); 
      ring1.position.z = -0.6; 
      satellite.add(ring1);
      const ring2 = ring1.clone();
      ring2.position.z = 0.6; 
      satellite.add(ring2);
      // Interior dorado (foil)
      const dishInnerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xd4af37,        // dorado real
        metalness: 1.0,
        roughness: 0.25,
        envMap: envMap,
        envMapIntensity: 1.3,
        side: THREE.FrontSide,
      });

      // Exterior claro
      const dishOuterMaterial = new THREE.MeshStandardMaterial({
        color: 0xf2f2f2,
        metalness: 0.6,
        roughness: 0.4,
        side: THREE.BackSide,
      });

      /* =============================
        🟦 PANELES SOLARES (REJILLA EXACTA)
      ============================= */
      const supportArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.4, 12),
        bodyMaterial
      );
      supportArm.rotation.z = Math.PI / 2;

      function createSolarPanel() {
        const panelGroup = new THREE.Group();
        const panelArm = supportArm.clone();
        panelArm.position.x = 0.6;
        panelGroup.add(panelArm);

        // =============================
        // PANEL BASE
        // =============================
        const panelGeometry = new THREE.PlaneGeometry(2.2,0.9,5,2);

        const panelMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x0b1e3a,       
          metalness: 0.0,      
          roughness: 0.15,    
          envMap: envMap,       
          envMapIntensity: 1.2,
          clearcoat: 1.0,        
          clearcoatRoughness: 0.08,
          reflectivity: 0.9,
          side: THREE.DoubleSide,
        }); 
        const panelBase = new THREE.Mesh(panelGeometry, panelMaterial);
        panelBase.position.x = 1.9;
        panelGroup.add(panelBase);

      // =============================
      // REJILLA GRUESA (AMBAS CARAS)
      // =============================
      const cols = 5;
      const rows = 2;
      
      const width = 2.2;
      const height = 0.9;
      const thickness = 0.05; 

      const gridMaterial = new THREE.MeshStandardMaterial({
        color: 0x3fa9f5,      // azul claro técnico
        emissive: 0x3fa9f5,
        emissiveIntensity: 0.35,
        side: THREE.DoubleSide,
      }); 

      const subGridMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });

      function createGrid(zOffset) {
        const gridGroup = new THREE.Group();

        // Líneas verticales
        for (let i = 0; i <= cols; i++) {
          const x = -width / 2 + (i / cols) * width;

          const line = new THREE.Mesh(
            new THREE.PlaneGeometry(thickness, height),
            gridMaterial
          );
          line.position.set(x, 0, zOffset);
          gridGroup.add(line);
        }

        // Líneas horizontales
        for (let j = 0; j <= rows; j++) {
          const y = -height / 2 + (j / rows) * height;

          const line = new THREE.Mesh(
            new THREE.PlaneGeometry(width, thickness),
            gridMaterial
          );
          line.position.set(0, y, zOffset);
          gridGroup.add(line);
        }

        return gridGroup;
      }

      function createSubGrid(zOffset) {
        const subGrid = new THREE.Group();

        const subCols = cols * 4; // subdivisiones internas
        const subRows = rows * 4;

        const thin = 0.008; // 🔥 muy delgado

        // verticales
        for (let i = 0; i <= subCols; i++) {
          const x = -width / 2 + (i / subCols) * width;

          const line = new THREE.Mesh(
            new THREE.PlaneGeometry(thin, height),
            subGridMaterial
          );
          line.position.set(x, 0, zOffset);
          subGrid.add(line);
        }

        // horizontales
        for (let j = 0; j <= subRows; j++) {
          const y = -height / 2 + (j / subRows) * height;

          const line = new THREE.Mesh(
            new THREE.PlaneGeometry(width, thin),
            subGridMaterial
          );
          line.position.set(0, y, zOffset);
          subGrid.add(line);
        }

        return subGrid;
      }

      // Rejilla y subrejillas frontal y trasera
      panelBase.add(createGrid(0.002));
      panelBase.add(createGrid(-0.002));
      panelBase.add(createSubGrid(0.004));
      panelBase.add(createSubGrid(-0.004));

        return panelGroup;
      }

      // =============================
      // PANEL IZQUIERDO
      // =============================
      const leftPanel = createSolarPanel();
      leftPanel.rotation.y = Math.PI;
      satellite.add(leftPanel);

      // =============================
      // PANEL DERECHO
      // =============================
      const rightPanel = createSolarPanel();
      satellite.add(rightPanel);


      /* =============================
          ANTENA PARABÓLICA (Ajustada para visibilidad)
      ============================= */
      const dishArm = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.6, 12),
          bodyMaterial
      );  
      dishArm.rotation.x = Math.PI / 2; 
      dishArm.position.set(0, 0, 0.9); 
      satellite.add(dishArm);

      const feedhorn = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.15, 16),
        metallicBodyMaterial  
      );  
      feedhorn.rotation.x = Math.PI/2; 
      feedhorn.position.set(0, 0, 1.25); 
      satellite.add(feedhorn); 
      
      const dishGeometry = new THREE.SphereGeometry(0.7,32,32,0,Math.PI * 2,0,Math.PI * 0.3);
      // Cara interior
      const dishInner = new THREE.Mesh(dishGeometry, dishInnerMaterial);
      dishInner.rotation.x = -Math.PI / 2;
      dishInner.position.set(0, 0, 1.5);
      satellite.add(dishInner);

      // Cara exterior
      const dishOuter = new THREE.Mesh(dishGeometry, dishOuterMaterial);
      dishOuter.rotation.x = -Math.PI / 2;
      dishOuter.position.set(0, 0, 1.5);
      dishOuter.scale.set(1.01, 1.01, 1.01); // evita z-fighting
      satellite.add(dishOuter);

      /* =============================
          BRAZO DEL SENSOR (CONECTOR)
      ============================= */
      const sensorArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.45, 12),
        metallicBodyMaterial 
      );
      sensorArm.position.set(0, 0.575, 0);
      satellite.add(sensorArm);
      
      /* =============================
          SENSOR / CÁMARA (Luz superior)
      ============================= */
      const sensor = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16), 
          new THREE.MeshStandardMaterial({
            color: 0x050505,        // casi negro
            metalness: 0.0,
            roughness: 0.15,
            transmission: 0.6,     // vidrio
            thickness: 0.05,
            emissive: 0x0a2a2a,     // cian MUY oscuro
            emissiveIntensity: 0.3,
            envMap: envMap,
            envMapIntensity: 0.6, 
          }) 
      );
      sensor.position.set(0, 0.65 + 0.25, 0); 
      satellite.add(sensor);

      const radioWaves = new THREE.Group();
      sensor.add(radioWaves);

      function createRadioWave() {
        const waveGeometry = new THREE.SphereGeometry(0.12, 24, 24);
        const waveMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.35,
          depthWrite: false,
        });

        const wave = new THREE.Mesh(waveGeometry, waveMaterial);

        wave.userData = {
          scale: 1,
          speed: 0.02,
        };

        radioWaves.add(wave);
      }

      setInterval(createRadioWave, 800);

      /* =============================
          ESCALA Y POSICIÓN ORBITAL
      ============================= */
      satellite.scale.set(0.6, 0.6, 0.6);
      setPlanetOrbitPosition(satellite, satelliteOrbitRadius, DEG(80));
      satelliteOrbitGroup.add(satellite);
      solarGroup.add(satelliteOrbitGroup);

      satelliteRef.current = satellite;
      satelliteOrbitRef.current = satelliteOrbitGroup;

      /* =============================
         GRUPO DE LOGOS (OPCIONAL)
      ============================= */
      const logosGroup = new THREE.Group();
      logosGroup.name = "logosGroup";
      logosGroup.visible = false;
      satellite.add(logosGroup); 

      // -----------------------------
      // Planeta 2 Venus
      // -----------------------------
      const orbitRadius2 = 30;
      const planet2 = new THREE.Mesh(
        new THREE.SphereGeometry(3.2, 32, 32),
        new THREE.MeshStandardMaterial({
          color: 0xffa500,
          emissive: 0x524738,
          emissiveIntensity: 0.5, 
          map: textures.venusTexture,
          emissiveMap: textures.venusTexture,
        })
      );
  
      const orbitGroup2 = new THREE.Group();
      orbitGroup2.rotation.x = 0.5;
      // ángulo inicial de Venus (elige uno distinto a Mercurio)
      setPlanetOrbitPosition(planet2, orbitRadius2, DEG(120));

      orbitGroup2.add(planet2);
      solarGroup.add(orbitGroup2);
  
      const orbitLine2 = new THREE.RingGeometry(orbitRadius2, orbitRadius2 + 0.2, 64); // <--- Usando la constante
      const orbitMat2 = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.1,
        transparent: true,
        side: THREE.DoubleSide,
      });

      venusRef.current = planet2;

      const orbitMesh2 = new THREE.Mesh(orbitLine2, orbitMat2);
      orbitMesh2.rotation.x = Math.PI / 2 + 0.5;
      solarGroup.add(orbitMesh2);
  
      // -----------------------------
      // Planeta 3 Tierra
      // -----------------------------
      const orbitRadius3 = 40.0;
      const planet3 = new THREE.Mesh(
          new THREE.SphereGeometry(3.4, 32, 32),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x47515E,
            emissiveIntensity: 0.35, 
            map: textures.tierraDia,
            emissiveMap: textures.tierraDia,
          })
      );
      planet3.castShadow = true;
      planet3.receiveShadow = true;

      const cityGeometry = new THREE.SphereGeometry(3.42, 64, 64);
      const cityLightsMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          nightMap: { value: textures.tierraNoche },
          sunDirection: { value: new THREE.Vector3() }
        },
        vertexShader: `
          varying vec3 vWorldNormal;
          varying vec2 vUv;
      
          void main() {
            vUv = uv;
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D nightMap;
          uniform vec3 sunDirection;
      
          varying vec3 vWorldNormal;
          varying vec2 vUv;
      
          void main() {
            // 🌞 Día / noche real
            float NdotL = dot(normalize(vWorldNormal), normalize(sunDirection));
            float nightFactor = smoothstep(0.0, -0.15, NdotL);
      
            // 🌆 Mapa de ciudades
            float cityMask = texture2D(nightMap, vUv).r;
      
            // 💡 Intensidad final
            float intensity = cityMask * nightFactor;
      
            vec3 cityColor = vec3(1.0, 0.75, 0.4); // dorado cálido
      
            gl_FragColor = vec4(cityColor * intensity, intensity);
          }
        `
      });
      const cityLights = new THREE.Mesh(cityGeometry, cityLightsMaterial);
      planet3.add(cityLights);
      
      // --- 🌙 Creación de la Luna ---
      const moonRadius = 0.5; 
      const moon = new THREE.Mesh(
          new THREE.SphereGeometry(moonRadius, 32, 32),
          new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            emissive: 0x575757,
            map: textures.lunaTexture, 
            emissiveIntensity: 0.5, 
            emissiveMap: textures.lunaTexture,
          })
      );
      moon.castShadow = true;
      const moonOrbitGroup = new THREE.Group();
      const moonOrbitRadius = 5.0; 
      moon.position.x = moonOrbitRadius; 
      moonOrbitGroup.add(moon);
      planet3.add(moonOrbitGroup);
  
      const orbitGroup3 = new THREE.Group();
      orbitGroup3.rotation.x = 0.5;
      setPlanetOrbitPosition(planet3, orbitRadius3, DEG(210));
      orbitGroup3.add(planet3);
      solarGroup.add(orbitGroup3);
  
      const orbitLine3 = new THREE.RingGeometry(orbitRadius3, orbitRadius3 + 0.2, 64);
      const orbitMat3 = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.1, 
          transparent: true,
          side: THREE.DoubleSide,
      });
      earthRef.current = planet3;

      // -----------------------------
      // Atmósfera terrestre
      // -----------------------------
      const atmosphereGeometry = new THREE.SphereGeometry(3.5, 32, 32);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x4da6ff,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide, 
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      planet3.add(atmosphere);

      // aurora
      const auroraGeometry = new THREE.SphereGeometry(3.55, 64, 64);
      const auroraMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          auroraMap: { value: textures.auroraTexture },
          sunDirection: { value: new THREE.Vector3() }
        },
        vertexShader: `
          varying vec3 vWorldNormal;
          varying vec2 vUv;
      
          void main() {
            vUv = uv;
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D auroraMap;
          uniform vec3 sunDirection;
      
          varying vec3 vWorldNormal;
          varying vec2 vUv;
      
          void main() {
            // 🌞 Día / noche real
            float NdotL = dot(normalize(vWorldNormal), normalize(sunDirection));
            float nightFactor = smoothstep(0.0, -0.25, NdotL);
      
            // 🧲 Latitud polar
            float latitude = dot(normalize(vWorldNormal), vec3(0.0, 1.0, 0.0));
            float polarBand = smoothstep(0.45, 0.7, abs(latitude));
      
            // 🌌 Ruido auroral
            float noise = texture2D(auroraMap, vUv).r;
      
            // 🌙 Aurora solo en noche + polos
            float auroraMask = polarBand * nightFactor * noise;
      
            // 🎨 Color aurora
            vec3 auroraColor = mix(
              vec3(0.2, 0.6, 1.0),
              vec3(0.3, 1.0, 0.6),
              noise
            );
      
            gl_FragColor = vec4(auroraColor * auroraMask, auroraMask);
          }
        `
      });
      const aurora = new THREE.Mesh(auroraGeometry, auroraMaterial);
      planet3.add(aurora);
      

      // nubes
      const cloudsGeometry = new THREE.SphereGeometry(3.45, 64, 64);
      const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: textures.nubesTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      roughness: 1.0,
      metalness: 0.0,
      emissive: new THREE.Color(0x000000),
      });
      const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
      planet3.add(clouds);

      const orbitMesh3 = new THREE.Mesh(orbitLine3, orbitMat3);
      orbitMesh3.rotation.x = Math.PI / 2 + 0.5;
      solarGroup.add(orbitMesh3);

      // -----------------------------
      // Planeta 4 Marte
      // -----------------------------
      const orbitRadius4 = 50.0;
      const planet4 = new THREE.Mesh(
          new THREE.SphereGeometry(3.2, 32, 32),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x5E2A2A,
            emissiveIntensity: 0.9, 
            map: textures.marteTexture,
            emissiveMap: textures.marteTexture,
          })
      );
  
      const orbitGroup4 = new THREE.Group();
      orbitGroup4.rotation.x = 0.5; 
      setPlanetOrbitPosition(planet4, orbitRadius4, DEG(300)); 
      orbitGroup4.add(planet4);
      solarGroup.add(orbitGroup4);

      marsRef.current = planet4;

      const orbitLine4 = new THREE.RingGeometry(orbitRadius4, orbitRadius4 + 0.2, 64);
      const orbitMat4 = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.1,
          transparent: true,
          side: THREE.DoubleSide,
      });
      const orbitMesh4 = new THREE.Mesh(orbitLine4, orbitMat4);
      orbitMesh4.rotation.x = Math.PI / 2 + 0.5; 
      solarGroup.add(orbitMesh4);
  
      // -----------------------------
      // Cinturon de asteroides
      // -----------------------------
      const ASTEROID_COUNT = 8000;
      const MARS_ORBIT_RADIUS = 52.0; 
      const JUPITER_ORBIT_RADIUS = 60.0; 
      const ASTEROID_INNER_RADIUS = MARS_ORBIT_RADIUS + 2.0;
      const ASTEROID_OUTER_RADIUS = JUPITER_ORBIT_RADIUS - 2.0; 
      const ASTEROID_VERTICAL_SPREAD = 1.0;
      const positions = new Float32Array(ASTEROID_COUNT * 3); 
  
      for (let i = 0; i < ASTEROID_COUNT; i++) {
          const randomRadius = Math.random() * (ASTEROID_OUTER_RADIUS - ASTEROID_INNER_RADIUS) + ASTEROID_INNER_RADIUS;
          const randomAngle = Math.random() * Math.PI * 2;
          const x = Math.cos(randomAngle) * randomRadius;
          const z = Math.sin(randomAngle) * randomRadius;
          const y = (Math.random() - 0.5) * ASTEROID_VERTICAL_SPREAD;
          positions[i * 3 + 0] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z; 
      }
  
      const asteroidGeometry = new THREE.BufferGeometry();
      asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
      const asteroidMaterial = new THREE.PointsMaterial({
          color: 0xffffff,  
          size: 0.1,          
          sizeAttenuation: true ,
          map: textures.asteroidesTexture,
      });
  
      const asteroidBelt = new THREE.Points(asteroidGeometry, asteroidMaterial);
      asteroidBelt.rotation.x = 0.5;
  
      solarGroup.add(asteroidBelt);
  
      // -----------------------------
      // Planeta 5 Jupiter
      // -----------------------------
      const orbitRadius5 = 65.0; 
      const planet5 = new THREE.Mesh(
          new THREE.SphereGeometry(5.2, 32, 32),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x545353,
            emissiveIntensity: 0.9, 
            map: textures.jupiterTexture,
            emissiveMap: textures.jupiterTexture,
          })
      );
  
      const orbitGroup5 = new THREE.Group();
      orbitGroup5.rotation.x = 0.5; 
      setPlanetOrbitPosition(planet5, orbitRadius5, DEG(210));
      orbitGroup5.add(planet5);
      solarGroup.add(orbitGroup5);
  
      const orbitLine5 = new THREE.RingGeometry(orbitRadius5, orbitRadius5 + 0.2, 64);
      const orbitMat5 = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.1,
          transparent: true,
          side: THREE.DoubleSide,
      });
      const orbitMesh5 = new THREE.Mesh(orbitLine5, orbitMat5);
      orbitMesh5.rotation.x = Math.PI / 2 + 0.5;
      solarGroup.add(orbitMesh5);
  
      // -----------------------------
      // Planeta 6 Saturno (Estructura con Grupo de Rotación)
      // -----------------------------
      const orbitRadius6 = 80.0; 
      const planet6 = new THREE.Mesh(
          new THREE.SphereGeometry(3.8, 32, 32),
          new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: 0x545353,
              emissiveIntensity: 0.5, 
              map: textures.saturnoTexture,
              emissiveMap: textures.saturnoTexture,
          })
      );
  
      const planetRotationGroup6 = new THREE.Group();
      planetRotationGroup6.add(planet6); 
  
      const orbitGroup6 = new THREE.Group();
      orbitGroup6.rotation.x = 0.5; 
      orbitGroup6.rotation.y = DEG(26.7);
      planetRotationGroup6.position.x = orbitRadius6; 
      orbitGroup6.add(planetRotationGroup6);
      solarGroup.add(orbitGroup6);
  
      // -----------------------------
      // Línea de Órbita (sin cambios)
      // -----------------------------
      const orbitLine6 = new THREE.RingGeometry(orbitRadius6, orbitRadius6 + 0.2, 64);
      const orbitMat6 = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.1,
          transparent: true,
          side: THREE.DoubleSide,
      });
      const orbitMesh6 = new THREE.Mesh(orbitLine6, orbitMat6);
      orbitMesh6.rotation.x = Math.PI / 2 + 0.5;
      solarGroup.add(orbitMesh6);
  
  
      // -----------------------------
      // Anillos de Saturno (Fijos en Inclinación)
      // -----------------------------
      const planetRadius = 3.8; 
      const innerRing = planetRadius * 1.3;
      const outerRing = planetRadius * 2.2;
      const ringsGeometry = new THREE.RingGeometry(innerRing, outerRing, 64);
      const ringsMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffffff, 
          emissive: 0xE0E0E0,
          emissiveIntensity: 0.5, 
          opacity:0.9,
          map: textures.saturnoRingTexture, 
          emissiveMap: textures.saturnoRingTexture, 
          side: THREE.DoubleSide, 
          transparent: true,    
          depthWrite: false,     
          alphaTest: 0.05,
      });
  
      const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);
      rings.rotation.x = Math.PI / 2; 

      planetRotationGroup6.add(rings);
  
      // -----------------------------
      // 🪐 Planeta 7 Urano
      // -----------------------------
      const planetRadius7 = 3.2; 
      const innerRing7 = planetRadius7 * 1.5;
      const outerRing7 = planetRadius7 * 3.5;
      const orbitRadius7 = 94.0;
      const planet7 = new THREE.Mesh(
          new THREE.SphereGeometry(3.2, 32, 32),
          new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: 0x4A6363,
              emissiveIntensity: 0.5, 
              map: textures.uranoTexture,
              emissiveMap: textures.uranoTexture,
          })
      );
  
      const planetRotationGroup7 = new THREE.Group();
      planetRotationGroup7.add(planet7); 
  
      const orbitGroup7 = new THREE.Group();
      orbitGroup7.rotation.x = 0.5;
      orbitGroup7.rotation.y = DEG(340);
      orbitGroup7.add(planetRotationGroup7); 
      solarGroup.add(orbitGroup7);
      planetRotationGroup7.position.x = orbitRadius7;
  
      // -----------------------------
      // 📐 Línea de Órbita (sin cambios)
      // -----------------------------
      const orbitLine7 = new THREE.RingGeometry(orbitRadius7, orbitRadius7 + 0.2, 64);
      const orbitMat7 = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.1,
          transparent: true,
          side: THREE.DoubleSide,
      });
      const orbitMesh7 = new THREE.Mesh(orbitLine7, orbitMat7);
      orbitMesh7.rotation.x = Math.PI / 2 + 0.5;
      solarGroup.add(orbitMesh7);
  
      // -----------------------------
      // 🪐 Anillos de Urano (Fijos en Inclinación)
      // -----------------------------
      const ringsGeometry7 = new THREE.RingGeometry(innerRing7, outerRing7, 64);
  
      const ringsMaterial7 = new THREE.MeshStandardMaterial({ 
          color: 0xffffff, 
          emissive: 0xffffff,
          emissiveIntensity: 0.5, 
          opacity:0.2,
          map: textures.uranoRingTexture, 
          emissiveMap: textures.uranoRingTexture, 
          side: THREE.DoubleSide, 
          transparent: true,     
          depthWrite: false,     
      });
  
      const rings7 = new THREE.Mesh(ringsGeometry7, ringsMaterial7);
      rings7.rotation.x = Math.PI / 2; 
      rings7.position.x = orbitRadius7; 
      orbitGroup7.add(rings7);
  
      // -----------------------------
      // 🪐 Planeta 8 Neptuno (Estructura con Grupo de Rotación y Anillos)
      // -----------------------------
      const orbitRadius8 = 105.0; 
      const planet8Radius = 3.2; 
      const planet8 = new THREE.Mesh(
          new THREE.SphereGeometry(planet8Radius, 32, 32),
          new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: 0x4A6363,
              emissiveIntensity: 0.9, 
              map: textures.neptunoTexture,
              emissiveMap: textures.neptunoTexture,
          })
      );
  
      const planetRotationGroup8 = new THREE.Group();
      planetRotationGroup8.add(planet8);
      planetRotationGroup8.position.x = orbitRadius8; 
      const orbitGroup8 = new THREE.Group();
      orbitGroup8.rotation.x = 0.5; 
      orbitGroup8.add(planetRotationGroup8);
      solarGroup.add(orbitGroup8);
  
      // -----------------------------
      // 🪐 Anillos de Neptuno
      // -----------------------------
      const neptunoInnerRing = planet8Radius * 1.6; 
      const neptunoOuterRing = planet8Radius * 2;
      const ringsGeometry8 = new THREE.RingGeometry(neptunoInnerRing, neptunoOuterRing, 64);
      const ringsMaterial8 = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0xffffff,
        emissiveIntensity: 0.5, 
        opacity:0.5,
        map: textures.neptunoRingTexture, 
        emissiveMap: textures.neptunoRingTexture, 
        side: THREE.DoubleSide, 
        transparent: true,     
        depthWrite: false,  
      });
  
      const rings8 = new THREE.Mesh(ringsGeometry8, ringsMaterial8);
      rings8.rotation.x = Math.PI / 2; 
      
      planetRotationGroup8.add(rings8);
  
      // -----------------------------
      // 📐 Línea de Órbita (sin cambios, solo usando 'orbitRadius8')
      // -----------------------------
      const orbitLine8 = new THREE.RingGeometry(orbitRadius8, orbitRadius8 + 0.2, 64);
      const orbitMat8 = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.1,
          transparent: true,
          side: THREE.DoubleSide,
      });
      const orbitMesh8 = new THREE.Mesh(orbitLine8, orbitMat8);
      orbitMesh8.rotation.x = Math.PI / 2 + 0.5;
      solarGroup.add(orbitMesh8);
  
      // -----------------------------
      // 🪐 Cinturon externo del sistema solar
      // -----------------------------
      const KUIPER_COUNT = 16000;
      const NEPTUNE_ORBIT_RADIUS = 105.0; 
      const KUIPER_INNER_RADIUS = NEPTUNE_ORBIT_RADIUS + 5.0; 
      const KUIPER_OUTER_RADIUS = 150.0;
      const KUIPER_VERTICAL_SPREAD = 3.0;
      const kuiperPositions = new Float32Array(KUIPER_COUNT * 3); 
  
      for (let i = 0; i < KUIPER_COUNT; i++) {
          const randomRadius = Math.random() * (KUIPER_OUTER_RADIUS - KUIPER_INNER_RADIUS) + KUIPER_INNER_RADIUS;
          const randomAngle = Math.random() * Math.PI * 2;
          const x = Math.cos(randomAngle) * randomRadius;
          const z = Math.sin(randomAngle) * randomRadius;
          const y = (Math.random() - 0.5) * KUIPER_VERTICAL_SPREAD;
          kuiperPositions[i * 3 + 0] = x;
          kuiperPositions[i * 3 + 1] = y; 
          kuiperPositions[i * 3 + 2] = z;
      }
  
      const kuiperGeometry = new THREE.BufferGeometry();
      kuiperGeometry.setAttribute('position', new THREE.BufferAttribute(kuiperPositions, 3));
      const kuiperMaterial = new THREE.PointsMaterial({
        color: 0xffffff,  
        size: 0.1,          
        sizeAttenuation: true ,
        map: textures.asteroidesTexture,
      });
  
      const kuiperBelt = new THREE.Points(kuiperGeometry, kuiperMaterial);
      kuiperBelt.rotation.x = 0.5;
      solarGroup.add(kuiperBelt);
  
      function animate() {
        requestAnimationFrame(animate);

        // movimiento sutil de nubes
        clouds.rotation.y += 0.00015;

        // aparicion de aurora en ciertas regiones
        const sunPos = new THREE.Vector3();
        sunRef.current.getWorldPosition(sunPos);
        const earthPos = new THREE.Vector3();
        planet3.getWorldPosition(earthPos);
        const sunDir = sunPos.sub(earthPos).normalize();
        auroraMaterial.uniforms.sunDirection.value.copy(sunDir);
        
        // iluminacion de puntos en planetas
        cityLightsMaterial.uniforms.sunDirection.value.copy(
          auroraMaterial.uniforms.sunDirection.value
        );

        radioWaves.children.forEach((wave, i) => {
            wave.userData.scale += wave.userData.speed;
            const s = wave.userData.scale;
            wave.scale.set(s, s, s);
            wave.material.opacity -= 0.004;
            if (wave.material.opacity <= 0) {
              radioWaves.remove(wave);
              wave.geometry.dispose();
              wave.material.dispose();
            }
        });

        const t = performance.now() * 0.001;
        leftPanel.rotation.z = Math.sin(t) * 0.05;
        rightPanel.rotation.z = -leftPanel.rotation.z; 

        if (!freezeSatelliteOrbitRef.current) {
            satelliteOrbitRef.current.rotation.y += 0.005; 
        }
    
        if (followSatelliteRef.current) {
          const camera = cameraRef.current;
          const satellite = satelliteRef.current;
        
          if (!camera || !satellite) return;
        
          const satPos = new THREE.Vector3();
          satellite.getWorldPosition(satPos);
        
          const isMobile = window.innerWidth <= 768;
        
          const CAM_OFFSET = isMobile
            ? new THREE.Vector3(0, 1.5, 6)
            : new THREE.Vector3(0, 1.2, 5);
        
          const LOOK_OFFSET = isMobile
            ? new THREE.Vector3(0, -1.5, 0)
            : new THREE.Vector3(0, 0, 0);
        
          const desiredCamPos = satPos.clone().add(CAM_OFFSET);
          camera.position.lerp(desiredCamPos, 0.08);
        
          const customLookAt = satPos.clone().add(LOOK_OFFSET);
          camera.lookAt(customLookAt);
        }
        
        const sunPosition = new THREE.Vector3();
        solarGroupRef.current.getWorldPosition(sunPosition); 
        satelliteRef.current.lookAt(sunPosition);
          
        if (followMercuryRef.current) {
          const camera = cameraRef.current;
          const mercury = mercuryRef.current;

          const mercuryPos = new THREE.Vector3();
          mercury.getWorldPosition(mercuryPos);

          const isMobile = window.innerWidth <= 768;
          const CAM_OFFSET  = isMobile ? new THREE.Vector3(0, 0, 4) : new THREE.Vector3(3, 2, 7);
          const LOOK_OFFSET = isMobile ? new THREE.Vector3(0, -1.2, 0) : new THREE.Vector3(3.5, -1.5, 0);

          const desiredCamPos = mercuryPos.clone().add(CAM_OFFSET);
          camera.position.lerp(desiredCamPos, 0.05);

          const customLookAt = mercuryPos.clone().add(LOOK_OFFSET);
          camera.lookAt(customLookAt);
        }

        if (followVenusRef.current) {
          const camera = cameraRef.current;
          const venus = venusRef.current;

          if (!camera || !venus) return;
          const venusPos = new THREE.Vector3();
          venus.getWorldPosition(venusPos);

          const isMobile = window.innerWidth <= 768;

          const CAM_OFFSET = isMobile ? new THREE.Vector3(0, -2, 8) : new THREE.Vector3(15, 5, 15);
          const LOOK_OFFSET = isMobile ? new THREE.Vector3(0, -2, 0) : new THREE.Vector3(10, -2, 0);

          const desiredCamPos = venusPos.clone().add(CAM_OFFSET);
          camera.position.lerp(desiredCamPos, 0.05);

          const customLookAt = venusPos.clone().add(LOOK_OFFSET);
          camera.lookAt(customLookAt);
        }
                            
        if (followEarthRef.current) {
          const camera = cameraRef.current;
          const earth = earthRef.current;

          if (!camera || !earth) return;

          const earthPos = new THREE.Vector3();
          earth.getWorldPosition(earthPos);

          const isMobile = window.innerWidth <= 768;

          const CAM_OFFSET = isMobile ? new THREE.Vector3(0, 0, 10) : new THREE.Vector3(18, 6, 15);
          const LOOK_OFFSET = isMobile ? new THREE.Vector3(0, -3, 0) : new THREE.Vector3(12, -2, 0);

          const desiredCamPos = earthPos.clone().add(CAM_OFFSET);
          camera.position.lerp(desiredCamPos, 0.05);

          const customLookAt = earthPos.clone().add(LOOK_OFFSET);
          camera.lookAt(customLookAt);
        }
                            
        if (followMarsRef.current) {
          const camera = cameraRef.current;
          const mars = marsRef.current;

          if (!camera || !mars) return;

          const marsPos = new THREE.Vector3();
          mars.getWorldPosition(marsPos);

          const isMobile = window.innerWidth <= 768;

          const CAM_OFFSET = isMobile ? new THREE.Vector3(0, 0, 12) : new THREE.Vector3(18, 6, 15);
          const LOOK_OFFSET = isMobile ? new THREE.Vector3(0, -3, 0) : new THREE.Vector3(12, -2, 0);

          const desiredCamPos = marsPos.clone().add(CAM_OFFSET);
          camera.position.lerp(desiredCamPos, 0.05);

          const customLookAt = marsPos.clone().add(LOOK_OFFSET);
          camera.lookAt(customLookAt);
        }
               
        planet1.rotation.y += 0.008;
        if (!freezeMercuryOrbitRef.current) {
            orbitGroup1.rotation.y += 0.004;
        }

        planet2.rotation.y += 0.008;
        if (!freezeVenusOrbitRef.current) {
            orbitGroup2.rotation.y += 0.003;
        }
    
        planet3.rotation.y += 0.008;

        if (!freezeEarthOrbitRef.current) {
            orbitGroup3.rotation.y += 0.002;
        }
    
          // ===============================================
          // ☄️ ACTUALIZACIÓN DE POSICIÓN DEL COMETA
          // ===============================================
    
          cometOrbitTime += cometSpeed;
    
          if (cometOrbitTime > 3) {
              cometOrbitTime = -3;
          }
    
          const newPos = getCometPosition(cometOrbitTime);
          const lookAheadTime = cometOrbitTime + 0.01;
          posAhead.copy(getCometPosition(lookAheadTime));
          cometDirection.subVectors(posAhead, newPos).normalize();
          cometGroup.position.copy(newPos);
    
          // ===============================================
          // 🌠 ANIMACIÓN DE PARTÍCULAS DE LA COLA (ACTUALIZADA Y RECTA)
          // ===============================================
          
          const tailPowerMultiplier = 25;
          const resetDistance = 5; 
          const lifeDecreaseRate = 0.0003; 
          const deltaTime = 1 / 60; 
          const moveFactor = tailPowerMultiplier * deltaTime;
          const regenerationProbability = 0.005;
    
          for (let i = 0; i < particleCount; i++) {
                  const i3 = i * 3;
    
                  let x = particlePositions[i3];
                  let y = particlePositions[i3 + 1];
                  let z = particlePositions[i3 + 2];
    
                  // MOVIMIENTO TANGENCIAL
                  x += -cometDirection.x * moveFactor; 
                  y += -cometDirection.y * moveFactor;
                  z += -cometDirection.z * moveFactor;
    
                  // Actualizar la vida/transparencia y color
                  particleLife[i] -= lifeDecreaseRate * (Math.random() + 0.5); 
    
                  // ----------------------------------------------------------------------
                  // **CORRECCIÓN CLAVE: EMISIÓN PROBABILÍSTICA**
                  // ----------------------------------------------------------------------
                  // Si la vida termina O si se ha ido demasiado lejos:
                  if (particleLife[i] <= 0 || (x * x + y * y + z * z > resetDistance * resetDistance)) {
                      
                      // **Revisar si la partícula debe regenerarse en este frame**
                      if (Math.random() < regenerationProbability) {
                          // Regenerar solo una pequeña parte de las partículas "muertas" por frame
                          
                          particleLife[i] = 1.0; 
    
                          // Resetear la posición cerca del núcleo (emisión)
                          const r = tailRadius * Math.random();
                          const theta = Math.random() * Math.PI * 2;
                          const phi = Math.acos(2 * Math.random() - 1);
    
                          x = r * Math.sin(phi) * Math.cos(theta);
                          y = r * Math.sin(phi) * Math.sin(theta);
                          z = r * Math.cos(phi);
                          
                      } else {
                          particleLife[i] = 0.0001;
                          x = y = z = 0; 
                      }
                  }
    
                  const t = 1.0 - particleLife[i];
                  const color = new THREE.Color().lerpColors(tailColorStart, tailColorEnd, t);
    
                  particlePositions[i3] = x;
                  particlePositions[i3 + 1] = y;
                  particlePositions[i3 + 2] = z;
    
                  color.toArray(particleColors, i3);
    
              }
    
          particleGeometry.attributes.position.needsUpdate = true;
          particleGeometry.attributes.color.needsUpdate = true;
    
          // Esto hace que la Luna orbite la Tierra:
          moonOrbitGroup.rotation.y += 0.015;
          moon.rotation.y += 0.01;
    
          planet4.rotation.y += 0.008;
          if (!freezeMarsOrbitRef.current) {
            orbitGroup4.rotation.y += 0.0015; 
          }
    
          planet5.rotation.y += 0.008;
          orbitGroup5.rotation.y += 0.0005;
    
          planet6.rotation.y += 0.008;
          orbitGroup6.rotation.y += 0.00035;
          
          planet7.rotation.y += 0.008;
          orbitGroup7.rotation.y += 0.00020;
          
          planet8.rotation.y += 0.008;
          orbitGroup8.rotation.y += 0.00010;
    
          if (sun.material.map) {
              sun.material.map.offset.x += 0.001;
              sun.material.map.offset.y += 0.0005;
          }
    
          if (sun.material.emissiveMap) {
              sun.material.emissiveMap.offset.x += 0.001;
              sun.material.emissiveMap.offset.y += 0.0005;
          }
    
          asteroidBelt.rotation.y += 0.0003;
          kuiperBelt.rotation.y += 0.0001;
    
          // -----------------------------
          // 🌟 Lógica de Pulsación (NUEVO)
          // -----------------------------
          if (starMaterial) {
            animationTime += 0.03;
            const pulse = Math.sin(animationTime); 
            const sizeIncrease = originalStarSize * 2;
            const newSize = originalStarSize + ((pulse + 1) * 0.5) * sizeIncrease;
            starMaterial.size = newSize;
          }
    
          // -----------------------------
          // Pulsación de estrellas en franja SE DEBE MEJORAR CON SHADER PARA ALTERNAR PULSACION Y MEJORRAR RENDIMIENTO
          // -----------------------------
          animationTime2 += 0.05;
          const pulse = Math.sin(animationTime2);

          const stars1 = franjaStarsMesh1Ref.current;
          if (stars1) {
              const originalStarSize1 = 3; // Usa el valor real de baseStarSize1
              const sizeIncrease1 = originalStarSize1 * 0.5; // Menos pulsación para sutilidad
              const newSize1 = originalStarSize1 + ((pulse + 1) * 0.5) * sizeIncrease1;
              stars1.material.size = newSize1;
          }
          
          const stars2 = franjaStarsMesh2Ref.current;
          if (stars2) {
              const originalStarSize2 = 10; // Usa el valor real de baseStarSize2
              const sizeIncrease2 = originalStarSize2 * 0.5; 
              const newSize2 = originalStarSize2 + ((pulse + 1) * 0.5) * sizeIncrease2;
              stars2.material.size = newSize2;
          }

          renderer.render(scene, camera);
      }
      animate();
  
      gsap.registerPlugin(ScrollTrigger);

      setSceneReady(true); 
      setHideLoader(true);      // inicia fade-out

      // quitar el loader del DOM después del fade-out
      setTimeout(() => {
        setShowLoader(false);
      }, 800);

      if (hideLoader) {
        // da unos ms para completar la animación
        setTimeout(() => setLoaderFinished(true), 300);
      }

      return () => {

        // ------------------------------------
        // 1. Limpieza de Renderizador y Contenedor Principal
        // ------------------------------------
        mount.removeChild(renderer.domElement);
        renderer.dispose(); // <-- ¡Añadir este!

        // ------------------------------------
        // 2. Limpieza del Sol y Estrellas de Fondo
        // ------------------------------------
        // Fondo de estrellas (stars) ya está
        stars.geometry.dispose();
        stars.material.dispose();
        scene.remove(stars); 

        // Sol y Halo
        if (sun) {
            sun.geometry.dispose();
            sun.material.dispose();
        }
        if (halo) {
            halo.material.dispose();
        }
        if (light) {
            solarGroup.remove(light);
        }

        // ------------------------------------
        // 3. Limpieza de la Franja Galáctica
        // ------------------------------------
        const franjaStars1 = franjaStarsMesh1Ref.current;
        const franjaStars2 = franjaStarsMesh2Ref.current;
        
        // ✅ Revisa si el OBJETO existe (franjaStars1 tiene un valor)
        if (franjaStars1) { 
          scene.remove(franjaStars1);
          franjaStars1.geometry.dispose();
          franjaStars1.material.dispose();
        }
        // ✅ Revisa si el OBJETO existe (franjaStars2 tiene un valor)
        if (franjaStars2) {
          scene.remove(franjaStars2);
          franjaStars2.geometry.dispose();
          franjaStars2.material.dispose();
        }
        if (milkyWayFranja) {
            scene.remove(milkyWayFranja);
            milkyWayFranja.geometry.dispose();
            milkyWayFranja.material.dispose();
        }
        if (glowHalo) {
            scene.remove(glowHalo);
            glowHalo.geometry.dispose();
            glowHalo.material.dispose();
        }

        // ------------------------------------
        // 4. Limpieza del Cometa
        // ------------------------------------
        if (cometGroup) {
          solarGroup.remove(cometGroup);
        }
        if (cometBody) {
            cometBody.geometry.dispose();
            cometBody.material.dispose();
        }
        if (cometTail) {
            cometTail.geometry.dispose();
            cometTail.material.dispose();
        }
        if (cometOrbitLine) {
            solarGroup.remove(cometOrbitLine);
            cometOrbitLine.geometry.dispose();
            cometOrbitLine.material.dispose();
        }

        scene.remove(stars);
        stars.geometry.dispose();
        stars.material.dispose();

        // ------------------------------------
        // 5. Limpieza del Planetas
        // ------------------------------------
        solarGroup.remove(orbitGroup1);
        solarGroup.remove(orbitMesh1);
        solarGroup.remove(orbitGroup2);
        solarGroup.remove(orbitMesh2);
        solarGroup.remove(orbitGroup3);
        solarGroup.remove(orbitMesh3);

        // 2. Liberar memoria de la GPU (Dispose) para Geometría y Materiales
        
        // Mercurio
        planet1.geometry.dispose();
        planet1.material.dispose();
        orbitLine1.dispose();
        orbitMat1.dispose();

        // Venus
        planet2.geometry.dispose();
        planet2.material.dispose();
        orbitLine2.dispose();
        orbitMat2.dispose();

        // Tierra y Luna
        planet3.geometry.dispose();
        planet3.material.dispose();
        moon.geometry.dispose();
        moon.material.dispose();
        orbitLine3.dispose();
        orbitMat3.dispose();

        planet4.geometry.dispose();
        planet4.material.dispose();
        orbitLine4.dispose();
        orbitMat4.dispose();

        planet4.geometry.dispose();
        planet4.material.dispose();
        orbitLine4.dispose();
        orbitMat4.dispose();

        planet5.geometry.dispose();
        planet5.material.dispose();
        orbitLine5.dispose();
        orbitMat5.dispose();

        planet6.geometry.dispose();
        planet6.material.dispose();
        orbitLine6.dispose();
        orbitMat6.dispose();

        planet7.geometry.dispose();
        planet7.material.dispose();
        orbitLine7.dispose();
        orbitMat7.dispose();

        planet8.geometry.dispose();
        planet8.material.dispose();
        orbitLine8.dispose();
        orbitMat8.dispose();


        // ------------------------------------
        // 6. Eliminar el Grupo Raíz de la Escena
        // ------------------------------------
        if (solarGroup) {
          scene.remove(solarGroup);
        }

      };
    }, [texturesLoaded, hideLoader]);

    useEffect(() => {
      function handleZoomMercury() {
        setUiReady(false);
        zoomToMercury();
      }
    
      function handleZoomVenus() {
        setUiReady(false);
        zoomToVenus();
      }
    
      function handleZoomEarth() {
        setUiReady(false);
        zoomToEarth();
      }
    
      function handleZoomMars() {
        setUiReady(false);
        zoomToMars();
      }
    
      function handleZoomSatellite() {
        setUiReady(false);
        zoomToSatellite();
      }

      function handleResetEvent() {
        resetZoom();
      }
    
      window.addEventListener("zoom-merc", handleZoomMercury);
      window.addEventListener("zoom-venus", handleZoomVenus);
      window.addEventListener("zoom-earth", handleZoomEarth);
      window.addEventListener("zoom-mars", handleZoomMars);
      window.addEventListener("reset-zoom", handleResetEvent);
      window.addEventListener("zoom-satellite", handleZoomSatellite);

    
      return () => {
        window.removeEventListener("zoom-merc", handleZoomMercury);
        window.removeEventListener("zoom-venus", handleZoomVenus);
        window.removeEventListener("zoom-earth", handleZoomEarth);
        window.removeEventListener("zoom-mars", handleZoomMars);
        window.removeEventListener("zoom-satellite", handleZoomSatellite);
        window.removeEventListener("reset-zoom", handleResetEvent);
      };
    }, []);
    
    return (
      <>
        <div
          ref={mountRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
          }}
        />
    
        {showLoader && <Loader progress={progress} hide={hideLoader} />}
    
        {/* Ya no hay Router aquí */}
        <SceneController sceneReady={sceneReady} />
        <Header />
        <HeaderHorizontal />
    
        <main className="main-content">
          {sceneReady && (
            <Routes>
              {/* LAYOUT PRINCIPAL */}
              <Route path="/" element={<LayoutInicio />}>
                <Route index element={<Inicio loaderFinished={loaderFinished} />} />
                <Route path="sobre-mi" element={<SobreMi isReady={uiReady} />} />
                <Route path="experiencia" element={<Experiencia isReady={uiReady} />} />
                <Route path="creaciones" element={<Creaciones isReady={uiReady} />} />
                <Route path="contacto" element={<Contacto isReady={uiReady} />} />
              </Route>
    
              {/* TECNOLOGÍAS */}
              <Route element={<LayoutTecnologias />}>
                <Route path="tecnologias" element={<Tecnologias isReady={uiReady} />} />
              </Route>
            </Routes>
          )}
        </main>
      </>
    );
    
    
  }
  
export default App;

