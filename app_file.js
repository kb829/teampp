const express = require('express')
const path = require('path')
const bodyParser=require('body-parser')
const PORT = process.env.PORT || 5000
var app=express()
var MongoClient = require('mongodb').MongoClient;
var urlencodedParser = bodyParser.urlencoded({extended: false});

MongoClient.connect('mongodb://localhost:5000/node_modules/mongodb',
  function (err, db) {
   console.log('connect mongodb success')
   //db.close();
  }
);
// const pool=new Pool({
//   connectionString: process.env.postgresql-cylindrical-95619,
//   ssl: true
// });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/logInpage'))
app.get('/time',(req, res)=>res.send(showTimes()))
app.get('/signUp',(req, res)=>res.render('pages/signUp'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
app.post('/logInReceiver', function (req, res){
  // var userID = req.query.userID;
  // var userPW = req.query.userPW;
  // res.send(userID+' '+userPW);
  console.log("ID : ", req.body.userID)
  console.log("PW", req.body.userPW)
  res.send("hi")
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