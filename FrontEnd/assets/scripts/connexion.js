function connexion() {
    // Récupérer les valeurs saisies par l'utilisateur
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Vérifier si les champs ne sont pas vides
    if (email.trim() === '' || password.trim() === '') {
        document.getElementById('message').innerText = 'Veuillez remplir tous les champs';
        return;
    }

    // Créer l'objet avec les données de la requête
    const requestData = {
        email: email,
        password: password,
    };

    // Effectuer la requête POST vers le serveur
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => response.json())
        .then((data) => {
            if ('userId' in data && 'token' in data) {
                // Authentification réussie
                document.getElementById('message').innerText = 'Connexion réussie!';
                // Stockage du token
                localStorage.setItem('authToken', data.token);
                // Rediriger l'utilisateur vers une autre page ici (Vérifiez le chemin).
                window.location.href = '../../index.html';
            } else {
                // Authentification échouée
                document.getElementById('message').innerText = 'Email ou mot de passe incorrect';
            }
        });
}
