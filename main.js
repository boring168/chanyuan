const configRequest = fetch("./data/site-config.json").then((response) => response.json());
const portfolioRequest = fetch("./data/portfolio.json").then((response) => response.json());

const homepageRoot = document.querySelector("#homepage-root");
const portfolioTemplate = document.querySelector("#portfolio-card-template");
const svcCardTemplate = document.querySelector("#svc-card-template");

const portfolioFallbackImage = "./assets/portfolio/look-01.svg";

const SVC_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23f5ede4'/%3E%3Ccircle cx='48' cy='36' r='14' fill='%23d8bba4' opacity='0.5'/%3E%3Cellipse cx='48' cy='70' rx='21' ry='13' fill='%23d8bba4' opacity='0.38'/%3E%3C/svg%3E";

const MAKEUP_FALLBACK_CONFIG = {
  brand: {
    name: "婵媛造型",
    intro:
      "预约制上门妆造服务，主打清透、精致、有镜头感的高级妆面，适合日常通勤、证件照、约会生日、写真拍摄、舞台活动与新娘早妆。",
    city: "市区上门",
  },
  servicesSummary:
    "以下价目明细完整保留，既适合直接宣传展示，也方便你先看预算再沟通预约。",
  services: [
    {
      tag: "Daily",
      title: "日常淡妆 / 通勤妆",
      description: "适合通勤、见面、轻社交场景，妆感清透自然、干净耐看。",
      price: "99 元",
      duration: "约 45 分钟",
      image: "./assets/portfolio/daily-look.jpg",
      fullLine: "日常淡妆/通勤妆：99 元",
    },
    {
      tag: "Photo",
      title: "证件照妆 / 上镜妆",
      description: "适合证件照、形象照和需要利落镜头感的场景，妆效更显精神。",
      price: "89 元",
      duration: "约 45 分钟",
      image: "./assets/portfolio/photo-look.jpg",
      fullLine: "证件照妆/上镜妆：89 元",
    },
    {
      tag: "Date",
      title: "约会妆 / 生日妆",
      description: "自然甜感、妆面细腻，适合约会、聚会与需要好状态的场合。",
      price: "139 元",
      duration: "约 1 小时",
      image: "./assets/portfolio/date-look.jpg",
      fullLine: "约会妆/生日妆：139 元",
    },
    {
      tag: "Studio",
      title: "写真妆（不含发型）",
      description: "适合写真拍摄、个人形象记录和主题片，妆面更完整、更上镜。",
      price: "159 元",
      duration: "约 1–1.5 小时",
      image: "./assets/portfolio/creative-look.jpg",
      fullLine: "写真妆（不含发型）：159 元",
    },
    {
      tag: "Studio+Hair",
      title: "写真妆 + 简单发型",
      description: "适合需要完整妆发配合的写真拍摄，整体更精致更出片。",
      price: "199 元",
      duration: "约 2 小时",
      image: "./assets/portfolio/photo-look.jpg",
      fullLine: "写真妆+简单发型：199 元",
    },
    {
      tag: "Family",
      title: "伴娘妆 / 妈妈妆",
      description: "适合婚礼、宴会和家庭重要场合，妆感得体温柔，耐看不过度。",
      price: "129 元",
      duration: "约 1 小时",
      image: "./assets/portfolio/vintage-look.jpg",
      fullLine: "伴娘妆/妈妈妆：129 元",
    },
    {
      tag: "Kids Stage",
      title: "儿童舞台妆",
      description: "适合演出、比赛、汇演等场合，妆效清晰，镜头和舞台都更精神。",
      price: "79 元",
      duration: "约 30–45 分钟",
      image: "./assets/portfolio/stage-look.jpg",
      fullLine: "儿童舞台妆：79 元",
    },
    {
      tag: "Stage",
      title: "成人舞台妆 / 主持妆",
      description: "适合主持、活动、比赛和演出场景，妆感更有表现力和轮廓感。",
      price: "169 元",
      duration: "约 1–1.5 小时",
      image: "./assets/portfolio/stage-look.jpg",
      fullLine: "成人舞台妆/主持妆：169 元",
    },
    {
      tag: "Bridal",
      title: "新娘早妆（不含跟妆）",
      description: "适合婚礼当日晨间妆发准备，整体重点在精致、稳定和出镜效果。",
      price: "299 元",
      duration: "约 2–2.5 小时",
      image: "./assets/portfolio/vintage-look.jpg",
      fullLine: "新娘早妆（不含跟妆）：299 元",
    },
    {
      tag: "Trial",
      title: "试妆费",
      description: "适合婚礼、写真或重要活动前确认妆感和整体方向，定妆后可抵扣。",
      price: "80 元",
      duration: "约 1 小时",
      image: "./assets/portfolio/date-look.jpg",
      fullLine: "试妆费：80 元（定妆可抵）",
    },
  ],
  extras: [
    "试妆费：80 元（定妆可抵）",
    "市区上门费：20 元",
    "假睫毛：15 元/对",
    "复杂发型另加：30–50 元",
  ],
  contact: {
    wechat: "StillinLoveWithYouH",
    city: "市区上门",
    note: "看中项目后可先微信沟通日期、区域、是否需要发型以及你想要的妆感。",
  },
  paymentQrImage: "./assets/payment/payment-qr.jpg",
  paymentQrCopy: "确认档期后，如需支付定金或尾款，可直接扫码。",
  wechatQrImage: "./assets/wechat/wechat-qr.jpg",
};

