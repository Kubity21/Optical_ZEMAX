// MonaLIGHT – ChatKit Client

const apiKeyInput = document.getElementById("apiKey");
const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const chatStateEl = document.getElementById("chatState");
const chatEl = document.getElementById("chat");

// URL tvého Workeru
const WORKER_URL = "https://lucky-violet-3dad.jan-kubat.workers.dev/session";

// UI helpers
function setStatus(msg, type = "") {
  statusEl.textContent = msg;
  statusEl.className = "status " + type;
}

function setChatState(msg) {
  chatStateEl.textContent = msg;
}

function disableUI(disabled) {
  startBtn.disabled = disabled;
  apiKeyInput.disabled = disabled;
}

// Create ChatKit session
async function createSession(apiKey) {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });

  if (!res.ok) throw new Error("Worker session error: " + res.status);
  return res.json(); // { clientSecret }
}

startBtn.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();

  if (apiKey && !apiKey.startsWith("sk-")) {
    setStatus("Neplatný API klíč.", "error");
    return;
  }

  disableUI(true);
  setStatus("Připojuji…");
  setChatState("Connecting…");

  try {
    const { clientSecret } = await createSession(apiKey);
    chatEl.clientSecret = clientSecret;

    setStatus("Připojeno ✔️", "ok");
    setChatState("Online");
  } catch (err) {
    console.error(err);
    setStatus("Chyba připojení: " + err.message, "error");
    setChatState("Chyba");
  }

  disableUI(false);
});
