const express = require('express')
const path = require('path')
const bodyParser=require('body-parser')
const PORT = process.env.PORT || 5000
var session=require('express-session')
var app=express()
var mongoose=require('mongoose');
var MongoStore=require('connect-mongo')(session)
var MongoClient = require('mongodb').MongoClient
var schema=require("./schema");
var mongoUrl="mongodb://localhost:27017/data"
var bcrypt = require("bcrypt-nodejs");
//multer
var multer = require('multer');
var http = require('http');
var fs = require('fs');
var url = require('url');
var db=mongoose.connection;
db.on('error',console.error);
db.once('open',function(){
  console.log("Connected to mongod server");
})
mongoose.connect('mongodb://localhost:27017/data');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret:'1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store:new MongoStore({
    url:mongoUrl,
    ttl:60*60*24*7
  })
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/logInpage'))
app.get('/logInpage',(req,res)=>res.render('pages/logInpage'))
app.get('/time',(req, res)=>res.send(showTimes()))
app.get('/signUp',(req, res)=>res.render('pages/signUp'))
app.get('/popup_Proj',(req, res)=>res.render('pages/popup_Proj'))
app.get('/project',(req, res)=>res.render('pages/project'))
var Proj=mongoose.model('Proj',schema.projSchema);
app.post('/popupProj',function(req,res){
  console.log("Project name : ", req.body.Project_name);
  var userproj=new Proj({
    name:req.body.Project_name,
    leader:req.session.userkey,
    user:req.session.userdb
  })
  userproj.save(function(err,userproj){
    if(err) return console.error(err);
    console.dir(userproj);
  })
})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

var User=mongoose.model('User',schema.userSchema);
app.post('/logInReceiver', function (req, res){
  console.log("ID : ", req.body.userID)
  console.log("PW : ", req.body.userPW)
  var uid=req.body.userID;
  var pwd=req.body.userPW;
  User.findOne({'id':uid}).exec(function(err,user){
    console.log(user+"\n");
    if(user==null){
      res.redirect('/logInpage');
    }
    else{
    bcrypt.compare(pwd,user.password,function(err,ret){
      if(err){
        console.log('bcrypt compare error : ',err.message);
      }else{
        console.log(ret);
        if(ret){
          var yname=user.name;
          req.session.userName=yname;
          req.session.userkey=user._id;
          req.session.userdb=user;
          Proj.find({"user":{$elemMatch:{"_id":req.session.userkey}}}).exec(function(err,projList){
            if(err) return console.log(err);
            console.log(projList+"\n");
            if(projList==null){
              res.render("pages/project",{name:req.session.userName, pList:'0'});
            }
            else{
              res.render("pages/project",{name:req.session.userName, pList: projList});
            }
          })
        }
        else{
          res.redirect('/logInpage');
        }
      }
    })
  }
  })
})
app.post('/signUpReceiver', function (req, res){
  console.log("ID : ", req.body.signID)
  console.log("PW : ", req.body.signPW)
  console.log("chkPw : ", req.body.checkPW)
  console.log("Name : ", req.body.signName)
  console.log("E mail : ",req.body.signEmail)
  var userdata=new User({
    id:req.body.signID,
    password:req.body.signPW,
    name:req.body.signName
  })
  userdata.save(function(err,userdata){
    if(err) return console.error(err);
    console.dir(userdata);
  })
  res.render('pages/logInpage')
})
app.get('/selectProjRe',function(req,res){
  console.log("here");
  Proj.find({"user":{$elemMatch:{"_id":req.session.userkey}}}).exec(function(err,projList){
    if(err) return console.log(err);
    var pList1=projList;
    console.log(pList1+"\n");
    if(pList1==null){
      res.render("pages/project",{name:req.session.userName, pList:'0'});
    }
    else{
      res.render("pages/project",{name:req.session.userName, pList:pList1});//pList1});
    }
  })
})
app.get('/mainframe',function (req,res){
  res.render("pages/mainframe",{chk:'0', name:req.session.userName});
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
var _storage = multer.diskStorage({
  destination: function (req,file,cb){
    cb(null, 'uploads/')  //이경로에 저장
  },
  filename: function(req, file, cb) {
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
app.get('/popup_work',function(req,res){
  res.render("pages/popup_work");
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
