const navbar = document.querySelector('#navbar');

const createNavHome = () => {
    navbar.innerHTML = `
        <div class="max-width-7xl h-16 mx-auto flex items-center px-4 justify-between">
            <p class="font-bold text-xl text-white">Control de Pagos</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:hidden text-white cursor-pointer p-2 rounded-lg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div class="bg-slate-900/80 fixed top-16 right-0 left-0 bottom-0 flex justify-center items-center flex-col gap-4 hidden">
                <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-indigo-800 py-2 px-4 rounded-lg">Login</a>
                <a href="/signup/" class="transition ease-in-out text-white font-bold bg-indigo-500 hover:bg-indigo-800 py-2 px-4 rounded-lg">Registro</a>
            </div>
            <div class="hidden md:flex flex-row gap-4">
                <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-indigo-800 py-2 px-4 rounded-lg">Login</a>
                <a href="/signup/" class="transition ease-in-out text-white font-bold bg-indigo-500 hover:bg-indigo-800 py-2 px-4 rounded-lg">Registro</a>
            </div>
        </div>`;
};

const createNavSignup = () => {
    navbar.innerHTML = `
        <div class="max-width-7xl h-16 mx-auto flex items-center px-4 justify-between">
            <p class="font-bold text-xl text-white">Control de Pagos</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:hidden text-white cursor-pointer p-2 rounded-lg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div class="bg-slate-900/80 fixed top-16 right-0 left-0 bottom-0 flex justify-center items-center flex-col gap-4 hidden">
                <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-indigo-800 py-2 px-4 rounded-lg">Login</a>
            </div>
            <div class="hidden md:flex flex-row gap-4">
                <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-indigo-800 py-2 px-4 rounded-lg">Login</a>
            </div>
        </div>`;
};

const createNavLogin = () => {
    navbar.innerHTML = `
    <div class="max-width-7xl h-16 mx-auto flex items-center px-4 justify-between">
        <p class="font-bold text-xl text-white">Control de Pagos</p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:hidden text-white cursor-pointer p-2 rounded-lg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <div class="bg-slate-900/80 fixed top-16 right-0 left-0 bottom-0 flex justify-center items-center flex-col gap-4 hidden">
            <a href="/signup/" class="transition ease-in-out text-white font-bold bg-indigo-500 hover:bg-indigo-800 py-2 px-4 rounded-lg">Registro</a>
        </div>
        <div class="hidden md:flex flex-row gap-4">
            <a href="/signup/" class="transition ease-in-out text-white font-bold bg-indigo-500 hover:bg-indigo-800 py-2 px-4 rounded-lg">Registro</a>
        </div>
    </div>`;
};

const createNavTodos = () => {
    navbar.innerHTML = `
        <div class="max-width-7xl h-16 mx-auto flex items-center px-4 justify-between">
            <p class="font-bold text-sm text-white uppercase italic tracking-tighter">Garage<span class="text-indigo-400">Pro</span></p>
            <svg id="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 md:hidden text-white cursor-pointer p-2 rounded-lg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div id="menu-mobile" class="bg-slate-900/95 fixed top-16 right-0 left-0 bottom-0 flex justify-center items-center flex-col gap-4 hidden z-50">
                <button class="logout-btn transition ease-in-out text-white font-black bg-red-600 hover:bg-red-800 py-3 px-8 rounded-2xl uppercase text-xs">Cerrar Sesión</button>
            </div>
            <div class="hidden md:flex flex-row gap-4">
                <button class="logout-btn transition ease-in-out text-white font-black bg-slate-800 hover:bg-red-600 py-2 px-4 rounded-xl uppercase text-[10px]">Cerrar Sesión</button>
            </div>
        </div>`;
};


const path = window.location.pathname;
if (path === '/') createNavHome();
else if (path.includes('/signup')) createNavSignup();
else if (path.includes('/login')) createNavLogin();
else if (path.includes('/admin') || path.includes('/users')) createNavTodos();

const navBtn = document.querySelector('#menu-icon');
const menuMobile = document.querySelector('#menu-mobile');

if (navBtn && menuMobile) {
    navBtn.addEventListener('click', () => {
        const isActive = navBtn.classList.toggle('active');
        if (isActive) {
            navBtn.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />`;
            menuMobile.classList.replace('hidden', 'flex');
        } else {
            navBtn.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />`;
            menuMobile.classList.replace('flex', 'hidden');
        }
    });
}

const handleLogout = async () => {
    try {
        localStorage.clear();
        await axios.get('/api/logout').catch(() => {}); 
        window.location.href = '/login/';
    } catch (error) {
        localStorage.clear();
        window.location.href = '/login/';
    }
};

document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', handleLogout);
});