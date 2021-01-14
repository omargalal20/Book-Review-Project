const { render } = require('ejs');
var express = require('express');
const { futimes } = require('fs');
var fs = require('fs');
var path = require('path');
var session = require('express-session');
const bodyParser = require('body-parser');
const { Recoverable } = require('repl');
const router = express.Router();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));//to tell where to find file VIEWS
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //Setting where is the folder for images, videos, css files

var sess = {
  secret: 'balabizo',
  saveUninitialized: false,
  resave: false,
  cookie: {}
};
app.use(session(sess));

app.get('/',function(req,res){
  res.render('login', {error: ""});
})

app.get('/dune',function(req,res){
  res.render('dune', {error: ""});
})

app.get('/fiction',function(req,res){
  res.render('fiction');
})

app.get('/flies',function(req,res){
  res.render('flies', {error: ""});
})

app.get('/grapes',function(req,res){
  res.render('grapes', {error: ""});
})

app.get('/home',function(req,res){
  res.render('home');
})

app.get('/leaves',function(req,res){
  res.render('leaves', {error: ""});
})

app.get('/mockingbird',function(req,res){
  res.render('mockingbird', {error: ""});
})

app.get('/novel',function(req,res){
  res.render('novel');
})

app.get('/poetry',function(req,res){
  res.render('poetry');
})



app.get('/registration',function(req,res){
  res.render('registration', {error: ""});
})

app.get('/searchresults',function(req,res){
  res.render('searchresults');
})

app.get('/sun',function(req,res){
  res.render('sun', {error: ""});
})

app.post('/',function(req,res){
  var user = req.body.username;
  var pass = req.body.password;
  var current_users = fs.readFileSync('users.json');
  current_users = JSON.parse(current_users); 
  for (saved_user in current_users){
    if(user.localeCompare(current_users[saved_user].username) === 0 && pass.localeCompare(current_users[saved_user].password) === 0){
      req.session.user=user;
      return res.redirect('/home');
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
    "readList": [],
  } 
  current_users.push(new_user); // [new_user]
  var added_users = JSON.stringify(current_users)
  fs.writeFileSync('users.json', added_users)
  res.redirect('/');
  }
})

app.post('/addtoreadlist', function(req, res){
  title = req.body.title;
  file = req.body.file;
  to_render = file + ".ejs";
  user = req.session.user;
  var current_users = fs.readFileSync('users.json');
  current_users = JSON.parse(current_users); 
  for (saved_user in current_users){
    if(user.localeCompare(current_users[saved_user].username) === 0){
      readList = current_users[saved_user].readList;
      for (pair in readList){
        if (readList[pair].includes(title)){
          return res.render(to_render, {error: "Book already in list"});
        }
      }
      current_users[saved_user].readList.push([title, file]);
      var added_users = JSON.stringify(current_users);
      fs.writeFileSync('users.json', added_users);
      return res.render(to_render, {error: ""});

      }

  }
})

app.get('/readlist', function(req, res){
  user = req.session.user;
  var current_users = fs.readFileSync('users.json');
  current_users = JSON.parse(current_users);
  for (saved_user in current_users){
    if(user.localeCompare(current_users[saved_user].username) === 0){
      var readList = current_users[saved_user].readList;
      return res.render("readlist", {books: readList})
    }
  }
})

app.post('/search', function(req, res){
   search  = req.body.Search.toLowerCase();
   console.log(search);
   var current_books = fs.readFileSync('books.json');
   var searchbooks=[];
   current_books = JSON.parse(current_books);
   for(book in current_books){
     if(current_books[book][0].toLowerCase().includes(search)){
       searchbooks.push(current_books[book]);
     }
   }
   if(searchbooks.length==0){
     return res.render("searchresults",{error: "Book not found",books: searchbooks});
   }

   return res.render("searchresults", {error: "", books: searchbooks})
})




app.listen(process.env.PORT || 3000); //listens to all the requests to the local server



