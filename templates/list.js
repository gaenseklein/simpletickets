// const simpletickets = require('simpletickets.js')

module.exports = function(data){
  let list = ''
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
    list+=`    <li class="${cssclass}" tags="${tagstring}" pubdate="${pubdate}" change="${last_change}">
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
          <div class="publicdate">
            ${pdate} Uhr
          </div>
          <div class="updated">
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
  let raw = `<!DOCTYPE html>
  <html lang="de" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Offene Tickets</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body>
      <h1>Tickets</h1>
      <a href="/ticket/add">Neues Ticket hinzufügen</a>
      <h2>Offene Tickets</h2>
      <ul class="ticketlist">
      <li class="listtitle">
        <div class="nid">
          ticketnummer
        </div>
        <div class="title">
          titel
        </div>
        <div class="tags">
          tags
        </div>
        <div class="related">
          zugehöriges ticket
        </div>
        <div class="publicdate">
          Veröffentlicht
        </div>
        <div class="updated">
          Änderung
        </div>
        <div class="commentcount">
          Beiträge
        </div>
        <div class="lastcommented">
          Letzter Beitrag
        </div>
      </li>
        ${list}
      </ul>
    </body>
  </html>
`
return raw;
}
