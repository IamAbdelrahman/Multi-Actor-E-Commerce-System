//PopUp JS
document.addEventListener("DOMContentLoaded", () => {
    // Load modal from external file
    fetch('#')
        .then(response => response.text())
        .then(html => {
            document.getElementById('modalContainer').innerHTML = html;

            const modal = document.getElementById("Thing");
            const icon = document.getElementById("Thing-Icon");
            const closeBtn = document.getElementById("closepopup");

            if (icon && modal && closeBtn) {
                icon.onclick = () => modal.classList.remove('d-none');
                closeBtn.onclick = () => modal.classList.add('d-none');
                window.onclick = (e) => {
                    if (e.target === modal) modal.classList.add('d-none');
                };
            }
        })
});

