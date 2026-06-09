const CLOUD_NAME = "dg9sjh0a8";
const UPLOAD_PRESET = "finalshoot_upload";

async function uploadToCloudinary(base64Image) {

    const formData = new FormData();

    formData.append(
        "file",
        base64Image
    );

    formData.append(
        "upload_preset",
        UPLOAD_PRESET
    );

    const response =
    await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const data =
    await response.json();

    return data.secure_url;
}

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
    async () => {

        try {

            const imageUrl =
            await uploadToCloudinary(
                finalPhoto
            );

            new QRCode(
                document.getElementById(
                    "qrcode"
                ),
                {
                    text: imageUrl,
                    width: 180,
                    height: 180
                }
            );

            alert(
                "Upload berhasil! QR Code dibuat."
            );

            window.print();

        }

        catch(error){

            console.error(error);

            alert(
                "Upload gagal."
            );

        }

    }
);