/* =========================================
   SETTINGS
========================================= */

const targetDate = new Date("2026-08-23T00:00:00").getTime();

const IMAGE_PATH = "./kayuki.png";


/* =========================================
   ELEMENTS
========================================= */

const countdownPage =
    document.getElementById("countdownPage");

const giftPage =
    document.getElementById("giftPage");

const birthday =
    document.getElementById("birthday");

const days =
    document.getElementById("days");

const hours =
    document.getElementById("hours");

const minutes =
    document.getElementById("minutes");

const seconds =
    document.getElementById("seconds");

const canvas =
    document.getElementById("scratchCanvas");

const clickHere =
    document.getElementById("clickHere");

const birthdayImage =
    document.getElementById("birthdayImage");


/* =========================================
   VARIABLES
========================================= */

let countdownFinished = false;
let scratchInitialized = false;
let scratching = false;
let scratchedEnough = false;
let birthdayOpened = false;

let lastX = null;
let lastY = null;


/* =========================================
   COUNTDOWN
========================================= */

function updateCountdown() {

    const difference =
        targetDate - Date.now();


    /*
        إذا انتهى الوقت
    */

    if (difference <= 0) {

        if (!countdownFinished) {

            countdownFinished = true;

            showGift();

        }

        return;
    }


    /*
        الأيام
    */

    const d =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    /*
        الساعات
    */

    const h =
        Math.floor(
            (difference /
            (1000 * 60 * 60)) % 24
        );


    /*
        الدقائق
    */

    const m =
        Math.floor(
            (difference /
            (1000 * 60)) % 60
        );


    /*
        الثواني
    */

    const s =
        Math.floor(
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


/* =========================================
   SHOW GIFT
========================================= */

function showGift() {

    countdownPage.style.display =
        "none";

    giftPage.style.display =
        "block";

    birthday.style.display =
        "none";


    setupScratchCard();
}


/* =========================================
   SCRATCH CARD
========================================= */

function setupScratchCard() {

    if (scratchInitialized) {
        return;
    }

    scratchInitialized = true;


    /*
        حجم الـCanvas
    */

    canvas.width = 260;
    canvas.height = 230;


    /*
        طبقة الخربشة
    */

    ctxReset();


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


    canvas.style.touchAction =
        "none";
}


/* =========================================
   CANVAS CONTEXT
========================================= */

const ctx =
    canvas.getContext("2d");


function ctxReset() {

    ctx.globalCompositeOperation =
        "source-over";


    /*
        لون طبقة الخربشة
    */

    ctx.fillStyle =
        "#e9a8bd";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
        النص
    */

    ctx.textAlign =
        "center";


    ctx.fillStyle =
        "#fff5f8";


    ctx.font =
        "600 19px Arial";


    ctx.fillText(
        "Scratch me 🌷",
        130,
        105
    );


    ctx.font =
        "14px Arial";


    ctx.fillText(
        "something is waiting...",
        130,
        135
    );
}


/* =========================================
   START SCRATCH
========================================= */

function startScratch(event) {

    event.preventDefault();

    scratching = true;

    lastX = null;
    lastY = null;


    try {

        canvas.setPointerCapture(
            event.pointerId
        );

    } catch (error) {
        // Ignore
    }


    scratch(event);
}


/* =========================================
   SCRATCH
========================================= */

function scratch(event) {

    if (
        !scratching ||
        scratchedEnough
    ) {
        return;
    }


    event.preventDefault();


    /*
        مكان الـCanvas الحقيقي
    */

    const rect =
        canvas.getBoundingClientRect();


    /*
        تحويل مكان الإصبع
        إلى إحداثيات Canvas
    */

    const x =
        (event.clientX - rect.left)
        *
        (canvas.width / rect.width);


    const y =
        (event.clientY - rect.top)
        *
        (canvas.height / rect.height);


    /*
        نمسح مكان الإصبع
    */

    ctx.globalCompositeOperation =
        "destination-out";


    /*
        دائرة الخربشة
    */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
        خط بين حركة الإصبع
        والحركة السابقة
    */

    if (
        lastX !== null &&
        lastY !== null
    ) {

        ctx.beginPath();

        ctx.moveTo(
            lastX,
            lastY
        );

        ctx.lineTo(
            x,
            y
        );

        ctx.lineWidth =
            50;

        ctx.lineCap =
            "round";

        ctx.stroke();
    }


    lastX = x;
    lastY = y;


    /*
        التحقق من نسبة التخريش
    */

    checkScratchProgress();
}


/* =========================================
   STOP SCRATCH
========================================= */

function stopScratch(event) {

    scratching = false;

    lastX = null;
    lastY = null;


    try {

        canvas.releasePointerCapture(
            event.pointerId
        );

    } catch (error) {
        // Ignore
    }
}


/* =========================================
   CHECK SCRATCH
========================================= */

function checkScratchProgress() {

    /*
        نأخذ بيانات الـCanvas
    */

    const imageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );


    const data =
        imageData.data;


    let transparentPixels = 0;
    let checkedPixels = 0;


    /*
        نفحص كل 4 بكسلات
    */

    for (
        let i = 3;
        i < data.length;
        i += 16
    ) {

        checkedPixels++;


        /*
            Alpha = 0
            يعني أن المكان تم تخريشه
        */

        if (data[i] < 20) {

            transparentPixels++;
        }
    }


    const percentage =
        (
            transparentPixels /
            checkedPixels
        ) * 100;


    /*
        إذا تخربش 40%
    */

    if (percentage >= 40) {

        scratchedEnough = true;

        revealClickHere();
    }
}


/* =========================================
   REVEAL CLICK HERE
========================================= */

function revealClickHere() {

    canvas.style.transition =
        "opacity 0.5s ease";


    canvas.style.opacity =
        "0";


    setTimeout(() => {

        canvas.style.display =
            "none";


        clickHere.style.display =
            "flex";

    }, 500);
}


/* =========================================
   CLICK HERE
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
   OPEN BIRTHDAY
========================================= */

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
        إجبار الصورة على استخدام
        المسار الصحيح
    */

    if (birthdayImage) {

        birthdayImage.src =
            IMAGE_PATH;

        birthdayImage.style.display =
            "block";
    }


    /*
        الاحتفال
    */

    createCelebration();


    /*
        تنظيف الاحتفال بعد ثانيتين
    */

    setTimeout(() => {

        const celebration =
            document.getElementById(
                "celebration"
            );

        if (celebration) {

            celebration.innerHTML =
                "";
        }

    }, 2200);
}


