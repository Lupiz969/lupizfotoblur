// =========================
// Cute AI Camera
// Camera Controller
// =========================

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const ctx = canvas.getContext("2d");

let stream = null;
let cameraRunning = false;

// Digunakan oleh gesture.js
window.video = video;
window.canvas = canvas;
window.ctx = ctx;

// =========================
// Start Camera
// =========================

async function startCamera() {

    if (cameraRunning) return;

    try {

        stream = await navigator.mediaDevices.getUserMedia({

            video: {

                width: 1280,
                height: 720,
                facingMode: "user"

            },

            audio: false

        });

        video.srcObject = stream;

        await video.play();

        cameraRunning = true;

        resizeCanvas();

        window.dispatchEvent(new Event("cameraStarted"));

    } catch (error) {

        console.error(error);

        alert("Kamera tidak dapat diakses.");

    }

}

// =========================
// Stop Camera
// =========================

function stopCamera() {

    if (!stream) return;

    stream.getTracks().forEach(track => track.stop());

    video.srcObject = null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cameraRunning = false;

}

// =========================
// Canvas mengikuti ukuran video
// =========================

function resizeCanvas() {

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

}

video.addEventListener("loadedmetadata", resizeCanvas);

window.addEventListener("resize", resizeCanvas);

// =========================
// Event Button
// =========================

startBtn.addEventListener("click", startCamera);

stopBtn.addEventListener("click", stopCamera);

// =========================
// Helper Blur
// gesture.js akan memanggil ini
// =========================

window.enableBlur = function () {

    video.classList.add("blur");

};

window.disableBlur = function () {

    video.classList.remove("blur");

};