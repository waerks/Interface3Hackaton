let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create
    },
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

let game = new Phaser.Game(config);
let questionIndex = -1;
let questions;
let shuffledQuestions; // Ajouter une variable pour les questions mélangées
let answerPanelImage = [];
let starImage = [];
let score = 0;
let nextQuestionImage,
    logoImage;
let questionText;
let answerText = [];
let restartImage;
let wowText;
let initialAnswerTextPositions = [];
const totalQuestions = 5; // Limiter à 5 questions

// Update the Favicon of the page with an SVG file
let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
link.type = 'image/svg+xml'; // Set the type for SVG
link.rel = 'icon'; // Use 'icon' for SVG
link.href = './assets/Icons/sprout.svg'; // Replace 'path_to_your_favicon.svg' with the actual path to your SVG file
document.getElementsByTagName('head')[0].appendChild(link);

let goodAnswerSound;
let wrongAnswerSound;
let playButtonSound;
let nextButtonSound;
let restartButtonSound;
let growingPlantSound;

function preload() {
    this
        .load
        .image('background', './assets/Sprites/background.jpg');
    this
        .load
        .image('questionpanel', './assets/Sprites/Label1.png');
    this
        .load
        .image('answerpanel', './assets/Sprites/Label1.png');
    this
        .load
        .image('nextquestion', './assets/Sprites/Play.png');
    this
        .load
        .image('star', './assets/Sprites/Star.png');
    this
        .load
        .image('restart', './assets/Sprites/Restart.png');
    this
        .load
        .image('logo', './assets/Sprites/logo.png');

    this
        .load
        .audio('goodsound', './assets/Sound/good.wav');
    this
        .load
        .audio('wrongsound', './assets/Sound/wrong.wav');
    this.load.image("soundOn", "./assets/Sprites/soundOn.png");
    this.load.image("soundOff", "./assets/Sprites/soundOff.png");
    this.load.audio("backgroundMusic", "./assets/Sound/Galactic Odyssey.wav");
    this.load.audio("goodAnswerSound", "./assets/Sound/goodAnswer.wav");
    this.load.audio("wrongAnswerSound", "./assets/Sound/badAnswer.wav");
    this.load.audio("playButtonSound", "./assets/Sound/playButton.wav");
    this.load.audio("nextButtonSound", "./assets/Sound/selectButtons.wav");
    this.load.audio("restartButtonSound", "./assets/Sound/startButton.wav");
    this.load.audio("growingPlantSound", "./assets/Sound/growingPlant.wav");

    this
        .load
        .json('questions', './assets/Data/Questions.json');
}

preload = preload.bind(this);

