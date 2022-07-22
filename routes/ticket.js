const templates = require('../templates.js');
const fileUpload = require('express-fileupload');
const simpletickets = require('../simpletickets.js')
const router = require('express').Router();

router.get('/add', async (req,res)=>{
      try{
        let result = templates.buildForm('ticket',{})
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
          related_ticket: req.body.related_ticket,
          pubdate: Date.now(),
          last_change: Date.now(),
        }
        if(req.files){
          // console.log(req.files);
          console.log(Object.keys(req).length,'files found');
          let mimetypes = ['text/plain', 'image/png', 'image/jpeg', 'image/gif', 'application/pdf', 'video/x-matroska', 'video/mp4', 'video/quicktime', 'application/zip', 'text/html', 'text/markdown']
          let imagemimetypes = ['image/png', 'image/jpeg', 'image/gif']
          // let videomimetypes = ['video/x-matroska', 'video/mp4', 'video/quicktime']
          let uploadfiles = []
          let uploadimages = []
          let i=0
          // for(i=0;i<10;i++)req.files['file1'+i]=req.files['image'+i]
          for(i=0;i<10;i++){
            if(!req.files['file'+i])continue
            let file = req.files['file'+i]
            if(mimetypes.indexOf(file.mimetype)==-1){
              console.log('wrong mimetype',file);
              continue
            }
            if(imagemimetypes.indexOf(file.mimetype)>-1){
              uploadimages.push(file)
            }else{
              uploadfiles.push(file)
            }
          }
          updobj.upload = {
            images:uploadimages,
            files:uploadfiles,
          }
        }
        console.log('ready to update?',updobj);
        simpletickets.saveNewTicket(updobj)
        console.log(Object.keys(req.files))
        let result = 'testing...'

        res.send(result)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});
router.post('/addcomment/:nid', fileUpload(),async (req,res)=>{
      try{
        let updobj = {
          title: req.body.title,
          body:req.body.body,
          depth: req.body.depth,
          parent: req.body.parent,
          author: req.user.name,
          uid: req.user.uid,
          nid:req.params.nid,
          pubdate: Date.now(),
        }
        if(req.files){
          // console.log(req.files);
          console.log(Object.keys(req).length,'files found');
          let mimetypes = ['text/plain', 'image/png', 'image/jpeg', 'image/gif', 'application/pdf', 'video/x-matroska', 'video/mp4', 'video/quicktime', 'application/zip', 'text/html', 'text/markdown']
          let imagemimetypes = ['image/png', 'image/jpeg', 'image/gif']
          // let videomimetypes = ['video/x-matroska', 'video/mp4', 'video/quicktime']
          let uploadfiles = []
          let uploadimages = []
          let i=0
          // for(i=0;i<10;i++)req.files['file1'+i]=req.files['image'+i]
          for(i=0;i<10;i++){
            if(!req.files['file'+i])continue
            let file = req.files['file'+i]
            if(mimetypes.indexOf(file.mimetype)==-1){
              console.log('wrong mimetype',file);
              continue
            }
            if(imagemimetypes.indexOf(file.mimetype)>-1){
              uploadimages.push(file)
            }else{
              uploadfiles.push(file)
            }
          }
          updobj.upload = {
            images:uploadimages,
            files:uploadfiles,
          }
        }
        console.log('ready to update?',updobj);
        simpletickets.saveNewComment(req.params.nid,updobj)
        // console.log(Object.keys(req.files))
        let result = 'testing...'
        // res.send(result)
        res.redirect('/ticket/'+req.params.nid)
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

router.get('/closed', async (req,res)=>{
      try{
        let data = simpletickets.getClosedTickets()
        data.closed=true
        let result = templates.buildPage('list',data)
        res.send(result)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});
router.get('/close/:nid', async (req,res)=>{
      try{
        let data = simpletickets.closeTicket(req.params.nid)
        if(!data)return res.status(404).send(req.params.nid+' not found as open ticket. maybe it is closed')
        res.redirect('/ticket/'+req.params.nid)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});
router.get('/reopen/:nid', async (req,res)=>{
      try{
        let data = simpletickets.reopenTicket(req.params.nid)
        if(!data)return res.status(404).send(req.params.nid+' not found as closed ticket. maybe it is open?')
        res.redirect('/ticket/'+req.params.nid)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});
router.get('/:nid', async (req,res)=>{
      try{
        let data = simpletickets.getTicket(req.params.nid,true)
        if(!data)return res.status(404).send('ticket not found '+req.params.nid)
        // console.log('data:',data);
        let result = templates.buildPage('ticket',data)
        res.send(result)
      }catch(e){
        console.log(e)
        res.status(400).send('an error occured')
      }
});
module.exports = router;
