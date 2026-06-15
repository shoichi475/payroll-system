// ─── LOCAL STORAGE ───────────────────────────────────────────────
let employees   = JSON.parse(localStorage.getItem("employees"))   || [];
let timeRecords = JSON.parse(localStorage.getItem("timeRecords")) || [];
let selectedEmployee = null;
 
function saveStorage(){
  localStorage.setItem("employees",   JSON.stringify(employees));
  localStorage.setItem("timeRecords", JSON.stringify(timeRecords));
}
 
// ─── HELPERS ─────────────────────────────────────────────────────
function setErr(id, msg){ document.getElementById(id).textContent = msg; }
function clearErrors(){ document.querySelectorAll('.error-msg').forEach(e => e.textContent = ''); }
function showInvalid(id){ setErr(id, 'Invalid Input'); }
function showRequired(id){ setErr(id, 'Input Required'); }
 
// Highlight input border neon red/clear
function markInput(el, bad){
  if (bad) {
    el.style.borderColor = '#ef4444';
    el.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
  } else {
    el.style.borderColor = 'rgba(255, 255, 255, 0.12)';
    el.style.boxShadow = 'none';
  }
}
 
// ─── DATE LIMITS ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("date");
  const udateInput = document.getElementById("udate");
  if(dateInput) dateInput.max  = today;
  if(udateInput) udateInput.max = today;
  
  // Initialize interactive 3D tilt effects
  init3DTilt();
});
 
