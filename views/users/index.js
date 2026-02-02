document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');

    if (!token || !userRaw) { 
        window.location.href = '/login/'; 
        return; 
    }

    const user = JSON.parse(userRaw);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Saludo
    if (user.name) {
        document.getElementById('user-welcome').innerText = `HOLA, ${user.name.split(' ')[0].toUpperCase()}`;
    }

    // Carga inicial
    await fetchMyServices();

    // Refrescar cada 20 segundos
    setInterval(fetchMyServices, 20000);

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/login/';
    });
});

async function fetchMyServices() {
    try {
        const { data } = await axios.get('/api/services');
        const user = JSON.parse(localStorage.getItem('user'));
        
        const myId = user.id || user._id;

        // Filtro: Solo mis servicios
        const myServices = data.filter(s => {
            const mId = s.mechanic?.id || s.mechanic?._id || s.mechanic;
            return mId === myId;
        });
        
        // AQUÍ ESTABA EL ERROR: Aseguramos que los nombres coincidan
        renderMyServices(myServices);
        calculateMyStats(myServices);
    } catch (e) {
        console.error("Error cargando servicios:", e);
    }
}

// ESTA ES LA FUNCIÓN QUE TE FALTABA O TENÍA OTRO NOMBRE
function renderMyServices(services) {
    const container = document.getElementById('my-services-list');
    if (!container) return;

    if (services.length === 0) {
        container.innerHTML = `
            <div class="p-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                <p class="text-slate-400 font-bold text-sm uppercase italic">Sin trabajos asignados</p>
            </div>`;
        return;
    }

    const statusMap = {
        'pendiente': { label: 'En espera', color: 'bg-amber-100 text-amber-700' },
        'en proceso': { label: 'En proceso', color: 'bg-blue-100 text-blue-700' },
        'finalizado': { label: 'Terminado', color: 'bg-green-100 text-green-700' },
        'completado': { label: 'Terminado', color: 'bg-green-100 text-green-700' }
    };

    container.innerHTML = services.map(s => {
        const config = statusMap[s.status] || statusMap['pendiente'];
        return `
        <div class="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex justify-between items-center transition-all hover:shadow-md">
            <div>
                <span class="text-[9px] font-black uppercase px-2 py-1 rounded-lg ${config.color}">${config.label}</span>
                <h4 class="font-black text-slate-800 text-sm mt-2 uppercase">${s.serviceType?.name || 'Servicio'}</h4>
                <p class="text-[10px] text-slate-400 font-medium">${s.description || 'Sin detalles'}</p>
            </div>
            <div class="text-right">
                <p class="text-[9px] font-black text-slate-300 uppercase italic tracking-widest">Mi Pago</p>
                <p class="font-mono font-black text-blue-600 text-xl">$${(s.monto_a_pagar || 0).toLocaleString()}</p>
            </div>
        </div>`;
    }).reverse().join('');
}

function calculateMyStats(services) {
    const ready = services.filter(s => s.status === 'finalizado' || s.status === 'completado');
    const totalEarned = ready.reduce((acc, s) => acc + (s.monto_a_pagar || 0), 0);
    
    const earnedEl = document.getElementById('my-earnings');
    const countEl = document.getElementById('my-count');

    if (earnedEl) earnedEl.innerText = `$${totalEarned.toLocaleString()}`;
    if (countEl) countEl.innerText = ready.length;
}