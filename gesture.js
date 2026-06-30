// ========================================
// gesture.js
// MediaPipe Hands - Peace Gesture Detection
// ========================================

// Membuat objek Hands
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

// Konfigurasi
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.75,
    minTrackingConfidence: 0.75
});

// Variabel status
let camera = null;
let isBlur = false;

// ========================================
// Saat MediaPipe selesai mendeteksi
// ========================================

hands.onResults(onResults);

function onResults(results){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Tidak ada tangan
    if(!results.multiHandLandmarks ||
       results.multiHandLandmarks.length===0){

        if(isBlur){

            disableBlur();
            isBlur=false;

        }

        return;

    }

    const landmarks = results.multiHandLandmarks[0];

    // Gambar landmark tangan
    drawConnectors(
        ctx,
        landmarks,
        HAND_CONNECTIONS,
        {
            color:"#00E5FF",
            lineWidth:4
        }
    );

    drawLandmarks(
        ctx,
        landmarks,
        {
            color:"#FF4081",
            radius:5
        }
    );

    // Deteksi Peace
    const peace = detectPeace(landmarks);

    if(peace){

        if(!isBlur){

            enableBlur();
            isBlur=true;

        }

    }else{

        if(isBlur){

            disableBlur();
            isBlur=false;

        }

    }

}

// ========================================
// Deteksi Gesture Peace
// ========================================

function detectPeace(lm){

    // Landmark:
    // 8  = ujung telunjuk
    // 6  = sendi telunjuk
    // 12 = ujung jari tengah
    // 10 = sendi jari tengah
    // 16 = ujung jari manis
    // 14 = sendi jari manis
    // 20 = ujung kelingking
    // 18 = sendi kelingking

    const indexUp =
        lm[8].y < lm[6].y;

    const middleUp =
        lm[12].y < lm[10].y;

    const ringDown =
        lm[16].y > lm[14].y;

    const pinkyDown =
        lm[20].y > lm[18].y;

    return (
        indexUp &&
        middleUp &&
        ringDown &&
        pinkyDown
    );

}

// ========================================
// Jalankan kamera MediaPipe
// ========================================

window.addEventListener("cameraStarted",()=>{

    camera = new Camera(video,{

        onFrame: async()=>{

            await hands.send({

                image: video

            });

        },

        width:1280,
        height:720

    });

    camera.start();

});