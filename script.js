const cameraButton = document.querySelector(".camera-button");
const countdown = document.querySelector(".countdown");
const retakeButton = document.querySelector(".retake-button");

const video = document.getElementById("camera");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let currentPhoto = 0;

cameraButton.addEventListener("click", () => {

  countdown.classList.remove("hidden");
  cameraButton.classList.add("hidden");

  let number = 3;

  countdown.innerText = number;

  const timer = setInterval(() => {

    number--;

    if (number > 0) {
      countdown.innerText = number;
    }

    else {
      clearInterval(timer);

      countdown.classList.add("hidden");
      cameraButton.classList.remove("hidden");

      document.querySelector(".photo-preview")
        .classList.remove("hidden");

      document.querySelector(".camera-frame")
        .classList.add("active");

      currentPhoto++;

      const currentSlot = document.getElementById(
      `slot${currentPhoto}`
      );

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.save();
      context.scale(-1, 1);
      context.drawImage(
        video,
        -canvas.width,0,
        canvas.width,
        canvas.height
      );
      context.restore();

const image = canvas.toDataURL("image/png");

currentSlot.innerHTML = `
  <img src="${image}">
`;

      if (currentPhoto === 4) {

      document.querySelector(".next-button")
      .classList.remove("hidden");

      }
      document.querySelector(".retake-button")
      .classList.remove("hidden");
    }

  }, 1000);

});

retakeButton.addEventListener("click", () => {

  if (currentPhoto > 0) {

    const currentSlot = document.getElementById(
      `slot${currentPhoto}`
    );

    currentSlot.innerHTML = "";

    currentPhoto--;

    if (currentPhoto === 0) {

  retakeButton.classList.add("hidden");

}
  }

});
const nextButton = document.querySelector(".next-button");

nextButton.addEventListener("click", () => {

  alert("NEXT PAGE");

});
navigator.mediaDevices.getUserMedia({
  video: true
})

.then((stream) => {

  video.srcObject = stream;

})

.catch((error) => {

  console.log(error);

});