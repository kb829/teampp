var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");

var SALT_FACTOR = 10; // 값이 클수록 해시가 안전

//유저스키마 정의
var userSchema = mongoose.Schema({
  //usernum: {type: Number, require: true, unique: true},
  id: {type: String, require: true},
  password: {type: String, require: true},
  name:{type: String, require: true}
});
var noticeSchema = mongoose.Schema({
  name: {type: String, require: true},
  notice: {type: String, require: true}
});
var workSchema = mongoose.Schema({
  name: {type: String, require: true},
  work: {type: String, require: true}
});
var fileSchema = mongoose.Schema({
  name : {type: String, require: true},
  location : {type: String, require: true}
});
var projSchema = mongoose.Schema({
  //projnum: {type: Number, require: true, unique: true},
  name: {type: String, require: true},
  leader: {type: Number, require: true},
  user: [userSchema],
  file: [fileSchema],
  notice: [noticeSchema] ,
  work: [workSchema]
});

var noop = function() {};


userSchema.pre("save",function(done){ //저장되기전에 실행되는 함수

  var user = this;

  if(!user.isModified("password")){ //비밀번호 수정된경우
    return done();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err,salt){ //해시에 대한 salt 생성
    if(err){return done(err);}
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword){
      if(err){return done(err);}
      user.password = hashedPassword; //비밀번호 저장
      done();
    });
  });
});

userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password,function(err, isMatch) {
    done(err, isMatch);
  });
};

userSchema.methods.userid=function(){
  return this.id;
};
userSchema.methods.userpassword=function(){
  return this.password;
};
userSchema.methods.username=function(){
  return this.name;
};

projSchema.methods.projectnum=function(){  
  return this.projnum;
};
projSchema.methods.projectname=function(){ 
  return this.name;
};
projSchema.methods.adduser=function(User){  //유저추가
  this.user.push(User);
  return this.save();
};
projSchema.methods.addnotice=function(Notice){  //공지추가
  this.notice.push(Notice);
  return this.save();
}

noticeSchema.methods.noticename=function(){
  return this.name;
};
noticeSchema.methods.noticedata=function(){
  return this.notice;
};

workSchema.methods.workname=function(){
  return this.name;
};
workSchema.methods.workdata=function(){
  return this.work;
};

fileSchema.methods.fname=function()
{
  return this.name;
};

fileSchema.methods.filelocation=function()
{
  return this.location;
};

var User = mongoose.model("User",userSchema);
var Proj= mongoose.model("Proj",projSchema);
var Notice= mongoose.model("Notice",noticeSchema);
var Work= mongoose.model("Work",workSchema);
var FileS= mongoose.model("File",fileSchema);

module.exports= User;
module.exports= Proj;
module.exports= Notice;
module.exports= Work;
module.exports = FileS;
//module.exports=mongoose.model('User',userSchema);