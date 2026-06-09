const finalPhoto =
localStorage.getItem(
    "finalPhoto"
);

document.getElementById(
    "finalPhoto"
).src = finalPhoto;

const popup =
document.querySelector(
    ".popup-overlay"
);

const printBtn =
document.querySelector(
    ".print-btn"
);

printBtn.addEventListener(
    "click",
    () => {

        popup.style.display =
        "flex";

    }
);

document.querySelector(
    ".cancel-btn"
).addEventListener(
    "click",
    () => {

        popup.style.display =
        "none";

    }
);

document.querySelector(
    ".yes-btn"
).addEventListener(
    "click",
    () => {

        window.print();

    }
);