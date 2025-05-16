//Toast Functionnnnnnnn
function showToast(message, type = "success") {
    const toastElement = document.getElementById('liveToast');
    const toastMsg = document.getElementById('toastMessage');

    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    toastMsg.textContent = message;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}
