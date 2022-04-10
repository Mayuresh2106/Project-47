var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bkg, bkg_image;
var girl, girl_running, girl_dead, witch, witch_running;
var obstaclesGroup, obstacle1
var jumpSound, dieSound, checkpointSound;
var score;
var gameOver, restart, gameOverImage, restartImage;
var stopper;
var grass,grass_img;
var tree,tree_img;
var house,house_img;
var bullet_shoot;
var witch_laugh;
var bkg_sound;
var invisible_ground;
function preload() {
  bkg_image = loadImage("Background.jpg");
  girl_running = loadAnimation("r1.png","r2.png","r3.png","r4.png","r5.png","r6.png","r7.png","r8.png","r9.png","r10.png");
  girl_dead = loadImage("r3.png")
  witch_running = loadAnimation("w1.png","w2.png","w3.png","w4.png","w5.png","w6.png","w7.png","w8.png","w9.png","w10.png","w11.png","w12.png");
  obstacle1 = loadImage("lazer.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  witch_laugh = loadSound("witch_laughing.wav");
  bullet_shoot = loadSound("bullet_shooted.wav")
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
 
  grass_img = loadImage("grass2.PNG");
  tree_img = loadImage("tree.png");
  house_img = loadImage("house.png");
}

function setup() {
  createCanvas(600, 300);

  bkg = createSprite(0, 150, 0, 0);
  bkg.addImage("bkg_image", bkg_image);
  bkg.scale = 1.4;
  bkg.velocityX = -1

  house = createSprite(400,200,20,20);
  house.addImage(house_img);
  house.velocityX = -5;
  house.lifetime = 100;

  grass = createSprite(300,280,600,10)
  grass.addImage("grass2",grass_img)
  grass.scale = 0.4

  stopper = createSprite(300,88,50,10)
  stopper.visible = false

  girl = createSprite(300, 170, 600, 10);
  girl.addAnimation("girl_running", girl_running);
  
  girl.scale = 0.3;
  
  witch = createSprite(90, 210, 600, 10);
  witch.addAnimation("witch_running", witch_running);
  
  witch.scale = 0.5;
  witch.debug = false;
  
  invisible_ground = createSprite(300,280,600,10);
  invisible_ground.visible = false;

  gameOver = createSprite(300, 75);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.3

  restart = createSprite(300, 180);
  restart.addImage(restartImage);
restart.scale = 0.2

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background("black");

witch_laugh.volume  = 30

  if(frameCount%20===0){
    trees();
    tree.depth = gameOver.depth
    gameOver.depth+=2

   tree.depth = restart.depth
   restart.depth+=2

   witch.depth = tree.depth
   witch.depth+=4
    }

  girl.collide(stopper)
  girl.setCollider("rectangle",0,0,130,300)
  girl.debug = false


   console.log(girl.y);
  //Gravity
  girl.velocityY = girl.velocityY + 0.8;
  girl.collide(invisible_ground);

  //Gravity
 


  if (gameState === PLAY) {
   
    
    gameOver.visible = false;
    restart.visible = false;
    //  zombie.y=girl.y;
    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();

    
    bkg.velocityX = -(4 + 3 * score / 100);

    if (bkg.x < 174) {
      bkg.x = bkg.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if (keyDown("space")&&girl.y>=230) {
      girl.velocityY = -12;
      jumpSound.play();
    }

    if(touches.length>1&&girl.y>=230){
    girl.velocityY = -12;
    jumpSound.play();
    }

    if (girl.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    bkg.velocityX = 0;
    girl.velocityY = 0
    tree.velocityX = 0
    tree.destroy()
    obstaclesGroup.destroyEach();
   girl.visible = false
   witch.visible = false
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)||touches.length>0||keyDown("enter")) {
      reset();
    }
  }


  drawSprites();
  fill("lightpink");
  textSize(20);
  text("Score: " + score, 500, 50);
}

function trees() {
   tree = createSprite(610,250,20,20);
  tree.addImage(tree_img);
  scl = Math.round(random(1,3));


  if(scl===1){
    tree.scale = 0.2;
    tree.y = 235;
  }
  else if(scl===2){
    tree.scale = 0.3;
    tree.y = 210;
  }
  else if(scl===3){
    tree.scale = 0.4;
     tree.y = 180;
  }
  tree.depth = girl.depth;
  girl.depth = girl.depth + 2;

  tree.velocityX = -5;
  tree.lifetime = 130;
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  girl.visible = true
  witch.visible = true
  girl.changeAnimation("girl_running", girl_running);
 witch.changeAnimation("witch_running",witch_running)

 obstaclesGroup.destroyEach();

  score = 0;
  witch.x = 50;
}

function spawnObstacles() {
  if (frameCount % 80 === 0) {
    var obstacle = createSprite(90, 230, 10, 40);
    obstacle.velocityX = 5; //+ score/100);
    
bullet_shoot.play();
witch_laugh.play();
    //generate random obstacles
    var rand = Math.round(random(1, 6));
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.1;
    obstaclesGroup.add(obstacle);
    obstacle.debug = false;
    obstacle.setCollider("circle", 0, 0, 1);

    obstacle.depth = witch.depth
    witch.depth+=2

    obstacle.depth = tree.depth
    obstacle.depth+=10

    obstacle.depth = grass.depth
    grass.depth+=8

    obstacle.depth = tree.depth
    obstacle.depth+=2

  }
}

