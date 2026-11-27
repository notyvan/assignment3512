//About Dialog
//Opens the about dialog when the about button is clicked and closes it when the close button is clicked

export function setUpAboutDialog() {
    const dialog = document.querySelector("#about");

    document.querySelector("#about-btn").addEventListener("click", (e) => {
        e.preventDefault();
        dialog.showModal();
    });

    dialog.addEventListener("click", (e) => {
        if (e.target.classList.contains("about-close")) {
            dialog.close();
        }
    });
}