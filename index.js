var config;
var hasStarted = false
var howManyFacesX;
var howManyFacesY;
var faceRows = [];
var startingFaceY = 0;
var dancingHead;
var backgroundImage;

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
    })
  }


  update(){
    this.rotationIncriment+=1;
    if(this.scale <1)
    this.scale += deltaTime/12000;
    this.angle=Math.cos(this.rotationIncriment*7.13*Math.PI/180) * 30
    
  }

  display(){
    imageMode(CENTER); 
    translate((this.x)+(636/2), (this.y)+(720/2));
    rotate(PI/180*this.angle);    
    scale(lerp(0, 1, this.scale));
    image(this.headImage, 0, 0, 636, 720);
    rotate(PI/180*0);
    translate(0, 0);
    imageMode(CORNER);
  }
}

function prepareVideo(){
  var player;

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'gr7HUN3UdNA',
    events: {
      'onReady': function(event){
        event.target.playVideo();
        event.target.setVolume(50);
        hasStarted = true
      },
      'onStateChange':function(event){
        if(event.data === YT.PlayerState.ENDED){
          event.target.playVideo();
        }
      }
    }
  });
  player.setLoop(true);
}

function setup() {
  fetch('configs/default.json').then(res => res.json()).then(function(response){
    config = response
    var yPadding = 20;
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("canvas")
    circleRadius = 40;
    howManyFacesX = Math.ceil(width/(circleRadius*2))+1;
    howManyFacesY = Math.floor(height/(circleRadius*2));
    startingFaceY = height-(howManyFacesY*((circleRadius*2)+20))
    var rainImages = [];
    
    for(const image of config.rainImages){
      rainImages.push(loadImage(image))
    }

    for(var row = 0; row < howManyFacesY; row++){
      faceRows.push(new FaceFallRow(rainImages, 0, startingFaceY+(((circleRadius*2)+yPadding)*row), howManyFacesX, circleRadius));
    }

    dancingHead = new DancingHead(config.dancingHead, (windowWidth/2)-(636/2), (windowHeight/2)-(720/2), 636, 720);
    backgroundImage = loadImage(config.background)

    Swal.fire({
      title:'Disclaimer',
      text:'This site contains a highly potent dose of funk and overall badassery. Please use responsibly and consult a licensed medical professional before proceeding.'
    }).then(function(){
      document.getElementById('canvas').classList.add('reveal');
      prepareVideo()
    });
  });

  
}

function draw() {
  if(!config)
    return
  background(220);
  image(backgroundImage, 0, 0, windowWidth, windowHeight)

  for(let row of faceRows){
    row.update();
    row.display();
  }

  if(hasStarted){
    dancingHead.update();
    dancingHead.display();
  }
}