// =========================
// CAROUSEL
// =========================

const carousel =
document.getElementById("carousel");

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

let currentSlide = 0;

nextBtn.addEventListener("click", () => {

    if(currentSlide < 1){

        currentSlide++;

        carousel.style.transform =
        "translateX(-720px)";

    }

});

prevBtn.addEventListener("click", () => {

    if(currentSlide > 0){

        currentSlide--;

        carousel.style.transform =
        "translateX(0px)";

    }

});


// =========================
// FRAME SELECTION
// =========================

const frameCards =
document.querySelectorAll(".frame-card");

let selectedFrame = null;

frameCards.forEach(card => {

    card.addEventListener("click", () => {

        frameCards.forEach(item => {

            item.classList.remove(
                "selected"
            );

        });

        card.classList.add(
            "selected"
        );

        selectedFrame =
        card.dataset.frame;

    });

});


// =========================
// NEXT BUTTON
// =========================

const nextPageBtn =
document.getElementById(
    "nextPageBtn"
);

nextPageBtn.addEventListener(
    "click",
    () => {

        if(!selectedFrame){

            alert(
                "Please choose a frame first!"
            );

            return;
        }

        localStorage.setItem(
            "selectedFrame",
            selectedFrame
        );

        window.location.href =
        "../codingcamera/camera.html";

    }
);


// =========================
// BACK BUTTON
// =========================

const backBtn =
document.querySelector(
    ".back-btn"
);

backBtn.addEventListener(
    "click",
    () => {

        history.back();

    }
);