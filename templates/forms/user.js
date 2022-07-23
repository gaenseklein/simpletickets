module.exports = function(data){
  let raw = `<!DOCTYPE html>
  <html lang="de" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Simple Ticket - Userpage</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body class="userpage">
      <div class="header">
        <span class="ticketnr">#User</span> |
        <a href="/ticket/all"> ← zurück zur Übersicht</a>
      </div>
      <h1>Userpage</h1>
      <form class="" action="/user/change" method="post">
        <input type="hidden" name="uid" value="${data.uid}">
        <label for="name">name</label><input type="text" name="name" value="${data.name}" id="name">
        <label for="email">email</label><input type="email" name="email" value="${data.email}" id="email">
        <label for="oldpassword">old password</label><input type="password" name="oldpassword" id="oldpassword" value="">
        <label for="password">password</label><input type="password" name="password" value="" pattern=".{8,}">
        <label for="password2">repeat password</label><input type="password" name="password2" value="" pattern=".{8,}">
        <input type="submit" name="submit" value="save">
      </form>
    </body>
  </html>
`
return raw
}
