
var int3d = {  
  rotspeed: 0,
  maxcharacterswide: 40,
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(),
  renderer: new THREE.WebGLRenderer(),
  //renderer: new THREE.CSS3DRenderer(),
  myheight: 0,
  mywidth: 0, 
  mylastevent:'',
  ant3dMouse: new THREE.Vector2(),
  bBack: false,
  NewTex: '',
  StartUp: function(inJQueryDomElement){
    //Code that sets up your initial sceen here    
    int3d.myheight = window.innerHeight*1;
    int3d.mywidth = window.innerWidth*1;
    
    inJQueryDomElement.append(int3d.renderer.domElement);    
  
    int3d.camera = new THREE.PerspectiveCamera( 75, (int3d.mywidth/int3d.myheight), 0.1, 1000 );
    int3d.camera.position.z =0;
    int3d.renderer.setSize( int3d.mywidth, int3d.myheight );
    int3d.GenerateObjects();   
    inJQueryDomElement.on('touchstart',  function (e) {
      //e.preventDefault();
      int3d.mylastevent = e;
      var video = document.getElementById( 'video' );
      video.loop=true;
      video.play();
      
      //int3d.Videos[0].play();
      //$('#video').play();
    });
    inJQueryDomElement.on('touchend', function (e) {      
      //e.preventDefault();
      let DeltaX = int3d.mylastevent.originalEvent.touches[0].pageX - e.originalEvent.changedTouches[0].pageX;
      console.log(DeltaX);

    
      int3d.ant3dMouse.x = e.originalEvent.changedTouches[0].pageX;
      int3d.ant3dMouse.y = e.originalEvent.changedTouches[0].pageY;
      int3d.mylastevent = e;
      int3d.rotspeed = DeltaX * .0001;
    });

    inJQueryDomElement.on('mousedown',function (e) {
    
      e.preventDefault();
      var video = document.getElementById( 'video' );
      video.loop=true;
      video.play();

    
     int3d.mylastevent = e;
      
    });
    inJQueryDomElement.on('mouseup', function (e) {
      
      e.preventDefault();

      
      let DeltaX = int3d.mylastevent.clientX - e.clientX;
      int3d.rotspeed = DeltaX * .0001;
    
      int3d.mylastevent = e;
    
    });
    requestAnimationFrame(int3d.Animate);
      
  },
  GetTextArray:function(inText, inLineLen){
    //This function wraps text el-manuel aan.
    let col = [];
    let wrkwords = inText.split(' ');
    let wrkline = '';
    //Split words by space into array
    $.each(wrkwords,function(i,item){
      let curline = wrkline + ' ' + item;
      //If current line + new word and space is too big. break
      if (curline.length > inLineLen){
        //break line; push to output col
        col.push(wrkline);
        wrkline = item;
      } else {
        //add to line
        wrkline += ' ' + item;
      }
    });
    //Final push
    col.push(wrkline);
    return col;
  },
  GenerateCube: function(name,x,y,z){
    
    //this code generates a cube, either text or image... atm
    let geometry = new THREE.BoxGeometry( 7, 3.5, 1  );  
        
    let can = document.createElement("canvas");    
    let xc = can.getContext("2d");

    let inTitle =  "Urgent";
    let inArticle = "Luke needs help. Apparently an iframe and an html video 5 element are completely not the same in THREE.js... Help if you can... I need to get Abu's stuff into a HTML VIDEO TAG.";

    xc.textBaseline = 'top';
    /// color for background    
    xc.fillStyle = "blue";    
    xc.width = xc.height = 128;
    xc.font = "10pt arial bold";
    xc.shadowColor = "#000";    
    xc.fillRect(0, 0, can.width, can.height);
    xc.shadowBlur = 7;
    xc.fillStyle = "white";    
    xc.font = "20pt arial bold";
    xc.fillText(inTitle, 80, 5);
    xc.font = "10pt arial bold";
    $.each(int3d.GetTextArray(inArticle,int3d.maxcharacterswide),
    function (i, item){
      xc.fillText(item, 20, 40+(12*i));
    });
    
    //add map here
    let xm = '';
    if(Math.random()>.5){
      xm = new THREE.MeshBasicMaterial({
        map: int3d.NewTex
         });    
      xm.map.needsUpdate = true;
    }else{
      xm = new THREE.MeshBasicMaterial({
        map: new THREE.Texture(can), transparent: true
         });    
      xm.map.needsUpdate = true;
    }
    
      let material = new THREE.MeshFaceMaterial([
      new THREE.MeshBasicMaterial({
          
          color: 0x1b1b88
          //map: anthead
           //four rot right
      }),
      new THREE.MeshBasicMaterial({
        color: 0x1b1b88  
        //two rot right
       // map: anthead
      }),
      new THREE.MeshBasicMaterial({
        color: 0xeef06e
          //top
        //  map: anthead
      }),
      new THREE.MeshBasicMaterial({
        color: 0x95970a //bottom
        //map: anthead
      }),
      xm, //Front built external
      new THREE.MeshBasicMaterial({
        color: 0x1919e6   //three rot right
        //map: anthead
      })        
                                              ]);
      //Build cube mesh with geometry and material                                          
      let cube = new THREE.Mesh( geometry, material );
      cube.antName = name;
      cube.position.x=x;
      cube.position.y=y;
      cube.position.z=z;
      return cube;




  },
 Videos: [],  
 GenerateObjects(){
    //Generate 3 rows of 10 cubes
    let cubx = 0;
    let cuby = 0;
    let cubz = -12;
    let angle = 0
    THREE.ImageUtils.crossOrigin = '';
    //int3d.NewTex = THREE.ImageUtils.loadTexture('https://anap73.github.io/Responsive-Portfolio.github.io/assets/images/AntMeHead.png');
    var video = document.getElementById( 'video' );
    video.loop=true;
    video.play();
    int3d.Videos[0] = video;

    var texture = new THREE.VideoTexture( video );
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    texture.needsUpdate=true;

    int3d.NewTex = texture;
        for(let i=0; i < 10; i ++){
       
          cuby=-4;
          
          let xz = int3d.rotate(0,0,cubx,cubz,((360/10)*i));
          let cubeA = int3d.GenerateCube('cubeA' + i,xz[0],cuby,xz[1],0);
          cuby=0;
          xy = int3d.rotate(0,0,cuby,cubx,((360/10)*i));      
          let cubeB = int3d.GenerateCube('cubeB' + i,xz[0],cuby,xz[1],0);
          cuby=4;
          xy = int3d.rotate(0,0,cuby,cubx,((360/10)*i));
          let cubeC = int3d.GenerateCube('cubeC' + i,xz[0],cuby,xz[1],0);
          
          int3d.scene.add(cubeA, cubeB, cubeC);
        }

      return;
    let loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    // load a resource
    loader.load(
      // resource URL
      './assets/im/LukeNo.gif',
    
      // onLoad callback
      function ( texture ) {
        int3d.NewTex = texture;
        for(let i=0; i < 10; i ++){
       
          cuby=-4;
          
          let xz = int3d.rotate(0,0,cubx,cubz,((360/10)*i));
          let cubeA = int3d.GenerateCube('cubeA' + i,xz[0],cuby,xz[1],0);
          cuby=0;
          xy = int3d.rotate(0,0,cuby,cubx,((360/10)*i));      
          let cubeB = int3d.GenerateCube('cubeB' + i,xz[0],cuby,xz[1],0);
          cuby=4;
          xy = int3d.rotate(0,0,cuby,cubx,((360/10)*i));
          let cubeC = int3d.GenerateCube('cubeC' + i,xz[0],cuby,xz[1],0);
          
          int3d.scene.add(cubeA, cubeB, cubeC);
        }   
      },
   
      // onProgress callback currently not supported
      undefined,
    
      // onError callback
      function ( err ) {
        console.log( 'An error happened.' );
        console.log( err );
      }
    );

    
    
  },
  Animate: function () {
    //Code that runs every frame goes here
    
    int3d.scene.rotation.y += int3d.rotspeed;
    $.each(int3d.scene.children,function(i,item){
       item.rotation.y += -int3d.rotspeed; 
    }); 
    int3d.renderer.render(int3d.scene, int3d.camera);
    requestAnimationFrame(int3d.Animate);
    int3d.rotspeed = int3d.rotspeed * .98;
  },
  rotate: function(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}
}
$(document).ready(function(){
  int3d.StartUp($("#rightherebaby"));  
});
