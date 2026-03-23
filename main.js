const configRequest = fetch("./data/site-config.json").then((response) => response.json());
const portfolioRequest = fetch("./data/portfolio.json").then((response) => response.json());

const portfolioTemplate = document.querySelector("#portfolio-card-template");
const serviceTemplate = document.querySelector("#service-card-template");
const processTemplate = document.querySelector("#process-card-template");

const portfolioGrid = document.querySelector("#portfolio-grid");
const servicesGrid = document.querySelector("#services-grid");
const processGrid = document.querySelector("#process-grid");
const heroTags = document.querySelector("#hero-tags");

const brandIntro = document.querySelector("#brand-intro");
const heroTitle = document.querySelector("#hero-highlight-title");
const heroCopy = document.querySelector("#hero-highlight-copy");
const introImage = document.querySelector("#intro-image");
const servicesSummary = document.querySelector("#services-summary");
const wechatValue = document.querySelector("#wechat-value");
const cityValue = document.querySelector("#city-value");
const contactNote = document.querySelector("#contact-note");
const wechatCopyStatus = document.querySelector("#wechat-copy-status");

const paymentPanel = document.querySelector("#payment-panel");
const paymentImage = document.querySelector("#payment-image");
const paymentCopy = document.querySelector("#payment-copy");

const portfolioFallbackImage = "./assets/portfolio/look-01.svg";

function setSafeImage(image, src, alt) {
  image.src = src;
  image.alt = alt;
  image.onerror = () => {
    image.onerror = null;
    image.src = portfolioFallbackImage;
  };
}

function renderIntro(config, portfolioItems) {
  brandIntro.textContent = config.brand.intro;
  heroTitle.textContent = config.hero.highlightTitle;
  heroCopy.textContent = config.hero.highlightCopy;
  servicesSummary.textContent = config.servicesSummary;
  wechatValue.textContent = config.contact.wechat;
  cityValue.textContent = config.contact.city;
  contactNote.textContent = config.contact.note;

  heroTags.innerHTML = "";
  config.hero.tags.forEach((label) => {
    const tag = document.createElement("span");
    tag.className = "chip";
    tag.textContent = label;
    heroTags.appendChild(tag);
  });

  const feature = portfolioItems.find((item) => item.title === "写真妆") || portfolioItems[0];
  setSafeImage(introImage, feature.image, `${feature.title}作品展示`);

  if (config.paymentQrImage) {
    paymentPanel.hidden = false;
    paymentImage.src = config.paymentQrImage;
    paymentImage.alt = `${config.brand.name}收款码`;
    paymentCopy.textContent = config.paymentQrCopy;
  }
}

function renderPortfolio(items) {
  portfolioGrid.innerHTML = "";

  items.forEach((item) => {
    const card = portfolioTemplate.content.firstElementChild.cloneNode(true);
    const image = card.querySelector("img");
    setSafeImage(image, item.image, item.title);
    card.querySelector("h3").textContent = item.title;
    card.querySelector("p").textContent = item.description;
    portfolioGrid.appendChild(card);
  });
}

function renderServices(services) {
  servicesGrid.innerHTML = "";

  services.forEach((service) => {
    const card = serviceTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".package-card__tag").textContent = service.tag;
    card.querySelector(".package-card__price").textContent = service.price;
    card.querySelector("h3").textContent = service.title;
    card.querySelector(".package-card__desc").textContent = service.description;

    const includes = card.querySelector(".package-card__includes");
    service.includes.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "chip chip--soft";
      chip.textContent = item;
      includes.appendChild(chip);
    });

    const servicePick = card.querySelector("[data-service-pick]");
    servicePick.href = `./booking?service=${encodeURIComponent(service.title)}`;
    servicesGrid.appendChild(card);
  });
}

function renderProcess(steps) {
  processGrid.innerHTML = "";

  steps.forEach((step, index) => {
    const card = processTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".step-card__no").textContent = `STEP ${index + 1}`;
    card.querySelector("h3").textContent = step.title;
    card.querySelector("p").textContent = step.description;
    processGrid.appendChild(card);
  });
}

async function copyWechat(wechat) {
  try {
    await navigator.clipboard.writeText(wechat);
    wechatCopyStatus.textContent = `微信号已复制：${wechat}`;
  } catch (error) {
    console.warn(error);
    wechatCopyStatus.textContent = `微信号：${wechat}`;
  }
}

async function init() {
  const [config, portfolioItems] = await Promise.all([configRequest, portfolioRequest]);

  renderIntro(config, portfolioItems);
  renderServices(config.services);
  renderPortfolio(portfolioItems);
  renderProcess(config.bookingProcess);

  document.querySelectorAll("[data-wechat-copy]").forEach((button) => {
    button.addEventListener("click", () => copyWechat(config.contact.wechat));
  });
}

init().catch((error) => {
  console.error(error);
  wechatCopyStatus.textContent = "页面加载失败，请稍后刷新重试。";
});
