let employees = JSON.parse(localStorage.getItem("employees")) || [];
let timeRecords = JSON.parse(localStorage.getItem("timeRecords")) || [];
let selectedEmployee = null;

function saveStorage(){
localStorage.setItem("employees",JSON.stringify(employees));
localStorage.setItem("timeRecords",JSON.stringify(timeRecords));
}

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

// LIMIT DATE
date.max = new Date().toISOString().split("T")[0];
udate.max = new Date().toISOString().split("T")[0];

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

// CHECK FILE (RESTORED FORMAT)
function renderFile(){

fileList.innerHTML="";

let grouped={};

employees.forEach(emp=>{
if(!grouped[emp.dept]) grouped[emp.dept]=[];
grouped[emp.dept].push(emp);
});

for(let dept in grouped){

fileList.innerHTML+=`<h3 style="color:#93c5fd;margin-top:15px">${dept}</h3>`;

grouped[dept].forEach(emp=>{

let salary = emp.rate * emp.hours * 22;

fileList.innerHTML+=`
<pre style="
color:white;
background:rgba(255,255,255,0.05);
padding:15px;
margin:10px 0;
border-radius:10px;
border:1px solid rgba(255,255,255,0.2);
text-align:left;
">

==================================================
Employee Name      : ${emp.fname} ${emp.mname} ${emp.lname}
Employee Address   : ${emp.address}
Employee ID        : ${emp.id}
Department         : ${emp.dept}
Email              : ${emp.email}
Contact Number     : ${emp.number}
Date of Employment : ${emp.date}
Rate Per Hour      : ${emp.rate}
Daily Hours        : ${emp.hours}
Monthly Salary     : ₱${salary.toFixed(2)}
==================================================

</pre>
`;
});
}
}

// DELETE
function deleteEmployee(id){
employees = employees.filter(e=>e.id!==id);
saveStorage();
renderFile();
}

// TIME
function saveTime(){
let emp = employees.find(e=>e.id===timeID.value);
if(!emp){timeMsg.innerText="Not found";return;}

timeRecords.push({id:emp.id,in:timeIn.value,out:timeOut.value});
saveStorage();
timeMsg.innerText="Saved!";
}

// SEARCH
function filterSalary(type){
searchResult.innerHTML="";

employees.forEach(emp=>{
let salary=emp.rate*emp.hours*22;

if((type==="below"&&salary<50000)||(type==="above"&&salary>=50000)){
searchResult.innerHTML+=`
<div style="border:1px solid white;padding:10px;margin:10px;border-radius:10px;">
${emp.fname} ${emp.mname} ${emp.lname}<br>
₱${salary.toFixed(2)}
</div>`;
}
});
}

// NAME SEARCH
function searchByName(){
searchResult.innerHTML="";
let s = searchName.value.toLowerCase();

employees.forEach(emp=>{
let full = `${emp.fname} ${emp.mname} ${emp.lname}`.toLowerCase();
if(full.includes(s)){
searchResult.innerHTML+=`<div>${full}</div>`;
}
});
}

// ID SEARCH
function searchByID(){
searchResult.innerHTML="";
let emp = employees.find(e=>e.id===searchID.value);

searchResult.innerHTML = emp ? `${emp.fname} ${emp.mname} ${emp.lname}` : "Not found";
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
