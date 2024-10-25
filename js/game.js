let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
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
let shuffledQuestions;
let answerPanelImage = [];
let tweenGoodAnswerPanel = [];
let tweenWrongAnswerPanel = [];
let starImage = [];
let score = 0;
let nextQuestionImage, logoImage;
let questionText;
let answerText = [];
let restartImage;
const totalQuestions = 5;

// Nouvelle variable pour l'image animée
let animatedImage;
let imageYPosition;  // Position Y de l'image animée
const stepHeight = config.height / 5;  // Hauteur de déplacement (1/5 de la hauteur)

function preload() {
  this.load.image("background", "./assets/Sprites/background.png");
  this.load.image("questionpanel", "./assets/Sprites/Label1.png");
  this.load.image("answerpanel", "./assets/Sprites/Label2.png");
  this.load.image("nextquestion", "./assets/Sprites/Play.png");
  this.load.image("star", "./assets/Sprites/Star.png");
  this.load.image("restart", "./assets/Sprites/Restart.png");
  this.load.image("logo", "./assets/Sprites/Quiz1.png");

  // Charger l'image animée
  this.load.image("animatedImage", "./assets/Sprites/animatedImage.png");

  this.load.audio("goodsound", "./assets/Sound/good.wav");
  this.load.audio("wrongsound", "./assets/Sound/wrong.wav");

  this.load.json("questions", "./assets/Data/Questions.json");
}

function create() {
  questions = this.cache.json.get("questions").questions;
  shuffledQuestions = shuffleArray(questions).slice(0, totalQuestions);

  goodAnswerSound = this.sound.add("goodsound");
  wrongAnswerSound = this.sound.add("wrongsound");

  let backImage = this.add.image(0, 0, "background");
  backImage.setOrigin(0, 0);
  backImage.setScale(0.5);

  let questionPanelImage = this.add.image(config.width / 2, 100, "questionpanel");
  questionPanelImage.setScale(0.5);

  for (let i = 0; i < 3; i++) {
    answerPanelImage[i] = this.add.image(config.width / 2, 220 + 100 * i, "answerpanel");
    answerPanelImage[i].setScale(1.2, 0.8);
    answerPanelImage[i].on("pointerdown", () => {
      checkAnswer(i);
    });
  }

  questionText = this.add.text(150, 80, "", {
    fontFamily: "Arial",
    fontSize: 18,
    color: "#00ff00",
  });

  for (let i = 0; i < 3; i++) {
    answerText[i] = this.add.text(150, 200 + i * 100, "", {
      fontFamily: "Arial",
      fontSize: 18,
      color: "#ffff00",
    });
    answerText[i].setVisible(false);
  }

  logoImage = this.add.image(config.width / 2, 100, "logo");
  logoImage.setScale(0.8);

  nextQuestionImage = this.add.image(config.width / 2, 510, "nextquestion").setInteractive();
  nextQuestionImage.on("pointerdown", nextQuestion);
  nextQuestionImage.setScale(0.4);

  for (let i = 0; i < totalQuestions; i++) {
    starImage[i] = this.add.image(30 + i * 60, 600, "star");
    starImage[i].setScale(0.25);
    starImage[i].setVisible(false);
  }

  restartImage = this.add.image(300, 350, "restart").setInteractive();
  restartImage.on("pointerdown", restart);
  restartImage.setVisible(false);

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

  // Initialiser l'image animée en bas de l'écran
  imageYPosition = config.height + stepHeight;  // Départ sous l'écran
  animatedImage = this.add.image(config.width / 2, imageYPosition, "animatedImage");
  animatedImage.setScale(0.23); // Adapter l'échelle si nécessaire
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
    // Monter l'image de 1/5
    imageYPosition -= stepHeight;
  } else {
    answerPanelImage[answerNumber].tint = 0xff0000;
    starImage[questionIndex].alpha = 0.4;
    wrongAnswerSound.play();
    tweenWrongAnswerPanel[answerNumber].play();
    // Descendre l'image de 1/5
    const initialYPosition = config.height + stepHeight; // Position initiale de l'image en Y
    if (imageYPosition + stepHeight <= initialYPosition) {
      imageYPosition += stepHeight;
    }
  }

  // Appliquer la nouvelle position Y de l'image
  animatedImage.setY(imageYPosition);
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
    questionText.text = "Votre score est de " + score + " / " + totalQuestions;
    restartImage.setVisible(true);

    // Rediriger vers scores.html après 3 secondes
    setTimeout(() => {
      window.location.href = "scores.html";
    }, 3000);
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

  shuffledQuestions = shuffleArray(questions).slice(0, totalQuestions);

  for (let i = 0; i < 3; i++) {
    answerPanelImage[i].setVisible(true);
    answerPanelImage[i].tint = 0xffffff;
    answerText[i].text = shuffledQuestions[questionIndex].answer[i];
    answerText[i].setVisible(true);
  }
  questionText.text = shuffledQuestions[questionIndex].title;

  // Réinitialiser la position de l'image animée
  imageYPosition = config.height + stepHeight;
  animatedImage.setY(imageYPosition);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
