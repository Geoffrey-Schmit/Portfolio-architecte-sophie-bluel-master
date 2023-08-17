// Fonction asynchrone pour gérer la connexion de l'utilisateur
async function connexionUser() {
    // Récupération de l'élément formulaire par son ID
    const formEl = document.getElementById('login-form');

    // Création d'un objet FormData pour collecter les données du formulaire
    const formData = new FormData(formEl);

    // Envoi d'une requête POST au serveur pour se connecter
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)), // Conversion des données du formulaire en objet JSON
    });

    // Vérification de la réponse du serveur
    if (response.status === 200) {
        // Si la connexion est réussie, récupération des informations de l'utilisateur depuis la réponse JSON
        const userInfos = await response.json();
        const token = JSON.stringify(userInfos.token);

        // Stockage du token et des informations de connexion dans la session
        localStorage.setItem('token', JSON.parse(token));
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('isLoggedOut', false);

        // Masquage des éléments liés à la déconnexion et affichage des éléments liés à la connexion
        const isLoggedOutList = document.querySelectorAll('.isLoggedOut');
        isLoggedOutList.forEach((outList) => {
            outList.hidden = true;
        });
        const isLoggedInList = document.querySelectorAll('.isLoggedIn');
        isLoggedInList.forEach((inList) => {
            inList.hidden = false;
        });

        // Redirection vers la page d'accueil
        window.location.href = '../../index.html';
    } else {
        // Si la connexion échoue, affichage d'une alerte et ajustement des valeurs dans la session
        alert("Le mot de passe et/ou l'e-mail est incorrecte");
        localStorage.setItem('isLoggedIn', false);
        localStorage.setItem('isLoggedOut', true);

        // Masquage des éléments liés à la connexion et affichage des éléments liés à la déconnexion
        const isLoggedOutList = document.querySelectorAll('.isLoggedOut');
        isLoggedOutList.forEach((outList) => {
            outList.hidden = false;
        });
        const isLoggedInList = document.querySelectorAll('.isLoggedIn');
        isLoggedInList.forEach((inList) => {
            inList.hidden = true;
        });
    }
}

// Fonction pour gérer la déconnexion de l'utilisateur
function deconnecter() {
    // Suppression des valeurs de connexion de la session
    localStorage.removeItem('isLoggedIn', false);
    localStorage.removeItem('isLoggedOut', true);

    // Masquage des éléments liés à la connexion et affichage des éléments liés à la déconnexion
    const isLoggedOutList = document.querySelectorAll('.isLoggedOut');
    isLoggedOutList.forEach((outList) => {
        outList.hidden = false;
    });
    const isLoggedInList = document.querySelectorAll('.isLoggedIn');
    isLoggedInList.forEach((inList) => {
        inList.hidden = true;
    });

    // Redirection vers la page d'accueil
    window.location.href = './index.html';
}
