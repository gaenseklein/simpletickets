module.exports = function(original){
  if(!original)return ''
  let x=0
  let txt = original
  let start = -1
  let end = -1
  let middle = -1
  let lines = original.split('\n')
  let ignore = false
  let nobreaklines = []
  for(let l=0;l<lines.length;l++){
    let line = lines[l]
    if(line.substring(0,3)=='```'){
      if(ignore){
        lines[l]='</code>'+lines[l].substring(3)
      }else{
        lines[l]='<code>'+lines[l].substring(3)
      }
      ignore=!ignore
      continue
    }
    if(ignore){
      nobreaklines[l]=true
      continue
    }

    if(line[0]=='#')nobreaklines[l]=true
    if(line.substring(0,3)=='###')line='<h3>'+line.substring(3)+'</h3>'
    if(line.substring(0,2)=='##')line='<h2>'+line.substring(2)+'</h2>'
    if(line[0]=='#')line='<h1>'+line.substring(1)+'</h1>'

    //lists:
    if(line.substring(0,2)=='- '){
      let ignoreTill=-1
      for(x=l;x<lines.length;x++){
        if(x<ignoreTill)continue
        if(lines[x].substring(0,2)=='- '){
          lines[x] = '<li>'+lines[x].substring(2)+'</li>'
          nobreaklines[x]=true
        }else if(lines[x].substring(0,2)=='\t-'){
            console.log('tabline found');
            for(let xx=x;xx<lines.length;xx++){
              if(lines[xx].substring(0,2)=='\t-'){
                lines[xx] = '<li>'+lines[xx].substring(2)+'</li>'
                nobreaklines[xx]=true
              }else{
                lines[x]='<li><ul>'+lines[x]
                lines[xx-1]+='</ul></li>'
                ignoreTill=xx
                break;
              }
            }
        }else{
          lines[l]='<ul>'+lines[l]
          lines[x-1]+='</ul>'
          line=lines[l]
          break;
        }
      }
    }
    if(lines[l].substring(0,2)=='\t-')console.log('tabline',line)
    if(line.substring(0,3)=='-- '){
      console.log('list found');
      let ignoreTill=-1
      for(x=l;x<lines.length;x++){

        if(lines[x].substring(0,3)=='-- '){
          lines[x] = '<li>'+lines[x].substring(3)+'</li>'
        }else{
          console.log('tabline?',lines[x])
          lines[l]='<ul>'+lines[l]
          lines[x-1]+='</ul>'
          line=lines[l]
          break;
        }
      }
    }
    //links:
    middle = line.indexOf('](')
    start = line.lastIndexOf('[',middle)
    end = line.indexOf(')',middle)

    while(start>-1 && middle >-1 && end >-1){
      let url = line.substring(middle+2,end)
      let ltxt = line.substring(start+1,middle)
      console.log(start,middle,end,url,ltxt);
      line = line.substring(0,start)+'<a href="'+url+'">'+ltxt+'</a>'+line.substring(end+1)
      middle = line.indexOf('](',end+11)
      start = line.lastIndexOf('[',middle)
      end = line.indexOf(')',middle)
    }
    lines[l]=line
  }
  for(x=0;x<lines.length;x++)if(!nobreaklines[x])lines[x]+='<br>'
  txt = lines.join('\n')
  //inline **
  return txt
}
