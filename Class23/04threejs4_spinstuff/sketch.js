var container; // this represents the canvas

var renderer; // this represent the world / renderer
var camera; // this is a viewport
var scene; // this is a list of things to render

init(); // kick off everything (equiv to setup())
animate(); // start animating (equivish to draw())

var fc = 0; // counter for spinning things

var thesphere; // global sphere
var thesphere_distance = 400;
var thesphere_angle = 0;

function init() {
  setupCamera(); // get the camera happening
  setupRenderer(); // the main renderer
  makeScene(); // lights, textures, materials, objects
  addToWebPage(renderer); // add the WebGL to the web page

	window.addEventListener( 'resize', onWindowResize, false );

}

// THE ANIMATE FUNCTION GETS THE RENDERER MOVING:
function animate() {
  // hey, web browser, when you reload a new frame:
	requestAnimationFrame( animate );

  // run the renderer:
	render();

}

// THE RENDER() FUNCTION ACTUALLY DOES THE DRAWING
// FRAME BY FRAME... EQUIV TO DRAW() IN P5:
function render() {

  // rotation fuckin' everybody:
	for ( var i = 0; i < scene.children.length; i ++ ) {
		var object = scene.children[ i ];
		object.rotation.x = fc * 5;
		object.rotation.y = fc * 2.5;
	}

  // reposition the sphere to orbit:
  var sphere_x = thesphere_distance*Math.cos(thesphere_angle);
  var sphere_z = thesphere_distance*Math.sin(thesphere_angle);
	thesphere.position.set( sphere_x, 0, sphere_z );
	thesphere_angle+=0.025;

  // THIS DOES THE DRAWING:
	renderer.render( scene, camera );
	
	fc = fc + .005;

}

function setupCamera()
{
  // camera stuff:
  var fieldofview = 45;
  var aspectratio = window.innerWidth / window.innerHeight;
  var near_clip = 1;
  var far_clip = 2000;
  // set up the camera based on the stuff above:
	camera = new THREE.PerspectiveCamera( fieldofview, aspectratio, near_clip, far_clip );
  // camera lookat and position:
  camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 800;
	camera.lookAt( 0, 0, 0 );

}

function setupRenderer()
{
  // initialize the render:
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function makeScene()
{
  // set up the scene graph:
	scene = new THREE.Scene();

  // placeholder variables for a single light and an object:
	var light; 
	var genericobject; // this goes into the scene and we forget about it

  // ambient light goes EVERYWHERE.  the result is 
  // to multiply every color in the scene with the ambient
  // light color:
  light = new THREE.AmbientLight( 0xfffff );
	scene.add( light );

  // direction light shines on one spot:
	light = new THREE.DirectionalLight( 0xff0000 );
	light.position.set( 0, 1, 0 );
	scene.add( light );

  // texture consists of an image, an image mapping scheme, and a resolution:
  // load a picture:
	thetexture = THREE.ImageUtils.loadTexture( './data/UV_Grid_Sm.jpg' );
  // tell the texture to repeat:
	thetexture.wrapS = thetexture.wrapT = THREE.RepeatWrapping;
	// resolution of the texture:
	thetexture.anisotropy = 16;

  // this binds the texture to a material:
	var material = new THREE.MeshLambertMaterial( { map: thetexture, side: THREE.DoubleSide } );

	// ADD ALL THE 3D DATA AS OBJECTS TO THE SCENE:

  // this is a basic circle:
  var circlesize = 150;
  var circlesegments = 20;
  // this generates the geometry:
  var circlegeometry = new THREE.CircleGeometry( circlesize, circlesegments, 0, Math.PI * 2 );
  // make a mesh out of the geometry and the material:
	genericobject = new THREE.Mesh( circlegeometry, material );
  // give it a default position in the scene:
	genericobject.position.set( 0, 0, 0 );
	// add it to the rendering stack:
	scene.add( genericobject );

  // this is a sphere:
  var sphereradius = 50;
  var wsegs = 20;
  var hsegs = 20;
  var spheregeometry = new THREE.SphereGeometry( sphereradius, wsegs, hsegs );
 	thesphere = new THREE.Mesh( spheregeometry, material );
 	thesphere.position.set( -200, 0, 200 );
 	scene.add( thesphere );


}

// STUFF BELOW HERE YOU DON'T CHANGE OFTEN:

// this resets the camera and renderer 
// when you resize the window:
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// add to web page:
function addToWebPage(_r)
{
  // makes the html container for the canvas:
	container = document.createElement( 'div' );
	document.body.appendChild( container );
  // add the renderer as a webGL canvas to the webpage:
	container.appendChild( _r.domElement );

}
