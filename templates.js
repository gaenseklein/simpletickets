const raw = {
  // frontpage: require('./templates/frontpage.js'),
  ticket: require('./templates/ticket.js'),
  list: require('./templates/list.js'),
  search: require('./templates/search.js'),
  frontpage: require('./templates/frontpage.js'),
  form:{
    login: require('./templates/forms/login.js'),
    ticket: require('./templates/forms/ticket.js'),
    user: require('./templates/forms/user.js'),
  },
}

const templates = {
  buildPage: function(pagename,data){
    if(raw[pagename])return raw[pagename](data);
  },
  buildForm: function(formname,data){
    if(raw.form[formname]){
      if(data)return raw.form[formname](data);
      else return raw.form[formname]({
        name:'',url:'',description:'',
        email:'',publicEmail:'',redes:[],
        mountpoint:'',_id:''
      })
    }else{
      return this.buildError(404);
    }
  },
  buildError: function (nr){
    return 'oops, something went wrong\n'+nr;
  },

}

module.exports = templates;
