const datacontroler = require('../simpletickets.js');
const templates = require('../templates.js');

const router = require('express').Router();
router.get('/', async (req,res)=>{
  try{
    let loginpage = templates.buildForm('login');
    res.send(loginpage);
    return;
  }catch(e){
    console.warn(e);
    res.status(400).send('error');
  }
});
router.post('/', async (req,res)=>{

  try{
    console.log('body:',req.body);
    let token = await datacontroler.userlogin(req.body.name, req.body.password);
     console.log('token:',token,'req.name',req.body.name, req.body.password);
    if(!token){
      res.status(400).send('error on login');
      return;
    }
    res.cookie('jwt', token, {maxAge: 6*60*60*1000});
    res.redirect('/ticket/all')
  }catch(e){
    console.warn(e);
    res.status(400).send('error');
  }
});
router.get('/logout', async (req,res)=>{

  try{
    res.clearCookie('jwt');
    res.redirect('/');
  }catch(e){
    console.warn(e);
    res.status(400).send('error');
  }
});

module.exports = router;
