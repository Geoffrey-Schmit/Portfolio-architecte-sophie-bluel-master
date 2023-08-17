// Attend que la fenêtre soit complètement chargée avant d'exécuter du code
window.addEventListener('load', function () {
    // Vérifie si l'utilisateur est connecté ou déconnecté
    let isLoggedIn = localStorage.getItem('isLoggedIn');
    let isLoggedOut = localStorage.getItem('isLoggedOut');

    // Affiche les éléments avec la classe 'isLoggedIn' si l'utilisateur est connecté
    if (isLoggedIn) {
        const isLoggedInList = document.querySelectorAll('.isLoggedIn');
        isLoggedInList.forEach((inList) => {
            inList.style.display = 'flex';
        });
    }

    // Masque les éléments avec la classe 'isLoggedOut' si l'utilisateur est déconnecté
    if (isLoggedOut) {
        const isLoggedOutList = document.querySelectorAll('.isLoggedOut');
        isLoggedOutList.forEach((outList) => {
            outList.style.display = 'none';
        });
    }
});

// Écouteur d'événement pour le changement de fichier dans l'input de téléchargement
const fileInput = document.getElementById('ajoutPhotoBtn');
fileInput.onchange = () => {
    const selectedFile = fileInput.files[0];
};

// Écouteur d'événement pour le bouton de déconnexion
document.getElementById('logout').addEventListener('click', function (event) {
    event.preventDefault();

    deconnecter(); // Appelle la fonction de déconnexion
});

// Écouteur d'événement lorsque la fenêtre est complètement chargée
window.addEventListener('load', async () => {
    await getCategory(); // Appelle la fonction pour récupérer les catégories

    document.querySelector('.bouton-tous').click(); // Simule un clic sur un bouton
    const arrowBack = document.getElementById('arrowBack');
    arrowBack.addEventListener('click', backToBasicModal); // Associe une fonction à l'événement clic

    getProjectModal(); // Appelle la fonction pour récupérer les projets
    getCategoriesModal(); // Appelle la fonction pour récupérer les catégories

    document.addEventListener('click', deleteProjectWithConfirmation); // Associe une fonction à l'événement clic

    const ajoutButton = document.getElementById('ajout-image');
    ajoutButton.addEventListener('click', addPicture); // Associe une fonction à l'événement clic
    ajoutButton.addEventListener('click', changeBtnColor); // Associe une fonction à l'événement clic
});

// Écouteur d'événement pour le changement de fichier dans l'input de téléchargement
let ajoutPhotoBouton = document.getElementById('ajoutPhotoBtn');
ajoutPhotoBouton.addEventListener('change', () => {
    validateImageProject(); // Appelle la fonction pour valider l'image
});

// Écouteur d'événement pour la saisie dans le champ de titre
titrePhoto.addEventListener('input', (e) => {
    validateTitleProject(e); // Appelle la fonction pour valider le titre
});

// Écouteur d'événement pour le clic sur le bouton de soumission
const submitPhoto = document.getElementById('validerBtn');
submitPhoto.addEventListener('click', (e) => {
    e.preventDefault();
    validateFormProject(); // Appelle la fonction pour valider le formulaire du projet
});
