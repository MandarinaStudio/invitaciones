const slug = "andrea-15";

let invitation = null;
let gallerySwiper = null;

// =========================
// LOAD INVITATION
// =========================

async function loadInvitation() {
  try {
    const response = await fetch(`/invitations/${slug}/config/invitation.json`);

    if (!response.ok) {
      throw new Error("No se encontró la invitación.");
    }

    return await response.json();
  } catch (error) {
    console.error(error);

    return null;
  }
}

// =========================
// SECTION CONTROL
// =========================

function isSectionEnabled(invitation, section) {
  return invitation[section]?.enabled !== false;
}

function hideSection(id) {
  const section = document.getElementById(id);

  if (section) {
    section.remove();
  }
}

// =========================
// INIT
// =========================

async function init() {
  document.body.classList.add("lock");

  invitation = await loadInvitation();

  if (!invitation) return;


  // =========================
  // THEME
  // =========================

  document.body.dataset.theme = invitation.theme || "classic";

  // =========================
  // GENERAL BACKGROUND
  // =========================

  const bg = document.getElementById("pageBackground");

  const backgroundUrl = new URL(
    `/invitations/${slug}/img/${invitation.background}`,
    window.location.href,
  ).href;

  if (bg) {
    bg.style.backgroundImage = `url("${backgroundUrl}")`;
  }

  // =========================
  // SECTION BACKGROUNDS
  // =========================

  const sectionBackgrounds = invitation.sectionBackgrounds || {};

  document
    .querySelectorAll(
      "#welcome, #hero, #story, #image1, #details, #dressCode, #activities, #rsvp, #image2, #gallery, #gift, #eventFooter",
    )
    .forEach((section) => {
      const image = sectionBackgrounds[section.id] || invitation.background;

      const imageUrl = new URL(
        ` /invitations/${slug}/img/${image}`,
        window.location.href,
      ).href;

      section.style.setProperty("--section-background", `url("${imageUrl}")`);
    });

  // =========================
  // IMAGE SECTIONS
  // =========================

  const imageSection1 = document.getElementById("imageSection1");

  const imageSection2 = document.getElementById("imageSection2");

  if (imageSection1 && invitation.imageSections?.image1) {
    imageSection1.src = `/invitations/${slug}/img/${invitation.imageSections.image1}`;
  }

  if (imageSection2 && invitation.imageSections?.image2) {
    imageSection2.src = `/invitations/${slug}/img/${invitation.imageSections.image2}`;
  }

  // =========================
  // WELCOME
  // =========================

  document.getElementById("eventTitle").textContent =
    invitation.welcomeTitle || invitation.title;

  // =========================
  // WELCOME ENVELOPE
  // =========================

  const envelopeImage = document.getElementById("welcomeEnvelopeImage");

  if (envelopeImage && invitation.envelope) {
    envelopeImage.src = `/invitations/${slug}/img/${invitation.envelope}`;
  }

  // =========================
  // HERO
  // =========================

  document.getElementById("heroTitle").textContent =
    invitation.heroTitle || invitation.title;

  document.getElementById("heroDate").textContent = invitation.subtitle;

  // =========================
  // STORY
  // =========================

  if (isSectionEnabled(invitation, "story")) {
    document.getElementById("storySubtitle").textContent =
      invitation.story.subtitle;

    document.getElementById("storyTitle").textContent = invitation.story.title;

    document.getElementById("storyText").textContent = invitation.story.text;
  } else {
    hideSection("story");
  }

  // =========================
  // MUSIC
  // =========================

  const music = document.getElementById("bgMusic");

  music.src = `/invitations/${slug}/audio/${invitation.music}`;

  // =========================
// DETAILS
// =========================

if (isSectionEnabled(invitation, "venue")) {

  document.getElementById("detailsTitle").textContent =
    invitation.venue.sectionTitle;

  document.getElementById("venueName").textContent =
    invitation.venue.name;

  document.getElementById("venueAddress").textContent =
    invitation.venue.address;

  document.getElementById("mapsButton").href =
    invitation.venue.maps;

} else {

  hideSection("details");

}
  // =========================
  // DRESS CODE
  // =========================

  if (isSectionEnabled(invitation, "dressCode")) {
    document.getElementById("dressCodeTitle").textContent =
      invitation.dressCode.sectionTitle;

    document.getElementById("dressTitle").textContent =
      invitation.dressCode.title;

    document.getElementById("dressDescription").textContent =
      invitation.dressCode.description;
  } else {
    hideSection("dressCode");
  }

// =========================
// GIFT
// =========================

if (
  isSectionEnabled(
    invitation,
    "gift"
  )
) {


  document.getElementById(
    "giftTitle"
  ).textContent =
    invitation.gift.sectionTitle;


  document.getElementById(
    "giftSubtitle"
  ).textContent =
    invitation.gift.subtitle;


  const giftButton =
    document.getElementById(
      "giftButton"
    );


  if (
    invitation.gift.buttonText &&
    invitation.gift.url
  ) {


    giftButton.textContent =
      invitation.gift.buttonText;


    giftButton.href =
      invitation.gift.url;


  } else {


    giftButton.style.display =
      "none";


  }


} else {


  hideSection(
    "gift"
  );


}

  // =========================
// ACTIVITIES
// =========================

if (isSectionEnabled(invitation, "activities")) {


  document.getElementById("activitiesTitle").textContent =
    invitation.activities.sectionTitle || "";


  const activitiesGrid =
    document.getElementById("activitiesGrid");


  activitiesGrid.innerHTML = "";


  const icons = {

    Inflable: "🏰",
    Pintacaritas: "🎨",
    Pizza: "🍕",
    Piñata: "🪅",
    Pastel: "🎂"

  };


  (invitation.activities.items || []).forEach((activity)=>{


    activitiesGrid.innerHTML += `

      <div class="activity-card">

        <span>
          ${icons[activity] || "🎉"}
        </span>

        <h3>
          ${activity}
        </h3>

      </div>

    `;


  });


} else {

  hideSection("activities");

}

// =========================
// RSVP
// =========================

if (isSectionEnabled(invitation, "rsvp")) {

  const rsvpTitle = document.getElementById("rsvpTitle");

  if (rsvpTitle) {
    rsvpTitle.textContent =
      invitation.rsvp.sectionTitle || "";
  }

} else {

  hideSection("rsvp");

}

  // =========================
  // COUNTDOWN
  // =========================

  startCountdown(invitation.eventDate);
}

