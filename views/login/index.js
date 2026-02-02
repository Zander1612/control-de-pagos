const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const form = document.querySelector('#form');
const errorText = document.querySelector('#error-text');
const submitBtn = document.querySelector('#submit-button'); 

form.addEventListener('submit', async e => {
    e.preventDefault();
    
    errorText.innerHTML = '';
    if (submitBtn) submitBtn.disabled = true;

    try {
        const credentials = {
            email: emailInput.value,
            password: passwordInput.value
        };

        const { data } = await axios.post('/api/login', credentials);
        
        // 1. GUARDAR DATOS
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userName', data.name);
        
        localStorage.setItem('user', JSON.stringify({
            id: data.id,
            name: data.name,
            role: data.role
        }));

        // 2. REDIRECCIÓN SEGÚN EL ROL (Aquí estaba el fallo)
        if (data.role === 'admin') {
            window.location.href = '/admin/';
        } else {
            // Mandamos al mecánico a su propia carpeta
            window.location.href = '/users/';
        }

    } catch (error) {
        console.error("Error en el login:", error);
        if (submitBtn) submitBtn.disabled = false;
        
        if (error.response && error.response.data) {
            errorText.innerHTML = error.response.data.error;
            errorText.classList.add('text-red-500'); 
        } else {
            errorText.innerHTML = "Error de conexión";
        }
    }
});