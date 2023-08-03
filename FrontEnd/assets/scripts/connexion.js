function connexion() {
    // Récupérer les valeurs saisies par l'utilisateur
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email.trim() === '' || password.trim() === '') {
        document.getElementById('message').innerText = 'Veuillez remplir tous les champs';
        return;
    }

    const requestData = {
        email: email,
        password: password,
    };

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
                document.getElementById('message').innerText = 'Connexion réussie!';

                window.location.href = '../pages/homepage_edit.html';
            } else {
                document.getElementById('message').innerText = 'Email ou mot de passe incorrect';
            }
        });
}
