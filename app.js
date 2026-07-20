
(function(){
  var root=document.getElementById('app');
  var lines=['Nice to meet you.','How was your day?','Could you say that again?','I will practice every day.','Let us ship it today.','Be like water.','One more rep.','Practice makes progress.','I am getting better.','See you tomorrow.','Speak slowly and clearly.','정진 is every day.'];
  var i=0, left=0, timer=null;
  function render(){
    var sc=0;try{sc=(JSON.parse(localStorage.getItem('vst_streak')||'{}').count)||0}catch(e){}
    var sess=+(localStorage.getItem('vst_sessions')||0);
    root.innerHTML='<div class="card"><p class="sub">문장 '+lines.length+' · 스트릭 '+sc+'일 · 세션 '+sess+' · 진행 '+(i+1)+'/'+lines.length+'</p><div style="font-size:18px;min-height:48px" id="line">'+lines[i]+'</div><div style="font-size:28px;margin:12px 0" id="cd">30</div><div class="row"><button id="start">30초 시작</button><button class="sec" id="next">다음 문장</button></div></div>';
    document.getElementById('next').onclick=function(){i=(i+1)%lines.length;render();};
    document.getElementById('start').onclick=function(){
      left=30; clearInterval(timer); document.getElementById('cd').textContent=left;
      timer=setInterval(function(){
        left--; var el=document.getElementById('cd'); if(el) el.textContent=left;
        if(left<=0){
          clearInterval(timer);
          try{localStorage.setItem('vst_sessions', (+(localStorage.getItem('vst_sessions')||0))+1);}catch(e){}
          i=(i+1)%lines.length;
          try{var k='vst_streak';var d=JSON.parse(localStorage.getItem(k)||'{}');var t=new Date().toDateString();
            if(d.last!==t){d.count=(d.last===new Date(Date.now()-864e5).toDateString()?(d.count||0)+1:1);d.last=t;localStorage.setItem(k,JSON.stringify(d));}
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