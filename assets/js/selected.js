const viewer=document.querySelector('#viewer'),video=viewer.querySelector('video'),content=document.querySelector('#case-content');
let opener;
function openViewer(button){opener=button;const film=button.dataset.film;video.hidden=!film;content.hidden=!!film;document.querySelector('#viewer-title').textContent=film?button.dataset.title:'短剧内容生产工作流';if(film){video.src=film;}viewer.showModal();document.body.style.overflow='hidden';if(film)video.play().catch(()=>{});}
document.querySelectorAll('[data-film],[data-case]').forEach(b=>b.addEventListener('click',()=>openViewer(b)));
viewer.querySelector('.close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
viewer.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load();document.body.style.overflow='';opener?.focus();});
if(window.Splide)new Splide('.splide',{perPage:3,gap:'24px',pagination:false,rewind:false,keyboard:'focused',breakpoints:{900:{perPage:2},600:{perPage:1,padding:{right:'18%'},gap:'18px'}}}).mount();

