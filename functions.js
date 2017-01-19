var scene;
var container, stats;
var camera, renderer;
var light;
var flag;

var offSet = 250;

var A;

function draw( )
{
	if( flag == 1)
	{ 
    	scene = null;
    	projector = null;
    	camera = null;
    	empty(container);
	}

	init();
}

function empty(elem) 
{
    while (elem.lastChild) 
    	elem.removeChild(elem.lastChild);
}

function init( ) 
{
	flag = 1;

	scene = new THREE.Scene();

	scene.children.forEach(function(object){
    scene.remove(object); });

	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 1150, 0 );
	camera.lookAt( scene.position );

	var radius = 8;
	var angle = getTextBoxContent( 'ANGLE_ID' );
	var numSpheres = getTextBoxContent( 'SPHERES_ID' );

	var testPrime = getTextBoxContent( 'PRIME_ID' );
	var testEven = getTextBoxContent( 'EVEN_ID' );
	var testFib = getTextBoxContent( 'FIB_ID' );

	A = fib( numSpheres );

	generateSpiral( radius, angle, numSpheres, testPrime, testEven, testFib);

	createLights( );

	renderer = new THREE.CanvasRenderer( );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	requestAnimationFrame( animate );

	render();
}

function render() 
{
	renderer.render( scene, camera );
}

function animate() 
{
	
}

function onWindowResize() 
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function generateSpiral( radius, angle, numSpheres, testPrime, testEven, testFib)
{
	// conversion constant from Degrees to Rad
	RadConv = 0.0174532925;

	// Convert input angle to degrees
	T = 360 - ( 360 / angle );

	// Angle to be incremented in each iteration
	Theta = 0;

	var sphere = newSphere( radius );

	// Apply Polar coordinates:
	// distFromCenter = | r | 
	var distFromCenter = Math.sqrt( 1 );

	// X = | r | Cos( θ ); Z = | r | Sin( θ )
	sphere.position.x = distFromCenter*Math.cos(Theta*RadConv)*9 - offSet;
	sphere.position.z = distFromCenter*Math.sin(Theta*RadConv)*9 - offSet;

	scene.add( sphere );

	// generate numSpheres spheres and update their positions
	for ( var ID = 0; ID < numSpheres; ID ++ ) 
	{
		// genetate a new Sphere
		sphere = newSphere( radius );

		// Apply Polar coordinates:
		// distFromCenter = | r | 
		distFromCenter = Math.sqrt( ID );

		// X = | r | Cos( θ ); Z = | r | Sin( θ )
		sphere.position.x = distFromCenter*Math.cos(Theta*RadConv)*9 - offSet;
		sphere.position.z = distFromCenter*Math.sin(Theta*RadConv)*9 - offSet;

		// Updating θ according to the input angle converted to degrees
		Theta = Theta + T;

		if( testEven == "Yes" )
			sphere = markEven( ID, sphere );
	
		if( testPrime == "Yes" )
			sphere = markPrimes( ID, sphere );

		if( testFib == "Yes" )
			sphere = markFib( ID, sphere, A );

		// Add new sphere to scene	
		scene.add( sphere );
	}
}

function createLights( )
{

	var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
	directionalLight.position.set( 0, 1, 0 );
	scene.add( directionalLight );
}

function newSphere( radius )
{
	geometry = new THREE.SphereGeometry( radius, 25, 18 );
	material = new THREE.MeshLambertMaterial( { color: 'blue', 
												overdraw: 1} );

	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.y = 0;

	return sphere;
}

function getTextBoxContent( textBoxId )
{
  var textBox = document.getElementById( textBoxId );
  return textBox.value;
}

function markEven( ID, sphere ){

	if( (ID % 2) == 0 )
		sphere.material.color = new THREE.Color(0xFF9900);

	return sphere;
}

function markPrimes( ID, sphere )
{
	if( isPrime( ID ) == true )
		sphere.material.color = new THREE.Color(0xCC3300);
	
	return sphere;
}

function isPrime(num) 
{
	if(num < 2) 
		return false;

	for (var i = 2; i < num; i++) 
	{
		if(num%i==0)
			return false;
	}
	
	return true;
}

function markFib( ID, sphere, A )
{	
	if( A.includes( ID ))
		sphere.material.color = new THREE.Color(0x00FF00);
	
	return sphere;
}

function fib( N )
{
	var x = 0;
    for(var fibArray = [0,1], i=0,j=1,k=0, id=0; x<=N;i=j,j=x,k++,id++ ){
        x=i+j;
        fibArray.push(x);
    }
	return fibArray;
}





