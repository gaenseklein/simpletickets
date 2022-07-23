const templates = require('../templates.js');
const simpletickets = require('../simpletickets.js')
const router = require('express').Router();

router.get('/', async (req,res)=>{
      try{
        let data = simpletickets.getUser(req.user.uid)

        let result = templates.buildForm('user',data)

        res.send(result)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});
router.post('/change', async (req,res)=>{
      try{
        console.log('change:',req.body);
        let userdata = {
          name:req.body.name,
          email:req.body.email,
        }
        if(req.body.password &&
          req.body.password2 &&
          req.body.oldpassword &&
          simpletickets.userlogin(req.user.name,req.body.oldpassword) &&
          req.body.password==req.body.password2 &&
          req.body.password.length>7){
            userdata.password=req.body.password
          }
        let result = simpletickets.changeUser(req.user.uid,userdata)

        res.redirect('/ticket/all')
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});

module.exports = router;
