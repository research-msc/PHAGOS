(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    var format = function (v) {
      return decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US");
    };
    if (reduceMotion) { el.textContent = format(target); return; }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target);
    }
    requestAnimationFrame(step);
  }

  function animateCharts(root) {
    root.querySelectorAll(".fill[data-width]").forEach(function (el) {
      el.style.width = el.dataset.width + "%";
    });
    root.querySelectorAll(".vbar[data-height]").forEach(function (el) {
      el.style.height = el.dataset.height + "%";
    });
    root.querySelectorAll(".funnel").forEach(function (f) {
      f.querySelectorAll(".frow").forEach(function (row, idx) {
        row.style.transitionDelay = reduceMotion ? "0ms" : idx * 90 + "ms";
      });
      requestAnimationFrame(function () { f.classList.add("in"); });
    });
    root.querySelectorAll("[data-count]").forEach(countUp);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("visible");
        if (el.hasAttribute("data-count")) countUp(el);
        animateCharts(el);
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal, [data-count], .panel.active, .stat").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
    document.querySelectorAll("[data-count]").forEach(countUp);
    animateCharts(document);
  }

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  function activate(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.setAttribute("tabindex", on ? "0" : "-1");
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) {
        panel.classList.toggle("active", on);
        if (on) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
        if (on) {
          panel.querySelectorAll(".fill[data-width]").forEach(function (el) { el.style.width = "0"; });
          panel.querySelectorAll(".vbar[data-height]").forEach(function (el) { el.style.height = "0"; });
          panel.querySelectorAll(".funnel").forEach(function (f) { f.classList.remove("in"); });
          panel.querySelectorAll("[data-count]").forEach(function (el) { delete el.dataset.done; });
          setTimeout(function () { animateCharts(panel); }, 40);
        }
      }
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { activate(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); activate(next, true); }
    });
    tab.setAttribute("tabindex", tab.classList.contains("active") ? "0" : "-1");
  });

  document.querySelectorAll(".cand").forEach(function (card) {
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animateCharts(card); o.disconnect(); }
        });
      }, { threshold: 0.3 });
      o.observe(card);
    }
  });

  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  function onScroll() {
    var y = window.scrollY + 120;
    var current = "top";
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
    if (current === "overview" || current === "abstract") current = "overview";
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var form = document.getElementById("search-form");
  var input = document.getElementById("site-search");
  var msg = document.getElementById("search-msg");

  var index = [
    { keys: ["disc05843"], id: "cand-DISC05843", flash: true },
    { keys: ["disc06024"], id: "cand-DISC06024", flash: true },
    { keys: ["ablation", "integration", "delta"], id: "results", tab: "tab-b" },
    { keys: ["external", "blastp", "top-k", "top k", "validation"], id: "results", tab: "tab-c" },
    { keys: ["funnel", "discovery", "127,751", "127751", "cd-hit"], id: "results", tab: "tab-d" },
    { keys: ["auprc", "internal", "random forest", "logistic", "performance"], id: "results", tab: "tab-a" },
    { keys: ["candidate", "alphafold", "structure", "plddt", "ptm", "rbp"], id: "candidates" },
    { keys: ["method", "feature", "similarity", "dataset", "curation"], id: "methodology" },
    { keys: ["abstract", "summary"], id: "abstract" },
    { keys: ["background", "amr", "resistance", "objective", "significance", "sdg", "baumannii"], id: "background" },
    { keys: ["conclusion", "recommend", "reference"], id: "conclusion" }
  ];

  function runSearch(q) {
    q = (q || "").trim().toLowerCase();
    if (!q) { msg.textContent = ""; return; }
    var hit = null;
    for (var i = 0; i < index.length && !hit; i++) {
      for (var k = 0; k < index[i].keys.length; k++) {
        if (q.indexOf(index[i].keys[k]) !== -1 || index[i].keys[k].indexOf(q) !== -1) { hit = index[i]; break; }
      }
    }
    if (!hit) {
      msg.textContent = "No match for “" + q + "”. Try DISC05843, AUPRC, funnel or methodology.";
      return;
    }
    msg.textContent = "";
    if (hit.tab) {
      var t = document.getElementById(hit.tab);
      if (t) activate(t, false);
    }
    var target = document.getElementById(hit.id);
    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: hit.flash ? "center" : "start" });
      if (hit.flash) {
        target.classList.add("flash");
        setTimeout(function () { target.classList.remove("flash"); }, 2200);
      }
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runSearch(input.value);
    });
  }
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      input.value = chip.getAttribute("data-q");
      runSearch(input.value);
    });
  });
})();