const MAKEUP_FALLBACK_PORTFOLIO = [
  {
    title: "日常妆",
    description: "清透自然，适合日常出行与通勤。",
    image: "./assets/portfolio/daily-look.jpg",
  },
  {
    title: "写真妆",
    description: "上镜精致，适合写真与形象照。",
    image: "./assets/portfolio/photo-look.jpg",
  },
  {
    title: "约会妆",
    description: "甜美细腻，适合约会与聚会。",
    image: "./assets/portfolio/date-look.jpg",
  },
  {
    title: "创意妆",
    description: "风格更强，适合主题创作。",
    image: "./assets/portfolio/creative-look.jpg",
  },
  {
    title: "舞台妆",
    description: "表现力更足，适合舞台和活动。",
    image: "./assets/portfolio/stage-look.jpg",
  },
  {
    title: "复古妆",
    description: "经典质感，适合复古氛围拍摄。",
    image: "./assets/portfolio/vintage-look.jpg",
  },
];

const SITE_CHROME = {
  makeup: {
    title: "婵媛造型 | 上门化妆价目表",
    description:
      "婵媛造型上门化妆价目表，包含日常、证件照、约会、写真、舞台与新娘早妆等项目，支持微信咨询与站内预约。",
    brand: "婵媛造型",
    brandAria: "婵媛造型首页",
    footerTagline: "预约制上门妆造 · 微信咨询优先",
    nav: [
      { href: "#packages", label: "价目表" },
      { href: "#portfolio", label: "风格参考" },
      { href: "#contact", label: "联系" },
    ],
    modalQrAlt: "婵媛造型微信二维码",
  },
  nail: {
    title: "婵媛 Nail Studio | 上门美甲预约",
    description:
      "婵媛 Nail Studio，上门美甲预约。本甲、甲片、卸甲，简单干净，支持微信咨询与站内预约。",
    brand: "婵媛 Nail",
    brandAria: "婵媛 Nail Studio 首页",
    footerTagline: "上门美甲 · 预约制 · 微信优先",
    nav: [
      { href: "#services", label: "服务内容" },
      { href: "#gallery", label: "部分款式" },
      { href: "#notes", label: "预约说明" },
      { href: "#contact", label: "联系" },
    ],
    modalQrAlt: "婵媛 Nail Studio 微信二维码",
  },
};

function detectSiteMode() {
  return window.location.hostname.includes(".top") ? "nail" : "makeup";
}

function isLikelyNailConfig(config) {
  return Array.isArray(config?.services) && config.services.some((service) => service.tag === "本甲");
}

