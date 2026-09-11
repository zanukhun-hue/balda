// URL Cloudflare Worker после его публикации.
// Это НЕ секрет: токен Telegram и chat_id хранятся только внутри Worker.
window.BALDA_CONFIG = {
  answersEndpoint: "PASTE_CLOUDFLARE_WORKER_URL_HERE"
};
