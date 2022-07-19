/*setup express server*/
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

var simpletickets = {
  tickets:[],
  closedtickets:[],
  user: [],
  maxNID:1,
  init: function(){
    //load old tickets
    let oldraw = fs.readFileSync('./tickets/tickets.json','utf-8')

    let maxNID = fs.readFileSync('./private/maxnid','utf-8')
    this.maxNID = maxNID*1
    try {
      let oldtickets = JSON.parse(oldraw)
      if(Array.isArray(oldtickets)){
        this.tickets = oldtickets
        console.log('loaded',this.tickets.length,'tickets')
      }
      for(let x=0;x<this.tickets.length;x++){
        if(this.tickets[x].nid*1>this.maxNID)this.maxNID=this.tickets[x].nid*1
      }
      fs.writeFileSync('./private/maxnid',''+this.maxNID,'utf-8')

      let oldclosedraw = fs.readFileSync('./tickets/closed.json','utf-8')
      let closed = JSON.parse(oldclosedraw)
      if(Array.isArray(closed)){
        this.closedtickets=closed;
        console.log('loaded',closed.length,'closed tickets');
      }

      let olduserraw = fs.readFileSync('./private/user.json','utf-8')
      let olduser = JSON.parse(olduserraw)
      if(Array.isArray(olduser)){
        this.user = olduser
        console.log('loaded user:',this.user.length);
      }
    } catch (e) {
      console.log('error',e)
    }
  },
  getNidIndex: function(nid){
    for(let x=0;x<this.tickets.length;x++){
      if(this.tickets[x].nid==nid){
        return x
      }
    }
    return -1
  },
  getTicket: function(nid,withcomments){
    //do i need to load it from fs? no, its allready loaded, right?
    let ticket = false
    let x=0
    for(x=0;x<this.tickets.length;x++){
      if(this.tickets[x].nid==nid){
        ticket = this.tickets[x]
        break
      }
    }
    if(ticket==false){
      for(x=0;x<this.closedtickets.length;x++){
        if(this.closedtickets[x].nid==nid){
          ticket = this.closedtickets[x]
          ticket.closed = true
          break
        }
      }
    }
    if(!ticket)return false
    if(!ticket.author){
      let author = this.getUser(ticket.uid)
      if(author)ticket.author=author.name
    }
    if(!withcomments)return ticket
    if(!fs.existsSync('./tickets/comments.'+nid+'.json')){
      console.log('file does not exist','./tickets/comments.'+nid+'.json');
      return {ticket:ticket}
    }
    let craw = fs.readFileSync('./tickets/comments.'+nid+'.json','utf-8')
    try {
      let coms = JSON.parse(craw)
      for(let c=0;c<coms.comments.length;c++){
        if(!coms.comments[c].author && coms.comments[c].uid){
          coms.comments[c].author = this.getUser(coms.comments[c].uid).name
        }
      }
      let sortcoms = this.sortComs(coms)
      return {
        ticket:ticket,
        comments:sortcoms
      }
    } catch (e) {
      console.log('could not load ticket-comments',e)
      return {ticket:ticket}
    }
  },
  sortComs: function(coms){
    let result = []
    console.log(coms);
    let pubdatesort = coms.comments.sort(function(a,b){
      let da = new Date(a.pubdate).getTime()
      let db = new Date(b.pubdate).getTime()
      return db-da;
    })
    function getindex(cid){
      for(let i=0;i<result.length;i++){
        if(result[i].cid==cid)return i
      }
    }
    let x = 0
    let depth = []
    for(x=0;x<pubdatesort.length;x++){
          if(pubdatesort[x].depth==0){
            result.push(pubdatesort[x])
          } else{
            if(!depth[pubdatesort[x].depth])depth[pubdatesort[x].depth]=[pubdatesort[x]]
            else depth[pubdatesort[x].depth].push(pubdatesort[x])
          }
    }
    console.log(depth);
    for(x=1;x<depth.length;x++){
        // depth[x] = depth[x].sort(function(a,b){
        //   let da = new Date(a.pubdate).getTime()
        //   let db = new Date(b.pubdate).getTime()
        //   return db-da;
        // })
        for(let i=0;i<depth[x].length;i++){
          let ind = getindex(depth[x][i].parent)
          result.splice(ind+1,0,depth[x][i])
        }
    }
    console.log(result);
    // return {
    //   nid: coms.nid,
    //   comments:result,
    // }
    return result
  },
  getTickets: function(){
    let list = JSON.parse(JSON.stringify(this.tickets))
    list.sort(function(a,b){return b.pubdate-a.pubdate})
    return list
  },
  createSaveObject: function(ticket, fields){
      let numbers = fields.numbers
      let dates = fields.dates
      let smalltext = fields.smalltext
      let bigtext = fields.bigtext
      let files = fields.files
      let obligatorio = fields.obligatorio
      let obj = {}
      let x=0;
      for(x=0;x<numbers.length;x++){
        if(ticket[numbers[x]]*1==ticket[numbers[x]])obj[numbers[x]]=ticket[numbers[x]]*1
      }
      for(x=0;x<dates.length;x++){
        let d = new Date(ticket[dates[x]])
        if(d.getTime()==d.getTime())obj[dates[x]]=d.getTime()
      }
      for(x=0;x<smalltext.length;x++){
        if(typeof ticket[smalltext[x]]=='string'){
          if(ticket[smalltext[x]].length<255)obj[smalltext[x]]= ticket[smalltext[x]]
          else obj[smalltext[x]]= ticket[smalltext[x]].substring(0,255)
        }
      }
      for(x=0;x<bigtext.length;x++){
        if(typeof ticket[bigtext[x]]=='string')obj[bigtext[x]]=ticket[bigtext[x]]
      }
      for(x=0;x<files.length;x++){
        if(!Array.isArray(ticket[files[x]])){
          console.log(files[x],' is not an array');
          continue;
        }
        let fl = []
        for(let xx=0;xx<ticket[files[x]].length;xx++){
          let f = ticket[files[x]][xx]
          if(typeof f == 'string')fl.push(f)
        }
        obj[files[x]]=fl
      }
      for(x=0;x<obligatorio.length;x++){
        if(!obj[obligatorio[x]] || (Array.isArray(obj[obligatorio[x]]) && obj[obligatorio[x]].length==0))return false;
      }
      if(obj.uid)obj.author = this.getUser(obj.uid).name
      return obj
  },
  createTicket: function(ticket){
    //creates a save object with type-checking for tickets
      //'title', 'uid', 'nid','body', 'assigned_users', 'perc', 'tag','images', 'files', 'related_ticket', 'closed', 'pubdate', 'last_change','comment_count'
      let fields = {
        numbers : ['uid','nid','perc','related_ticket','comment_count'],
        dates : ['pubdate','last_change'],
        smalltext : ['title','tag'],
        smalltextMaxsize : 255,
        bigtext : ['body'],
        files : ['images','files'],
        obligatorio: ['title','uid','body'],
      }
      return this.createSaveObject(ticket, fields)
  },
  createComment: function(comment){
    //creates a save object with type checking for comments
    //commentkeys: ['title', 'uid', 'body', 'depth', 'cid', 'nid', 'parent', 'pubdate', 'files', 'images']
      let fields = {
        numbers : ['uid','nid','cid','depth','parent'],
        dates: ['pubdate'],
        smalltext: ['title'],
        bigtext: ['body'],
        files: ['files','images'],
        obligatorio: ['title','uid','nid','body']
      }
      return this.createSaveObject(comment, fields)
  },
  saveTicket: function(nid,userticket){
    let ticket = this.createTicket(userticket)
    if(!ticket)return false
    let found = false
    for(let x=0;x<this.tickets.length;x++){
      if(this.tickets[x].nid==nid){
        this.tickets[x] = ticket
        found = true
        break
      }
    }
    if(!found)return false
    this.saveTicketsToFS()
    return true
  },
  saveTicketsToFS: function(){
    let txt = JSON.stringify(this.tickets)
    fs.writeFileSync('./tickets/tickets.json',txt,'utf-8')
  },
  saveNewTicket: function(userticket){
    let ticket = this.createTicket(userticket)
    if(!ticket)return false
    this.maxNID++
    ticket.nid=this.maxNID
    this.tickets.push(ticket)
    this.saveTicketsToFS()
  },
  saveNewComment: function(nid,usercomment){
    let ind = this.getNidIndex(nid)
    if(ind==-1)return false
    let comment = this.createComment(usercomment)
    if(!comment)return false
    let obj = {nid:nid,comments:[]}
    let filepath = './tickets/comments.'+nid+'.json'
    if(fs.existsSync(filepath)){
      let raw = fs.readFileSync(filepath,'utf-8')
      try {
        obj = JSON.parse(raw)
      } catch (e) {
        console.log('could not load old comments - moved to .error',e);
        fs.renameSync(filepath,filepath+'.error'+Date.now())
        obj = {nid:nid,comments:[]}
      }
    }
    let maxcid = 0
    for(let x=0;x<obj.comments.length;x++){
      if(maxcid<obj.comments[x].cid*1)maxcid=obj.comments[x].cid*1
    }
    maxcid++
    comment.cid = maxcid
    obj.comments.push(comment)
    let txt = JSON.stringify(obj)
    fs.writeFileSync(filepath,txt,'utf-8')

    this.tickets[ind].last_change = Date.now()
    this.tickets[ind].last_comment_uid = comment.uid
    this.tickets[ind].last_comment_author = this.getUser(comment.uid).name
    this.saveTicketsToFS()
    return true
  },
  closeTicket: function(nid){
    let ind = this.getNidIndex(nid)
    if(ind==-1)return false
    // let closedtickets = []
    // if(fs.existsSync('./tickets/closed.json')){
    //   let raw = fs.readFileSync('./tickets/closed.json','utf-8')
    //   closedtickets = JSON.parse(raw)
    // }
    this.closedtickets.push(this.tickets[ind])
    this.tickets.splice(ind,1)
    fs.writeFileSync('./tickets/closed.json',JSON.stringify(this.closedtickets),'utf-8')
  },
  reopenTicket: function(nid){
    // let closedtickets = []
    // if(fs.existsSync('./tickets/closed.json')){
    //   let raw = fs.readFileSync('./tickets/closed.json','utf-8')
    //   closedtickets = JSON.parse(raw)
    // }
    for (var i = 0; i < this.closedtickets.length; i++) {
      if(this.closedtickets[i].nid==nid){
        this.tickets.push(this.closedtickets[i])
        this.saveTicketsToFS()
        this.closedtickets.splice(i,1)
        fs.writeFileSync('./tickets/closed.json',JSON.stringify(this.closedtickets),'utf-8')
        return true
      }
    }
    return false
  },
  uploadFiles: function(files,filetype,nid){
    let basepath = 'files/'+filetype+'/'
    let d = new Date()
    let timepath = d.getFullYear() +'/'+ d.getMonth()
    let nidpath ='/'+(this.maxNID+1)
    if(nid)nidpath='/'+nid
    let path = basepath + timepath + nidpath
    if(!fs.existsSync(path)){
      fs.mkdirSync(path,{recursive:true});
    }
    // let length = fs.readdirSync(path).length
    let fileurls = []
    try {
      for(let x=0;x<files.length;x++){
        let fname = files[x].filename;
        fname=this.chooseNewName('./'+path+'/',fname);

        if(!fname){
          console.log('filename not allowed?',fname,files[x].filename);
          continue;
        }
        fs.writeFileSync('./'+path+'/'+fname,files[x].data);
        fileurls.push(path+'/'+fname)
      }
      return fileurls
    } catch (e) {
      console.log('uploading files went wrong',e)
      return false
    }
  },
  chooseNewName: function(path,fname){
        let filename = fname.toLowerCase();
        if(filename.length>30)filename=filename.substring(filename.length-30)
        let allowed = 'abcdefghijklmnopqrstuvwxyz0123456789.-';
        let allowedExt='png,jpg,mp3,ogg,gif,avi,mp4,html,mov,zip,mkv,txt,gz,md,pdf';
        for (let x=0;x<filename.length;x++){
          if(allowed.indexOf(filename[x])==-1)filename[x]='-';
        }
        console.log('new filename',filename);
        let ext = filename.substring(filename.lastIndexOf('.')+1);
        if(allowedExt.indexOf(ext)==-1)return false;
        ext='.'+ext;
        if(!fs.existsSync(path+filename))return filename;
        let filen=filename.substring(0,filename.length-ext.length);
        let n=0;
        while(fs.existsSync(path+filen+n+ext)){
          n++;
          if(n==20)filen+='-';
          if(n==30)filen+='--';
          if(n>100)break;
        }
        return filen+n+ext;
    },
    addUser: async function(userdata){
      let userobj = {
        name: userdata.name,
        email: userdata.email,
        uid: userdata.uid,
      }
      userobj.pw = await this.userHashPassword(userdata.password)
      this.user.push(userobj)
      fs.renameSync('./private/user.json','./private/user.json.old'+new Date().toISOString())
      fs.writeFileSync('./private/user.json',JSON.stringify(this.user),'utf-8')
    },
    changeUser: async function(uid, userdata){
      let user = false;
      for (let i = 0; i < this.user.length; i++) {
        if(this.user[i].uid==uid){
          user=this.user[i]
          break
        }
      }
      if(!user)return false
      if(userdata.name)user.name=userdata.name
      if(userdata.email)user.email=userdata.email
      if(userdata.password){
        user.pw = await this.userHashPassword(userdata.password)
      }
      fs.renameSync('./private/user.json','./private/user.json.old'+new Date().toISOString())
      fs.writeFileSync('./private/user.json',JSON.stringify(this.user),'utf-8')
    },
    userHashPassword: async function(password){
      //Hash password:
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password,salt);
      return hashedPassword;
    },
    findUser: function(name, email){
      for (let i = 0; i < this.user.length; i++) {
        if(this.user[i].name==name)return this.user[i]
        if(email && this.user[i].email==email)return this.user[i]
      }
      return false
    },
    getUser: function(uid){
      for (let i = 0; i < this.user.length; i++) {
        if(this.user[i].uid==uid)return this.user[i]
      }
      return false
    },
    userlogin: async function(username, password){
    try {
      let user = this.findUser(username, username)
      if(!user){
        console.log('user not found',username);
        return false;
      }
      console.log('pw, encpw:',password,user.pw,user);
      let validation = await bcrypt.compare(password, user.pw);
      if(!validation){
        console.log('password wrong',username);
        return false;
      }
      const token = jwt.sign({
        uid:user.uid,
        name: user.name,
        ttl: process.env.TOKENTTL,
        }, process.env.TOKEN_SECRET);
      return token;

    } catch (e) {
      console.log(e);
      return false;
    }
  },

}

module.exports = simpletickets;
