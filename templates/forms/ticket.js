// const simpletickets = require('simpletickets.js')

module.exports = function(data){
  let title = data.title || ''
  let tags =  ''
  if(data.tags && data.tags.length>0)tags=data.tags.join(',')
  let related = data.related_ticket || ''
  let body = data.body || ''

  let x = 0
  let filedelete = ""
  let imagedelete = ""
  let action = '/ticket/add'
  let ticketnid = 'neues ticket'
  let closedheader = ''
  if(data.nid){
    action = '/ticket/edit/'+data.nid
    ticketnid = data.nid
    if(data.closed){
      closedheader=`<div class="closedwarning">ticket is closed</div>`
    }
  }
  let raw = `<!DOCTYPE html>
  <html lang="de" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Add Ticket</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body>
    <div class="header">
    <span class="ticketnr">#${ticketnid}</span> |
    <a href="/ticket/all"> ← zurück zur Übersicht</a>
    </div>
    ${closedheader}
      <form class="ticketform" action="${action}" method="post" enctype="multipart/form-data">
        <label for="title">Titel</label><input type="text" name="title" id="title" value="${title}" required>
        <label for="tags">Tags</label><input type="text" name="tags" value="${tags}">
        <label for="related">Related Ticket #</label><input type="number" name="related_ticket" value="${related}">
        <label for="body">Body</label>
        <textarea name="body" id="body" rows="8" cols="80" required>${body}</textarea>
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
        <input type="submit" name="" value="Ticket speichern">
      </form>
    </body>
  </html>
`
return raw
}
