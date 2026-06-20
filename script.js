/* ---------- NAVIGATION ---------- */
const grid = document.getElementById('toolGrid');
const panels = document.querySelectorAll('.panel');

grid.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if(!card) return;
  openPanel(card.dataset.target);
});

document.querySelectorAll('[data-close]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const panel = btn.closest('.panel');
    resetPanel(panel.id.replace('panel-', ''));
    panel.classList.remove('active');
    grid.style.display='grid';
  });
});

function openPanel(name){
  resetPanel(name);
  panels.forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-'+name).classList.add('active');
  grid.style.display='none';
  document.getElementById('panel-'+name).scrollIntoView({behavior:'smooth', block:'start'});
}

/* Clears every input/select inside a panel and hides its readout,
   so reopening a calculator always starts fresh. */
function resetPanel(name){
  const panel = document.getElementById('panel-'+name);
  if(!panel) return;

  panel.querySelectorAll('input').forEach(el => el.value = '');
  panel.querySelectorAll('select').forEach(el => el.selectedIndex = 0);

  const readout = panel.querySelector('.readout');
  if(readout) readout.classList.remove('show');

  const splitList = document.getElementById('split-list');
  if(splitList) splitList.innerHTML = '';

  // Rebuild dynamic row calculators back to their default starting rows
  if(name === 'sgpa'){
    document.getElementById('sgpa-rows').innerHTML = '';
    sgpaRowCount = 0;
    addSgpaRow(); addSgpaRow(); addSgpaRow();
  }
  if(name === 'cgpa'){
    document.getElementById('cgpa-rows').innerHTML = '';
    cgpaRowCount = 0;
    addCgpaRow(); addCgpaRow();
  }
  if(name === 'split'){
    document.getElementById('split-custom-rows').innerHTML = '';
    splitRowCount = 0;
    addSplitRow(); addSplitRow();
    document.getElementById('split-mode').value = 'even';
    toggleSplitMode();
  }
}

