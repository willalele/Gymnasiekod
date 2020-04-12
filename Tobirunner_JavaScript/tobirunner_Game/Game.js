const userKeys = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  W: 87,
  S: 83,
  A: 65,
  D: 68,
  SPACE: 32,
  P: 80,
  M: 77,
  C: 67
};

const specialKeys = {
  8:'Backspace',
  9:'Tab',
  13:'Enter',
  16:'Shift',
  17:'Ctrl',
  18:'Alt',
  19:'Pause/break',
  20:'Caps lock',
  27: 'Escape',
  32:'Space',
  33:'Page up',
  34:'Page down',
  35:'End',
  36:'Home',
  37:'Left',
  38:'Up',
  39:'Right',
  40:'Down',
  45:'Insert',
  46:'Delete',
  91:'LeftwinKey',
  92:'RightwinKey',
  106:'Multiply',
  107:'Add',
  111:'Divide',
  187:'Equal',
  188:'Comma',
  189:'Dash',
  190:'Period',
  191:'Slash',
  192:'GraveAccent',
  219:'OpenBracket',
  220:'BackSlash',
  221:'CloseBraket',
  222:'SingleQuote'
};

const LEVEL_ENEMIES = [ //y2 variabel dikterar hur högt upp enheten startar
  [{
    name: 'helicopter',
    width: 44,
    height: 36,
    y2: 200
  }, {
    name: 'exponent',
    width: 40,
    height: 45,
    y2: 205
  }],
  [{
    name: 'helicopter',
    width: 44,
    height: 36,
    y2: 200
  }, {
    name: 'sallad',
    width: 60,
    height: 53,
    y2: 197
  }],
  [{
    name: 'helicopter',
    width: 44,
    height: 36,
    y2: 200
  }, {
    name: 'polisbil',
    width: 60,
    height: 50,
    y2: 200
  }],
  [{
    name: 'helicopter',
    width: 44,
    height: 36,
    y2: 200
  }, {
    name: 'spindel',
    width: 60,
    height: 37,
    y2: 220
  }],
  [{
    name: 'helicopter',
    width: 44,
    height: 36,
    y2: 200
  }, {
    name: 'spindel',
    width: 60,
    height: 37,
    y2: 220
  }, {
    name: 'tangentbord',
    width: 80,
    height: 14,
    y2: 170
  }, {
    name: 'professor',
    width: 70,
    height: 60,
    y2: 185
  }]
];

const LEVEL_PLAYER_CHARACTERS = [{
  name: 'tobi_guy',
  x2: 100,
  y2: 120
}, {
  name: 'tobi_girl',
  x2: 100,
  y2: 120
}, {
  name: 'tobi_girl',
  x2: 100,
  y2: 120
}, {
  name: 'tobi_guy',
  x2: 100,
  y2: 120
}, {
  name: 'tobi',
  x2: 390, 
  y2: 120
}];

const LEVEL_CLOUDS = [{
  name: 'cloud',
  width: 60,
  height: 34
}, {
  name: 'cloud2',
  width: 65,
  height: 50
}, {
  name: 'cloud3',
  width: 60,
  height: 40
}, {
  name: 'cloud3',
  width: 60,
  height: 40
}, {
  name: 'cloud3',
  width: 60,
  height: 40
}];

//END CONFIG

const font = 'Share Tech Mono';
const totalLevels = 5; //Denna konstant berättar för spelet hur många nivåer den har.
const coinWidth = 40;
const LEVEL_COMPLETION_TIME = 3000;
const MAX_VARIABLES = Math.floor(LEVEL_COMPLETION_TIME / 50); //Max 2 objekt per sec.
const FLYING = 0; //Denna rörelsetyp går upp och ner
const WALKING = 1; //Denna rörelsetyp går i en rak linje från höger till vänster
const ROTATING = 2; //Denna rörelsetyp roterar i två dimensioner och reser från höger till vänster.
const REVERSED = 3; //Denna rörelsetyp reser från vänster till höger.

//flyUp säger om flygande fiender flyger upp eller ner - upp om sant, ner om falskt.
//flyCounter ställer in intervallet vid vilket flyUp ändras.
var flyUp = false;
var flyCounter = 0;

var audio; //Här definierar vi bara våra ljudvariabler.
var coinpickup;
var gameover;
var gamewon;
var jump;
var enemykilled;

var currentLevel;
var collectedCoins = 0;
var currentCoins = 0;
var timeLeft; //Anger hur mycket tid som återstår i nivån - kommer att beräknas utifrån LEVEL_COMPLETION_TIME senare.
var score = 0;
var currentScore = 0;
var playerCharacter;
var background;
var background2;
var backgroundDx = 0;
var xPos = -5;
var coinRotationValue = 0;
var scoreBoard;
var coinScoreBoard;
var coinScoreBoardImg;
var coinScoreBoardSupImg;
var highscoreBoard;

