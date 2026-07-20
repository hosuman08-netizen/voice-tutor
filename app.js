
(function(){
  var root=document.getElementById('app');
  var lines=['Nice to meet you.','How was your day?','Could you say that again?','I will practice every day.','Let us ship it today.'];
  var i=0, left=0, timer=null;
  function render(){
    var sc=0;try{sc=(JSON.parse(localStorage.getItem('vst_streak')||'{}').count)||0}catch(e){}
    root.innerHTML='<div class="card"><p class="sub">문장 보고 따라 말하기 · 스트릭 '+sc+'일</p><div style="font-size:18px;min-height:48px" id="line">'+lines[i]+'</div><div style="font-size:28px;margin:12px 0" id="cd">30</div><div class="row"><button id="start">30초 시작</button><button class="sec" id="next">다음 문장</button></div></div>';
    document.getElementById('next').onclick=function(){i=(i+1)%lines.length;render();};
    document.getElementById('start').onclick=function(){
      left=30; clearInterval(timer);
      timer=setInterval(function(){left--;document.getElementById('cd').textContent=left;if(left<=0){clearInterval(timer); i=(i+1)%lines.length; /* autoNext */
          try{var k='vst_streak';var d=JSON.parse(localStorage.getItem(k)||'{}');var t=new Date().toDateString();
            if(d.last!==t){d.count=(d.last===new Date(Date.now()-864e5).toDateString()?(d.count||0)+1:1);d.last=t;localStorage.setItem(k,JSON.stringify(d));}
          }catch(e){}
          try{legionTrack('activate',{})}catch(e){}}},1000);
    };
  }
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
