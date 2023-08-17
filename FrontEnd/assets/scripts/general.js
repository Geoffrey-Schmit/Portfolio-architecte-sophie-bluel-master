// Fonction pour obtenir les projets en fonction d'un événement de clic
function getProject(event) {
    // Sélection de la div avec la classe "gallery" pour afficher les projets
    const divGallery = document.querySelector('.gallery');
    divGallery.innerHTML = ''; // Effacer le contenu précédent de la galerie

    // Appel à l'API pour obtenir les projets
    fetch('http://localhost:5678/api/works')
        .then(function (response) {
            return response.json(); // Convertir la réponse en JSON
        })
        .then(function (projects) {
            // Filtrer les projets en fonction de la catégorie sélectionnée ou de toutes les catégories
            const travauxObjets = projects.filter(function (travaux) {
                if (event.target.dataset.id >= 1) {
                    return travaux.categoryId == event.target.dataset.id;
                } else {
                    return travaux.categoryId >= 1;
                }
            });

            // Parcourir les projets filtrés et créer des éléments HTML pour les afficher
            travauxObjets.forEach(function (project) {
                const div = document.createElement('div');
                div.classList.add(['cartesBody']); // Ajouter une classe CSS

                const figureCaption = document.createElement('figcaption');
                figureCaption.className = 'figureGallery'; // Ajouter une classe CSS
                const image = document.createElement('img');
                image.src = project.imageUrl;
                figureCaption.append(image);
                div.append(image);
                const h3 = document.createElement('h3');
                h3.innerText = project.title;
                div.append(h3);
                divGallery.append(div); // Ajouter l'élément div à la galerie
            });
        })
        .catch(function (error) {
            console.log('Erreur : ' + error);
        });
}

// Fonction asynchrone pour obtenir les catégories
async function getCategory() {
    const divCategory = document.querySelector('.categories'); // Sélection de la div des catégories

    // Appel à l'API pour obtenir les catégories
    await fetch('http://localhost:5678/api/categories')
        .then(function (response) {
            return response.json(); // Convertir la réponse en JSON
        })
        .then(function (categories) {
            // Création d'un bouton "Tous" pour afficher tous les projets
            const boutonTous = document.createElement('button');
            boutonTous.classList.add('bouton-tous'); // Ajouter des classes CSS
            boutonTous.classList.add('filtres');
            boutonTous.innerText = 'Tous';
            boutonTous.dataset.id = 0;
            boutonTous.onclick = (event) => getProject(event);
            divCategory.append(boutonTous); // Ajouter le bouton à la div des catégories

            // Parcourir les catégories et créer des boutons pour filtrer les projets
            categories.forEach(function (category) {
                const button = document.createElement('button');
                button.classList.add('filtres'); // Ajouter une classe CSS
                button.dataset.id = category.id;
                button.innerText = category.name;
                button.onclick = (event) => getProject(event);
                divCategory.append(button); // Ajouter le bouton à la div des catégories
            });
        });

    // Sélection de tous les éléments avec la classe 'filtres' dans la div des catégories
    const elements = divCategory.querySelectorAll('.filtres');

    // Ajouter un écouteur de clic à chaque bouton de filtre pour activer/désactiver les classes CSS
    elements.forEach((element) => {
        element.addEventListener('click', () => {
            // Supprimer la classe 'activated' de tous les éléments
            elements.forEach((element) => {
                element.classList.remove('activated');
            });
            // Ajouter la classe 'activated' à l'élément cliqué
            element.classList.add('activated');
        });
    });
}
