function ftrim()
{
  var dir = 'uploads';
  var files = fs.readdirSync(dir); // 디렉토리를 읽어온다
  for(var i = 0; i < files.length; i++)
  {
    // files[i] = i번째 파일 file[i] = 파일명 [i]번째
      var file = files[i];
      var point;  //점위치
      list = list + `<li><input type="image" href="/?id=${filelist[i]}" src="1.png" value=" ${filelist[i]}"></li>`;
      console.log(file);
      for(var j=0; j<file.length;j++)
      {
        if(file[j]=='.')
        {
          point=j;
        }
      }
      var suffix = file.substr(file.length - point, file.length); // 확장자 추출
      console.log(suffix);
      if (suffix === '.c')
      {
          fs.readFile(dir + '/' + file,function(err, buf)
          {
              console.log(buf.toString());
          })
      }
      else if(suffix ==='.cpp')
      {
        fs.readFile(dir + '/' + file,function(err, buf)
        {
            console.log(buf.toString());
        })
      }
      else if(suffix ==='.java')
      {
        fs.readFile(dir + '/' + file,function(err, buf)
        {
            console.log(buf.toString());
        })
      }
      else if(suffix ==='.py')
      {
        fs.readFile(dir + '/' + file,function(err, buf)
        {
            console.log(buf.toString());
        })
      }
      else if(suffix==='.html')
      {
        fs.readFile(dir + '/' + file,function(err, buf)
        {
            console.log(buf.toString());
        })
      }
      else if(suffix==='.txt')
      {
        fs.readFile(dir + '/' + file,function(err, buf)
        {
            console.log(buf.toString());
        })
      }
      else if(suffix==='.ejs')
      {
        fs.readFile(dir + '/' + file,function(err, buf)
        {
            console.log(buf.toString());
        })
      }
      else if(suffix==='.css')
      {
        fs.readFile(dir + '/' + file,function(err, buf)
        {
            console.log(buf.toString());
        })
      }
  }
}