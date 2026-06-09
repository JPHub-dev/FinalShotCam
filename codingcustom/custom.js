const selectedFrame =
localStorage.getItem(
    "selectedFrame"
);

const colorPicker =
document.getElementById(
    "frameColor"
);

const frameCard =
document.querySelector(".frame-card");

colorPicker.addEventListener(
    "input",
    () => {

        frameCard.style.backgroundColor =
        colorPicker.value;

    }
);

const photos =
JSON.parse(
    localStorage.getItem(
        "photos"
    )
);

console.log(selectedFrame);
console.log(photos);

const framePreview =
document.getElementById(
    "framePreview"
);

if(
    selectedFrame === "2x2" ||
    selectedFrame === "2x3"
){
    frameCard.classList.add("a5-card");
}

if(
    selectedFrame === "strip3" ||
    selectedFrame === "strip4"
){
    frameCard.classList.add("strip-card");
}

if(selectedFrame === "2x2"){
    framePreview.classList.add("layout-2x2");
}

if(selectedFrame === "2x3"){
    framePreview.classList.add("layout-2x3");
}

if(selectedFrame === "strip4"){
    framePreview.classList.add("layout-strip4");
}

if(selectedFrame === "strip3"){
    framePreview.classList.add("layout-strip3");
}

// TAMPILKAN FOTO

photos.forEach(photo => {

    framePreview.innerHTML += `
        <div class="photo-box">
            <img src="${photo}">
        </div>
    `;

});

const captionInput =
document.getElementById(
    "captionInput"
);

const captionText =
document.getElementById(
    "captionPreview"
);

captionInput.addEventListener(
    "input",
    () => {

        captionText.innerText =
        captionInput.value;

    }
);

const counter =
document.getElementById(
    "counter"
);

captionInput.addEventListener(
    "input",
    () => {

        counter.innerText =
        `${captionInput.value.length}/50`;

    }
);

const nextBtn =
document.querySelector(
    ".next-btn"
);

nextBtn.addEventListener(
    "click",
    async () => {

        const canvas =
        await html2canvas(frameCard);

        const finalPhoto =
        canvas.toDataURL("image/png");

        localStorage.setItem(
            "finalPhoto",
            finalPhoto
        );

        window.location.href =
        "../codingprint/print.html";

    }
);