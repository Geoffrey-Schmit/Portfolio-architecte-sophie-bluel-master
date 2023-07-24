let allImages = [];
let allCategories = [];

// Récupérer les catégories depuis l'API
fetch('http://localhost:5678/api/categories')
    .then((data) => data.json())
    .then((categories) => {
        setupFilterButtons(categories);
    });

// Récupérer les projets depuis l'API
fetch('http://localhost:5678/api/works')
    .then((data) => data.json())
    .then((jsonListArticle) => {
        const articles = jsonListArticle;
        allImages = articles.map((article) => {
            return {
                id: article.id,
                url: article.imageUrl,
                title: article.title,
                category: article.category,
            };
        });

        // Afficher tous les projets au chargement de la page
        displayImages(allImages);
    });

// Fonction pour afficher les images dans la galerie
function displayImages(images) {
    const galleryElement = document.querySelector('.gallery');
    galleryElement.innerHTML = '';

    images.forEach((image) => {
        const figureElement = document.createElement('figure');
        const imgElement = document.createElement('img');
        imgElement.src = image.url;
        imgElement.alt = image.title;

        const figcaptionElement = document.createElement('figcaption');
        figcaptionElement.textContent = image.title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);
        galleryElement.appendChild(figureElement);
    });
}

// Fonction pour filtrer les projets en fonction de la catégorie
function filterImages(categoryId) {
    if (categoryId === 'all') {
        displayImages(allImages);
    } else {
        const filteredImages = allImages.filter((image) => image.category.id === categoryId);

        displayImages(filteredImages);
    }
}

// Fonction pour créer les boutons de filtre avec les catégories
function setupFilterButtons(categories) {
    const filterButtonsContainer = document.getElementById('filterSearch');
    filterButtonsContainer.innerHTML = '';

    const allButton = createFilterButton('Reset', 'all');
    filterButtonsContainer.appendChild(allButton);

    categories.forEach((category) => {
        const button = createFilterButton(category.name, category.id);
        filterButtonsContainer.appendChild(button);
    });
}

// Fonction pour créer un bouton de filtre
function createFilterButton(label, category) {
    const button = document.createElement('button');
    button.classList.add('btn-filter');
    button.setAttribute('data-category', category);
    button.textContent = label;
    button.addEventListener('click', () => {
        filterImages(category);
    });
    return button;
}
