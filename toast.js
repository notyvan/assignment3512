//Toast Notifications

let toastTimer = null;

export function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.remove("hidden");

    //if toast is already visible, reset the timer
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}



