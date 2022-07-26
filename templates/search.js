// const simpletickets = require('simpletickets.js')

module.exports = function(data){
  let list = ''
  let listclosed = ''
  let searchdata = data.searchdata || ''
  for(let x=0;x<data.length;x++){
    let pubdate = new Date(data[x].pubdate)
    let pdate = pubdate.toLocaleString('de')
    pubdate = pubdate.getTime()
    let updated = ''
    let last_change = pubdate
    if(data[x].last_change){
      last_change = new Date(data[x].last_change)
      updated = last_change.toLocaleString('de') + ' Uhr'
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
  <html lang="de" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Ticketsuche</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body>
      <h1>Ticketsuche</h1>
      <div class="header">
      <span class="ticketnr">#search</span> |
      <a href="/ticket/all"> ← zurück zur Übersicht</a>
      </div>
      <div id="searchwrapper">
        <form class="" action="/ticket/search" method="post">
          <input type="text" name="search" value="${searchdata}">
          <input type="submit" value="suchen">
        </form>
      </div>
      <h2>Offene Tickets</h2>
      <ul class="ticketlist" id="opentickets">
      <li class="listtitle">
        <div class="nid clickable" onclick="ticketman.sort('nid',true)">
          ticketnummer
        </div>
        <div class="title clickable" onclick="ticketman.sort('title')">
          titel
        </div>
        <div class="tags clickable">
          <div onclick="tagfilter.classList.toggle('open')">tags</div>
          <div id="tagfilter">
          <label for="tagfilterinclude">must have</label><input id="tagfilterinclude" type="text" onkeyup="ticketman.filterTags()">
          <label for="tagfilterinclude">exclude</label><input id="tagfilterexclude" type="text" onkeyup="ticketman.filterTags()">
          </div>
        </div>
        <div class="related">
          zugehöriges ticket
        </div>
        <div class="pubdate clickable" onclick="ticketman.sort('pubdate',true)">
          Veröffentlicht
        </div>
        <div class="change clickable" onclick="ticketman.sort('pubdate',true)">
          Änderung
          <div id="sortshow" class="down">
            <span>⌃</span>
            <span>⌄</span>
          </div>
        </div>
        <div class="commentcount clickable" onclick="ticketman.sort('commentcount',true)">
          Beiträge
        </div>
        <div class="lastcommented">
          Letzter Beitrag
        </div>
      </li>
        ${list}
      </ul>
      <h2>Geschlossene Tickets</h2>
      <ul class="ticketlist" id=closedtickets>
      <li class="listtitle">
        <div class="nid clickable" onclick="ticketman.sort('nid',true)">
          ticketnummer
        </div>
        <div class="title clickable" onclick="ticketman.sort('title')">
          titel
        </div>
        <div class="tags clickable">
          <div onclick="tagfilter.classList.toggle('open')">tags</div>
          <div id="tagfilter">
          <label for="tagfilterinclude">must have</label><input id="tagfilterinclude" type="text" onkeyup="ticketman.filterTags()">
          <label for="tagfilterinclude">exclude</label><input id="tagfilterexclude" type="text" onkeyup="ticketman.filterTags()">
          </div>
        </div>
        <div class="related">
          zugehöriges ticket
        </div>
        <div class="pubdate clickable" onclick="ticketman.sort('pubdate',true)">
          Veröffentlicht
        </div>
        <div class="change clickable" onclick="ticketman.sort('pubdate',true)">
          Änderung
          <div id="sortshow" class="down">
            <span>⌃</span>
            <span>⌄</span>
          </div>
        </div>
        <div class="commentcount clickable" onclick="ticketman.sort('commentcount',true)">
          Beiträge
        </div>
        <div class="lastcommented">
          Letzter Beitrag
        </div>
      </li>
        ${listclosed}
      </ul>
      <script src="/public/listsort.js"></script>
    </body>
  </html>
`
return raw;
}
