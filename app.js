(function () {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const menuClose = document.querySelector("[data-menu-close]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = document.querySelectorAll("[data-count-to]");
  const counterSections = document.querySelectorAll(".studio-stats");
  const birthdayPopup = document.querySelector("[data-birthday-popup]");
  const birthdayAudio = document.querySelector("[data-birthday-audio]");
  const birthdayPlay = document.querySelector("[data-birthday-play]");
  const birthdayCloseButtons = document.querySelectorAll("[data-birthday-close]");
  let birthdayTimer;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function stopBirthdayAudio() {
    if (!birthdayAudio) return;
    birthdayAudio.pause();
    birthdayAudio.currentTime = 0;
  }

  function closeBirthdayPopup() {
    if (!birthdayPopup) return;

    clearTimeout(birthdayTimer);
    stopBirthdayAudio();
    birthdayPopup.classList.remove("is-visible");
    birthdayPopup.setAttribute("aria-hidden", "true");
    body.classList.remove("birthday-popup-open");
    window.setTimeout(() => {
      if (!birthdayPopup.classList.contains("is-visible")) {
        birthdayPopup.hidden = true;
      }
    }, 280);
  }

  function playBirthdayAudio() {
    if (!birthdayAudio) return;

    birthdayAudio.volume = 0.42;
    const playPromise = birthdayAudio.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise
        .then(() => {
          if (birthdayPlay) birthdayPlay.hidden = true;
        })
        .catch(() => {
          if (birthdayPlay) birthdayPlay.hidden = false;
        });
    }
  }

  function openBirthdayPopup() {
    if (!birthdayPopup) return;

    birthdayPopup.hidden = false;
    birthdayPopup.classList.add("is-visible");
    birthdayPopup.setAttribute("aria-hidden", "false");
    body.classList.add("birthday-popup-open");
    playBirthdayAudio();
    birthdayTimer = window.setTimeout(closeBirthdayPopup, 35000);
  }

  if (birthdayPopup) {
    document.addEventListener("DOMContentLoaded", playBirthdayAudio, { once: true });
    window.addEventListener("load", openBirthdayPopup, { once: true });
    window.addEventListener("pointerdown", playBirthdayAudio, { once: true });
    birthdayPlay?.addEventListener("click", playBirthdayAudio);
    birthdayCloseButtons.forEach((button) => button.addEventListener("click", closeBirthdayPopup));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeBirthdayPopup();
    });
  }

  const resetToHero = () => {
    if (!location.hash || location.hash === "#top") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  };

  window.addEventListener("DOMContentLoaded", resetToHero, { once: true });
  window.addEventListener("load", resetToHero, { once: true });

  function animateCounter(counter) {
    if (counter.dataset.counted === "true") return;

    counter.dataset.counted = "true";
    const target = Number(counter.dataset.countTo || 0);
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function sectionIsVisible(section) {
    const bounds = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return bounds.top < viewportHeight * 0.88 && bounds.bottom > 0;
  }

  function runVisibleCounters() {
    counterSections.forEach((section) => {
      if (!sectionIsVisible(section)) return;
      section.querySelectorAll("[data-count-to]").forEach((counter) => {
        if (prefersReducedMotion) {
          counter.textContent = counter.dataset.countTo || counter.textContent;
          counter.dataset.counted = "true";
          return;
        }

        animateCounter(counter);
      });
    });
  }

  if (counters.length) {
    counters.forEach((counter) => {
      counter.textContent = prefersReducedMotion ? counter.dataset.countTo : "0";
    });

    runVisibleCounters();
    window.addEventListener("scroll", runVisibleCounters, { passive: true });
    window.addEventListener("resize", runVisibleCounters);
    window.addEventListener("load", runVisibleCounters);
    setTimeout(runVisibleCounters, 250);
  }

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    mobileMenu?.setAttribute("aria-hidden", String(!open));

    if (open) {
      menuClose?.focus();
    } else if (document.activeElement === menuClose) {
      menuButton?.focus();
    }
  }

  menuButton?.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
  menuClose?.addEventListener("click", () => setMenu(false));

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) {
      setMenu(false);
    }
  });

  function updateHeader() {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const navLinks = document.querySelectorAll(".desktop-nav a");
  const trackedSections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-35% 0px -55%", threshold: 0 },
    );

    trackedSections.forEach((section) => navObserver.observe(section));
  }

  const offeringCards = document.querySelectorAll(".offering-card");
  const hoverCardsQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const touchCardsQuery = window.matchMedia("(hover: none), (pointer: coarse)");

  function setupOfferingCards() {
    if (!offeringCards.length) return;

    const shouldOpenFirst = touchCardsQuery.matches || !hoverCardsQuery.matches;
    offeringCards.forEach((card, index) => {
      card.open = shouldOpenFirst && index === 0;
    });
  }

  if (offeringCards.length) {
    offeringCards.forEach((card) => {
      const summary = card.querySelector("summary");
      let hoverTimer;

      card.addEventListener("mouseenter", () => {
        if (!hoverCardsQuery.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(() => {
          card.open = true;
        }, 130);
      });

      card.addEventListener("mouseleave", () => {
        if (!hoverCardsQuery.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(() => {
          card.open = false;
        }, 120);
      });

      summary?.addEventListener("click", (event) => {
        if (hoverCardsQuery.matches) event.preventDefault();
      });
    });

    setupOfferingCards();

    if (typeof hoverCardsQuery.addEventListener === "function") {
      hoverCardsQuery.addEventListener("change", setupOfferingCards);
      touchCardsQuery.addEventListener("change", setupOfferingCards);
    } else {
      hoverCardsQuery.addListener(setupOfferingCards);
      touchCardsQuery.addListener(setupOfferingCards);
    }
  }

  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.7 } });
  }
})();
