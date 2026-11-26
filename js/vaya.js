/* Vaya Tours & Travels - animations, 3D effects, forms */

$(function(){
  var $h=$('.spa-page[data-page="home"] .hero');
  if($h.length && !$h.find('.hero-bg').length) $h.prepend('<div class="hero-bg"><span class="orb o1"></span><span class="orb o2"></span><span class="orb o3"></span><div class="gyro"><i></i><i></i><i></i><i></i></div></div>');
  $('.spa-page:not([data-page="home"]) .hero-inner').each(function(){ if(!$(this).find('.hero-bg').length) $(this).prepend('<div class="hero-bg"><span class="orb o1"></span><span class="orb o2"></span></div>'); });
  var fine = window.matchMedia('(hover:hover)').matches;
  // tilt cards
  $('.media-1,.feature-1,.testimonial,.counter-wrap,.svc-card,.step,.offer-card,.team,.quick-contact-item').addClass('tilt reveal3d').each(function(i){ this.style.setProperty('--d',((i%4)*0.1)+'s'); });
  if(fine){
    $(document).on('mousemove','.tilt',function(e){
      var r=this.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      this.style.transform='perspective(900px) rotateY('+(x*14)+'deg) rotateX('+(-y*14)+'deg) translateZ(14px)';
    }).on('mouseleave','.tilt',function(){ this.style.transform=''; });
    // hero parallax tilt
    $(document).on('mousemove','.hero',function(e){
      var r=this.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      $(this).find('.slides').css('transform','perspective(1100px) rotateY('+(x*12)+'deg) rotateX('+(-y*10)+'deg)');
      $(this).find('.booking-form').css('transform','perspective(1200px) rotateY('+(x*3)+'deg) rotateX('+(-y*3)+'deg)');
      $(this).find('.gyro').css('translate',(x*-40)+'px '+(y*-30)+'px');
    }).on('mouseleave','.hero',function(){ $(this).find('.slides,.booking-form').css('transform',''); });
    $('body').append('<div class="cursor-glow"></div>');
    $(document).on('mousemove',function(e){ $('.cursor-glow').css({left:e.clientX,top:e.clientY}); });
  }
  // scroll reveal
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); (function(t){ setTimeout(function(){ t.classList.remove('reveal3d','in'); },1700); })(en.target);} }); },{threshold:.12}) : null;
  function watch(){ $('.reveal3d:not(.in)').each(function(){ if(io) io.observe(this); else this.classList.add('in'); }); }
  watch(); $(window).on('hashchange',function(){ setTimeout(watch,150); });

  // booking form
  var today=new Date(); today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
  var iso=today.toISOString().slice(0,10);
  var $s=$('#bfStart'),$e=$('#bfEnd'); $s.attr('min',iso); $e.attr('min',iso);
  $s.on('change',function(){ $e.attr('min',this.value||iso); if($e.val() && $e.val()<this.value) $e.val(''); });
  function fmt(d){ return new Date(d+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }
  $('#bookingForm').on('submit',function(ev){
    ev.preventDefault();
    var d=$('#bfDest').val(),a=$s.val(),b=$e.val(),p=$('#bfPeople').val(),$m=$('#bfMsg').removeClass('err show');
    if(!d||!a||!b||!p){ $m.addClass('err show').text('Please choose a destination, start date, end date and number of travelers.'); return; }
    if(b<a){ $m.addClass('err show').text('End date cannot be before the start date.'); return; }
    var n=Math.round((new Date(b)-new Date(a))/864e5);
    $m.addClass('show').html('Great choice! <b>'+d+'</b> &middot; '+fmt(a)+' &rarr; '+fmt(b)+' ('+(n||1)+' night'+(n>1?'s':'')+') &middot; '+p+' traveler'+(p>1?'s':'')+'. Our team will show matching packages.');
  });
});

$(function(){
  var $c=$('.owl-3-slider');
  function sides(){
    var $a=$c.find('.owl-item.active'), ci=$a.index($c.find('.owl-item.center'));
    $c.find('.owl-item').removeClass('side-l side-r');
    $a.each(function(i){ if(i<ci) $(this).addClass('side-l'); else if(i>ci) $(this).addClass('side-r'); });
  }
  $c.on('initialized.owl.carousel changed.owl.carousel translate.owl.carousel translated.owl.carousel refreshed.owl.carousel',function(){ setTimeout(sides,30); });
  $(window).on('hashchange resize',function(){ setTimeout(function(){ $c.trigger('refresh.owl.carousel'); sides(); },250); });
  setTimeout(function(){ $c.trigger('refresh.owl.carousel'); sides(); },400);
});

$(function(){
  // countdown to year end
  var end=new Date('2026-12-31T23:59:59').getTime();
  function pad(n){return (n<10?'0':'')+n;}
  function tick(){
    var d=Math.max(0,end-Date.now()),s=Math.floor(d/1000);
    var v={cdD:Math.floor(s/86400),cdH:Math.floor(s%86400/3600),cdM:Math.floor(s%3600/60),cdS:s%60};
    for(var k in v){ var el=document.getElementById(k); if(el && el.textContent!==pad(v[k])){ el.textContent=pad(v[k]); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); } }
  }
  tick(); setInterval(tick,1000);
  // copy coupon
  $(document).on('click','.coupon',function(){
    var $b=$(this),code=$b.data('code'),$i=$b.find('i');
    function done(){ $i.text('Copied!'); $b.addClass('ok'); setTimeout(function(){ $i.text('Copy'); $b.removeClass('ok'); },1600); }
    try{ if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(code).then(done,function(){ fb(); }); } else fb(); }catch(e){ fb(); }
    function fb(){ var t=document.createElement('textarea'); t.value=code; t.style.position='fixed'; t.style.opacity=0; document.body.appendChild(t); t.select(); try{document.execCommand('copy');}catch(e){} document.body.removeChild(t); done(); }
  });
  // contact form
  $('.contact-form').on('submit',function(e){
    e.preventDefault();
    var ok=$('#fname').val()&&$('#email').val()&&$('#message').val();
    $('#cfMsg').removeClass('err').addClass('show').toggleClass('err',!ok).text(ok?'Thank you! Our travel designer will reach out within one working day.':'Please fill in your name, email and message.');
  });
});

$(function(){
  if(window.matchMedia('(hover:hover)').matches){
    $(document).on('mousemove','.vid-stage',function(e){
      var r=this.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      $(this).find('.vid-scene').css('transform','rotateY('+(x*22)+'deg) rotateX('+(-y*16)+'deg)');
    }).on('mouseleave','.vid-stage',function(){ $(this).find('.vid-scene').css('transform',''); });
  }
  $('#toTop').on('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  $('#nlForm').on('submit',function(e){
    e.preventDefault();
    var v=$('#nlEmail').val(),ok=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),$m=$('#nlMsg');
    $m.removeClass('err show').addClass('show').toggleClass('err',!ok).text(ok?'Welcome aboard! Your first travel inspiration is on its way.':'Please enter a valid email address.');
    if(ok) $('#nlEmail').val('');
  });
});

$(function(){
  $('#yr').text(new Date().getFullYear());
  var file=(location.pathname.split('/').pop()||'index.html');
  $('.site-menu > li').removeClass('active');
  $('.site-menu > li > a').each(function(){ if($(this).attr('href')===file) $(this).parent().addClass('active'); });
});
