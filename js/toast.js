//Toast Functionnnnnnnn
export function showToast(message, type = "success") {
    const toastElement = document.getElementById('liveToast');
    const toastMsg = document.getElementById('toastMessage');
    const closeBtn = toastElement.querySelector('.btn-close');

    const textColor = type === "warning" ? "text-dark" : "text-white";
    const closeBtnClass = type === "warning" ? "btn-close" : "btn-close btn-close-white";

    // Apply styles
    toastElement.className = `toast align-items-center ${textColor} bg-${type} border-0`;
    toastMsg.textContent = message;
    closeBtn.className = closeBtnClass + " me-2 m-auto";


    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}
