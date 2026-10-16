
(() => {
  const D = window.BD_DATA;
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  const serviceRoot = $("#serviceGrid");
  if (serviceRoot) {
    serviceRoot.innerHTML = D.serviceGroups.map(group => `
      <article class="service-card reveal">
        <div class="service-icon" aria-hidden="true">${group.icon}</div>
        <h3>${group.title}</h3>
        <div class="service-tags">${group.items.map(item => `<span>${item}</span>`).join("")}</div>
      </article>`).join("");
  }

  const industryRoot = $("#industryGrid");
  if (industryRoot) {
    industryRoot.innerHTML = D.industries.map(item => `<span class="industry-pill">${item}</span>`).join("");
  }

  const fillPills = (id, list) => {
    const el = $(id);
    if (el) el.innerHTML = list.map(x => `<span class="mini-pill">${x}</span>`).join("");
  };
  fillPills("#pouchTypes", D.pouchTypes);
  fillPills("#pouchFinishes", D.pouchFinishes);
  fillPills("#pouchUses", D.pouchUses);
  fillPills("#boppSizes", D.boppSizes);
  fillPills("#boppColours", D.boppColours);

  const portRoot = $("#portfolioGrid");
  function attachLightbox() {
    $$(".portfolio-image-wrap").forEach(btn => {
      btn.addEventListener("click", () => {
        const box = $("#lightbox");
        $("#lightboxImg").src = btn.dataset.image;
        $("#lightboxImg").alt = btn.dataset.title;
        $("#lightboxTitle").textContent = btn.dataset.title;
        box.classList.add("open");
        box.setAttribute("aria-hidden","false");
        document.body.classList.add("no-scroll");
      });
    });
  }
  function renderPortfolio(filter="All") {
    if (!portRoot) return;
    const items = filter === "All" ? D.portfolio : D.portfolio.filter(x => x.category === filter);
    portRoot.innerHTML = items.map(item => `
      <article class="portfolio-card reveal">
        <button class="portfolio-image-wrap" type="button" data-image="${item.image}" data-title="${item.title}">
          <img src="${item.image}" alt="${item.title}" loading="lazy" width="640" height="640">
        </button>
        <div class="portfolio-copy">
          <span>${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </div>
      </article>`).join("");
    attachLightbox();
    runReveal();
  }
  renderPortfolio();

  $$(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderPortfolio(btn.dataset.filter);
    });
  });

  const closeLightbox = () => {
    const box = $("#lightbox");
    if (!box) return;
    box.classList.remove("open");
    box.setAttribute("aria-hidden","true");
    document.body.classList.remove("no-scroll");
  };
  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  $("#lightbox")?.addEventListener("click", e => { if (e.target.id === "lightbox") closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  const quoteForm = $("#quoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", e => {
      e.preventDefault();
      const fd = new FormData(quoteForm);
      const rows = [
        "Hello Burhani Design, I need a quotation.",
        "",
        `Name: ${fd.get("name") || ""}`,
        fd.get("company") ? `Company: ${fd.get("company")}` : "",
        fd.get("country") ? `City/Country: ${fd.get("country")}` : "",
        `Service: ${fd.get("service") || ""}`,
        fd.get("size") ? `Size: ${fd.get("size")}` : "",
        fd.get("quantity") ? `Quantity: ${fd.get("quantity")}` : "",
        fd.get("deadline") ? `Required by: ${fd.get("deadline")}` : "",
        fd.get("message") ? `Requirement: ${fd.get("message")}` : ""
      ].filter(Boolean);
      const url = `https://wa.me/${D.contact.phoneRaw}?text=${encodeURIComponent(rows.join("\n"))}`;
      window.open(url, "_blank", "noopener");
    });
  }

  const menu = $("#menuButton");
  const nav = $("#siteNav");
  menu?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("#siteNav a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded","false");
  }));

  const header = $("#siteHeader");
  const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  function runReveal() {
    const nodes = $$(".reveal:not(.observed)");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(n => n.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:.08});
    nodes.forEach(n => { n.classList.add("observed"); obs.observe(n); });
  }
  runReveal();
})();
