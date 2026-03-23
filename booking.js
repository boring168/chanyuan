const configRequest = fetch("./data/site-config.json").then((response) => response.json());

const bookingForm = document.querySelector("#booking-form");
const serviceSelect = document.querySelector("#service-select");
const servicePicks = document.querySelector("#service-picks");
const dateInput = document.querySelector("#date-input");
const bookingHint = document.querySelector("#booking-hint");
const bookingStatus = document.querySelector("#booking-status");
const wechatValue = document.querySelector("#wechat-value");
const contactNote = document.querySelector("#contact-note");
const paymentPanel = document.querySelector("#payment-panel");
const paymentImage = document.querySelector("#payment-image");
const paymentCopy = document.querySelector("#payment-copy");
const scrollToFormButton = document.querySelector("#scroll-to-form-button");

const bookingDraftStorageKey = "chanyuan-booking-draft-v3";

function setMinBookingDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${year}-${month}-${day}`;
}

function setSelectedPick(value) {
  servicePicks.querySelectorAll("button").forEach((button) => {
    button.dataset.selected = button.dataset.value === value ? "true" : "false";
  });
}

function renderServices(services) {
  serviceSelect.innerHTML = '<option value="">请选择服务类型</option>';
  servicePicks.innerHTML = "";

  services.forEach((service) => {
    const serviceValue = service.fullLine || service.title;
    const option = document.createElement("option");
    option.value = serviceValue;
    option.textContent = serviceValue;
    serviceSelect.appendChild(option);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "service-pick";
    button.dataset.value = serviceValue;
    button.innerHTML = `
      <span class="service-pick__tag">${service.tag}</span>
      <strong>${service.title}</strong>
      <span>${service.fullLine || service.description}</span>
    `;
    button.addEventListener("click", () => {
      serviceSelect.value = serviceValue;
      setSelectedPick(serviceValue);
      persistDraft();
      bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    servicePicks.appendChild(button);
  });
}

function hydrateDraft() {
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
}

function applyServiceFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");
  const hasMatchingOption = Array.from(serviceSelect.options).some((option) => option.value === service);
  if (service && hasMatchingOption) {
    serviceSelect.value = service;
  }
}

function persistDraft() {
  const values = Object.fromEntries(new FormData(bookingForm).entries());
  localStorage.setItem(bookingDraftStorageKey, JSON.stringify(values));
}

function clearDraft() {
  localStorage.removeItem(bookingDraftStorageKey);
}

async function copyWechat(wechat) {
  try {
    await navigator.clipboard.writeText(wechat);
    bookingHint.textContent = `微信号已复制：${wechat}`;
  } catch (error) {
    console.warn(error);
    bookingHint.textContent = `微信号：${wechat}`;
  }
}

async function submitBooking(formData) {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData.entries())),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "预约提交失败，请稍后再试。");
  }

  return result;
}

async function init() {
  const config = await configRequest;

  renderServices(config.services);
  setMinBookingDate();
  hydrateDraft();
  applyServiceFromQuery();
  setSelectedPick(serviceSelect.value);

  wechatValue.textContent = config.contact.wechat;
  contactNote.textContent = config.contact.note;

  if (config.paymentQrImage) {
    paymentPanel.hidden = false;
    paymentImage.src = config.paymentQrImage;
    paymentImage.alt = `${config.brand.name}收款码`;
    paymentCopy.textContent = config.paymentQrCopy;
  }

  bookingForm.addEventListener("input", () => {
    persistDraft();
    setSelectedPick(serviceSelect.value);
  });

  serviceSelect.addEventListener("change", () => {
    setSelectedPick(serviceSelect.value);
    persistDraft();
  });

  document.querySelectorAll("[data-wechat-copy]").forEach((button) => {
    button.addEventListener("click", () => copyWechat(config.contact.wechat));
  });

  scrollToFormButton?.addEventListener("click", () => {
    bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    bookingStatus.textContent = "正在提交预约...";
    bookingStatus.dataset.state = "loading";

    try {
      const result = await submitBooking(new FormData(bookingForm));
      clearDraft();
      bookingForm.reset();
      setMinBookingDate();
      setSelectedPick("");
      bookingStatus.dataset.state = "success";
      bookingStatus.textContent = result.bookingId
        ? `预约已提交，记录编号：${result.bookingId}`
        : "预约已提交，我们会尽快确认。";
      bookingHint.textContent = "如果还想补充参考图或现场信息，可以继续微信沟通。";
    } catch (error) {
      bookingStatus.dataset.state = "error";
      bookingStatus.textContent = error.message;
    }
  });
}

init().catch((error) => {
  console.error(error);
  bookingStatus.dataset.state = "error";
  bookingStatus.textContent = "预约页加载失败，请稍后刷新重试。";
});
