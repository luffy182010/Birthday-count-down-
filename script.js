/* =========================================
   Countdown
========================================= */

const targetDate = new Date("2026-08-23T00:00:00").getTime();

const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const countdownPage = document.getElementById("countdownPage");
const giftPage = document.getElementById("giftPage");
const birthday = document.getElementById("birthday");

const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

const clickHere = document.getElementById("clickHere");

let countdownFinished = false;
let scratching = false;
let scratchedEnough = false;
let birthdayOpened = false;


/* =========================================
   Countdown
========================================= */

function updateCountdown() {

    const difference = targetDate - Date.now();

    if (difference <= 0) {

        if (!countdownFinished) {

            countdownFinished = true;

            countdownPage.style.display = "none";
            giftPage.style.display = "block";

            setupScratchCard();
        }

        return;
    }

    const d = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const h = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const m = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const s = Math.floor(
        (difference / 1000) % 60
    );

    days.textContent = String(d).padStart(2, "0");
    hours.textContent = String(h).padStart(2, "0");
    minutes.textContent = String(m).padStart(2, "0");
    seconds.textContent = String(s).padStart(2, "0");
}


/* =========================================
   Scratch Card Setup
========================================= */

function setupScratchCard() {

    /*
        نخلي الحجم الداخلي للـCanvas
        نفس حجمه الظاهر
    */

    canvas.width = 260;
    canvas.height = 230;

    ctx.globalCompositeOperation = "source-over";

    /* طبقة الخربشة */

    ctx.fillStyle = "#e9a8bd";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* زخرفة */

    ctx.fillStyle = "#fff5f8";

    ctx.font = "600 18px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "Scratch me 🌷",
        130,
        105
    );


    ctx.font = "14px Arial";

    ctx.fillText(
        "something is waiting...",
        130,
        135
    );


    /*
        منع بعض حركات المتصفح
        أثناء لمس الكانفس
    */

    canvas.style.touchAction = "none";


    /* أحداث الماوس واللمس */

    canvas.addEventListener(
        "pointerdown",
        startScratch
    );

    canvas.addEventListener(
        "pointermove",
        scratch
    );

    canvas.addEventListener(
        "pointerup",
        stopScratch
    );

    canvas.addEventListener(
        "pointercancel",
        stopScratch
    );

    canvas.addEventListener(
        "pointerleave",
        stopScratch
    );
}


/* =========================================
   Start Scratch
========================================= */

function startScratch(event) {

    event.preventDefault();

    scratching = true;

    canvas.setPointerCapture(
        event.pointerId
    );

    scratch(event);
}


/* =========================================
   Scratch
========================================= */

function scratch(event) {

    if (!scratching || scratchedEnough) {
        return;
    }

    event.preventDefault();


    const rect =
        canvas.getBoundingClientRect();


    /*
        تحويل مكان الإصبع
        إلى إحداثيات الـCanvas
    */

    const x =
        (event.clientX - rect.left)
        * (canvas.width / rect.width);


    const y =
        (event.clientY - rect.top)
        * (canvas.height / rect.height);


    /*
        نمسح مكان الإصبع
    */

    ctx.globalCompositeOperation =
        "destination-out";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        28,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
        نرسم خط بين المكان السابق
        والحالي حتى لا تكون الخربشة متقطعة
    */

    if (
        canvas.lastX !== undefined &&
        canvas.lastY !== undefined
    ) {

        ctx.beginPath();

        ctx.moveTo(
            canvas.lastX,
            canvas.lastY
        );

        ctx.lineTo(x, y);

        ctx.lineWidth = 56;

        ctx.lineCap = "round";

        ctx.stroke();
    }


    canvas.lastX = x;
    canvas.lastY = y;


    checkScratch();
}


/* =========================================
   Stop Scratch
========================================= */

function stopScratch(event) {

    scratching = false;

    canvas.lastX = undefined;
    canvas.lastY = undefined;

    try {

        canvas.releasePointerCapture(
            event.pointerId
        );

    } catch (error) {

        // لا شيء
    }
}


/* =========================================
   Check Scratch Percentage
========================================= */

function checkScratch() {

    const imageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );


    const data =
        imageData.data;


    let transparent = 0;

    let total = 0;


    /*
        نفحص كل 16 بكسل
        لتقليل استهلاك الجوال
    */

    for (
        let i = 3;
        i < data.length;
        i += 16
    ) {

        total++;

        if (data[i] < 30) {
            transparent++;
        }
    }


    const percentage =
        (transparent / total) * 100;


    /*
        إذا تخربش 40%
        يظهر Click Here
    */

    if (percentage >= 40) {

        scratchedEnough = true;

        revealClickHere();
    }
}


/* =========================================
   Reveal Click Here
========================================= */

function revealClickHere() {

    canvas.style.transition =
        "opacity 0.5s ease";

    canvas.style.opacity = "0";


    setTimeout(() => {

        canvas.style.display = "none";

        clickHere.style.display = "flex";

    }, 500);
}


/* =========================================
   Click Here
========================================= */

clickHere.addEventListener(
    "click",
    openBirthday
);

clickHere.addEventListener(
    "touchend",
    function(event) {

        event.preventDefault();

        openBirthday();
    }
);


/* =========================================
   Open Birthday
========================================= */

function openBirthday() {

    if (birthdayOpened) {
        return;
    }

    birthdayOpened = true;


    giftPage.style.display = "none";

    birthday.style.display = "block";


    createCelebration();


    setTimeout(() => {

        const celebration =
            document.getElementById(
                "celebration"
            );

        celebration.innerHTML = "";

    }, 2200);
}


/* =========================================
   Celebration
========================================= */

function createCelebration() {

    const celebration =
        document.getElementById(
            "celebration"
        );


    const symbols = [
        "🎀",
        "🌷",
        "🌸",
        "♡",
        "✨",
        "🎉",
        "💗"
    ];


    for (let i = 0; i < 70; i++) {

        const piece =
            document.createElement("span");


        piece.className =
            "confetti";


        piece.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        piece.style.left =
            Math.random() * 100 + "vw";


        piece.style.fontSize =
            12 +
            Math.random() * 18 +
            "px";


        piece.style.animationDelay =
            Math.random() * 0.6 +
            "s";


        celebration.appendChild(piece);
    }
}


/* =========================================
   Start
========================================= */

updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/*
    إذا دخلت الصفحة بعد موعد الميلاد
    مباشرة يظهر صندوق الهدية
*/

if (Date.now() >= targetDate) {

    countdownFinished = true;

    countdownPage.style.display = "none";

    giftPage.style.display = "block";

    setupScratchCard();
}
