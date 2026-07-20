
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
  function render(){
    var sc=0;try{sc=(JSON.parse(localStorage.getItem('vst_streak')||'{}').count)||0}catch(e){}
    var sess=+(localStorage.getItem('vst_sessions')||0);
    var pins=loadPin();
    var td=todayBest();
    var pinned=pins.indexOf(lines[i])>=0;
    root.innerHTML='<div class="card"><p class="sub">문장 '+lines.length+' · 🔥'+sc+'일 · 세션 '+sess
      +' · 오늘 '+td.n+'회 · 진행 '+(i+1)+'/'+lines.length+'</p>'
      +'<div style="font-size:18px;min-height:48px" id="line">'+(pinned?'📌 ':'')+lines[i]+'</div>'
      +'<div style="font-size:28px;margin:12px 0" id="cd">30</div>'
      +'<div class="row"><button id="start">30초 시작</button><button class="sec" id="next">다음</button>'
      +'<button class="sec" id="pin">'+(pinned?'핀 해제':'핀')+'</button></div>'
      +(pins.length?'<p class="sub" style="margin-top:10px">핀 '+pins.length+' · 탭 점프</p><div id="pinList" class="row" style="flex-wrap:wrap;gap:6px"></div>':'')
      +'</div>';
    document.getElementById('next').onclick=function(){try{localStorage.setItem('vst_skips',(+(localStorage.getItem('vst_skips')||0))+1);}catch(e){} i=(i+1)%lines.length;render();};
    document.getElementById('pin').onclick=function(){
      var p=loadPin(); var line=lines[i]; var ix=p.indexOf(line);
      if(ix>=0) p.splice(ix,1); else p.unshift(line);
      savePin(p); render();
      try{legionTrack('pin',{on:ix<0})}catch(e){}
    };
    var pl=document.getElementById('pinList');
    if(pl){
      pl.innerHTML=pins.map(function(t,idx){
        return '<button class="sec" data-p="'+idx+'" style="padding:6px 8px;font-size:12px">'+(t.length>22?t.slice(0,20)+'…':t)+'</button>';
      }).join('');
      Array.prototype.forEach.call(pl.querySelectorAll('[data-p]'),function(b){
        b.onclick=function(){
          var t=pins[+b.getAttribute('data-p')];
          var j=lines.indexOf(t);
          if(j>=0){i=j;render();}
        };
      });
    }
    document.getElementById('start').onclick=function(){
      left=30; clearInterval(timer); document.getElementById('cd').textContent=left;
      timer=setInterval(function(){
        left--; var el=document.getElementById('cd'); if(el) el.textContent=left;
        if(left<=0){
          clearInterval(timer);
          try{localStorage.setItem('vst_sessions', (+(localStorage.getItem('vst_sessions')||0))+1);}catch(e){}
          bumpToday(30);
          i=(i+1)%lines.length;
          try{var k='vst_streak';var d=JSON.parse(localStorage.getItem(k)||'{}');var t=new Date().toDateString();
            if(d.last!==t){d.count=(d.last===new Date(Date.now()-864e5).toDateString()?(d.count||0)+1:1);d.last=t; var best=+(localStorage.getItem('vst_best')||0); if(d.count>best)localStorage.setItem('vst_best',d.count); localStorage.setItem(k,JSON.stringify(d));}
          }catch(e){}
          try{legionTrack('activate',{})}catch(e){}
          render();
        }
      },1000);
    };
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

})();
