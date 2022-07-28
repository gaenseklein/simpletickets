const multilang = require('../lang.js')

module.exports = function(data){
  let lan = process.env.IDIOMA || 'de'
  console.log(process.env.IDIOMA, lan)
  let lang = multilang[lan]

  let raw = `<!DOCTYPE html>
  <html lang="${lan}" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Simple Ticket - ${lang.userpage}</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body class="userpage">
      <div class="header">
        <span class="ticketnr">#${lang.user}</span> |
        <a href="/ticket/all"> ← ${lang.back_to_overview}</a>
      </div>
      <h1>Userpage</h1>
      <form class="" action="/user/change" method="post">
        <input type="hidden" name="uid" value="${data.uid}">
        <label for="name">${lang.name}</label><input type="text" name="name" value="${data.name}" id="name">
        <label for="email">${lang.email}</label><input type="email" name="email" value="${data.email}" id="email">
        <label for="oldpassword">${lang.old_password}</label><input type="password" name="oldpassword" id="oldpassword" value="">
        <label for="password">${lang.new_password}</label><input type="password" name="password" value="" pattern=".{8,}">
        <label for="password2">${lang.repeat_password}</label><input type="password" name="password2" value="" pattern=".{8,}">
        <input type="submit" name="submit" value="${lang.save}">
      </form>
    </body>
  </html>
`
return raw
}
