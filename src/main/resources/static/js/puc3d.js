/**
 * PUC Minas - Visualizador 3D com Three.js
 * Renderizacao WebGL do brasao institucional, iluminacao de cena e controles de interacao
 */
(function () {
  function initPUC3D() {
    const stageWrapper = document.getElementById("stage-wrapper");
    if (!stageWrapper) return;

    // Cria canvas se não existir
    let canvas = document.getElementById("puc-3d-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "puc-3d-canvas";
      stageWrapper.prepend(canvas);
    }

    const width = stageWrapper.clientWidth || 440;
    const height = stageWrapper.clientHeight || 380;

    // Cena e Câmera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    // Renderizador WebGL de alta performance
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    if (renderer.outputColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    // 1. Key Light Âmbar Dourada (topo-direita)
    const mainLight = new THREE.DirectionalLight(0xfbbf24, 2.0);
    mainLight.position.set(5, 5, 2.5);
    scene.add(mainLight);

    // 2. Rim Light Ciano Elétrico de Recorte (trás-esquerda)
    const rimLight = new THREE.PointLight(0x38bdf8, 3.0, 15);
    rimLight.position.set(-5, 0, -2);
    scene.add(rimLight);

    // 3. Ambient Light Navy Institucional (preenche sombras)
    const ambientLight = new THREE.AmbientLight(0x002b49, 1.5);
    scene.add(ambientLight);

    // 4. Luz dinâmica interativa no cursor
    const cursorLight = new THREE.PointLight(0x38bdf8, 1.2, 8);
    cursorLight.position.set(0, 0, 3);
    scene.add(cursorLight);

    // 5. Particulas orbitais leves nativas Three.js (atmosfera digital sutil)
    const particleCount = 50;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 7;
      particlePositions[i + 1] = (Math.random() - 0.5) * 5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let model;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let autoSpinY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotX = 0;
    let dragRotY = 0;

    // Carrega o GLB oficial local
    const loader = new THREE.GLTFLoader();
    const modelUrl = "/Models/brasao_puc.glb";

    loader.load(
      modelUrl,
      (gltf) => {
        model = gltf.scene;

        // Centraliza
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        // Escala normalizada
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.4 / (maxDim || 1);
        model.scale.set(scale, scale, scale);

        // Materiais PBR
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.metalness = 0.68;
            child.material.roughness = 0.3;
            if (child.material.map) {
              if (child.material.map.colorSpace) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
              } else {
                child.material.map.encoding = THREE.sRGBEncoding;
              }
            }
          }
        });

        scene.add(model);

        // Sucesso: ativa classe 'ready' para crossfade suave do fallback via CSS
        canvas.classList.add("ready");

        if (window.gsap) {
          gsap.from(model.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.2,
            ease: "back.out(1.5)"
          });
        }
      },
      undefined,
      (err) => {
        console.warn("Aviso ao carregar modelo 3D (fallback 2D ativo):", err);
      }
    );

    // Captura da posição do mouse normalizada (-1 a +1)
    document.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      cursorLight.position.x = mouseX * 2.5;
      cursorLight.position.y = mouseY * 2.5;
    });

    // Ajuste sutil na iluminacao ao focar nos campos do formulario
    const formInputs = document.querySelectorAll("input");
    formInputs.forEach((input) => {
      input.addEventListener("focus", () => {
        if (window.gsap) {
          gsap.to(mainLight, { intensity: 2.6, duration: 0.35 });
          gsap.to(cursorLight, { intensity: 1.6, duration: 0.35 });
        } else {
          mainLight.intensity = 2.6;
          cursorLight.intensity = 1.6;
        }
      });
      input.addEventListener("blur", () => {
        if (window.gsap) {
          gsap.to(mainLight, { intensity: 2.0, duration: 0.35 });
          gsap.to(cursorLight, { intensity: 1.2, duration: 0.35 });
        } else {
          mainLight.intensity = 2.0;
          cursorLight.intensity = 1.2;
        }
      });
    });

    // Suporte a arrasto (drag) com mouse/touch
    stageWrapper.addEventListener("pointerdown", (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    window.addEventListener("pointermove", (e) => {
      if (isDragging && model) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragRotY += dx * 0.01;
        dragRotX += dy * 0.01;
        dragRotX = Math.max(-0.55, Math.min(0.55, dragRotX));
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      }
    });

    // Render Loop com levitação, rotação contínua suave e partículas
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animacao lenta das particulas de fundo
      particles.rotation.y = elapsedTime * 0.03;

      if (model) {
        // Animacao suave de flutuacao senoidal
        model.position.y = Math.sin(elapsedTime * 1.5) * 0.1;

        if (!isDragging) {
          // Rotacao planetaria continua combinada com parallax do mouse
          autoSpinY += 0.003;
          targetX = autoSpinY + mouseX * 0.3 + dragRotY;
          targetY = mouseY * 0.2 + dragRotX;
          model.rotation.y += (targetX - model.rotation.y) * 0.05;
          model.rotation.x += (targetY - model.rotation.x) * 0.05;
        } else {
          model.rotation.y = dragRotY;
          model.rotation.x = dragRotX;
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    // Redimensionamento responsivo
    window.addEventListener("resize", () => {
      const newW = stageWrapper.clientWidth || 440;
      const newH = stageWrapper.clientHeight || 380;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPUC3D);
  } else {
    initPUC3D();
  }
})();
