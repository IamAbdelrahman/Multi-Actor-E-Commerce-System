const modal = document.getElementById("Thing");
const Icon = document.getElementById("Thing-Icon");
const closeBtn = document.getElementById("closepopup");


icon.onclick = () => modal.classList.remove('d-none');
closeBtn.onclick = () => modal.classList.add('d-none');
window.onclick = (e) => {
    if (e.target === modal) modal.classList.add('d-none');
}