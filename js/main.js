const slug = "demo";

let invitation = null;

async function loadInvitation() {

    try {

        const response = await fetch(
            `invitations/${slug}/config/invitation.json`
        );

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

    // Welcome

    document.getElementById("eventTitle").textContent =
        invitation.title;

    document.getElementById("eventSubtitle").textContent =
        invitation.subtitle;

    document.getElementById("welcome").style.backgroundImage =
        `url(invitations/${slug}/img/${invitation.hero})`;

    // Hero

    document.getElementById("heroTitle").textContent =
        invitation.title;

    document.getElementById("heroDate").textContent =
        invitation.subtitle;

    document.getElementById("hero").style.backgroundImage =
        `url(invitations/${slug}/img/${invitation.hero})`;

    // Música

    const music =
        document.getElementById("bgMusic");

    music.src =
        `invitations/${slug}/audio/${invitation.music}`;

    // Detalles

    document.getElementById("venueName").textContent =
        invitation.venue.name;

    document.getElementById("venueAddress").textContent =
        invitation.venue.address;

    document.getElementById("mapsButton").href =
        invitation.venue.maps;

    // Dress Code

    document.getElementById("dressTitle").textContent =
        invitation.dressCode.title;

    document.getElementById("dressDescription").textContent =
        invitation.dressCode.description;

    // Actividades

    const activitiesGrid =
        document.getElementById("activitiesGrid");

    activitiesGrid.innerHTML = "";

    const icons = {

        "Inflable":"🏰",
        "Pintacaritas":"🎨",
        "Pizza":"🍕",
        "Piñata":"🪅",
        "Pastel":"🎂"

    };

    invitation.activities.forEach(activity => {

        activitiesGrid.innerHTML += `

            <div class="activity-card">

                <span>${icons[activity] || "🎉"}</span>

                <h3>${activity}</h3>

            </div>

        `;

    });

    // Countdown

    startCountdown(invitation.eventDate);

}

init();

document
    .getElementById("enterButton")
    .addEventListener("click", enterInvitation);

function enterInvitation() {

    const welcome =
        document.getElementById("welcome");

    const hero =
        document.getElementById("hero");

    const music =
        document.getElementById("bgMusic");

    welcome.classList.add("fade-out");

    setTimeout(() => {

        welcome.style.display = "none";

        document.body.classList.remove("lock");

        hero.style.display = "flex";

        hero.classList.add("active");

        document.getElementById("details").style.display =
            "block";

        document.getElementById("dressCode").style.display =
            "block";

        document.getElementById("activities").style.display =
            "block";

        music.volume = 0.35;

        music.play().catch(error => {

            console.log(error);

        });

    }, 800);

}

const musicButton =
    document.getElementById("musicButton");

musicButton.addEventListener("click", () => {

    const music =
        document.getElementById("bgMusic");

    if (music.paused) {

        music.play();

        musicButton.textContent = "🔊";

    } else {

        music.pause();

        musicButton.textContent = "🔇";

    }

});

function startCountdown(eventDate){

    const days =
        document.getElementById("days");

    const hours =
        document.getElementById("hours");

    const minutes =
        document.getElementById("minutes");

    const seconds =
        document.getElementById("seconds");

    function update(){

        const now = new Date().getTime();

        const target =
            new Date(eventDate).getTime();

        const difference =
            target - now;

        if(difference <= 0){

            days.textContent = "00";
            hours.textContent = "00";
            minutes.textContent = "00";
            seconds.textContent = "00";

            clearInterval(interval);

            return;

        }

        const d = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const h = Math.floor(
            (difference % (1000 * 60 * 60 * 24))
            / (1000 * 60 * 60)
        );

        const m = Math.floor(
            (difference % (1000 * 60 * 60))
            / (1000 * 60)
        );

        const s = Math.floor(
            (difference % (1000 * 60))
            / 1000
        );

        days.textContent =
            String(d).padStart(2,"0");

        hours.textContent =
            String(h).padStart(2,"0");

        minutes.textContent =
            String(m).padStart(2,"0");

        seconds.textContent =
            String(s).padStart(2,"0");

    }

    update();

    const interval =
        setInterval(update,1000);

}