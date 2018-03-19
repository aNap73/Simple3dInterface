var int3d = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(),
  renderer: new THREE.WebGLRenderer(),
  myheight: 0,
	mywidth: 0, 
  ant3dMouse: new THREE.Vector2(),
  StartUp: function(inJQueryDomElement){
    //Code that sets up your initial sceen here
    int3d.myheight = window.innerHeight*1;
    int3d.mywidth = window.innerWidth*1;
    THREE.ImageUtils.crossOrigin = '';
    inJQueryDomElement.append(int3d.renderer.domElement);
    
  
    int3d.camera = new THREE.PerspectiveCamera( 75, (int3d.mywidth/int3d.myheight), 0.1, 1000 );
    int3d.camera.position.z =0;
    int3d.renderer.setSize( int3d.mywidth, int3d.myheight );
    int3d.GenerateObjects();   
    requestAnimationFrame(int3d.Animate);  
  },
  GenerateCube(name,x,y,z){
    let geometry = new THREE.BoxGeometry( 7, 3.5, 1  );
    //console.log(rgb(25, 25, 230));
    let material = THREE.MeshFaceMaterial([
      new THREE.MeshBasicMaterial({
          
          color: 0x1b1b88
           //four rot right
      }),
      new THREE.MeshBasicMaterial({
        color: 0x1b1b88  
        //two rot right
      }),
      new THREE.MeshBasicMaterial({
        color: 0xeef06e
          //top
      }),
      new THREE.MeshBasicMaterial({
        color: 0x95970a //bottom
      }),
      new THREE.MeshBasicMaterial({
        color: 0x1919e6    //front rot right
      }),
      new THREE.MeshBasicMaterial({
        color: 0x1919e6   //three rot right
      })        
                                              ]);
      let cube = new THREE.Mesh( geometry, material );
      cube.antName = name;
      cube.position.x=x;
      cube.position.y=y;
      cube.position.z=z;
      return cube;
  },
  GenerateObjects(){
    //Generate 3 rows of 10 cubes
    let cubx = 0;
    let cuby = 0;
    let cubz = -12;
    let angle = 0
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
    console.log(int3d.scene);
  },
  Animate: function () {
    //Code that runs every frame goes here
    
    int3d.scene.rotation.y += .01;
    $.each(int3d.scene.children,function(i,item){
       item.rotation.y -= .01; 
    }); 
    int3d.renderer.render(int3d.scene, int3d.camera);
    requestAnimationFrame(int3d.Animate);
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
