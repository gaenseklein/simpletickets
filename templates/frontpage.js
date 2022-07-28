const multilang = require('./lang.js')

module.exports = function (){
  let lan = process.env.IDIOMA || 'de'
  let welcome = 'willkommen zum einfachen ticketsystem'
  let middletext = 'hier gibts nichts zu sehen'

  if(lan=='es'){
    welcome = 'bienvenido al boletero simple'
    middletext = 'nada que ver por aqui...'
  }
  if(lan=='en'){
    welcome = 'welcome to the simple ticket system'
    middletext = 'nothing to see, please move on'
  }
  let raw = `  <!DOCTYPE html>
    <html lang="${lan}" dir="ltr">
    <head>
    <meta charset="utf-8">
    <title>simple ticketsystem</title>
    </head>
    <body>
    <h1>${welcome}</h1>
    <div class="">
    ${middletext}
    </div>
    <div class="">
    <a href="/login">${multilang[lan].login}</a>
    </div>
    </body>
    </html>
  `
  return raw
}
