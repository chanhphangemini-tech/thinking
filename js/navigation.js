function toggleNav() {
    document.body.classList.toggle('nav-active');
}

document.addEventListener('DOMContentLoaded', () => {
    // Close nav when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-active');
        });
    });
});
