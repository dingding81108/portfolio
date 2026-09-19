/* ============================================================
   作品集 · 我的路 — 交互
   滚动显现 / 路线进度 / 里程碑点亮 / 锚点滚动
   ============================================================ */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 导航背景 ---------- */
  var nav = document.querySelector(".site-nav");
  function onScrollNav() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- 滚动显现 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduced) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 路线进度与里程碑点亮 ---------- */
  var route = document.getElementById("route");
  var routeFill = document.getElementById("routeFill");
  var milestones = Array.prototype.slice.call(document.querySelectorAll(".milestone"));

  function routeProgress() {
    if (!route || !routeFill) return;
    var r = route.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * 0.7;          // 进入视口 70% 处开始
    var end = r.height - vh * 0.55; // 到末尾为止
    var progress = (vh - r.top - start) / (end - start);
    progress = Math.max(0, Math.min(1, progress));
    routeFill.style.height = (progress * 100) + "%";
  }

  function lightMilestones() {
    var mid = window.innerHeight * 0.6;
    milestones.forEach(function (m) {
      var rect = m.getBoundingClientRect();
      if (rect.top < mid) m.classList.add("lit");
    });
  }

  function onScrollRoute() {
    routeProgress();
    lightMilestones();
  }

  if (reduced) {
    if (routeFill) routeFill.style.height = "100%";
    milestones.forEach(function (m) { m.classList.add("lit"); });
  } else {
    window.addEventListener("scroll", onScrollRoute, { passive: true });
    window.addEventListener("resize", onScrollRoute, { passive: true });
    onScrollRoute();
  }

  /* ---------- 锚点平滑滚动（不用 scrollIntoView） ---------- */
  var anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 72;
      if (reduced) {
        window.scrollTo(0, y);
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });
})();
