/* =========================================================
   COSMO WRAPS — Coming Soon
   Countdown · mobile menu · notify form · footer year
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1) LAUNCH DATE
     Preferred: set it on the countdown in index.html ->
       <div id="countdown" data-launch="2026-07-15T09:00:00+04:00">
     The line below is only a fallback if that attribute is missing.
     It counts to a fixed moment, so refreshing the page never resets it.
     --------------------------------------------------------- */
  var countdownEl = document.getElementById("countdown");
  var launchAttr = countdownEl && countdownEl.getAttribute("data-launch");
  var LAUNCH_DATE = new Date(launchAttr || "2026-07-15T09:00:00+04:00");

  /* ---------------------------------------------------------
     2) COUNTDOWN
     --------------------------------------------------------- */
  var elDays = document.querySelector("[data-days]");
  var elHours = document.querySelector("[data-hours]");
  var elMinutes = document.querySelector("[data-minutes]");
  var elSeconds = document.querySelector("[data-seconds]");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    var diff = LAUNCH_DATE.getTime() - Date.now();

    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMinutes.textContent = "00";
      elSeconds.textContent = "00";
      return false; // stop the interval
    }

    var sec = Math.floor(diff / 1000);
    var days = Math.floor(sec / 86400);
    var hours = Math.floor((sec % 86400) / 3600);
    var minutes = Math.floor((sec % 3600) / 60);
    var seconds = sec % 60;

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
    return true;
  }

  if (elDays && elHours && elMinutes && elSeconds) {
    tick();
    var timer = setInterval(function () {
      if (tick() === false) clearInterval(timer);
    }, 1000);
  }

  /* ---------------------------------------------------------
     3) MOBILE MENU
     --------------------------------------------------------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu after tapping a link
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---------------------------------------------------------
     4) NOTIFY FORM  → saves emails to a Google Sheet
     Paste your Apps Script web-app URL (ends in /exec) below.
     Because Apps Script doesn't return CORS headers, we POST
     with mode:"no-cors" — the row still gets written, but the
     browser can't read the response, so we show success
     optimistically. Verify in the Sheet while testing.
     --------------------------------------------------------- */
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbx1E8XuXagr_suxMCPT2embIOJ9_AQE-Z-iJOACmYqnxnTYL-lEtkFJJ8C3PttAHXMM/exec";

  var form = document.getElementById("subscribeForm");
  var input = document.getElementById("emailInput");
  var msg = document.getElementById("formMsg");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (form && input && msg) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = input.value.trim();

      if (!EMAIL_RE.test(value)) {
        msg.style.color = "#ffffff";
        msg.textContent = "Please enter a valid email address.";
        input.focus();
        return;
      }

      var btn = form.querySelector(".btn-notify");
      if (btn) btn.disabled = true;
      msg.style.color = "#EAD9A8";
      msg.textContent = "Submitting…";

      fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: "email=" + encodeURIComponent(value)
      })
        .then(function () {
          msg.textContent = "";
          form.reset();
          showPopup();
        })
        .catch(function () {
          msg.style.color = "#F0C9C0";
          msg.textContent = "Network error. Please try again.";
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  /* ---------------------------------------------------------
     5) THANK-YOU POPUP  (auto-closes after 6 seconds)
     --------------------------------------------------------- */
  var popup = document.getElementById("popup");
  var popupClose = document.getElementById("popupClose");
  var popupTimer = document.getElementById("popupTimer");
  var popupHideTimeout;

  function showPopup() {
    if (!popup) return;
    popup.hidden = false;

    // restart the 6s timer-bar animation each time it opens
    if (popupTimer) {
      popupTimer.style.animation = "none";
      void popupTimer.offsetWidth; // force reflow
      popupTimer.style.animation = "";
    }

    clearTimeout(popupHideTimeout);
    popupHideTimeout = setTimeout(hidePopup, 6000);
  }

  function hidePopup() {
    if (!popup) return;
    popup.hidden = true;
    clearTimeout(popupHideTimeout);
  }

  if (popupClose) popupClose.addEventListener("click", hidePopup);
  if (popup) {
    popup.addEventListener("click", function (e) {
      if (e.target === popup) hidePopup(); // click the dark backdrop to close
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hidePopup();
  });

  /* ---------------------------------------------------------
     6) FOOTER YEAR  (keeps the copyright current)
     --------------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
