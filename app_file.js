const express = require('express')
const path = require('path')
const bodyParser=require('body-parser')
const PORT = process.env.PORT || 5000
var session=require('express-session')
var app=express()
//multer
var multer = require('multer');
var http = require('http');
var fs = require('fs');
var url = require('url');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret:'1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/logInpage'))
app.get('/logInpage',(req,res)=>res.render('pages/logInpage'))
app.get('/time',(req, res)=>res.send(showTimes()))
app.get('/signUp',(req, res)=>res.render('pages/signUp'))
app.get('/popup_Proj',(req, res)=>res.render('pages/popup_Proj'))
app.get('/project',(req, res)=>res.render('pages/project'))
// app.post('/popup_projRe',function(req,res){
//
//   console.log("Project name : ", req.body.Project_name);
// })
app.post('/popupProj',function(req,res){
  projectcnt=projectcnt+1;
  console.log("Project name : ", {proname:req.body.Project_name, projectcnt});
  res.render('pages/project',{proname:req.body.Project_name, projectcnt});
});
var projectcnt=0;
app.get('/popup_projRe',function(req,res){
  projectcnt=projectcnt+1;
  console.log("Project name : ", {projectcnt});
})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.post('/logInReceiver', function (req, res){
  // console.log("ID : ", req.body.userID)
  // console.log("PW : ", req.body.userPW)
  // var adminID='admin';
  // var adminPW='404';
  // var uid=req.body.userID;
  // var pwd=req.body.userPW;
  // req.session.userID=uid;
  // if(uid==adminID && pwd==adminPW){
  //   res.render('pages/adminMain',{name:req.session.userID});
  // }
  // else{
  //   res.render('pages/project', {chk:'0', name:req.session.userID, projectcnt});
  // }
  req.session.userID=req.body.userID;
  if(req.body.userID=='admin'  && req.body.userPW=='404')
  {
    res.render('pages/adminMain',{name:req.session.userID});
  }
  else{

  fs.readFile('data/login.txt', function(err, data) {
    if(err) throw err;
    var array1 = data.toString().split("\n");
    var array2;
    var temp;
    var id;
    var pass;
    var loc;
    for(i in array1) {
      temp= array1[i].indexOf(req.body.userID);
        if(temp!=-1)
        {
           loc = i;
           break;
        }
      }
      array2=array1[loc].toString().split(" ");
      id = array2[0];
      pass = array2[1];
      if((id == req.body.userID) &&(pass ==req.body.userPW) )
      {
        res.render('pages/project', {name:req.session.userID});
      }
    });
  }
})
app.post('/signUpReceiver', function (req, res){
  console.log("ID : ", req.body.signID)
  console.log("PW : ", req.body.signPW)
  console.log("chkPw : ", req.body.checkPW)
  console.log("Name : ", req.body.signName)
  console.log("E mail : ",req.body.signEmail)

  var temp;
  temp = req.body.signID + " "+ req.body.signPW + " "+ req.body.signName +"\n";
  fs.appendFile('data/login.txt', temp, function (err) {
    if (err) throw err;

  });
  res.render('pages/logInpage');
})
app.get('/selectProjRe',function(req,res){
  res.render("pages/project.ejs",{name:req.session.userID, projectcnt});
})
app.get('/mainframe',function (req,res){
  res.render("pages/mainframe",{chk:'0', name:req.session.userID});
})
app.get('/manageVerRe',function(req,res){
  res.render("pages/mainframe",{chk:'1'});
})
app.get('/fileupRe',function(req,res){
  res.render("pages/mainframe",{chk:'2'});
})
app.get('/voteRe',function(req,res){
  res.render("pages/mainframe",{chk:'3'});
})
app.get('/scheduleManageRe',function(req,res){
  res.render("pages/mainframe",{chk:'4'});
})
app.get('/teamManageRe',function(req,res){
  res.render("pages/mainframe",{chk:'5'});
})
app.get('/adminmain',function(req,res){
  res.render()
})
app.get('/adminProjectRe',function(req,res){
  res.render("pages/adminMain",{chk:'1'});
})
app.get('/adminUserRe',function(req,res){
  res.render("pages/adminMain",{chk:'2'});
})
var _storage = multer.diskStorage({
  destination: function (req,file,cb){
    cb(null, 'uploads/')  //이경로에 저장
  },
  filename: function(req, file, cb) {
    req.session.fileoriginname=file.originalname;
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: _storage});
app.get('/uploadWin',function(req,res){
  res.render("pages/popup_upload");
});
app.get('/popup_vote',function(req,res){
  res.render("pages/popup_vote");
});
app.post('/uploadFile',upload.single('userFile'),function(req,res){
  console.log(req.file);
  res.send('Uploaded:'+req.file.filename);
})
  
showTimes = () => {
  let result =''
  const times = process.env.TIMES || 5
  for(i=0;i<times;i++){
    result+=i+' '
  }
  return result;
}