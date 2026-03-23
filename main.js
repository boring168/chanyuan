const configRequest = fetch("./data/site-config.json").then((response) => response.json());
const portfolioRequest = fetch("./data/portfolio.json").then((response) => response.json());

const portfolioTemplate = document.querySelector("#portfolio-card-template");
const svcCardTemplate = document.querySelector("#svc-card-template");

const portfolioGrid = document.querySelector("#portfolio-grid");
const servicesGrid = document.querySelector("#services-grid");
const extrasList = document.querySelector("#extras-list");

const brandIntro = document.querySelector("#brand-intro");
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

function renderIntro(config) {
  if (brandIntro) brandIntro.textContent = config.brand.intro;
  if (servicesSummary) servicesSummary.textContent = config.servicesSummary;
  if (wechatValue) wechatValue.textContent = config.contact.wechat;
  if (cityValue) cityValue.textContent = config.contact.city;
  if (contactNote) contactNote.textContent = config.contact.note;

  if (config.paymentQrImage && paymentPanel) {
    paymentPanel.hidden = false;
    if (paymentImage) {
      paymentImage.src = config.paymentQrImage;
      paymentImage.alt = `${config.brand.name}收款码`;
    }
    if (paymentCopy) paymentCopy.textContent = config.paymentQrCopy;
  }
}

function renderPortfolio(items) {
  if (!portfolioGrid || !portfolioTemplate) return;
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
  if (!servicesGrid || !svcCardTemplate) return;
  servicesGrid.innerHTML = "";

  services.forEach((service) => {
    const card = svcCardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".svc-card__tag").textContent = service.tag;
    card.querySelector(".svc-card__duration").textContent = service.duration || "";
    card.querySelector(".svc-card__title").textContent = service.title;
    card.querySelector(".svc-card__scene").textContent = service.description;
    card.querySelector(".svc-card__price").textContent = service.price;
    const link = card.querySelector("[data-service-pick]");
    link.href = `./booking?service=${encodeURIComponent(service.fullLine || service.title)}`;
    servicesGrid.appendChild(card);
  });
}

function renderExtras(items) {
  if (!extrasList) return;
  extrasList.innerHTML = "";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    extrasList.appendChild(listItem);
  });
}

async function copyWechat(wechat) {
  try {
    await navigator.clipboard.writeText(wechat);
    if (wechatCopyStatus) wechatCopyStatus.textContent = `微信号已复制：${wechat}`;
  } catch (error) {
    console.warn(error);
    if (wechatCopyStatus) wechatCopyStatus.textContent = `微信号：${wechat}`;
  }
}

async function init() {
  const [config, portfolioItems] = await Promise.all([configRequest, portfolioRequest]);

  renderIntro(config);
  renderServices(config.services);
  renderExtras(config.extras || []);
  renderPortfolio(portfolioItems);

  document.querySelectorAll("[data-wechat-copy]").forEach((button) => {
    button.addEventListener("click", () => copyWechat(config.contact.wechat));
  });
}

init().catch((error) => {
  console.error(error);
  if (wechatCopyStatus) wechatCopyStatus.textContent = "页面加载失败，请稍后刷新重试。";
});
