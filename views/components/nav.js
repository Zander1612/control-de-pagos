

const navbar = document.querySelector('#navbar');



const createNavHome = () => {
  navbar.innerHTML = ` <div class="max-w-7xl bg-slate-900 h-16 mx-auto flex items-center px-4 justify-between ">
      <p class="text-xl font-bold tracking-wide text-white">Control de pagos</p>
<!-- version movil  -->
 <svg
  xmlns="http://www.w3.org/2000/svg"
 fill="none" viewBox="0 0 24 24"
 stroke-width="1.5"
  stroke="currentColor"
 class="w-10 h-10 md:hidden text-white cursor-pointer p-2  rounded-lg hover:bg-slate-700 transition ease-in-out">
  
 <path
  stroke-linecap="round"
  stroke-linejoin="round"
  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
  />
</svg>

<!-- version escritorio -->
 <div class="hidden md:flex flex-row gap-4">
   <a href="/login/" class="hover:text-yellow-400 text-white hover:bg-slate-900 py-2 px-4 rounded-lg font-bold transition ease-out">Login</a>
   <a href="/signup/" class=" hover:text-yellow-400  text-white hover:bg-slate-500 py-2 px-4 rounded-lg font-bold transition ease-in-out">Registro</a>

 </div>

 <!-- Menu movil--> 

 <div class="bg-slate-600/60 fixed top-16 left-0 right-0 bottom-0  justify-center items-center flex-col gap-4 hidden">
    
   <a href="/login/" class="hover:text-yellow-400 text-white hover:bg-slate-900 py-2 px-4 rounded-lg font-bold transition ease-out">Login</a>
   <a href="/signup/" class=" hover:text-yellow-400  text-white hover:bg-slate-500 py-2 px-4 rounded-lg font-bold transition ease-in-out">Registro</a>
  </div>

    </div>
    `;
};

const createNavSignup = () => {
  navbar.innerHTML = ` <div class="max-w-7xl bg-slate-900 h-16 mx-auto flex items-center px-4 justify-between ">
      <p class="text-xl font-bold tracking-wide text-white">Control de pagos</p>
<!-- version movil  -->
 <svg
  xmlns="http://www.w3.org/2000/svg"
 fill="none" viewBox="0 0 24 24"
 stroke-width="1.5"
  stroke="currentColor"
 class="w-10 h-10 md:hidden text-white cursor-pointer p-2  rounded-lg hover:bg-slate-700 transition ease-in-out">
  
 <path
  stroke-linecap="round"
  stroke-linejoin="round"
  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
  />
</svg>

<!-- version escritorio -->
 <div class="hidden md:flex flex-row gap-4">
   <a href="/login/" class="hover:text-yellow-400 text-white hover:bg-slate-900 py-2 px-4 rounded-lg font-bold transition ease-out">Login</a>
   

 </div>

 <!-- Menu movil--> 

 <div class="bg-slate-600/60 fixed top-16 left-0 right-0 bottom-0  justify-center items-center flex-col gap-4 hidden">
    
   <a href="/login/" class="hover:text-yellow-400 text-white hover:bg-slate-900 py-2 px-4 rounded-lg font-bold transition ease-out">Login</a>
   
  </div>

    </div>
    `;
};

const createNavLogin = () => {
  navbar.innerHTML = ` <div class="max-w-7xl bg-slate-900 h-16 mx-auto flex items-center px-4 justify-between ">
      <p class="text-xl font-bold tracking-wide text-white">Control de pagos</p>
<!-- version movil  -->
 <svg
  xmlns="http://www.w3.org/2000/svg"
 fill="none" viewBox="0 0 24 24"
 stroke-width="1.5"
  stroke="currentColor"
 class="w-10 h-10 md:hidden text-white cursor-pointer p-2  rounded-lg hover:bg-slate-700 transition ease-in-out">
  
 <path
  stroke-linecap="round"
  stroke-linejoin="round"
  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
  />
</svg>

<!-- version escritorio -->
 <div class="hidden md:flex flex-row gap-4">
   
   <a href="/signup/" class=" hover:text-yellow-400  text-white hover:bg-slate-500 py-2 px-4 rounded-lg font-bold transition ease-in-out">Registro</a>

 </div>

 <!-- Menu movil--> 

 <div class="bg-slate-600/60 fixed top-16 left-0 right-0 bottom-0  justify-center items-center flex-col gap-4 hidden">
    
   
   <a href="/signup/" class=" hover:text-yellow-400  text-white hover:bg-slate-500 py-2 px-4 rounded-lg font-bold transition ease-in-out">Registro</a>
  </div>

    </div>
    `;
};

if (window.location.pathname === '/') {
  createNavHome();

} else if (window.location.pathname === '/signup/') {
  createNavSignup();
  
} else if (window.location.pathname === '/login/') {
  createNavLogin();
}

const navBtn = navbar.children[0].children[1]

navBtn.addEventListener('click', e => {
  const menuMobile = navbar.children[0].children[3];
  if (!navBtn.classList.contains('active')) {
    navBtn.classList.add('active')
    navBtn.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />';
 
 menuMobile.classList.remove('hidden');
 menuMobile.classList.add('flex')
 
  } else {
    navBtn.classList.remove('active')
navBtn.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"/>` 
menuMobile.classList.add('hidden');
 menuMobile.classList.remove('flex')
  }
  
});




