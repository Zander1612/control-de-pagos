// Ejemplo de lógica para el formulario
const montoInput = document.querySelector('#monto-cobrado');
const servicioSelect = document.querySelector('#tipo-servicio');
const previewPago = document.querySelector('#preview-pago');

const calcularPreview = () => {
    const monto = parseFloat(montoInput.value) || 0;
    // Extraemos el porcentaje del texto del select (ej: "Frenos (50%)")
    const porcentajeMatch = servicioSelect.value.match(/(\d+)%/);
    const porcentaje = porcentajeMatch ? parseInt(porcentajeMatch[1]) : 0;
    
    const pagoMecanico = monto * (porcentaje / 100);
    previewPago.innerText = `Pago estimado al mecánico: $${pagoMecanico.toFixed(2)}`;
};

montoInput.addEventListener('input', calcularPreview);
servicioSelect.addEventListener('change', calcularPreview);