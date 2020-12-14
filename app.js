const { render } = require('ejs');
var express = require('express');
const { futimes } = require('fs');
var fs = require('fs');
var path = require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));//to tell where to find file VIEWS
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //Setting where is the folder for images, videos, css files

app.get('/',function(req,res){
  res.render('login', {error: ""});
})

app.get('/dune',function(req,res){
  res.render('dune');
})

app.get('/fiction',function(req,res){
  res.render('fiction');
})

app.get('/flies',function(req,res){
  res.render('flies');
})

app.get('/grapes',function(req,res){
  res.render('grapes');
})

app.get('/home',function(req,res){
  res.render('home');
})

app.get('/leaves',function(req,res){
  res.render('leaves');
})

app.get('/mockingbird',function(req,res){
  res.render('mockingbird');
})

app.get('/novel',function(req,res){
  res.render('novel');
})

app.get('/poetry',function(req,res){
  res.render('poetry');
})

app.get('/readlist',function(req,res){
  res.render('readlist');
})

app.get('/registration',function(req,res){
  res.render('registration', {error: ""});
})

app.get('/searchresults',function(req,res){
  res.render('searchresults');
})

app.get('/sun',function(req,res){
  res.render('sun');
})

app.post('/',function(req,res){
  var user = req.body.username;
  var pass = req.body.password;
  var current_users = fs.readFileSync('users.json');
  current_users = JSON.parse(current_users); 
  for (saved_user in current_users){
    if(user.localeCompare(current_users[saved_user].username) === 0 && pass.localeCompare(current_users[saved_user].password) === 0){
      res.redirect('/home');
    }
    
  }
    res.render('login', {error: "Incorrect username or password"});
});

app.post('/register', function(req, res){
  var user = req.body.username;
  var pass = req.body.password;
  var flag = false;
  var current_users = fs.readFileSync('users.json');
  current_users = JSON.parse(current_users); 
  for (saved_user in current_users){
    if(user.localeCompare(current_users[saved_user].username) === 0){
      res.render('registration', {error: "Username already taken"});
      flag = true;
      break;
    }
  }
  if(!flag){
  var new_user = {
    "username": user,
    "password": pass,
  } 
  current_users.push(new_user); // [new_user]
  var added_users = JSON.stringify(current_users)
  fs.writeFileSync('users.json', added_users)
  res.redirect('/');
  }
})

app.listen(3000); //listens to all the requests to the local server