function create() {
    questions = this
        .cache
        .json
        .get('questions')
        .questions;

	// Mélanger les questions aléatoirement
	shuffledQuestions = shuffleArray(questions).slice(0, totalQuestions); // Mélanger et prendre seulement 5 questions

    goodAnswerSound = this
        .sound
        .add('goodsound');
    wrongAnswerSound = this
        .sound
        .add('wrongsound');

    // Charger l'image de fond
    let backImage = this
        .add
        .image(0, 0, 'background')
        .setOrigin(0.5, 0.5); // Centrer l'image

    const music = this.sound.add("backgroundMusic", {
        loop: true,
        volume: 0.5
        });
    
        music.play();

    const button = this.add.image(50, 50, "soundOn").setInteractive();

    button.setDepth(1);

    button.on('pointerdown', function() {
        if (music.mute) {
        music.setMute(false);
        button.setTexture("soundOn");
        } else {
        music.setMute(true);
        button.setTexture("soundOff");
        }
    });

    // Calculer le rapport d'aspect de l'image
    const aspectRatio = backImage.width / backImage.height;

    // Calculer le rapport d'aspect de la scène
    const screenAspectRatio = this.scale.width / this.scale.height;

    // Comparer les rapports d'aspect pour déterminer la meilleure façon de couvrir l'écran
    if (screenAspectRatio > aspectRatio) {
        // L'écran est plus large que l'image -> ajuster en fonction de la hauteur
        backImage.setDisplaySize(this.scale.width, this.scale.width / aspectRatio);
    } else {
        // L'écran est plus haut que l'image -> ajuster en fonction de la largeur
        backImage.setDisplaySize(this.scale.height * aspectRatio, this.scale.height);
    }

    // Positionner l'image au centre
    backImage.setPosition(this.scale.width / 2, this.scale.height / 2);

    backImage.setDepth(0); // S'assurer que l'image est derrière les autres éléments

    // Section 1 : Logo et questionpanel superposés (10% hauteur combinée)
    let questionPanelImage = this
        .add
        .image(config.width / 2, config.height * 0.1, 'questionpanel');
    questionPanelImage.setDisplaySize(config.width * 0.9, config.height * 0.15);
    questionPanelImage.setOrigin(0.5, 0.5);

    logoImage = this
        .add
        .image(config.width / 2, config.height * 0.08, 'logo'); // Position un peu plus haute pour superposition
    logoImage.setDisplaySize(config.width * 0.8, config.height * 0.1); // Taille plus petite pour que ça chevauche

    // On met le logo au-dessus du panneau de question
    logoImage.setDepth(1); // Le `depth` plus élevé pour que le logo soit au-dessus

    questionText = this
        .add
        .text(config.width / 2, config.height * 0.1, "", {
            fontFamily: 'Arial',
            fontSize: 21,
            color: 'white'
        })
        .setOrigin(0.5, 0.5);

    // Section 2 : Panneaux de réponses (70% de la hauteur)
    let panelHeight = 150; // Hauteur fixe en pixels pour les answerpanel
    let gap = 20; // Ecart de 20px entre les panneaux

    for (let i = 0; i < 3; i++) {
        // Position verticale de chaque panel avec un gap de 20px
        let yPosition = (config.height * 0.35) + i * (panelHeight + gap);

        answerPanelImage[i] = this
            .add
            .image(config.width / 2, yPosition, 'answerpanel');
        answerPanelImage[i].setDisplaySize(config.width * 0.8, panelHeight); // 80% de la largeur, hauteur fixe
        answerPanelImage[i].setOrigin(0.5, 0.5);
        answerPanelImage[i].on('pointerdown', () => {
            checkAnswer(i);
        });

        answerText[i] = this
            .add
            .text(config.width / 2, yPosition, "", {
                fontFamily: 'Arial',
                fontSize: 18,
                color: 'aqua'
            })
            .setOrigin(0.5, 0.5);
        answerText[i].setVisible(false);

        // Définir la largeur du texte à 90% de la largeur du panneau de réponse
        answerText[i].setWordWrapWidth(answerPanelImage[i].displayWidth * 0.9);

		// Stocker la position initiale
		initialAnswerTextPositions[i] = answerText[i].y;
    }
    // Explanation
    wowText = this
        .add
        .text(config.width / 2, config.height * 0.8, "", {
            fontFamily: 'Arial',
            fontSize: 14,
            color: '#00ff00'
        })
        .setOrigin(0.5, 0.5);
    wowText.setVisible(false); // On le cache au départ

    // Section 3 : Bouton Next et étoiles (20% hauteur)
    nextQuestionImage = this
        .add
        .image(config.width / 2, config.height * 0.9, 'nextquestion')
        .setInteractive();
    nextQuestionImage.setDisplaySize(50, 50);
    nextQuestionImage.on('pointerdown', nextQuestion);

    nextButtonSound = this.sound.add("nextButtonSound");
    nextQuestionImage.on("pointerdown", function() {
      nextButtonSound.play();
    });

      // Load the growingPlantSound
    growingPlantSound = this.sound.add("growingPlantSound");

    restartImage = this
        .add
        .image(config.width / 2, config.height * 0.9, 'restart')
        .setInteractive();
    restartImage.setDisplaySize(50, 50);
    restartImage.on('pointerdown', restart);
    restartImage.setVisible(false);
    restartButtonSound = this.sound.add("restartButtonSound");

    // Étoiles
    for (let i = 0; i < 10; i++) {
        starImage[i] = this
            .add
            .image(30 + i * 60, config.height * 0.95, 'star');
        starImage[i].setScale(0.25);
        starImage[i].setVisible(false);
    }

    window.addEventListener('resize', resize);
}

function resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    game
        .scale
        .resize(width, height);

    // Section 1 : logo et question panel (superposés)
    questionPanelImage.setPosition(width / 2, height * 0.1);
    questionPanelImage.setDisplaySize(width * 0.8, height * 0.15);

    logoImage.setPosition(width / 2, height * 0.08);
    logoImage.setDisplaySize(width * 0.4, height * 0.1); // Ajuster la taille

    questionText.setPosition(width / 2, height * 0.1);

    // Section 2 : Panneaux de réponses
    for (let i = 0; i < 3; i++) {
        answerPanelImage[i].setPosition(
            config.width / 2,
            config.height * (0.35 + 0.20 * i)
        );
        answerPanelImage[i].setDisplaySize(width * 0.8, height * 0.01);
        answerText[i].setPosition(width / 2, height * (0.35 + 0.25 * i));
    }

    // Section 3 : Next et restart
    nextQuestionImage.setPosition(width / 2, height * 0.9);
    nextQuestionImage.setDisplaySize(width * 0.8, height * 0.1);

    restartImage.setPosition(width / 2, height * 0.9);
    restartImage.setDisplaySize(width * 0.2, height * 0.1);
}