function setSafeImage(image, src, alt) {
  image.src = src;
  image.alt = alt;
  image.onerror = () => {
    image.onerror = null;
    image.src = portfolioFallbackImage;
  };
}

function mountHomepage(mode) {
  const template = document.querySelector(
    mode === "nail" ? "#nail-home-template" : "#makeup-home-template",
  );
  if (!homepageRoot || !template) return;
  homepageRoot.replaceChildren(template.content.cloneNode(true));
}

function updateSiteChrome(mode) {
  const chrome = SITE_CHROME[mode];
  document.body.classList.remove("makeup-page", "home-page");
  document.body.classList.add(mode === "nail" ? "home-page" : "makeup-page");

  document.title = chrome.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", chrome.description);

  const brand = document.querySelector("[data-site-brand]");
  if (brand) brand.textContent = chrome.brand;

  const brandLink = document.querySelector("[data-site-brand-link]");
  if (brandLink) brandLink.setAttribute("aria-label", chrome.brandAria);

  const footerBrand = document.querySelector("[data-site-footer-brand]");
  if (footerBrand) footerBrand.textContent = chrome.brand;

  const footerTagline = document.querySelector("[data-site-footer-tagline]");
  if (footerTagline) footerTagline.textContent = chrome.footerTagline;

  const nav = document.querySelector("[data-site-nav]");
  if (nav) {
    nav.replaceChildren(
      ...chrome.nav.map((item) => {
        const link = document.createElement("a");
        link.href = item.href;
        link.textContent = item.label;
        return link;
      }),
    );
  }

  const modalQr = document.querySelector("#wechat-modal-qr");
  if (modalQr) modalQr.alt = chrome.modalQrAlt;
}

function getPageRefs() {
  return {
    brandIntro: document.querySelector("#brand-intro"),
    servicesSummary: document.querySelector("#services-summary"),
    servicesGrid: document.querySelector("#services-grid"),
    extrasList: document.querySelector("#extras-list"),
    portfolioGrid: document.querySelector("#portfolio-grid"),
    wechatValue: document.querySelector("#wechat-value"),
    cityValue: document.querySelector("#city-value"),
    contactNote: document.querySelector("#contact-note"),
    paymentPanel: document.querySelector("#payment-panel"),
    paymentImage: document.querySelector("#payment-image"),
    paymentCopy: document.querySelector("#payment-copy"),
  };
}

function renderSharedContact(config, refs) {
  if (refs.wechatValue) refs.wechatValue.textContent = config.contact.wechat;
  if (refs.contactNote) refs.contactNote.textContent = config.contact.note;
  if (refs.cityValue) refs.cityValue.textContent = config.contact.city;

  if (config.paymentQrImage && refs.paymentPanel) {
    refs.paymentPanel.hidden = false;
    if (refs.paymentImage) {
      refs.paymentImage.src = config.paymentQrImage;
      refs.paymentImage.alt = `${config.brand.name}收款码`;
    }
    if (refs.paymentCopy) refs.paymentCopy.textContent = config.paymentQrCopy;
  }
}

function renderMakeupIntro(config, refs) {
  if (refs.brandIntro) refs.brandIntro.textContent = config.brand.intro;
  if (refs.servicesSummary) {
    refs.servicesSummary.textContent =
      config.servicesSummary || "选好项目后直接点「立即预约」，填写日期、时间和联系方式。";
  }
  renderSharedContact(config, refs);
}

function renderPortfolio(items, refs) {
  if (!refs.portfolioGrid || !portfolioTemplate) return;
  refs.portfolioGrid.innerHTML = "";

  items.forEach((item) => {
    const card = portfolioTemplate.content.firstElementChild.cloneNode(true);
    const image = card.querySelector("img");
    setSafeImage(image, item.image, item.title);
    card.querySelector("h3").textContent = item.title;
    card.querySelector("p").textContent = item.description;
    refs.portfolioGrid.appendChild(card);
  });
}

