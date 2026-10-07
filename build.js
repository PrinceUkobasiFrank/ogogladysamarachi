// Builds the site: fills index.template.html from content/*.json and copies assets to dist/.
const fs=require('fs'),path=require('path');
const read=f=>JSON.parse(fs.readFileSync(path.join('content',f),'utf8'));
const esc=t=>String(t??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const clean=p=>String(p||'').replace(/^\/+/,'');
const settings=read('settings.json'), ev=read('events.json'), sp=read('speaking.json');

const thumb=f=>{const t=f.replace(/\.(\w+)$/,'-sm.$1');return fs.existsSync(t)?t:f;};
const items=[...sp.items].map((x,i)=>({...x,i})).sort((a,b)=>(+b.year)-(+a.year)||a.i-b.i);
const speaking=items.map(x=>{const f=clean(x.flyer),t=thumb(f);return `        <li>
          <a class="engage" href="${esc(f)}" data-thumb="${esc(t)}">
            <span class="engage__yr">${esc(x.year)}</span>
            <img class="engage__thumb" src="${esc(t)}" alt="" width="88" height="88" loading="lazy" decoding="async">
            <span class="engage__body">
              <strong class="engage__title">${esc(x.title)}</strong>
              <span class="engage__meta">${esc(x.description)}</span>
              <span class="engage__when">${esc(x.when)}</span>
            </span>
            <span class="engage__role">${esc(x.role)}</span>
          </a>
        </li>`}).join('\n');

const none=`<a class="btn" href="#events" onclick="document.getElementById('noEventMsg').hidden=false;return false">${esc(ev.button_label)}</a>
        <p id="noEventMsg" hidden role="status" style="margin-top:1rem;font-weight:600">${esc(ev.empty_title)}. ${esc(ev.empty_text)}</p>`;
const btn=ev.register_link?`<a class="btn" href="${esc(ev.register_link)}" target="_blank" rel="noopener">${esc(ev.button_label)}</a>`:none;
const eventBlock=ev.show_next_event?`<article class="event">
      <div class="event__date on-dark">
        <p class="label">Next event</p>
        <div>
          <p class="event__month">${esc(ev.month)}</p>
          <p class="event__year">${esc(ev.year)}</p>
        </div>
      </div>
      <div class="event__body">
        <h3>${esc(ev.title)}</h3>
        <p>${esc(ev.text)}</p>
        ${btn}
      </div>
    </article>`:`<article class="event"><div class="event__body"><h3>${esc(ev.empty_title)}</h3><p>${esc(ev.empty_text)}</p></div></article>`;

const vals={...settings,...ev};
let html=fs.readFileSync('index.template.html','utf8')
  .replace('{{SPEAKING_ITEMS}}',()=>speaking).replace('{{EVENT_BLOCK}}',()=>eventBlock)
  .replace(/\{\{(\w+)\}\}/g,(m,k)=>k in vals?esc(vals[k]):m);
const left=html.match(/\{\{\w+\}\}/g); if(left) throw new Error('Unfilled: '+left);

fs.rmSync('dist',{recursive:true,force:true}); fs.mkdirSync('dist');
const skip=new Set(['dist','node_modules','.git','build.js','index.template.html','content','netlify.toml','README.md','package.json']);
for(const f of fs.readdirSync('.')) if(!skip.has(f)) fs.cpSync(f,path.join('dist',f),{recursive:true});
fs.writeFileSync('dist/index.html',html);
console.log(`Built: ${items.length} speaking items`);
