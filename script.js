// ==========================================
// QUIZFLASH - APPLICATION DE FICHES
// ==========================================


// ==========================================
// 1. DONNÉES DE DÉPART
// ==========================================

// On récupère les fiches sauvegardées dans le navigateur.
// S'il n'y en a pas, on utilise ces fiches par défaut.
let flashcards = JSON.parse(localStorage.getItem("quizFlashCards")) || [
    {
        question: "Qu'est-ce que HTML ?",
        answer: "HTML est le langage utilisé pour structurer le contenu d'une page web."
    },
    {
        question: "Qu'est-ce que CSS ?",
        answer: "CSS est un langage utilisé pour mettre en forme et styliser une page web."
    },
    {
        question: "Qu'est-ce que JavaScript ?",
        answer: "JavaScript est un langage de programmation qui permet de rendre une page web interactive."
    }
];


// ==========================================
// 2. VARIABLES
// ==========================================

// Indique quelle fiche est actuellement affichée.
let currentIndex = 0;

// Indique si nous sommes en train de modifier une fiche.
let editingIndex = null;


// ==========================================
// 3. RÉCUPÉRATION DES ÉLÉMENTS HTML
// ==========================================

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const answerText = document.getElementById("answerText");

const showAnswerBtn = document.getElementById("showAnswerBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const cardCounter = document.getElementById("cardCounter");

const addBtn = document.getElementById("addBtn");

const formContainer = document.getElementById("formContainer");

const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");

const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const toast = document.getElementById("toast");

function showToast(message, type = "success") {
    toast.textContent = message;

    toast.className = "toast";
    toast.classList.add(type);
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// ==========================================
// 4. SAUVEGARDER LES FICHES
// ==========================================

function saveCards() {

    localStorage.setItem(
        "quizFlashCards",
        JSON.stringify(flashcards)
    );
}


// ==========================================
// 5. AFFICHER UNE FICHE
// ==========================================

function displayCard() {

    // S'il n'y a aucune fiche
    if (flashcards.length === 0) {

        question.textContent = "Aucune fiche disponible";

        answerText.textContent =
            "Ajoute une nouvelle fiche pour commencer.";

        cardCounter.textContent = "0 / 0";

        showAnswerBtn.classList.add("hidden");

        editBtn.classList.add("hidden");
        deleteBtn.classList.add("hidden");

        answer.classList.add("hidden");

        return;
    }


    // On récupère la fiche actuelle
    const card = flashcards[currentIndex];
    // Mise à jour de la progression
    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");

    const progress = ((currentIndex + 1) / flashcards.length) * 100;

    progressText.textContent = `${Math.round(progress)}%`;
    progressFill.style.width = `${progress}%`;

    // Afficher la question
    question.textContent = card.question;


    // Afficher la réponse
    answerText.textContent = card.answer;
    question.classList.remove("card-animate");
answerText.classList.remove("card-animate");

void question.offsetWidth;
void answerText.offsetWidth;

question.classList.add("card-animate");
answerText.classList.add("card-animate");


    // Cacher la réponse lorsqu'on change de fiche
    answer.classList.add("hidden");


    // Modifier le texte du bouton
    showAnswerBtn.textContent = "👁️ Afficher la réponse";

    showAnswerBtn.classList.remove("hidden");


    // Compteur
    cardCounter.textContent =
        `${currentIndex + 1} / ${flashcards.length}`;


    // Afficher les boutons
    editBtn.classList.remove("hidden");
    deleteBtn.classList.remove("hidden");
}


// ==========================================
// 6. AFFICHER / CACHER LA RÉPONSE
// ==========================================

showAnswerBtn.addEventListener("click", function () {

    if (answer.classList.contains("hidden")) {

        answer.classList.remove("hidden");

        showAnswerBtn.textContent =
            "🙈 Masquer la réponse";

    } else {

        answer.classList.add("hidden");

        showAnswerBtn.textContent =
            "👁️ Afficher la réponse";
    }
});


// ==========================================
// 7. BOUTON SUIVANT
// ==========================================

nextBtn.addEventListener("click", function () {

    if (flashcards.length === 0) {
        return;
    }

    currentIndex++;

    // Retourner à la première fiche
    if (currentIndex >= flashcards.length) {
        currentIndex = 0;
    }

    displayCard();
});


// ==========================================
// 8. BOUTON PRÉCÉDENT
// ==========================================

prevBtn.addEventListener("click", function () {

    if (flashcards.length === 0) {
        return;
    }

    currentIndex--;

    // Aller à la dernière fiche
    if (currentIndex < 0) {
        currentIndex = flashcards.length - 1;
    }

    displayCard();
});


// ==========================================
// 9. OUVRIR LE FORMULAIRE
// ==========================================

addBtn.addEventListener("click", function () {

    editingIndex = null;

    questionInput.value = "";
    answerInput.value = "";

    formContainer.classList.remove("hidden");

    questionInput.focus();
});


// ==========================================
// 10. ANNULER LE FORMULAIRE
// ==========================================

cancelBtn.addEventListener("click", function () {

    formContainer.classList.add("hidden");

    questionInput.value = "";
    answerInput.value = "";

    editingIndex = null;
});


// ==========================================
// 11. AJOUTER OU MODIFIER UNE FICHE
// ==========================================

saveBtn.addEventListener("click", function () {

    const newQuestion = questionInput.value.trim();
    const newAnswer = answerInput.value.trim();


    // Vérifier que les champs sont remplis
    if (newQuestion === "" || newAnswer === "") {

        showToast("⚠️ Veuillez remplir la question et la réponse.", "error");

        return;
    }


    // Si editingIndex contient une valeur,
    // on modifie une fiche existante.
    if (editingIndex !== null) {

        flashcards[editingIndex] = {
            question: newQuestion,
            answer: newAnswer
        };

        currentIndex = editingIndex;

        showToast("✅ Fiche modifiée avec succès.");

    } else {

        // Sinon, on crée une nouvelle fiche.
        flashcards.push({
            question: newQuestion,
            answer: newAnswer
        });

        // Afficher la nouvelle fiche
        currentIndex = flashcards.length - 1;

       showToast("✅ Fiche ajoutée avec succès.");
    }


    // Sauvegarder
    saveCards();


    // Fermer le formulaire
    formContainer.classList.add("hidden");

    questionInput.value = "";
    answerInput.value = "";

    editingIndex = null;


    // Actualiser l'affichage
    displayCard();
});


// ==========================================
// 12. MODIFIER UNE FICHE
// ==========================================

editBtn.addEventListener("click", function () {

    if (flashcards.length === 0) {
        return;
    }


    // Mémoriser la fiche que nous voulons modifier
    editingIndex = currentIndex;


    // Mettre les anciennes données dans le formulaire
    questionInput.value =
        flashcards[currentIndex].question;

    answerInput.value =
        flashcards[currentIndex].answer;


    // Afficher le formulaire
    formContainer.classList.remove("hidden");

    questionInput.focus();
});


// ==========================================
// 13. SUPPRIMER UNE FICHE
// ==========================================

deleteBtn.addEventListener("click", function () {

    if (flashcards.length === 0) {
        return;
    }


    const confirmation = confirm(
        "⚠️ Voulez-vous vraiment supprimer cette fiche ?"
    );


    if (!confirmation) {
        return;
    }


    // Supprimer la fiche
    flashcards.splice(currentIndex, 1);


    // Ajuster l'index
    if (currentIndex >= flashcards.length) {
        currentIndex = flashcards.length - 1;
    }


    // Sauvegarder
    saveCards();


    // Actualiser
    displayCard();


    showToast("🗑️ Fiche supprimée.");
});


// ==========================================
// 14. INITIALISATION
// ==========================================

// Afficher la première fiche au lancement.
displayCard();