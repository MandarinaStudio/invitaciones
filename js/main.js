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

    }

}

async function init() {

    document.body.classList.add("lock");



invitation = await loadInvitation();

if (!invitation) return;

console.log("Invitación cargada:", invitation);
console.log("Música:", invitation.music);

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

    const music = document.getElementById("bgMusic");

music.src =
    `invitations/${slug}/audio/music.mp3`;

}

init();

document
    .getElementById("enterButton")
    .addEventListener("click", enterInvitation);

function enterInvitation() {

    const welcome = document.getElementById("welcome");

    const hero = document.getElementById("hero");

    const music = document.getElementById("bgMusic");

    welcome.classList.add("fade-out");

    setTimeout(() => {

        welcome.style.display = "none";

        document.body.classList.remove("lock");

        hero.classList.add("active");

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