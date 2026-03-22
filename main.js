const siteConfigPromise = fetch("./data/site-config.json").then((response) => response.json());
const portfolioPromise = fetch("./data/portfolio.json").then((response) => response.json());

const serviceTemplate = document.querySelector("#service-card-template");
const portfolioTemplate = document.querySelector("#portfolio-card-template");
const processTemplate = document.querySelector("#process-card-template");
const contactTemplate = document.querySelector("#contact-card-template");

const servicesGrid = document.querySelector("#services-grid");
const portfolioGrid = document.querySelector("#portfolio-grid");
const processGrid = document.querySelector("#process-grid");
const contactGrid = document.querySelector("#contact-grid");
const heroServices = document.querySelector("#hero-services");
const serviceSelect = document.querySelector("#service-select");
const bookingForm = document.querySelector("#booking-form");
const feishuLink = document.querySelector("#feishu-link");
const bookingHint = document.querySelector("#booking-hint");
const heroFeatureCard = document.querySelector(".hero-card--main");

const contentTargets = {
  brandTitle: document.querySelector("#brand-title"),
  brandIntro: document.querySelector("#brand-intro"),
  heroHighlightTitle: document.querySelector("#hero-highlight-title"),
  heroHighlightCopy: document.querySelector("#hero-highlight-copy"),
  servicesSummary: document.querySelector("#services-summary"),
  quickContact: document.querySelector("#quick-contact"),
};

const bookingDraftStorageKey = "chanyuan-booking-draft";
const portfolioFallbackImage = "./assets/portfolio/look-01.svg";

function populateCoreContent(siteConfig) {
  contentTargets.brandTitle.textContent = siteConfig.brand.name;
  contentTargets.brandIntro.textContent = siteConfig.brand.intro;
  contentTargets.heroHighlightTitle.textContent = siteConfig.hero.highlightTitle;
  contentTargets.heroHighlightCopy.textContent = siteConfig.hero.highlightCopy;
  contentTargets.servicesSummary.textContent = siteConfig.servicesSummary;
  const quickContactItems = [
    `<p><strong>微信：</strong>${siteConfig.contact.wechat}</p>`,
    siteConfig.contact.phone ? `<p><strong>手机号：</strong>${siteConfig.contact.phone}</p>` : "",
    siteConfig.contact.city ? `<p><strong>工作城市：</strong>${siteConfig.contact.city}</p>` : "",
  ].filter(Boolean);

  contentTargets.quickContact.innerHTML = quickContactItems.join("");
}

function renderHeroTags(services) {
  heroServices.innerHTML = "";
  services.slice(0, 4).forEach((service) => {
    const tag = document.createElement("span");
    tag.textContent = service.title;
    heroServices.appendChild(tag);
  });
}

function renderServices(services) {
  servicesGrid.innerHTML = "";
  serviceSelect.innerHTML = '<option value="">请选择服务类型</option>';

  services.forEach((service, index) => {
    const card = serviceTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".service-card__index").textContent = `0${index + 1}`;
    card.querySelector("h3").textContent = service.title;
    card.querySelector("p:last-child").textContent = service.description;
    servicesGrid.appendChild(card);

    const option = document.createElement("option");
    option.value = service.title;
    option.textContent = service.title;
    serviceSelect.appendChild(option);
  });
}

function renderPortfolio(items) {
  portfolioGrid.innerHTML = "";

  items.forEach((item) => {
    const card = portfolioTemplate.content.firstElementChild.cloneNode(true);
    const image = card.querySelector("img");
    image.src = item.image;
    image.alt = item.title;
    image.onerror = () => {
      image.onerror = null;
      image.src = portfolioFallbackImage;
    };
    card.querySelector("h3").textContent = item.title;
    card.querySelector("p").textContent = item.description;
    portfolioGrid.appendChild(card);
  });
}

