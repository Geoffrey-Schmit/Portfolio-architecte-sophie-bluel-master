/* Création de la modale */

let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = [];
let previouslyFocusedElement = null;

/* Création de la fonction openModal qui prend en paramètre l'événement. */
function openModal(e) {
    e.preventDefault(); // Empêche le comportement par défaut de l'événement
    modal = document.getElementById(e.target.getAttribute('href')); // Récupère la modale cible
    const focusableSelector = 'button, a, input, textarea';
    const focusables = Array.from(modal.querySelectorAll(focusableSelector)); // Récupère les éléments focusables dans la modale
    previouslyFocusedElement = document.querySelector(':focus'); // Garde une référence à l'élément en focus
    modal.style.display = null; // Affiche la modale
    focusables[0].focus(); // Donne le focus au premier élément focusable
    modal.removeAttribute('aria-hidden'); // Supprime l'attribut aria-hidden
    modal.setAttribute('aria-modal', 'true'); // Ajoute l'attribut aria-modal
    modal.querySelector('.closeModal').addEventListener('click', closeModal); // Ajoute un gestionnaire d'événement pour fermer la modale
    modal.querySelector('.closeModal').addEventListener('click', stopPropagation); // Ajoute un gestionnaire d'événement pour arrêter la propagation de l'événement
}

/* Création de la fonction closeModal qui prend en paramètre l'événement. */
function closeModal(e) {
    if (modal === null) return; // Si la modale n'existe pas, sort de la fonction
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus(); // Restaure le focus sur l'élément précédemment en focus
    e.preventDefault(); // Empêche le comportement par défaut de l'événement
    modal.style.display = 'none'; // Masque la modale
    modal.setAttribute('aria-hidden', 'true'); // Ajoute l'attribut aria-hidden pour l'accessibilité
    modal.removeAttribute('aria-modal'); // Supprime l'attribut aria-modal
    modal.removeEventListener('click', closeModal); // Supprime les gestionnaires d'événements
    modal.querySelector('.closeModal').removeEventListener('click', closeModal);
    modal.querySelector('.closeModal').removeEventListener('click', stopPropagation);
    modal = null; // Remet la référence de la modale à null
}

function stopPropagation(e) {
    e.stopPropagation();
}

//gestionnaire d'événements pour la touche "Escape" qui ferme la modale
function escapeModal(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e); // Appelle la fonction closeModal lorsque la touche "Echap" est enfoncée
    }
}

