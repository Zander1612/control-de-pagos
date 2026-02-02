const state = {
    selectedDate: new Date()
};


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = '/';

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    document.getElementById('week-filter').valueAsDate = state.selectedDate;

    setupEventListeners();
    loadAllData();
});

function getWeekRange(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);

    const start = new Date(d.setDate(diff));
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 5); 
    end.setHours(23, 59, 59, 999);

    return { start, end };
}


async function loadAllData() {
    try {
        const [servicesRes, usersRes, typesRes] = await Promise.all([
            axios.get('/api/services'),
            axios.get('/api/users'),
            axios.get('/api/service-types')
        ]);

        const services = servicesRes.data;
        const users = usersRes.data;
        const types = typesRes.data;

        const { start, end } = getWeekRange(state.selectedDate);
        updateWeekLabel(start, end);

        const weeklyServices = filterServicesByWeek(services, start, end);

        renderTrabajos(weeklyServices);
        renderMecanicos(users);
        renderNomina(weeklyServices);
        calculateStats(weeklyServices);
        renderConfig(types);
        fillSelects(users, types);

    } catch (err) {
        console.error('Error cargando datos:', err.response?.data || err);
    }
}

function filterServicesByWeek(services, start, end) {
    return services.filter(s => {
        const d = new Date(s.fecha_inicio);
        return d >= start && d <= end;
    });
}

function updateWeekLabel(start, end) {
    const options = { day: 'numeric', month: 'short' };
    document.getElementById('current-week-label').innerText =
        `${start.toLocaleDateString('es-ES', options)} - ${end.toLocaleDateString('es-ES', options)}`;
}

function fillSelects(users, types) {
    const mechanics = users.filter(u => u.role !== 'admin');

    document.getElementById('mechanic-select').innerHTML =
        `<option value="" disabled selected>Mecánico</option>` +
        mechanics.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

    document.getElementById('type-select').innerHTML =
        `<option value="" disabled selected>Tipo de Servicio</option>` +
        types.map(t => `<option value="${t.id}">${t.name} (${t.percentage}%)</option>`).join('');
}

function renderTrabajos(services) {
    const tbody = document.getElementById('table-body-content');

    tbody.innerHTML = services.map(s => `
        <tr class="hover:bg-slate-50 transition">
            <td class="px-6 py-4 text-xs font-mono text-slate-400">
                ${new Date(s.fecha_inicio).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 font-black uppercase text-sm text-slate-700">
                ${s.mechanic?.name || '---'}
            </td>
            <td class="px-6 py-4">
                <p class="font-bold text-sm uppercase">${s.serviceType?.name || 'S/T'}</p>
                <p class="text-xs text-slate-400 uppercase">${s.description || ''}</p>
            </td>
            <td class="px-6 py-4 text-center">
                ${renderStatusSelect(s)}
            </td>
            <td class="px-6 py-4 font-mono font-black text-sm">
                $${s.costo_total.toLocaleString()}
            </td>
            <td class="px-6 py-4">
                <button onclick="deleteService('${s.id}')" class="text-slate-300 hover:text-red-500">✕</button>
            </td>
        </tr>
    `).reverse().join('');
}

function renderStatusSelect(service) {
    const colors = {
        pendiente: 'bg-amber-100 text-amber-600',
        'en proceso': 'bg-blue-100 text-blue-600',
        finalizado: 'bg-green-100 text-green-600'
    };

    return `
        <select onchange="updateStatus('${service.id}', this.value)"
            class="text-xs font-black uppercase px-3 py-1.5 rounded-xl outline-none ${colors[service.status]}">
            <option value="pendiente" ${service.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="en proceso" ${service.status === 'en proceso' ? 'selected' : ''}>En proceso</option>
            <option value="finalizado" ${service.status === 'finalizado' ? 'selected' : ''}>Finalizado</option>
        </select>
    `;
}

function renderMecanicos(users) {
    const container = document.getElementById('mecanicos-list');
    const workers = users.filter(u => u.role !== 'admin');

    container.innerHTML = workers.map(m => `
        <div class="bg-white p-4 rounded-3xl border flex justify-between items-center shadow-sm">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">
                    ${m.name[0].toUpperCase()}
                </div>
                <div>
                    <p class="font-black uppercase text-sm">${m.name}</p>
                    <p class="text-xs text-slate-400">${m.email}</p>
                </div>
            </div>
            <button onclick="deleteUser('${m.id}')" class="text-slate-300 hover:text-red-500">✕</button>
        </div>
    `).join('');
}