/* ---------- AGE ---------- */
function calcAge(){
  const dobVal = document.getElementById('age-dob').value;
  if(!dobVal){ alert('Pick a date of birth first.'); return; }
  const dob = new Date(dobVal);
  const asofVal = document.getElementById('age-asof').value;
  const asof = asofVal ? new Date(asofVal) : new Date();

  if(dob > asof){ alert('Birth date must be before the "as of" date.'); return; }

  let years = asof.getFullYear() - dob.getFullYear();
  let months = asof.getMonth() - dob.getMonth();
  let days = asof.getDate() - dob.getDate();

  if(days < 0){
    months--;
    const prevMonth = new Date(asof.getFullYear(), asof.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if(months < 0){
    years--;
    months += 12;
  }

  const totalDays = Math.floor((asof - dob) / (1000*60*60*24));

  document.getElementById('age-value').textContent = `${years}y ${months}m ${days}d`;
  document.getElementById('age-sub').innerHTML = `
    <div><span>Total days lived</span><b>${totalDays.toLocaleString()}</b></div>
    <div><span>Total months</span><b>${years*12+months}</b></div>
    <div><span>Total weeks</span><b>${Math.floor(totalDays/7).toLocaleString()}</b></div>
  `;
  document.getElementById('age-readout').classList.add('show');
}

/* ---------- SGPA ---------- */
let sgpaRowCount = 0;
function addSgpaRow(){
  sgpaRowCount++;
  const id = sgpaRowCount;
  const row = document.createElement('div');
  row.className = 'bill-row';
  row.id = 'sgpa-row-'+id;
  row.innerHTML = `
    <input type="text" placeholder="Subject ${id} (optional)" id="sgpa-name-${id}">
    <input type="number" placeholder="Credits" id="sgpa-credit-${id}" style="max-width:110px;">
    <input type="number" placeholder="Grade pt" id="sgpa-grade-${id}" style="max-width:110px;" step="0.1">
    <button class="remove-btn" onclick="document.getElementById('sgpa-row-${id}').remove()">✕</button>
  `;
  document.getElementById('sgpa-rows').appendChild(row);
}

function calcSgpa(){
  const rows = document.querySelectorAll('#sgpa-rows .bill-row');
  let totalCredits = 0, totalPoints = 0, count = 0;
  rows.forEach(row=>{
    const idMatch = row.id.split('-')[2];
    const credit = parseFloat(document.getElementById('sgpa-credit-'+idMatch).value);
    const grade = parseFloat(document.getElementById('sgpa-grade-'+idMatch).value);
    if(!isNaN(credit) && !isNaN(grade)){
      totalCredits += credit;
      totalPoints += credit*grade;
      count++;
    }
  });
  if(count === 0 || totalCredits === 0){ alert('Enter at least one subject with credits and grade point.'); return; }
  const result = totalPoints/totalCredits;
  document.getElementById('sgpa-value').textContent = result.toFixed(2);
  document.getElementById('sgpa-sub').innerHTML = `
    <div><span>Total credits</span><b>${totalCredits}</b></div>
    <div><span>Subjects counted</span><b>${count}</b></div>
    <div><span>Approx percentage</span><b>${(result*9.5).toFixed(1)}%</b></div>
  `;
  document.getElementById('sgpa-readout').classList.add('show');
}

/* ---------- CGPA ---------- */
let cgpaRowCount = 0;
function addCgpaRow(){
  cgpaRowCount++;
  const id = cgpaRowCount;
  const row = document.createElement('div');
  row.className = 'bill-row';
  row.id = 'cgpa-row-'+id;
  row.innerHTML = `
    <input type="text" placeholder="Semester ${id} label (optional)" id="cgpa-name-${id}">
    <input type="number" placeholder="SGPA" id="cgpa-sgpa-${id}" style="max-width:120px;" step="0.01">
    <button class="remove-btn" onclick="document.getElementById('cgpa-row-${id}').remove()">✕</button>
  `;
  document.getElementById('cgpa-rows').appendChild(row);
}

function calcCgpa(){
  const rows = document.querySelectorAll('#cgpa-rows .bill-row');
  let totalSgpa = 0, count = 0;
  rows.forEach(row=>{
    const idMatch = row.id.split('-')[2];
    const sgpa = parseFloat(document.getElementById('cgpa-sgpa-'+idMatch).value);
    if(!isNaN(sgpa)){
      totalSgpa += sgpa;
      count++;
    }
  });
  if(count === 0){ alert('Enter at least one semester SGPA.'); return; }
  const result = totalSgpa/count;
  document.getElementById('cgpa-value').textContent = result.toFixed(2);
  document.getElementById('cgpa-sub').innerHTML = `
    <div><span>Semesters counted</span><b>${count}</b></div>
    <div><span>Sum of SGPAs</span><b>${totalSgpa.toFixed(2)}</b></div>
    <div><span>Approx percentage</span><b>${(result*9.5).toFixed(1)}%</b></div>
  `;
  document.getElementById('cgpa-readout').classList.add('show');
}

/* ---------- EMI ---------- */
function calcEmi(){
  const P = parseFloat(document.getElementById('emi-principal').value);
  const annualRate = parseFloat(document.getElementById('emi-rate').value);
  const n = parseFloat(document.getElementById('emi-tenure').value);
  if(!P || !annualRate || !n){ alert('Fill in loan amount, rate, and tenure.'); return; }

  const r = (annualRate/12)/100;
  const emi = (P * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  document.getElementById('emi-value').textContent = '₹' + emi.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  document.getElementById('emi-sub').innerHTML = `
    <div><span>Total interest</span><b>₹${totalInterest.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,')}</b></div>
    <div><span>Total payment</span><b>₹${totalPayment.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,')}</b></div>
    <div><span>Tenure</span><b>${n} months</b></div>
  `;
  document.getElementById('emi-readout').classList.add('show');
}

/* ---------- GST ---------- */
function calcGst(){
  const amount = parseFloat(document.getElementById('gst-amount').value);
  const rate = parseFloat(document.getElementById('gst-rate').value);
  const type = document.getElementById('gst-type').value;
  if(!amount){ alert('Enter an amount.'); return; }

  let base, gstAmt, total;
  if(type === 'exclusive'){
    base = amount;
    gstAmt = base * rate/100;
    total = base + gstAmt;
  } else {
    total = amount;
    base = total / (1 + rate/100);
    gstAmt = total - base;
  }

  document.getElementById('gst-value').textContent = '₹' + total.toFixed(2);
  document.getElementById('gst-sub').innerHTML = `
    <div><span>Base amount</span><b>₹${base.toFixed(2)}</b></div>
    <div><span>GST amount</span><b>₹${gstAmt.toFixed(2)}</b></div>
    <div><span>CGST + SGST</span><b>₹${(gstAmt/2).toFixed(2)} + ₹${(gstAmt/2).toFixed(2)}</b></div>
  `;
  document.getElementById('gst-readout').classList.add('show');
}

/* ---------- DISCOUNT ---------- */
function calcDiscount(){
  const price = parseFloat(document.getElementById('disc-price').value);
  const percent = parseFloat(document.getElementById('disc-percent').value);
  if(!price || isNaN(percent)){ alert('Enter price and discount percentage.'); return; }

  const saved = price * percent/100;
  const final = price - saved;

  document.getElementById('disc-value').textContent = '₹' + final.toFixed(2);
  document.getElementById('disc-sub').innerHTML = `
    <div><span>You save</span><b>₹${saved.toFixed(2)}</b></div>
    <div><span>Original price</span><b>₹${price.toFixed(2)}</b></div>
    <div><span>Discount applied</span><b>${percent}%</b></div>
  `;
  document.getElementById('disc-readout').classList.add('show');
}

/* ---------- SPLIT BILL ---------- */
function toggleSplitMode(){
  const mode = document.getElementById('split-mode').value;
  document.getElementById('split-even-block').style.display = mode === 'even' ? 'block' : 'none';
  document.getElementById('split-custom-block').style.display = mode === 'custom' ? 'block' : 'none';
}

let splitRowCount = 0;
function addSplitRow(){
  splitRowCount++;
  const id = splitRowCount;
  const row = document.createElement('div');
  row.className = 'bill-row';
  row.id = 'split-row-'+id;
  row.innerHTML = `
    <input type="text" placeholder="Name" id="split-name-${id}" value="Person ${id}">
    <input type="number" placeholder="Share (₹ or %)" id="split-share-${id}" style="max-width:150px;">
    <button class="remove-btn" onclick="document.getElementById('split-row-${id}').remove()">✕</button>
  `;
  document.getElementById('split-custom-rows').appendChild(row);
}

function calcSplit(){
  const total = parseFloat(document.getElementById('split-total').value);
  const tipPct = parseFloat(document.getElementById('split-tip').value) || 0;
  if(!total){ alert('Enter the total bill amount.'); return; }

  const grandTotal = total + (total * tipPct/100);
  const mode = document.getElementById('split-mode').value;
  const listEl = document.getElementById('split-list');
  listEl.innerHTML = '';

  if(mode === 'even'){
    const people = parseInt(document.getElementById('split-people').value);
    if(!people || people < 1){ alert('Enter number of people.'); return; }
    const each = grandTotal / people;
    document.getElementById('split-value').textContent = '₹' + each.toFixed(2);
    document.getElementById('split-sub').innerHTML = `
      <div><span>Grand total (with tip)</span><b>₹${grandTotal.toFixed(2)}</b></div>
      <div><span>People</span><b>${people}</b></div>
      <div><span>Tip applied</span><b>${tipPct}%</b></div>
    `;
  } else {
    const rows = document.querySelectorAll('#split-custom-rows .bill-row');
    let shares = [];
    let totalShare = 0;
    rows.forEach(row=>{
      const idMatch = row.id.split('-')[2];
      const name = document.getElementById('split-name-'+idMatch).value || 'Person';
      const share = parseFloat(document.getElementById('split-share-'+idMatch).value);
      if(!isNaN(share)){
        shares.push({name, share});
        totalShare += share;
      }
    });
    if(shares.length === 0){ alert('Add at least one person with a share.'); return; }

    shares.forEach(p=>{
      const portion = (p.share/totalShare) * grandTotal;
      const div = document.createElement('div');
      div.innerHTML = `<span>${p.name}</span><span>₹${portion.toFixed(2)}</span>`;
      listEl.appendChild(div);
    });

    document.getElementById('split-value').textContent = '₹' + grandTotal.toFixed(2) + ' total';
    document.getElementById('split-sub').innerHTML = `
      <div><span>Grand total (with tip)</span><b>₹${grandTotal.toFixed(2)}</b></div>
      <div><span>People</span><b>${shares.length}</b></div>
      <div><span>Tip applied</span><b>${tipPct}%</b></div>
    `;
  }
  document.getElementById('split-readout').classList.add('show');
}

/* Initial default rows on first page load */
addSgpaRow(); addSgpaRow(); addSgpaRow();
addCgpaRow(); addCgpaRow();
addSplitRow(); addSplitRow();
