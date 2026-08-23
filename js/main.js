const slug = "andrea-15";

let invitation = null;
let gallerySwiper = null;
async function loadInvitation() {
  try {
    const response = await fetch(`invitations/${slug}/config/invitation.json`);

    if (!response.ok) {
      throw new Error("No se encontró la invitación.");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function init() {
  document.body.classList.add("lock");

  invitation = await loadInvitation();

  if (!invitation) return;

  document.body.dataset.theme = invitation.theme || "classic";

  // =========================
  // BACKGROUND (FIXED SIMPLE)
  // =========================

  const bg = document.getElementById("pageBackground");
  const backgroundUrl = new URL(
    `invitations/${slug}/img/${invitation.background}`,
    window.location.href,
  ).href;

  if (bg) {
    bg.style.backgroundImage = `url("${backgroundUrl}")`;
  }

  // Cada sección usa el fondo de la invitación de forma independiente. Los
  // gradientes propios de CSS conservan una buena legibilidad del contenido.
  const sectionBackgrounds = invitation.sectionBackgrounds || {};
  document
    .querySelectorAll(
      "#hero, #story, #details, #dressCode, #activities, #rsvp, #gallery, #gift, #eventFooter",
    )
    .forEach((section) => {
      const image = sectionBackgrounds[section.id] || invitation.background;
      const imageUrl = new URL(
        `invitations/${slug}/img/${image}`,
        window.location.href,
      ).href;

      section.style.setProperty("--section-background", `url("${imageUrl}")`);
    });

  // =========================
  // WELCOME
  // =========================

  document.getElementById("eventTitle").textContent =
    invitation.welcomeTitle || invitation.title;

  document.getElementById("welcome").style.backgroundImage =
    `url(invitations/${slug}/img/${invitation.hero})`;

  // =========================
  // HERO
  // =========================

  document.getElementById("heroTitle").textContent =
    invitation.heroTitle || invitation.title;

  document.getElementById("heroDate").textContent = invitation.subtitle;

  document.getElementById("hero").style.backgroundImage =
    `url(invitations/${slug}/img/${invitation.hero})`;

  // =========================
  // STORY
  // =========================

  document.getElementById("storyTitle").textContent = invitation.story.title;

  document.getElementById("storyText").textContent = invitation.story.text;

  // =========================
  // MÚSICA
  // =========================

  const music = document.getElementById("bgMusic");

  music.src = `invitations/${slug}/audio/${invitation.music}`;

  // =========================
  // DETALLES
  // =========================

  document.getElementById("venueName").textContent = invitation.venue.name;

  document.getElementById("venueAddress").textContent =
    invitation.venue.address;

  document.getElementById("mapsButton").href = invitation.venue.maps;

  // =========================
  // DRESS CODE
  // =========================

  document.getElementById("dressTitle").textContent =
    invitation.dressCode.title;

  document.getElementById("dressDescription").textContent =
    invitation.dressCode.description;

  // =========================
  // GIFT
  // =========================

  document.getElementById("giftTitle").textContent = invitation.gift.title;

  document.getElementById("giftSubtitle").textContent =
    invitation.gift.subtitle;

  document.getElementById("giftButton").textContent =
    invitation.gift.buttonText;

  document.getElementById("giftButton").href = invitation.gift.url;

  // =========================
  // ACTIVIDADES
  // =========================

  if (invitation.showActivities !== false) {
    const activitiesGrid = document.getElementById("activitiesGrid");

    activitiesGrid.innerHTML = "";

    const icons = {
      Inflable: "🏰",
      Pintacaritas: "🎨",
      Pizza: "🍕",
      Piñata: "🪅",
      Pastel: "🎂",
    };

    invitation.activities.forEach((activity) => {
      activitiesGrid.innerHTML += `
            <div class="activity-card">
                <span>${icons[activity] || "🎉"}</span>
                <h3>${activity}</h3>
            </div>
        `;
    });
  }

  // =========================
  // COUNTDOWN
  // =========================

  startCountdown(invitation.eventDate);
}

init();

// =========================
// ENTER INVITATION
// =========================

document
  .getElementById("enterButton")
  .addEventListener("click", enterInvitation);

function enterInvitation() {
  const welcome = document.getElementById("welcome");

  const hero = document.getElementById("hero");

  const music = document.getElementById("bgMusic");

  hero.classList.add("active");

  welcome.classList.add("fade-out");

  setTimeout(() => {
    welcome.style.display = "none";

    document.body.classList.remove("lock");
    document.getElementById("story").style.display = "block";
    document.getElementById("details").style.display = "block";
    document.getElementById("dressCode").style.display = "block";
    if (invitation.showActivities !== false) {
      document.getElementById("activities").style.display = "block";
    }
    document.getElementById("gift").style.display = "block";
    document.getElementById("eventFooter").style.display = "block";
    // RSVP
    document.getElementById("rsvp").style.display = "block";
    renderGallery();
    initReveal();
    initDecorations();
    music.volume = 0.35;

    music.play().catch(console.log);
  }, 400);
}

// =========================
// MUSIC TOGGLE
// =========================

const musicButton = document.getElementById("musicButton");

musicButton.addEventListener("click", () => {
  const music = document.getElementById("bgMusic");

  if (music.paused) {
    music.play();
    musicButton.textContent = "🔊";
  } else {
    music.pause();
    musicButton.textContent = "🔇";
  }
});

// =========================
// COUNTDOWN
// =========================

function startCountdown(eventDate) {
  const days = document.getElementById("days");

  const hours = document.getElementById("hours");

  const minutes = document.getElementById("minutes");

  const seconds = document.getElementById("seconds");

  function update() {
    const now = new Date().getTime();
    const target = new Date(eventDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      days.textContent = "00";
      hours.textContent = "00";
      minutes.textContent = "00";
      seconds.textContent = "00";

      clearInterval(interval);
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));

    const h = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    const s = Math.floor((difference % (1000 * 60)) / 1000);

    days.textContent = String(d).padStart(2, "0");
    hours.textContent = String(h).padStart(2, "0");
    minutes.textContent = String(m).padStart(2, "0");
    seconds.textContent = String(s).padStart(2, "0");
  }

  update();
  const interval = setInterval(update, 1000);
}

// =========================
// REVEAL ANIMATION
// =========================

function initReveal() {
  const sections = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.05,
    },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

function initDecorations() {
  const container = document.getElementById("decorations");

  if (!container) return;

  const items = ["♠", "♥", "♦", "♣"];

  function createDecoration() {
    const el = document.createElement("div");

    el.className = "decoration";

    el.textContent = items[Math.floor(Math.random() * items.length)];

    const size = Math.random() * 20 + 20;

    el.style.left = Math.random() * 100 + "vw";
    el.style.bottom = "-50px";
    el.style.fontSize = size + "px";

    el.style.animation = `floatUp ${6 + Math.random() * 6}s linear forwards`;

    container.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 12000);
  }

  // spawn loop
  setInterval(createDecoration, 800);
}
const rsvpButton = document.getElementById("rsvpButton");

rsvpButton.addEventListener("click", () => {
  const guest = document.getElementById("guestName").value.trim();

  if (!guest) {
    alert("Escribe tu nombre.");

    return;
  }

  const phone = invitation.rsvp.phone;

  const text = `${invitation.rsvp.message}

Nombre: ${guest}`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");
});

function renderGallery() {
  if (!invitation.gallery.enabled) {
    return;
  }

  const section = document.getElementById("gallery");

  const title = document.getElementById("galleryTitle");

  const subtitle = document.getElementById("gallerySubtitle");

  const wrapper = document.getElementById("galleryWrapper");
  wrapper.classList.remove(
    "gallery-portrait",
    "gallery-landscape",
    "gallery-square",
  );

  wrapper.classList.add(`gallery-${invitation.gallery.layout}`);

  title.textContent = invitation.gallery.title;

  subtitle.textContent = invitation.gallery.subtitle;

  wrapper.innerHTML = "";

  invitation.gallery.images.forEach((image) => {
    const slide = document.createElement("div");

    slide.className = "swiper-slide";

    slide.innerHTML = `

            <img
                src="invitations/${slug}/img/gallery/${image}"
                loading="lazy"
                alt="Galería">

        `;

    wrapper.appendChild(slide);
  });

  if (gallerySwiper) {
    gallerySwiper.destroy(true, true);
  }

  const canLoop =
    invitation.gallery.loop && invitation.gallery.images.length >= 3;

  gallerySwiper = new Swiper(".gallerySwiper", {
    loop: canLoop,

    autoplay: invitation.gallery.autoplay
      ? {
          delay: invitation.gallery.delay,
        }
      : false,

    spaceBetween: 20,

    centeredSlides: true,

    pagination: {
      el: ".swiper-pagination",

      clickable: true,

      enabled: invitation.gallery.images.length > 1,
    },
  });

  section.style.display = "block";
}
