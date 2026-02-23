const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const btnScan = document.getElementById('btn-scan');
const statusText = document.getElementById('status');
const gallery = document.getElementById('gallery');

// 1. Démarrer la caméra au chargement
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; })
    .catch(err => { console.error("Erreur caméra: ", err); });

// 2. Fonction pour scanner
btnScan.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir l'image en texte (Base64) pour le LocalStorage
    const photoData = canvas.toDataURL('image/jpeg', 0.5);

    identifierPersonne(photoData);
});

function identifierPersonne(photo) {
    // Récupérer les données existantes
    let database = JSON.parse(localStorage.getItem('user_db')) || [];
    
    // Pour cet exemple, on simule une reconnaissance :
    // On demande à l'utilisateur s'il se reconnaît (puisqu'on n'a pas d'IA de comparaison ici)
    const connu = confirm("Est-ce une personne déjà enregistrée ?");

    if (!connu) {
        const prenom = prompt("Nouvelle personne ! Quel est ton prénom ?");
        if (prenom) {
            database.push({ nom: prenom, photos: [photo] });
            statusText.innerText = `Enregistré : ${prenom}`;
        }
    } else {
        const prenomRecherche = prompt("Quel est le prénom de la personne ?");
        let user = database.find(u => u.nom.toLowerCase() === prenomRecherche.toLowerCase());
        
        if (user) {
            user.photos.push(photo);
            statusText.innerText = `Photo ajoutée au dossier de ${user.nom}`;
        } else {
            alert("Prénom inconnu dans la base.");
        }
    }

    // Sauvegarder et mettre à jour l'affichage
    localStorage.setItem('user_db', JSON.stringify(database));
    afficherDossier();
}

function afficherDossier() {
    gallery.innerHTML = "";
    let database = JSON.parse(localStorage.getItem('user_db')) || [];
    database.forEach(user => {
        user.photos.forEach(p => {
            const img = document.createElement('img');
            img.src = p;
            img.className = "img-stored";
            img.title = user.nom;
            gallery.appendChild(img);
        });
    });
}

// Charger la galerie au démarrage
afficherDossier();
