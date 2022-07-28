// const fs = require('fs')
const templates = require('../templates.js')
const router = require('express').Router();
router.get('/', async (req,res)=>{
      try{

        // let result = fs.readFileSync('./templates/frontpage.html','utf-8')
        let result = templates.buildPage('frontpage')
        res.send(result)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});
module.exports = router;
