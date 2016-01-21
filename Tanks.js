/*
All textures used are public domain and from opengameart.org. All sounds are also from
opengameart.org and are made by dklon.

CONTROLS:
Player1: WASD to move, Q and E to rotate the turret, F and R to raise and lower the turret, and shift to shoot.
Player2: IJKL to move, U and O to rotate the turret, Y and H to raise and lower the turret, and / to shoot.
*/

var arenaSize = 2500;
var walls = [];
var boundries = [];
var ground;
var text1;
var text2;

var Key = {
    pressed: {},

    I: 73,
    J: 74,
    K: 75,
    L: 76,
    U: 85,
    O: 79,
    H: 72,
    Y: 89,
    FSLASH: 191,
    
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    Q: 81,
    E: 69,
    F: 70,
    R: 82,
    SHIFT: 16,
	
	B: 66,
  
    isDown: function(keyCode) {
        return this.pressed[keyCode];
    },
    
    onKeydown: function(event) {
        this.pressed[event.keyCode] = true;
    },
  
    onKeyup: function(event) {
        this.pressed[event.keyCode] = false;
    }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

function addLights() {
    var ambientLight = new THREE.AmbientLight(0x222222);
    ambientLight.intensity = 0.0;
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);

    directionalLight.position.set(-750, 1125, 750);
    directionalLight.shadowCameraLeft = -2000;
    directionalLight.shadowCameraRight = 2000;
    directionalLight.shadowCameraTop = 1400;
    directionalLight.shadowCameraBottom = -1350;
    directionalLight.shadowCameraNear = 0;
    directionalLight.shadowCameraFar = 3000;
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}

function setupCamera() {
    camera.position.z = 300;
    camera.position.y = 2100;
    camera.position.x = 0;
    camera.lookAt(new THREE.Vector3(0,0,0));
}

function addGround() {
    var woodTex = THREE.ImageUtils.loadTexture('textures/wood1.jpg');
    woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
    woodTex.repeat.set( 2, 2 );
    var groundGeometry = new THREE.BoxGeometry(arenaSize, 5, arenaSize);
    var groundMaterial = new THREE.MeshLambertMaterial( {map: woodTex} );
    ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.receiveShadow = true;
    ground.Box3 = new THREE.Box3(new THREE.Vector3(-arenaSize / 2, -2.5, -arenaSize / 2), new THREE.Vector3(arenaSize / 2, 2.5, arenaSize / 2));
    scene.add(ground);
}

function addBoundries() {
    var woodTex = THREE.ImageUtils.loadTexture('textures/wood2.png');
    woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
    woodTex.repeat.set( 1, .1 );
    var uWall = new THREE.Mesh(new THREE.BoxGeometry(24, 100, arenaSize + 48), new THREE.MeshLambertMaterial( {map: woodTex} ));
    uWall.castShadow = true;
    uWall.receiveShadow = true;
    var dWall = new THREE.Mesh(new THREE.BoxGeometry(24, 100, arenaSize + 48), new THREE.MeshLambertMaterial( {map: woodTex} ));
    dWall.castShadow = true;
    dWall.receiveShadow = true;
    var lWall = new THREE.Mesh(new THREE.BoxGeometry(arenaSize, 100, 24), new THREE.MeshLambertMaterial( {map: woodTex} ));
    lWall.castShadow = true;
    lWall.receiveShadow = true;
    var rWall = new THREE.Mesh(new THREE.BoxGeometry(arenaSize, 100, 24), new THREE.MeshLambertMaterial( {map: woodTex} ));
    rWall.castShadow = true;
    rWall.receiveShadow = true;
    
    uWall.position.set(arenaSize / 2 + 12, 50, 0);
    dWall.position.set(-arenaSize / 2 - 12, 50, 0);
    lWall.position.set(0, 50, -arenaSize / 2 - 12);
    rWall.position.set(0, 50, arenaSize / 2 + 12);
    uWall.Box3 = new THREE.Box3(new THREE.Vector3(uWall.position.x - 12, 0, uWall.position.z - (arenaSize + 48) / 2), new THREE.Vector3(uWall.position.x + 12, 100, uWall.position.z + (arenaSize + 48) / 2));
    dWall.Box3 = new THREE.Box3(new THREE.Vector3(dWall.position.x - 12, 0, dWall.position.z - (arenaSize + 48) / 2), new THREE.Vector3(dWall.position.x + 12, 100, dWall.position.z + (arenaSize + 48) / 2));
    lWall.Box3 = new THREE.Box3(new THREE.Vector3(lWall.position.x - arenaSize / 2, 0, lWall.position.z - 12), new THREE.Vector3(lWall.position.x + arenaSize / 2, 100, lWall.position.z + 12));
    rWall.Box3 = new THREE.Box3(new THREE.Vector3(rWall.position.x - arenaSize / 2, 0, rWall.position.z - 12), new THREE.Vector3(rWall.position.x + arenaSize / 2, 100, rWall.position.z + 12));
    
    boundries.push(uWall);
    boundries.push(dWall);
    boundries.push(lWall);
    boundries.push(rWall);
    scene.add(uWall);
    scene.add(dWall);
    scene.add(lWall);
    scene.add(rWall);
}

