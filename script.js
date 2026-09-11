const state = { birthday: "", choice: "", complaint: "", chat: "", catName: "", trivia: "", favoriteColor: "", favoriteFood: "", absurd: "" };

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
const sparklesLayer = document.querySelector("#floating-sparkles");
const flashLayer = document.querySelector("#screen-flash");
const finalReveal = document.querySelector("#final-reveal");
const triviaReaction = document.querySelector("#trivia-reaction");
const favoritesForm = document.querySelector("#favorites-form");
const favoritesMessage = document.querySelector("#favorites-message");
const favoriteColorInput = document.querySelector("#fav-color");
const favoriteFoodInput = document.querySelector("#fav-food");
const favoritesResult = document.querySelector("#favorites-result");
const favoritesOutput = document.querySelector("#favorites-output");
const shareAnswersButton = document.querySelector("#share-answers");
const shareStatus = document.querySelector("#share-status");

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


const triviaReactions = {
  roblox: "Верно. Великая история действительно началась в Roblox.",
  school: "Нет. Было бы слишком обычно. Roblox звучит куда солиднее.",
  street: "Красиво, но нет. Наш лор всё-таки цифровой."
};

function showScreen(name) {
  const current = document.querySelector(".screen--active");
  const next = document.querySelector(`[data-screen="${name}"]`);
  if (!next || next === current) return;

  flashTransition();

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
    revealText(next);
    if (name === "verdict" || name === "research") animateCounters(next);
    if (name === "archive") {
      setTimeout(() => burst(window.innerWidth / 2, window.innerHeight * 0.48, 18), 220);
    }
    if (name === "deleted") {
      setTimeout(() => glitchCard(), 180);
    }
    if (name === "cats") {
      setTimeout(() => burst(window.innerWidth * 0.52, window.innerHeight * 0.44, 16, "paw"), 260);
    }
    if (name === "final") {
      setTimeout(() => burst(window.innerWidth / 2, window.innerHeight * 0.55, 42), 350);
      setTimeout(runFinalReveal, 180);
    }
    if (name === "postcredit" && shareStatus) {
      shareStatus.textContent = "";
      shareStatus.style.color = "";
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

document.querySelectorAll("[data-trivia]").forEach((button) => {
  button.addEventListener("click", (event) => {
    state.trivia = button.dataset.trivia;
    triviaReaction.textContent = triviaReactions[state.trivia];
    burstFromElement(event.currentTarget, 18, state.trivia === "roblox" ? "pixel" : "heart");
    setTimeout(() => showScreen("favorites"), 980);
  });
});

favoritesForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const color = favoriteColorInput.value.trim();
  const food = favoriteFoodInput.value.trim();
  if (!color || !food) {
    favoritesMessage.textContent = "Заполни оба поля. Наука не терпит таких пробелов.";
    [favoriteColorInput, favoriteFoodInput].forEach((input) => {
      if (!input.value.trim()) {
        input.classList.remove("input--error");
        void input.offsetWidth;
        input.classList.add("input--error");
      }
    });
    return;
  }
  state.favoriteColor = color;
  state.favoriteFood = food;
  favoritesMessage.textContent = "";
  favoritesOutput.textContent = `${color} · ${food}`;
  favoritesResult.classList.remove("is-hidden");
  burstFromElement(favoritesResult, 24, "star");
  setTimeout(() => showScreen("absurd"), 980);
});

[favoriteColorInput, favoriteFoodInput].forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("input--error");
    favoritesMessage.textContent = "";
  });
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
  state.birthday = ""; state.choice = ""; state.complaint = ""; state.chat = ""; state.catName = ""; state.trivia = ""; state.favoriteColor = ""; state.favoriteFood = ""; state.absurd = "";
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
  favoriteColorInput.value = "";
  favoriteFoodInput.value = "";
  favoritesMessage.textContent = "";
  favoritesResult.classList.add("is-hidden");
  triviaReaction.textContent = "";
  finalReveal.innerHTML = "";
  showScreen("gate");
});

function humanAnswer(value, map) {
  return map[value] || value || "—";
}

function buildShareText() {
  const lines = [
    "🎂 Ответы после прохождения поздравления",
    "",
    `📅 День рождения: ${state.birthday || "—"}`,
    `✨ Новый уровень: ${humanAnswer(state.choice, {
      young: "Всё ещё молода",
      back: "Спина уже что-то знает",
      deny: "Отказываюсь отвечать"
    })}`,
    `🗣 Не обзывай меня: ${humanAnswer(state.complaint, {
      promise: "Обещаю больше не обзывать",
      lawyer: "Хочу адвоката"
    })}`,
    `🗑 Переписка: ${humanAnswer(state.chat, {
      magic: "Она сама исчезла",
      evidence: "Улики были уничтожены",
      silence: "Никто ничего не видел"
    })}`,
    `🐈 Коты: Бетон и ${state.catName || "—"}`,
    `🎮 Где познакомились: ${humanAnswer(state.trivia, {
      roblox: "Roblox",
      school: "Школа",
      street: "Улица"
    })}`,
    `🎨 Любимый цвет: ${state.favoriteColor || "—"}`,
    `🍟 Любимая еда: ${state.favoriteFood || "—"}`,
    `🧾 Признак взрослого: ${humanAnswer(state.absurd, {
      bills: "Оплачивать счета вовремя",
      sleep: "Хотеть домой уже в 21:30",
      pharmacy: "Радоваться хорошей аптечке",
      none: "Делать вид, что понимаешь, что происходит"
    })}`,
    "",
    "Компромат сформирован официально."
  ];
  return lines.join("\n");
}

