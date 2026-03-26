const configRequest = fetch("./data/site-config.json").then((response) => response.json());

const wechatValue = document.querySelector("#wechat-value");
const contactNote = document.querySelector("#contact-note");
const paymentPanel = document.querySelector("#payment-panel");
const paymentImage = document.querySelector("#payment-image");
const paymentCopy = document.querySelector("#payment-copy");

function renderContact(config) {
  if (wechatValue) wechatValue.textContent = config.contact.wechat;
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
    if (event.key === "Escape" && !modal.hidden) close();
  });
}

async function init() {
  const config = await configRequest;

  renderContact(config);
  setupWechatModal();

  document.querySelectorAll("[data-wechat-copy]").forEach((button) => {
    button.addEventListener("click", () => openWechatModal(config));
  });
}

init().catch(console.error);
