const multilang = require('../lang.js')

module.exports = function(data){
  let lan = process.env.IDIOMA || 'de'
  console.log(process.env.IDIOMA, lan)
  let lang = multilang[lan]

  let raw = `<!DOCTYPE html>
  <html lang="${lan}" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Simple Ticket - ${lang.login}</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body class="login">
      <h1>${lang.login}</h1>
      <form class="" action="/login" method="post">
        <label for="name">${lang.name}</label><input type="text" name="name" value="" id="name">
        <label for="password">${lang.password}</label><input type="password" name="password" value="">
        <input type="submit" name="submit" value="${lang.login}">
      </form>
    </body>
  </html>
`
return raw
}
