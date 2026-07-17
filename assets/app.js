/* app.js — rendert die Seite aus content.json
   - lädt content.json (Quelle der Wahrheit)
   - fällt auf eingebaute Standardwerte zurück, falls die Datei fehlt
   - lauscht auf Live-Vorschau-Nachrichten aus admin.html (postMessage) */

(function () {
  "use strict";

  // Eingebauter Fallback, damit die Seite auch ohne content.json etwas zeigt.
  const FALLBACK = {
    site: { name: "Sonja Paredes Pernía", domain: "sonja-paredes-pernia.de" },
    hero: {
      kicker: "Schriftstellerin — München",
      titlePart1: "Psychothriller und", emphasis: "surreale", titlePart2: "Romane.",
      lede: "Sonja Paredes Pernía, geboren 1969 in Wermelskirchen, schreibt über Menschen am Rand ihrer selbst — und über das Unheimliche unter der Oberfläche des Vertrauten."
    },
    about: { heading: "Erzählen heißt, genauer hinsehen.", text: "", photo: "assets/sonja-paredes-pernia.webp" },
    works: [], planned: [],
    contact: { heading: "Für Anfragen, Lesungen und Presse.", email: "kontakt@sonja-paredes-pernia.de" }
  };

  const $ = (id) => document.getElementById(id);

  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value || "";
  }

  function renderHero(h) {
    setText("hero-kicker", h.kicker);
    setText("hero-lede", h.lede);
    const title = $("hero-title");
    if (title) {
      title.textContent = "";
      const add = (t) => title.appendChild(document.createTextNode(t));
      if (h.titlePart1) add(h.titlePart1 + " ");
      if (h.emphasis) {
        const em = document.createElement("em");
        em.textContent = h.emphasis;
        title.appendChild(em);
        add(" ");
      }
      if (h.titlePart2) add(h.titlePart2);
    }
  }

  function renderAbout(a) {
    setText("ueber-title", a.heading);
    setText("about-text", a.text);
    const img = $("about-photo");
    if (img && a.photo) img.src = a.photo;
  }

  function renderWorks(works) {
    const wrap = $("works");
    if (!wrap) return;
    wrap.textContent = "";
    (works || []).forEach((w) => {
      const book = document.createElement("article");
      book.className = "book";

      if (w.cover) {
        const img = document.createElement("img");
        img.className = "cover";
        img.src = w.cover;
        img.alt = "Buchcover: " + (w.title || "");
        img.loading = "lazy";
        book.appendChild(img);
      }

      const col = document.createElement("div");
      const h = document.createElement("h2");
      h.textContent = w.title || "";
      col.appendChild(h);

      if (w.meta) {
        const m = document.createElement("p");
        m.className = "meta";
        m.textContent = w.meta;
        col.appendChild(m);
      }
      if (w.pull) {
        const p = document.createElement("p");
        p.className = "pull";
        const b = document.createElement("b");
        b.textContent = w.pull;
        p.appendChild(b);
        col.appendChild(p);
      }
      if (w.blurb) {
        const p = document.createElement("p");
        p.className = "body";
        p.textContent = w.blurb;
        col.appendChild(p);
      }
      if (w.buyUrl) {
        const a = document.createElement("a");
        a.className = "buy";
        a.href = w.buyUrl;
        a.rel = "noopener";
        a.textContent = w.buyLabel || "Zum Kaufangebot";
        col.appendChild(a);
      } else if (w.buyNote) {
        const n = document.createElement("p");
        n.className = "meta";
        n.textContent = w.buyNote;
        col.appendChild(n);
      }
      book.appendChild(col);
      wrap.appendChild(book);
    });
  }

  function renderPlanned(items) {
    const list = $("planned");
    if (!list) return;
    list.textContent = "";
    (items || []).forEach((it) => {
      const row = document.createElement("div");
      row.className = "item";
      const h = document.createElement("h3");
      h.textContent = it.title || "";
      const st = document.createElement("span");
      st.className = "st";
      st.textContent = it.status || "";
      const p = document.createElement("p");
      p.textContent = it.note || "";
      row.appendChild(h);
      row.appendChild(st);
      row.appendChild(p);
      list.appendChild(row);
    });
  }

  function renderContact(c) {
    setText("kontakt-title", c.heading);
    const a = $("contact-email");
    if (a) {
      a.textContent = c.email || "";
      a.href = c.email ? "mailto:" + c.email : "#";
    }
  }

  function renderFooter(site) {
    const year = new Date().getFullYear();
    setText("footer-name", "© " + year + " " + (site.name || ""));
    setText("footer-domain", site.domain || "");
    const brand = document.querySelector('[data-cms="site.name"]');
    if (brand) brand.textContent = site.name || "";
    if (site.name) document.title = site.name + " — Schriftstellerin";
  }

  function render(data) {
    const d = Object.assign({}, FALLBACK, data || {});
    renderHero(d.hero || FALLBACK.hero);
    renderAbout(d.about || FALLBACK.about);
    renderWorks(d.works || []);
    renderPlanned(d.planned || []);
    renderContact(d.contact || FALLBACK.contact);
    renderFooter(d.site || FALLBACK.site);
  }

  // content.json laden
  fetch("content.json", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then(render)
    .catch(() => render(FALLBACK));

  // Live-Vorschau aus dem Admin
  window.addEventListener("message", (e) => {
    if (e && e.data && e.data.type === "cms-preview") render(e.data.content);
  });
})();

/* contact.js — Kontaktformular per AJAX an Formspree (bleibt auf der Seite) */
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var btn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "Wird gesendet …";
    if (btn) btn.disabled = true;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (r) {
        if (r.ok) {
          form.reset();
          status.className = "form-status ok";
          status.textContent = "Vielen Dank! Ihre Nachricht wurde gesendet.";
        } else {
          return r.json().then(function (d) {
            var msg = d && d.errors ? d.errors.map(function (x) { return x.message; }).join(", ")
                                    : "Senden fehlgeschlagen. Bitte später erneut versuchen.";
            throw new Error(msg);
          });
        }
      })
      .catch(function (err) {
        status.className = "form-status err";
        status.textContent = err.message || "Senden fehlgeschlagen. Bitte später erneut versuchen.";
      })
      .finally(function () { if (btn) btn.disabled = false; });
  });
})();
