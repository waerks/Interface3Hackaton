let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create
    },
    autoCenter: true
};

let game = new Phaser.Game(config);
let questionIndex = -1;
let questions;
let answerPanelImage = [];
let tweenGoodAnswerPanel = [];
let tweenWrongAnswerPanel = [];
let starImage = [];
let score = 0;
let nextQuestionImage, logoImage;
let questionText;
let answerText = [];
let restartImage;

function preload() {
    this.load.image('background', './assets/Sprites/background.png');
    this.load.image('questionpanel', './assets/Sprites/Label1.png');
    this.load.image('answerpanel', './assets/Sprites/Label2.png');
    this.load.image('nextquestion', './assets/Sprites/Play.png');
    this.load.image('star', './assets/Sprites/Star.png');
    this.load.image('restart', './assets/Sprites/Restart.png');
    this.load.image('logo', './assets/Sprites/Quiz1.png');

    this.load.audio('goodsound', './assets/Sound/good.wav');
    this.load.audio('wrongsound', './assets/Sound/wrong.wav');

    this.load.json('questions', './assets/Data/Questions.json');
}

function create() {
    // construire l'objet questions à partir du JSON
    questions = this.cache.json.get('questions').questions;

    // préparer les sons :
    goodAnswerSound = this.sound.add('goodsound');
    wrongAnswerSound = this.sound.add('wrongsound');

    // dessiner l'image de fond
    let backImage = this.add.image(0, 0, 'background');
    backImage.setOrigin(0, 0);
    backImage.setScale(0.5);

    // dessiner l'image pour les questions
    let questionPanelImage = this.add.image(config.width/2, 100, 'questionpanel');
    questionPanelImage.setScale(0.5);

    
    // dessiner les 3 images pour les 3 réponses
    for(let i=0; i<3; i++){
        answerPanelImage[i] = this.add.image(config.width/2, 220+100*i, 'answerpanel');
        answerPanelImage[i].setScale(1.2, 0.8);
        answerPanelImage[i].on('pointerdown', () => {checkAnswer(i)});
    }
    
    // écrire la question
    questionText = this.add.text(150, 80, "", 
        { fontFamily: 'Arial', fontSize: 18, color: '#00ff00' });
        
        // écrire les 3 réponses
        for(let i=0; i<3; i++){
            answerText[i] = this.add.text(150, 200+i*100, "", 
                { fontFamily: 'Arial', fontSize: 18, color: '#ffff00' });
            answerText[i].setVisible(false);
            }

        // dessiner le logo de départ
        logoImage = this.add.image(config.width/2, 100, 'logo');
        logoImage.setScale(0.8);
        
        // dessiner le bouton pour question suivante
        nextQuestionImage = this.add.image(config.width/2, 510, 'nextquestion').setInteractive();
        nextQuestionImage.on('pointerdown', nextQuestion);
        nextQuestionImage.setScale(0.4);
        //nextQuestionImage.setVisible(false);
        
        // afficher 10 étoiles en bas de l'écran et on les rend invisible 
    for(let i=0; i<10; i++){
        starImage[i] = this.add.image(30+i*60, 600, 'star');
        starImage[i].setScale(0.25);
        starImage[i].setVisible(false);
    }

    // Ajouter le bouton Restart
    restartImage = this.add.image(300, 350, 'restart').setInteractive();
    restartImage.on('pointerdown', restart);
    restartImage.setVisible(false);

    // créer une animation sur un panel
    for(let i=0; i<3; i++){
        tweenGoodAnswerPanel[i] = this.tweens.add({
            targets: answerPanelImage[i],
            scaleY: 1.2,
            scaleX: 1.5,
            duration: 200,
            ease: 'Power2',
            yoyo : true,
            loop: 0,
            paused: true
            });
    }
    for(let i=0; i<3; i++){
        tweenWrongAnswerPanel[i] = this.tweens.add({
            targets: answerPanelImage[i],
            angle: 15,
            duration: 40,
            ease: 'Power2',
            yoyo : true,
            loop: 2,
            paused: true
            });
    }
}

function checkAnswer(answerNumber) {
    for(let i=0; i<3; i++){
        answerPanelImage[i].disableInteractive();
    }
    nextQuestionImage.setVisible(true);
    starImage[questionIndex].setVisible(true);
    answerPanelImage[questions[questionIndex].goodAnswer].tint = 0x22FF22;
    if (answerNumber==questions[questionIndex].goodAnswer) {
        score += 1 ;
        goodAnswerSound.play();
        tweenGoodAnswerPanel[answerNumber].play();
    }
    else {
        answerPanelImage[answerNumber].tint = 0xFF0000;
        starImage[questionIndex].alpha = 0.4;
        wrongAnswerSound.play();
        tweenWrongAnswerPanel[answerNumber].play();
    }
}

function nextQuestion(){
    questionIndex += 1;
    logoImage.setVisible(false);
    for(let i=0; i<3; i++){
        answerPanelImage[i].setInteractive();
    }
    if(questionIndex<10){
        questionText.text = questions[questionIndex].title;
        for(let i=0; i<3;i++) {
            answerText[i].setVisible(true);
            answerText[i].text = questions[questionIndex].answer[i];
            answerPanelImage[i].tint = 0xFFFFFF;
        }
    }
    else{
        for(let i=0; i<3; i++) {
            answerPanelImage[i].setVisible(false);
            answerText[i].setVisible(false);
        }
        questionText.text = "Votre score est de " + score + " / 10";
        restartImage.setVisible(true);
    }
    nextQuestionImage.setVisible(false);
}

function restart(){
    // faire disparaitre le bouton restart
    restartImage.setVisible(false);

    // score et index à zéro
    score = 0;
    questionIndex = 0;

    // faire disparaitre les étoiles
    for(let i=0; i<10; i++){
        starImage[i].setVisible(false);
        starImage[i].alpha = 1;
    }

    // faire réparaitre les panels dans leur couleur d'origine 
    // et les textes avec la première question
    for(let i=0; i<3; i++) {
        answerPanelImage[i].setVisible(true);
        answerPanelImage[i].tint = 0xFFFFFF;
        answerText[i].text = questions[questionIndex].answer[i];
        answerText[i].setVisible(true);
    }
    questionText.text = questions[questionIndex].title;
}