if (window.console == undefined) {
	window['console'] = {};
	window['console'].log = function(s) {};
	window['console'].error = function(s) {};
}

var PlumeGraph = function(data, nodes) {

	var Easer = function(arr, val) {
		var val = val || 0;
		var target = val || 0;
		this.easing = 0.6;
		this.round = true;
		this.thresh = 1;
		this.e = function(v) {
			this.easing = v || this.easing;
			return this;
		}
		this.__defineGetter__("val", function() {
			return this.round ? Math.round(val) : val;
		});
		this.forceVal = function(v) {
			val = v;
		};
		this.__defineSetter__("val", function(targetVal) {
			target = targetVal;
			if (Math.abs(target-val) < this.thresh) {
				val = target;
			} else {
				val += (targetVal - val)*this.easing;
			}
		});
		this.__defineGetter__("settled", function() {
			return val == target;
		});
		arr.push(this);
	}


	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 20000 );
	camera.position.y = 500;
	var onResize = function() {
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
	var scene = new THREE.Scene();
	var billboard = function(sprite, x, y, z, bsize, bsizeAt) {
		var geo = new THREE.Geometry();
		geo.vertices.push(new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
		var labelMaterial = new THREE.ParticleBasicMaterial( { color: 0x000000, sizeAttenuation: bsizeAt, size: bsize, map: sprite, vertexColors: true } );
		var sys = new THREE.ParticleSystem( geo, labelMaterial );
		sys.sortParticles = true;
		sys.updateMatrix();
		scene.addObject( sys );
	}

	var labelSprites = [];
	for (var i = 0; i <= 19; i++) {
		var j = i < 10 ? '0'+i : i+'';
		var path = "labels/labels_"+j+".png";
		labelSprites.push(ImageUtils.loadTexture(path));
	}

	window.addEventListener('resize', onResize, false);

	document.body.appendChild( renderer.domElement );

	for (var key in nodes) {
		var li = document.getElementById(key);
		li.addEventListener('mouseover', function() {
			var visibleLink = [];
			for (var key in links) {
				if ( key == this.id ) {
					for (var i = 0; i < links[key].length; i++) {
						visibleLink.push(links[key][i]);
					}
				} else {
					for (var i = 0; i < links[key].length; i++) {
						links[key][i].visible = false;
					}
				}
			}
			for (var i = 0; i < visibleLink.length; i++) {
				visibleLink[i].visible = true;
			}
		}, false);
		li.addEventListener('mouseout', function() {
			for (var key in links) {
				for (var i = 0; i < links[key].length; i++) {
					links[key][i].visible = true;
				}
			}
		}, false);
	}

	var lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.088, linewidth: 1 } );
	var addLine = function(x1, y1, z1, x2, y2, z2) {
		var geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( x1, y1, z1 ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( x2, y2, z2 ) ) );
		var line = new THREE.Line( geometry, lineMaterial, THREE.LinePieces );
		line.material = lineMaterial;
		line.updateMatrix();
		scene.addObject( line );
		return line;
	}

	var easers = [];
	var angle = new Easer(easers, Math.PI);
	angle.thresh = 0.01;
	angle.round = false;
	angle.easing = 0.15;
 	var tcircleDist = 2560;
	var circleDist = new Easer(easers, tcircleDist);
	circleDist.round = false;
	circleDist.easing = 0.05;
	var tangle = 0;
	var teyeHeight = 1024;
	var eyeHeight = new Easer(easers, teyeHeight);
	eyeHeight.round = false;
	var eyeDrop = 350;
	this.draw = function(ctx) {
		angle.val = tangle;
		circleDist.val = tcircleDist;
		camera.position.x = Math.cos(angle.val)*circleDist.val;
		camera.position.z = Math.sin(angle.val)*circleDist.val;
		eyeHeight.val = teyeHeight;
		camera.position.y = eyeHeight.val;
		camera.target.position.y = eyeHeight.val-eyeDrop;
		renderer.render( scene, camera );
	};

	var links = {};
	var layers = {};
	layers['L1'] = -512+256;
	layers['L2'] =    0+256;
	layers['L3'] = 1024+256;
	var Pillar = function(json) {
		for (var key in json) {
			//if (json[key].skip) continue;
			billboard(labelSprites[json[key].image], json[key].x, layers[json[key].layer], json[key].y, json[key].size, true);
			if( null != json[key].from ){
				lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000FF, opacity: 0.5, linewidth: 1 } );
				var link = addLine( json[key].x, layers[json[key].layer], json[key].y, json[json[key].from].x, layers[json[json[key].from].layer], json[json[key].from].y);
				if( null == links[json[key].from]) links[json[key].from] = new Array();
				links[json[key].from].push(link);
				if( null == links[key]) links[key] = new Array();
				links[key].push(link);
			}
			if( null != json[key].to ){
				lineMaterial = new THREE.LineBasicMaterial( { color: 0xFF0000, opacity: 0.5, linewidth: 1 } );
				var link = addLine( json[key].x, layers[json[key].layer], json[key].y, json[json[key].to].x, layers[json[json[key].to].layer], json[json[key].to].y);
				if( null == links[json[key].to]) links[json[key].to] = new Array();
				links[json[key].to].push(link);
				if( null == links[key]) links[key] = new Array();
				links[key].push(link);
			}
			if( null != json[key].same ){
				lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1.0, linewidth: 2 } );
				addLine( json[key].x, layers[json[key].layer], json[key].y, json[json[key].same].x, layers[json[json[key].same].layer], json[json[key].same].y);
			}
		}
	}

	var pp = [];
	var pillars = {};
	pp.push(pillars['node'] = new Pillar(data['node']));

	lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.5, linewidth: 1 } );
	for (var i = 0; i < 5; i++) {
		if (i != 2) continue;
		for (var j = 0; j < 5; j++) {
			addLine(1024, (i-1)*512, (j-2)*512, -1024, (i-1)*512, (j-2)*512);
			addLine((j-2)*512, (i-1)*512, 1024, (j-2)*512, (i-1)*512, -1024);
			if (i == 0) {
				for (var k = 0; k < 5; k++) {
					addLine((j-2)*512, 1536, (k-2)*512, (j-2)*512, -512, (k-2)*512);
					if (j != 2) {
						addLine((k-2)*512, 1536, (j-2)*512, (k-2)*512, -512, (j-2)*512);
					}
				}
			}
		}
	}
	onResize();

	var mouseDown = false;
	document.addEventListener( 'mousedown', function() {
		mouseDown = true;
		document.addEventListener('mousemove', onDocumentMouseMove, false);
	}, false );

	document.addEventListener( 'mouseup', function() {
		pmouseX = null;
		mouseDown = false;
		document.removeEventListener('mousemove', onDocumentMouseMove, false);
	}, false );

	var minDist = 40;
	var maxDist = 2048*1.5;
	var wheelFriction = 1.0;
	var wheel = function(e) {
		var steps = e.wheelDeltaY ? e.wheelDeltaY : -e.detail*13;
		if (disable) return;
		tcircleDist -= steps*wheelFriction;
		if (tcircleDist < minDist) {
			tcircleDist = minDist;
		} else if (tcircleDist > maxDist) {
			tcircleDist = maxDist;
		}
	}

	window.addEventListener('DOMMouseScroll', wheel, false);
	document.addEventListener( 'mousewheel', wheel, false );

	var pmouseX=null, pmouseY=null;
	var mouseX = 0, mouseY = 0;
	function onDocumentMouseMove( event ) {
		if (disable) return;
		mouseX = event.clientX;
		mouseY = event.clientY;
		if (pmouseX == null) {
			pmouseX = mouseX;
			pmouseY = mouseY;
		}
		tangle += ((mouseX - pmouseX)/(1.0*window.innerWidth) * Math.PI*2);
		teyeHeight -= (pmouseY - mouseY)/(1.0*window.innerHeight) * 1000;
		pmouseX = mouseX;
		pmouseY = mouseY;
	}
};
