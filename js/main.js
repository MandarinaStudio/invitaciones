async function init(){

    const response = await fetch("config/invitation.json");

    const invitation = await response.json();

    document.getElementById("eventTitle").textContent = invitation.title;

    document.getElementById("eventSubtitle").textContent = invitation.subtitle;

    document.getElementById("welcome").style.backgroundImage =
        `url(${invitation.hero})`;

}

init();