function applyHeroFeatureImage(items) {
  const featuredItem = items.find((item) => item.title === "写真妆") || items[1] || items[0];
  const featureImage = new Image();

  featureImage.onload = () => {
    heroFeatureCard.style.backgroundImage = `
      linear-gradient(180deg, rgba(255, 243, 239, 0.18), rgba(255, 247, 244, 0.74)),
      url("${featuredItem.image}")
    `;
  };

  featureImage.onerror = () => {
    heroFeatureCard.style.backgroundImage = `
      linear-gradient(180deg, rgba(255, 243, 239, 0.25), rgba(255, 247, 244, 0.88)),
      url("${portfolioFallbackImage}")
    `;
  };

  featureImage.src = featuredItem.image;
}

function renderProcess(steps) {
  processGrid.innerHTML = "";

  steps.forEach((step, index) => {
    const card = processTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".process-card__step").textContent = `STEP ${index + 1}`;
    card.querySelector("h3").textContent = step.title;
    card.querySelector("p").textContent = step.description;
    processGrid.appendChild(card);
  });
}

function renderContact(contactItems) {
  contactGrid.innerHTML = "";

  contactItems.forEach((item) => {
    const card = contactTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".contact-card__label").textContent = item.label;
    card.querySelector("h3").textContent = item.title;
    card.querySelector("p").textContent = item.description;
    contactGrid.appendChild(card);
  });
}

function hydrateBookingDraft() {
  try {
    const saved = localStorage.getItem(bookingDraftStorageKey);
    if (!saved) {
      return;
    }

    const values = JSON.parse(saved);
    Object.entries(values).forEach(([key, value]) => {
      const field = bookingForm.elements.namedItem(key);
      if (field && typeof value === "string") {
        field.value = value;
      }
    });
  } catch (error) {
    console.warn("Unable to restore booking draft", error);
  }
}

function persistBookingDraft(formData) {
  const values = Object.fromEntries(formData.entries());
  localStorage.setItem(bookingDraftStorageKey, JSON.stringify(values));
}

function buildFeishuHint(formData, bookingUrl) {
  const summary = [
    `称呼：${formData.get("name")}`,
    `联系方式：${formData.get("contact")}`,
    `服务类型：${formData.get("service")}`,
    `预约日期：${formData.get("date")}`,
    `时间段：${formData.get("timeSlot")}`,
    `预计服务时长：${formData.get("duration")}`,
    `上门地址/区域：${formData.get("location")}`,
    `备注需求：${formData.get("notes") || "无"}`,
  ].join(" | ");

  bookingHint.textContent = "已保存填写内容，正在跳转飞书表单。";

  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(summary)
      .then(() => {
        bookingHint.textContent = "已复制预约摘要，跳转后可直接粘贴到飞书表单。";
      })
      .catch(() => {
        bookingHint.textContent = "已保存本地预约内容，跳转后可对照填写。";
      })
      .finally(() => {
        window.location.href = bookingUrl;
      });
    return;
  }

  window.location.href = bookingUrl;
}

async function init() {
  const [siteConfig, portfolioItems] = await Promise.all([siteConfigPromise, portfolioPromise]);

  populateCoreContent(siteConfig);
  renderHeroTags(siteConfig.services);
  renderServices(siteConfig.services);
  renderPortfolio(portfolioItems);
  applyHeroFeatureImage(portfolioItems);
  renderProcess(siteConfig.bookingProcess);
  renderContact(siteConfig.contactCards);

  feishuLink.href = siteConfig.bookingFormUrl;
  feishuLink.setAttribute("aria-label", "直接打开飞书表单");

  hydrateBookingDraft();

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    persistBookingDraft(formData);
    buildFeishuHint(formData, siteConfig.bookingFormUrl);
  });
}

init().catch((error) => {
  console.error("Failed to initialize site", error);
  bookingHint.textContent = "页面数据加载失败，请检查配置文件是否存在。";
});