function addWalls() {
    for (var i = 0; i < 30; i++) {
        walls.push(new THREE.Mesh(new THREE.BoxGeometry(250, 250, 250), new THREE.MeshLambertMaterial( {map: THREE.ImageUtils.loadTexture('textures/crate.png')} )));
        walls[i].position.x = -1125 + (i % 10) * 250;
        walls[i].position.z = -250 + (i % 3) * 250;
        walls[i].castShadow = true;
        walls[i].receiveShadow = true;
        walls[i].position.y = 125;
        walls[i].Box3 = new THREE.Box3(new THREE.Vector3(walls[i].position.x -125, 0, walls[i].position.z - 125), new THREE.Vector3(walls[i].position.x + 125, 250, walls[i].position.z + 125));
        scene.add(walls[i]);
    }
}

function addFloor() {
    var floorTex = THREE.ImageUtils.loadTexture('textures/hardwood.png');
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set( 1, 1 );
    var planeGeometry = new THREE.PlaneBufferGeometry( 10000, 5000 );
    var planeMaterial = new THREE.MeshLambertMaterial( {map: floorTex} );
    var plane = new THREE.Mesh( planeGeometry,planeMaterial );
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow  = true;
    plane.position.y = -20;
    plane.position.z = -300;
    scene.add( plane );
}

function gameOver(player) {
    var text1Geom = new THREE.TextGeometry("Player " + player + " wins!", {size: 150, height: 30, font: "helvetiker"} );
	text1 = new THREE.Mesh( text1Geom, new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
	text1.position.y = 500;
    text1.position.z = -100;
    text1.rotation.x = -1.43;
	text1Geom.computeBoundingBox();
	var centerX1 = 0.5 * ( text1Geom.boundingBox.max.x - text1Geom.boundingBox.min.x );
	text1.position.x = -centerX1;
    
    var text2Geom = new THREE.TextGeometry("Press b to restart game", {size: 150, height: 30, font: "helvetiker"} );
    text2 = new THREE.Mesh( text2Geom, new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
	text2.position.y = 500;
    text2.position.z = 100;
    text2.rotation.x = -1.43;
	text2Geom.computeBoundingBox();
	var centerX2 = 0.5 * ( text2Geom.boundingBox.max.x - text2Geom.boundingBox.min.x );
	text2.position.x = -centerX2;
    
	scene.add(text1);   
    scene.add(text2);  
}

//setup the scene
var canvas = document.getElementById( "canvas" );
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true });
renderer.setSize(canvas.width, canvas.height);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFShadowMap;
var fov = 75,
      aspect = canvas.width / canvas.height,
      near = 0.1,
      far = 10000;
var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
var clock = new THREE.Clock();

//some particle setup
var pos = new THREE.Vector3()
var emitterSettings = {
    type: 'sphere',
    positionSpread: new THREE.Vector3(10, 10, 10),
    radius: 1,
    speed: 100,
    sizeStart: 30,
    sizeStartSpread: 30,
    sizeEnd: 0,
    opacityStart: 1,
    opacityEnd: 0,
    colorStart: new THREE.Color('white'),
    colorStartSpread: new THREE.Vector3(0, 10, 0),
    colorEnd: new THREE.Color('white'),
    particleCount: 100,
    alive: 0,
    duration: 0.05
};

var particleGroup = new SPE.Group({
    texture: THREE.ImageUtils.loadTexture('textures/smokeparticle.png'),
    maxAge: 0.5,
    blending: THREE.AdditiveBlending
});
particleGroup.addPool( 150, emitterSettings, true );
scene.add( particleGroup.mesh );

//call some setup functions
setupCamera();
addLights();
addGround();
addBoundries();
addWalls();
addFloor();

