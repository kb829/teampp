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
app.get('/project',(req, res)=>res.render('pages/project'))
app.get('/popup_Pro',(req, res)=>res.render('pages/popup_Pro'))
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
  // var userID = req.query.userID;
  // var userPW = req.query.userPW;
  // res.send(userID+' '+userPW);
  console.log("ID : ", req.body.userID)
  console.log("PW : ", req.body.userPW)
  var uid=req.body.userID;
  var pwd=req.body.userPW;
  // var query={id:req.body.userID};
  // var table=db.collection("Users").findOne({query},function(err,result){
  //   if(err)throw err;
  //   console.log(result);
  //   if(uid===result.id && pwd===result.password){
  //     res.render('pages/mainframe');
  //   }else{
  //     res.send('who are you <a href="/logInpage">login</a>')
  //   }
  // })
  User.findOne({'id':uid}).exec(function(err,user){
    var chk=false;
    console.log(user+"\n");

    bcrypt.compare(pwd,user.password,function(err,ret){
      if(err){
        console.log('bcrypt compare error : ',err.message);
      }else{
        console.log(ret);
        if(ret){
          res.render('pages/mainframe',{chk:'0',name:user.name});
        }
        else{
          res.redirect('/logInpage');
        }
      }
    })
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
    usernum:'1',
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

app.get('/manageVerRe',function(req,res){
  res.render("pages/mainframe",{chk:'1'});
//   var lis='';
//   for(var i=0;i<5;++i){
//     lis+='<li>coding '+i+'</li>';
//   }
//   var output=`
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <meta charset="utf-8">
//     </head>
//     <body>
//       hello Dynamic html~~!
//           <ul>
//               ${lis} <!--문자열 내에서 변수 사용-->
//           </ul>
//     </body>
//   </html>
//   `;
// res.send(output);
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
app.post('/popupPro', function (req, res){
  console.log("Project_name : ", req.body.Project_name)
})
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
