module.exports = function(data){
  let raw = `<!DOCTYPE html>
  <html lang="de" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Simple Ticket - Login</title>
      <link rel="stylesheet" href="/public/css/master.css">
    </head>
    <body>
      <h1>Login</h1>
      <form class="" action="/login" method="post">
        <label for="name">name</label><input type="text" name="name" value="" id="name">
        <label for="password">password</label><input type="password" name="password" value="">
        <input type="submit" name="submit" value="log in">
      </form>
    </body>
  </html>
`
return raw
}
