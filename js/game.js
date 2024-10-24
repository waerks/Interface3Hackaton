let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,  // Largeur adaptative
  height: window.innerHeight, // Hauteur adaptative
  parent: "game-container", // Lien avec le conteneur de jeu
  physics: {
    default: "arcade",
  },
  scene: {
    preload: preload,
    create: create,
  },
  autoCenter: true,
};

let game = new Phaser.Game(config);
let questionIndex = -1;
let questions;
let shuffledQuestions; // Ajouter une variable pour les questions mélangées
let answerPanelImage = [];
let tweenGoodAnswerPanel = [];
let tweenWrongAnswerPanel = [];
let starImage = [];
let score = 0;
let nextQuestionImage, logoImage;
let questionText;
let answerText = [];
let restartImage;
const totalQuestions = 5; // Limiter à 5 questions

function preload() {
  this.load.image("background", "./assets/Sprites/background.png");
  this.load.image("questionpanel", "./assets/Sprites/Label1.png");
  this.load.image("answerpanel", "./assets/Sprites/Label2.png");
  this.load.image("nextquestion", "./assets/Sprites/Play.png");
  this.load.image("star", "./assets/Sprites/Star.png");
  this.load.image("restart", "./assets/Sprites/Restart.png");
  this.load.image("logo", "./assets/Sprites/Quiz1.png");

  this.load.audio("goodsound", "./assets/Sound/good.wav");
  this.load.audio("wrongsound", "./assets/Sound/wrong.wav");

  this.load.json("questions", "./assets/Data/Questions.json");
}

function create() {
  // Construire l'objet questions à partir du JSON
  questions = this.cache.json.get("questions").questions;

  // Mélanger les questions aléatoirement
  shuffledQuestions = shuffleArray(questions).slice(0, totalQuestions); // Mélanger et prendre seulement 5 questions

  // Préparer les sons
  goodAnswerSound = this.sound.add("goodsound");
  wrongAnswerSound = this.sound.add("wrongsound");

  // Dessiner l'image de fond
  let backImage = this.add.image(0, 0, "background");
  backImage.setOrigin(0, 0);
  backImage.setScale(0.5);

  // Dessiner l'image pour les questions
  let questionPanelImage = this.add.image(config.width / 2, 100, "questionpanel");
  questionPanelImage.setScale(0.5);

  // Dessiner les 3 images pour les réponses
  for (let i = 0; i < 3; i++) {
    answerPanelImage[i] = this.add.image(config.width / 2, 220 + 100 * i, "answerpanel");
    answerPanelImage[i].setScale(1.2, 0.8);
    answerPanelImage[i].on("pointerdown", () => {
      checkAnswer(i);
    });
  }

  // Écrire la question
  questionText = this.add.text(150, 80, "", {
    fontFamily: "Arial",
    fontSize: 18,
    color: "#00ff00",
  });

  // Écrire les 3 réponses
  for (let i = 0; i < 3; i++) {
    answerText[i] = this.add.text(150, 200 + i * 100, "", {
      fontFamily: "Arial",
      fontSize: 18,
      color: "#ffff00",
    });
    answerText[i].setVisible(false);
  }

  // Dessiner le logo de départ
  logoImage = this.add.image(config.width / 2, 100, "logo");
  logoImage.setScale(0.8);

  // Dessiner le bouton pour question suivante
  nextQuestionImage = this.add.image(config.width / 2, 510, "nextquestion").setInteractive();
  nextQuestionImage.on("pointerdown", nextQuestion);
  nextQuestionImage.setScale(0.4);

  // Afficher 5 étoiles en bas de l'écran et les rendre invisibles
  for (let i = 0; i < totalQuestions; i++) {
    starImage[i] = this.add.image(30 + i * 60, 600, "star");
    starImage[i].setScale(0.25);
    starImage[i].setVisible(false);
  }

  // Ajouter le bouton Restart
  restartImage = this.add.image(300, 350, "restart").setInteractive();
  restartImage.on("pointerdown", restart);
  restartImage.setVisible(false);

  // Créer une animation sur un panel
  for (let i = 0; i < 3; i++) {
    tweenGoodAnswerPanel[i] = this.tweens.add({
      targets: answerPanelImage[i],
      scaleY: 1.2,
      scaleX: 1.5,
      duration: 200,
      ease: "Power2",
      yoyo: true,
      loop: 0,
      paused: true,
    });
  }
  for (let i = 0; i < 3; i++) {
    tweenWrongAnswerPanel[i] = this.tweens.add({
      targets: answerPanelImage[i],
      angle: 15,
      duration: 40,
      ease: "Power2",
      yoyo: true,
      loop: 2,
      paused: true,
    });
  }
}

function checkAnswer(answerNumber) {
  for (let i = 0; i < 3; i++) {
    answerPanelImage[i].disableInteractive();
  }
  nextQuestionImage.setVisible(true);
  starImage[questionIndex].setVisible(true);
  answerPanelImage[shuffledQuestions[questionIndex].goodAnswer].tint = 0x22ff22;
  if (answerNumber == shuffledQuestions[questionIndex].goodAnswer) {
    score += 1;
    goodAnswerSound.play();
    tweenGoodAnswerPanel[answerNumber].play();
  } else {
    answerPanelImage[answerNumber].tint = 0xff0000;
    starImage[questionIndex].alpha = 0.4;
    wrongAnswerSound.play();
    tweenWrongAnswerPanel[answerNumber].play();
  }
}

function nextQuestion() {
  questionIndex += 1;
  logoImage.setVisible(false);
  for (let i = 0; i < 3; i++) {
    answerPanelImage[i].setInteractive();
  }
  if (questionIndex < totalQuestions) {
    questionText.text = shuffledQuestions[questionIndex].title;
    for (let i = 0; i < 3; i++) {
      answerText[i].setVisible(true);
      answerText[i].text = shuffledQuestions[questionIndex].answer[i];
      answerPanelImage[i].tint = 0xffffff;
    }
  } else {
    for (let i = 0; i < 3; i++) {
      answerPanelImage[i].setVisible(false);
      answerText[i].setVisible(false);
    }
    questionText.text = "Votre score est de " + score + " / 5";
    restartImage.setVisible(true);
  }
  nextQuestionImage.setVisible(false);
}

function restart() {
  restartImage.setVisible(false);

  score = 0;
  questionIndex = 0;

  for (let i = 0; i < totalQuestions; i++) {
    starImage[i].setVisible(false);
    starImage[i].alpha = 1;
  }

  shuffledQuestions = shuffleArray(questions).slice(0, totalQuestions); // Mélanger les questions à nouveau

  for (let i = 0; i < 3; i++) {
    answerPanelImage[i].setVisible(true);
    answerPanelImage[i].tint = 0xffffff;
    answerText[i].text = shuffledQuestions[questionIndex].answer[i];
    answerText[i].setVisible(true);
  }
  questionText.text = shuffledQuestions[questionIndex].title;
}

// Fonction pour mélanger un tableau
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Échange
  }
  return array;
}
