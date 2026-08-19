const targetDate = new Date("2026-08-23T00:00:00").getTime();

const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const countdownPage = document.getElementById("countdownPage");
const birthday = document.getElementById("birthday");

let heartsStarted = false;


/* =========================
   Update Countdown
========================= */

function updateCountdown() {

    const now = new Date().getTime();

    const difference = targetDate - now;


    // إذا وصل يوم الميلاد
    if (difference <= 0) {

        countdownPage.style.display = "none";
        birthday.style.display = "block";

        if (!heartsStarted) {
            heartsStarted = true;
            createHearts();
        }

        return;
    }


    // حساب الأيام
    const d = Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    );


    // حساب الساعات
    const h = Math.floor(
        (difference /
        (1000 * 60 * 60)) % 24
    );


    // حساب الدقائق
    const m = Math.floor(
        (difference /
        (1000 * 60)) % 60
    );


    // حساب الثواني
    const s = Math.floor(
        (difference /
        1000) % 60
    );


    // عرض الأرقام

    days.textContent =
        String(d).padStart(2, "0");

    hours.textContent =
        String(h).padStart(2, "0");

    minutes.textContent =
        String(m).padStart(2, "0");

    seconds.textContent =
        String(s).padStart(2, "0");
}


/* =========================
   Floating Hearts
========================= */

function createHearts() {

    setInterval(() => {

        const heart =
            document.createElement("div");

        heart.className = "heart";


        // تغيير الرمز عشوائياً

        heart.textContent =
            Math.random() > 0.5
                ? "♡"
                : "🌸";


        // مكان عشوائي

        heart.style.left =
            Math.random() * 100 + "vw";


        heart.style.bottom =
            "-30px";


        // سرعة عشوائية

        heart.style.animationDuration =
            (4 + Math.random() * 4) + "s";


        document.body.appendChild(heart);


        // حذف العنصر بعد انتهاء الحركة

        setTimeout(() => {
            heart.remove();
        }, 8000);

    }, 500);
}


/* =========================
   Start
========================= */

updateCountdown();

setInterval(
    updateCountdown,
    1000
);
