var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  req.app.locals.db.collection("users").find().toArray()
  .then(result => {
    console.log(result);

    let printUsers = `
      <div>
        <H1>Alla Användare</H1>
    `;

    for(user in result){
      
        printUsers += 
        `
          <div>
            ${result[user].userName} |||
            ${result[user].email} |||
            ${result[user]._id} |||
            Newsletter: ${result[user].newsLetter}           
          </div>        
        ` 
    }

    printUsers += `</div>`

    res.send(printUsers);    
  })  
});

module.exports = router;