document.body.appendChild(renderer.domElement);

//setup the audio
var audioHitBox = document.createElement('audio');
var audioShoot = document.createElement('audio');
var audioHitPlayer = document.createElement('audio');
var audioHitTerrain = document.createElement('audio');
var source = document.createElement('source');
var source2 = document.createElement('source');
var source3 = document.createElement('source');
var source4 = document.createElement('source');
source.src = 'sounds/boom6.wav';
source2.src = 'sounds/boom4.wav';
source3.src = 'sounds/atari_boom.wav';
source4.src = 'sounds/atari_boom2.wav';
audioHitBox.appendChild(source);
audioShoot.appendChild(source2);
audioHitPlayer.appendChild(source3);
audioHitTerrain.appendChild(source4);

//set some variables
var shotSpeed = 25;
var p1fireRate = 60;
var p1ShotdX = 0;
var p1ShotdY = 0;
var p1ShotdZ = 0;

var p2fireRate = 60;
var p2ShotdX = 0;
var p2ShotdY = 0;
var p2ShotdZ = 0;
var gravity = 0.35;

var player1Shots = [];
var player2Shots = [];

var player1Dead = false;
var player2Dead = false;

//create player 1
var head1 = new THREE.Object3D();
var cannon1 = new THREE.Object3D();
var barrel1 = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 80, 32), new THREE.MeshPhongMaterial( {color: 0x5555aa} ));
cannon1.rotation.x = -60 * Math.PI / 180;
barrel1.position.y = 40;
cannon1.add(barrel1);
cannon1.position.y = 5;
var turret1 = new THREE.Mesh(new THREE.SphereGeometry(32, 32, 16), new THREE.MeshPhongMaterial({color: 0x3333aa}));
head1.add(turret1);
head1.add(cannon1);
head1.position.y = 25;
head1.position.z = 10;
head1.castShadow = true;
head1.receiveShadowShadow = true;
cannon1.castShadow = true;
cannon1.receiveShadowShadow = true;
barrel1.castShadow = true;
barrel1.receiveShadowShadow = true;

var block1 = new THREE.Mesh(new THREE.BoxGeometry(100, 50, 100), new THREE.MeshPhongMaterial( {color: 0x2222aa} ));
block1.castShadow = true;
block1.receiveShadowShadow = true;

var player1 = new THREE.Object3D();
player1.add(block1);
player1.add(head1);
player1.Box3 = new THREE.Box3(new THREE.Vector3(-1050, 0, 950), new THREE.Vector3(-950, 66, 1050));
player1.position.set(-1000, 26, 1000);
player1.receiveShadow = true;
player1.castShadow = true;
scene.add(player1);
var oldplayer1Box = new THREE.Box3(new THREE.Vector3(-1050, 0, 950), new THREE.Vector3(-950, 66, 1050));



//create player 2
var head2 = new THREE.Object3D();
var cannon2 = new THREE.Object3D();
var barrel2 = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 50, 32), new THREE.MeshPhongMaterial( {color: 0xaa5555} ));
cannon2.rotation.x = -60 * Math.PI / 180;
barrel2.position.y = 40;
cannon2.add(barrel2);
cannon2.position.y = 5;
var turret2 = new THREE.Mesh(new THREE.SphereGeometry(32, 32, 16), new THREE.MeshPhongMaterial({color: 0xaa3333}));
head2.add(turret2);
head2.add(cannon2);
head2.position.y = 25;
head2.position.z = 10;
head2.castShadow = true;
head2.receiveShadowShadow = true;
cannon2.castShadow = true;
cannon2.receiveShadowShadow = true;
barrel2.castShadow = true;
barrel2.receiveShadowShadow = true;

var block2 = new THREE.Mesh(new THREE.BoxGeometry(100, 50, 100), new THREE.MeshPhongMaterial( {color: 0xaa2222} ));
block2.castShadow = true;
block2.receiveShadowShadow = true;

var player2 = new THREE.Object3D();
player2.add(block2);
player2.add(head2);
player2.Box3 = new THREE.Box3(new THREE.Vector3(950, 0, -1050), new THREE.Vector3(1050, 66, -950));
player2.position.set(1000, 26, -1000);
player2.rotation.y  = Math.PI;
player2.receiveShadow = true;
player2.castShadow = true;
scene.add(player2);
var oldplayer2Box = new THREE.Box3(new THREE.Vector3(950, 0, -1050), new THREE.Vector3(1050, 66, -950));

