// const simpletickets = require('simpletickets.js')

const multilang = require('./lang.js')

module.exports = function(data){
  let lan = process.env.IDIOMA || 'de'
  console.log(process.env.IDIOMA, lan)
  let lang = multilang[lan]
  let list = ''
  for(let x=0;x<data.length;x++){
    let pubdate = new Date(data[x].pubdate)
    let pdate = lang.timestring(pubdate)//pubdate.toLocaleString('de')
    pubdate = pubdate.getTime()
    let updated = ''
    let last_change = pubdate
    if(data[x].last_change){
      last_change = new Date(data[x].last_change)
      updated = lang.timestring(last_change) //.toLocaleString('de') + ' Uhr'
      last_change = last_change.getTime()
    }
    let lastauthor = ''
    if(data[x].last_comment_author)lastauthor = data[x].last_comment_author//simpletickets.getUser(data[x].last_comment_uid).name
    let commentcount = data[x].comment_count || 0
    let cssclass=""
    let tagstring = ""
    let tagstring2 = ""
    if(data[x].tags){
      tagstring = data[x].tags.join(',')
      tagstring2 = data[x].tags.join(' , ')
    }
    if(x%2==0)cssclass+="even"
    rellink = ''
    if(data[x].related_ticket)rellink = `<a href="/ticket/${data[x].related_ticket}">#${data[x].related_ticket}</a>`
    list+=`    <li class="${cssclass}" tags="${tagstring}" pubdate="${pubdate}" change="${last_change}" nid="${data[x].nid}">
          <div class="nid">
            #${data[x].nid}
          </div>
          <div class="title">
            <a href="/ticket/${data[x].nid}">
            ${data[x].title}
            </a>
          </div>
          <div class="tags">
            ${tagstring2}
          </div>
          <div class="related">
            ${rellink}
          </div>
          <div class="pubdate">
            ${pdate}
          </div>
          <div class="change">
            ${updated}
          </div>
          <div class="commentcount">
            ${commentcount}
          </div>
          <div class="lastcommented">
            ${lastauthor}
          </div>
        </li>`
  }
  let offene = lang.open_tickets
  let closedlink='closed'
  let closedlinktxt = lang.list_closed_tickets
  if(data.closed){
    offene = lang.closed_tickets
    closedlink = 'all'
    closedlinktxt = lang.list_open_tickets
  }
  let raw = `<!DOCTYPE html>
  <html lang="${lan}" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>${offene}</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body>
      <h1>Tickets</h1>
      <div class="smallheader">
      <span class="ticketspan">
      <a href="/ticket/add">${lang.add_new_ticket}</a>
      <a href="/ticket/${closedlink}">${closedlinktxt}</a>
      <a href="/ticket/search">${lang.search_ticket}</a>
      </span>
      <span class="userspan">
      <a href="/user">${lang.change_user}</a>
      <a class="logoutlink" href="/login/logout">${lang.log_out}</a>
      </span>
      </div>
      <h2>${offene}</h2>
      <ul class="ticketlist">
      <li class="listtitle">
        <div class="nid clickable" onclick="ticketman.sort('nid',true)">
          ${lang.ticket_number}
        </div>
        <div class="title clickable" onclick="ticketman.sort('title')">
          ${lang.title}
        </div>
        <div class="tags clickable">
          <div onclick="tagfilter.classList.toggle('open')">${lang.tags}</div>
          <div id="tagfilter">
          <label for="tagfilterinclude">${lang.include}</label><input id="tagfilterinclude" type="text" onkeyup="ticketman.filterTags()">
          <label for="tagfilterinclude">${lang.exclude}</label><input id="tagfilterexclude" type="text" onkeyup="ticketman.filterTags()">
          </div>
        </div>
        <div class="related">
          ${lang.related_ticket}
        </div>
        <div class="pubdate clickable" onclick="ticketman.sort('pubdate',true)">
          ${lang.published}
        </div>
        <div class="change clickable" onclick="ticketman.sort('pubdate',true)">
          ${lang.changed}
          <div id="sortshow" class="down">
            <span>⌃</span>
            <span>⌄</span>
          </div>
        </div>
        <div class="commentcount clickable" onclick="ticketman.sort('commentcount',true)">
          ${lang.comments}
        </div>
        <div class="lastcommented">
          ${lang.last_comment}
        </div>
      </li>
        ${list}
      </ul>
      <script src="/public/listsort.js"></script>
    </body>
  </html>
`
return raw;
}