// =========================
// START
// =========================

init();

// =========================
// ENTER INVITATION
// =========================

document
  .getElementById("enterButton")
  .addEventListener("click", enterInvitation);

// =========================
// ENTER INVITATION
// =========================

function enterInvitation() {
  const welcome = document.getElementById("welcome");
  const hero = document.getElementById("hero");
  const music = document.getElementById("bgMusic");

  hero.classList.add("active");
  welcome.classList.add("fade-out");

  setTimeout(() => {

    welcome.style.display = "none";
    document.body.classList.remove("lock");

    // =========================
    // SHOW SECTIONS
    // =========================

    const sectionsToShow = [
      "story",
      "image1",
      "details",
      "dressCode",
      "activities",
      "rsvp",
      "image2",
      "gift",
      "eventFooter",
    ];

    sectionsToShow.forEach((id) => {
      const section = document.getElementById(id);

      if (section) {
        section.style.display = "block";
      }
    });

    // =========================
    // EVENT FOOTER
    // =========================

    renderEventFooter();

    // =========================
    // GALLERY
    // =========================

    renderGallery();

    // =========================
    // REVEAL ANIMATION
    // =========================

    initReveal();

    // =========================
    // FOOTER
    // =========================

    const footer = document.querySelector("footer");

    if (footer) {
      footer.classList.add("visible");
    }

    // =========================
    // DECORATIONS
    // =========================

    initDecorations();

    // =========================
    // MUSIC
    // =========================

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

// =========================
// DECORATIONS
// =========================

function initDecorations() {
  const container = document.getElementById("decorations");

  if (!container) return;

  const items = ["♠", "♥", "♦", "♣"];

  function createDecoration() {
    const el = document.createElement("div");

    el.className = "decoration";

    el.textContent = items[Math.floor(Math.random() * items.length)];

    const size = Math.random() * 15 + 18;

    el.style.opacity = Math.random() * 0.4 + 0.4;

    el.style.left = Math.random() * 100 + "vw";

    el.style.bottom = "-50px";

    el.style.fontSize = size + "px";

    el.style.animation = `floatUp ${10 + Math.random() * 8}s linear forwards`;

    container.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 12000);
  }

  setInterval(createDecoration, 2500);
}

// =========================
// RSVP
// =========================

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

/// =========================
// GALLERY
// =========================

function renderGallery() {

  const section =
    document.getElementById("gallery");

  const title =
    document.getElementById("galleryTitle");

  const subtitle =
    document.getElementById("gallerySubtitle");

  const wrapper =
    document.getElementById("galleryWrapper");


  if (!section || !wrapper) {
    return;
  }


  // =========================
  // SECTION CONTROL
  // =========================

  if (!isSectionEnabled(invitation, "gallery")) {

    section.remove();

    return;
  }


  // =========================
  // TITLE
  // =========================

  if (title) {

    title.textContent =
      invitation.gallery.sectionTitle || "";

  }


  // =========================
  // SUBTITLE
  // =========================

  if (subtitle) {

    subtitle.textContent =
      invitation.gallery.subtitle || "";

  }


  // =========================
  // LAYOUT
  // =========================

  wrapper.classList.remove(
    "gallery-portrait",
    "gallery-landscape",
    "gallery-square"
  );


  wrapper.classList.add(
    `gallery-${invitation.gallery.layout}`
  );


  // =========================
  // IMAGES
  // =========================

  wrapper.innerHTML = "";


  if (
    !invitation.gallery.images ||
    invitation.gallery.images.length === 0
  ) {

    section.remove();

    return;
  }


  invitation.gallery.images.forEach(
    (image) => {

      const slide =
        document.createElement("div");


      slide.className =
        "swiper-slide";


      slide.innerHTML = `

        <img
          src="/invitations/${slug}/img/gallery/${image}"
          loading="lazy"
          alt="Galería"
        >

      `;


      wrapper.appendChild(slide);

    }
  );


  // =========================
  // SWIPER
  // =========================

  if (gallerySwiper) {

    gallerySwiper.destroy(
      true,
      true
    );

  }


  const canLoop =
    invitation.gallery.loop &&
    invitation.gallery.images.length >= 3;


  gallerySwiper =
    new Swiper(
      ".gallerySwiper",
      {

        loop: canLoop,

        autoplay:
          invitation.gallery.autoplay
            ? {
                delay:
                  invitation.gallery.delay
              }
            : false,

        spaceBetween: 20,

        centeredSlides: true,

        pagination: {

          el:
            ".swiper-pagination",

          clickable:
            true,

          enabled:
            invitation.gallery.images.length > 1

        }

      }
    );


  section.style.display = "block";

}

// =========================
// EVENT FOOTER
// =========================

function renderEventFooter() {

  if (!invitation || !invitation.eventDate) {
    return;
  }

  const footerTitle =
    document.getElementById("eventFooterTitle");

  if (footerTitle) {
    footerTitle.textContent =
      invitation.eventFooter?.sectionTitle || "";
  }
  if (!invitation || !invitation.eventDate) {
    return;
  }

const footerSubtitle =
  document.getElementById("eventFooterSubtitle");

if (footerSubtitle) {
  footerSubtitle.textContent =
    invitation.eventFooter?.subtitle || "";
}

  const dateElement = document.getElementById("eventFooterDate");

  const timeElement = document.getElementById("eventFooterTime");

  const calendarButton = document.getElementById("calendarButton");

  const mandarinaLink = document.getElementById("mandarinaLink");

  // =========================
  // FECHA
  // =========================

  const eventDate = new Date(invitation.eventDate);

  if (dateElement) {
    dateElement.textContent = eventDate.toLocaleDateString("es-CR", {
      weekday: "long",

      day: "numeric",

      month: "long",

      year: "numeric",
    });
  }

  // =========================
  // HORA
  // =========================

  if (timeElement) {
    timeElement.textContent = eventDate.toLocaleTimeString("es-CR", {
      hour: "numeric",

      minute: "2-digit",
    });
  }

  // =========================
  // CALENDARIO
  // =========================

  if (calendarButton) {
    calendarButton.addEventListener("click", downloadCalendar);
  }

  // =========================
  // MANDARINA DESIGN
  // =========================

  if (mandarinaLink) {
    mandarinaLink.href = "https://wa.me/50687051571";
  }
}

// =========================
// DOWNLOAD CALENDAR
// =========================

function downloadCalendar(event) {
  event.preventDefault();

  const start = new Date(invitation.eventDate);

  // =========================
  // DURACIÓN DEL EVENTO
  // =========================
  // 3 horas

  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  // =========================
  // FORMAT ICS DATE
  // =========================

  function formatICSDate(date) {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  }

  const startDate = formatICSDate(start);

  const endDate = formatICSDate(end);

  // =========================
  // EVENT DATA
  // =========================

  const title = invitation.title || "Evento";

  const location = `${invitation.venue.name}, ${invitation.venue.address}`;

  const description = invitation.subtitle || "Te esperamos.";

  // =========================
  // ICS CONTENT
  // =========================

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mandarina Design//Invitaciones//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@mandarinadesign.cr
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${escapeICS(title)}
LOCATION:${escapeICS(location)}
DESCRIPTION:${escapeICS(description)}
END:VEVENT
END:VCALENDAR`;

  // =========================
  // CREATE FILE
  // =========================

  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "evento.ics";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

// =========================
// ESCAPE ICALENDAR
// =========================

function escapeICS(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

