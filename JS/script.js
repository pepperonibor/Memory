const plateau = document.getElementById("grille-jeu");
const affichageCoups = document.getElementById("compteur-coups");
const affichageChrono = document.getElementById("chrono");
const affichageFin = document.getElementById("message-fin");
const boutonRejouer = document.getElementById("btn-rejouer");

let dimension = 150;
let paquetCartes = [];
let carte1 = null;
let carte2 = null;
let blocage = false;
let nbCoups = 0;
let nbTrouvees = 0;
let secondes = 0;
let chrono = null;

function melanger(tab) {
    for (let i = tab.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [tab[i], tab[j]] = [tab[j], tab[i]];
    }
}

function initGame() {
    plateau.innerHTML = "";
    affichageFin.textContent = "";
    nbCoups = 0;
    nbTrouvees = 0;
    secondes = 0;
    carte1 = null;
    carte2 = null;
    blocage = false;

    affichageCoups.textContent = "0";
    affichageChrono.textContent = "00:00";

    clearInterval(chrono);
    startTimer();

    let imgStart = Math.floor(Math.random() * 100) + 1;
    let images = [];
    for (let i = imgStart; i <= imgStart + 7; i++) {
        images.push(`https://picsum.photos/seed/${i}/${dimension}/${dimension}`);
    }

    paquetCartes = [...images, ...images];
    melanger(paquetCartes);

    paquetCartes.forEach(function (urlImage) {
        let elementCarte = document.createElement("div");
        elementCarte.classList.add("carte");
        elementCarte.setAttribute("role", "button");
        elementCarte.setAttribute("tabindex", "0");
        elementCarte.dataset.value = urlImage;

        elementCarte.addEventListener("click", function () {
            gererClic(elementCarte);
        });

        plateau.appendChild(elementCarte);
    });
}

function gererClic(carte) {
    if (blocage || carte.classList.contains("trouvee") || carte === carte1 || carte.firstChild) {
        return;
    }

    let img = document.createElement("img");
    img.src = carte.dataset.value;
    img.alt = "Image memory";
    carte.appendChild(img);

    if (!carte1) {
        carte1 = carte;
        return;
    }

    carte2 = carte;
    blocage = true;
    nbCoups++;
    affichageCoups.textContent = nbCoups;

    verifierPaire();
}

function verifierPaire() {
    if (carte1.dataset.value === carte2.dataset.value) {
        carte1.classList.add("trouvee");
        carte2.classList.add("trouvee");
        nbTrouvees += 2;
        resetSelection();

        if (nbTrouvees === paquetCartes.length) {
            clearInterval(chrono);
            affichageFin.textContent = `Gagné ! En ${nbCoups} coups et ${formatTime(secondes)}.`;
        }
    } else {
        setTimeout(function () {
            carte1.innerHTML = "";
            carte2.innerHTML = "";
            resetSelection();
        }, 800);
    }
}

function resetSelection() {
    carte1 = null;
    carte2 = null;
    blocage = false;
}

function startTimer() {
    chrono = setInterval(function () {
        secondes++;
        affichageChrono.textContent = formatTime(secondes);
    }, 1000);
}

function formatTime(sec) {
    let min = String(Math.floor(sec / 60)).padStart(2, "0");
    let s = String(sec % 60).padStart(2, "0");
    return `${min}:${s}`;
}

boutonRejouer.addEventListener("click", function () {
    boutonRejouer.textContent = boutonRejouer.textContent === "Jouer" ? "Rejouer" : boutonRejouer.textContent;
    initGame();
});