const slug = "demo";

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

    const invitation = await loadInvitation();

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

}

init();

document
    .getElementById("enterButton")
    .addEventListener("click", enterInvitation);

function enterInvitation() {

    const welcome = document.getElementById("welcome");
    const hero = document.getElementById("hero");

    welcome.classList.add("fade-out");

    setTimeout(() => {

        welcome.style.display = "none";

        document.body.classList.remove("lock");

        hero.classList.add("active");

       

    }, 800);

}