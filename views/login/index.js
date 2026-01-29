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
        const user = {
            email: emailInput.value,
            password: passwordInput.value
        };

       
        const { data } = await axios.post('/api/login', user);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('token', data.token);

    
        if (data.role === 'admin') {
            window.location.href = '/admin/'; 
        } else {
            window.location.href = '/users/'; 
        }

    } catch (error) {
        console.error("Error en el login:", error);
        
        
        if (submitBtn) submitBtn.disabled = false;
        if (error.response && error.response.data) {
            errorText.innerHTML = error.response.data.error;
            errorText.classList.add('text-red-500'); 
        } else {
            errorText.innerHTML = "Error de conexión: El servidor no responde.";
        }
    }
});