var express = require('express');
var router = express.Router();
const cors = require('cors');
const asyncHandler = require('express-async-handler');
const { ObjectId } = require('mongodb');

router.use(cors({
  origin: "*"
}))

//Users list
router.get('/', function(req, res) {

  req.app.locals.db.collection("users").find().toArray()
  .then(result => {
    console.log(result);
    
    res.json(result);

  })  
});


//Create user
router.post('/newuser', asyncHandler(async (req, res) => {

  const users = req.app.locals.db.collection("users");

  let user = {
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    newsLetter: req.body.newsLetter
  }

  let userName = user.userName
  const existingUser = await users.findOne({userName})
  

  if(existingUser) {

    console.log(existingUser);
    res.status(400); 
    throw new Error("User exists already!")
    
  } else {

    users.insertOne(user)
      .then(result => {
        console.log(result);   
      res.redirect("/users")
    })

  }

}));


//Authorize user for login
router.post('/login', asyncHandler(async (req, res) => {

  const users = req.app.locals.db.collection("users");

  let userCredentials = {
    userName: req.body.userName,    
    password: req.body.password
  }

  let userName = userCredentials.userName
  const existingUser = await users.findOne({userName})

  if (
      existingUser.userName === userCredentials.userName && 
      existingUser.password === userCredentials.password
    ) {

      res.json({
        _id: existingUser._id,
        userName: existingUser.userName,
        email: existingUser.email,
        newsLetter: existingUser.newsLetter
      })
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }

}));


//Logged in user info
router.post('/userinfo', asyncHandler(async (req, res) => {

  const users = req.app.locals.db.collection("users");

  let userID = {
    _id: req.body._id
  }

  let ID = userID._id
  const existingUser = await users.findOne({_id: ObjectId(ID)})

  if (existingUser._id.toString() === ID) {
      res.json({        
        userName: existingUser.userName,
        email: existingUser.email,
        newsLetter: existingUser.newsLetter
      })

  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }

}));


//Change newsletter status
router.patch('/changenewsletter', asyncHandler(async (req, res) => {

  const users = req.app.locals.db.collection("users");

  let userID = {
    _id: req.body._id
  }

  let news = {
    newsLetter: req.body.newsLetter
  }

  let ID = userID._id
  const existingUser = await users.findOne({_id: ObjectId(ID)})
  console.log(news.newsLetter);

  if (existingUser._id.toString() === ID) {
      users.updateOne({_id: ObjectId(ID)}, {$set:{newsLetter: news.newsLetter}})
      .then(result => {
        console.log(existingUser._id.toString());
        console.log(ID);
        console.log(result);
      })
      res.json({
        newsLetter: existingUser.newsLetter
      })
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }

}));


module.exports = router;
