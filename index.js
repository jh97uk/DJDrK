var howManyFacesX;
var howManyFacesY;
var faceRows = [];
var startingFaceY = 0;
var drK5Head;
var drKMainHead;
var backgroundImage;
scaler = 1;

class Timer{
  constructor(seconds, onIncriment, callOnceFinished){
    this.ms = seconds*1000;
    this.onIncriment = onIncriment;
    this.callOnceFinished = callOnceFinished;
    this.msElapsed = 0;
    this.startingTimestamp = 0;
    
  }

  update(timestamp){
    if(this.startingTimestamp == 0)
      this.startingTimestamp = timestamp
    console.log(timestamp);
    this.msElapsed = timestamp-this.startingTimestamp

  }
}

class FaceFallRow{
  constructor(faceImages, x, y, columns, radius, rowIndex){
    this.x = x+width/40;
    this.y = y+height/20;
    this.padding = 20;
    this.degrees = 360;
    this.columns = columns;
    this.rowIndex = rowIndex;
    this.radius = radius;
    this.faceImages = faceImages;
    this.faceImagesOrdered = [];
    for(var column = 0; column < this.columns; column++){
      this.faceImagesOrdered.push(faceImages[Math.floor(Math.random()*this.faceImages.length)]);
    }
  
  }

  update(){ 
    this.y = this.y+1;
    this.x = Math.cos(this.degrees*5*Math.PI/180) * 5;
    this.degrees = this.degrees-1;
    if(this.y > height+this.radius){
      faceRows[faceRows.indexOf(this)].y = startingFaceY+40;
    }
  }

  display(){
    for(var column = 0; column < this.columns; column++){
      image(this.faceImagesOrdered[column], this.x+(((this.radius*2)+this.padding)*column), this.y, this.radius*2, this.radius*2);  
    }
  }
}

class DancingHead{
  constructor(headImageUrl, x, y){
    this.headImage = loadImage(headImageUrl);
    this.x = x;
    this.y = y;
    this.rotationIncriment = 0;
    this.angle = 0;
    this.scale = 0;
    this.scaleTimer = new Timer(13, function(secondsElapsed, secondsRemaining){
      console.log(secondsElapsed/13);
    }, function(){
      console.log("finished");
    })
  }


  update(){
    this.rotationIncriment+=1;
    if(this.scale <1)
    this.scale += deltaTime/12000;
    this.angle=Math.cos(this.rotationIncriment*6*Math.PI/180) * 30
    
  }

  display(){
    imageMode(CENTER); 
    translate((this.x)+(636/2), (this.y)+(720/2));
    rotate(PI/180*this.angle);    
    scale(lerp(0, 1, this.scale));
    image(this.headImage, 0, 0, 636, 720);
    rotate(PI/180*0);
    translate(0, 0);
  }
}

function setup() {
  var yPadding = 20;
  createCanvas(windowWidth, windowHeight);
  circleRadius = 40;
  howManyFacesX = Math.ceil(width/(circleRadius*2))+1;
  howManyFacesY = Math.floor(height/(circleRadius*2));
  startingFaceY = height-(howManyFacesY*((circleRadius*2)+20))
  console.log(startingFaceY)
  for(var row = 0; row < howManyFacesY; row++){
    faceRows.push(new FaceFallRow([loadImage('5headpog.png'), loadImage('drkomega.png'), loadImage('frenchlaugh.png'), loadImage('frenchpog.png'), loadImage('pog.png'), loadImage('drkshok.png')], 0, startingFaceY+(((circleRadius*2)+yPadding)*row), howManyFacesX, circleRadius));
  }
  
  drKMainHead = new DancingHead('head.png', (windowWidth/2)-(636/2), (windowHeight/2)-(720/2), 636, 720);
  backgroundImage = loadImage('background.jpg')

}

function draw() {
  background(220);
  image(backgroundImage, windowWidth/2, windowHeight/2, windowWidth, windowHeight)

  for(let row of faceRows){
    row.update();
    row.display();
  }

  drKMainHead.update();
  drKMainHead.display();
}