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
var fs=require('fs');
//var urlencodedParser = bodyParser.urlencoded({extended: false})

// MongoClient.connect('mongodb://localhost:27017',
//   (err, client)=> {
//     if(err) throw err;
//     var db=client.db('data');
//     console.log(db);
//     //client.close();
// });
// const pool=new Pool({
//   connectionString: process.env.postgresql-cylindrical-95619,
//   ssl: true
// });
var db=mongoose.connection;
db.on('error',console.error);
db.once('open',function(){
  console.log("Connected to mongod server");
})
mongoose.connect('mongodb://localhost:27017/data');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))
var _storage = multer.diskStorage({
  destination: function (req,file,cb){
    cb(null, 'uploads/')  //이경로에 저장
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: _storage});
// app.use(function(req,res,next){
//   req.session.userID=userID;
//   req.session.userPW=userPW;
// })
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
// app.get('/auth/login',function(req,res){
//   // if(req.session.userID=="1234" && req.session.userPW=="1234"){
//   //   req.render('pages/mainframe')
//   // }
//   // else{
//   //   req.render('pages/logInpage')
//   // }
//   if(req.session.count){
//     req.session.count++;
//   }else{
//     req.session.count=1;
//   }
//   res.send('count : '+req.session.count);
// })
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

var User=mongoose.model('User',schema.userSchema);
app.post('/logInReceiver', function (req, res){
  console.log("ID : ", req.body.userID)
  console.log("PW : ", req.body.userPW)
  var uid=req.body.userID;
  var pwd=req.body.userPW;
  User.findOne({'id':uid}).exec(function(err,user){
    var chk=false;
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
          //res.render('pages/mainframe',{chk:'0',name:user.name});
          var yname=user.name;
          req.session.userName=yname;
          res.render('pages/project',{name:req.session.userName});
        }
        else{
          res.redirect('/logInpage');
        }
      }
    })
  }
  })
  //res.render('pages/mainframe')
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
  res.render("pages/project",{name:req.session.userName});
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
app.get('/uploadWin',function(req,res){
  res.render("pages/popup_upload");
});
app.post('/uploadFile',upload.single('userFile'),function(req,res){
  console.log(req.file);
  res.send('Uploaded:'+req.file.filename);
})
app.get('/:file(*)',(req, res) => {
  var file = req.params.file;
  var fileLocation = path.join('./uploads',file);
  console.log(file);
  console.log(fileLocation);
  res.download(fileLocation, file); //경로의 파일을 다운로드
});
// var myController=(req,res)=>{
//   var filename='myFile.ext';
//   var absPath=path.join(__dirname,'uploads/',filename);
//   var relPath=path.join('')
// }

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/logInpage'))
//   .get('/time',(req, res)=>res.send(showTimes()))
//   .get('/db',async(req, res)=>{
//     try{
//       const client = await pool.connect()
//       const result = await client.query('SELECT * FROM test_table');
//       const result = {'results': (result) ? result.rows : null};
//       res.render('pages/db',results);
//       client.release();
//     } catch(err){
//       console.error(err);
//       res.send("Error "+err);
//     }
//   })
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
//   .get('/form_receiver', (req, res)=>{
//     var userID = req.query.userID;
//     var userPW = req.query.userPW;
//     res.send(userID+' '+userPW);
//   })
  
showTimes = () => {
  let result =''
  const times = process.env.TIMES || 5
  for(i=0;i<times;i++){
    result+=i+' '
  }
  return result;
}