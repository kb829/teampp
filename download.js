const express = require('express'); // import express js library
const app = express(); //create express js instance
const path = require('path');

// define a route to download a file
app.get('/:file(*)',(req, res) => {
  var file = req.params.file;
  var fileLocation = path.join('./uploads',file);
  console.log(file);
  console.log(fileLocation);
  res.download(fileLocation, file); //경로의 파일을 다운로드
});

app.listen(8000,() => {
  console.log(`application is running at: http://localhost:8000`);
});
