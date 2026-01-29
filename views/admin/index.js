// --- VARIABLES Y SELECTORES ---
let allServices = []; // Almacén global de datos para filtrar sin recargar
const mechanicSelect = document.querySelector('#mechanic-select');
const typeSelect = document.querySelector('#type-select');
const filterMechanic = document.querySelector('#filter-mechanic');
const recentList = document.querySelector('#recent-list');
const serviceForm = document.querySelector('#service-form');
const createTypeForm = document.querySelector('#create-type-form');

// Totales en el encabezado
const totalBrutoLabel = document.querySelector('#filtered-total-amount');
const totalComisionLabel = document.querySelector('#filtered-mechanic-amount');

// --- CARGA INICIAL ---
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadUsers(),
        loadServiceTypes(),
        fetchServices() // Trae los datos de la DB
    ]);
});

// 1. Carga mecánicos en ambos selectores (registro y filtro)
async function loadUsers() {
    try {
        const { data } = await axios.get('/api/users');
        const mechanics = data.filter(u => u.role !== 'admin');
        
        mechanics.forEach(m => {
            // Opción para el formulario de registro
            const opt1 = new Option(m.name, m.id);
            mechanicSelect.add(opt1);
            
            // Opción para el filtro de la tabla
            const opt2 = new Option(m.name, m.id);
            filterMechanic.add(opt2);
        });
    } catch (e) { console.error("Error cargando usuarios", e); }
}

// 2. Carga tipos de servicio
async function loadServiceTypes() {
    try {
        const { data } = await axios.get('/api/service-types');
        typeSelect.innerHTML = '<option value="">Seleccionar...</option>';
        data.forEach(t => {
            const opt = new Option(`${t.name} (${t.percentage}%)`, t.id);
            opt.dataset.percent = t.percentage;
            typeSelect.add(opt);
        });
    } catch (e) { console.error("Error cargando servicios", e); }
}

// 3. Obtener servicios y aplicar filtros
async function fetchServices() {
    try {
        const { data } = await axios.get('/api/services');
        allServices = data;
        applyFilters();
    } catch (e) { console.error("Error cargando servicios", e); }
}

// --- LÓGICA DE FILTRADO Y CÁLCULO ---
function applyFilters() {
    const selectedMech = filterMechanic.value;
    
    // Filtrar array global
    const filtered = allServices.filter(s => {
        if (selectedMech === 'all') return true;
        // Comprobar ID (considerando que puede venir poblado o no)
        const mechId = s.mechanic?.id || s.mechanic?._id || s.mechanic;
        return mechId === selectedMech;
    });

    // Calcular Totales del grupo filtrado
    const totalBruto = filtered.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalComision = filtered.reduce((acc, curr) => acc + (curr.mechanicAmount || 0), 0);

    // Actualizar UI
    totalBrutoLabel.textContent = `$${totalBruto.toLocaleString()}`;
    totalComisionLabel.textContent = `$${totalComision.toLocaleString()}`;
    
    renderTable(filtered);
}

function renderTable(data) {
    recentList.innerHTML = data.map(s => `
        <tr class="hover:bg-slate-50 transition">
            <td class="p-4 font-bold text-slate-700">${s.mechanic?.name || 'Desconocido'}</td>
            <td class="p-4">
                <div class="text-xs text-indigo-600 font-bold uppercase">${s.serviceType?.name || 'Servicio'}</div>
                <div class="text-slate-500">${s.description}</div>
            </td>
            <td class="p-4 text-right font-mono font-bold text-slate-600">$${s.totalAmount.toFixed(2)}</td>
            <td class="p-4 text-right font-mono font-bold text-green-600">$${(s.mechanicAmount || 0).toFixed(2)}</td>
        </tr>
    `).reverse().join('');
}

// --- EVENTOS DE FORMULARIO ---

// Registro de Trabajo
serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        mechanic: mechanicSelect.value,
        serviceType: typeSelect.value,
        totalAmount: Number(document.querySelector('#amount-input').value),
        description: document.querySelector('#description-input').value
    };

    try {
        await axios.post('/api/services', payload);
        serviceForm.reset();
        await fetchServices(); // Recarga todo
        alert("¡Trabajo registrado!");
    } catch (e) { alert("Error al guardar"); }
});

// Crear nuevo Tipo de Servicio
createTypeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.querySelector('#new-type-name').value,
        percentage: Number(document.querySelector('#new-type-percentage').value)
    };

    try {
        await axios.post('/api/service-types', payload);
        createTypeForm.reset();
        await loadServiceTypes(); // Recarga el dropdown
        alert("Servicio añadido a la lista");
    } catch (e) { alert("Error al crear servicio"); }
});

// Evento de Filtro
filterMechanic.addEventListener('change', applyFilters);

// Logout
document.querySelector('#logout-btn').addEventListener('click', () => {
    localStorage.removeItem('user'); // Si guardas algo ahí
    window.location.href = '/login/';
});