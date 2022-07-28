// const simpletickets = require('simpletickets.js')
const multilang = require('./lang.js')
module.exports = function(data){
  let lan = process.env.IDIOMA || 'de'
  console.log(process.env.IDIOMA, lan)
  let lang = multilang[lan]
  let list = ''
  let listclosed = ''
  let searchdata = data.searchdata || ''
  for(let x=0;x<data.length;x++){
    let pubdate = new Date(data[x].pubdate)
    let pdate = lang.timestring(pubdate)//pubdate.toLocaleString('de')
    pubdate = pubdate.getTime()
    let updated = ''
    let last_change = pubdate
    if(data[x].last_change){
      last_change = new Date(data[x].last_change)
      updated = lang.timestring(last_change)//last_change.toLocaleString('de') + ' Uhr'
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
    let listadd = `    <li class="${cssclass}" tags="${tagstring}" pubdate="${pubdate}" change="${last_change}" nid="${data[x].nid}">
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
            ${pdate} Uhr
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
      if(data[x].closed)listclosed+=listadd
      else list += listadd
  }

  let raw = `<!DOCTYPE html>
  <html lang="${lan}" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>${lang.search_ticket}</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body>
      <h1>${lang.search_ticket}</h1>
      <div class="header">
      <span class="ticketnr">#${lang.search_ticket}</span> |
      <a href="/ticket/all"> ← ${lang.back_to_overview}</a>
      </div>
      <div id="searchwrapper">
        <form class="" action="/ticket/search" method="post">
          <input type="text" name="search" value="${searchdata}">
          <input type="submit" value="${lang.search}">
        </form>
      </div>
      <h2>${lang.open_tickets}</h2>
      <ul class="ticketlist" id="opentickets">
      <li class="listtitle">
        <div class="nid clickable" onclick="ticketman.multisort('nid',true,'opentickets')">
          ${lang.ticket_number}
        </div>
        <div class="title clickable" onclick="ticketman.multisort('title',false,'opentickets')">
          ${lang.title}
        </div>
        <div class="tags clickable">
          <div onclick="tagfilter.classList.toggle('open')">${lang.tags}</div>
          <div id="tagfilter">
          <label for="openticketstagfilterinclude">${lang.include}</label><input id="openticketstagfilterinclude" type="text" onkeyup="ticketman.multifilterTags('opentickets')">
          <label for="openticketstagfilterexclude">${lang.exclude}</label><input id="openticketstagfilterexclude" type="text" onkeyup="ticketman.multifilterTags('opentickets')">
          </div>
        </div>
        <div class="related">
          ${lang.related_ticket}
        </div>
        <div class="pubdate clickable" onclick="ticketman.multisort('pubdate',true,'opentickets')">
          ${lang.published}
        </div>
        <div class="change clickable" onclick="ticketman.multisort('pubdate',true,'opentickets')">
          ${lang.changed}
          <div id="openticketssortshow" class="down">
            <span>⌃</span>
            <span>⌄</span>
          </div>
        </div>
        <div class="commentcount clickable" onclick="ticketman.multisort('commentcount',true,'opentickets')">
          ${lang.comments}
        </div>
        <div class="lastcommented">
          ${lang.last_comment}
        </div>
      </li>
        ${list}
      </ul>
      <h2>${lang.closed_tickets}</h2>
      <ul class="ticketlist" id=closedtickets>
      <li class="listtitle">
        <div class="nid clickable" onclick="ticketman.multisort('nid',true,'closedtickets')">
          ${lang.ticket_number}
        </div>
        <div class="title clickable" onclick="ticketman.multisort('title', false,'closedtickets')">
          ${lang.title}
        </div>
        <div class="tags clickable">
          <div onclick="tagfilter.classList.toggle('open')">tags</div>
          <div id="tagfilterclosed">
          <label for="closedticketstagfilterinclude">must have</label><input id="closedticketstagfilterinclude" type="text" onkeyup="ticketman.multifilterTags('closedtickets')">
          <label for="closedticketstagfilterexclude">exclude</label><input id="closedticketstagfilterexclude" type="text" onkeyup="ticketman.multifilterTags('closedtickets')">
          </div>
        </div>
        <div class="related">
          ${lang.related_ticket}
        </div>
        <div class="pubdate clickable" onclick="ticketman.multisort('pubdate',true,'closedtickets')">
          ${lang.published}
        </div>
        <div class="change clickable" onclick="ticketman.multisort('pubdate',true,'closedtickets')">
          ${lang.changed}
          <div id="closedticketssortshow" class="down">
            <span>⌃</span>
            <span>⌄</span>
          </div>
        </div>
        <div class="commentcount clickable" onclick="ticketman.multisort('commentcount',true,'closedtickets')">
          ${lang.comments}
        </div>
        <div class="lastcommented">
          ${lang.last_comment}
        </div>
      </li>
        ${listclosed}
      </ul>
      <script src="/public/multilistsort.js"></script>
    </body>
  </html>
`
return raw;
}
