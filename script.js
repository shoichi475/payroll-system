let employees = JSON.parse(localStorage.getItem("employees")) || [];
let timeRecords = JSON.parse(localStorage.getItem("timeRecords")) || [];
let selectedEmployee = null;

function saveStorage(){
  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("timeRecords", JSON.stringify(timeRecords));
}

// NAVIGATION
function showPage(id, title){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById("page-" + id).classList.add("active");
  document.getElementById("nav-" + id).classList.add("active");

  document.getElementById("pageTitle").textContent = title;
}

// ADD EMPLOYEE
function submitAdd(e){
  e.preventDefault();

  employees.push({
    fname: fname.value,
    mname: mname.value,
    lname: lname.value,
    address: address.value,
    id: empid.value,
    dept: dept.value,
    email: email.value,
    number: number.value,
    date: date.value,
    rate: +rate.value,
    hours: +hours.value
  });

  saveStorage();
  alert("Saved!");
  e.target.reset();
}

// TIME
function saveTime(){
  timeRecords.push({
    id: timeID.value,
    in: timeIn.value,
    out: timeOut.value
  });

  saveStorage();
  timeMsg.textContent = "Saved!";
}

// SEARCH
function doSearch(){
  let id = searchID.value;
  let name = searchName.value.toLowerCase();

  let result = employees.filter(e =>
    e.id === id ||
    `${e.fname} ${e.lname}`.toLowerCase().includes(name)
  );

  searchResult.innerHTML = JSON.stringify(result, null, 2);
}

// FILE
function renderFullFile(){
  fileList.innerHTML = employees.map(e => `
    <div>
      <b>${e.fname} ${e.lname}</b> - ${e.id}
    </div>
  `).join("");
}

// UPDATE
function findEmployee(){
  selectedEmployee = employees.find(e => e.id === updateID.value);
  if(!selectedEmployee) return alert("Not found");

  editForm.style.display = "block";

  ufname.value = selectedEmployee.fname;
  umname.value = selectedEmployee.mname;
  ulname.value = selectedEmployee.lname;
}

function saveUpdate(e){
  e.preventDefault();

  Object.assign(selectedEmployee, {
    fname: ufname.value,
    mname: umname.value,
    lname: ulname.value
  });

  saveStorage();
  alert("Updated!");
}
