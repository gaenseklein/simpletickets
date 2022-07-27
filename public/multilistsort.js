let ticketman = {
    downward: true,
    actsort: 'change',
    listId: '',
    init: function(ids){
        if(ids)this.listId='#'+ids[0]
        this.listIds = ids
        this.multilists = {}
        this.multiul = {}
        this.multisortshow = {}
        for(let x=0;x<ids.length;x++){
          this.multilists[ids[x]]=[]
          let lis = document.querySelectorAll(`#${ids[x]}.ticketlist li`)
          for(let xx=1;xx<lis.length;xx++)this.multilists[ids[x]].push(lis[xx])
          this.multiul[ids[x]]= document.querySelector(`#${ids[x]}.ticketlist`)
          this.multisortshow[ids[x]]=document.querySelector('#'+ids[x]+'sortshow')
        }
        this.tickets = this.multilists[this.listIds[0]]
        this.ul = this.multiul[this.listIds[0]]
        this.sortshow = this.multisortshow[this.listIds[0]]
    },
    multisort: function(by,numeral, target){
      this.listId='#'+target
      this.tickets = this.multilists[target]
      this.ul = this.multiul[target]
      this.sortshow = this.multisortshow[target]
      return this.sort(by,numeral)
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
        let targettitle = document.querySelector(this.listId+' .listtitle .'+by)
        targettitle.appendChild(this.sortshow)
        this.sortshow.classList.toggle('up',!this.downward)
        this.sortshow.classList.toggle('down',this.downward)
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
    multifilterTags: function(target){
      this.listId='#'+target
      this.tickets = this.multilists[target]
      this.ul = this.multiul[target]
      this.tagfilterexclude=document.getElementById(target+'tagfilterexclude')
      this.tagfilterinclude=document.getElementById(target+'tagfilterinclude')
      return this.filterTags()
    },
    filterTags: function(){
        let even = true
        for(let x=0;x<this.tickets.length;x++){
            let tags=this.tickets[x].getAttribute('tags')||''
            let excludelist = this.tagfilterexclude.value.split(',')
            let includelist = this.tagfilterinclude.value.split(',')
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
ticketman.init(['opentickets','closedtickets'])
