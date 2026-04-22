const serviceBasePrices = {
  "House Cleaning": { small: 110, medium: 180, large: 280 },
  Landscaping: { small: 140, medium: 240, large: 360 },
  Handyman: { small: 125, medium: 225, large: 345 }
};

const quoteForm = document.getElementById("quote-form");
const quotePrice = document.getElementById("quotePrice");
const quoteNote = document.getElementById("quoteNote");
const quoteBreakdown = document.getElementById("quoteBreakdown");
const saveLeadButton = document.getElementById("saveLeadButton");
const leadList = document.getElementById("leadList");
const clearLeadsButton = document.getElementById("clearLeadsButton");
const waitlistForm = document.getElementById("waitlist-form");
const waitlistMessage = document.getElementById("waitlistMessage");

let currentQuote = null;

function currency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function calculateQuote(formData) {
  const { customerName, serviceType, jobSize, travelMiles, materialsCost, urgency } = formData;

  const baseService = serviceBasePrices[serviceType][jobSize];
  const travelFee = Number(travelMiles) * 2;
  const materials = Number(materialsCost);
  const rushFee = urgency === "rush" ? 65 : 0;
  const total = baseService + travelFee + materials + rushFee;

  return {
    customerName,
    serviceType,
    jobSize,
    travelMiles: Number(travelMiles),
    materialsCost: materials,
    urgency,
    baseService,
    travelFee,
    rushFee,
    total,
    followUpText: urgency === "rush"
      ? "Reply within 10 minutes. This customer has a high-intent rush request."
      : "Send a reminder tomorrow morning if they have not replied."
  };
}

function readLeads() {
  const raw = localStorage.getItem("quotelift-leads");
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLeads(leads) {
  localStorage.setItem("quotelift-leads", JSON.stringify(leads));
}

function renderLeadList() {
  const leads = readLeads();

  if (leads.length === 0) {
    leadList.innerHTML = '<p class="empty-state">No saved leads yet. Create a quote and save one to see the mini CRM in action.</p>';
    return;
  }

  leadList.innerHTML = leads
    .slice()
    .reverse()
    .map((lead) => `
      <article class="lead-card">
        <div class="lead-head">
          <h4>${lead.customerName}</h4>
          <span class="lead-price">${currency(lead.total)}</span>
        </div>
        <p class="lead-meta">${lead.serviceType} - ${lead.jobSize} job - ${lead.travelMiles} miles</p>
        <p class="lead-followup">${lead.followUpText}</p>
      </article>
    `)
    .join("");
}

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(quoteForm);
  currentQuote = calculateQuote({
    customerName: formData.get("customerName")?.toString() || document.getElementById("customerName").value.trim(),
    serviceType: formData.get("serviceType")?.toString() || document.getElementById("serviceType").value,
    jobSize: formData.get("jobSize")?.toString() || document.getElementById("jobSize").value,
    travelMiles: formData.get("travelMiles")?.toString() || document.getElementById("travelMiles").value,
    materialsCost: formData.get("materialsCost")?.toString() || document.getElementById("materialsCost").value,
    urgency: formData.get("urgency")?.toString() || document.getElementById("urgency").value
  });

  quotePrice.textContent = currency(currentQuote.total);
  quoteNote.textContent = `${currentQuote.customerName} should receive this quote for a ${currentQuote.serviceType.toLowerCase()} job.`;
  quoteBreakdown.innerHTML = `
    <p>Base service: ${currency(currentQuote.baseService)}</p>
    <p>Travel fee: ${currency(currentQuote.travelFee)}</p>
    <p>Materials: ${currency(currentQuote.materialsCost)}</p>
    <p>Rush fee: ${currency(currentQuote.rushFee)}</p>
  `;
  saveLeadButton.disabled = false;
});

saveLeadButton.addEventListener("click", () => {
  if (!currentQuote) {
    return;
  }

  const leads = readLeads();
  leads.push(currentQuote);
  writeLeads(leads);
  renderLeadList();
  saveLeadButton.disabled = true;
  quoteNote.textContent = `Saved ${currentQuote.customerName} to the lead tracker.`;
});

clearLeadsButton.addEventListener("click", () => {
  localStorage.removeItem("quotelift-leads");
  renderLeadList();
});

waitlistForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("waitlistEmail").value.trim();
  localStorage.setItem("quotelift-founder-email", email);
  waitlistMessage.textContent = `Saved ${email} locally. This can become the first admin or founder account later.`;
  waitlistForm.reset();
});

renderLeadList();
