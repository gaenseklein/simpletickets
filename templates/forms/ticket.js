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
  let action = '/user/add/ticket'
  if(data.nid)action = '/user/edit/ticket/'+data.nid
  let raw = `<!DOCTYPE html>
  <html lang="de" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Add Ticket</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body>
      <form class="" action="/ticket/add" method="post">
        <label for="title">Titel</label><input type="text" name="title" id="title" value="${title}" required>
        <label for="tags">Tags</label><input type="text" name="tags" value="${tags}">
        <label for="related">Related Ticket #</label><input type="text" name="related_ticket" value="${related}">
        <label for="body">Body</label>
        <textarea name="body" id="body" rows="8" cols="80" required>${body}</textarea>
        <h3>bilder hinzufügen</h3>
        <div class="fileuploadwrapper">
          <input type="file" name="image0" value="">
          <input type="file" name="image1" value="">
          <input type="file" name="image2" value="">
          <input type="file" name="image3" value="">
          <input type="file" name="image4" value="">
          <input type="file" name="image5" value="">
          <input type="file" name="image6" value="">
          <input type="file" name="image7" value="">
          <input type="file" name="image8" value="">
          <input type="file" name="image9" value="">
        </div>
        <h3>dateien hinzufügen</h3>
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
        <input type="submit" name="" value="">
      </form>
    </body>
  </html>
`
}