function renderNomina(services) {
    const container = document.getElementById('nomina-list');
    const totals = {};

    services
        .filter(s => s.status === 'finalizado' && s.mechanic?.id)
        .forEach(s => {
            const id = s.mechanic.id;
            if (!totals[id]) totals[id] = { name: s.mechanic.name, amount: 0, count: 0 };
            totals[id].amount += s.monto_a_pagar;
            totals[id].count++;
        });

    if (!Object.keys(totals).length) {
        container.innerHTML = `<p class="text-center py-20 text-xs font-black text-slate-300 uppercase">No hay nómina</p>`;
        return;
    }

    container.innerHTML = Object.values(totals).map(t => `
        <div class="bg-white p-8 rounded-3xl border flex justify-between items-center shadow-sm">
            <div>
                <p class="font-black uppercase text-sm italic">${t.name}</p>
                <p class="text-xs text-slate-400">${t.count} trabajos</p>
            </div>
            <p class="text-3xl font-black text-blue-600 font-mono">$${t.amount.toLocaleString()}</p>
        </div>
    `).join('');
}

function calculateStats(services) {
    const revenue = services.reduce((acc, s) => acc + (s.costo_total || 0), 0);
    const payroll = services
        .filter(s => s.status === 'finalizado')
        .reduce((acc, s) => acc + (s.monto_a_pagar || 0), 0);

    document.getElementById('total-revenue').innerText = `$${revenue.toLocaleString()}`;
    document.getElementById('total-payroll').innerText = `$${payroll.toLocaleString()}`;
}

function renderConfig(types) {
    document.getElementById('types-list').innerHTML = types.map(t => `
        <div class="bg-white p-5 rounded-3xl border flex justify-between items-center">
            <div>
                <p class="font-black uppercase text-xs">${t.name}</p>
                <p class="text-xs text-blue-500">${t.percentage}% comisión</p>
            </div>
            <button onclick="deleteServiceType('${t.id}')" class="text-slate-300 hover:text-red-500">✕</button>
        </div>
    `).join('');
}

window.switchTab = (tab) => {
    ['trabajos', 'mecanicos', 'nomina', 'config'].forEach(t => {
        document.getElementById(`section-${t}`).classList.add('hidden');
        document.getElementById(`btn-${t}`).classList.remove('tab-active');
        document.getElementById(`btn-${t}`).classList.add('text-gray-400');
    });

    document.getElementById(`section-${tab}`).classList.remove('hidden');
    document.getElementById(`btn-${tab}`).classList.add('tab-active');
    document.getElementById(`btn-${tab}`).classList.remove('text-gray-400');
};

window.updateStatus = async (id, status) => {
    try {
        await axios.patch(`/api/services/${id}`, { status });
        loadAllData();
    } catch (e) {
        console.error(e);
        alert('Error al actualizar estado');
    }
};

window.deleteUser = async (id) => {
    if (confirm('¿Eliminar acceso?')) {
        await axios.delete(`/api/users/${id}`);
        loadAllData();
    }
};

window.deleteService = async (id) => {
    if (confirm('¿Eliminar trabajo?')) {
        await axios.delete(`/api/services/${id}`);
        loadAllData();
    }
};

window.deleteServiceType = async (id) => {
    if (confirm('¿Eliminar tipo?')) {
        await axios.delete(`/api/service-types/${id}`);
        loadAllData();
    }
};

window.openCurrentWeek = () => {
    state.selectedDate = new Date();
    document.getElementById('week-filter').valueAsDate = state.selectedDate;
    loadAllData();
};

window.openModal = id => document.getElementById(id).classList.remove('hidden');
window.closeModal = id => document.getElementById(id).classList.add('hidden');

function setupEventListeners() {
    document.getElementById('week-filter').addEventListener('change', e => {
        state.selectedDate = new Date(e.target.value + 'T00:00:00');
        loadAllData();
    });

    document.getElementById('employee-form').onsubmit = async e => {
        e.preventDefault();
        const name = document.getElementById('emp-name').value;
        const email = document.getElementById('emp-email').value;
        const password = document.getElementById('emp-password').value;

        await axios.post('/api/users', { name, email, password });
        e.target.reset();
        loadAllData();
    };

    document.getElementById('service-form').onsubmit = async e => {
        e.preventDefault();
        const mechanic = document.getElementById('mechanic-select').value;
        const serviceType = document.getElementById('type-select').value;
        const costo_total = Number(document.getElementById('amount-input').value);
        const description = document.getElementById('description-input').value;

        await axios.post('/api/services', { mechanic, serviceType, costo_total, description });
        closeModal('modal-crear');
        e.target.reset();
        loadAllData();
    };

    document.getElementById('type-form').onsubmit = async e => {
        e.preventDefault();
        const name = document.getElementById('new-type-name').value.toUpperCase();
        const percentage = Number(document.getElementById('new-type-percent').value);

        await axios.post('/api/service-types', { name, percentage });
        e.target.reset();
        loadAllData();
    };

    document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('token'); 
        window.location.href = '/login/'; 
    }
});
}