var startArrow1;
var startArrow2;
var startArrow3;
var switchArrow = 0;

var timeBoard;
var timeBoardImg;
var levelDisplay;
var enemyCharacters = [];
var coins = [];
var clouds = [];
var keysPressed = {
  LEFT: false,
  UP: false,
  RIGHT: false,
  DOWN: false,
  P: false,
  M: false,
  W: false,
  S: false,
  A: false,
  D: false
};
var gamePaused = false;
var displayOptionsModal = false;
var optionId= '';
let musicMuted = false;
let musicToggled = false; //detta är bara för att stänga av musik när spelet är pausat
let dir; // vilket håll karaktären står åt. 1 är höger, -1 är vänster
var highscore = 0;


function KeyDown(event) {
  var key;
  key = event.which;
  keysPressed[key] = true;

  //undvika automatisk upprepad keydown-händelse
  if(event.repeat)
    return;
  if(!displayOptionsModal){
    if ((keysPressed[userKeys.DOWN] || keysPressed[userKeys.S]) && playerCharacter.duckCooldown === false) {
      duck();
    }
    if((keysPressed[userKeys.LEFT] || keysPressed[userKeys.A]) && playerCharacter.leftCooldown === false){
      moveLeft();
      playerCharacter.leftCooldown = true;
    }
    if ((keysPressed[userKeys.RIGHT] || keysPressed[userKeys.D]) && playerCharacter.rightCooldown === false) {
      moveRight();
      playerCharacter.rightCooldown = true;
    }
    if((keysPressed[userKeys.UP] || keysPressed[userKeys.W]) && playerCharacter.hitGround && playerCharacter.duckCooldown === false){
      if(playerCharacter.jumpCooldown === false){
        moveUp();
      }
    }
    if(keysPressed[userKeys.SPACE]){
      restartGame();
    }
    if(keysPressed[userKeys.P]){
      keysPressed[userKeys.P] = false;
      pauseGame();
    }
    if(keysPressed[userKeys.M]) {
      keysPressed[userKeys.M] = false;
      muteMusic();
    }
    if(keysPressed[userKeys.C]) {
      keysPressed[userKeys.C] = false;
      resumeGame();
    }
  }else{
    changeOption(key);
  }
}

// stäng av musik genom att trycka på 'M'
function muteMusic() {
  musicMuted = !musicMuted;
  var imgButton = document.getElementById('audioButton');
  if (musicMuted) {
    imgButton.src = 'Pictures/audioOff.png';
    if (!gamePaused && !displayOptionsModal) { //Om spelet körs, stäng bara av ljudet
      audio.pause();
    } else { //Annars måste vi ändra vår musikToggled-variabel, så att ljudet återupptas ordentligt med spelet
      musicToggled = false;
    }
  } else {
    imgButton.src = 'Pictures/audioOn.png';
    if (!gamePaused && !displayOptionsModal) {
      audio.load();
    } else {
      musicToggled = true;
    }
  }
  updateSoundPng();
}

function pauseGame() {
  gamePaused = !gamePaused;
}

function updateSoundPng(){
  if(musicMuted){
    document.getElementById('MImg').src = 'Pictures/audioOff.png';
  }else{
    document.getElementById('MImg').src = 'Pictures/audioOn.png';
  }
}

function gameOptions(){
  displayOptionsModal = !displayOptionsModal;
}

function dispMess(id,type){
  if(type === 'SOUND'){
    muteMusic();
  }else{
    document.getElementById('mess').innerHTML = 'Press the key you want to use for '+'"'+type+'"';
    optionId= id;
  }
}

function changeOption(key){
  var chr = String.fromCharCode(key);
  if(optionId!== '' && !Object.values(userKeys).includes(key)){
    if(48 <= key && key <= 90 ){
      document.getElementById(optionId).value = chr;
      userKeys[optionId] = key;
    }else if(key in specialKeys){
      document.getElementById(optionId).value = specialKeys[key];
      userKeys[optionId] = key;
    }
  }else if(keysPressed[userKeys.M] && optionId !== 'M'){
    dispMess('M','SOUND');
  }else{
    document.getElementById('mess').innerHTML = 'You can\'t use this key';
  }
}


function updateBackgroundDx(){
  if(keysPressed[userKeys.LEFT] || keysPressed[userKeys.A]) {
    backgroundDx = -5;
  }else if(keysPressed[userKeys.RIGHT] || keysPressed[userKeys.D]) {
    backgroundDx = 5;
  }else{
    backgroundDx = 0;
  }
}

