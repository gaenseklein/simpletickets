// const simpletickets = require('simpletickets.js')
const simplemd = require('../simplemd.js')

module.exports = function(data){
  let ticketnid = data.ticket.nid
  let title = data.ticket.title
  let name = data.ticket.author
  let pdate = new Date(data.ticket.pubdate)
  let pubdate = pdate.toLocaleString('de') + " Uhr"
  let tags = ''
  if(data.ticket.tags)tags = data.ticket.tags.join(' , ')
  let body = simplemd(data.ticket.body)
  let x = 0
  let images = ''
  if(data.ticket.images)for(x=0;x<data.ticket.images.length;x++){
    let imgurl = encodeURI(data.ticket.images[x])
    images+=`<img src="/${imgurl}">`
  }
  let files = ''
  if(data.ticket.files)for(x=0;x<data.ticket.files.length;x++){
    let furl = data.ticket.files[x]
    let fname = furl.substring(furl.lastIndexOf('/')+1)
    files+=`<a href="/${furl}" download>${fname}</a>`
  }
  let commentlist = ''
  console.log('comments?',data.comments);
  if(data.comments)for(x=0;x<data.comments.length;x++){
    let ctitle = data.comments[x].title
    let cname = data.comments[x].author
    let cpubdate = new Date(data.comments[x].pubdate).toLocaleString('de')
    let cbody = data.comments[x].body
    let cimages = ''
    if(data.comments[x].images)for(let cx=0;cx<data.comments[x].images.length;cx++)cimages+=`<img src="/${data.comments[x].images[cx]}">`
    let cfiles = ''
    if(data.comments[x].files)for(cx=0;cx<data.comments[x].files.length;cx++){
      let furl = data.comments[x].files[cx]
      let fname = furl.substring(furl.lastIndexOf('/')+1)
      cfiles+=`<a href="/${furl}" download>${fname}</a>`
    }
    let ccss=''
    let cdepth = 0
    if(data.comments[x].depth && data.comments[x].depth*1 > 0){
      ccss+=' depth depth'+data.comments[x].depth
      cdepth = data.comments[x].depth
    }
    commentlist+=`<li id="commentli${data.comments[x].cid}" class="comment${ccss}">
      <h3>${ctitle}</h3>
      <div class="submitted">
        von: ${cname} am: ${cpubdate}
      </div>
      <div class="body">
        ${cbody}
      </div>
      <div class="images">
        <h4>bilder:</h4>
        ${cimages}
      </div>
      <div class="files">
        <h4>dateien:</h4>
        ${cfiles}
      </div>
      <div class="reply">
        <button onclick="moveCommentForm(${data.comments[x].cid},${cdepth})">hier antworten</button>
      </div>
    </li>`
  }
  let related = ''
  if(data.ticket.related_ticket){
    related = `<a href="/ticket/${data.ticket.related_ticket}">related ticket #${data.ticket.related_ticket}</a>`
  }
  let form = `<form id="commentform" class="commentform" action="/ticket/addcomment/${ticketnid}" method="post" enctype="multipart/form-data">
    <input type="hidden" id="commentdepth" name="depth" value="0">
    <input type="hidden" id="commentparent" name="parent">
    <div>
    <label for="commenttitle">title</label>
    <input id="commenttitle" type="text" name="title" value="">
    </div>
    <textarea name="body" rows="8" cols="80"></textarea>
    <h3>bilder und dateien hinzufügen</h3>
    <div class="fileuploadwrapper">
      <input type="file" name="file0" value="">
      <input type="file" name="file1" value="">
      <input type="file" name="file2" value="">
      <input type="file" name="file3" value="">
      <input type="file" name="file4" value="">
      <input type="file" name="file5" value="">
      <input type="file" name="file6" value="">
      <input type="file" name="file7" value="">
      <input type="file" name="file8" value="">
      <input type="file" name="file9" value="">
    </div>
    <input type="submit" value="abschicken">
  </form>`
  let closedheader = ''
  let disabled=''
  let closeoropen = 'close'
  let closeoropentxt= 'close'
  if(data.ticket.closed){
    closedheader=`<div class="closedwarning">ticket is closed</div>`
    disabled = 'disabled'
    form = closedheader
    closeoropen = 'reopen'
    closeoropentxt = 'open'
  }
  let raw = `<!DOCTYPE html>
  <html lang="de" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Ticket #${ticketnid}</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body>
      <div class="header">
      <span class="ticketnr">#${ticketnid}</span> |
      <a href="/ticket/all"> ← zurück zur Übersicht</a>
      </div>
      ${closedheader}
      <h1><span class="title">${title}</span></h1>
      <div class="submitted">
        von: ${name} am: ${pubdate}
      </div>
      <div class="tagswrapper">
        <div class="tags">
          ${tags}
        </div>
        <button class="edittagbutton" type="button" name="button" ${disabled}>edit tags</button>
      </div>
      <div class="body">
        ${body}
      </div>
      <h2>Ticketbilder</h2>
      <div class="imageswrapper">
        ${images}
      </div>
      <h2>Dateien</h2>
      <div class="fileswrapper">
        ${files}
      </div>
      <!-- action tools here? i did not like it that way -->
      <div class="actiontools">
        ${related}
        <button class="edittagbutton" type="button" name="button">edit tags</button>
        <a class="goto" href="#commentform" onclick="commentdownwrapper.appendChild(commentform)">add new comment</a>
        <a class="closebutton" href="/ticket/${closeoropen}/${ticketnid}">${closeoropentxt} this ticket</a>
      </div>
      <h2>Kommentare</h2>
      <ul class="commentlist">
        ${commentlist}
      </ul>
      <div class="actiontools">
        ${related}
        <button class="edittagbutton" type="button" name="button">edit tags</button>
        <button class="closebutton" type="button" name="button">close ticket</button>
      </div>
      <div id="commentdownwrapper">
      <h2>Kommentar hinzufügen</h2>
      ${form}
      </div>
      <script>
      function moveCommentForm(id,depth){
        let li = document.getElementById('commentli'+id)
        if(!li)return
        li.appendChild(commentform)
        commentparent.value=id
        commentdepth.value = depth+1
      }
      </script>
    </body>
  </html>
`
return raw;
}
