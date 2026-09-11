function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "vary": "Origin"
    }
  });
}

function clean(value, max = 120) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function label(value, map) {
  return map[value] || clean(value) || "—";
}

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || requestOrigin || "*";
    const corsOrigin = allowedOrigin === "*" ? "*" : allowedOrigin;

    if (request.method === "OPTIONS") {
      if (allowedOrigin !== "*" && requestOrigin !== allowedOrigin) {
        return json({ ok: false }, 403, allowedOrigin);
      }
      return json({ ok: true }, 200, corsOrigin);
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405, corsOrigin);
    }

    if (allowedOrigin !== "*" && requestOrigin !== allowedOrigin) {
      return json({ ok: false, error: "Origin not allowed" }, 403, allowedOrigin);
    }

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return json({ ok: false, error: "Worker is not configured" }, 500, corsOrigin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400, corsOrigin);
    }

    // Простая ловушка для ботов. Поле нормальный сайт всегда отправляет пустым.
    if (body.website) {
      return json({ ok: true }, 200, corsOrigin);
    }

    const ageChoice = label(body.choice, {
      young: "Всё ещё молода",
      back: "Спина уже что-то знает",
      deny: "Отказалась отвечать"
    });
    const complaint = label(body.complaint, {
      promise: "Обещаю больше не обзывать",
      lawyer: "Хочу адвоката"
    });
    const deletedChat = label(body.chat, {
      magic: "Переписка сама исчезла",
      evidence: "Улики были уничтожены",
      silence: "Никто ничего не видел"
    });
    const meeting = label(body.trivia, {
      roblox: "Roblox",
      school: "Школа",
      street: "Улица"
    });
    const adult = label(body.absurd, {
      bills: "Оплачивать счета вовремя",
      sleep: "Хотеть домой в 21:30",
      pharmacy: "Радоваться хорошей аптечке",
      none: "Делать вид, что понимаешь происходящее"
    });

    const lines = [
      "🎂 Новое прохождение поздравления",
      "",
      `📅 Дата рождения: ${clean(body.birthday, 20) || "—"}`,
      `🧓 Новый уровень: ${ageChoice}`,
      `🗣 Жалоба «не обзывай»: ${complaint}`,
      `🗑 Удалённая переписка: ${deletedChat}`,
      `🐈 Коты: Бетон и ${clean(body.catName, 40) || "—"}`,
      `🎮 Где познакомились: ${meeting}`,
      `🎨 Любимый цвет: ${clean(body.favoriteColor, 60) || "—"}`,
      `🍟 Любимая еда: ${clean(body.favoriteFood, 80) || "—"}`,
      `🧾 Признак взрослого: ${adult}`,
      "",
      `🕒 Отправлено: ${new Date().toISOString()}`
    ];

    const telegramResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: lines.join("\n"),
        disable_web_page_preview: true
      })
    });

    if (!telegramResponse.ok) {
      const detail = await telegramResponse.text();
      console.error("Telegram error", telegramResponse.status, detail);
      return json({ ok: false, error: "Telegram delivery failed" }, 502, corsOrigin);
    }

    return json({ ok: true }, 200, corsOrigin);
  }
};
