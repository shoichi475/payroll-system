*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial;
}

body{
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:linear-gradient(135deg,#020b1f,#07152f,#0c234b,#102d63);
padding:20px;
}

.container{
width:420px;
padding:40px;
background:rgba(255,255,255,0.05);
border-radius:20px;
text-align:center;
color:white;
}

.logo-circle{
width:100px;
height:100px;
margin:auto;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
background:#1d4ed8;
font-size:35px;
font-weight:bold;
margin-bottom:15px;
}

.menu{
display:flex;
flex-direction:column;
gap:10px;
}

.menu-btn{
padding:12px;
border:none;
border-radius:10px;
background:#153b7a;
color:white;
font-weight:bold;
cursor:pointer;
}

.menu-btn:hover{background:#2563eb}

.exit-btn{background:#7f1d1d}

.form-container{
display:none;
width:500px;
padding:30px;
background:rgba(255,255,255,0.05);
border-radius:20px;
color:white;
text-align:center;
}

input{
width:100%;
margin:5px 0;
padding:10px;
border-radius:8px;
border:none;
}

.submit-btn,.back-btn{
width:100%;
padding:10px;
margin-top:10px;
border:none;
border-radius:10px;
font-weight:bold;
cursor:pointer;
}

.submit-btn{background:#2563eb;color:white}
.back-btn{background:#475569;color:white}

#fileList pre{
text-align:left;
}
