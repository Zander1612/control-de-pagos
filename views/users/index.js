// Selección de elementos del DOM
const ul = document.querySelector("ul");
const totalCountSpan = document.querySelector(".total-count"); // Cantidad de trabajos
const totalMoneySpan = document.querySelector(".total-money"); // Dinero ganado
const userNameSpan = document.querySelector("#user-name");
const logoutBtn = document.querySelector("#logout-btn");

// Función para renderizar un servicio en la lista
const createServiceItem = (service) => {
  const li = document.createElement("li");
  
  // Usamos clases de Tailwind para que se vea como una tarjeta bonita
  li.classList.add(
    "bg-slate-50 flex", 
    "justify-between", 
    "items-center", 
    "p-4", 
    "rounded-md", 
    "border-l-4", 
    "border-indigo-500", 
    "shadow-sm"
  );

  // Formateamos la fecha
  const date = new Date(service.date).toLocaleDateString();

  li.innerHTML = `
    <div class="flex flex-col">
      <span class="font-bold text-slate-700">${service.description}</span>
      <span class="text-xs text-slate-400">${date} - ${service.serviceType ? service.serviceType.name : 'Servicio'}</span>
    </div>
    <div class="font-bold text-green-600 text-lg">
      +$${service.mechanicAmount}
    </div>
  `;
  
  return li;
};

// Cargar servicios al iniciar la página
(async () => {
  try {
    // 1. Mostrar nombre del usuario guardado en el Login
    const localName = localStorage.getItem('userName');
    if (localName) userNameSpan.textContent = localName;

    // 2. Obtener los servicios desde tu API
    // (Axios enviará la cookie automáticamente gracias al navegador)
    const { data } = await axios.get("/api/services");

    // 3. Calcular totales
    let totalServices = data.length;
    let totalMoney = 0;

    // 4. Renderizar la lista
    if (data.length === 0) {
        ul.innerHTML = `<p class="text-center text-slate-400 py-4">No tienes trabajos registrados aún.</p>`;
    } else {
        data.forEach((service) => {
            // Sumamos la ganancia del mecánico
            totalMoney += service.mechanicAmount;
            
            // Creamos el elemento y lo agregamos
            const listItem = createServiceItem(service);
            ul.append(listItem);
        });
    }

    // 5. Actualizar los contadores en pantalla
    totalCountSpan.innerHTML = totalServices;
    totalMoneySpan.innerHTML = `$${totalMoney}`;

  } catch (error) {
    console.error("Error cargando servicios:", error);
    // Si hay error de autenticación (401), mandarlo al login
    if (error.response && error.response.status === 401) {
        window.location.href = '/login/';
    }
  }
})();

// Lógica de Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await axios.get('/api/logout');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        window.location.href = '/login/';
    } catch (error) {
        console.error(error);
        window.location.href = '/login/';
    }
});