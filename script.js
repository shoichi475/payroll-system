let employees = [];

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

// VALIDATION (FIXED)
function validate(){

let ok=true;

function err(id,msg){
document.getElementById(id).innerText = msg;
if(msg) ok=false;
}

err("fnameError", fname.value ? "" : "Invalid Input");
err("mnameError", mname.value ? "" : "Invalid Input");
err("lnameError", lname.value ? "" : "Invalid Input");
err("addressError", address.value ? "" : "Invalid Input");
err("idError", id.value ? "" : "Invalid Input");
err("deptError", dept.value ? "" : "Invalid Input");
err("emailError", email.value ? "" : "Invalid Input");
err("numberError", number.value.length===11 ? "" : "Invalid Input");
err("dateError", date.value ? "" : "Invalid Input");
err("rateError", rate.value>0 ? "" : "Invalid Input");
err("hoursError", hours.value>0 ? "" : "Invalid Input");

return ok;
}

// ADD
addForm.addEventListener("submit",e=>{
e.preventDefault();

if(!validate()) return;

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

alert("Saved!");
addForm.reset();
});

// FILE
function renderFile(){

fileList.innerHTML="";

employees.forEach(emp=>{
let salary = emp.rate * emp.hours * 22;

fileList.innerHTML+=`
<pre>
${emp.fname} ${emp.lname}
ID: ${emp.id}
Salary: ₱${salary}
</pre>
`;
});
}

// SEARCH
function searchEmployee(){

searchResult.innerHTML="";

let q = searchBar.value.toLowerCase();

employees.forEach(emp=>{
let salary = emp.rate * emp.hours * 22;

if(
emp.fname.toLowerCase().includes(q) ||
emp.id.includes(q) ||
String(salary).includes(q)
){

searchResult.innerHTML+=`
<pre>
${emp.fname} ${emp.lname}
ID: ${emp.id}
Salary: ₱${salary}
</pre>
`;
}
});
}

// UPDATE
let selected=null;

function findEmployee(){

selected = employees.find(e=>e.id===updateID.value);

if(!selected){
updateMsg.innerText="Not found";
return;
}

editForm.style.display="block";

ufname.value=selected.fname;
umname.value=selected.mname;
ulname.value=selected.lname;
uaddress.value=selected.address;
udept.value=selected.dept;
uemail.value=selected.email;
unumber.value=selected.number;
udate.value=selected.date;
urate.value=selected.rate;
uhours.value=selected.hours;
}

function saveUpdate(){

Object.assign(selected,{
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

alert("Updated!");
}