function KeyUp(event) {
  var key;
  key = event.which;
  keysPressed[key] = false;
  switch (key) {
  case userKeys.UP:
  case userKeys.W:
    playerCharacter.speedY += playerCharacter.gravity;
    playerCharacter.jumpCooldown = false;
    break;
  case userKeys.LEFT:
  case userKeys.A:
    if (keysPressed[userKeys.RIGHT]||keysPressed[userKeys.D]) {
      moveRight();
    } else {
      playerCharacter.speedX = 0;
    }
    playerCharacter.leftCooldown = false;
    break;
  case userKeys.RIGHT:
  case userKeys.D:
    if (keysPressed[userKeys.LEFT]||keysPressed[userKeys.A]) {
      moveLeft();
    } else {
      playerCharacter.speedX = 0;
    }
    playerCharacter.rightCooldown = false;
    break;
  case userKeys.DOWN:
  case userKeys.S:
    if(playerCharacter.hitGround && playerCharacter.duckCooldown === true){//detta "if statement" används så att spelarens karaktär inte ökar i storlek när DOWN eller S trycks in medan karaktären är i luften
      playerCharacter.height = playerCharacter.height * 2;
      playerCharacter.duckCooldown = false;
    }
  }
  updateBackgroundDx();
}


function showInstructions(){
  gameArea.init();
  //background
  background = new Component();
  background.init(gameArea.canvas.width, gameArea.canvas.height, 'Pictures/background_1.jpg', 0, 0, 'image', WALKING, true);
  var modal = document.getElementById('instructionsModal');
  modal.style.display = 'block';
}

function initialize_game() {
  currentLevel = 1;
  collectedCoins = 0;
  currentCoins = 0;
  score = 0;
  currentScore = 0;

  var coinMessage = document.getElementById('coinMessage');
  var pointsMessage = document.getElementById('pointsMessage');
  if (coinMessage) {
    var levelTransitionModalContent = document.getElementById('levelTransitionModalContent');
    levelTransitionModalContent.removeChild(coinMessage);
    levelTransitionModalContent.removeChild(pointsMessage);
  }

  audio = document.getElementById('bgm');
  audio.autoplay = true;
  audio.loop = true;

  if (!musicMuted) {
    audio.load();
  }

  startLevel();
}

function startLevel() {
  //Synkroniserar startkoordinaterna för "enemy characters"
  flyUp = false;
  flyCounter = 0;
  dir = 1; //"tittar" åt höger
  xPos = -5;

  //"player character"
  playerCharacter = new Component();
  let char = LEVEL_PLAYER_CHARACTERS[currentLevel - 1];
  playerCharacter.init(60, 70, `Pictures/${char.name}.png`, char.x2, char.y2, 'image', WALKING, undefined, char.name);
  playerCharacter.jumpCooldown = false; //Dessa "cooldowns" låter vårt system veta om en tangent nyligen tryckts ned
  playerCharacter.leftCooldown = false; //pressed--"false" betyder att tangenten inte är på "cooldown" men borde vara
  playerCharacter.rightCooldown = false;
  playerCharacter.duckCooldown = false;

  //bakgrund
  background = new Component();
  background2 = new Component();
  background.init(gameArea.canvas.width, gameArea.canvas.height, `Pictures/background_${currentLevel}.jpg`, -50, 0, 'image', WALKING);
  background2.init(gameArea.canvas.width, gameArea.canvas.height, `Pictures/background_${currentLevel}_reverse.jpg`,850, 0, 'image', WALKING);

  //score
  scoreBoard = new Component();
  scoreBoard.init('20px', font, 'black', 250, 40, 'text', WALKING);

  //collected/samlade "Coins" eller som vi nu kallar det, vodka
  coinScoreBoard = new Component();
  coinScoreBoard.init('20px', font, 'black', 450, 40, 'text', WALKING);
  coinScoreBoardImg = new Component();
  coinScoreBoardImg.init(22, 22, 'Pictures/vodka.png', 420, 21, 'image', WALKING);
  coinScoreBoardSupImg = new Component();
  coinScoreBoardSupImg.init(40, 40, 'Pictures/stars.png', 412, 10, 'image', WALKING);

  highscoreBoard = new Component();
  highscoreBoard.init('20px', 'Consolas', 'black', 20, 40, 'text', WALKING);
  highscoreBoard.text = 'HIGHSCORE:' + highscore;

  //startArrow
  startArrow1 = new Component();
  startArrow2 = new Component();
  startArrow3 = new Component();
  startArrow1.init(90, 70, 'Pictures/blackArrow.png', 60, 125, 'image', 1);
  startArrow2.init(90, 70, 'Pictures/blackArrow.png', 30, 125, 'image', 1);
  startArrow3.init(90, 70, 'Pictures/blackArrow.png', 0, 125, 'image', 1);

  //tid kvar i den givna nivån
  timeBoard = new Component ();
  timeBoard.init('20px', font, 'black', 830, 40, 'text', WALKING);
  timeBoardImg = new Component();
  timeBoardImg.init(22, 22, 'Pictures/clock.png', 800, 21, 'image', WALKING);

  //visar den nivå du är på "leveldisplay"
  levelDisplay = new Component();
  levelDisplay.init('20px', font, 'black', 670, 40, 'text', WALKING);

  //Loop för att skapa nya "enemy characters" som ställer in en slumpmässig x-koordinat för varje. Skapar max 2 fiender per sekund.
  for (let i = 0; i < MAX_VARIABLES; i++) {
    enemyCharacters[i] = new Component();
    var x = Math.floor((Math.random() * (i * (gameArea.canvas.width / 2))) + ((gameArea.canvas.width / 2) * i + (gameArea.canvas.width * 1.25)));

    //moveType beskriver fiendens typ: flyga (0), gå (1), rotera (2), in från vänster (3) ...
    var moveType = Math.floor(Math.random() * (LEVEL_ENEMIES[currentLevel - 1].length));
    let enemy = LEVEL_ENEMIES[currentLevel - 1][moveType];
    if (moveType === REVERSED) {
      //Dessa fiender kommer in på skärmen från vänster
      x = Math.floor(Math.random() * (-i * (gameArea.canvas.width / 2)));
    }

    enemyCharacters[i].init(enemy.width, enemy.height, `Pictures/${enemy.name}.png`, x, enemy.y2, 'image', moveType);
  }

  //Loop för att skapa nya moln som får en slumpmässig x-koordinat. Skapar max 2 moln per sekund.
  for (let i = 0; i < MAX_VARIABLES; i++) {
    let x = Math.floor((Math.random() * (-600 + i * 450) + 1));
    clouds[i] = new Component();
    let cloud = LEVEL_CLOUDS[currentLevel - 1];
    clouds[i].init(cloud.width, cloud.height, `Pictures/${cloud.name}.png`, x, 40, 'image', WALKING);
  }

  //Genererar nya "coins/vodka" i slumpmässiga positioner. Skapar maximalt 2 / sekund.
  for (let i = 0; i < MAX_VARIABLES; i++) {
    let x = Math.floor(((Math.random() + 1) * gameArea.canvas.width) + (i * gameArea.canvas.width / 2));
    var y = Math.floor(Math.random() * 150 + 30); //150=canvas height - baseline=150 - char height=30 (utrymme ovanpå)
    coins[i] = new Component();
    coins[i].init(coinWidth, coinWidth, 'Pictures/vodka.png', x, y, 'image', WALKING);
  }

  //call start funktion
  gameArea.init();
  gameArea.start();
}