function checkAnswer(answerNumber) {
    for (let i = 0; i < 3; i++) {
        answerPanelImage[i].disableInteractive();

        if (i == questions[questionIndex].goodAnswer) {
            // Alignement de la bonne réponse en haut du panneau de réponse
            let correctAnswerY = answerPanelImage[questions[questionIndex].goodAnswer].y - (answerPanelImage[questions[questionIndex].goodAnswer].displayHeight / 2) + 30;
            answerText[questions[questionIndex].goodAnswer].setPosition(config.width / 2, correctAnswerY);
        }
    }

    nextQuestionImage.setVisible(true);
    starImage[questionIndex].setVisible(true);
    answerPanelImage[questions[questionIndex].goodAnswer].tint = 0x22FF22;
	
    // Définir la largeur des questions à 90% de la largeur du panneau de réponse correct
    questionText.setWordWrapWidth(answerPanelImage[questions[questionIndex].goodAnswer].displayWidth * 0.9);

    // Définir la position de wowText juste en dessous de la bonne réponse
    wowText.setText(questions[questionIndex].explanation);
    wowText.setVisible(true); // Afficher le texte d'explication

    // Définir la largeur du texte wowText à 90% de la largeur du panneau de réponse correct
    wowText.setWordWrapWidth(answerPanelImage[questions[questionIndex].goodAnswer].displayWidth * 0.9);

    // Calculer la position finale de wowText en fonction de la position de answerText
    let spaceAboveWowText = 50; // Ajustez cette valeur pour changer l'espace
    let wowTextY = answerText[questions[questionIndex].goodAnswer].y + answerText[questions[questionIndex].goodAnswer].height / 2 + spaceAboveWowText;
    wowText.setPosition(config.width / 2, wowTextY); // Positionner le wowText avec l'espace au-dessus

    if (answerNumber === questions[questionIndex].goodAnswer) {
        score += 1;
        growingPlantSound.play();
    } else {
        answerPanelImage[answerNumber].tint = 0xFF0000;
        starImage[questionIndex].alpha = 0.4;
        wrongAnswerSound.play();
    }
}

function nextQuestion() {
    questionIndex += 1;
    logoImage.setVisible(false);
    wowText.setVisible(false);
    for (let i = 0; i < 3; i++) {
        answerPanelImage[i].setInteractive();

		// Remettre le texte de réponse à sa position initiale
		answerText[i].setPosition(config.width / 2, initialAnswerTextPositions[i])
    }
    if (questionIndex < 10) {
        questionText.text = questions[questionIndex].title;
        for (let i = 0; i < 3; i++) {
            answerText[i].setVisible(true);
            answerText[i].text = questions[questionIndex].answer[i];
            answerPanelImage[i].tint = 0xFFFFFF;
        }
    } else {
        for (let i = 0; i < 3; i++) {
            answerPanelImage[i].setVisible(false);
            answerText[i].setVisible(false);
        }
        questionText.text = "Votre score est de " + score + " / 10";
        restartImage.setVisible(true);

        // Redirection vers scores.html après 3 secondes
        setTimeout(() => {
            window.location.href = 'scores.html';
        }, 3000);
    }
    nextQuestionImage.setVisible(false);

    nextButtonSound.play();
}

function restart() {
    restartImage.setVisible(false);
    score = 0;
    questionIndex = 0;
    for (let i = 0; i < 10; i++) {
        starImage[i].setVisible(false);
        starImage[i].alpha = 1;
    }

	shuffledQuestions = shuffleArray(questions).slice(0, totalQuestions); // Mélanger les questions à nouveau

    for (let i = 0; i < 3; i++) {
        answerPanelImage[i].setVisible(true);
        answerPanelImage[i].tint = 0xFFFFFF;
        answerText[i].text = questions[questionIndex].answer[i];
        answerText[i].setVisible(true);
    }
    questionText.text = questions[questionIndex].title;
    restartButtonSound.play();
}

// Fonction pour mélanger un tableau
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
	  const j = Math.floor(Math.random() * (i + 1));
	  [array[i], array[j]] = [array[j], array[i]]; // Échange
	}
	return array;
}