function renderServices(services, refs) {
  if (!refs.servicesGrid || !svcCardTemplate) return;
  refs.servicesGrid.innerHTML = "";

  services.forEach((service) => {
    const card = svcCardTemplate.content.firstElementChild.cloneNode(true);
    const imgEl = card.querySelector(".svc-card__img");
    const svcSlug = (service.tag || "").toLowerCase().replace(/[^a-z0-9]/g, "-");
    imgEl.alt = service.title;
    imgEl.src = service.image || `./assets/services/${svcSlug}.jpg`;
    imgEl.onerror = () => {
      imgEl.onerror = null;
      imgEl.src = SVC_PLACEHOLDER;
    };

    card.querySelector(".svc-card__tag").textContent = service.tag;
    card.querySelector(".svc-card__duration").textContent = service.duration || "";
    card.querySelector(".svc-card__title").textContent = service.title;
    card.querySelector(".svc-card__scene").textContent = service.description;

    const priceEl = card.querySelector(".svc-card__price");
    const priceMatch = service.price.match(/^(\d[\d,]*)\s*(元)(.*)?$/);
    if (priceMatch) {
      priceEl.innerHTML =
        `<span class="svc-card__price-num">${priceMatch[1]}</span>` +
        `<span class="svc-card__price-unit"> ${priceMatch[2]}</span>` +
        (priceMatch[3] ? `<span class="svc-card__price-suffix">${priceMatch[3]}</span>` : "");
    } else {
      priceEl.textContent = service.price;
    }

    const link = card.querySelector("[data-service-pick]");
    link.href = `./booking?service=${encodeURIComponent(service.fullLine || service.title)}`;
    refs.servicesGrid.appendChild(card);
  });
}

function renderExtras(items, refs) {
  if (!refs.extrasList) return;
  refs.extrasList.innerHTML = "";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    refs.extrasList.appendChild(listItem);
  });
}

function openWechatModal(config) {
  const modal = document.querySelector("#wechat-modal");
  if (!modal) return;

  const idEl = document.querySelector("#wechat-modal-id");
  const qrEl = document.querySelector("#wechat-modal-qr");
  const copyBtn = document.querySelector("#wechat-modal-copy");
  const statusEl = document.querySelector("#wechat-modal-copy-status");

  if (idEl) idEl.textContent = config.contact.wechat;
  if (qrEl && config.wechatQrImage) {
    qrEl.hidden = false;
    qrEl.src = config.wechatQrImage;
    qrEl.onerror = () => {
      qrEl.hidden = true;
    };
  }
  if (statusEl) statusEl.textContent = "";
  if (copyBtn) {
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(config.contact.wechat);
        if (statusEl) statusEl.textContent = "已复制微信号 ✓";
      } catch {
        if (statusEl) statusEl.textContent = `微信号：${config.contact.wechat}`;
      }
    };
  }
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function setupWechatModal() {
  const modal = document.querySelector("#wechat-modal");
  if (!modal) return;
  const overlay = modal.querySelector(".wechat-modal__overlay");
  const closeBtn = modal.querySelector(".wechat-modal__close");
  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };
  overlay?.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

async function init() {
  const mode = detectSiteMode();
  updateSiteChrome(mode);
  mountHomepage(mode);

  const [liveConfig, livePortfolio] = await Promise.all([configRequest, portfolioRequest]);
  const refs = getPageRefs();
  const makeupConfig = isLikelyNailConfig(liveConfig) ? MAKEUP_FALLBACK_CONFIG : liveConfig;
  const makeupPortfolio = Array.isArray(livePortfolio) && livePortfolio[0]?.title?.includes("妆")
    ? livePortfolio
    : MAKEUP_FALLBACK_PORTFOLIO;

  if (mode === "makeup") {
    renderMakeupIntro(makeupConfig, refs);
    renderServices(makeupConfig.services, refs);
    renderExtras(makeupConfig.extras || [], refs);
    renderPortfolio(makeupPortfolio, refs);
  } else {
    renderSharedContact(liveConfig, refs);
  }

  setupWechatModal();
  document.querySelectorAll("[data-wechat-copy]").forEach((button) => {
    button.addEventListener("click", () => openWechatModal(mode === "makeup" ? makeupConfig : liveConfig));
  });
}

init().catch(console.error);
