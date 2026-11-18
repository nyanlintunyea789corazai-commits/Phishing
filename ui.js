/* Small helpers shared by every page. You don't need to edit this file. */
const ui = {
  demoMessage:
    "Demo mode: the form works, but Supabase isn't connected yet. Add your project URL and key in supabase-config.js.",

  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  isEmail: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),

  setError(input, errorEl, message) {
    errorEl.textContent = message || "";
    errorEl.hidden = !message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  },

  setStatus(el, message, type) {
    el.textContent = message || "";
    if (type) el.dataset.type = type;
    else delete el.dataset.type;
  },

  setBusy(button, busy, idleText, busyText) {
    button.disabled = busy;
    button.setAttribute("aria-busy", busy ? "true" : "false");
    button.querySelector(".btn-label").textContent = busy ? busyText : idleText;
  },

  bindPasswordToggle(button, ...inputs) {
    button.addEventListener("click", () => {
      const show = inputs[0].type === "password";
      inputs.forEach((input) => { input.type = show ? "text" : "password"; });
      button.textContent = show ? "Hide" : "Show";
      button.setAttribute("aria-label", show ? "Hide password" : "Show password");
      inputs[0].focus();
    });
  },

  bindCapsLock(input, hintEl) {
    const check = (e) => {
      if (typeof e.getModifierState !== "function") return;
      hintEl.hidden = !e.getModifierState("CapsLock");
    };
    input.addEventListener("keydown", check);
    input.addEventListener("keyup", check);
    input.addEventListener("blur", () => { hintEl.hidden = true; });
  },

  friendlyAuthError(error) {
    const code = error && error.code;
    if (error && error.name === "AuthRetryableFetchError")
      return "Can't reach the server. Check your connection and try again.";
    if (code === "invalid_credentials")
      return "That email and password don't match. Check them and try again.";
    if (code === "email_not_confirmed")
      return "Confirm your email first. Open the link we sent you, then sign in.";
    if (code === "weak_password")
      return "Choose a stronger password with at least 8 characters.";
    if (code === "same_password")
      return "Choose a password you haven't used before on this account.";
    if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit" || (error && error.status === 429))
      return "Too many attempts. Wait a few minutes and try again.";
    return "Something went wrong. Try again in a moment.";
  },

  store: {
    get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} },
    remove(key) { try { localStorage.removeItem(key); } catch (_) {} },
  },
};
