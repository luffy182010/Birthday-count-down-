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

let countdownFinished = false;


/* =========================================
   Update Countdown
========================================= */

function updateCountdown() {

    const now = Date.now();

    const difference = targetDate - now;


    if (difference <= 0) {

        if (!countdownFinished) {

            countdownFinished = true;

            countdownPage.style.display = "none";

            giftPage.style.display = "block";

            initializeScratchCard();
        }

        return;
    }


    const d = Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    );


    const h = Math.floor(
        (difference /
        (1000 * 60 * 60)) % 24
    );


    const m = Math.floor(
        (difference /
        (1000 * 60)) % 60
    );


    const s = Math.floor(
        (difference / 1000) % 60
    );


    days.textContent =
        String(d).padStart(2, "0");

    hours.textContent =
        String(h).padStart(2, "0");

    minutes.textContent =
        String(m).padStart(2, "0");

    seconds.textContent =
        String(s).padStart(2, "0");
}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================================
   Scratch Card
========================================= */

const canvas =
    document.getElementById("scratchCanvas");

const ctx =
    canvas.getContext("2d");

const clickHere =
    document.getElementById("clickHere");

let scratching = false;

let scratchInitialized = false;

let scratchedEnough = false;


/* =========================================
   Initialize Scratch
========================================= */

function initializeScratchCard() {

    if (scratchInitialized) {
        return;
    }

    scratchInitialized = true;


    /*
        Canvas الحقيقي يكون أكبر
        عشان الجودة على الجوال تكون أفضل
    */

    const dpr =
        window.devicePixelRatio || 1;

    canvas.width = 260 * dpr;
    canvas.height = 230 * dpr;

    ctx.scale(dpr, dpr);


    /*
        طبقة التخريش
    */

    ctx.fillStyle = "#e9a8bd";

    ctx.fillRect(
        0,
        0,
        260,
        230
    );


    /*
        زخرفة الطبقة
    */

    ctx.fillStyle = "#f7d5df";

    ctx.font =
        "600 18px Cairo";

    ctx.textAlign = "center";

    ctx.fillText(
        "Scratch me 🌷",
        130,
        105
    );


    ctx.font =
        "14px Cairo";

    ctx.fillStyle = "#fff5f8";

    ctx.fillText(
        "something is waiting...",
        130,
        135
    );


    /*
        Touch + Mouse
    */

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
   Start Scratching
========================================= */

function startScratch(event) {

    scratching = true;

    canvas.setPointerCapture?.(
        event.pointerId
    );

    scratch(event);
}


/* =========================================
   Scratching
========================================= */

function scratch(event) {

    if (!scratching || scratchedEnough) {
        return;
    }


    const rect =
        canvas.getBoundingClientRect();


    /*
        تحويل مكان الإصبع
        إلى مكان داخل الـCanvas
    */

    const x =
        (event.clientX - rect.left)
        * (260 / rect.width);


    const y =
        (event.clientY - rect.top)
        * (230 / rect.height);


    /*
        نمسح مكان الإصبع
    */

    ctx.globalCompositeOperation =
        "destination-out";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        24,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
        فحص نسبة التخريش
    */

    checkScratchProgress();
}


/* =========================================
   Stop Scratching
========================================= */

function stopScratch(event) {

    scratching = false;

    try {

        canvas.releasePointerCapture?.(
            event.pointerId
        );

    } catch (error) {
        // Ignore
    }
}


/* =========================================
   Check Scratch Percentage
========================================= */

function checkScratchProgress() {

    /*
        نأخذ صورة من الـCanvas
        ونحسب كم جزء صار شفاف
    */

    const imageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );


    const pixels =
        imageData.data;


    let transparent = 0;

    let total = 0;


    /*
        نفحص كل عدة بكسلات
        لتحسين الأداء على الجوال
    */

    for (
        let i = 3;
        i < pixels.length;
        i += 16
    ) {

        total++;

        if (pixels[i] === 0) {
            transparent++;
        }
    }


    const percentage =
        (transparent / total) * 100;


    /*
        إذا تخربش أكثر من 55%
    */

    if (percentage >= 55) {

        scratchedEnough = true;

        revealClickHere();
    }
}


/* =========================================
   Reveal Click Here
========================================= */

function revealClickHere() {

    /*
        نخلي باقي الطبقة تختفي
        بشكل لطيف
    */

    canvas.style.transition =
        "opacity 0.5s ease";

    canvas.style.opacity = "0";


    setTimeout(() => {

        canvas.style.display =
            "none";

        clickHere.style.display =
            "flex";

    }, 500);
}


/* =========================================
   Click Here
========================================= */

clickHere.addEventListener(
    "click",
    openBirthday
);


/*
    دعم اللمس بشكل مضمون
*/

clickHere.addEventListener(
    "touchend",
    (event) => {

        event.preventDefault();

        openBirthday();
    }
);


/* =========================================
   Open Birthday
========================================= */

let birthdayOpened = false;


function openBirthday() {

    if (birthdayOpened) {
        return;
    }

    birthdayOpened = true;


    /*
        إخفاء الهدية
    */

    giftPage.style.display =
        "none";


    /*
        إظهار صفحة عيد الميلاد
    */

    birthday.style.display =
        "block";


    /*
        تشغيل الاحتفال
    */

    createCelebration();


    /*
        بعد ثانيتين
        الاحتفال يختفي تلقائياً
    */

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


    /*
        إنشاء عدد كبير من
        القصاصات / الشرائط
    */

    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const piece =
            document.createElement(
                "span"
            );


        piece.className =
            "confetti";


        piece.textContent =
            symbols[
                Math.floor(
                    Math.random()
                    * symbols.length
                )
            ];


        piece.style.left =
            Math.random() * 100 + "vw";


        piece.style.fontSize =
            (12 + Math.random() * 18)
            + "px";


        piece.style.animationDelay =
            Math.random() * 0.6 + "s";


        piece.style.transform =
            `rotate(${Math.random() * 360}deg)`;


        celebration.appendChild(
            piece
        );
    }
}


/* =========================================
   Optional:
   إذا فتح الموقع بعد يوم الميلاد
   مباشرة يظهر صندوق الهدية
========================================= */

if (
    Date.now() >= targetDate
) {

    countdownFinished = true;

    countdownPage.style.display =
        "none";

    giftPage.style.display =
        "block";

    initializeScratchCard();
}
