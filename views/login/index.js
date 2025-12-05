form.addEventListener('submit', async e => {
    e.preventDefault();
    errorText.textContent = '';

    try {
        const user = {
            email: emailInput.value,
            password: passwordInput.value
        };

        const response = await axios.post('/api/login', user);

        const role = response.data.role;

        if (!role) {
            throw new Error("El backend no devolvió el rol");
        }

        // Redirecciones según rol
        if (role === "admin") {
            window.location.href = "/admin/dashboard/index.html";
        } else {
            window.location.href = "/user/home/index.html";
        }

    } catch (error) {
        console.log(error);
        errorText.textContent = error.response?.data?.error || "Error inesperado";
    }
});
