
/* LEGION_WAVE_20_today_counter */
try{var _dk=new Date().toDateString();var _o=JSON.parse(localStorage.getItem('lw_p28_voice_sk_today_counter')||'{}');if(_o.d!==_dk)_o={d:_dk,n:0};_o.n=(_o.n||0)+1;localStorage.setItem('lw_p28_voice_sk_today_counter',JSON.stringify(_o));}catch(e){}

(function(){
  var root=document.getElementById('app');
  var DECKS={
    greet:{l:'인사', lines:['Hello.','Nice to meet you.','How are you today?','Good morning.','See you later.']},
    order:{l:'주문', lines:['Can I get a coffee, please?','I would like this one.','How much is it?','For here, please.','Could I have the check?']},
    refuse:{l:'거절', lines:["I'm sorry, I can't.",'Not today, thank you.','I need to think about it.','Maybe later.','That does not work for me.']},
    meet:{l:'미팅', lines:['Shall we start?','Could you say that again?','Let us ship it today.','What is the next step?','I will follow up.']}
  };
  var DECK_ORDER=['greet','order','refuse','meet'];
  function deckId(){try{var d=localStorage.getItem('vst_deck')||'greet'; return DECKS[d]?d:'greet';}catch(e){return 'greet';}}
  function setDeck(id){if(!DECKS[id])return; try{localStorage.setItem('vst_deck',id);}catch(e){} i=0;}
  function deckLines(){return (DECKS[deckId()]||DECKS.greet).lines.slice();}
  var i=0, left=0, timer=null;
  function autoOn(){try{return localStorage.getItem('vst_auto')!=='0';}catch(e){return true;}}
  function autoFlip(){try{localStorage.setItem('vst_auto',autoOn()?'0':'1');}catch(e){}}
  function srsLoad(){try{return JSON.parse(localStorage.getItem('vst_srs')||'{}');}catch(e){return{};}}
  function srsSave(m){try{localStorage.setItem('vst_srs',JSON.stringify(m));}catch(e){}}
  function nextDueFrom(start, all){
    var m=srsLoad(), now=Date.now(), n=all.length;
    if(!n) return 0;
    for(var k=1;k<=n;k++){
      var j=(start+k)%n;
      var rec=m[all[j]];
      if(!rec || !rec.due || rec.due<=now) return j;
    }
    return (start+1)%n;
  }
  function dayKey(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
  function loadPinMap(){
    try{
      var map=JSON.parse(localStorage.getItem('vst_pins_by_deck')||'null');
      if(map&&typeof map==='object'&&!Array.isArray(map)) return map;
      var old=JSON.parse(localStorage.getItem('vst_pins')||'[]');
      if(!Array.isArray(old)) old=[];
      map={};
      var seen={};
      DECK_ORDER.forEach(function(id){
        var lines=DECKS[id].lines;
        var arr=old.filter(function(t){return lines.indexOf(t)>=0;}).slice(0,12);
        arr.forEach(function(t){seen[t]=1;});
        map[id]=arr;
      });
      var leftover=old.filter(function(t){return !seen[t];});
      if(leftover.length) map.greet=(map.greet||[]).concat(leftover).slice(0,12);
      localStorage.setItem('vst_pins_by_deck',JSON.stringify(map));
      return map;
    }catch(e){return {};}
  }
  function loadPin(){
    var map=loadPinMap();
    var arr=map[deckId()];
    return Array.isArray(arr)?arr.slice(0,12):[];
  }
  function savePin(p){
    try{
      var map=loadPinMap();
      map[deckId()]=p.slice(0,12);
      localStorage.setItem('vst_pins_by_deck',JSON.stringify(map));
    }catch(e){}
  }
  var TTS_RATES=['0.75','0.9','1.1'];
  function ttsRate(){
    try{
      var r=String(localStorage.getItem('vst_tts_rate')||'0.9');
      return TTS_RATES.indexOf(r)>=0?r:'0.9';
    }catch(e){return '0.9';}
  }
  function setTtsRate(r){
    r=String(r||'');
    if(TTS_RATES.indexOf(r)<0) return;
    try{localStorage.setItem('vst_tts_rate',r);}catch(e){}
  }
  function speakLine(line){
    if(!window.speechSynthesis) return false;
    try{ speechSynthesis.cancel(); }catch(e){}
    var u=new SpeechSynthesisUtterance(line||'');
    u.lang=/[가-힯]/.test(line||'')?'ko-KR':'en-US';
    u.rate=parseFloat(ttsRate())||0.9;
    speechSynthesis.speak(u);
    return u.rate;
  }
  function replayN(){
    try{ return Math.max(0, +(localStorage.getItem('vst_replay_'+dayKey())||0)); }
    catch(e){ return 0; }
  }
  function bumpReplay(){
    var n=replayN()+1;
    try{ localStorage.setItem('vst_replay_'+dayKey(), String(n)); }catch(e){}
    return n;
  }
  function lineReplayKey(line){ return String(line||'').slice(0,80); }
  function replayByLine(){
    try{
      var o=JSON.parse(localStorage.getItem('vst_replay_line_'+dayKey())||'{}');
      return o&&typeof o==='object'&&!Array.isArray(o)?o:{};
    }catch(e){return {};}
  }
  function bumpLineReplay(line){
    var m=replayByLine();
    var k=lineReplayKey(line);
    m[k]=(+m[k]||0)+1;
    try{ localStorage.setItem('vst_replay_line_'+dayKey(), JSON.stringify(m)); }catch(e){}
    return m[k];
  }
  function lineReplayN(line){
    return +replayByLine()[lineReplayKey(line)]||0;
  }
  function lineCountChip(idx, n){
    return (idx+1)+' · '+(+n||0)+'회';
  }
  function lineCountChipDim(n){
    return (+n||0)===0;
  }
  function lineCountChipStyle(n){
    return 'padding:6px 8px;font-size:12px'+(lineCountChipDim(n)?';opacity:.38':'');
  }
  function paintLineReplayChip(el, n){
    if(!el) return;
    el.textContent='이 문장 '+(+n||0)+'회';
    el.className='chip'+(lineCountChipDim(n)?' dim':'');
    el.setAttribute('data-n', String(+n||0));
    el.setAttribute('role','button');
    el.title='탭=이 문장 TTS · STT/점수 없음';
    el.style.opacity=lineCountChipDim(n)?'.38':'';
    el.style.cursor='pointer';
  }
  function speakChipLine(idx, lines){
    var line=(lines||[])[idx]||'';
    if(!line) return {ok:false,n:0,rate:false};
    if(!window.speechSynthesis) return {ok:false,n:lineReplayN(line),rate:false};
    var rate=speakLine(line);
    var n=bumpLineReplay(line);
    return {ok:true,n:n,rate:rate,line:line};
  }
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
    var custom0=JSON.parse(localStorage.getItem('vst_custom')||'[]'); var all0=deckLines().concat(custom0); if(i>=all0.length)i=0; var pinned=pins.indexOf(all0[i])>=0;
    var best=+(localStorage.getItem('vst_best')||0);
    var custom=JSON.parse(localStorage.getItem('vst_custom')||'[]');
    var allLines=deckLines().concat(custom);
    if(i>=allLines.length) i=0;
    var goal=3, gPct=Math.min(100,Math.round((td.n||0)/goal*100));
    var wp=weekPractice(), mx=Math.max.apply(null,wp.concat([1]));
    var active=wp.filter(function(n){return n>0;}).length;
    root.innerHTML='<div class="card">'
      +'<div style="font-size:24px;line-height:1.4;min-height:72px;font-weight:700;letter-spacing:-0.02em" id="line">'+(pinned?'📌 ':'')+allLines[i]+'</div>'
      +'<button id="start" style="width:100%;padding:22px 16px;font-size:22px;border-radius:14px;margin-top:8px;line-height:1.2"><span id="cd" style="font-size:32px;display:block">30</span><span style="font-size:13px;font-weight:700;opacity:.85">초 섀도잉 · 먼저 듣기</span></button>'
      +'<button class="sec" id="ttsCue" style="width:100%;margin-top:8px">원문 듣기 · 브라우저 TTS · 녹음/점수 없음</button>'
      +'<div class="row" id="speedChips" style="margin-top:8px">'+TTS_RATES.map(function(r){
        var on=ttsRate()===r;
        return '<button class="'+(on?'':'sec')+'" data-rate="'+r+'">'+r+'×</button>';
      }).join('')+'</div>'
      +'<div class="row" style="margin-top:8px;align-items:center"><button class="sec" id="ttsReplay" style="flex:1">재듣기 · '+ttsRate()+'× 유지 · STT/점수 없음</button>'
      +'<span class="chip" id="replayChip">재듣기 '+replayN()+'</span>'
      +'<span class="chip'+(lineCountChipDim(lineReplayN(allLines[i]))?' dim':'')+'" id="lineReplayChip" role="button" data-n="'+lineReplayN(allLines[i])+'" title="탭=이 문장 TTS · STT/점수 없음"'+(lineCountChipDim(lineReplayN(allLines[i]))?' style="opacity:.38;cursor:pointer"':' style="cursor:pointer"')+'>이 문장 '+lineReplayN(allLines[i])+'회</span></div>'
      +'<div class="row" id="lineReplay" style="margin-top:8px;flex-wrap:wrap;gap:6px">'+allLines.slice(0,12).map(function(t,idx){
        var n=lineReplayN(t);
        return '<button class="'+(idx===i?'':'sec')+(lineCountChipDim(n)?' dim':'')+'" data-lr="'+idx+'" data-n="'+n+'" title="탭=그 문장 TTS · 0회도 재생" style="'+lineCountChipStyle(n)+';cursor:pointer">'+lineCountChip(idx,n)+'</button>';
      }).join('')+'</div>'
      +'<p class="sub" style="margin-top:4px">0칩 탭=그 문장 TTS · 번호=그 문장 · 현재 카드 유지 · STT/점수 없음</p>'
      +'<button class="sec" id="autoNext" style="width:100%;margin-top:8px">자동다음 '+(autoOn()?'ON':'OFF')+' · 타이머 끝→다음</button>'
      +'<div class="row" id="selfRate" style="margin-top:8px">'
      +'<button class="sec" data-g="0">못함</button><button class="sec" data-g="1">보통</button><button class="sec" data-g="2">잘함</button>'
      +'</div>'
      +'<p class="sub" style="margin-top:4px">셀프 간격만 · 못함=지금 · 보통=1일 · 잘함=3일 · 점수/STT 없음</p>'
      +'<div class="row" id="deckChips" style="margin-top:8px">'+DECK_ORDER.map(function(id){
        var on=deckId()===id;
        return '<button class="'+(on?'':'sec')+'" data-deck="'+id+'">'+DECKS[id].l+'</button>';
      }).join('')+'</div>'
      +'<p class="sub" style="margin-top:4px">상황 4덱 · JSON 로컬 · 계정 없음 · STT/점수 없음</p>'
      +'<details style="margin-top:12px"><summary class="sub" style="cursor:pointer">통계 · 15초 · 핀 · 다음</summary>'
      +'<p class="sub" style="margin-top:8px">문장 '+allLines.length+' · 🔥'+sc+'일'+(best?' · 최장 '+best:'')+' · 세션 '+sess
      +' · 오늘 '+(td.n||0)+'/'+goal+' · 7일 활동일 '+active+' · 진행 '+(i+1)+'/'+allLines.length+'</p>'
      +'<div style="height:6px;background:#1c1826;border-radius:4px;margin:8px 0;overflow:hidden"><i style="display:block;height:100%;width:'+gPct+'%;background:linear-gradient(90deg,#67e8f9,#e0b552)"></i></div>'
      +'<div style="display:flex;align-items:flex-end;gap:3px;height:28px;margin-bottom:8px">'+wp.map(function(n){var h=Math.max(3,Math.round(n/mx*24));return '<div style="flex:1;height:'+h+'px;background:'+(n>0?'#67e8f9':'#2a2438')+';border-radius:2px"></div>';}).join('')+'</div>'
      +'<div class="row"><button class="sec" id="start15">15초</button><button class="sec" id="next">다음</button>'
      +'<button class="sec" id="pin">'+(pinned?'핀 해제':'핀')+'</button></div>'
      +'<div class="row" style="margin-top:8px"><input id="customLine" placeholder="내 문장 추가" style="flex:1"/><button class="sec" id="addLine">+</button></div>'
      +(pins.length?'<p class="sub" style="margin-top:10px">핀 '+pins.length+' · '+(DECKS[deckId()]||DECKS.greet).l+' 덱만 · 탭 점프</p><div id="pinList" class="row" style="flex-wrap:wrap;gap:6px"></div>':'')
      +'</details></div>';
    document.getElementById('next').onclick=function(){try{localStorage.setItem('vst_skips',(+(localStorage.getItem('vst_skips')||0))+1);}catch(e){} i=nextDueFrom(i,allLines);render();};
    var dc=document.getElementById('deckChips');
    if(dc) Array.prototype.forEach.call(dc.querySelectorAll('[data-deck]'),function(b){
      b.onclick=function(){
        setDeck(b.getAttribute('data-deck'));
        try{legionTrack('deck',{id:deckId()})}catch(e){}
        render();
      };
    });
    var sr=document.getElementById('selfRate');
    if(sr) Array.prototype.forEach.call(sr.querySelectorAll('[data-g]'),function(b){
      b.onclick=function(){
        var g=+b.getAttribute('data-g');
        var iv=g===0?0:g===1?864e5:3*864e5;
        var m=srsLoad(); m[allLines[i]]={due:Date.now()+iv,g:g}; srsSave(m);
        i=nextDueFrom(i,allLines);
        try{legionTrack('self_rate',{g:g})}catch(e){}
        render();
      };
    });
    var ttsBtn=document.getElementById('ttsCue');
    if(ttsBtn) ttsBtn.onclick=function(){
      var line=allLines[i]||'';
      if(!window.speechSynthesis){ ttsBtn.textContent='이 브라우저 TTS 없음'; return; }
      var rate=speakLine(line);
      try{legionTrack('tts_cue',{lang:/[가-힯]/.test(line)?'ko-KR':'en-US',rate:rate})}catch(e){}
    };
    var rp=document.getElementById('ttsReplay');
    if(rp) rp.onclick=function(){
      var line=allLines[i]||'';
      if(!window.speechSynthesis){ rp.textContent='이 브라우저 TTS 없음'; return; }
      var rate=speakLine(line);
      var n=bumpReplay();
      var chip=document.getElementById('replayChip');
      if(chip) chip.textContent='재듣기 '+n;
      rp.textContent='재듣기 · '+ttsRate()+'× 유지';
      setTimeout(function(){ var el=document.getElementById('ttsReplay'); if(el) el.textContent='재듣기 · '+ttsRate()+'× 유지 · STT/점수 없음'; },900);
      try{legionTrack('tts_replay',{rate:rate,n:n})}catch(e){}
    };
    var lr=document.getElementById('lineReplay');
    function paintLrBtn(b, idx, n){
      if(!b) return;
      b.textContent=lineCountChip(idx,n);
      b.className=(idx===i?'':'sec')+(lineCountChipDim(n)?' dim':'');
      b.setAttribute('data-n', String(n));
      b.style.opacity=lineCountChipDim(n)?'.38':'';
      b.style.cursor='pointer';
    }
    if(lr) Array.prototype.forEach.call(lr.querySelectorAll('[data-lr]'),function(b){
      b.onclick=function(){
        var idx=+b.getAttribute('data-lr');
        var wasZero=lineCountChipDim(+b.getAttribute('data-n')||0);
        var r=speakChipLine(idx, allLines);
        if(!r.ok && !window.speechSynthesis){ b.textContent='TTS없음'; return; }
        if(!r.ok) return;
        paintLrBtn(b, idx, r.n);
        if(idx===i) paintLineReplayChip(document.getElementById('lineReplayChip'), r.n);
        try{legionTrack('tts_line_replay',{i:idx,rate:r.rate,n:r.n,zero:wasZero})}catch(e){}
      };
    });
    var lrc=document.getElementById('lineReplayChip');
    if(lrc){
      lrc.onclick=function(){
        var wasZero=lineCountChipDim(+lrc.getAttribute('data-n')||0);
        var r=speakChipLine(i, allLines);
        if(!r.ok && !window.speechSynthesis){ lrc.textContent='TTS없음'; return; }
        if(!r.ok) return;
        paintLineReplayChip(lrc, r.n);
        var nb=lr&&lr.querySelector('[data-lr="'+i+'"]');
        paintLrBtn(nb, i, r.n);
        try{legionTrack('tts_zero_chip',{i:i,rate:r.rate,n:r.n,zero:wasZero})}catch(e){}
      };
    }
    var sp=document.getElementById('speedChips');
    if(sp) Array.prototype.forEach.call(sp.querySelectorAll('[data-rate]'),function(b){
      b.onclick=function(){
        setTtsRate(b.getAttribute('data-rate'));
        Array.prototype.forEach.call(sp.querySelectorAll('[data-rate]'),function(x){
          x.className=x.getAttribute('data-rate')===ttsRate()?'':'sec';
        });
        try{legionTrack('tts_rate',{r:ttsRate()})}catch(e){}
      };
    });
    var an=document.getElementById('autoNext');
    if(an) an.onclick=function(){ autoFlip(); render(); try{legionTrack('auto_next',{on:autoOn()})}catch(e){} };
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
          if(autoOn()) i=nextDueFrom(i,allLines);
          try{var k='vst_streak';var d=JSON.parse(localStorage.getItem(k)||'{}');var t=new Date().toDateString();
            if(d.last!==t){d.count=(d.last===new Date(Date.now()-864e5).toDateString()?(d.count||0)+1:1);d.last=t; var bestN=+(localStorage.getItem('vst_best')||0); if(d.count>bestN)localStorage.setItem('vst_best',d.count); localStorage.setItem(k,JSON.stringify(d));}
          }catch(e){}
          try{legionTrack('activate',{sec:sec})}catch(e){}
          render();
        }
      },1000);
    }
    /* GOLD50 leftover #2: 원문 1회 TTS → 그다음 타이머. 업로드/STT/점수 없음 */
    function cueThenTimer(sec){
      var line=allLines[i]||'';
      var cd=document.getElementById('cd');
      if(!window.speechSynthesis){ runTimer(sec); return; }
      if(cd) cd.textContent='♪';
      try{ speechSynthesis.cancel(); }catch(e){}
      var u=new SpeechSynthesisUtterance(line);
      u.lang=/[가-힯]/.test(line)?'ko-KR':'en-US';
      u.rate=parseFloat(ttsRate())||0.9;
      var started=false;
      function go(){ if(started) return; started=true; runTimer(sec); }
      u.onend=go;
      u.onerror=go;
      try{ speechSynthesis.speak(u); }catch(e){ go(); return; }
      setTimeout(go, Math.min(10000, Math.max(2200, (line.length||8)*350)));
      try{legionTrack('tts_pre_timer',{sec:sec,rate:u.rate})}catch(e){}
    }
    document.getElementById('start').onclick=function(){cueThenTimer(30);};
    document.getElementById('start15').onclick=function(){cueThenTimer(15);};
  }
  try{legionTrack('session_start',{})}catch(e){}
  render();

  (function(){try{
    if(document.getElementById('moneyPipe'))return;
    var d=document.createElement('div');
    d.innerHTML='\n<div id="moneyPipe" style="margin-top:12px;padding:10px;border:1px solid #c5a46e44;border-radius:12px;background:#16121c;text-align:center;font-size:12px">\n  <div style="color:#e0b552;font-weight:700;margin-bottom:4px">💎 후원 · 파이프 (엔터 18+)</div>\n  <p style="opacity:.75;margin:0 0 6px">가상 체험 · 실결제 백엔드 없음 · 문의만</p>\n\n  \n</div>\n';
    var app=document.getElementById('app')||document.body;
    app.appendChild(d.firstElementChild||d);
    try{legionTrack('money_pipe_shown',{app:'auto'})}catch(e){}
  }catch(e){}})();


/* LEGION_WAVE_65_fomo_chip */
setTimeout(function(){try{if(document.getElementById('lw_fomo_65'))return;var end=new Date(); end.setHours(24,0,0,0);var ms=Math.max(0,end-Date.now());var h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000);var d=document.createElement('div'); d.id='lw_fomo_65';d.style.cssText='font-size:11px;opacity:.75;margin:6px 0;color:#e0b552';d.textContent='window '+h+'h '+m+'m · W65';var app=document.getElementById('app')||document.body; app.insertBefore(d, app.firstChild);}catch(e){}},40);
})();