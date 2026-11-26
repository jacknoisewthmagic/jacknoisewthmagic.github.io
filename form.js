(()=>{const f=document.getElementById('jn-form');if(!f)return;
f.addEventListener('submit',async e=>{e.preventDefault();const b=f.querySelector('button'),ok=f.querySelector('.fb-form-ok');b.disabled=true;b.textContent='SENDING...';
try{if(window.JN_FORM_PREVIEW){await new Promise(r=>setTimeout(r,600))}else{const r=await fetch(f.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{method:'POST',headers:{Accept:'application/json'},body:new FormData(f)});if(!r.ok)throw 0}
f.reset();ok.hidden=false;b.textContent='SENT ✓'}catch(_){b.disabled=false;b.textContent='SEND MESSAGE ↗';ok.hidden=false;ok.textContent='Something went wrong. Please email me directly.'}});})();