/**
 * @type {{canvas: Element, start: gameArea.start, clear: gameArea.clear, stop: gameArea.stop}}
 */
var gameArea = {
  init: function() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 900;
    this.canvas.height = 400;
    this.context = this.canvas.getContext('2d');

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    document.body.insertBefore(document.getElementById('banner'), document.body.childNodes[0])
    this.time = 0;
    this.bonusActiveTime = 1500; 
    this.coinScoreActiveTime = 1500; 
    this.coinScoreInterval = null;
  },

  start: function() {
    this.frameNo = 0;
    this.time = 0;
    // hide "modals"
    var modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
      var modal = modals[i];
      modal.style.display = 'none';
    }
    //update interval
    this.interval = setInterval(updateGameArea, 20);
  },

  //funktion som används för att uppdatera sidan
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  //funktion som används för att stoppa spelet
  stop: function() {
    clearInterval(this.interval);
  }
};

function Component() {
  this.init = function(width, height, color, x, y, dataType, moveType, initialShow = false, charName = undefined) {
    this.moveType = moveType; //Detta beskriver huvudsakligen fiendens rörelsetyp
    this.alive = true;
    this.alive = true;
    this.color = color;
    this.dataType = dataType;

    this.ctx = gameArea.context;

    if (dataType === 'image') {
      this.image = new Image();
      this.image.src = this.color;
      this.image.width = width;
      this.image.height = height;

      if (charName) {
        this.imageMirror = new Image();
        this.imageMirror.src = `Pictures/${charName}_left.png`;
        this.imageMirror.width = width;
        this.imageMirror.height = height;
      }

      if (initialShow) {//Detta är för saker vi vill visa innan spelet startar - i princip bakgrunden
        var imgCopy = this.image;
        var ctxCopy = this.ctx;
        this.image.onload = function() {
          ctxCopy.drawImage(imgCopy, this.x, this.y, this.width, this.height);
        };
      }
    }

    this.width = width;
    this.initHeight = height; // för att få pressad höjd senare
    this.alpha = 1; //hans variabel beslutar hur mycket ett objekt "bleknas" - 1 visas helt, 0 är borta.
    this.height = height;

    //ändra Komponenternas position
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.orignX = x;
    this.gravity = 1.5;
    //indikerar om karaktären är på marken eller inte
    this.hitGround = true;
    this.doubleJumpAllowed = true;
    this.angle = 0;
  };

  //funktion för att bestämma vad som ska visas på skärmen, text, bild eller fyllningsfärg/"fill color"
  this.update = function() {
    if (this.dataType === 'image') {
      this.ctx.globalAlpha = this.alpha;
      if (this.angle !== 0) {
        this.ctx.save();
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.ctx.rotate(this.angle);
        this.ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.ctx.restore();
      } else {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
    } else if (this.dataType === 'text') {
      this.ctx.font = this.width + ' ' + this.height;
      this.ctx.fillStyle = this.color;
      this.ctx.fillText(this.text, this.x, this.y);
    } else {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  //Denna funktion hanterar de rullande bakgrunderna
  this.moveBackgrounds = function(background2){
    if(0 <= xPos){
      xPos += backgroundDx;
      this.x -= backgroundDx;
      background2.x -= backgroundDx;
    }else{
      backgroundDx = 0;
    }
    if(this.x <= -900){this.x = 900;}
    else if(background2.x <= -900){background2.x = 900;}
    else if(900 <= this.x){this.x = -900;}
    else if(900 <= background2.x){background2.x = -900;}
    else if(900 < Math.abs(this.x)+Math.abs(background2.x)){
      if(Math.abs(background2.x) < Math.abs(this.x)){
        this.x += (0 < this.x)?-5:5;
      }else{
        background2.x += (0 < background2.x)?-5:5;
      }
    }
  };

  //"enemy character" kollisionsfunktion
  this.crashWith = function(otherobj) {
    var left = this.x;
    var right = this.x + (this.width);
    var top = this.y;
    var bottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((bottom < othertop + 10) ||
			(top > otherbottom - 20) ||
			(right < otherleft + 15) ||
			(left > otherright - 15)) {
      crash = false;
    }
    return crash;
  };

  //Denna funktion berättar om spelarens karaktär (eller något annat objekt) har hoppat på ett annat objekt
  this.jumpsOn = function(otherobj) {
    var bottomY = this.y + (this.height);
    var farX = this.x + this.width;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var smoosh = false;
    if ((bottomY > othertop - 5) &&
			(bottomY < (othertop + 20)) &&
			(farX > otherleft) &&
			(this.x < otherright)) {
      smoosh = true;
      //När spelaren hoppat på en fiende
      moveUp('hit');
    }
    return smoosh;
  };

  //gravitation egenskaper
  this.newPos = function() {
    this.y += this.speedY; //"increment" y's positionen med hans snabbhet
    this.speedY += this.gravity; //"increment" y's hastighet med gravitationen
    this.x += this.speedX;
    this.hitBottom();
  };

  //"golv" på canvas
  this.hitBottom = function() {
    var rockbottom = gameArea.canvas.height - this.height - 150;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.hitGround = true;
      this.doubleJumpAllowed = true;
    }
  };

  this.setAlive = function(alive) {
    this.alive = alive;
  };
  this.isAlive = function() {
    return this.alive;
  };

  this.setX = function(x){
    this.x = x;
  };

  this.getX = function(){
    return this.x;
  };

  this.getOrignX = function(){
    return this.orignX;
  };

  this.getImgSrc = function(){
    return this.image.src;
  };

  this.setSrc = function(src){
    this.image.src = src;
  };

  //Detta är en rotationsfunktion endast för "coins"/vodkaflaskorna, så att de kan rotera i tre dimensioner
  this.rotation = function(){
    if(coinRotationValue === 0){
      this.setSrc('Pictures/vodka.png');
    }else if(coinRotationValue === 10){
      this.setSrc('Pictures/vodka2.png');
    }else if(coinRotationValue === 20){
      this.setSrc('Pictures/vodka3.png');
    }else if(coinRotationValue === 30){
      this.setSrc('Pictures/vodka4.png');
    }
  };

  //kontrollera om spelaren bytt riktning
  //newDir tar antingen -1 (vänster) eller 1 (höger)
  this.changeDir = function(newDir) {
    if (dir !== newDir) {
      [playerCharacter.image, playerCharacter.imageMirror] = [playerCharacter.imageMirror, playerCharacter.image];
      dir = newDir;
    }
  };

  this.coinDisappear = function(){
    this.y += -2;
    this.alpha -= 0.03;
    if(this.alpha < 0){
      this.alpha = 0;
    }
  };
}



function gameOver() {
  interval && clearInterval(interval);

  //lägger till "score" till "highscore"
  if(highscore < score){
    highscore = score;
  }
  var modal = document.getElementById('gameOverModal');
  modal.style.display = 'block';

  audio = document.getElementById('bgm');
  audio.pause();

  if (!musicMuted) {
    gameover = document.getElementById('gameover');
    gameover.autoplay = true;
    gameover.load();
  }
}

function restartGame() {
  gameArea.stop();
  initialize_game();
}

function gameComplete() {
  var modal = document.getElementById('gameCompleteModal');
  modal.style.display = 'block';
  gameArea.stop();
  if(highscore < score){
    highscore = score;
  }

  if (!musicMuted) {
    audio = document.getElementById('bgm');
    audio.pause();
    gamewon = document.getElementById('gamewon');
    gamewon.autoplay = true;
    gamewon.load();
  }
}

//Justera karaktären till en giltig position om det rör sig utanför gränsen
function correctCharacterPos() {
  if (playerCharacter.y < 0) {
    playerCharacter.speedY = 0;
    playerCharacter.y = 0;
  }
  if (playerCharacter.x < 0) {
    playerCharacter.speedX = 0;
    playerCharacter.x = 0;
  }
  if (playerCharacter.x > gameArea.canvas.width - playerCharacter.width) {
    playerCharacter.speedX = 0;
    playerCharacter.x = gameArea.canvas.width - playerCharacter.width;
  }
  if (playerCharacter.y > gameArea.canvas.height - playerCharacter.height) {
    playerCharacter.speedY = 0;
    playerCharacter.y = gameArea.canvas.height - playerCharacter.height;
  }
}

function flashScore() {
  if (scoreBoard.color === 'black') {
    scoreBoard.color = 'white';
  } else {
    scoreBoard.color = 'black';
  }

  if (gameArea.bonusActiveTime > 1200) {
    scoreBoard.color = 'black';
    clearInterval(gameArea.bonusInterval);
  }
  gameArea.bonusActiveTime += 150;
}

function flashCoinScore() {
  coinScoreBoardSupImg.update();
  if (coinScoreBoard.color === 'black') {
    coinScoreBoard.color = 'white';
    coinScoreBoardSupImg.alpha = 1;
  } else {
    coinScoreBoard.color = 'black';
    coinScoreBoardSupImg.alpha = 0;
  }

  if (gameArea.coinScoreActiveTime > 1200) {
    coinScoreBoard.color = 'black';
    coinScoreBoardSupImg.alpha = 0;
    clearInterval(gameArea.coinScoreInterval);
  }
  gameArea.coinScoreActiveTime += 150;
}


function flashStartArrow(){
  switchArrow++;
  if(switchArrow < 30){
    startArrow3.setSrc('Pictures/goldArrow.png');
    startArrow2.setSrc('Pictures/blackArrow.png');
    startArrow1.setSrc('Pictures/blackArrow.png');
  }else if(switchArrow < 60){
    startArrow3.setSrc('Pictures/blackArrow.png');
    startArrow2.setSrc('Pictures/goldArrow.png');
  }else if(switchArrow < 90){
    startArrow2.setSrc('Pictures/blackArrow.png');
    startArrow1.setSrc('Pictures/goldArrow.png');
  }else{
    switchArrow = 0;
  }
  startArrow1.setX(startArrow1.getOrignX()-xPos);
  startArrow2.setX(startArrow2.getOrignX()-xPos);
  startArrow3.setX(startArrow3.getOrignX()-xPos);
}

//Uppdatera spelområdet för den period som definieras i spelområdet, nuvarande var 20:e millisekund (50 gånger i sekunden)
function updateGameArea() {
  let pausemodal = document.getElementById('gamePauseModal');
  let optionsModal = document.getElementById('optionsModal');
  if (gamePaused) {
    pausemodal.style.display = 'block';
    if (!musicMuted) { //"mute music"
      audio.pause();
      musicToggled = true;
    }
    return;
  } else if (displayOptionsModal){
    optionsModal.style.display = 'block';
    if (!musicMuted) {
      audio.pause();
      musicToggled = true;
    }
    return;
  } else {
    pausemodal.style.display = 'none';
    optionsModal.style.display = 'none';
    if (musicToggled) { //"unmute music"
      audio.load();
      musicToggled = false;
    }
  }
  //när "frame number" når 3000 (där nivån slutar) end level
  //kontrollera aktuell nivå, om fler än 5 (eftersom det bara finns fem nivåer för närvarande), visa att spelet är avklarat
  if (gameArea.time >= LEVEL_COMPLETION_TIME) {
    gameArea.stop();
    if (currentLevel === totalLevels) gameComplete();
    else {
      currentLevel++;
      var levelTransitionModal = document.getElementById('levelTransitionModal');
      levelTransitionModal.style.display = 'block';
      var levelTransitionModalContent = document.getElementById('levelTransitionModalContent');
      levelTransitionModalContent.innerHTML += `<p id="coinMessage" class="levelTransitionMessage">Coins earned: ${currentCoins}</p>`;
      levelTransitionModalContent.innerHTML += `<p id="pointsMessage" class="levelTransitionMessage">Points earned: ${currentScore}</p>`;
    }
  }

  for (let i = 0; i < enemyCharacters.length; i++){
    if(enemyCharacters[i].isAlive()) {
      if(playerCharacter.jumpsOn(enemyCharacters[i])){
        enemyCharacters[i].setAlive(false);
        incrementScore(100*currentLevel);
        gameArea.bonusActiveTime = 0;
        gameArea.bonusInterval = setInterval(flashScore, 150);
        if (!musicMuted) {
          enemykilled = document.getElementById('enemykilled');
          enemykilled.autoplay = true;
          enemykilled.load();
        }
      } else if (playerCharacter.crashWith(enemyCharacters[i])){
        backgroundDx = 0;
        gameArea.stop();
        gameOver();
      }
    }
  }

  coinRotationValue++; //uppdaterar "rotation value" innan vi uppdaterar själva vodkaflaskorna/"coins"
  if (coinRotationValue >= 40){
    coinRotationValue = 0;
  }
  //loop för "coin kollision"
  for (let i = 0; i < coins.length; i++) {
    if (coins[i].isAlive()){
      if (playerCharacter.crashWith(coins[i])){
        coins[i].setSrc('Pictures/stars.png');
        //öka "collected coins counter"
        collectedCoins++;
        currentCoins++;
        incrementScore(50 * currentLevel);
        coins[i].setAlive(false);
        //animera poängtavla
        gameArea.coinScoreActiveTime = 0;
        gameArea.coinScoreInterval = setInterval(flashCoinScore, 150);
        if(!musicMuted){
          coinpickup = document.getElementById('coinpickup');
          coinpickup.autoplay = true;
          coinpickup.load();
        }
      }else{
        coins[i].rotation();
      }
    }
  }

  //töm canvas före varje uppdatering
  gameArea.clear();

  //uppdatera bakgrund
  background.moveBackgrounds(background2);
  background.update();
  background2.update();

  //uppdatera moln (inte på nivå 5 då den är inomhus)
  if(currentLevel !== 5){
    for (let i = 0; i < clouds.length; i++) {
      clouds[i].x += 0.5 - backgroundDx;
      clouds[i].update();
    }
  }

  //poänguppdatering
  scoreBoard.text = 'SCORE: ' + score;
  scoreBoard.update();

  //"collected coins update"
  coinScoreBoard.text = collectedCoins;
  coinScoreBoard.update();
  coinScoreBoardImg.update();
  highscoreBoard.update();

  //"startArrow" uppdatering
  flashStartArrow();
  startArrow1.update();
  startArrow2.update();
  startArrow3.update();


  //Timer uppdatering
  timeBoard.text = Math.ceil(timeLeft);
  timeBoard.update();
  timeBoardImg.update();

  //äkning "frame number" för timer
  incrementFrameNumber(2);
  incrementTime(2);

  //LevelDisplay uppdatering
  levelDisplay.text = 'Level ' + currentLevel;
  levelDisplay.update();

  //enemy uppdatering
  for (let i = 0; i < enemyCharacters.length; i++) {
    enemyCharacters[i].update();
  }

  //coins/vodka uppdatering
  for (let i = 0; i < coins.length; i++) {
    coins[i].update();
  }

  //spelkaraktär uppdatering
  playerCharacter.newPos();
  correctCharacterPos();
  playerCharacter.update();

  //Efter varje 35 iteration, vänder flyUp, så att flygande fiender börjar gå i motsatt riktning.
  if (flyCounter === 35) {
    flyUp = !flyUp;
    flyCounter = 0;
  }

  //flyCounter ökar varje iteration
  flyCounter++;

  //loop för att ställa in "enemy characters" hastighet
  for (let i = 0; i < enemyCharacters.length; i++) {
    if (enemyCharacters[i].isAlive()) {
      //kontrollera om nivån är 3 eller högre
      //variera hastigheten för enemy characters om nivån är 3 eller högre
      if (currentLevel >= 3 && enemyCharacters[i].moveType !== FLYING) { //De flygande fienderna är tillräckligt snabba :)
        if (currentLevel === 5 && enemyCharacters[i].moveType === REVERSED) {
          enemyCharacters[i].x -= (-4 + backgroundDx); //Dessa fiender kommer in från vänster
        } else {
          enemyCharacters[i].x += (-4 - backgroundDx);
        }
      } else {
        enemyCharacters[i].x += (-2 - backgroundDx);
      }
      //Detta säger om flygande fiender ska gå upp eller ner
      if (enemyCharacters[i].moveType === FLYING) {
        if (flyUp === true) {
          enemyCharacters[i].y += 3;
        } else {
          enemyCharacters[i].y += -3;
        }
      }
      //Detta roterar fiender av typ 2 - för närvarande bara det snurrande tangentbordet i nivå 5
      if (enemyCharacters[i].moveType === ROTATING) {
        enemyCharacters[i].angle += 10 * Math.PI / 180;
      }
    } else { // om död; fiende kommer att "pressas", falla till marken och "blekna" bort.
      enemyCharacters[i].height = enemyCharacters[i].initHeight / 3;
      enemyCharacters[i].x -= backgroundDx;
      enemyCharacters[i].y += 10;
      enemyCharacters[i].alpha += -0.01;
      if (enemyCharacters[i].alpha < 0) {
        enemyCharacters[i].alpha = 0;
      }
      enemyCharacters[i].hitBottom();
    }
  }

  //Loop för att ställa in hastighet på vodkaflaskorna
  //om vodkan inte "lever" och tas av spelaren, gör så att vodkan försvinner
  for (let i = 0; i < coins.length; i++) {
    if(coins[i].isAlive()){
      coins[i].x += -2-backgroundDx;
    }
    else{
      coins[i].coinDisappear();
    }
  }
}


function incrementFrameNumber(value) {
  gameArea.frameNo += value;
}

function incrementScore(value) {
  score += value;
  currentScore += value;
}

function incrementTime(value) {//Både "increments time"  och uppdatering av "onscreen timer value"
  gameArea.time += value;
  timeLeft = (LEVEL_COMPLETION_TIME - gameArea.time) / 100;
}

//Stoppar "player character" från att ständigt flytta efter att knappen "move" har tryckts in
function stopMove() {
  playerCharacter.speedX = 0;
  playerCharacter.speedY = 0;
  if (playerCharacter.y < 0) {
    playerCharacter.speedY = 0;
    playerCharacter.y = 0;
  }
  if (playerCharacter.x < 0) {
    playerCharacter.speedX = 0;
    playerCharacter.x = 0;
  }
  if (playerCharacter.x > gameArea.canvas.width - playerCharacter.width) {
    playerCharacter.speedX = 0;
    playerCharacter.x = gameArea.canvas.width - playerCharacter.width;
  }
}

function moveUp(state){
  if(state === 'hit'){
    if(playerCharacter.speedY >= -3){
      playerCharacter.speedY = -7;
    }else{ //Om "player character" redan rör sig upp, får vi dem istället att gå något snabbare
      playerCharacter.speedY -= 4;
    }
    playerCharacter.hitGround = false;
  }
  else if (playerCharacter.hitGround && playerCharacter.y >= 170){
    playerCharacter.speedY = -20;
    playerCharacter.hitGround = false;
    playerCharacter.jumpCooldown = true;
    if (!musicMuted) {
      jump = document.getElementById('jump');
      jump.autoplay = true;
      jump.load();
    }
  }
  else if(playerCharacter.doubleJumpAllowed === true){ /*  För närvarande gör ingenting, då den första "UP/W"
     * "key logic" tillåter inte "moveUP" funktionen att anropas */
    playerCharacter.speedY = -7;
    playerCharacter.doubleJumpAllowed = false;
  }
}

function moveLeft() {
  playerCharacter.changeDir(-1);
  //playerCharacter.speedX = -5;
  backgroundDx = -5;
}

function moveRight(){
  playerCharacter.changeDir(1);
  //playerCharacter.speedX = 5;
  if(xPos <= -5){
    xPos = 0;
    background.setX(-50);
    background2.setX(850);
  }
  backgroundDx = 5;
}

function duck(){
  if (playerCharacter.hitGround){
    playerCharacter.height = playerCharacter.height / 2;
    playerCharacter.duckCooldown = true;
  }
}

var interval;

function moveLeftMouse() {
  interval = setInterval(moveLeft, 1);
  backgroundDx = -5;
}

function moveRightMouse() {
  interval = setInterval(moveRight, 1);
  if(xPos <= -5){
    xPos = 0;
    background.setX(-50);
    background2.setX(850);
  }
  backgroundDx = 5;
}

function onMouseUp() {
  clearInterval(interval);
  stopMove();
  backgroundDx = 0;
}

function duckMouseUp() {
  if(playerCharacter.hitGround && playerCharacter.duckCooldown === true){//ifall "statement" används så ökar inte "player character" i storlek när "DOWN" eller S trycks ner medans "character" befinner sig i luften
    playerCharacter.height = playerCharacter.height * 2; 
    playerCharacter.duckCooldown = false;
  }
}

function resumeGame() {
  var levelTransitionModal = document.getElementById('levelTransitionModal');
  var levelTransitionModalContent = document.getElementById('levelTransitionModalContent');
  if (levelTransitionModal.style.display === 'block') {
    var coinMessage = document.getElementById('coinMessage');
    var pointsMessage = document.getElementById('pointsMessage');
    levelTransitionModalContent.removeChild(coinMessage);
    levelTransitionModalContent.removeChild(pointsMessage);
    levelTransitionModal.style.display = 'none';
    currentCoins = 0;
    currentScore = 0;
    startLevel();
  }
}