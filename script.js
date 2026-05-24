let employees = [];
let timeRecords = [];
let selectedEmployee = null;

// NAVIGATION
function showAdd(){hideAll();addPage.style.display="block";}
function showTime(){hideAll();timePage.style.display="block";}
function showFile(){hideAll();filePage.style.display="block";renderFile();}
function showSearch(){hideAll();searchPage.style.display="block";}
function showUpdate(){hideAll();updatePage.style.display="block";}
function backHome(){hideAll();homePage.style.display="block";}

function hideAll(){
document.querySelectorAll(".form-container").forEach(e=>e.style.display="none");
homePage.style.display="none";
}

// ADD EMPLOYEE
addForm.addEventListener("submit",e=>{
e.preventDefault();

employees.push({
fname:fname.value,
lname:lname.value,
address:address.value,
id:id.value,
dept:dept.value,
email:email.value,
date:date.value,
rate:+rate.value,
hours:+hours.value
});

alert("Saved!");
e.target.reset();
});

// CHECK FILE
function renderFile(){

fileList.innerHTML="";

let grouped = {};

employees.forEach(emp=>{
if(!grouped[emp.dept]) grouped[emp.dept]=[];
grouped[emp.dept].push(emp);
});

for(let dept in grouped){

fileList.innerHTML += `<h3 style="color:#93c5fd;margin-top:15px">${dept}</h3>`;

grouped[dept].forEach(emp=>{

let salary = emp.rate * emp.hours * 22;

fileList.innerHTML += `
<pre style="
color:white;
background:rgba(255,255,255,0.05);
padding:15px;
margin:10px 0;
border-radius:10px;
border:1px solid rgba(255,255,255,0.2);
font-family:monospace;
text-align:left;
">

==================================================
Employee Name        : ${emp.fname} ${emp.lname}
Employee Address     : ${emp.address}
Employee ID Number   : ${emp.id}
Department           : ${emp.dept}
Email                : ${emp.email}
Date of Employment   : ${emp.date}
Rate Per Hour        : ${emp.rate.toFixed(2)}
Daily Hours          : ${emp.hours}
Monthly Salary       : Php ${salary.toFixed(2)}
==================================================
</pre>
`;
});

}
}

// TIME
function saveTime(){

let emp = employees.find(e=>e.id===timeID.value);

if(!emp){
timeMsg.innerText="This ID does not exist";
return;
}

timeRecords.push({
id:emp.id,
in:timeIn.value,
out:timeOut.value
});

timeMsg.innerText="Time saved!";
}

// SEARCH
function filterSalary(type){

searchResult.innerHTML="";

employees.forEach(emp=>{

let salary=emp.rate*emp.hours*22;

if(type==="below" && salary<50000 ||
type==="above" && salary>=50000){

searchResult.innerHTML+=`
<div style="border:1px solid white;padding:10px;margin:10px;border-radius:10px;">
${emp.fname} ${emp.lname}<br>
Salary: ₱${salary.toFixed(2)}
</div>
`;
}

});
}

// UPDATE
function findEmployee(){

let emp = employees.find(e=>e.id===updateID.value);

if(!emp){
updateMsg.innerText="Employee not found";
return;
}

selectedEmployee = emp;

editForm.style.display="block";

ufname.value=emp.fname;
ulname.value=emp.lname;
uaddress.value=emp.address;
udept.value=emp.dept;
uemail.value=emp.email;
urate.value=emp.rate;
uhours.value=emp.hours;
}

function saveUpdate(){

selectedEmployee.fname=ufname.value;
selectedEmployee.lname=ulname.value;
selectedEmployee.address=uaddress.value;
selectedEmployee.dept=udept.value;
selectedEmployee.email=uemail.value;
selectedEmployee.rate=+urate.value;
selectedEmployee.hours=+uhours.value;

alert("Updated!");
}

// EXIT
function exitSystem(){
alert("Close tab manually.");
}
