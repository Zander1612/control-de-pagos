import { createNotification } from '../components/notification.js';

//Validation Patterns (Regex)
const EMAIL_VALIDATION = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/;
const NAME_VALIDATION = /^[a-zA-ZÀ-ÿ\s]{5,40}$/;

//DOM Elements
const form = document.querySelector('#form');
const nameInput = document.querySelector('#name-input');
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const matchInput = document.querySelector('#match-input');
const formBtn = document.querySelector('#form-btn');
const notification = document.querySelector('#notification');

// Validation State
let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let matchValidation = false;

// Validation Function
const validation = (input, regexValidation) => {

    formBtn.disabled = nameValidation && emailValidation && passwordValidation && matchValidation ? false : true;

    if (input.value === '') {
        input.classList.remove('outline-red-700', 'outline-2', 'outline');
        input.classList.remove('outline-green-700', 'outline-2', 'outline');
        input.classList.add('focus:outline-indigo-700');
    } else if (regexValidation) {
        input.classList.remove('focus:outline-indigo-700');
        input.classList.add('outline-green-700', 'outline-2', 'outline');
    } else if (!regexValidation) {
        input.classList.remove('focus:outline-indigo-700');
        input.classList.remove('outline-green-700', 'outline-2', 'outline');
        input.classList.add('outline-red-700', 'outline-2', 'outline');
    };
}

// Name Input
nameInput.addEventListener('input', e => {
    nameValidation = NAME_VALIDATION.test(e.target.value);
    validation(nameInput, nameValidation);  
})

// Email Input
emailInput.addEventListener('input', e => {
    emailValidation = EMAIL_VALIDATION.test(e.target.value);
    validation(emailInput, emailValidation);  
})

// Password Input
passwordInput.addEventListener('input', e => {
    passwordValidation = PASSWORD_VALIDATION.test(e.target.value);
    validation(passwordInput, passwordValidation);
    matchValidation = (e.target.value === matchInput.value) && (matchInput.value !== '');
    validation(matchInput, matchValidation);
})

// Confirm Password Input
matchInput.addEventListener('input', e => {
    matchValidation = (e.target.value === passwordInput.value) && (e.target.value !== '');
    validation(matchInput, matchValidation);
})

//Submit Form
form.addEventListener('submit', async e => {
    e.preventDefault();

    try {
        // Crear el nuevo usuario
        const newUser = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        }

        // Limpiar el formulario
        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        matchInput.value = '';

        // Resetear las validaciones
        validation(nameInput, false);
        validation(emailInput, false);
        validation(passwordInput, false);
        validation(matchInput, false);
        
        
        // Enviar el usuario al servidor
        const {data} = await axios.post('/api/users', newUser);
        
        // Mostrar notificación
        createNotification(false, data);
        setTimeout(() => {
            notification.innerHTML = '';
        }, 4000);

    } catch (error) {
        // Mostrar notificación de error
        createNotification(true, error.response.data.error);
        setTimeout(() => {
            notification.innerHTML = '';
        }, 4000);
    }

});
