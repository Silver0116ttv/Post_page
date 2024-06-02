import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

var loggedIn = false;
var post ={
  /*
    by:
    desc:
    */
};
var posts = [];
var user = {};
var users = [];
var postStatus = false;
var indexPost = 0;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json());

/*---------------------------------------------------*/
/*----------------------- GET -----------------------*/
/*---------------------------------------------------*/

app.get("/index.js", (req,res)=> {
  res.sendStatus(200);
})
app.get("/", (req,res,next) => {
  if(loggedIn){
    res.render("index.ejs",{
      isLogged: loggedIn,
      posts: posts,
      username: user.name,
      editable: postStatus,
      index: indexPost,
  })
  }else res.render("index.ejs",{
      isLogged: loggedIn,
      posts: posts, 
  })
})

app.get("/login", (req, res, next) =>{
    res.render("login.ejs");
})

app.get("/Sing_up", (req, res, next) =>{
  res.render("singUp.ejs"); 
})

app.get("/logOut", (req, res, next) => {
  loggedIn = false;
  user = {};
  post ={};
  res.redirect("/");
})

/*---------------------------------------------------*/
/*---------------------- POST -----------------------*/
/*---------------------------------------------------*/

app.post("/submit_post", (req, res, next) => {
  
  if(loggedIn && req.body.this_post){
    console.log(req.body);
    post = {
      by: user.name,
      desc: req.body.this_post
    }
    posts.push(post);
  } else if(loggedIn){
    console.log("no hay nada que publicar");
  }
  res.redirect('/');
})



app.post("/submit", (req, res ,next) => {
  //find object match username and password
  let log_user = users.find(user => user.name === req.body.userName.trim() && user.password === req.body.password);

  if(log_user === undefined){
    res.render("login.ejs", {
      message: "Username or password incorrect please retry",
    });
  }else {
    loggedIn = true;
    user = log_user;
    res.redirect('/');
  }
  
 
})

app.post("/Sing_up",(req, res, next) => {

  // quantify same usernames, if more than 1 wont safe new user
  var repeat = users.filter(user => user.name === req.body.newUserName);
  if( repeat.length >= 1){
    res.render("singUp.ejs",{
      message: "This username is already in use, please enter another one",
    })
  }else {
    user = {
      name: req.body.newUserName.trim(),
      password: req.body.newPassword,
    }
    loggedIn = true;
    users.push(user);
    console.log("New user updated");
    console.log(users);
    res.redirect("/");
  }
})
app.post('/setEditable', (req,res,next) => {
  postStatus = true;
  indexPost = parseInt(req.body.index, 10);
  console.log(indexPost);
  res.redirect('/');
})
/*---------------------------------------------------*/
/*---------------------- PUT  -----------------------*/
/*---------------------------------------------------*/

app.patch('/usuario/:id', (req, res, next) => {

  posts.splice(indexPost , 1 , {by: req.body.name, desc: req.body.desc})
  console.log("Element: " + indexPost + " edited.");
  postStatus = false;
  res.redirect('/');
});

app.listen(port,() => {
    console.log(`server running at ${port}`)
})


