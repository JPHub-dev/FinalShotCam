// Simple auth page interactions: carousel, dots, prev/next, pw toggle, basic form prevention
// Auth page script: auto background carousel + tab switching + pw toggle + demo form handlers
(function(){
  const imageSets = [
    'assets/image1.png',
    'assets/image2.png',
    'assets/image3.png'
  ];

  function initAutoCarousel(rootId){
    const root = document.getElementById(rootId);
    if(!root) return null;
    const images = root.dataset.images ? root.dataset.images.split(',').map(item => item.trim()).filter(Boolean) : imageSets;
    if(images.length === 0) return null;

    let index = 0;
    const bg = root.querySelector('.auth-bg') || document.createElement('div');
    bg.classList.add('auth-bg');
    if(!root.contains(bg)) root.appendChild(bg);

    let transitionTimer = null;
    function show(i){
      if(bg.style.backgroundImage){
        bg.classList.add('hide');
        clearTimeout(transitionTimer);
        transitionTimer = setTimeout(()=>{
          bg.style.backgroundImage = `url('${images[i]}')`;
          bg.classList.remove('hide');
          index = i;
        }, 320);
      } else {
        bg.style.backgroundImage = `url('${images[i]}')`;
        bg.classList.remove('hide');
        index = i;
      }
    }

    show(0);
    const timer = setInterval(()=> show((index+1)%images.length), 6000);
    return { show, stop: ()=> clearInterval(timer) };
  }

  function switchTab(tab){
    document.querySelectorAll('.auth-form').forEach(f=> f.classList.toggle('active', f.id === `${tab}Form`));
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initAutoCarousel('authRight');

    document.querySelectorAll('.switch-form').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const next = btn.getAttribute('data-target');
        switchTab(next);
      });
    });

    // password toggles
    document.querySelectorAll('.pw-toggle').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-target');
        const input = document.getElementById(id);
        if(!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
      });
    });

    // demo form handlers
    const login = document.getElementById('loginForm');
    if(login) login.addEventListener('submit', (e)=>{ e.preventDefault(); alert('Logged in (demo)'); });

    const signup = document.getElementById('signupForm');
    if(signup) signup.addEventListener('submit', (e)=>{ e.preventDefault(); alert('Account created (demo)'); });
  });

})();
