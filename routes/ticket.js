const templates = require('../templates.js');
const fileUpload = require('express-fileupload');
const simpletickets = require('../simpletickets.js')
const router = require('express').Router();

router.get('/add', async (req,res)=>{
      try{
        let result = templates.buildForm('ticket.js',{})
        res.send(result)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});
router.post('/add', fileUpload(),async (req,res)=>{
      try{
        let updobj = {
          title: req.body.title,
          tag: req.body.tags,
          author: req.user.name,
          body:req.body.body,
          uid: req.user.uid,
          related_ticket: req.user.related_ticket,
          pubdate: Date.now(),
          last_change: Date.now(),
        }
        if(req.files)console.log(req.files);
        console.log('ready to update?',updobj);
        let result = 'testing...'

        res.send(result)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});
router.get('/all', async (req,res)=>{
      try{
        let data = simpletickets.getTickets()
        let result = templates.buildPage('list',data)
        res.send(result)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});
router.get('/:nid', async (req,res)=>{
      try{
        let data = simpletickets.getTicket(req.params.nid,true)
        // console.log('data:',data);
        let result = templates.buildPage('ticket',data)
        res.send(result)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});

module.exports = router;
