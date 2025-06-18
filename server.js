//include Express
const express = require('express');
const req = require('express/lib/request');

//includes .env file for credentials
require('dotenv').config();
//manages database connectivity
require('./models/mongoose');

//server will listen on this port
const port = 3000;

//create instance of Express app
const app = express();

//create session data
const session = require('express-session');
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));

//pass session data to routes
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//ejs is templating engine
app.set('view engine','ejs');

//this will allow us to serve up static files, CSS, images & JS
app.use(express.static(__dirname));

//reference test json file
var data = require('./test.json');

//index/home URL
app.get('/',(req,res)=>{
    let title = "Home Page";
    res.render('pages/index',{'title': title});
});

//about URL
app.get('/about',(req,res)=>{
    let title = "About Page";
    res.render('pages/about',{'title': title});
});

//route
app.get('/users',(req,res)=>{
    let title = "Users Page";
    res.render('users/index',{
      'title': title,
      'users': data
    });
});

//add user/view route - we are cheating by using the array index - 1
app.get('/users/view/:id', function(req, res) {
 var title = 'User Page';
 var id = req.params.id;
 res.render('users/view', {
     title: title,
     user: data[--id]
 });
});

app.get('/frogs', (req, res) => {
  res.render('pages/frogs', { title: "Fun Frog Facts" });
});

app.get('/habitat', (req, res) => {
  res.render('pages/habitat', { title: "Frog Habitats" });
});

app.get('/sounds', (req, res) => {
  res.render('pages/sounds', { title: "Frog Sounds" });
});

//all of our recipe routes are now here
const recipeRoutes = require('./routes/recipes');
app.use('/recipes', recipeRoutes);
app.use(express.static('public'));


//Set server to listen for requests
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
  console.log(data);
});