// ==UserScript==
// @name         Return YouTube Sidebar
// @version      1.1
// @description  Keep full sidebar on homepage, feed, search, playlists, channels (including @username), Shorts, and /post; not on watch pages; auto-disable in fullscreen
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    body.yt-homepage-sidebar ytd-app tp-yt-app-drawer#guide,
    body.yt-homepage-sidebar ytd-app yt-app-drawer#guide {
      transform: translateX(0) !important;
      visibility: visible !important;
      display: block !important;
      width: var(--app-drawer-width, 240px) !important;
      max-width: 240px !important;
      pointer-events: auto !important;
    }
    body.yt-homepage-sidebar ytd-app tp-yt-app-drawer[hidden],
    body.yt-homepage-sidebar ytd-app yt-app-drawer[hidden] {
      display: block !important;
    }
    body.yt-homepage-sidebar #page-manager {
      margin-left: 240px !important;
    }
    tp-yt-app-drawer#guide,
    yt-app-drawer#guide,
    #content { transition: none !important; }
    body.yt-homepage-sidebar ytd-mini-guide-renderer,
    body.yt-homepage-sidebar ytd-mini-guide,
    body.yt-homepage-sidebar #mini-guide,
    body.yt-homepage-sidebar #mini-guide-background,
    body.yt-homepage-sidebar #mini-guide-button {
      display: none !important;
      visibility: hidden !important;
      width: 0 !important; min-width: 0 !important; max-width: 0 !important;
      overflow: hidden !important;
    }
    body.yt-homepage-sidebar #header.style-scope.ytd-app {
      display: none !important; visibility: hidden !important;
      width: 0 !important; height: 0 !important; overflow: hidden !important;
    }
  `;
  document.documentElement.appendChild(style);

  const isFullscreen = () => !!document.fullscreenElement;

  const shouldExpandForPath = (p) => {
    p = p.replace(/\/+$/, "") || "/";
    return (
      p === "/" ||                     // главная
      p.startsWith("/feed") ||         // подписки, история и т.п.
      p.startsWith("/results") ||      // поиск
      p.startsWith("/playlist") ||     // плейлисты
      p.startsWith("/c/") ||           // канал (короткий путь)
      p.startsWith("/channel/") ||     // канал (ID)
      p.startsWith("/user/") ||        // канал (старый пользовательский)
      p.startsWith("/@") ||            // канал (короткая ссылка @username)
      p.startsWith("/shorts/") ||      // Shorts
      p.startsWith("/post")             // вкладка /post
    );
  };

  const getDrawer = () => document.querySelector("tp-yt-app-drawer#guide, yt-app-drawer#guide");
  const getApp = () => document.querySelector("ytd-app");

  function applyState() {
    const enable = !isFullscreen() && shouldExpandForPath(location.pathname);
    document.body?.classList.toggle("yt-homepage-sidebar", enable);

    const app = getApp();
    const drawer = getDrawer();

    if (!enable) {
      app?.removeAttribute("guide-persistent-and-visible");
      app?.removeAttribute("is-guide-enabled");
      if (drawer) {
        drawer.removeAttribute("opened");
        try { drawer.opened = false; } catch {}
      }
      return;
    }

    app?.setAttribute("guide-persistent-and-visible", "");
    if (drawer && !drawer.hasAttribute("opened")) {
      drawer.setAttribute("opened", "");
      try { drawer.opened = true; } catch {}
    }
  }

  function init() {
    applyState();
    document.addEventListener("yt-navigate-finish", applyState);
    document.addEventListener("yt-page-data-updated", applyState);
    window.addEventListener("popstate", applyState);
    document.addEventListener("fullscreenchange", applyState);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