//game loop
var render = function() {
	if (!player1Dead && !player2Dead) {
		var i, j;
		if (p1fireRate < 60) {
			p1fireRate++;   
		}
		if (p2fireRate < 60) {
			p2fireRate++;
		}
		//update bullet pos
		for (i = 0; i < player1Shots.length; i++) {
			player1Shots[i].position.x += player1Shots[i].shotdX;
			player1Shots[i].position.y += player1Shots[i].shotdY;
			player1Shots[i].position.z += player1Shots[i].shotdZ;
			player1Shots[i].shotdY -= gravity;
			player1Shots[i].Box3.min.x = player1Shots[i].position.x - 5;
			player1Shots[i].Box3.max.x = player1Shots[i].position.x + 5;
			
			player1Shots[i].Box3.min.y = player1Shots[i].position.y - 5;
			player1Shots[i].Box3.max.y = player1Shots[i].position.y + 5;
			
			player1Shots[i].Box3.min.z = player1Shots[i].position.z - 5;
			player1Shots[i].Box3.max.z = player1Shots[i].position.z + 5;
			//create particle trail
			particleGroup.triggerPoolEmitter( 1, (pos.set(player1Shots[i].position.x, player1Shots[i].position.y, player1Shots[i].position.z)) );
			
			//check if hit player
			if (player1Shots[i].Box3.isIntersectionBox(player2.Box3)) {
				scene.remove(player1Shots[i]);
				player1Shots.splice(i, 1);
				scene.remove(player2);
				audioHitPlayer.play();
				audioHitPlayer.currentTime = 0;
                gameOver(1);
				//alert("Player 1 wins! Refresh to replay.");
                player2Dead = true;
				player2.Box3 = new THREE.Box3(new THREE.Vector3(-100, -100, -100), new THREE.Vector3(-100, -100, -100));
			} else if (player1Shots[i].Box3.isIntersectionBox(boundries[0].Box3) || player1Shots[i].Box3.isIntersectionBox(boundries[1].Box3) || 
					player1Shots[i].Box3.isIntersectionBox(boundries[2].Box3) || player1Shots[i].Box3.isIntersectionBox(boundries[3].Box3) || 
					player1Shots[i].Box3.isIntersectionBox(ground.Box3)) {
				//check if out of bounds
				scene.remove(player1Shots[i]);
				player1Shots.splice(i, 1);
				audioHitTerrain.play();
				audioHitTerrain.currentTime = 0;
			} else if (player1Shots[i].position.y - 5 < 0) {
				scene.remove(player1Shots[i]);
				player1Shots.splice(i, 1);
				audioHitTerrain.play();
				audioHitTerrain.currentTime = 0;
			} else {
				//check if hit wall
				for (j = 0; j < walls.length; j++) {
					if (player1Shots[i].Box3.isIntersectionBox(walls[j].Box3)) {
						scene.remove(player1Shots[i]);
						scene.remove(walls[j]);
						walls.splice(j, 1);
						player1Shots.splice(i, 1);
						audioHitBox.play();
						audioHitBox.currentTime = 0;
						break;
					}
				}   
			}
		}
		for (i = 0; i < player2Shots.length; i++) {
			player2Shots[i].position.x += player2Shots[i].shotdX;
			player2Shots[i].position.y += player2Shots[i].shotdY;
			player2Shots[i].position.z += player2Shots[i].shotdZ;
			player2Shots[i].shotdY -= gravity;
			player2Shots[i].Box3.min.x = player2Shots[i].position.x - 5;
			player2Shots[i].Box3.max.x = player2Shots[i].position.x + 5;
			
			player2Shots[i].Box3.min.y = player2Shots[i].position.y - 5;
			player2Shots[i].Box3.max.y = player2Shots[i].position.y + 5;
			
			player2Shots[i].Box3.min.z = player2Shots[i].position.z - 5;
			player2Shots[i].Box3.max.z = player2Shots[i].position.z + 5;
			particleGroup.triggerPoolEmitter( 1, (pos.set(player2Shots[i].position.x, player2Shots[i].position.y, player2Shots[i].position.z)) );
			//check if hit player
			if (player2Shots[i].Box3.isIntersectionBox(player1.Box3)) {
				scene.remove(player2Shots[i]);
				player2Shots.splice(i, 1);
				scene.remove(player1);
				audioHitPlayer.play();
				audioHitPlayer.currentTime = 0;
                gameOver(2);
				//alert("Player 2 wins! Refresh to replay.");
                player1Dead = true;
				player1.Box3 = new THREE.Box3(new THREE.Vector3(-100, -100, -100), new THREE.Vector3(-100, -100, -100));
			} else if (player2Shots[i].Box3.isIntersectionBox(boundries[0].Box3) || player2Shots[i].Box3.isIntersectionBox(boundries[1].Box3) || 
					player2Shots[i].Box3.isIntersectionBox(boundries[2].Box3) || player2Shots[i].Box3.isIntersectionBox(boundries[3].Box3) || 
					player2Shots[i].Box3.isIntersectionBox(ground.Box3)) {
				//check if out of bounds
				scene.remove(player2Shots[i]);
				player2Shots.splice(i, 1);
				audioHitTerrain.play();
				audioHitTerrain.currentTime = 0;
			} else if (player2Shots[i].position.y - 5 < 0) {
				scene.remove(player2Shots[i]);
				player2Shots.splice(i, 1);
				audioHitTerrain.play();
				audioHitTerrain.currentTime = 0;
			} else {
				//check if hit wall
				for (j = 0; j < walls.length; j++) {
					if (player2Shots[i].Box3.isIntersectionBox(walls[j].Box3)) {
						scene.remove(player2Shots[i]);
						scene.remove(walls[j]);
						walls.splice(j, 1);
						player2Shots.splice(i, 1);
						audioHitBox.play();
						audioHitBox.currentTime = 0;
						break;
					}
				}   
			}
		}
		//player 1 movement
		if (Key.isDown(Key.W)) {  
			player1.position.z -= 5 * Math.cos(player1.rotation.y);
			player1.position.x -= 5 * Math.sin(player1.rotation.y);
			player1.Box3.min.x = player1.position.x - 50;
			player1.Box3.max.x = player1.position.x + 50;
			player1.Box3.min.z = player1.position.z - 50;
			player1.Box3.max.z = player1.position.z + 50;
			for (i = 0; i < walls.length; i++) {
				//check if there was even a collision
				if (player1.Box3.isIntersectionBox(walls[i].Box3)) {
					//check which way the collision came from
					//left or right
					if (oldplayer1Box.max.x < walls[i].Box3.min.x && player1.Box3.max.x > walls[i].Box3.min.x || 
					   oldplayer1Box.min.x > walls[i].Box3.max.x && player1.Box3.min.x < walls[i].Box3.max.x) {
						player1.position.x += 5 * Math.sin(player1.rotation.y); 
						player1.Box3.min.x = player1.position.x - 50;
						player1.Box3.max.x = player1.position.x + 50;
					} else { // up or down
						player1.position.z += 5 * Math.cos(player1.rotation.y); 
						player1.Box3.min.z = player1.position.z - 50;
						player1.Box3.max.z = player1.position.z + 50;
					}
				}
			}
			if (player1.Box3.isIntersectionBox(player2.Box3)) {
				player1.position.x += 5 * Math.sin(player1.rotation.y); 
				player1.Box3.min.x = player1.position.x - 50;
				player1.Box3.max.x = player1.position.x + 50;
				player1.position.z += 5 * Math.cos(player1.rotation.y); 
				player1.Box3.min.z = player1.position.z - 50;
				player1.Box3.max.z = player1.position.z + 50;
			}
		}
		if (Key.isDown(Key.A)) {  
			player1.rotation.y += 1 * Math.PI / 180;
		}
		if (Key.isDown(Key.S)) {  
			player1.position.z += 5 * Math.cos(player1.rotation.y);
			player1.position.x += 5 * Math.sin(player1.rotation.y);
			player1.Box3.min.x = player1.position.x - 50;
			player1.Box3.max.x = player1.position.x + 50;
			player1.Box3.min.z = player1.position.z - 50;
			player1.Box3.max.z = player1.position.z + 50;
			for (i = 0; i < walls.length; i++) {
				if (player1.Box3.isIntersectionBox(walls[i].Box3)) {
					//check which way the collision came from
					//left or right
					if (oldplayer1Box.max.x < walls[i].Box3.min.x && player1.Box3.max.x > walls[i].Box3.min.x || 
					   oldplayer1Box.min.x > walls[i].Box3.max.x && player1.Box3.min.x < walls[i].Box3.max.x) {
						player1.position.x -= 5 * Math.sin(player1.rotation.y); 
						player1.Box3.min.x = player1.position.x - 50;
						player1.Box3.max.x = player1.position.x + 50;
					} else { // up or down
						player1.position.z -= 5 * Math.cos(player1.rotation.y); 
						player1.Box3.min.z = player1.position.z - 50;
						player1.Box3.max.z = player1.position.z + 50;
					}
				}
			}
			if (player1.Box3.isIntersectionBox(player2.Box3)) {
				player1.position.x -= 5 * Math.sin(player1.rotation.y); 
				player1.Box3.min.x = player1.position.x - 50;
				player1.Box3.max.x = player1.position.x + 50;
				player1.position.z -= 5 * Math.cos(player1.rotation.y); 
				player1.Box3.min.z = player1.position.z - 50;
				player1.Box3.max.z = player1.position.z + 50;
			}
		}
		if (Key.isDown(Key.D)) {  
			player1.rotation.y -= 1 * Math.PI / 180;
		}
		//player 2 movement
		if (Key.isDown(Key.I)) {  
			player2.position.z -= 5 * Math.cos(player2.rotation.y);
			player2.position.x -= 5 * Math.sin(player2.rotation.y);
			player2.Box3.min.x = player2.position.x - 50;
			player2.Box3.max.x = player2.position.x + 50;
			player2.Box3.min.z = player2.position.z - 50;
			player2.Box3.max.z = player2.position.z + 50;
			for (i = 0; i < walls.length; i++) {
				if (player2.Box3.isIntersectionBox(walls[i].Box3)) {
					//check which way the collision came from
					//left or right
					if (oldplayer2Box.max.x < walls[i].Box3.min.x && player2.Box3.max.x > walls[i].Box3.min.x || 
					   oldplayer2Box.min.x > walls[i].Box3.max.x && player2.Box3.min.x < walls[i].Box3.max.x) {
						player2.position.x += 5 * Math.sin(player2.rotation.y); 
						player2.Box3.min.x = player2.position.x - 50;
						player2.Box3.max.x = player2.position.x + 50;
					} else { // up or down
						player2.position.z += 5 * Math.cos(player2.rotation.y); 
						player2.Box3.min.z = player2.position.z - 50;
						player2.Box3.max.z = player2.position.z + 50;
					}
				}
			}
			if (player1.Box3.isIntersectionBox(player2.Box3)) {
				player2.position.x += 5 * Math.sin(player2.rotation.y); 
				player2.Box3.min.x = player2.position.x - 50;
				player2.Box3.max.x = player2.position.x + 50;
				player2.position.z += 5 * Math.cos(player2.rotation.y); 
				player2.Box3.min.z = player2.position.z - 50;
				player2.Box3.max.z = player2.position.z + 50;
			}
		}
		if (Key.isDown(Key.J)) {  
			player2.rotation.y += 1 * Math.PI / 180;
		}
		if (Key.isDown(Key.K)) {  
			player2.position.z += 5 * Math.cos(player2.rotation.y);
			player2.position.x += 5 * Math.sin(player2.rotation.y);
			player2.Box3.min.x = player2.position.x - 50;
			player2.Box3.max.x = player2.position.x + 50;
			player2.Box3.min.z = player2.position.z - 50;
			player2.Box3.max.z = player2.position.z + 50;
			for (i = 0; i < walls.length; i++) {
				if (player2.Box3.isIntersectionBox(walls[i].Box3)) {
					//check which way the collision came from
					//left or right
					if (oldplayer2Box.max.x < walls[i].Box3.min.x && player2.Box3.max.x > walls[i].Box3.min.x || 
					   oldplayer2Box.min.x > walls[i].Box3.max.x && player2.Box3.min.x < walls[i].Box3.max.x) {
						player2.position.x -= 5 * Math.sin(player2.rotation.y); 
						player2.Box3.min.x = player2.position.x - 50;
						player2.Box3.max.x = player2.position.x + 50;
					} else { // up or down
						player2.position.z -= 5 * Math.cos(player2.rotation.y); 
						player2.Box3.min.z = player2.position.z - 50;
						player2.Box3.max.z = player2.position.z + 50;
					}
				}
			}
			if (player1.Box3.isIntersectionBox(player2.Box3)) {
				player2.position.x -= 5 * Math.sin(player2.rotation.y); 
				player2.Box3.min.x = player2.position.x - 50;
				player2.Box3.max.x = player2.position.x + 50;
				player2.position.z -= 5 * Math.cos(player2.rotation.y); 
				player2.Box3.min.z = player2.position.z - 50;
				player2.Box3.max.z = player2.position.z + 50;
			}
		}
		if (Key.isDown(Key.L)) {  
			player2.rotation.y -= 1 * Math.PI / 180;
		}
		
		//Collision with boundaries
		if (player1.position.z + 50 > arenaSize / 2) {
			player1.position.z = arenaSize / 2 - 50; 
			player1.Box3.min.z = player1.position.z - 50;
			player1.Box3.max.z = player1.position.z + 50;
		}
		if (player1.position.z - 50 < -arenaSize / 2) {
			player1.position.z = -arenaSize / 2 + 50;
			player1.Box3.min.z = player1.position.z - 50;
			player1.Box3.max.z = player1.position.z + 50;
		}
		if (player1.position.x + 50 > arenaSize / 2) {
			player1.position.x = arenaSize / 2 - 50;  
			player1.Box3.min.x = player1.position.x - 50;
			player1.Box3.max.x = player1.position.x + 50;
		}
		if (player1.position.x - 50 < -arenaSize / 2) {
			player1.position.x = -arenaSize / 2 + 50;   
			player1.Box3.min.x = player1.position.x - 50;
			player1.Box3.max.x = player1.position.x + 50;
		}
		if (player2.position.z + 50 > arenaSize / 2) {
			player2.position.z = arenaSize / 2 - 50;   
			player2.Box3.min.z = player2.position.z - 50;
			player2.Box3.max.z = player2.position.z + 50;
		}
		if (player2.position.z - 50 < -arenaSize / 2) {
			player2.position.z = -arenaSize / 2 + 50;
			player2.Box3.min.z = player2.position.z - 50;
			player2.Box3.max.z = player2.position.z + 50;
		}
		if (player2.position.x + 50 > arenaSize / 2) {
			player2.position.x = arenaSize / 2 - 50;   
			player2.Box3.min.x = player2.position.x - 50;
			player2.Box3.max.x = player2.position.x + 50;
		}
		if (player2.position.x - 50 < -arenaSize / 2) {
			player2.position.x = -arenaSize / 2 + 50;   
			player2.Box3.min.x = player2.position.x - 50;
			player2.Box3.max.x = player2.position.x + 50;
		}
		//finally sync old hitbox states (for collision detection next frame)
		oldplayer1Box.min.x = player1.position.x - 50;
		oldplayer1Box.max.x = player1.position.x + 50;
		oldplayer1Box.min.z = player1.position.z - 50;
		oldplayer1Box.max.z = player1.position.z + 50;
		oldplayer2Box.min.x = player2.position.x - 50;
		oldplayer2Box.max.x = player2.position.x + 50;
		oldplayer2Box.min.z = player2.position.z - 50;
		oldplayer2Box.max.z = player2.position.z + 50;
		
		//Rotate turrets
		//left and right
		if (Key.isDown(Key.Q)) {
			head1.rotation.y += 1 * Math.PI / 180;
		}
		
		if (Key.isDown(Key.E)) {
			head1.rotation.y -= 1 * Math.PI / 180;
		}
		
		if (Key.isDown(Key.U)) {
			head2.rotation.y += 1 * Math.PI / 180;
		}
		
		if (Key.isDown(Key.O)) {
			head2.rotation.y -= 1 * Math.PI / 180;
		}
		//up the down
		if (Key.isDown(Key.R)) {
			cannon1.rotation.x += 0.5 * Math.PI / 180;
			if (cannon1.rotation.x > 0) {
				cannon1.rotation.x = 0;   
			}
		}
		if (Key.isDown(Key.F)) {
			cannon1.rotation.x -= 0.5 * Math.PI / 180;
			if (cannon1.rotation.x < -90 * Math.PI / 180) {
				cannon1.rotation.x = -90 * Math.PI / 180;   
			}
		}
		if (Key.isDown(Key.Y)) {
			cannon2.rotation.x += 0.5 * Math.PI / 180;
			if (cannon2.rotation.x > 0) {
				cannon2.rotation.x = 0;   
			}
		}
		if (Key.isDown(Key.H)) {
			cannon2.rotation.x -= 0.5 * Math.PI / 180;
			if (cannon2.rotation.x < -90 * Math.PI / 180) {
				cannon2.rotation.x = -90 * Math.PI / 180;   
			}
		}
		
		//Firing
		if (p1fireRate == 60 && Key.isDown(Key.SHIFT)) {
			//create bullet
			player1Shots.push(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshLambertMaterial({color: 0x2222aa})));
			player1Shots[player1Shots.length - 1].Box3 = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
			player1Shots[player1Shots.length - 1].castShadow = true;
			player1Shots[player1Shots.length - 1].receiveShadow = true;
			player1Shots[player1Shots.length - 1].position.set(player1.position.x + (80 * Math.sin(cannon1.rotation.x)) * Math.sin(head1.rotation.y + player1.rotation.y),
						 player1.position.y + head1.position.y + cannon1.position.y + 80 * Math.cos(cannon1.rotation.x), 
						 player1.position.z + head1.position.z + (80 * Math.sin(cannon1.rotation.x)) * Math.cos(head1.rotation.y + player1.rotation.y));
			//set bullet velocity
			player1Shots[player1Shots.length - 1].shotdX = shotSpeed * Math.sin(cannon1.rotation.x) * Math.sin(head1.rotation.y + player1.rotation.y);
			player1Shots[player1Shots.length - 1].shotdY = shotSpeed * Math.cos(cannon1.rotation.x);
			player1Shots[player1Shots.length - 1].shotdZ = shotSpeed * Math.sin(cannon1.rotation.x) * Math.cos(head1.rotation.y + player1.rotation.y);
			scene.add(player1Shots[player1Shots.length - 1]);
			audioShoot.play();
			audioShoot.currentTime = 0;
			p1fireRate = 0;
		}
		if (p2fireRate == 60 && Key.isDown(Key.FSLASH)) {
			//create bullet
			player2Shots.push(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshLambertMaterial({color: 0xaa2222})));
			player2Shots[player2Shots.length - 1].Box3 = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
			player2Shots[player2Shots.length - 1].castShadow = true;
			player2Shots[player2Shots.length - 1].receiveShadow = true;
			player2Shots[player2Shots.length - 1].position.set(player2.position.x + (80 * Math.sin(cannon2.rotation.x)) * Math.sin(head2.rotation.y + player2.rotation.y),
						 player2.position.y + head2.position.y + cannon2.position.y + 80 * Math.cos(cannon2.rotation.x), 
						 player2.position.z + head2.position.z + (80 * Math.sin(cannon2.rotation.x)) * Math.cos(head2.rotation.y + player2.rotation.y));
			//set bullet velocity
			player2Shots[player2Shots.length - 1].shotdX = shotSpeed * Math.sin(cannon2.rotation.x) * Math.sin(head2.rotation.y + player2.rotation.y);
			player2Shots[player2Shots.length - 1].shotdY = shotSpeed * Math.cos(cannon2.rotation.x);
			player2Shots[player2Shots.length - 1].shotdZ = shotSpeed * Math.sin(cannon2.rotation.x) * Math.cos(head2.rotation.y + player2.rotation.y);
			player2Shots[player2Shots.length - 1].particles = [];
			scene.add(player2Shots[player2Shots.length - 1]);
			audioShoot.play();
			audioShoot.currentTime = 0;
			p2fireRate = 0;
		}
	} else {
		if (Key.isDown(Key.B)) {
			if (player1Dead) {
                scene.add(player1);
            } else {
                scene.add(player2);
            }
            var i;
            for (i = 0; i < walls.length; i++) {
                scene.remove(walls[i]);   
            }
            for (i = 0; i < player1Shots.length; i++) {
                scene.remove(player1Shots[i]);
            }
            for (i = 0; i < player2Shots.length; i++) {
                scene.remove(player1Shots[i]);
            }
            walls = [];
            player1Shots = [];
            player2Shots = [];
            addWalls();
            player1.position.set(-1000, 26, 1000);
            player2.position.set(1000, 26, -1000);
            player1.rotation.set(0, 0, 0);
            player2.rotation.set(0, Math.PI, 0);
            cannon1.rotation.x = -60 * Math.PI / 180;
            cannon2.rotation.x = -60 * Math.PI / 180;
            head1.rotation.set(0, 0, 0);
            head2.rotation.set(0, 0, 0);
            player1.Box3 = new THREE.Box3(new THREE.Vector3(-1050, 0, 950), new THREE.Vector3(-950, 66, 1050));
            player2.Box3 = new THREE.Box3(new THREE.Vector3(950, 0, -1050), new THREE.Vector3(1050, 66, -950));
            player1Dead = player2Dead = false;
            scene.remove(text1);
            scene.remove(text2);
		}
	}
    particleGroup.tick( clock.getDelta() );
    renderer.render( scene, camera); // render the scene
    requestAnimationFrame( render );
};

render();