const state = { birthday: "", choice: "", complaint: "", chat: "", catName: "", absurd: "" };

const birthdayForm = document.querySelector("#birthday-form");
const birthdayInput = document.querySelector("#birthday");
const formMessage = document.querySelector("#form-message");
const checkButton = document.querySelector("#check-button");
const birthdayOutput = document.querySelector("#birthday-output");
const choiceReaction = document.querySelector("#choice-reaction");
const absurdReaction = document.querySelector("#absurd-reaction");
const complaintReaction = document.querySelector("#complaint-reaction");
const chatReaction = document.querySelector("#chat-reaction");
const catForm = document.querySelector("#cat-form");
const catInput = document.querySelector("#cat-name");
const catMessage = document.querySelector("#cat-message");
const catResult = document.querySelector("#cat-result");
const catResultName = document.querySelector("#cat-result-name");
const particlesLayer = document.querySelector("#particles");

const reactions = {
  young: "Экспертиза подтверждает: документ выглядит убедительно.",
  back: "Система рекомендует торт и удобное кресло. В таком порядке.",
  deny: "Ответ принят. Свидетель имеет право не давать показания против возраста."
};

const absurdReactions = {
  bills: "Очень взрослый ответ. Подозрительно взрослый.",
  sleep: "Система зафиксировала внезапную любовь к раннему возвращению домой.",
  pharmacy: "Ещё немного — и начнёшь сравнивать цены на витамины добровольно.",
  none: "Наконец-то ответ, которому можно доверять."
};

const complaintReactions = {
  promise: "Обещание принято. Исполнение требований, к сожалению, не гарантируется.",
  lawyer: "Разумно. Материалы дела уже выглядят плохо для обвиняемого."
};

const chatReactions = {
  magic: "Да-да. Несколько тысяч сообщений просто испарились. Бывает каждый день.",
  evidence: "Следствие благодарит за сотрудничество. Именно так всё и было.",
  silence: "Показания приняты. Камеры наблюдения всё равно всё видели."
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
    next.scrollTop = 0;
    next.classList.add("screen--active");
    const focusTarget = next.querySelector("input, button");
    if (focusTarget && window.matchMedia("(min-width: 760px)").matches) focusTarget.focus({ preventScroll: true });
    if (name === "verdict" || name === "research") animateCounters(next);
    if (name === "final") {
      setTimeout(() => burst(window.innerWidth / 2, window.innerHeight * 0.55, 42), 350);
    }
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
  const day = Number(dd), month = Number(mm), year = Number(yyyy);
  const now = new Date();
  const date = new Date(year, month - 1, day);
  return year >= 1900 && year <= now.getFullYear() && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
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
    formMessage.style.color = "";
    formMessage.textContent = value.length < 10 ? "Нужна вся дата. Да, система очень требовательная." : "Так. Это становится неловко. Попробуй настоящую дату 😭";
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
  }, 950);
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});

document.querySelectorAll("[data-choice]").forEach((button) => {
  button.addEventListener("click", (event) => {
    state.choice = button.dataset.choice;
    choiceReaction.textContent = reactions[state.choice];
    burstFromElement(event.currentTarget, 24);
    setTimeout(() => showScreen("verdict"), 330);
  });
});

document.querySelectorAll("[data-complaint]").forEach((button) => {
  button.addEventListener("click", (event) => {
    state.complaint = button.dataset.complaint;
    complaintReaction.textContent = complaintReactions[state.complaint];
    burstFromElement(event.currentTarget, 18);
    setTimeout(() => showScreen("deleted"), 900);
  });
});

document.querySelectorAll("[data-chat]").forEach((button) => {
  button.addEventListener("click", (event) => {
    state.chat = button.dataset.chat;
    chatReaction.textContent = chatReactions[state.chat];
    burstFromElement(event.currentTarget, 20);
    setTimeout(() => showScreen("cats"), 1050);
  });
});

catForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = catInput.value.trim();
  if (!name) {
    catInput.classList.remove("input--error");
    void catInput.offsetWidth;
    catInput.classList.add("input--error");
    catMessage.textContent = "Нет-нет. Так я и сам умею не помнить.";
    return;
  }
  state.catName = name;
  catMessage.textContent = "";
  catResultName.textContent = `Бетон и ${name}`;
  catForm.classList.add("is-hidden");
  catResult.classList.remove("is-hidden");
  burstFromElement(catResult, 22);
});

catInput.addEventListener("input", () => {
  catInput.classList.remove("input--error");
  catMessage.textContent = "";
});

document.querySelectorAll("[data-absurd]").forEach((button) => {
  button.addEventListener("click", (event) => {
    state.absurd = button.dataset.absurd;
    absurdReaction.textContent = absurdReactions[state.absurd];
    burstFromElement(event.currentTarget, 26);
    setTimeout(() => showScreen("research"), 360);
  });
});

document.querySelector("#open-gift").addEventListener("click", () => {
  const gift = document.querySelector("#gift");
  gift.classList.add("gift--open");
  burstFromElement(gift, 34);
  setTimeout(() => showScreen("evidence"), 880);
});

document.querySelector("#restart").addEventListener("click", () => {
  state.birthday = ""; state.choice = ""; state.complaint = ""; state.chat = ""; state.catName = ""; state.absurd = "";
  birthdayInput.value = "";
  formMessage.textContent = "";
  formMessage.style.color = "";
  document.querySelector("#gift").classList.remove("gift--open");
  complaintReaction.textContent = "";
  chatReaction.textContent = "";
  catInput.value = "";
  catMessage.textContent = "";
  catForm.classList.remove("is-hidden");
  catResult.classList.add("is-hidden");
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

function burstFromElement(element, count) {
  const rect = element.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, count);
}

function burst(x, y, count = 20) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.className = "particle";
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 55 + Math.random() * 100;
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
