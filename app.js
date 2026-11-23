(() => {
 const cards=[...document.querySelectorAll('.jn-art')];
 if(!cards.length)return;
 const panel=document.createElement('div');panel.className='jn-lightbox';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Full artwork');
 panel.innerHTML='<button class="jn-lightbox-close" aria-label="Close artwork">Close ×</button><button class="jn-lightbox-prev" aria-label="Previous artwork">←</button><img alt=""><button class="jn-lightbox-next" aria-label="Next artwork">→</button><span class="jn-lightbox-count"></span>';
 document.body.append(panel);let index=0,previous;
 const img=panel.querySelector('img'),count=panel.querySelector('span');img.src=cards[0].querySelector('img').src;img.alt=cards[0].querySelector('img').alt;
 function show(i){index=(i+cards.length)%cards.length;const source=cards[index].querySelector('img');img.src=source.src;img.alt=source.alt;count.textContent=`${index+1} / ${cards.length}`;}
 function close(){panel.hidden=true;document.body.style.overflow='';previous?.focus();}
 cards.forEach((card,i)=>card.addEventListener('click',()=>{previous=card;show(i);panel.hidden=false;document.body.style.overflow='hidden';panel.querySelector('button').focus();}));
 panel.querySelector('.jn-lightbox-close').addEventListener('click',close);panel.querySelector('.jn-lightbox-prev').addEventListener('click',()=>show(index-1));panel.querySelector('.jn-lightbox-next').addEventListener('click',()=>show(index+1));
 panel.addEventListener('click',e=>{if(e.target===panel)close();});
 document.addEventListener('keydown',e=>{if(panel.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1);if(e.key==='Tab'){const buttons=[...panel.querySelectorAll('button')];const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault();}}});
})();
