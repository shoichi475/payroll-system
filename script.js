let employees =
JSON.parse(localStorage.getItem("employees")) || [];

let timeRecords =
JSON.parse(localStorage.getItem("timeRecords")) || [];

let selectedEmployee = null;

function saveStorage(){
localStorage.setItem("employees",JSON.stringify(employees));
localStorage.setItem("timeRecords",JSON.stringify(timeRecords));
}

// NAV
function showAdd(){hideAll();addPage.style.display="block";}
function showTime(){hideAll();timePage.style.display="block";}
function showFile(){hideAll();filePage.style.display="block";renderFile();}
function showSearch(){hideAll();searchPage.style.display="block";}
function showUpdate(){hideAll();updatePage.style.display="block";}
function backHome(){hideAll();homePage.style.display="block";}

function hideAll(){
document.querySelectorAll(".form-container")
.forEach(e=>e.style.display="none");
homePage.style.display="none";
}

// ADD
addForm.addEventListener("submit",e=>{
e.preventDefault();

employees.push({
fname:fname.value,
mname:mname.value,
lname:lname.value,
address:address.value,
id:id.value,
dept:dept.value,
email:email.value,
number:number.value,
date:date.value,
rate:+rate.value,
hours:+hours.value
});

saveStorage();
alert("Saved!");
e.target.reset();
});

// CHECK FILE (GROUPED + DELETE)
function renderFile(){

fileList.innerHTML="";
let grouped={};

employees.forEach(emp=>{
if(!grouped[emp.dept]) grouped[emp.dept]=[];
grouped[emp.dept].push(emp);
});

for(let dept in grouped){

fileList.innerHTML+=`<h3>${dept}</h3>`;

grouped[dept].forEach(emp=>{

let salary=emp.rate*emp.hours*22;

fileList.innerHTML+=`
<div style="position:relative">
<button onclick="deleteEmployee('${emp.id}')"
style="position:absolute;top:5px;right:5px;background:red;color:white">
X
</button>

<pre>
Employee: ${emp.fname} ${emp.mname} ${emp.lname}
ID: ${emp.id}
Dept: ${emp.dept}
Email: ${emp.email}
Number: ${emp.number}
Date: ${emp.date}
Salary: ₱${salary}
</pre>
</div>
`;
});

}
}

function deleteEmployee(id){
employees = employees.filter(e=>e.id!==id);
saveStorage();
renderFile();
}

// SEARCH (SINGLE BAR)
function searchEmployee(){

let q = searchBar.value.toLowerCase();

searchResult.innerHTML="";

let results = employees.filter(emp=>{
let full = `${emp.fname} ${emp.mname} ${emp.lname}`.toLowerCase();
let salary = emp.rate*emp.hours*22;

return full.includes(q) ||
emp.id.includes(q) ||
String(salary).includes(q);
});

results.forEach(emp=>{
let salary=emp.rate*emp.hours*22;

searchResult.innerHTML+=`
<pre>
Employee: ${emp.fname} ${emp.mname} ${emp.lname}
ID: ${emp.id}
Dept: ${emp.dept}
Email: ${emp.email}
Number: ${emp.number}
Date: ${emp.date}
Salary: ₱${salary}
</pre>
`;
});
}

// TIME
function saveTime(){

let emp = employees.find(e=>e.id===timeID.value);

if(!emp){timeMsg.innerText="Not found";return;}

timeRecords.push({
id:emp.id,
in:timeIn.value,
out:timeOut.value
});

saveStorage();
timeMsg.innerText="Saved!";
}

// UPDATE
function findEmployee(){

let emp = employees.find(e=>e.id===updateID.value);

if(!emp){updateMsg.innerText="Not found";return;}

selectedEmployee=emp;
editForm.style.display="block";

ufname.value=emp.fname;
umname.value=emp.mname;
ulname.value=emp.lname;
uaddress.value=emp.address;
udept.value=emp.dept;
uemail.value=emp.email;
unumber.value=emp.number;
udate.value=emp.date;
urate.value=emp.rate;
uhours.value=emp.hours;
}

function saveUpdate(){

Object.assign(selectedEmployee,{
fname:ufname.value,
mname:umname.value,
lname:ulname.value,
address:uaddress.value,
dept:udept.value,
email:uemail.value,
number:unumber.value,
date:udate.value,
rate:+urate.value,
hours:+uhours.value
});

saveStorage();
alert("Updated!");
}

// EXIT
function exitSystem(){
alert("Close tab manually.");
}
