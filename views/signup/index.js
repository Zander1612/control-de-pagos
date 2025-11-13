const userRegex = /^(?=.*[a-z])(?=.*[0-9]).{6,16}$/;
const emailRegex = /^\S+@\S+\.\S{3,4}$/;
const phonenumberRegex = /^[0-9]{6,16}$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,16}$/;

const countries = document.querySelector("#countries");
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const phoneCode = document.querySelector("#phonecode");
const phoneInput = document.querySelector("#phone");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const formBtn = document.querySelector("#form-btn");
const form = document.querySelector("#form");

// Estados de validación
let usernameValidation = false;
let emailValidation = false;
let phoneValidation = false;
let passwordValidation = false;
let confirmPasswordValidation = false;
let countriesValidation = false;

const validation = (e, validation, element) => {
  const information = e.target.parentElement.children[1];
  formBtn.disabled = !(
    usernameValidation &&
    emailValidation &&
    phoneValidation &&
    passwordValidation &&
    confirmPasswordValidation &&
    countriesValidation
  );

  if (validation) {
    element.classList.add("border-green-500");
    element.classList.remove("border-red-500");
    information.classList.remove("text-red-500");
  } else {
    element.classList.add("border-red-500");
    element.classList.remove("border-green-500");
    information.classList.add("text-red-500");
  }
};

// ✅ Genera automáticamente el código del país
countries.addEventListener("change", (e) => {
  const selected = e.target.value;
  phoneCode.value = `+${selected}`;
  countriesValidation = selected !== "";
  validation(e, countriesValidation, countries);
});

// Nombre de usuario
usernameInput.addEventListener("input", (e) => {
  usernameValidation = userRegex.test(e.target.value);
  validation(e, usernameValidation, usernameInput);
});

// Email
emailInput.addEventListener("input", (e) => {
  emailValidation = emailRegex.test(e.target.value);
  validation(e, emailValidation, emailInput);
});

// Teléfono
phoneInput.addEventListener("input", (e) => {
  phoneValidation = phonenumberRegex.test(e.target.value);
  validation(e, phoneValidation, phoneInput);
});

// Contraseña
passwordInput.addEventListener("input", (e) => {
  passwordValidation = passwordRegex.test(e.target.value);
  validation(e, passwordValidation, passwordInput);
});

// Confirmar contraseña
confirmPasswordInput.addEventListener("input", (e) => {
  confirmPasswordValidation = e.target.value === passwordInput.value;
  validation(e, confirmPasswordValidation, confirmPasswordInput);
});

// Envío del formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = {
    username: usernameInput.value,
    email: emailInput.value,
    phone: `${phoneCode.value} ${phoneInput.value}`,
    password: passwordInput.value,
  };

  console.log(user);
  alert(`Datos enviados:\nUsuario: ${user.username}\nEmail: ${user.email}\nTeléfono: ${user.phone}`);
});
