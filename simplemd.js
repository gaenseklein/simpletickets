module.exports = function(original){
  if(!original)return ''
  let x=0
  let txt = original
  let start = -1
  let end = -1
  //titles
  for(x=1;x<4;x++){
    let search = '\n'+'######'.substring(0,x)
    let repbeg = '<h'+(x+2)+'>'
    let repend = '</h'+(x+2)+'>'
    start = txt.indexOf(search)
    end = txt.indexOf('\n',start)
    while(start>-1 && end>-1){
      txt = txt.substring(0,start+1)+repbegin+txt.substring(start+x+1,end)+repend+txt.substring(end)
      start = txt.indexOf(search,end)
      end = txt.indexOf('\n',start)
    }
  }
  //links: (images must be above if we want them)
  middle = txt.indexOf('](')
  start = txt.lastIndexOf('[',middle)
  end = txt.indexOf(')',middle)
  while(start>-1 && middle >-1 && end >-1){
    let url = txt.substring(middle+2,end)
    let ltxt = txt.substring(start+1,middle)
    txt = txt.substring(0,start)+'<a href="'+url+'">'+ltxt+'</a>'+txt.substring(end+1)
    middle = txt.indexOf('](',end)
    start = txt.lastIndexOf('[',middle)
    end = txt.indexOf(')',middle)
  }
  //lists:
  //inline **
  return txt
}