async function shareAnswers() {
  const text = buildShareText();
  const title = "Ответы на тест";

  if (navigator.share) {
    await navigator.share({ title, text });
    return "native";
  }

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(text)}`;
  const popup = window.open(telegramUrl, "_blank", "noopener,noreferrer");
  if (popup) return "telegram";

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return "copied";
  }

  throw new Error("SHARE_UNAVAILABLE");
}

shareAnswersButton?.addEventListener("click", async () => {
  shareAnswersButton.disabled = true;
  const label = shareAnswersButton.querySelector(".share-button-text");
  if (label) label.textContent = "Открываю…";
  shareStatus.textContent = "";

  try {
    const mode = await shareAnswers();
    shareStatus.style.color = "var(--green)";
    shareStatus.textContent = mode === "copied"
      ? "Скопировано ✓"
      : "Готово ✓";
    if (label) label.textContent = "Поделиться ещё раз";
    burstFromElement(shareAnswersButton, 24, "star");
  } catch (error) {
    if (error?.name === "AbortError") {
      shareStatus.style.color = "var(--muted)";
      shareStatus.textContent = "";
    } else {
      console.error("Share failed", error);
      shareStatus.style.color = "#ff9dae";
      shareStatus.textContent = "Не получилось. Попробуй ещё раз.";
    }
    if (label) label.textContent = "Отправить ответы";
  } finally {
    shareAnswersButton.disabled = false;
  }
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

function burstFromElement(element, count, type = "dot") {
  const rect = element.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, count, type);
}

function burst(x, y, count = 20, type = "dot") {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const symbols = { heart: ["❤", "♥"], paw: ["🐾"], pixel: ["✦", "✧"], star: ["✦", "★"] };
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.className = `particle ${type !== "dot" ? `particle--${type}` : ""}`;
    if (type !== "dot") {
      const chars = symbols[type] || ["✦"];
      dot.textContent = chars[Math.floor(Math.random() * chars.length)];
    }
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 55 + Math.random() * 100;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    dot.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    dot.style.width = `${5 + Math.random() * 7}px`;
    dot.style.height = dot.style.width;
    if (type !== "dot") {
      dot.style.width = 'auto';
      dot.style.height = 'auto';
      dot.style.fontSize = `${12 + Math.random() * 10}px`;
    }
    dot.style.animationDuration = `${650 + Math.random() * 450}ms`;
    particlesLayer.appendChild(dot);
    setTimeout(() => dot.remove(), 1200);
  }
}



function flashTransition() {
  if (!flashLayer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  flashLayer.classList.remove("screen-flash--active");
  void flashLayer.offsetWidth;
  flashLayer.classList.add("screen-flash--active");
}

function glitchCard() {
  const card = document.querySelector('[data-screen="deleted"] .chat-evidence');
  if (!card) return;
  card.classList.remove('glitch-now');
  void card.offsetWidth;
  card.classList.add('glitch-now');
}

function revealText(root) {
  root.querySelectorAll('h1, h2').forEach((el) => {
    el.classList.remove('reveal-on');
    void el.offsetWidth;
    el.classList.add('reveal-on');
  });
}

function applyParallax() {
  const targets = document.querySelectorAll('.polaroid, .photo-card, .final-photo');
  if (!targets.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('pointermove', (event) => {
    const rx = (event.clientY / window.innerHeight - 0.5) * -4;
    const ry = (event.clientX / window.innerWidth - 0.5) * 4;
    targets.forEach((el) => {
      const base = el.dataset.baseTransform || getComputedStyle(el).transform;
      if (!el.dataset.baseTransform || el.dataset.baseTransform === 'none') {
        el.dataset.baseTransform = getComputedStyle(el).transform === 'none' ? '' : getComputedStyle(el).transform;
      }
      const currentBase = el.dataset.baseTransform && el.dataset.baseTransform !== 'none' ? el.dataset.baseTransform : '';
      el.style.transform = `${currentBase} perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }, { passive: true });
}

function createSparkles(count = 18) {
  if (!sparklesLayer) return;
  sparklesLayer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    const left = Math.random() * 100;
    const duration = 7 + Math.random() * 10;
    const delay = -Math.random() * duration;
    const size = 5 + Math.random() * 6;
    sparkle.style.left = `${left}%`;
    sparkle.style.bottom = `${-5 - Math.random() * 25}px`;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.setProperty("--travel", `${140 + Math.random() * 420}px`);
    sparkle.style.setProperty("--driftX", `${-18 + Math.random() * 36}px`);
    sparkle.style.animationDuration = `${duration}s`;
    sparkle.style.animationDelay = `${delay}s`;
    sparklesLayer.appendChild(sparkle);
  }
}

function runFinalReveal() {
  if (!finalReveal || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  finalReveal.innerHTML = "";
  const total = Math.max(52, Math.round((finalReveal.clientWidth * finalReveal.clientHeight) / 2300));
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.className = "pixel-reveal__dot";
    const size = 8 + Math.random() * 10;
    const x = Math.random() * Math.max(1, finalReveal.clientWidth - size);
    const y = Math.random() * Math.max(1, finalReveal.clientHeight - size);
    const angle = Math.random() * Math.PI * 2;
    const distance = 18 + Math.random() * 52;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.setProperty("--px", `${Math.cos(angle) * distance}px`);
    dot.style.setProperty("--py", `${Math.sin(angle) * distance}px`);
    dot.style.animationDelay = `${Math.random() * .45}s`;
    dot.style.animationDuration = `${.62 + Math.random() * .55}s`;
    finalReveal.appendChild(dot);
  }
  setTimeout(() => { finalReveal.innerHTML = ""; }, 1800);
}

createSparkles();
applyParallax();
window.addEventListener("resize", () => {
  clearTimeout(window.__sparkleTimer);
  window.__sparkleTimer = setTimeout(() => createSparkles(window.innerWidth < 430 ? 15 : 18), 150);
});
