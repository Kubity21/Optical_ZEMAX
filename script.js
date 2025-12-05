const apiKeyInput = document.getElementById("apiKey");
const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const chatStateEl = document.getElementById("chatState");
const chatEl = document.getElementById("chat");

// URL na /session ve Workeru
const WORKER_URL = "https://lucky-violet-3dad.jan-kubat.workers.dev/session";

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

async function createSession(apiKey) {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });

  if (!res.ok) throw new Error(await res.text());
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
    if (!clientSecret) {
      throw new Error("Worker nevrátil clientSecret");
    }

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
