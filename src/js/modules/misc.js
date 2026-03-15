export const initPreloads = () => {

    const preloads = document.querySelectorAll('.preload');

    if (!preloads) {
        return;
    }


    window.addEventListener("load", () => {
        preloads.forEach(elem => {
            elem.classList.remove('preload');
        });
    });

}