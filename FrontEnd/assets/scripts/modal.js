let modal = null;
let onlyImages = [];

document.querySelectorAll('.js-modal').forEach((a) => {
    a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e);
    }
});

// Récupérer les projets depuis l'API
fetch('http://localhost:5678/api/works')
    .then((data) => data.json())
    .then((jsonListArticle) => {
        const articles = jsonListArticle;
        onlyImages = articles.map((article) => {
            return {
                id: article.id,
                url: article.imageUrl,
                alt: article.title,
            };
        });

        // Afficher tous les projets au chargement de la page
        affichageImages(onlyImages);
    });

function openModal(e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute('href'));
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

function closeModal(e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
}

function stopPropagation(e) {
    e.stopPropagation();
}

// Fonction pour afficher les images dans la galerie
function affichageImages(images) {
    const galleryElement = document.querySelector('.gallery-images');
    galleryElement.innerHTML = '';

    images.forEach((image) => {
        const figureElement = document.createElement('figure');
        const imgElement = document.createElement('img');
        imgElement.src = image.url;
        imgElement.alt = image.title;
        figureElement.appendChild(imgElement);
        const captionElement = document.createElement('p');
        captionElement.innerHTML = `<a href="#">Editer</a>`;

        figureElement.appendChild(captionElement);
        galleryElement.appendChild(figureElement);
    });
}
