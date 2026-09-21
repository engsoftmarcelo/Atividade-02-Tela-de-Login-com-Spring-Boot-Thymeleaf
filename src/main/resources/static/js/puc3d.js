/**
 * PUC Minas - Visualizador 3D High-Tech com Three.js
 * Configuração de iluminação de estúdio (Key/Rim/Ambient) e interação inercial
 * Baseado na arquitetura recomendada pelo Perplexity
 */
(function () {
  function initPUC3D() {
    const canvas = document.getElementById("puc-3d-canvas");
    const container = document.getElementById("puc-3d-container");
    const fallbackImg = document.getElementById("puc-3d-fallback");

    if (!canvas || !container) return;

    // Em dispositivos móveis (< 900px), não inicializa o WebGL para poupar GPU/bateria
    if (window.innerWidth < 900) {
      canvas.style.display = "none";
      if (fallbackImg) fallbackImg.style.display = "block";
      return;
    }

    // Validação de suporte WebGL
    function isWebGLSupported() {
      try {
        const testCanvas = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && 
          (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
      } catch (e) {
        return false;
      }
    }

    if (!isWebGLSupported()) {
      canvas.style.display = "none";
      if (fallbackImg) fallbackImg.style.display = "block";
      return;
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 380;

    // Cena e Câmera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.4);

    // Renderizador WebGL
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    if (renderer.outputColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    // 1. Luz Ambiente Azulada Suave (Perplexity spec: 0x0f172a, 0.8)
    const ambientLight = new THREE.AmbientLight(0x0f172a, 0.9);
    scene.add(ambientLight);

    // 2. Key Light Dourada Superior (Perplexity spec: 0xfbbf24, 1.2 at 2.5, 3, 4)
    const keyLight = new THREE.DirectionalLight(0xfbbf24, 1.4);
    keyLight.position.set(2.5, 3.2, 4);
    scene.add(keyLight);

    // 3. Rim Light Ciano de Silhueta (Perplexity spec: 0x38bdf8, 1.0 at -3, 2, -2)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-3, 2, 2);
    scene.add(rimLight);

    // 4. Luz dinâmica interativa que persegue o cursor
    const cursorLight = new THREE.PointLight(0x38bdf8, 1.5, 10);
    cursorLight.position.set(0, 0, 3.5);
    scene.add(cursorLight);

    // Grupo do Brasão
    const crestGroup = new THREE.Group();
    scene.add(crestGroup);

    // Carregamento do modelo GLB
    const loader = new THREE.GLTFLoader();
    const modelUrl = "/Models/brasao_puc.glb";

    loader.load(
      modelUrl,
      function (gltf) {
        const model = gltf.scene;

        // Centralizar
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        // Escala normalizada
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.3 / (maxDim || 1);
        model.scale.set(scale, scale, scale);

        // Materiais PBR elegantes
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.metalness = 0.65;
            child.material.roughness = 0.32;
            if (child.material.map) {
              if (child.material.map.colorSpace) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
              } else {
                child.material.map.encoding = THREE.sRGBEncoding;
              }
            }
          }
        });

        crestGroup.add(model);

        // Entrada triunfal com GSAP
        if (window.gsap) {
          gsap.from(crestGroup.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.2,
            ease: "back.out(1.6)"
          });
        }
      },
      undefined,
      function (err) {
        console.warn("Aviso ao carregar GLB, utilizando fallback 2D/3D:", err);
        if (fallbackImg) {
          canvas.style.display = "none";
          fallbackImg.style.display = "block";
        }
      }
    );

    // Interações de Mouse e Drag Inercial
    let isDragging = false;
    let previousMouse = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;
    let parallax = { x: 0, y: 0 };

    container.addEventListener("pointerdown", (e) => {
      isDragging = true;
      previousMouse = { x: e.clientX, y: e.clientY };
      container.style.cursor = "grabbing";
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
      container.style.cursor = "grab";
    });

    window.addEventListener("pointermove", (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      parallax.x = nx * 0.3;
      parallax.y = ny * 0.2;

      cursorLight.position.x = nx * 3;
      cursorLight.position.y = ny * 3;

      if (isDragging) {
        const dx = e.clientX - previousMouse.x;
        const dy = e.clientY - previousMouse.y;

        targetRotationY += dx * 0.012;
        targetRotationX += dy * 0.012;
        targetRotationX = Math.max(-0.55, Math.min(0.55, targetRotationX));

        previousMouse = { x: e.clientX, y: e.clientY };
      }
    });

    // Resize Responsivo
    function onResize() {
      if (window.innerWidth < 900) {
        canvas.style.display = "none";
        if (fallbackImg) fallbackImg.style.display = "block";
        return;
      } else {
        canvas.style.display = "block";
        if (fallbackImg) fallbackImg.style.display = "none";
      }

      const newW = container.clientWidth || 400;
      const newH = container.clientHeight || 380;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    }
    window.addEventListener("resize", onResize);

    // Loop de Animação com levitação orgânica
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotação suave automática quando em repouso
      if (!isDragging) {
        targetRotationY += 0.005;
      }

      // Interpolação inercial com amortecimento (damping 0.08)
      currentRotationY += (targetRotationY + parallax.x - currentRotationY) * 0.08;
      currentRotationX += (targetRotationX - parallax.y - currentRotationX) * 0.08;

      crestGroup.rotation.y = currentRotationY;
      crestGroup.rotation.x = currentRotationX;

      // Levitação senoidal orgânica (Perplexity spec: Math.sin(elapsed * 0.8) * 0.08)
      crestGroup.position.y = Math.sin(elapsed * 0.8) * 0.08;

      renderer.render(scene, camera);
    }
    animate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPUC3D);
  } else {
    initPUC3D();
  }
})();
