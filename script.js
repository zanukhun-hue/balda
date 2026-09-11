const state = {
  birthday: "",
  choice: ""
};

const screens = [...document.querySelectorAll(".screen")];
const birthdayForm = document.querySelector("#birthday-form");
const birthdayInput = document.querySelector("#birthday");
const formMessage = document.querySelector("#form-message");
const checkButton = document.querySelector("#check-button");
const birthdayOutput = document.querySelector("#birthday-output");
const choiceReaction = document.querySelector("#choice-reaction");
const particlesLayer = document.querySelector("#particles");

const reactions = {
  young: "Экспертиза подтверждает: документ выглядит убедительно.",
  back: "Система рекомендует торт и удобное кресло. В таком порядке.",
  deny: "Ответ принят. Свидетель имеет право не давать показания против возраста."
};

function showScreen(name) {
  const current = document.querySelector(".screen--active");
  const next = document.querySelector(`[data-screen="${name}"]`);
  if (!next || next === current) return;

  if (current) {
    current.classList.add("screen--leaving");
    current.classList.remove("screen--active");
  }

  setTimeout(() => {
    if (current) current.classList.remove("screen--leaving");
    next.classList.add("screen--active");
    const focusTarget = next.querySelector("input, button");
    if (focusTarget && window.matchMedia("(min-width: 760px)").matches) focusTarget.focus({ preventScroll: true });

    if (name === "verdict") animateCounters(next);
  }, 230);
}

function formatBirthdayInput(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

function isValidBirthday(value) {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return false;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const now = new Date();
  const date = new Date(year, month - 1, day);
  const saneYear = year >= 1900 && year <= now.getFullYear();
  return saneYear && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function setLoading(isLoading) {
  checkButton.disabled = isLoading;
  checkButton.querySelector(".button-text").textContent = isLoading ? "Проверяю…" : "Проверить";
  checkButton.querySelector(".button-arrow").textContent = isLoading ? "···" : "→";
}

birthdayInput.addEventListener("input", (event) => {
  event.target.value = formatBirthdayInput(event.target.value);
  event.target.classList.remove("input--error");
  formMessage.textContent = "";
});

birthdayForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = birthdayInput.value.trim();

  if (!isValidBirthday(value)) {
    birthdayInput.classList.remove("input--error");
    void birthdayInput.offsetWidth;
    birthdayInput.classList.add("input--error");
    formMessage.textContent = value.length < 10
      ? "Нужна вся дата. Да, система очень требовательная."
      : "Так. Это становится неловко. Попробуй настоящую дату 😭";
    return;
  }

  state.birthday = value;
  setLoading(true);
  formMessage.style.color = "var(--green)";
  formMessage.textContent = "Сверяюсь с абсолютно надёжной базой данных…";

  setTimeout(() => {
    birthdayOutput.textContent = value;
    burst(window.innerWidth / 2, window.innerHeight * 0.56, 18);
    showScreen("success");
    setLoading(false);
    formMessage.textContent = "";
  }, 1050);
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});

document.querySelectorAll("[data-choice]").forEach((button) => {
  button.addEventListener("click", (event) => {
    state.choice = button.dataset.choice;
    choiceReaction.textContent = reactions[state.choice];
    const rect = event.currentTarget.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
    setTimeout(() => showScreen("verdict"), 330);
  });
});

document.querySelector("#open-gift").addEventListener("click", () => {
  const gift = document.querySelector("#gift");
  gift.classList.add("gift--open");
  const rect = gift.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 34);
  setTimeout(() => showScreen("coming"), 900);
});

document.querySelector("#restart").addEventListener("click", () => {
  state.birthday = "";
  state.choice = "";
  birthdayInput.value = "";
  formMessage.textContent = "";
  formMessage.style.color = "";
  document.querySelector("#gift").classList.remove("gift--open");
  showScreen("gate");
});

function animateCounters(root) {
  root.querySelectorAll("[data-counter]").forEach((element) => {
    const target = Number(element.dataset.counter);
    const duration = 850;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function burst(x, y, count = 20) {
  const safeMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!safeMotion) return;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.className = "particle";
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 55 + Math.random() * 90;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    dot.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    dot.style.width = `${5 + Math.random() * 7}px`;
    dot.style.height = dot.style.width;
    dot.style.animationDuration = `${650 + Math.random() * 450}ms`;
    particlesLayer.appendChild(dot);
    setTimeout(() => dot.remove(), 1200);
  }
}