/* =========================================
   CELEBRATION
========================================= */

function createCelebration() {

    const celebration =
        document.getElementById(
            "celebration"
        );


    if (!celebration) {
        return;
    }


    const symbols = [
        "🎀",
        "🌷",
        "🌸",
        "♡",
        "✨",
        "🎉",
        "💗",
        "🎊"
    ];


    /*
        إنشاء الشرائط والقصاصات
    */

    for (
        let i = 0;
        i < 80;
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
                    Math.random() *
                    symbols.length
                )
            ];


        piece.style.left =
            Math.random() *
            100 +
            "vw";


        piece.style.fontSize =
            (
                12 +
                Math.random() * 18
            ) +
            "px";


        piece.style.animationDelay =
            (
                Math.random() * 0.5
            ) +
            "s";


        piece.style.animationDuration =
            (
                1.5 +
                Math.random() * 1
            ) +
            "s";


        celebration.appendChild(
            piece
        );
    }
}


/* =========================================
   IMAGE FALLBACK
========================================= */

if (birthdayImage) {

    birthdayImage.addEventListener(
        "error",
        function() {

            console.log(
                "Image not found:",
                IMAGE_PATH
            );

        }
    );
}


/* =========================================
   START
========================================= */

updateCountdown();


setInterval(
    updateCountdown,
    1000
);


/* =========================================
   IF ALREADY BIRTHDAY
========================================= */

if (
    Date.now() >= targetDate
) {

    countdownFinished = true;

    showGift();
}
