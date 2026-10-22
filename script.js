
/* =====================================
   CONFIGURACIÓN DE LA INVITACIÓN
   ===================================== */

const CONFIG = {
  name: "Ulises",

  // Fecha y hora local de Uruguay.
  // La cuenta llega a cero al comenzar el 24 de octubre.
  eventDate: "2026-10-24T00:00:00-03:00",

  // Número del organizador, con código de país y solo números.
  // REEMPLAZAR antes de publicar.
  whatsappNumber: "+598 98 146 770",

  whatsappMessage:
    "¡Hola! Confirmo mi asistencia al cumpleaños de Ulises 🎃"
};

/* =====================================
   UTILIDADES
   ===================================== */

const $ = (id) => document.getElementById(id);

document.title = `ULISES.exe — Halloween Birthday`;

/* =====================================
   CUENTA REGRESIVA
   ===================================== */

const targetTime = new Date(CONFIG.eventDate).getTime();

function updateCountdown() {
  if (!Number.isFinite(targetTime)) {
    $("countdownMessage").textContent =
      "No se pudo interpretar la fecha del evento.";
    return;
  }

  const remaining = targetTime - Date.now();

  if (remaining <= 0) {
    $("days").textContent = "00";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";

    $("countdownMessage").textContent =
      "🎃 ¡Llegó el momento! Que comience la noche.";

    return;
  }

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  $("days").textContent = String(days).padStart(2, "0");
  $("hours").textContent = String(hours).padStart(2, "0");
  $("minutes").textContent = String(minutes).padStart(2, "0");
  $("seconds").textContent = String(seconds).padStart(2, "0");

  $("countdownMessage").textContent = "";
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* =====================================
   MÚSICA DE FONDO
   ===================================== */

const music = $("music");
const enterBtn = $("enterBtn");
const soundBtn = $("soundBtn");
const replayBtn = $("replayBtn");

let entered = false;

function updateMusicControls(isPlaying) {
  soundBtn.hidden = false;

  $("soundLabel").textContent = isPlaying
    ? "MÚSICA ON"
    : "MÚSICA OFF";

  soundBtn.setAttribute(
    "aria-label",
    isPlaying ? "Silenciar música" : "Activar música"
  );

  $("musicStatus").textContent = isPlaying
    ? "♫ La noche ya tiene banda sonora"
    : "♫ Tocá el botón para activar la música";
}

async function playMusic() {
  try {
    await music.play();
    updateMusicControls(true);
    return true;
  } catch (error) {
    updateMusicControls(false);
    $("musicStatus").textContent =
      "No se pudo reproducir. Revisá musica.mp3 y volvé a intentarlo.";
    return false;
  }
}

enterBtn.addEventListener("click", async () => {
  if (!entered) {
    entered = true;

    enterBtn.querySelector("span").textContent =
      "☠ BIENVENIDO A LA NOCHE";

    $("detalles").scrollIntoView({
      behavior: "smooth"
    });
  }

  await playMusic();
});

soundBtn.addEventListener("click", async () => {
  if (music.paused) {
    await playMusic();
  } else {
    music.pause();
    updateMusicControls(false);
  }
});

replayBtn.addEventListener("click", async () => {
  await playMusic();
});

/* =====================================
   CONFIRMACIÓN POR WHATSAPP
   ===================================== */

const number = CONFIG.whatsappNumber.replace(/\D/g, "");
const rsvpBtn = $("rsvpBtn");
const rsvpNotice = $("rsvpNotice");

if (/^\d{8,15}$/.test(number)) {
  const message = encodeURIComponent(CONFIG.whatsappMessage);

  rsvpBtn.href =
    `https://wa.me/${number}?text=${message}`;

  rsvpBtn.hidden = false;
  rsvpNotice.textContent =
    "Confirmá tu asistencia directamente por WhatsApp.";
} else {
  rsvpBtn.hidden = true;
  rsvpNotice.textContent =
    "El botón de confirmación estará disponible cuando se configure el WhatsApp del organizador.";
}
