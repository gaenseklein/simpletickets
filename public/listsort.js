let ticketman = {
    downward: true,
    actsort: 'change',
    init: function(){
        let lis = document.querySelectorAll('.ticketlist li')
        this.tickets = []
        for(let x=1;x<lis.length;x++)this.tickets.push(lis[x])
        this.ul = document.querySelector('.ticketlist')
    },
    sort: function(by,numeral){
        if(by==this.actsort)this.downward = !this.downward
        this.actsort = by
        this.tickets.sort(function(a,b){
            let aa = a.getAttribute(by)
            let bb = b.getAttribute(by)
            if(!aa && !bb){
                aa=a.querySelector('.'+by).innerText
                bb=b.querySelector('.'+by).innerText
            }
            if(numeral){
                if(ticketman.downward)return bb-aa;
                else return aa-bb;
            }else{
                r=0
                if(aa<bb)r= 1
                else r= -1
                if(ticketman.downward)r*=-1
                return r
            }
        })
        for(let x=0;x<this.tickets.length;x++)this.ul.appendChild(this.tickets[x])
        let targettitle = document.querySelector('.listtitle .'+by)
        targettitle.appendChild(sortshow)
        sortshow.classList.toggle('up',!this.downward)
        sortshow.classList.toggle('down',this.downward)
        this.appendEven()
    },
    appendEven: function(){
      let even = true;
      for(let x=0;x<this.tickets.length;x++){
        if(!this.tickets[x].classList.contains('hide')){
            this.tickets[x].classList.toggle('even',even)
            even = !even;
        }
      }
    },
    filterTags: function(){
        let even = true
        for(let x=0;x<this.tickets.length;x++){
            let tags=this.tickets[x].getAttribute('tags')||''
            let excludelist = tagfilterexclude.value.split(',')
            let includelist = tagfilterinclude.value.split(',')
            let exclude = false
            for(let i=0;i<excludelist.length;i++){
                if(excludelist[i].length==0)continue
                if(tags.indexOf(excludelist[i])>-1){
                    exclude=true
                    break;
                }
            }
            for(let i=0;i<includelist.length;i++){
                if(includelist[i].length==0)continue;
                if(tags.indexOf(includelist[i])>-1){
                    exclude=false
                    break;
                }else{
                    exclude=true
                }
            }
            this.tickets[x].classList.toggle('hide',exclude)
            this.tickets[x].classList.toggle('even',even)
            if(!exclude)even=!even
        }
    },


}
ticketman.init()
