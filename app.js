const maskContainer = document.getElementById("mask-container");
const maskLayer = document.getElementById("mask-layer");

if (maskContainer && maskLayer) {
  // Variabler for posisjon og fysikk
  let mouseX = 300,
    mouseY = 300; // Mål-posisjon (der musen/fingeren er)
  let currentX = 300,
    currentY = 300; // Nåværende posisjon for sirkelen
  let isHovering = false;

  // Funksjon for å oppdatere koordinater fra både mus og touch
  function handleMove(e) {
    const rect = maskContainer.getBoundingClientRect();
    let clientX, clientY;

    // Sjekker om det er touch (mobil) eller mus
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    mouseX = clientX - rect.left;
    mouseY = clientY - rect.top;
  }

  // Muse-eventer
  maskContainer.addEventListener("mousemove", handleMove);
  maskContainer.addEventListener("mouseenter", () => {
    isHovering = true;
  });
  maskContainer.addEventListener("mouseleave", () => {
    isHovering = false;
  });

  // Mobil/Touch-eventer
  maskContainer.addEventListener(
    "touchstart",
    (e) => {
      isHovering = true;
      handleMove(e);
      // Hindrer at skjermen scroller mens man leker med kloden
      if (e.cancelable) e.preventDefault();
    },
    { passive: false },
  );

  maskContainer.addEventListener(
    "touchmove",
    (e) => {
      handleMove(e);
      if (e.cancelable) e.preventDefault();
    },
    { passive: false },
  );

  maskContainer.addEventListener("touchend", () => {
    isHovering = false;
  });

  // Animasjons-loopen
  function animate() {
    if (isHovering) {
      // 1. Beregn avstanden (hastigheten) mellom sirkelen og musen
      let velX = mouseX - currentX;
      let velY = mouseY - currentY;

      // 2. Legg til "easing" (mykhet)
      currentX += velX * 0.15;
      currentY += velY * 0.15;

      // 3. Beregn "Squish"-effekten
      let stretchX = Math.min(Math.abs(velX) * 1.5, 100);
      let stretchY = Math.min(Math.abs(velY) * 1.5, 100);

      // 4. Gelé-effekt: klem inn på motsatt akse
      let rx = 150 + stretchX - stretchY * 0.3;
      let ry = 150 + stretchY - stretchX * 0.3;

      // Pass på at den ikke klapper sammen
      rx = Math.max(rx, 80);
      ry = Math.max(ry, 80);

      // Oppdater CSS-variablene live
      maskLayer.style.setProperty("--x", `${currentX}px`);
      maskLayer.style.setProperty("--y", `${currentY}px`);
      maskLayer.style.setProperty("--rx", `${rx}px`);
      maskLayer.style.setProperty("--ry", `${ry}px`);
    }

    requestAnimationFrame(animate);
  }

  animate();
}
