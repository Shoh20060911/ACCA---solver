const examples = {
  "General": [
    "Gross profit is $240,000 and revenue is $600,000. What is the gross profit margin?",
    "A machine costs $80,000, has a residual value of $5,000 and a useful life of 5 years. Calculate annual depreciation using the straight-line method.",
  ],
  "FA/F3": [
    "A company purchases inventory for $10,000 on credit. Prepare the journal entry.",
    "Opening capital is $50,000, net profit is $15,000 and drawings are $8,000. Calculate closing capital.",
  ],
  "MA/F2": [
    "Fixed costs are $120,000, variable cost per unit is $8, and selling price per unit is $20. Calculate the breakeven point in units.",
    "Budgeted output is 5,000 units; actual output is 4,800 units. Budgeted fixed overhead is $60,000. Calculate the volume variance.",
  ],
  "TX/F6": [
    "An employee earns £40,000 salary. Calculate their income tax assuming the personal allowance is £12,570 and basic rate band is 20% up to £50,270.",
    "A company sells an asset for £80,000. Original cost was £50,000, accumulated depreciation £20,000. Calculate the chargeable gain.",
  ],
  "FR/F7": [
    "Parent owns 80% of subsidiary. Net assets at acquisition were $200,000; goodwill paid was $60,000. Calculate goodwill at acquisition.",
    "Revenue $1,200,000; cost of sales $700,000; admin expenses $150,000; finance cost $30,000; tax rate 20%. Prepare a summary income statement.",
  ],
  "AA/F8": [
    "List and explain three audit procedures for verifying trade receivables.",
    "What is the difference between inherent risk and control risk in an audit?",
  ],
  "FM/F9": [
    "A project costs $500,000 and generates cash flows of $150,000 per year for 5 years. Cost of capital is 10%. Calculate the NPV.",
    "Current ratio is 2.5, quick ratio is 1.1, current liabilities are $80,000. Calculate inventory value.",
  ],
  "SBR": [
    "Explain how IFRS 15 requires revenue to be recognised using the five-step model.",
    "Under IFRS 16, how should a lessee account for a lease on initial recognition?",
  ],
  "AFM": [
    "A company has equity beta of 1.4, risk-free rate 3%, market return 9%. Calculate the cost of equity using CAPM.",
    "Explain the key differences between interest rate futures and interest rate options as hedging instruments.",
  ],
};

let selectedSubject = "General";

function renderExamples() {
  const row = document.getElementById('examplesRow');
  row.innerHTML = '';
  const list = examples[selectedSubject] || examples["General"];
  list.forEach(ex => {
    const chip = document.createElement('button');
    chip.className = 'example-chip';
    chip.textContent = ex.length > 65 ? ex.slice(0, 62) + '…' : ex;
    chip.title = ex;
    chip.onclick = () => {
      document.getElementById('questionInput').value = ex;
      updateCount();
      document.getElementById('questionInput').focus();
    };
    row.appendChild(chip);
  });
}

document.getElementById('subjectBar').addEventListener('click', e => {
  const btn = e.target.closest('.subject-btn');
  if (!btn) return;
  document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSubject = btn.dataset.sub;
  renderExamples();
});

const textarea = document.getElementById('questionInput');

function updateCount() {
  const len = textarea.value.length;
  document.getElementById('charCount').textContent = len + ' character' + (len !== 1 ? 's' : '');
}

textarea.addEventListener('input', updateCount);
textarea.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') solveQuestion();
});

async function solveQuestion() {
  const question = textarea.value.trim();
  if (!question) { textarea.focus(); return; }

  const btn = document.getElementById('solveBtn');
  const section = document.getElementById('responseSection');
  const body = document.getElementById('responseBody');
  const paper = document.getElementById('respPaper');

  paper.textContent = selectedSubject;
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader-2"></i><span>Solving…</span>';
  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  body.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';

  try {
    const res = await fetch('/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, subject: selectedSubject })
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);
    body.textContent = data.text;

  } catch (err) {
    body.innerHTML = `<span class="error-msg"><i class="ti ti-alert-circle"></i> ${err.message}</span>`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-sparkles"></i><span>Solve Question</span>';
  }
}

async function copyAnswer() {
  const text = document.getElementById('responseBody').innerText;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById('copyBtn');
    btn.innerHTML = '<i class="ti ti-check"></i>';
    setTimeout(() => { btn.innerHTML = '<i class="ti ti-copy"></i>'; }, 1800);
  } catch {}
}

renderExamples();
