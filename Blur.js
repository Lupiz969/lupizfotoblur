// =========================
// Cute AI Camera
// Camera Controller
// =========================

// Ambil elemen HTML
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

        const constraints = {

            video: {

                facingMode: {
                    ideal: "user"
                },

                width: {
                    ideal: 1280
                },

                height: {
                    ideal: 720
                }

            },

            audio: false

        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        video.srcObject = stream;

        await video.play();

        cameraRunning = true;

        resizeCanvas();

        // Memberitahu gesture.js bahwa kamera sudah aktif
        window.dispatchEvent(new Event("cameraStarted"));

    } catch (error) {

        console.error(error);

        alert("Kamera tidak dapat diakses. Pastikan izin kamera sudah diberikan.");

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
// Resize Canvas
// =========================

function resizeCanvas() {

    if (!video.videoWidth || !video.videoHeight) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

}

// =========================
// Event
// =========================

video.addEventListener("loadedmetadata", resizeCanvas);

window.addEventListener("resize", resizeCanvas);

startBtn.addEventListener("click", startCamera);

stopBtn.addEventListener("click", stopCamera);

// =========================
// Blur Effect
// gesture.js akan memanggil ini
// =========================

window.enableBlur = function () {

    video.classList.add("blur");

};

window.disableBlur = function () {

    video.classList.remove("blur");

};