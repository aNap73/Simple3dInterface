
var int3d = {
  tempcanvas: '',
  colGiffys: [],
  rotspeed: 0,
  maxcharacterswide: 50,
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(),
  renderer: new THREE.WebGLRenderer(),
  //renderer: new THREE.CSS3DRenderer(),
  myheight: 0,
  mywidth: 0,
  mylastevent: '',
  ant3dMouse: new THREE.Vector2(),
  bBack: false,
  NewTex: '',
  NewTex2: '',
  NewTex3: '',
  bProcessingGifs: false,
  colMovs: [],
  colHeadings: [],
  colArticles: [],
  colLinks: [],
  getWikiData: function (SearchTerm, callback) {
    $.ajax({
      type: "GET",
      url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search="' + SearchTerm + '"&format=json&callback=?',
      dataType: 'json'
    }).then(function (jsondata, status, jqXHR) {
      int3d.colHeadings.length = 0;
      int3d.colArticles.length = 0;
      int3d.colLinks.length = 0;


      $.each(jsondata[1], function (index, value) {
        int3d.colHeadings.push(value);
        int3d.colArticles.push(jsondata[2][index]);
        int3d.colLinks.push(jsondata[3][index]);

      })

      callback();
    });

  },
  GetGiffys: function (inSrch, callback) {
    let gkey = "aGpceXfwMY5TKtoH39N128oj2HirwBKv";
    let offset = Math.floor(Math.random() * 125);
    int3d.colMovs.length = 0;
    $.ajax({
      url: "https://api.giphy.com/v1/gifs/search?api_key=" + gkey + "&q='" + inSrch + "'&offset=" + offset + "&limit=3",
      method: "GET"
    }).then(function (response) {
      int3d.colGiffys.length = 0;

      for (i = 0; i < response.data.length; i++) {
        let rd = response.data[i];
        let gif = rd.images.looping.mp4;

        int3d.colGiffys.push(gif);
      }

      callback(inSrch, int3d.GenerateObjects);

    });
  },
  Resize: function (){
    int3d.myheight = window.innerHeight * .8;
    int3d.mywidth = window.innerWidth * .6;
    int3d.camera = new THREE.PerspectiveCamera(75, (int3d.mywidth / int3d.myheight), 0.1, 1000);
    int3d.renderer.setSize(int3d.mywidth, int3d.myheight);
  },
  StartUp: function (inJQueryDomElement, inSrch) {
    //Code that sets up your initial sceen here
    int3d.colGiffys.length = 0;
    int3d.rotspeed = 0;
    int3d.myheight = window.innerHeight * .8;
    int3d.mywidth = window.innerWidth * .6;

    while (int3d.scene.children.length > 0) { int3d.scene.remove(int3d.scene.children[0]); }
    int3d.renderer.renderLists.dispose();

    int3d.scene = new THREE.Scene();
    int3d.renderer = new THREE.WebGLRenderer();
    
    int3d.camera = new THREE.PerspectiveCamera(75, (int3d.mywidth / int3d.myheight), 0.1, 1000);
    int3d.renderer.setSize(int3d.mywidth, int3d.myheight);

    int3d.colMovs.length = 0;
    int3d.colHeadings.length = 0;
    int3d.colArticles.length = 0;
    int3d.colLinks.length = 0;
    inJQueryDomElement.empty();



    int3d.NewTex = '',
      int3d.NewTex2 = '',
      int3d.NewTex3 = '',

      int3d.camera.position.z = 0;

    
    inJQueryDomElement.append(int3d.renderer.domElement);


  
    $(document).on('click', function (e) {



      int3d.mylastevent = e;
      let video = document.getElementById('myvideo');
      let video2 = document.getElementById('myvideo2');
      let video3 = document.getElementById('myvideo3');
      
      video.loop = true;
      video.play();

      video2.loop = true;
      video2.play();

      video3.loop = true;
      video3.play();

    });
    //inJQueryDomElement = $('.mycanvas');
  
    $(document).on('touchstart', function (e) {
      e.preventDefault();
      int3d.mylastevent = e;
      let video = document.getElementById('myvideo');
      let video2 = document.getElementById('myvideo2');
      let video3 = document.getElementById('myvideo3');
      
      video.loop = true;
      video.play();

      video2.loop = true;
      video2.play();

      video3.loop = true;
      video3.play();
    });
    
    $(document).on('touchend', function (e) {
      e.preventDefault();
      let DeltaX = int3d.mylastevent.originalEvent.touches[0].pageX - e.originalEvent.changedTouches[0].pageX;
      int3d.ant3dMouse.x = e.originalEvent.changedTouches[0].pageX;
      int3d.ant3dMouse.y = e.originalEvent.changedTouches[0].pageY;
      int3d.mylastevent = e;
      int3d.rotspeed = DeltaX * .0001;

    });
    
    $(document).on('mousedown', function (e) {
      int3d.mylastevent = e;
    });
    
    $(document).on('mouseup', function (e) {
      let DeltaX = int3d.mylastevent.clientX - e.clientX;
      int3d.rotspeed = DeltaX * .0001;
      int3d.mylastevent = e;
    });


    int3d.GetGiffys(inSrch, int3d.getWikiData);


  },
  GetTextArray: function (inText, inLineLen) {
    //This function wraps text el-manuel aan.
    let col = [];
    let wrkwords = inText.split(' ');
    let wrkline = '';
    //Split words by space into array
    $.each(wrkwords, function (i, item) {
      let curline = wrkline + ' ' + item;
      //If current line + new word and space is too big. break
      if (curline.length > inLineLen) {
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
  GenerateCube: function (name, x, y, z, inTitle, inArticle, inLink) {

    //this code generates a cube, either text or image... atm
    let geometry = new THREE.BoxGeometry(7, 3.5, 1);

    int3d.tempcanvas = document.createElement("canvas");
    let xc = int3d.tempcanvas.getContext("2d");





    xc.textBaseline = 'top';
    /// color for background    
    xc.fillStyle = "blue";
    xc.width = xc.height = 128;

    xc.shadowColor = "#000";
    xc.fillRect(0, 0, int3d.tempcanvas.width, int3d.tempcanvas.height);
    xc.shadowBlur = 7;
    xc.fillStyle = "white";
    xc.font = "15pt arial bold";


    let ypos = 5;
    $.each(int3d.GetTextArray(inTitle, 30),
      function (i, item) {

        xc.fillText(item, 5, ypos);
        ypos += 15;
      });
    ypos += 10;
    xc.font = "10pt arial bold";
    $.each(int3d.GetTextArray(inArticle, int3d.maxcharacterswide),
      function (i, item) {
        xc.fillText(item, 10, ypos);
        ypos += 12;
      });

    //add map here
    let xm = '';
    let myrnd = Math.random();
    switch (true) {
      case myrnd < .125:
        xm = new THREE.MeshBasicMaterial({
          map: int3d.NewTex
        });
        xm.map.needsUpdate = true;
        break;
      case myrnd < .25:
        xm = new THREE.MeshBasicMaterial({
          map: int3d.NewTex2
        });
        xm.map.needsUpdate = true;
        break;
      case myrnd < .5:
        xm = new THREE.MeshBasicMaterial({
          map: int3d.NewTex3
        });
        xm.map.needsUpdate = true;
        break;
      default:
        xm = new THREE.MeshBasicMaterial({
          //map: int3d.NewTex3
          map: new THREE.Texture(int3d.tempcanvas)
        });
        xm.map.needsUpdate = true;
        break;
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
    let cube = new THREE.Mesh(geometry, material);
    cube.antName = name;
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    return cube;
  },
  Videos: [],
  GenerateObjects() {
    //Generate 3 rows of 10 cubes
    let cubx = 0;
    let cuby = 0;
    let cubz = -12;
    let angle = 0
    THREE.ImageUtils.crossOrigin = '';
    let video = document.getElementById('myvideo');
    video.setAttribute('crossorigin', 'anonymous');
    let video2 = document.getElementById('myvideo2');
    video2.setAttribute('crossorigin', 'anonymous');
    let video3 = document.getElementById('myvideo3');
    video3.setAttribute('crossorigin', 'anonymous');

    video.src = int3d.colGiffys[0];
    video2.src = int3d.colGiffys[1];
    video3.src = int3d.colGiffys[2];
  
    video.load();
    //video.addEventListener('loadeddata', function () {
      video2.load();
    //  video2.addEventListener('loadeddata', function () {
        video3.load();
    //    video3.addEventListener('loadeddata', function () {

          video.loop = true;
          video.play();
          video2.loop = true;
          video2.play();
          video3.loop = true;
          video3.play();
      
          let texture1 = new THREE.VideoTexture(video);
          texture1.minFilter = THREE.LinearFilter;
          texture1.magFilter = THREE.LinearFilter;
          texture1.format = THREE.RGBFormat;
          texture1.needsUpdate = true;

          let texture2 = new THREE.VideoTexture(video2);
          texture2.minFilter = THREE.LinearFilter;
          texture2.magFilter = THREE.LinearFilter;
          texture2.format = THREE.RGBFormat;
          texture2.needsUpdate = true;

          let texture3 = new THREE.VideoTexture(video3);
          texture3.minFilter = THREE.LinearFilter;
          texture3.magFilter = THREE.LinearFilter;
          texture3.format = THREE.RGBFormat;
          texture3.needsUpdate = true;


          int3d.NewTex = texture1
          int3d.NewTex2 = texture2
          int3d.NewTex3 = texture3



          let artid = 0;
          for (let i = 0; i < 10; i++) {
            // Video is loaded and can be played
            if(artid===9){artid=0}; 
            let myTitle = int3d.colHeadings[artid];
            let myArticle = int3d.colArticles[artid];
            let myLink = int3d.colLinks[artid];
            if(artid<9){artid++};
            

            cuby = -4;
            let xz = int3d.rotate(0, 0, cubx, cubz, ((360 / 10) * i));
            let cubeA = int3d.GenerateCube('cubeA' + i, xz[0], cuby, xz[1], myTitle, myArticle, myLink);
            
            
            myTitle = int3d.colHeadings[artid];
            myArticle = int3d.colArticles[artid];
            myLink = int3d.colLinks[artid];
            if(artid<9){artid++};

            cuby = 0;
            xy = int3d.rotate(0, 0, cuby, cubx, ((360 / 10) * i));
            let cubeB = int3d.GenerateCube('cubeB' + i, xz[0], cuby, xz[1], myTitle, myArticle, myLink);

            myTitle = int3d.colHeadings[artid];
            myArticle = int3d.colArticles[artid];
            myLink = int3d.colLinks[artid];
            if(artid<9){artid++};
            
            cuby = 4;
            xy = int3d.rotate(0, 0, cuby, cubx, ((360 / 10) * i));
            let cubeC = int3d.GenerateCube('cubeC' + i, xz[0], cuby, xz[1], myTitle, myArticle, myLink);

            int3d.scene.add(cubeA, cubeB, cubeC);
          }
          requestAnimationFrame(int3d.Animate);

  //      }, false);
  //    }, false);
  //  }, false);
    return;
  },
  clearThreeObj: function (obj) {
    while (obj.children.length > 0) {
      int3d.clearThreeObj(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();
    if (obj.Mesh) obj.Mesh.dispose();
    if (obj.texture) obj.texture.dispose();
  },
  Animate: function () {
    //Code that runs every frame goes here

    int3d.scene.rotation.y += int3d.rotspeed;
    $.each(int3d.scene.children, function (i, item) {
      item.rotation.y += -int3d.rotspeed;
    });
    int3d.renderer.render(int3d.scene, int3d.camera);

    int3d.rotspeed = int3d.rotspeed * .98;
    requestAnimationFrame(int3d.Animate);
  },
  rotate: function (cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
  }
}
$(document).ready(function () {
  int3d.StartUp($("#rightherebaby"), 'Programming');
  $(window).on('resize',function(){int3d.Resize();});
  $('#search').on('click', function () {    
    int3d.StartUp($("#rightherebaby"), $('#input').val());
    $('#input').val('');
  });
  $('#input').on('keyup',function(e){
      if (e.key === 'Enter' ){
        int3d.StartUp($("#rightherebaby"), $('#input').val());
        $('#input').val('');
      }
  });
});
