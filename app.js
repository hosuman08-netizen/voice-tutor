
/* LEGION_WAVE_20_today_counter */
try{var _dk=new Date().toDateString();var _o=JSON.parse(localStorage.getItem('lw_p28_voice_sk_today_counter')||'{}');if(_o.d!==_dk)_o={d:_dk,n:0};_o.n=(_o.n||0)+1;localStorage.setItem('lw_p28_voice_sk_today_counter',JSON.stringify(_o));}catch(e){}

(function(){
  var root=document.getElementById('app');
  var lines=['Nice to meet you.','How was your day?','Could you say that again?','I will practice every day.','Let us ship it today.','Be like water.','One more rep.','Practice makes progress.','I am getting better.','See you tomorrow.','Speak slowly and clearly.','정진 is every day.'];
  var i=0, left=0, timer=null;
  function dayKey(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
  function loadPin(){try{return JSON.parse(localStorage.getItem('vst_pins')||'[]');}catch(e){return[];}}
  function savePin(p){try{localStorage.setItem('vst_pins',JSON.stringify(p.slice(0,12)));}catch(e){}}
  function todayBest(){
    try{
      var k='vst_day_'+dayKey();
      var d=JSON.parse(localStorage.getItem(k)||'{"n":0,"best":0}');
      return d;
    }catch(e){return{n:0,best:0};}
  }
  function bumpToday(sec){
    try{
      var k='vst_day_'+dayKey();
      var d=JSON.parse(localStorage.getItem(k)||'{"n":0,"best":0}');
      d.n=(d.n||0)+1;
      d.best=Math.max(d.best||0,sec||30);
      localStorage.setItem(k,JSON.stringify(d));
      return d;
    }catch(e){return{n:0,best:0};}
  }
  function weekPractice(){
    var out=[];
    for(var i=6;i>=0;i--){
      var d=new Date(); d.setDate(d.getDate()-i);
      var k=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
      try{ out.push(JSON.parse(localStorage.getItem('vst_day_'+k)||'{"n":0}').n||0); }
      catch(e){ out.push(0); }
    }
    return out;
  }
  function render(){
    var sc=0;try{sc=(JSON.parse(localStorage.getItem('vst_streak')||'{}').count)||0}catch(e){}
    var sess=+(localStorage.getItem('vst_sessions')||0);
    var pins=loadPin();
    var td=todayBest();
    var custom0=JSON.parse(localStorage.getItem('vst_custom')||'[]'); var all0=lines.concat(custom0); if(i>=all0.length)i=0; var pinned=pins.indexOf(all0[i])>=0;
    var best=+(localStorage.getItem('vst_best')||0);
    var custom=JSON.parse(localStorage.getItem('vst_custom')||'[]');
    var allLines=lines.concat(custom);
    if(i>=allLines.length) i=0;
    var goal=3, gPct=Math.min(100,Math.round((td.n||0)/goal*100));
    var wp=weekPractice(), mx=Math.max.apply(null,wp.concat([1]));
    var active=wp.filter(function(n){return n>0;}).length;
    root.innerHTML='<div class="card"><p class="sub">문장 '+allLines.length+' · 🔥'+sc+'일'+(best?' · 최장 '+best:'')+' · 세션 '+sess
      +' · 오늘 '+(td.n||0)+'/'+goal+' · 7일 활동일 '+active+' · 진행 '+(i+1)+'/'+allLines.length+'</p>'
      +'<div style="height:6px;background:#1c1826;border-radius:4px;margin:8px 0;overflow:hidden"><i style="display:block;height:100%;width:'+gPct+'%;background:linear-gradient(90deg,#67e8f9,#e0b552)"></i></div>'
      +'<div style="display:flex;align-items:flex-end;gap:3px;height:28px;margin-bottom:8px">'+wp.map(function(n){var h=Math.max(3,Math.round(n/mx*24));return '<div style="flex:1;height:'+h+'px;background:'+(n>0?'#67e8f9':'#2a2438')+';border-radius:2px"></div>';}).join('')+'</div>'
      +'<div style="font-size:18px;min-height:48px" id="line">'+(pinned?'📌 ':'')+allLines[i]+'</div>'
      +'<div style="font-size:28px;margin:12px 0" id="cd">30</div>'
      +'<div class="row"><button id="start">30초</button><button class="sec" id="start15">15초</button><button class="sec" id="next">다음</button>'
      +'<button class="sec" id="pin">'+(pinned?'핀 해제':'핀')+'</button></div>'
      +'<div class="row" style="margin-top:8px"><input id="customLine" placeholder="내 문장 추가" style="flex:1"/><button class="sec" id="addLine">+</button></div>'
      +(pins.length?'<p class="sub" style="margin-top:10px">핀 '+pins.length+' · 탭 점프</p><div id="pinList" class="row" style="flex-wrap:wrap;gap:6px"></div>':'')
      +'</div>';
    document.getElementById('next').onclick=function(){try{localStorage.setItem('vst_skips',(+(localStorage.getItem('vst_skips')||0))+1);}catch(e){} i=(i+1)%allLines.length;render();};
    document.getElementById('pin').onclick=function(){
      var p=loadPin(); var line=allLines[i]; var ix=p.indexOf(line);
      if(ix>=0) p.splice(ix,1); else p.unshift(line);
      savePin(p); render();
      try{legionTrack('pin',{on:ix<0})}catch(e){}
    };
    document.getElementById('addLine').onclick=function(){
      var v=(document.getElementById('customLine').value||'').trim();
      if(!v)return;
      custom.unshift(v); localStorage.setItem('vst_custom',JSON.stringify(custom.slice(0,20)));
      i=0; render(); try{legionTrack('custom_line',{})}catch(e){}
    };
    var pl=document.getElementById('pinList');
    if(pl){
      pl.innerHTML=pins.map(function(t,idx){
        return '<button class="sec" data-p="'+idx+'" style="padding:6px 8px;font-size:12px">'+(t.length>22?t.slice(0,20)+'…':t)+'</button>';
      }).join('');
      Array.prototype.forEach.call(pl.querySelectorAll('[data-p]'),function(b){
        b.onclick=function(){
          var t=pins[+b.getAttribute('data-p')];
          var j=allLines.indexOf(t);
          if(j>=0){i=j;render();}
        };
      });
    }
    function runTimer(sec){
      left=sec; clearInterval(timer); document.getElementById('cd').textContent=left;
      timer=setInterval(function(){
        left--; var el=document.getElementById('cd'); if(el) el.textContent=left;
        if(left<=0){
          clearInterval(timer);
          try{localStorage.setItem('vst_sessions', (+(localStorage.getItem('vst_sessions')||0))+1);}catch(e){}
          bumpToday(sec);
          i=(i+1)%allLines.length;
          try{var k='vst_streak';var d=JSON.parse(localStorage.getItem(k)||'{}');var t=new Date().toDateString();
            if(d.last!==t){d.count=(d.last===new Date(Date.now()-864e5).toDateString()?(d.count||0)+1:1);d.last=t; var bestN=+(localStorage.getItem('vst_best')||0); if(d.count>bestN)localStorage.setItem('vst_best',d.count); localStorage.setItem(k,JSON.stringify(d));}
          }catch(e){}
          try{legionTrack('activate',{sec:sec})}catch(e){}
          render();
        }
      },1000);
    }
    document.getElementById('start').onclick=function(){runTimer(30);};
    document.getElementById('start15').onclick=function(){runTimer(15);};
  }
  try{legionTrack('session_start',{})}catch(e){}
  render();

  (function(){try{
    if(document.getElementById('moneyPipe'))return;
    var d=document.createElement('div');
    d.innerHTML='\n<div id="moneyPipe" style="margin-top:12px;padding:10px;border:1px solid #c5a46e44;border-radius:12px;background:#16121c;text-align:center;font-size:12px">\n  <div style="color:#e0b552;font-weight:700;margin-bottom:4px">💎 후원 · 파이프 (엔터 18+)</div>\n  <p style="opacity:.75;margin:0 0 6px">가상 체험 · 실결제 백엔드 없음 · 문의만</p>\n  <a style="color:#ece8f1;margin:0 6px" href="mailto:hoyashi95@gmail.com?subject=%5BLegion%5D%20support">☕ 후원 문의</a>\n  <a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=pipe&utm_medium=app">🎮 Arcade</a>\n</div>\n';
    var app=document.getElementById('app')||document.body;
    app.appendChild(d.firstElementChild||d);
    try{legionTrack('money_pipe_shown',{app:'auto'})}catch(e){}
  }catch(e){}})();


/* LEGION_WAVE_65_fomo_chip */
setTimeout(function(){try{if(document.getElementById('lw_fomo_65'))return;var end=new Date(); end.setHours(24,0,0,0);var ms=Math.max(0,end-Date.now());var h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000);var d=document.createElement('div'); d.id='lw_fomo_65';d.style.cssText='font-size:11px;opacity:.75;margin:6px 0;color:#e0b552';d.textContent='window '+h+'h '+m+'m · W65';var app=document.getElementById('app')||document.body; app.insertBefore(d, app.firstChild);}catch(e){}},40);
})();