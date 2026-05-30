(() => {
  const $ = (id) => document.getElementById(id);
  const status = (msg, type = "") => {
    const el = $("status");
    el.className = "status" + (type ? " " + type : "");
    el.innerHTML = type === "loading"
      ? `<span class="pulse"></span>${msg}`
      : msg;
  };

  /* =================== Extension Support =================== */
  // Check if opened from extension
  const urlParams = new URLSearchParams(window.location.search);
  const isExtension = urlParams.get('source') === 'extension';

  if (isExtension && typeof chrome !== 'undefined' && chrome.storage) {
    // Load article from chrome.storage
    chrome.storage.local.get(['pressArticle'], (result) => {
      if (result.pressArticle) {
        const article = result.pressArticle;
        status("已从扩展加载正文");

        // Hide composer (URL input) when loaded from extension
        document.querySelector('.composer').style.display = 'none';

        // Render the article
        render(article, article.sourceUrl);

        // Clear storage
        chrome.storage.local.remove(['pressArticle']);
      } else {
        status("未找到提取的内容", "error");
      }
    });
  }

  /* =================== Theme System (extensible) =================== */
  const THEMES = (window.PRESS_THEMES || []).slice();
  const DEFAULT_THEME = window.PRESS_DEFAULT_THEME || (THEMES[0] && THEMES[0].id) || "press";
  const loadedThemes = new Set();

  function loadThemeCSS(id) {
    if (loadedThemes.has(id)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `themes/${id}.css`;
      link.dataset.theme = id;
      link.onload = () => { loadedThemes.add(id); resolve(); };
      link.onerror = () => reject(new Error(`Failed to load theme: ${id}`));
      document.head.appendChild(link);
    });
  }

  function populateThemePicker() {
    const sel = $("themeSelect");
    sel.innerHTML = THEMES.map(t =>
      `<option value="${t.id}" title="${t.tagline||""}">${t.label}</option>`
    ).join("");
    sel.value = DEFAULT_THEME;
  }

  async function applyTheme(id) {
    if (!id) id = DEFAULT_THEME;
    await loadThemeCSS(id).catch((e) => { console.warn(e); });
    THEMES.forEach(t => document.body.classList.remove("t-" + t.id));
    document.body.classList.add("t-" + id);
    // Show/hide watermark for themes that use it (only when article is extracted)
    const wm = $("watermark");
    const sheetVisible = !$("sheet").hidden;
    if (wm) wm.style.display = (id === "naruto" && sheetVisible) ? "block" : "none";
    try { localStorage.setItem("press.theme", id); } catch(_) {}
  }

  /* =================== Extraction =================== */
  const PROXIES = [
    (u) => `https://r.jina.ai/http://${u.replace(/^https?:\/\//, "")}`,
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  ];

  async function fetchHtml(url) {
    const tries = [PROXIES[1](url), PROXIES[2](url), PROXIES[3](url)];
    for (const target of tries) {
      try {
        const r = await fetch(target, { method: "GET" });
        if (!r.ok) continue;
        const text = await r.text();
        if (text && text.length > 200) return { html: text, viaJina: false };
      } catch (_) {}
    }
    try {
      const r = await fetch(PROXIES[0](url));
      if (r.ok) {
        const text = await r.text();
        return { html: text, viaJina: true };
      }
    } catch(_) {}
    throw new Error("无法抓取此网页（所有代理均失败）");
  }

  function buildJinaHtml(text /*, sourceUrl */) {
    const lines = text.split(/\r?\n/);
    let title = "";
    for (const ln of lines) {
      const m = ln.match(/^Title:\s*(.+)$/i);
      if (m) { title = m[1].trim(); break; }
    }
    let body = text;
    const mdIdx = lines.findIndex(l => /^Markdown Content:/i.test(l));
    if (mdIdx >= 0) {
      body = lines.slice(mdIdx + 1).join("\n");
    } else {
      const srcIdx = lines.findIndex(l => /^URL Source:/i.test(l));
      if (srcIdx >= 0) {
        let i = srcIdx + 1;
        while (i < lines.length && lines[i].trim() !== "") i++;
        body = lines.slice(i + 1).join("\n");
      }
    }
    body = stripLeadingNav(body);
    marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
    return {
      title: title || "Untitled",
      byline: null,
      content: marked.parse(body),
      length: body.length,
    };
  }

  /* Convert plain text to article HTML.
     Splits paragraphs on blank lines, preserves single line breaks as <br>,
     escapes HTML so the text content shows verbatim. */
  function buildTxtArticle(text, fileName) {
    const escape = (s) => s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const blocks = text
      .replace(/\r\n?/g, "\n")
      .split(/\n{2,}/)
      .map(b => b.replace(/^\n+|\n+$/g, ""))
      .filter(Boolean);
    const html = blocks
      .map(b => `<p>${escape(b).replace(/\n/g, "<br>")}</p>`)
      .join("\n");
    const title = (fileName || "Untitled").replace(/\.[^.]+$/, "");
    return {
      title,
      byline: null,
      content: html,
      length: text.length,
      sourceLabel: `LOCAL · ${fileName}`,
    };
  }

  function stripLeadingNav(md) {
    const blocks = md.split(/\n{2,}/);
    let firstProseIdx = -1;
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i].trim();
      if (!b) continue;
      if (/^#{1,6}\s/.test(b)) continue;
      if (/^[-*]\s/.test(b)) continue;
      if (/^!\[/.test(b)) continue;
      const plain = b.replace(/!\[[^\]]*\]\([^)]+\)/g, "")
                     .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")
                     .replace(/[*_`#>]/g, "")
                     .trim();
      if (plain.length >= 120) { firstProseIdx = i; break; }
    }
    if (firstProseIdx <= 0) return md;
    for (let i = firstProseIdx - 1; i >= 0; i--) {
      if (/^#{1,3}\s/.test(blocks[i].trim())) {
        return blocks.slice(i).join("\n\n");
      }
    }
    return blocks.slice(firstProseIdx).join("\n\n");
  }

  function extractWithReadability(html, baseUrl) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc.querySelector("base")) {
      const b = doc.createElement("base");
      b.href = baseUrl;
      doc.head && doc.head.prepend(b);
    }
    const reader = new Readability(doc, { charThreshold: 200 });
    const art = reader.parse();
    if (!art) throw new Error("正文提取失败 —— 此页面结构无法识别");
    return art;
  }

  function sanitize(html) {
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ["script","style","iframe","video","audio","form","button","input","textarea"],
      FORBID_ATTR: ["onload","onclick","onerror","style"],
    });
  }

  function countWords(text) {
    const t = text.trim();
    if (!t) return 0;
    const cjk = (t.match(/[一-龥぀-ヿ]/g) || []).length;
    const words = t.replace(/[一-龥぀-ヿ]/g, " ").split(/\s+/).filter(Boolean).length;
    return cjk + words;
  }

  function formatDate(d) {
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const day = String(d.getDate()).padStart(2,"0");
    return `${months[d.getMonth()]} ${day}, ${d.getFullYear()}`;
  }

  function domainOf(u) {
    try { return new URL(u).hostname.replace(/^www\./, ""); }
    catch { return u; }
  }

  function applyImageOption() {
    const show = $("optImages").checked;
    document.querySelectorAll("#article img, #article figure").forEach(el => {
      el.style.display = show ? "" : "none";
    });
  }
  function applyLinkOption() {
    document.body.classList.toggle("hide-link-urls", !$("optLinks").checked);
  }

  async function run() {
    const raw = $("url").value.trim();
    if (!raw) { status("请输入一个网页地址", "error"); return; }
    let url = raw;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    try { new URL(url); } catch { status("URL 格式不合法", "error"); return; }

    $("btnExtract").disabled = true;
    $("btnPrint").disabled = true;
    status(`正在抓取 ${domainOf(url)} …`, "loading");

    const forceJina = $("optForceJina").checked;
    let usedJina = false;
    let article;

    try {
      if (forceJina) {
        status("使用简化模式抓取 (JS 渲染) …", "loading");
        const r = await fetch(PROXIES[0](url));
        if (!r.ok) throw new Error("简化模式抓取失败");
        article = buildJinaHtml(await r.text(), url);
        usedJina = true;
      } else {
        const { html, viaJina } = await fetchHtml(url);
        status(viaJina ? "正在重排为可读版式 …" : "正在提取正文 …", "loading");
        usedJina = viaJina;

        if (viaJina) {
          article = buildJinaHtml(html, url);
        } else {
          try { article = extractWithReadability(html, url); }
          catch (e) { article = null; }
          const textLen = article ? (article.textContent || "").trim().length : 0;
          if (!article || textLen < 400) {
            status("页面似为 JS 渲染，自动切换到简化模式 …", "loading");
            const r = await fetch(PROXIES[0](url));
            if (!r.ok) throw new Error("简化模式抓取失败");
            article = buildJinaHtml(await r.text(), url);
            usedJina = true;
          }
        }
      }

      render(article, url);
      status(`已就绪 · 来源 ${domainOf(url)}${usedJina ? " · 简化模式" : ""}`);
      $("btnPrint").disabled = false;
    } catch (e) {
      console.error(e);
      status(e.message || "抓取失败", "error");
    } finally {
      $("btnExtract").disabled = false;
    }
  }

  function render(article, sourceUrl) {
    $("article").innerHTML = sanitize(article.content || "");

    document.querySelectorAll("#article a").forEach(a => {
      try {
        const abs = new URL(a.getAttribute("href"), sourceUrl).href;
        a.setAttribute("href", abs);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noreferrer noopener");
      } catch(_){}
    });
    document.querySelectorAll("#article img").forEach(img => {
      const src = img.getAttribute("src") || img.getAttribute("data-src");
      if (src) {
        try { img.setAttribute("src", new URL(src, sourceUrl).href); } catch(_){}
      }
      img.setAttribute("loading", "lazy");
      img.setAttribute("referrerpolicy", "no-referrer");
    });

    const text = $("article").innerText || "";
    const words = countWords(text);
    const minutes = Math.max(1, Math.round(words / 350));
    const now = new Date();
    const dateStr = formatDate(now);

    $("title").textContent = article.title || "Untitled";
    $("byAuthor").textContent = article.byline || "Unknown";
    if (sourceUrl) {
      $("bySource").innerHTML = `<a href="${sourceUrl}" target="_blank" rel="noopener">${domainOf(sourceUrl)}</a>`;
      $("kicker").textContent = (domainOf(sourceUrl) || "FEATURE").toUpperCase();
    } else {
      const localTag = article.sourceLabel || "LOCAL FILE";
      $("bySource").textContent = localTag;
      $("kicker").textContent = "LOCAL · TXT";
    }
    $("byWords").textContent = words.toLocaleString();
    $("runDate").textContent = dateStr;
    $("runFolio").textContent = String(Math.floor(Math.random()*900+100));
    $("runIssue").textContent = String(now.getFullYear()).slice(-2) + "·" + String(now.getMonth()+1).padStart(2,"0");
    $("dateLine").textContent = dateStr;
    $("wordLine").innerHTML = `WORDS · <b>${words.toLocaleString()}</b>`;
    $("timeLine").innerHTML = `READ · <b>${minutes} MIN</b>`;
    document.title = `${article.title || "Untitled"} — Press`;

    $("empty").hidden = true;
    $("sheet").hidden = false;
    // Show naruto watermark now that article is visible
    const wm = $("watermark");
    const currentTheme = $("themeSelect").value;
    if (wm) wm.style.display = (currentTheme === "naruto") ? "block" : "none";
    applyImageOption();
    snapImagesToGrid();
    window.scrollTo({ top: $("sheet").offsetTop - 80, behavior: "smooth" });
  }

  /* =================== Notebook grid-snap for images =================== */
  function snapImagesToGrid() {
    const line = 36; // must match notebook --line
    const theme = $("themeSelect").value;
    const article = $("article");
    if (!article) return;
    // Reset all inline margins first
    article.querySelectorAll("img, figure").forEach(el => {
      el.style.marginBottom = "";
    });
    if (theme !== "notebook") return;
    // Snap direct images (not inside figure)
    article.querySelectorAll("img").forEach(img => {
      if (img.closest("figure")) return;
      const doSnap = () => {
        const style = getComputedStyle(img);
        const mt = parseFloat(style.marginTop) || 0;
        const mb = parseFloat(style.marginBottom) || 0;
        const h = img.offsetHeight + mt + mb;
        const remainder = h % line;
        if (remainder < 1) return;
        img.style.marginBottom = (mb + line - remainder) + "px";
      };
      if (img.complete && img.naturalHeight) doSnap();
      else img.addEventListener("load", doSnap, { once: true });
    });
    // Snap figures
    article.querySelectorAll("figure").forEach(fig => {
      const imgs = fig.querySelectorAll("img");
      const allLoaded = [...imgs].every(i => i.complete && i.naturalHeight);
      const doSnap = () => {
        const style = getComputedStyle(fig);
        const mt = parseFloat(style.marginTop) || 0;
        const mb = parseFloat(style.marginBottom) || 0;
        const h = fig.offsetHeight + mt + mb;
        const remainder = h % line;
        if (remainder < 1) return;
        fig.style.marginBottom = (mb + line - remainder) + "px";
      };
      if (allLoaded) doSnap();
      else imgs.forEach(i => {
        if (!i.complete) i.addEventListener("load", doSnap, { once: true });
      });
    });
  }

  /* =================== Wire-up =================== */
  populateThemePicker();
  const savedTheme = (() => { try { return localStorage.getItem("press.theme"); } catch { return null; } })();
  const initial = (savedTheme && THEMES.find(t => t.id === savedTheme)) ? savedTheme : DEFAULT_THEME;
  $("themeSelect").value = initial;
  applyTheme(initial);

  $("btnExtract").addEventListener("click", run);
  $("url").addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
  $("btnPrint").addEventListener("click", () => window.print());
  $("btnImportTxt").addEventListener("click", () => $("fileTxt").click());
  $("fileTxt").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!/\.txt$/i.test(file.name) && file.type && file.type !== "text/plain") {
      status("仅支持 .txt 文件", "error");
      return;
    }
    const MAX = 5 * 1024 * 1024;
    if (file.size > MAX) {
      status(`文件过大（${(file.size/1024/1024).toFixed(1)} MB），上限 5 MB`, "error");
      return;
    }
    status(`正在读取 ${file.name} …`, "loading");
    try {
      const text = await file.text();
      const article = buildTxtArticle(text, file.name);
      render(article, null);
      status(`已就绪 · 本地文件 ${file.name}`);
      $("btnPrint").disabled = false;
    } catch (err) {
      console.error(err);
      status(err.message || "文件读取失败", "error");
    }
  });
  $("optImages").addEventListener("change", applyImageOption);
  $("optLinks").addEventListener("change", applyLinkOption);
  document.querySelectorAll(".examples button").forEach(b => {
    b.addEventListener("click", () => { $("url").value = b.dataset.ex; run(); });
  });
  document.querySelectorAll(".seg button[data-density]").forEach(b => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".seg button[data-density]").forEach(x => x.classList.remove("on"));
      b.classList.add("on");
      document.body.classList.remove("dense", "loose");
      if (b.dataset.density !== "normal") document.body.classList.add(b.dataset.density);
    });
  });
  $("themeSelect").addEventListener("change", (e) => { applyTheme(e.target.value); snapImagesToGrid(); });
  $("optColorPrint").addEventListener("change", (e) => {
    document.body.classList.toggle("print-color", e.target.checked);
  });
  applyLinkOption();

  $("dateLine").textContent = formatDate(new Date());

})();