// ─── INTERACTIVE 3D MOUSE MOVEMENT TILT ─────────────────────────
function init3DTilt() {
  document.addEventListener('mousemove', (e) => {
    // Select cards, feature cards, and visual panels to apply tilt
    const targets = document.querySelectorAll('.card, .file-card, .file-option-card, .search-block, .update-top, .feature-card');
    
    targets.forEach(el => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Only tilt when the mouse is physically close (within 350px radius)
      const distance = Math.hypot(x, y);
      if (distance < 350) {
        // Calculate tilt angles (maximum 4 degrees rotation)
        const tiltX = (y / (rect.height / 2)) * -4;
        const tiltY = (x / (rect.width / 2)) * 4;
        
        el.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
        el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(6px)`;
        
        // Dynamically detect which glow color mapping to apply
        let glowColor = 'rgba(0, 240, 255, 0.15)'; // default neon blue
        
        if (el.classList.contains('glow-purple') || el.classList.contains('file-option-card')) {
          glowColor = 'rgba(176, 38, 255, 0.15)';
        } else if (el.classList.contains('glow-green') || el.classList.contains('file-card') || el.classList.contains('update-top')) {
          glowColor = 'rgba(57, 255, 20, 0.15)';
        }
        
        el.style.boxShadow = `0 14px 30px ${glowColor}`;
      } else {
        // Return back to flat position when mouse leaves radius
        el.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        el.style.boxShadow = '';
      }
    });
  });
}
 
// ─── NAVIGATION ──────────────────────────────────────────────────
function showPage(id, title){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  const targetPage = document.getElementById('page-' + id);
  const targetNav = document.getElementById('nav-'  + id);
  
  if (targetPage) targetPage.classList.add('active');
  if (targetNav) targetNav.classList.add('active');
  
  document.getElementById('pageTitle').textContent = title;
  
  if(id === 'file'){
    document.getElementById('fileMenu').style.display       = 'flex';
    document.getElementById('fileSalaryView').style.display = 'none';
    document.getElementById('fileFullView').style.display   = 'none';
  }
}
 
// ─── ADD EMPLOYEE ─────────────────────────────────────────────────
function submitAdd(e){
  e.preventDefault();
  clearErrors();
 
  const fnEl = document.getElementById('fname');
  const mnEl = document.getElementById('mname');
  const lnEl = document.getElementById('lname');
  const adEl = document.getElementById('address');
  const idEl = document.getElementById('empid');
  const dpEl = document.getElementById('dept');
  const emEl = document.getElementById('email');
  const nuEl = document.getElementById('number');
  const dtEl = document.getElementById('date');
  const rtEl = document.getElementById('rate');
  const hrEl = document.getElementById('hours');
 
  let valid = true;
 
  // Full Name — required
  if(!fnEl.value.trim()){ showRequired('nameError'); markInput(fnEl,true); valid=false; }
  else markInput(fnEl,false);
 
  if(!mnEl.value.trim()){ if(valid || document.getElementById('nameError').textContent==='') showRequired('nameError'); markInput(mnEl,true); valid=false; }
  else markInput(mnEl,false);
 
  if(!lnEl.value.trim()){ if(document.getElementById('nameError').textContent==='') showRequired('nameError'); markInput(lnEl,true); valid=false; }
  else markInput(lnEl,false);
 
  // Address
  if(!adEl.value.trim()){ showRequired('addressError'); markInput(adEl,true); valid=false; }
  else markInput(adEl,false);
 
  // Employee ID — format 0000-000, required
  if(!idEl.value.trim()){
    showRequired('idError'); markInput(idEl,true); valid=false;
  } else if(!/^\d{4}-\d{3}$/.test(idEl.value)){
    showInvalid('idError'); markInput(idEl,true); valid=false;
  } else if(employees.some(emp => emp.id === idEl.value)){
    setErr('idError','ID already exists'); markInput(idEl,true); valid=false;
  } else markInput(idEl,false);
 
  // Department
  if(!dpEl.value.trim()){ showRequired('deptError'); markInput(dpEl,true); valid=false; }
  else markInput(dpEl,false);
 
  // Email
  if(!emEl.value.trim()){ showRequired('contactError'); markInput(emEl,true); valid=false; }
  else if(!emEl.value.includes('@')){ showInvalid('contactError'); markInput(emEl,true); valid=false; }
  else markInput(emEl,false);
 
  // Number — must be exactly 11 digits
  if(!nuEl.value.trim()){
    if(!document.getElementById('contactError').textContent) showRequired('contactError');
    markInput(nuEl,true); valid=false;
  } else if(!/^\d{11}$/.test(nuEl.value)){
    setErr('contactError','Invalid Input — must be 11 digits'); markInput(nuEl,true); valid=false;
  } else markInput(nuEl,false);
 
  // Date
  if(!dtEl.value){ showRequired('dateError'); markInput(dtEl,true); valid=false; }
  else markInput(dtEl,false);
 
  // Rate per hour — required & must be > 0
  if(!rtEl.value.trim()){ showRequired('rateError'); markInput(rtEl,true); valid=false; }
  else if(+rtEl.value <= 0){ showInvalid('rateError'); markInput(rtEl,true); valid=false; }
  else markInput(rtEl,false);
 
  // Daily hours — required & must be > 0
  if(!hrEl.value.trim()){ showRequired('hoursError'); markInput(hrEl,true); valid=false; }
  else if(+hrEl.value <= 0){ showInvalid('hoursError'); markInput(hrEl,true); valid=false; }
  else markInput(hrEl,false);
 
  if(!valid) return;
 
  employees.push({
    fname:   fnEl.value.trim(),
    mname:   mnEl.value.trim(),
    lname:   lnEl.value.trim(),
    address: adEl.value.trim(),
    id:      idEl.value.trim(),
    dept:    dpEl.value.trim(),
    email:   emEl.value.trim(),
    number:  nuEl.value.trim(),
    date:    dtEl.value,
    rate:    +rtEl.value,
    hours:   +hrEl.value
  });
  saveStorage();
  alert("Employee saved successfully!");
  e.target.reset();
  document.querySelectorAll('#addForm input').forEach(i => markInput(i, false));
}
 
// ─── CHECK FILE SUB-PAGES ─────────────────────────────────────────
function showFileSubPage(type){
  document.getElementById('fileMenu').style.display = 'none';
  if(type === 'salary'){
    document.getElementById('fileSalaryView').style.display = 'block';
    document.getElementById('fileFullView').style.display   = 'none';
    document.getElementById('pageTitle').textContent = 'EMPLOYEE FILE';
    renderSalaryFile();
  } else {
    document.getElementById('fileFullView').style.display   = 'block';
    document.getElementById('fileSalaryView').style.display = 'none';
    document.getElementById('pageTitle').textContent = 'EMPLOYEE FILES';
    renderFullFile();
  }
}
 
function backToFileMenu(){
  document.getElementById('fileMenu').style.display       = 'flex';
  document.getElementById('fileSalaryView').style.display = 'none';
  document.getElementById('fileFullView').style.display   = 'none';
  document.getElementById('pageTitle').textContent = 'EMPLOYEE FILES';
}
 
// Salary view — categorized by department (reads from localStorage)
function renderSalaryFile(){
  const sl = document.getElementById('salaryList');
  sl.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("employees")) || [];
  if(!data.length){
    sl.innerHTML = '<p style="color:#9ca3af;font-size:13px;padding:20px;">No employee records found in storage.</p>';
    return;
  }
  const tr = JSON.parse(localStorage.getItem("timeRecords")) || [];

  // Group by Department
  let grouped = {};
  data.forEach(emp => {
    if(!grouped[emp.dept]) grouped[emp.dept] = [];
    grouped[emp.dept].push(emp);
  });

  for(let dept in grouped){
    sl.innerHTML += `<div class="dept-heading">${dept}</div>`;
    grouped[dept].sort((a,b) => a.lname.localeCompare(b.lname)).forEach(emp => {
      const monthly = emp.rate * emp.hours * 22;
      const records = tr.filter(r => r.id === emp.id);
      let totalHours = 0;
      records.forEach(r => {
        if(r.in && r.out){
          const [ih,im] = r.in.split(':').map(Number);
          const [oh,om] = r.out.split(':').map(Number);
          const diff = (oh*60+om) - (ih*60+im);
          if(diff > 0) totalHours += diff/60;
        }
      });
      const currentSalary = totalHours * emp.rate;
      sl.innerHTML += `
        <div class="file-card glow-purple">
          <div><span>Employee Name:</span> ${emp.fname} ${emp.mname} ${emp.lname}</div>
          <div><span>Employee ID Number:</span> ${emp.id}</div>
          <div><span>Department:</span> ${emp.dept}</div>
          <div><span>Email:</span> ${emp.email}</div>
          <div><span>Monthly Salary:</span> Php ${monthly.toFixed(2)}</div>
          <div><span>Current Salary:</span> Php ${currentSalary.toFixed(2)}</div>
          <div style="margin-top: 12px; display: flex; justify-content: flex-end;">
            <button class="btn btn-danger" onclick="deleteEmployee('${emp.id}', 'salary')" style="padding: 6px 16px; font-size: 11px;">DELETE RECORD</button>
          </div>
        </div>`;
    });
  }
}
 
// Full file view — complete details categorized by department (reads from localStorage)
function renderFullFile(){
  const fl = document.getElementById('fileList');
  fl.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("employees")) || [];
  if(!data.length){
    fl.innerHTML = '<p style="color:#9ca3af;font-size:13px;padding:20px;">No employee records found in storage.</p>';
    return;
  }
  let grouped = {};
  data.forEach(emp => {
    if(!grouped[emp.dept]) grouped[emp.dept] = [];
    grouped[emp.dept].push(emp);
  });
  for(let dept in grouped){
    fl.innerHTML += `<div class="dept-heading">${dept}</div>`;
    grouped[dept].sort((a,b) => a.lname.localeCompare(b.lname)).forEach(emp => {
      const salary = emp.rate * emp.hours * 22;
      fl.innerHTML += `
        <div class="file-card glow-green">
          <div><span>Employee Name:</span> ${emp.fname} ${emp.mname} ${emp.lname}</div>
          <div><span>Employee Address:</span> ${emp.address}</div>
          <div><span>Employee ID Number:</span> ${emp.id}</div>
          <div><span>Department:</span> ${emp.dept}</div>
          <div><span>Email:</span> ${emp.email}</div>
          <div><span>Contact Number:</span> ${emp.number}</div>
          <div><span>Date of Employment:</span> ${emp.date}</div>
          <div><span>Rate Per Hour:</span> Php ${emp.rate.toFixed(2)}</div>
          <div><span>Daily Hours:</span> ${emp.hours}</div>
          <div><span>Monthly Salary:</span> Php ${salary.toFixed(2)}</div>
          <div style="margin-top: 12px; display: flex; justify-content: flex-end;">
            <button class="btn btn-danger" onclick="deleteEmployee('${emp.id}', 'full')" style="padding: 6px 16px; font-size: 11px;">DELETE RECORD</button>
          </div>
        </div>`;
    });
  }
}

// ─── DELETE SPECIFIC EMPLOYEE RECORD ─────────────────────────────
function deleteEmployee(id, viewType) {
  if (confirm("Are you sure you want to delete this employee record? This action cannot be undone.")) {
    // Read fresh data directly from storage
    let data = JSON.parse(localStorage.getItem("employees")) || [];
    let tr = JSON.parse(localStorage.getItem("timeRecords")) || [];
    
    // Filter out target employee and their attendance history
    data = data.filter(emp => emp.id !== id);
    tr = tr.filter(record => record.id !== id);
    
    // Save back to storage
    localStorage.setItem("employees", JSON.stringify(data));
    localStorage.setItem("timeRecords", JSON.stringify(tr));
    
    // Synchronize global variables
    employees = data;
    timeRecords = tr;
    
    // Refresh the corresponding viewport
    if (viewType === 'salary') {
      renderSalaryFile();
    } else if (viewType === 'full') {
      renderFullFile();
    }
  }
}
 
// ─── TIME IN / OUT ────────────────────────────────────────────────
function saveTime(){
  const idVal  = document.getElementById('timeID').value.trim();
  const inVal  = document.getElementById('timeIn').value;
  const outVal = document.getElementById('timeOut').value;
  const msg    = document.getElementById('timeMsg');
 
  // Clear previous
  msg.textContent = '';
  ['timeID','timeIn','timeOut'].forEach(id => markInput(document.getElementById(id), false));
 
  // Input required checks
  if(!idVal){
    msg.style.color = '#ef4444';
    msg.textContent = 'Input Required — please enter an Employee ID';
    markInput(document.getElementById('timeID'), true);
    return;
  }
  if(!inVal){
    msg.style.color = '#ef4444';
    msg.textContent = 'Input Required — please enter Time In';
    markInput(document.getElementById('timeIn'), true);
    return;
  }
  if(!outVal){
    msg.style.color = '#ef4444';
    msg.textContent = 'Input Required — please enter Time Out';
    markInput(document.getElementById('timeOut'), true);
    return;
  }
 
  // Employee must exist in localStorage
  const data = JSON.parse(localStorage.getItem("employees")) || [];
  const emp  = data.find(e => e.id === idVal);
  if(!emp){
    msg.style.color = '#ef4444';
    msg.textContent = 'Employee Not Found — ID does not exist in records';
    markInput(document.getElementById('timeID'), true);
    return;
  }
 
  // Time out must be after time in
  const [ih,im] = inVal.split(':').map(Number);
  const [oh,om] = outVal.split(':').map(Number);
  if((oh*60+om) <= (ih*60+im)){
    msg.style.color = '#ef4444';
    msg.textContent = 'Invalid Input — Time Out must be later than Time In';
    markInput(document.getElementById('timeIn'),  true);
    markInput(document.getElementById('timeOut'), true);
    return;
  }
 
  // All good — save
  timeRecords.push({ id: emp.id, in: inVal, out: outVal });
  saveStorage();
  msg.style.color = 'var(--neon-green)';
  msg.textContent = 'Time record saved successfully!';
  markInput(document.getElementById('timeIn'),  false);
  markInput(document.getElementById('timeOut'), false);
  document.getElementById('timeID').value  = '';
  document.getElementById('timeIn').value  = '';
  document.getElementById('timeOut').value = '';
}
 
// ─── SEARCH ───────────────────────────────────────────────────────
function doSearch(){
  const nameVal = document.getElementById('searchName').value.toLowerCase().trim();
  const idVal   = document.getElementById('searchID').value.trim();
  const res     = document.getElementById('searchResult');
 
  // Clear inline errors
  ['searchIDErr','searchNameErr'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = '';
  });
 
  const data = JSON.parse(localStorage.getItem("employees")) || [];
 
  // Search by ID
  if(idVal){
    const emp = data.find(e => e.id === idVal);
    if(emp){
      res.className = 'result-box has-results';
      res.innerHTML = resultItem(emp);
    } else {
      res.className = 'result-box has-results';
      res.innerHTML = '<p style="color:#ef4444;font-weight:600;font-size:13px;">Employee Not Found — no record matches this ID</p>';
    }
    return;
  }
 
  // Search by Name
  if(nameVal){
    const matches = data.filter(e =>
      `${e.fname} ${e.mname} ${e.lname}`.toLowerCase().includes(nameVal)
    );
    if(matches.length){
      res.className = 'result-box has-results';
      res.innerHTML = '';
      matches.forEach(e => res.innerHTML += resultItem(e));
    } else {
      res.className = 'result-box has-results';
      res.innerHTML = '<p style="color:#ef4444;font-weight:600;font-size:13px;">Employee Not Found — no record matches this name</p>';
    }
    return;
  }
 
  // Nothing entered
  res.className = 'result-box has-results';
  res.innerHTML = '<p style="color:#ef4444;font-weight:600;font-size:13px;">Input Required — please enter an ID or Name to search</p>';
}
 
function filterSalary(type){
  const salInput = document.getElementById('searchSalary');
  const res      = document.getElementById('searchResult');
  const data     = JSON.parse(localStorage.getItem("employees")) || [];
 
  if(!salInput.value.trim()){
    res.className = 'result-box has-results';
    res.innerHTML = '<p style="color:#ef4444;font-weight:600;font-size:13px;">Input Required — please enter a salary amount</p>';
    markInput(salInput, true);
    return;
  }
  markInput(salInput, false);
 
  const threshold = +salInput.value;
  if(threshold <= 0){
    res.className = 'result-box has-results';
    res.innerHTML = '<p style="color:#ef4444;font-weight:600;font-size:13px;">Invalid Input — salary amount must be greater than zero</p>';
    markInput(salInput, true);
    return;
  }
 
  const matches = data.filter(e => {
    const s = e.rate * e.hours * 22;
    return type === 'below' ? s < threshold : s >= threshold;
  });
 
  if(matches.length){
    res.className = 'result-box has-results';
    res.innerHTML = '';
    matches.forEach(e => res.innerHTML += resultItem(e));
  } else {
    res.className = 'result-box has-results';
    res.innerHTML = `<p style="color:#ef4444;font-weight:600;font-size:13px;">Employee Not Found — no records with salary ${type === 'below' ? 'below' : 'above or equal to'} Php ${threshold.toLocaleString()}</p>`;
  }
}
 
function resultItem(emp){
  const salary = emp.rate * emp.hours * 22;
  return `
    <div class="file-card glow-blue" style="text-align: left; margin-bottom: 14px; width: 100%;">
      <div><span>Employee Name:</span> ${emp.fname} ${emp.mname} ${emp.lname}</div>
      <div><span>Employee Address:</span> ${emp.address}</div>
      <div><span>Employee ID Number:</span> ${emp.id}</div>
      <div><span>Department:</span> ${emp.dept}</div>
      <div><span>Email:</span> ${emp.email}</div>
      <div><span>Contact Number:</span> ${emp.number}</div>
      <div><span>Date of Employment:</span> ${emp.date}</div>
      <div><span>Rate Per Hour:</span> Php ${emp.rate.toFixed(2)}</div>
      <div><span>Daily Hours:</span> ${emp.hours}</div>
      <div><span>Monthly Salary:</span> Php ${salary.toFixed(2)}</div>
    </div>`;
}
 
// ─── UPDATE ───────────────────────────────────────────────────────
function findEmployee(){
  const idVal = document.getElementById('updateID').value.trim();
  const msg   = document.getElementById('updateMsg');
  const ef    = document.getElementById('editForm');
 
  msg.textContent = '';
  markInput(document.getElementById('updateID'), false);
 
  if(!idVal){
    msg.textContent = 'Input Required — please enter an Employee ID';
    msg.style.color = '#ef4444';
    markInput(document.getElementById('updateID'), true);
    ef.style.display = 'none';
    return;
  }
 
  // Read directly from localStorage so it's always fresh
  const data = JSON.parse(localStorage.getItem("employees")) || [];
  const emp  = data.find(e => e.id === idVal);
  if(!emp){
    msg.textContent = 'Employee Not Found — no record matches this ID';
    msg.style.color = '#ef4444';
    markInput(document.getElementById('updateID'), true);
    ef.style.display = 'none';
    return;
  }
 
  // Sync in-memory array too
  employees = data;
  selectedEmployee = employees.find(e => e.id === idVal);
 
  ef.style.display = 'block';
  document.getElementById('ufname').value   = emp.fname;
  document.getElementById('umname').value   = emp.mname;
  document.getElementById('ulname').value   = emp.lname;
  document.getElementById('uaddress').value = emp.address;
  document.getElementById('uemp_id').value  = emp.id;
  document.getElementById('udept').value    = emp.dept;
  document.getElementById('uemail').value   = emp.email;
  document.getElementById('unumber').value  = emp.number;
  document.getElementById('udate').value    = emp.date;
  document.getElementById('urate').value    = emp.rate;
  document.getElementById('uhours').value   = emp.hours;
}
 
function saveUpdate(e){
  e.preventDefault();
 
  // Validate update form fields (same rules as add)
  const fnEl = document.getElementById('ufname');
  const mnEl = document.getElementById('umname');
  const lnEl = document.getElementById('ulname');
  const rtEl = document.getElementById('urate');
  const hrEl = document.getElementById('uhours');
 
  let valid = true;
  clearErrors();
 
  if(!fnEl.value.trim() || !mnEl.value.trim() || !lnEl.value.trim()){
    alert('Input Required — all name fields must be filled'); valid=false;
  }
  if(+rtEl.value <= 0){
    alert('Invalid Input — Rate Per Hour must be greater than zero'); valid=false;
  }
  if(+hrEl.value <= 0){
    alert('Invalid Input — Daily Hours must be greater than zero'); valid=false;
  }
  if(!valid) return;
 
  selectedEmployee.fname   = fnEl.value.trim();
  selectedEmployee.mname   = mnEl.value.trim();
  selectedEmployee.lname   = lnEl.value.trim();
  selectedEmployee.address = document.getElementById('uaddress').value.trim();
  selectedEmployee.id      = document.getElementById('uemp_id').value.trim();
  selectedEmployee.dept    = document.getElementById('udept').value.trim();
  selectedEmployee.email   = document.getElementById('uemail').value.trim();
  selectedEmployee.number  = document.getElementById('unumber').value.trim();
  selectedEmployee.date    = document.getElementById('udate').value;
  selectedEmployee.rate    = +rtEl.value;
  selectedEmployee.hours   = +hrEl.value;
 
  saveStorage();
  alert("Employee record updated successfully!");
}