// Ajouter un gestionnaire d'événement de clic au bouton d'ouverture
document.querySelectorAll('.openModal').forEach((a) => {
    a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function (e) {
    escapeModal(e);
});

// Récupère les projets depuis l'API et les ajoute à la modale
async function getProjectModal() {
    fetch('http://localhost:5678/api/works')
        .then(function (response) {
            return response.json();
        })
        .then(function (projects) {
            const modalGallery = document.querySelector('.modalGallery');
            modalGallery.innerHTML = ''; // Efface le contenu précédent de la modale
            projects.forEach(function (project) {
                addProjectToModal(project); // Ajoute chaque projet à la modale
            });
        });
}

// Ajoute un projet à la modale
function addProjectToModal(project) {
    const modalGallery = document.querySelector('.modalGallery'); // Sélectionne l'élément de la modale où les projets seront ajoutés

    // Création d'un élément <figure> pour contenir les informations du projet
    const figure = document.createElement('figure');
    figure.classList.add('figureModal'); // Ajoute une classe CSS à la figure pour le style

    // Création d'un élément <img> pour afficher l'image du projet
    const img = document.createElement('img');
    img.classList.add('imgModal'); // Ajoute une classe CSS à l'image pour le style
    img.src = project.imageUrl; // Définit la source de l'image à partir des données du projet
    img.width = 100; // Définit la largeur de l'image à 100 pixels

    // Création d'un élément <figcaption> pour afficher le titre du projet
    const figcaption = document.createElement('figcaption');
    figcaption.classList.add('figCaption'); // Ajoute une classe au titre
    figcaption.alt = project.title; // Définit le texte alternatif de l'image
    figcaption.textContent = 'éditer'; // Définit le contenu texte de la légende

    // Création d'un élément <p> pour afficher l'ID de la catégorie du projet
    const categoryId = document.createElement('p');
    categoryId.src = project.categoryId; // Définit la source du contenu à partir des données du projet

    // Création d'un élément <i> pour afficher une icône de corbeille pour supprimer le projet
    const deleteWork = document.createElement('i');
    deleteWork.classList.add('deleteTrashIcon', 'fa', 'fa-solid', 'fa-trash-can'); // Ajoute des classes CSS pour les icônes et le style
    deleteWork.dataset.id = project.id; // Associe l'ID du projet aux données de l'icône

    // Ajout des éléments créés à la figure pour regrouper les informations du projet
    figure.append(img, figcaption, categoryId, deleteWork);

    // Ajout de la figure contenant les informations du projet à la galerie modale
    modalGallery.append(figure);
}

// Fonction pour supprimer un projet avec confirmation
async function deleteProjectWithConfirmation(e) {
    // Vérifie si l'élément déclenchant l'événement a la classe 'deleteTrashIcon'
    if (e.target.classList.contains('deleteTrashIcon')) {
        // Récupère l'ID du projet depuis l'attribut 'data-id'
        const projectId = e.target.dataset.id;

        // Affiche le jeton d'authentification stocké dans la session
        console.log(localStorage.getItem('token'));

        // Envoie une requête DELETE à l'API pour supprimer le projet avec l'ID spécifié
        const response = await fetch('http://localhost:5678/api/works/' + projectId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        // Si la requête est réussie (statut OK)
        if (response.ok) {
            // Affiche une boîte de dialogue de confirmation pour la suppression
            if (confirm("Voulez-vous supprimer l'image?") == true) {
                e.target.parentElement.remove(); // Supprime l'élément parent (le projet) de l'interface
                document.querySelector('.bouton-tous').click(); // Simule un clic pour actualiser la liste des projets
            } else {
                backToBasicModal; // Revenir à la modal de base en cas d'annulation de suppression
            }
        } else {
            console.log("Une erreur s'est produite lors de la suppression du projet.");
        }
    }
}

// Cette fonction ouvre la modal pour ajouter une image.
function addPicture(e) {
    e.preventDefault();
    let modalPhoto = document.querySelector('.modalPhoto');
    let modalAjout = document.querySelector('.modalAjout');
    modalPhoto.style.display = 'none';
    modalAjout.style.display = 'block';
    modalAjout.addEventListener('click', stopPropagation);
    modalAjout.addEventListener('click', changeBtnColor);
}

async function getCategoriesModal() {
    fetch('http://localhost:5678/api/categories', {
        method: 'get',
        headers: {
            accept: 'application/json',
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (category) {
            addCategoriesToModal(category);
        });

    //Ajout des catégories au DOM
    function addCategoriesToModal(categories) {
        const categoriePhotoContainer = document.getElementById('categoriePhoto');

        categories.forEach(function (category) {
            const filtres = document.createElement('option');
            filtres.dataset.id = category.id;
            filtres.value = category.name;
            filtres.innerHTML = category.name;
            categoriePhotoContainer.appendChild(filtres);
        });
    }
}

// Fonction pour valider et gérer l'image téléchargée
function validateImageProject() {
    // Récupère les éléments du DOM nécessaires pour la validation d'image
    let ajoutPhotoBouton = document.getElementById('ajoutPhotoBtn');
    let ajoutPhotoLabel = document.getElementById('ajoutPhotoLabel');
    let imgContainer = document.getElementById('imgContainer');

    // Si aucun fichier n'a été sélectionné, la validation est terminée
    if (ajoutPhotoBouton.files.length == 0) {
        return;
    } else {
        // Si le type de fichier est valide (vérifié avec la fonction validFileType)
        if (validFileType(ajoutPhotoBouton.files[0].type)) {
            // Si la taille de fichier est supérieur à 4 Mo
            if (ajoutPhotoBouton.files[0].size > 4000000) {
                alert('Photo trop volumineuse'); // Affiche une alerte pour une photo trop grande
            } else {
                // Crée un élément <img> pour afficher l'aperçu de l'image téléchargée
                const imgFile = document.createElement('img');
                let imgErrorMessage = document.createElement('span');

                imgFile.setAttribute('id', 'imgPreview'); // Définit l'ID pour l'élément img
                imgFile.setAttribute('alt', "Aperçu de l'image sélectionnée"); // Texte alternatif pour l'image

                imgErrorMessage.classList.add('imgErrorMessage'); // Ajoute une classe CSS pour le style

                // Ajoute l'élément img et le message d'erreur à imgContainer
                imgContainer.appendChild(imgFile, imgErrorMessage);

                imgFile.src = URL.createObjectURL(ajoutPhotoBouton.files[0]); // Définit la source de l'image
                imgFile.className = 'img-uploaded'; // Ajoute une classe CSS pour le style
                ajoutPhotoLabel.style.display = 'none'; // Cache l'étiquette de téléchargement
                let ajoutPhotoIcon = document.getElementById('ajoutPhotoIcon');
                ajoutPhotoIcon.style.display = 'none'; // Cache l'icône de téléchargement
                let pContainer = document.getElementById('pContainer');
                pContainer.style.display = 'none'; // Cache le paragraphe de notification

                // Vérifie si un message d'erreur pour l'image existe déjà
                let imgErrorMessageExists = document.querySelector('.imgErrorMessage');
                if (imgErrorMessageExists) {
                    imgErrorMessageExists.remove(); // Supprime le message d'erreur précédent s'il existe
                }
            }
        } else {
            alert('Format non accepté'); // Affiche une alerte pour un format de fichier non accepté
        }
    }
}

// Tableau des types de fichiers d'images acceptés
const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

// Fonction pour valider le type de fichier
function validFileType(type) {
    // Vérifie si le type de fichier passé en argument est présent dans le tableau des types acceptés
    if (fileTypes.indexOf(type) > -1) {
        return true; // Le type de fichier est valide
    } else {
        return false; // Le type de fichier n'est pas valide
    }
}

function validateTitleProject() {
    let inputTitle = document.getElementById('titrePhoto');
    let errors = false;

    if (inputTitle.value == '') {
        titleErrorMessage.innerText = 'Veuillez mettre un titre valide.';
        inputTitle.classList.add('inputError');
        errors = true;
    } else {
        titleErrorMessage.innerText = '';
        inputTitle.classList.remove('inputError');
        errors = false;
    }
    return errors;
}

// Fonction pour valider la présence d'un fichier sélectionné dans le formulaire
function validateFileProject() {
    let errors = false;

    // Vérifie si des fichiers ont été sélectionnés dans le champ de téléchargement
    if (document.getElementById('ajoutPhotoBtn').files.length === 0) {
        errors = true; // Indique qu'il y a une erreur
        alert('Veuillez sélectionner un fichier.'); // Affiche une alerte pour l'utilisateur
    } else {
        errors = false; // Aucune erreur si un fichier a été sélectionné
    }

    return errors; // Retourne le statut des erreurs
}

// Fonction pour valider et soumettre le formulaire de projet
async function validateFormProject() {
    // Récupère l'image téléchargée, le titre et la catégorie sélectionnée du formulaire
    const imgUploaded = document.getElementById('ajoutPhotoBtn').files[0];
    const inputTitle = document.getElementById('titrePhoto').value;
    const selectCategorie = document.getElementById('categoriePhoto');
    const categoriePhotoId = selectCategorie.options[selectCategorie.selectedIndex].dataset.id;

    // Appelle les fonctions de validation du titre et du fichier
    validationTitle = validateTitleProject();
    validationFile = validateFileProject();

    // Si les validations de titre et de fichier sont réussies
    if (validationFile === false && validationTitle === false) {
        // Crée un objet FormData pour les données du formulaire
        const formData = new FormData();
        formData.append('image', imgUploaded); // Ajoute l'image
        formData.append('title', inputTitle); // Ajoute le titre
        formData.append('category', categoriePhotoId); // Ajoute l'ID de la catégorie

        // Envoie une requête POST pour ajouter le projet à l'API
        let response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
            body: formData,
        });

        // Si la requête est réussie (statut 200 ou 201)
        if (response.status === 200 || response.status === 201) {
            alert("L'ajout de l'image a été réalisé avec succès");
            document.querySelector('.bouton-tous').click(); // Simule un clic pour actualiser la liste des projets
            clearForm(); // Appelle la fonction pour nettoyer le formulaire
            getProjectModal(); // Appelle la fonction pour récupérer les projets mis à jour
        } else if (response.status === 401 || response.status === 400) {
            alert('Veuillez ajouter un titre ou une image');
            console.log('Action impossible');
        }
    }
}

function clearForm() {
    document.getElementById('ajoutPhoto-form').reset();

    const userFile = document.getElementById('ajoutPhotoBtn');
    const inputTitle = document.getElementById('titrePhoto');
    const imgUploaded = document.getElementById('imgPreview');
    imgUploaded.remove(); // Supprime l'aperçu de l'image téléchargée
    userFile.value = ''; // Réinitialise le champ de téléchargement de fichier
    inputTitle.value = ''; // Réinitialise le champ de titre
    let ajoutPhotoLabel = document.getElementById('ajoutPhotoLabel');
    ajoutPhotoLabel.style.display = 'block'; // Réaffiche l'étiquette de téléchargement de fichier
    let ajoutPhotoIcon = document.getElementById('ajoutPhotoIcon');
    ajoutPhotoIcon.style.display = 'block'; // Réaffiche l'icône de téléchargement
    let pContainer = document.getElementById('pContainer');
    pContainer.style.display = 'block'; // Réaffiche le paragraphe de notification
    changeBtnColor(); // Appelle la fonction pour changer la couleur du bouton de validation
}

//Changement de couleur du bouton validé
function changeBtnColor() {
    const validerBtn = document.getElementById('validerBtn');
    let inputTitle = document.getElementById('titrePhoto');

    if (ajoutPhotoBouton.files.length === 0 || inputTitle.value === '') {
        validerBtn.classList.add('validerBtnFalse');
    } else {
        validerBtn.classList.remove('validerBtnFalse');
    }
}

// Si l'utilisateur appuie sur la fèche alors retour à la modal d'éditon et supression initiale
function backToBasicModal() {
    let modalPhoto = document.querySelector('.modalPhoto');
    let modalAjout = document.querySelector('.modalAjout');
    modalPhoto.style.display = 'block';
    modalAjout.style.display = 'none';
    clearForm();
}
