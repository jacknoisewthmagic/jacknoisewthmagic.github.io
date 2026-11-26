(()=>{const f=document.getElementById('jn-form');if(!f)return;
const mail='apdulrhman4095@icloud.com';
f.addEventListener('submit',async e=>{e.preventDefault();const b=f.querySelector('button'),ok=f.querySelector('.fb-form-ok');b.disabled=true;b.textContent='SENDING...';ok.hidden=true;
try{const r=await fetch(f.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{method:'POST',headers:{Accept:'application/json'},body:new FormData(f)});
let d={};try{d=await r.json()}catch(_){}
/* FormSubmit answers 200 even for refusals and sends success as a string. Only the string/boolean true counts. */
if(!r.ok||String(d.success)!=='true')throw 0;
f.reset();ok.textContent='Thank you. Your message was sent. I will reply by email soon.';ok.hidden=false;b.textContent='SENT ✓'}
catch(_){b.disabled=false;b.textContent='SEND MESSAGE ↗';ok.textContent='Your message was not sent. Please email me directly at '+mail+'.';ok.hidden=false}});})();
