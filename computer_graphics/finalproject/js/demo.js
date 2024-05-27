"use strict";
var gl = null; // our OpenGL handler

var GC = {};   // the graphics context

// initialize the graphics context variables
GC.framebuffer = null;
GC.SkyboxShader = null;           //our GLSL program
GC.ReflectShader = null;
GC.perspectiveMatrix = null;      //the Perspective matrix
GC.mvMatrix = null;               //the ModelView matrix
GC.mvMatrixStack = [];            //the ModelView matrix stack
GC.model = null;                  //the object model
GC.mouseDown = null;              //boolean check for mouseDown
GC.canvas = null;                 //canvas
GC.frameNumber = 10000;           //frame number used for animation
GC.requestID = null;              //request id used to cancel animation
GC.shaders = {};                  //shaders used in the program
GC.models = {};                   //models used in the scene
GC.lights = {};                   //lights used in the scene
GC.shadowBuffers = [];            //frame buffers for the shadow maps
GC.sceneBuffer = null;            //frame buffers for HDR
GC.pingpongBuffers = [];          //frame buffers for Ping Pong
GC.fpsText = null;                //text box for fps
GC.avgText = null;                //text box for avg fps
GC.deltaTime = 0.0;               //delta time between renders
GC.quality = 1.0;                 //quality of the scene

GC.activeCamera = 0;              //active camera

var camera = new ArcBall();       //create a new arcball camera
var cameraFP = new FirstPerson(); //create a new first person camera

GC.SHADOW_BUFFER_SIZE = null;

// demo constructor
function demo(canvasName, model) {
   this.canvasName = canvasName;
   this.GC = GC;
}

// initialize webgl, populate all buffers, load shader programs, and start drawing
demo.prototype.init = function(){
   GC.canvas = document.getElementById(this.canvasName);
   GC.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
   GC.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
   camera.setBounds(GC.canvas.width,GC.canvas.height);

   GC.canvas.requestPointerLock = GC.canvas.requestPointerLock ||
                                 GC.canvas.mozRequestPointerLock;

   document.exitPointerLock = document.exitPointerLock ||
                              document.mozExitPointerLock;

   GC.fpsText = document.querySelector("#fps");
   GC.avgText = document.querySelector("#avg");

   // Here we check to see if WebGL is supported
   this.initWebGL(GC.canvas);

   // Initialized clear color
   gl.clearColor(0.0,0.0,0.0,1.0);     //background to black
   gl.clearDepth(1.0);                 //set depth to yon plane
   gl.enable(gl.DEPTH_TEST);           //enable depth test
   gl.depthFunc(gl.LEQUAL);            //change depth test to use LEQUAL

   // Set the Camera Position
   camera.init();
   // Place the camera at the calculated position
   camera.position = [0.0, 6.0, 20.0];
   camera.distance = Math.sqrt(Math.pow(camera.position[1], 2) + Math.pow(camera.position[2], 2));

   // Orient the camera to look at the center of the model
   camera.lookAt = [0.0, 0.0, 0.0];

   // Set cameraFP starting position.
   cameraFP.eyeVector = $V([0.74, 0.16, 2.8]);
   cameraFP.updateView(GC.deltaTime);

   // Set initial camera
   GC.activeCamera = 1;
   cameraFP.active = true;

   // Setup camera toggle button
   var camButton = document.getElementById("changeCamera");
   camButton.innerHTML = "Toggle Camera";
   camButton.onclick = this.toggleCamera;

   // set event callbacks
   this.setEventCallbacks();

   // Get opengl derivative extension -- enables using fwidth in shader
   gl.getExtension("OES_standard_derivatives");

   // init the shader programs
   this.initShaders();

   // Initialize the frame buffer for the shadow map.
   this.initFrameBuffers();

   // Initialize the lights
   this.initLights();

   // Load models
   this.initModels();
}

// Function to handle resizing the canvas
demo.prototype.resizeCanvas = function() {
   if (GC.quality > 0) {
      GC.canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      GC.canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
   }
   else {
      GC.canvas.width = 640;
      GC.canvas.height = 480;
   }
   camera.setBounds(GC.canvas.width,GC.canvas.height);
   demo.prototype.initFrameBuffers();
}

// Main animation loop
let   then = 0;
const frameTimes = [];
let   frameCursor = 0;
let   numFrames = 0;
const maxFrames = 20;
let   totalFPS = 0;

demo.prototype.MainLoop = function(now){
   // Increase frame count
   GC.frameNumber++;

   // Calculate FPS
   now *= 0.001;
   GC.deltaTime = now - then;
   then = now;
   const fps = 1 / GC.deltaTime;
   GC.fpsText.textContent = fps.toFixed(1);

   // add the current fps and remove the oldest fps
   totalFPS += fps - (frameTimes[frameCursor] || 0);

   // record the newest fps
   frameTimes[frameCursor++] = fps;

   // needed so the first N frames, before we have maxFrames, is correct.
   numFrames = Math.max(numFrames, frameCursor);

   // wrap the cursor
   frameCursor %= maxFrames;

   const averageFPS = totalFPS / numFrames;

   GC.avgText.textContent = averageFPS.toFixed(1);  // update avg display

   // Draw the scene
   drawScene();

   // Store the request ID for the next animation request.
   GC.requestID = requestAnimationFrame(demo.prototype.MainLoop);
}

// Toggle the active camera
demo.prototype.toggleCamera = function() {
   switch(GC.activeCamera) {
      case 0:
         GC.activeCamera = 1;
         camera.active = false;
         cameraFP.active = true;
         break;
      case 1:
         GC.activeCamera = 0;
         camera.active = true;
         cameraFP.active = false;
         document.exitPointerLock();
         break;
   }
}

// Setup input event callbacks
demo.prototype.setEventCallbacks = function(){

   // Quality change callback
   $("#qualitySelect").change(function(){
      GC.quality = Number(this.value);
      demo.prototype.resizeCanvas();
   });

   // Resize callbacks
   document.onresize = this.resizeCanvas;
   GC.canvas.onresize = this.resizeCanvas;
   window.onresize = this.resizeCanvas;

   // Mouse callbacks
   GC.canvas.onmousedown = this.mouseDown;
   document.onmouseup = this.mouseUp;
   document.addEventListener("mousemove", this.mouseMove, false);
   GC.canvas.onmousewheel = this.mouseWheel;

   // Hook pointer lock state change events for different browsers
   document.addEventListener('pointerlockchange', this.lockChange, false);
   document.addEventListener('mozpointerlockchange', this.lockChange, false);

   // Touch callbacks
   GC.canvas.ontouchstart = this.touchDown;
   GC.canvas.ontouchend = this.touchUp;
   GC.canvas.ontouchmove = this.touchMove;

   // Keyboard callbacks
   document.onkeydown = this.keyDown;
   document.onkeyup = this.keyUp;
}

// Handle toggling of the mouse lock
demo.prototype.lockChange = function() {
  if (document.pointerLockElement === GC.canvas ||
      document.mozPointerLockElement === GC.canvas) {
    document.addEventListener("mousemove", demo.prototype.mouseMoveLocked, false);
  } else {
    document.removeEventListener("mousemove", demo.prototype.mouseMoveLocked, false);
  }
}

// Initialize the shaders and grab the shader variable attributes
demo.prototype.initShaders = function() {
   GC.shaders.skybox  = this.compileShader('VertexShaderSkybox', "FragmentShaderSkybox");
   GC.shaders.shadow  = this.compileShader('VertexShaderShadow', 'FragmentShaderShadow');
   GC.shaders.phong   = this.compileShader('VertexShaderPhong', 'FragmentShaderPhong');
   GC.shaders.bump    = this.compileShader('VertexShaderBump', 'FragmentShaderBump');
   GC.shaders.quad    = this.compileShader('VertexShaderQuad', 'FragmentShaderQuad');
   GC.shaders.blur    = this.compileShader('VertexShaderBlur', 'FragmentShaderBlur');
}

// Initialize the frame buffer
demo.prototype.initFrameBuffers = function() {

   GC.shadowBuffers = [];            //frame buffers for the shadow maps
   GC.sceneBuffer = null;            //frame buffers for HDR
   GC.pingpongBuffers = [];          //frame buffers for Ping Pong

   if (GC.quality >= 3) {
      GC.SHADOW_BUFFER_SIZE = 1024*8;
   }
   else if (GC.quality >= 2) {
      GC.SHADOW_BUFFER_SIZE = 1024*4;
   }
   else {
      GC.SHADOW_BUFFER_SIZE = 1024;
   }

   // For each shadow buffer
   for (var i = 0; i < 2; i++) {
      // Create the frame buffer
      var framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

      // Add a depth buffer to it.
      var depthBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, GC.SHADOW_BUFFER_SIZE, GC.SHADOW_BUFFER_SIZE);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

      // Create texture buffer for the shadow
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, GC.SHADOW_BUFFER_SIZE, GC.SHADOW_BUFFER_SIZE, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

      // Setup rendering to texture
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texture, 0);

      gl.drawBuffers([gl.NONE]);
      gl.readBuffer(gl.NONE);

      // Add both to the framebuffers array.
      GC.shadowBuffers.push({framebuffer: framebuffer, texture: texture});

      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
         alert("Shadow framebuffer not complete!" + gl.checkFramebufferStatus(gl.FRAMEBUFFER) + gl.getError());
      }
   }

   // Setup HDR framebuffer
   {
      var framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

      // Add a depth buffer to it.
      var depthBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, GC.canvas.width, GC.canvas.height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

      // Create a texture buffers for the HDR
      var textures = [];
      for (var i = 0; i < 2; i++) {
         var texture = gl.createTexture();
         gl.bindTexture(gl.TEXTURE_2D, texture);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GC.canvas.width, GC.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0+i, gl.TEXTURE_2D, texture, 0);

         textures.push(texture);
      }

      // Tell Opengl which color attachments we'll use
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

      GC.sceneBuffer = {framebuffer: framebuffer, textures: textures};

      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
         alert("HDR framebuffer not complete!" + gl.checkFramebufferStatus(gl.FRAMEBUFFER) + gl.getError());
      }
   }

   // Setup PingPong Buffers
   {
      for (var i = 0; i < 2; i++) {
         var framebuffer = gl.createFramebuffer();
         gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

         // Create the textures
         var texture = gl.createTexture();
         gl.bindTexture(gl.TEXTURE_2D, texture);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GC.canvas.width/8, GC.canvas.height/8, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

         GC.pingpongBuffers.push({framebuffer: framebuffer, texture: texture});

         if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            alert("Ping Pong framebuffer not complete!");
         }
      }

      // Tell Opengl which color attachments we'll use
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
   }
}

// Initialize the lights
demo.prototype.initLights = function() {
   var overheadLight = new Light('overhead');
   overheadLight.enabled = true;
   overheadLight.position[1] = 48.0;
   overheadLight.setColorAndEnergy([1.0, 1.0, 1.0], 0.6);

   var kitchenLight = new Light('kitchen');
   kitchenLight.enabled = true;
   kitchenLight.position = [0, 20, 46];
   kitchenLight.setColorAndEnergy([1.0, 1.0, 1.0], 0.6);

   var lanternLight = new Light('lantern');
   lanternLight.enabled = true;
   lanternLight.setColorAndEnergy([1.0, 1.0, 1.0], 0.3);
   lanternLight.specular = [0.0, 0.0, 0.0];

   Lights.add(overheadLight);
   Lights.add(kitchenLight);
   Lights.add(lanternLight);
}

// Initialize all the geometry buffers for the demo and set the correct shader for each model
demo.prototype.initModels = function() {
   var skybox_texture = loadTextureCube(gl, ['imagefiles/px.png',
                                             'imagefiles/nx.png',
                                             'imagefiles/py.png',
                                             'imagefiles/ny.png',
                                             'imagefiles/pz.png',
                                             'imagefiles/nz.png']);

   loadModel('./assets/cube.obj', '', 'skybox', GC.shaders.skybox, function (model) {
      model.skyboxTexture = skybox_texture
      model.center = true;
      model.scale = 100
      model.normalize = true;
   });

   loadModel('./assets/dnd_town_obj/instant_town.obj', './assets/dnd_town_obj/instant_town.mtl', 'town', GC.shaders.phong, function(model) {
      model.scale = 0.001842;
      model.translation = [-4.10145, 0.001, 5.08983];
   });

   loadModel('./assets/character_obj/character.obj', './assets/character_obj/character.mtl', 'character', GC.shaders.phong, null);

   loadModel('./assets/table_obj/table.obj', './assets/table_obj/table.mtl', 'table', GC.shaders.bump, null);

   loadModel('./assets/quad.obj', '', 'quad', null, null);

   loadModel('./assets/paper_pencil/paper_pencil.obj', './assets/paper_pencil/paper_pencil.mtl', 'paper_pencil', GC.shaders.phong, null);

   loadModel('./assets/dice/dice.obj', './assets/dice/dice.mtl', 'dice', GC.shaders.phong, null);

   loadModel('./assets/miniatures/miniatures.obj', './assets/miniatures/miniatures.mtl', 'miniatures', GC.shaders.phong, null);
}

// Load a model
function loadModel(obj_url, mtl_url, name, shader, callback) {
   var objLoader = new ObjLoader();

   var path = obj_url.substr(0, obj_url.lastIndexOf("/"));

   objLoader.load(obj_url, mtl_url, function(result) {
      var m = result;

      // Initialize model position
      m.rotation    = [0.0, 0.0, 0.0];
      m.translation = [0.0, 0.0, 0.0];
      m.scale       = 1.0;
      m.normalize   = false;
      m.center      = false;
      m.lightMatrix = [];              //array for holding the light matrices.
      m.lightMatrix[0] = Matrix.I(4);
      m.lightMatrix[1] = Matrix.I(4);

      // Init the Buffers
      initModelBuffers(m);

      // Set the shader for the model
      m.shader = shader;

      // White texture for materials which don't have a texture
      var whiteTexture = loadColorTexture(gl, 255, 255, 255);

      // Default bump map texture
      var bumpTexture = loadColorTexture(gl, 128, 128, 255);

      // Load the textures for the materials
      for (var key in m.materials) {
         var material = m.materials[key];

         if (material.ambientMap) {
            material.ambientMapTexture = loadTexture(gl, path + '/' + material.ambientMap);
         } else {
            material.ambientMapTexture = whiteTexture;
         }

         if (material.diffuseMap) {
            material.diffuseMapTexture = loadTexture(gl, path + '/' + material.diffuseMap);
         } else {
            material.diffuseMapTexture = whiteTexture;
         }


         if (material.specularMap) {
            material.specularMapTexture = loadTexture(gl, path + '/' + material.specularMap);
         } else {
            material.specularMapTexture = whiteTexture;
         }

         if (material.alphaMap) {
            material.alphaMapTexture = loadTexture(gl, path + '/' + material.alphaMap);
         } else {
            material.alphaMapTexture = whiteTexture;
         }

         if (material.bumpMap) {
            material.bumpMapTexture = loadTexture(gl, path + '/' + material.bumpMap);
         } else {
            material.bumpMapTexture = bumpTexture;
         }

         if (material.displacementMap) {
            material.displacementMapTexture = loadTexture(gl, path + '/' + material.displacementMap);
         } else {
            material.displacementMapTexture = whiteTexture;
         }
      }

      // Add the model to the models
      GC.models[name] = m;

      if (callback) {
         callback(m);
      }
   });
}

// Initialize the buffers for a particular model
function initModelBuffers(model){
   var vertex_attributes = {};
   vertex_attributes[""] = {};
   vertex_attributes[""].vertices = [];
   vertex_attributes[""].normals = [];
   vertex_attributes[""].textures = [];
   vertex_attributes[""].tangent = [];
   vertex_attributes[""].bitangent = [];

   var vertex_attributes_materials = [""];

   // Setup vertex attributes for each material
   for (var mat in model.materials) {
      vertex_attributes_materials.push(mat);
      vertex_attributes[mat] = {};
      vertex_attributes[mat].vertices = [];
      vertex_attributes[mat].normals = [];
      vertex_attributes[mat].textures = [];
      vertex_attributes[mat].tangent = [];
      vertex_attributes[mat].bitangent = [];
   }

   var min = [90000 , 90000, 90000]; //used for bounding box calculations
   var max = [-90000,-90000,-90000]; //used for bounding box calculations

   // Loop through the packed arrays and create vertices arrays with all the
   // attributes per vertex. Also, determine the min and max values.
   for (var i = 0; i < model.faces.length; i++) {
      for (var j = 2; j < model.faces[i].indices.length; j++) {
         var points = [0, j-1, j];

         // Calculate tangent space
         var p1 = model.faces[i].indices[0];
         var p2 = model.faces[i].indices[j-1];
         var p3 = model.faces[i].indices[j];

         var pt1 = model.faces[i].texture[0];
         var pt2 = model.faces[i].texture[j-1];
         var pt3 = model.faces[i].texture[j];

         // Get the first edge
         var Ux = model.vertices[p2][0] - model.vertices[p1][0];
         var Uy = model.vertices[p2][1] - model.vertices[p1][1];
         var Uz = model.vertices[p2][2] - model.vertices[p1][2];

         // Get the second edge
         var Vx = model.vertices[p3][0] - model.vertices[p1][0];
         var Vy = model.vertices[p3][1] - model.vertices[p1][1];
         var Vz = model.vertices[p3][2] - model.vertices[p1][2];

         var deltaUV1x = 0.0;
         var deltaUV1y = 0.0;
         var deltaUV2x = 0.0;
         var deltaUV2y = 0.0;

         if (model.textureCoords.length) {
            // Get deltaUV 1
            deltaUV1x = model.textureCoords[pt2][0] - model.textureCoords[pt1][0];
            deltaUV1y = model.textureCoords[pt2][1] - model.textureCoords[pt1][1];

            // Get deltaUV 2
            deltaUV2x = model.textureCoords[pt3][0] - model.textureCoords[pt1][0];
            deltaUV2y = model.textureCoords[pt3][1] - model.textureCoords[pt1][1];
         }

         var f = 1.0 / (deltaUV1x * deltaUV2y - deltaUV2x * deltaUV1y);

         // Calculate tangent vector
         var tangentx = f * (deltaUV2y * Ux - deltaUV1y * Vx);
         var tangenty = f * (deltaUV2y * Uy - deltaUV1y * Vy);
         var tangentz = f * (deltaUV2y * Uz - deltaUV1y * Vz);
         var w = Math.sqrt(tangentx*tangentx + tangenty*tangenty + tangentz*tangentz);
         tangentx /= w;
         tangenty /= w;
         tangentz /= w;

         // Calcualte bitangent vector
         var bitangentx = f * (-deltaUV2x * Ux + deltaUV1x * Vx);
         var bitangenty = f * (-deltaUV2x * Uy + deltaUV1x * Vy);
         var bitangentz = f * (-deltaUV2x * Uz + deltaUV1x * Vz);
         var w = Math.sqrt(bitangentx*bitangentx + bitangenty*bitangenty + bitangentz*bitangentz);
         bitangentx /= w;
         bitangenty /= w;
         bitangentz /= w;

         for (var k = 0; k < points.length; k++) {
            var idx = points[k];

            // Grab the x,y,z values for the current vertex
            var vx = model.vertices[model.faces[i].indices[idx]][0];
            var vy = model.vertices[model.faces[i].indices[idx]][1];
            var vz = model.vertices[model.faces[i].indices[idx]][2];

            // Grab the normal values for the current vertex
            // No normals provided in model file so use computed normals.
            if (model.normals.length == 0) {
               var vnx = model.vNormals[model.faces[i].normal[idx]][0];
               var vny = model.vNormals[model.faces[i].normal[idx]][1];
               var vnz = model.vNormals[model.faces[i].normal[idx]][2];
            }
            // Use provided normals
            else {
               var vnx = model.normals[model.faces[i].normal[idx]][0];
               var vny = model.normals[model.faces[i].normal[idx]][1];
               var vnz = model.normals[model.faces[i].normal[idx]][2];
            }

            // Grab the texture coordinates.
            if (model.textureCoords.length) {
               var vtu = model.textureCoords[model.faces[i].texture[idx]][0];
               var vtv = model.textureCoords[model.faces[i].texture[idx]][1];
            } else {
               var vtu = 0.0;
               var vtv = 0.0;
            }

            // Store at the attributes in the vertex attribute data struct.
            vertex_attributes[model.faces[i].material].vertices.push(vx, vy, vz);
            vertex_attributes[model.faces[i].material].normals.push(vnx, vny, vnz);
            vertex_attributes[model.faces[i].material].textures.push(vtu, vtv);
            vertex_attributes[model.faces[i].material].tangent.push(tangentx, tangenty, tangentz);
            vertex_attributes[model.faces[i].material].bitangent.push(bitangentx, bitangenty, bitangentz);

            // Check to see if we need to update the min/max
            if(vx < min[0]) min[0] = vx;
            if(vy < min[1]) min[1] = vy;
            if(vz < min[2]) min[2] = vz;
            if(vx > max[0]) max[0] = vx;
            if(vy > max[1]) max[1] = vy;
            if(vz > max[2]) max[2] = vz;
         }
      }
   }

   //set the min/max variables
   model.minX = min[0]; model.minY = min[1]; model.minZ = min[2];
   model.maxX = max[0]; model.maxY = max[1]; model.maxZ = max[2];

   model.vertexBuffer = {}
   model.normalBuffer = {}
   model.textureCoordBuffer = {}
   model.tangentBuffer = {}
   model.bitangentBuffer = {}
   model.num_tri = {}
   model.materialBuffer = []

   for (var i in vertex_attributes_materials) {
      var mat = vertex_attributes_materials[i];

      if (vertex_attributes[mat].vertices.length > 0) {

         model.materialBuffer.push(mat);

         model.num_tri[mat] = vertex_attributes[mat].vertices.length/3;

         // Create buffer for vertices and set the data
         model.vertexBuffer[mat] = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer[mat]);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_attributes[mat].vertices), gl.STATIC_DRAW);

         // create buffer for normals and set the data
         model.normalBuffer[mat] = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer[mat]);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_attributes[mat].normals), gl.STATIC_DRAW);

         // create buffer for texture coordinates and set the data
         model.textureCoordBuffer[mat] = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, model.textureCoordBuffer[mat]);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_attributes[mat].textures), gl.STATIC_DRAW);

         // create buffer for tangents and set the data
         model.tangentBuffer[mat] = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, model.tangentBuffer[mat]);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_attributes[mat].tangent), gl.STATIC_DRAW);

         // create buffer for bitangents and set the data
         model.bitangentBuffer[mat] = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, model.bitangentBuffer[mat]);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_attributes[mat].bitangent), gl.STATIC_DRAW);
      }
   }
}

// Determine if the value is a power of 2
function isPowerOf2(value) {
   return (value & (value - 1)) == 0;
}

// Create a single pixel color from provided RGB values
function loadColorTexture(gl, r, g, b) {
   const texture = gl.createTexture();

   gl.bindTexture(gl.TEXTURE_2D, texture);

   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([r, g, b, 1.0]));

   return texture;
}

// Initialize a texture and load the image.
// When the image finishes loading, copy it into the texture.
function loadTexture(gl, url) {
   const texture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, texture);

   // Create a single pixel texture to allow use of the texture before the
   // image finishes loading.
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 1.0]));

   const image = new Image();
   image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Flip the orientation of the texture on the Y axis since most images have their origin in the upper-left corner.
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // Generate mipmaps for the texture
      gl.generateMipmap(gl.TEXTURE_2D);
   };
   image.src = url;

   return texture;
}

// Initialize a texture cube
function loadTextureCube(gl, urls) {
   var count = 0;
   var img = new Array(6);

   var targets = [
      gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
         ];

   const texture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

   // Create a single pixel texture to allow use of the texture before the
   // image finishes loading.
   for (var j = 0; j < 6; j++) {
      gl.texImage2D(targets[j], 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 1.0]));
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   }

   for (var i = 0; i < 6; i++) {
      img[i] = new Image();
      img[i].onload = function() {
         count++;
         if (count == 6) {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

            // Flip the orientation of the texture on the Y axis since most images have their origin in the upper-left corner.
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);

            // Set texture data.
            for (var j = 0; j < 6; j++) {
               gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
            }

            // Generate mipmaps for the texture
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
         }
      }
      img[i].src = urls[i];
   }

   return texture;
}

// Function to compute the min and max Z values for the model in the canonical view volume.
function computeMinMaxZ(model) {
   var model = GC.model;
   var minZ =  90000.0;
   var maxZ = -90000.0;

   // Loop through each vertex and transform it into the projected space.
   model.indices.forEach(function(d,i){
      //grab the x,y,z values for the current vertex
      var vx = (parseFloat(model.vertices[d*3]));
      var vy = (parseFloat(model.vertices[d*3+1]));
      var vz = (parseFloat(model.vertices[d*3+2]));

      // Transform the xyz values
      var v = Vector.create([vx, vy, vz, 1]);
      var vt = GC.perspectiveMatrix.x(GC.mvMatrix).x(v);

      // Convert the Z coordinate back into 3D space
      var z = vt.e(3)/vt.e(4);

      // Find the min and max z value
      if (z <= minZ) minZ = z;
      if (z >= maxZ) maxZ = z;
   });

   return [minZ, maxZ];
}

//the drawing function
function drawScene(now) {
   // Render the shadow textures
   // --------------------------
   if (GC.quality > 0) {
      createShadowMaps();
   }

   // Render the scene to the scene buffer
   // ------------------------------------
   gl.bindFramebuffer(gl.FRAMEBUFFER, GC.sceneBuffer.framebuffer);
   gl.viewport(0, 0, GC.canvas.width, GC.canvas.height);

   // Set initial camera lookat matrix
   mvLoadIdentity(GC);

   // Camera Transformations
   switch(GC.activeCamera) {
      case 0:
         // Setup perspective matrix
         var near = Math.max(camera.distance - 20, 0.1);
         var far  = camera.distance + 120;
         GC.perspectiveMatrix = makePerspective(45, GC.canvas.width/GC.canvas.height, near, far);

         // Multiply by our lookAt matrix
         var lookAtMatrix = makeLookAt(camera.position[0],camera.position[1],camera.position[2],
               camera.lookAt[0],camera.lookAt[1],camera.lookAt[2],
               0,1,0);
         mvMultMatrix(lookAtMatrix, GC);

         // Multiply by the arc ball transformation
         mvMultMatrix(camera.Transform, GC);
         break;
      case 1:
         // Setup perspective matrix
         GC.perspectiveMatrix = makePerspective(45, GC.canvas.width/GC.canvas.height, 0.01, 200.0);

         // Recalculate camera position
         cameraFP.updateView(GC.deltaTime);

         // Multiply by the view matrix
         mvMultMatrix(cameraFP.viewMatrix, GC);
         break;
   }

   // Render the scene
   renderScene();

   // Blur bright fragments with two-pass Gaussian Blur
   // -------------------------------------------------
   if (GC.quality > 0) {
      var horizontal = 1
      var first_iteration = true;
      var amount = 10;
      gl.viewport(0, 0, GC.canvas.width/8, GC.canvas.height/8);

      for (var i = 0; i < amount; i++)
      {
         gl.bindFramebuffer(gl.FRAMEBUFFER, GC.pingpongBuffers[horizontal].framebuffer);

         // Use the blur program
         gl.useProgram(GC.shaders.blur);

         // Set horizontal
         var uHorizontal = gl.getUniformLocation(GC.shaders.blur, "uHorizontal");
         if (uHorizontal) {
            gl.uniform1i(uHorizontal, horizontal);
         }

         // Set the blur texture
         var uImage = gl.getUniformLocation(GC.shaders.blur, "uImage");
         if (uImage) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, first_iteration ? GC.sceneBuffer.textures[1] : GC.pingpongBuffers[!horizontal ? 1 : 0].texture);  // bind texture of other framebuffer (or scene if first iteration)
            gl.uniform1i(uImage, 0);
         }

         renderQuad(GC.shaders.blur);
         horizontal = !horizontal ? 1 : 0;
         if (first_iteration)
            first_iteration = false;
      }
   }

   // Render the final image with bloom
   // ---------------------------------
   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   gl.viewport(0, 0, GC.canvas.width, GC.canvas.height);

   // Setup perspective and lookat matrices
   GC.perspectiveMatrix = Matrix.I(4);

   // Set initial camera lookat matrix
   mvLoadIdentity(GC);

   // Use the quad program
   gl.useProgram(GC.shaders.quad);

   // Set bloom
   var bloom = gl.getUniformLocation(GC.shaders.quad, "bloom");
   if (bloom) {
      if (GC.quality > 0) {
         gl.uniform1i(bloom, true);
      } else {
         gl.uniform1i(bloom, false);
      }
   }

   // Set the quad texture
   var uScene = gl.getUniformLocation(GC.shaders.quad, "uScene");
   if (uScene) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, GC.sceneBuffer.textures[0]);
      gl.uniform1i(uScene, 0);
   }

   // Set the quad texture
   if (GC.quality > 0) {
      var uBloom = gl.getUniformLocation(GC.shaders.quad, "uBloom");
      if (uBloom) {
         gl.activeTexture(gl.TEXTURE1);
         gl.bindTexture(gl.TEXTURE_2D, GC.pingpongBuffers[!horizontal ? 1 : 0].texture);
         gl.uniform1i(uBloom, 1);
      }
   } else {
      var uBloom = gl.getUniformLocation(GC.shaders.quad, "uBloom");
      if (uBloom) {
         gl.activeTexture(gl.TEXTURE1);
         gl.bindTexture(gl.TEXTURE_2D, GC.sceneBuffer.textures[1]);
         gl.uniform1i(uBloom, 1);
      }
   }

   // render quad
   renderQuad(GC.shaders.quad);
}

// Create the shadow maps
function createShadowMaps() {

   for (var i = 0; i < 2; i++) {
      // Store current shadow.
      GC.currentShadow = i;

      gl.bindFramebuffer(gl.FRAMEBUFFER, GC.shadowBuffers[i].framebuffer);
      gl.viewport(0, 0, GC.SHADOW_BUFFER_SIZE, GC.SHADOW_BUFFER_SIZE);

      // Set initial camera lookat matrix
      mvLoadIdentity(GC);

      // Setup perspective and lookat matrices
      if (i == 0) {
         GC.perspectiveMatrix = makeOrtho(-9, 9, -12, 12, 45, 65);

         var lookAtMatrix = makeLookAt(Lights.list[i].position[0], Lights.list[i].position[1], Lights.list[i].position[2], // Position
                  0.0, 0.0, 0.0, // Center of view
                  0, 0, 1);      // Up
         mvMultMatrix(lookAtMatrix, GC);
      }
      else {
         GC.perspectiveMatrix = makeOrtho(-9, 9, -17, 5, 35, 70);

         var lookAtMatrix = makeLookAt(Lights.list[i].position[0], Lights.list[i].position[1], Lights.list[i].position[2], // Position
                  0.0, 0.0, 0.0, // Center of view
                  0, 1, 0);      // Up
         mvMultMatrix(lookAtMatrix, GC);
      }

      // Render the scene
      renderScene(GC.shaders.shadow);
   }
}

// Render a quad
function renderQuad(shader) {

   var model = GC.models['quad'];

   // Return if the model has not finished loading
   if (!model)
      return;

   // Clear the frame buffer
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   // Set the uniforms for the program
   setMatrixUniforms(GC, shader);

   for (var i in model.materialBuffer) {
      var mat = model.materialBuffer[i];

      // Pass the vertex buffer to the shader
      var vertexPositionAttribute = gl.getAttribLocation(shader, "aPosition");
      gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer[mat]);
      gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexPositionAttribute);

      // Pass the texture coordinate buffer to the shader
      var textureCoordAttribute = gl.getAttribLocation(shader, "aTexture");
      if (textureCoordAttribute != -1) {
         gl.bindBuffer(gl.ARRAY_BUFFER, model.textureCoordBuffer[mat]);
         gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
         gl.enableVertexAttribArray(textureCoordAttribute);
      }

      // Draw object
      gl.drawArrays(gl.TRIANGLES, 0, model.num_tri[mat]);

      // Disable the enabled attributes
      gl.disableVertexAttribArray(vertexPositionAttribute);
      if (textureCoordAttribute != -1) {
         gl.disableVertexAttribArray(textureCoordAttribute);
      }
   }
}

// Render the scene
function renderScene(shader_override) {
   // Clear the frame buffer
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   // Render the skybox
   drawModel(GC.models.skybox, shader_override);

   // Enable Blending for transparency
   gl.enable(gl.BLEND);
   gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

   // Render the town
   drawModel(GC.models.town, shader_override);

   // Enable culling
   gl.enable(gl.CULL_FACE);
   gl.cullFace(gl.BACK)

   // Render the table
   drawModel(GC.models.table, shader_override);

   // Render the paper and pencils
   drawModel(GC.models.paper_pencil, shader_override);

   // Render miniatures
   drawModel(GC.models.miniatures, shader_override);

   // Render the character when in arcball mode
   if (GC.activeCamera == 0 && GC.models.character) {
      GC.models.character.translation[0] = cameraFP.eyeVector.elements[0];
      GC.models.character.translation[2] = cameraFP.eyeVector.elements[2];
      GC.models.character.rotation[1] = -180.0*cameraFP.yaw/Math.PI;
      drawModel(GC.models.character, shader_override);
   }

   // Render dice
   drawModel(GC.models.dice, shader_override);

   // Disable curling
   gl.disable(gl.CULL_FACE);

   // Turn off blending
   gl.disable(gl.BLEND);
}

// Render function
function drawModel(model, shader_override) {

   // Return if the model has not finished loading
   if (!model)
      return;

   // Store the view matrix seperate, used to convert back to world space from eye space
   GC.vMatrix = GC.mvMatrix;

   // If shader override is specifed, use the shader instead of the model default
   if (shader_override) {
      var shader = shader_override;
   }
   else {
      var shader = model.shader;
   }

   // Use the models shader program
   gl.useProgram(shader);

   mvPushMatrix(null, GC);

   // ----- Setup model matrix

   // Get the longest length of the model
   var length = [model.minX-model.maxX, model.minY-model.maxY, model.minZ-model.maxZ].reduce(function(a,b) {
      return Math.max(Math.abs(a,b));
   });

   // Translate the model to its position
   mvTranslate(model.translation, GC);

   // Rotate the model
   mvRotate(model.rotation[2], [0, 0, 1], GC);
   mvRotate(model.rotation[1], [0, 1, 0], GC);
   mvRotate(model.rotation[0], [1, 0, 0], GC);

   // Scale the model
   mvScale([model.scale, model.scale, model.scale],GC);

   // Normalize the model to unit size
   if (model.normalize) {
      mvScale([1.0/length,1.0/length,1.0/length],GC);
   }

   // Translate model to the origin
   if (model.center) {
      mvTranslate([-(model.minX+model.maxX)/2.0,-(model.minY+model.maxY)/2,-(model.minZ+model.maxZ)/2.0],GC);
   }

   // Store light matrix in model
   if (shader_override) {
      // Store light matrix
      model.lightMatrix[GC.currentShadow] = GC.perspectiveMatrix.x(GC.mvMatrix);
   }

   // -----

   // Set the uniforms for the program
   setMatrixUniforms(GC, shader);

    var lightUniform0 = gl.getUniformLocation(shader, "uLightMatrix0");
    if (lightUniform0) {
      gl.uniformMatrix4fv(lightUniform0, false, new Float32Array(model.lightMatrix[0].flatten()));
    }

    var lightUniform1 = gl.getUniformLocation(shader, "uLightMatrix1");
    if (lightUniform1) {
      gl.uniformMatrix4fv(lightUniform1, false, new Float32Array(model.lightMatrix[1].flatten()));
    }

   for (var i in model.materialBuffer) {
      var mat = model.materialBuffer[i];

      // Set the skybox texture
      var uSkybox = gl.getUniformLocation(shader, "uSkybox");
      if (uSkybox) {
         gl.activeTexture(gl.TEXTURE0);
         gl.bindTexture(gl.TEXTURE_CUBE_MAP, model.skyboxTexture);
         gl.uniform1i(uSkybox, 0);
      }

      // Set material texture
      var uTexture = gl.getUniformLocation(shader, "uTexture");
      if (uTexture) {
         gl.activeTexture(gl.TEXTURE0);
         gl.bindTexture(gl.TEXTURE_2D, model.materials[mat].diffuseMapTexture);
         gl.uniform1i(uTexture, 0);
      }

      // Set normal texture
      var uNormal = gl.getUniformLocation(shader, "uNormal");
      if (uNormal) {
         gl.activeTexture(gl.TEXTURE3);
         gl.bindTexture(gl.TEXTURE_2D, model.materials[mat].bumpMapTexture);
         gl.uniform1i(uNormal, 3);
      }

      // Set shadow texture0
      var uShadow0 = gl.getUniformLocation(shader, "uShadow0");
      if (uShadow0) {
         gl.activeTexture(gl.TEXTURE1);
         gl.bindTexture(gl.TEXTURE_2D, GC.shadowBuffers[0].texture);
         gl.uniform1i(uShadow0, 1);
      }

      // Set shadow texture1
      var uShadow1 = gl.getUniformLocation(shader, "uShadow1");
      if (uShadow1) {
         gl.activeTexture(gl.TEXTURE2);
         gl.bindTexture(gl.TEXTURE_2D, GC.shadowBuffers[1].texture);
         gl.uniform1i(uShadow1, 2);
      }

      // Set the ambient material constant
      var ambient_k = gl.getUniformLocation(shader, "ambient_k");
      if (ambient_k) {
         gl.uniform3fv(ambient_k, model.materials[mat].ambient);
      }

      // Set the diffuse material constant
      var diffuse_k = gl.getUniformLocation(shader, "diffuse_k");
      if (diffuse_k) {
         gl.uniform3fv(diffuse_k, model.materials[mat].diffuse);
      }

      // Set the specular material constant
      var specular_k = gl.getUniformLocation(shader, "specular_k");
      if (specular_k) {
         gl.uniform3fv(specular_k, model.materials[mat].specular);
      }

      // Load the transparency
      var transparency = gl.getUniformLocation(shader, "transparency");
      if (transparency) {
         if (model.materials[mat].transparent)
            gl.uniform1f(transparency, model.materials[mat].transparent);
         else
            gl.uniform1f(transparency, 1.0);
      }

      // Load the specular exponent
      var specular_exponent = gl.getUniformLocation(shader, "specular_exponent");
      if (specular_exponent) {
         if (model.materials[mat].specularExponent)
            gl.uniform1f(specular_exponent, model.materials[mat].specularExponent);
         else
            gl.uniform1f(specular_exponent, 10);
      }

      // Set light position
      var light_position = gl.getUniformLocation(shader, "uLightPosition");
      if (light_position) {
         // Update lantern position
         Lights.get('lantern').position = GC.vMatrix.inverse().x($V([0.0, 0.0, 0.0, 1.0])).elements.slice(0,3);

         gl.uniform3fv(light_position, Lights.getArray('position'));
      }

      // Set light ambient
      var light_ambient = gl.getUniformLocation(shader, "uLightAmbient");
      if (light_ambient) {
         gl.uniform3fv(light_ambient, Lights.getArray('ambient'));
      }

      // Set light diffuse
      var light_diffuse = gl.getUniformLocation(shader, "uLightDiffuse");
      if (light_diffuse) {
         gl.uniform3fv(light_diffuse, Lights.getArray('diffuse'));
      }

      // Set light specular
      var light_specular = gl.getUniformLocation(shader, "uLightSpecular");
      if (light_specular) {
         gl.uniform3fv(light_specular, Lights.getArray('specular'));
      }

      // Set light enabled
      var light_enabled = gl.getUniformLocation(shader, "uLightEnabled");
      if (light_enabled) {
         gl.uniform1iv(light_enabled, Lights.getArray('enabled'));
      }

      // Set shadow enabled
      var shadowEnabled = gl.getUniformLocation(shader, "shadowEnabled");
      if (shadowEnabled) {
         if (GC.quality > 0) {
            gl.uniform1i(shadowEnabled, true);
         } else {
            gl.uniform1i(shadowEnabled, false);
         }
      }

      // Pass the vertex buffer to the shader
      var vertexPositionAttribute = gl.getAttribLocation(shader, "aPosition");
      gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer[mat]);
      gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexPositionAttribute);

      // Pass the normal buffer to the shader
      var vertexNormalAttribute = gl.getAttribLocation(shader, "aNormal");
      if (vertexNormalAttribute != -1) {
         gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer[mat]);
         gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
         gl.enableVertexAttribArray(vertexNormalAttribute);
      }

      // Pass the texture coordinate buffer to the shader
      var textureCoordAttribute = gl.getAttribLocation(shader, "aTexture");
      if (textureCoordAttribute != -1) {
         gl.bindBuffer(gl.ARRAY_BUFFER, model.textureCoordBuffer[mat]);
         gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
         gl.enableVertexAttribArray(textureCoordAttribute);
      }

      // Pass the tangent buffer to the shader
      var tangentAttribute = gl.getAttribLocation(shader, "aTangent");
      if (tangentAttribute != -1) {
         gl.bindBuffer(gl.ARRAY_BUFFER, model.tangentBuffer[mat]);
         gl.vertexAttribPointer(tangentAttribute, 3, gl.FLOAT, false, 0, 0);
         gl.enableVertexAttribArray(tangentAttribute);
      }

      // Pass the bitangent buffer to the shader
      var bitangentAttribute = gl.getAttribLocation(shader, "aBitangent");
      if (bitangentAttribute != -1) {
         gl.bindBuffer(gl.ARRAY_BUFFER, model.bitangentBuffer[mat]);
         gl.vertexAttribPointer(bitangentAttribute, 3, gl.FLOAT, false, 0, 0);
         gl.enableVertexAttribArray(bitangentAttribute);
      }

      // Draw object
      gl.drawArrays(gl.TRIANGLES, 0, model.num_tri[mat]);

      // Disable the enabled attributes
      gl.disableVertexAttribArray(vertexPositionAttribute);
      if (vertexNormalAttribute != -1) {
         gl.disableVertexAttribArray(vertexNormalAttribute);
      }
      if (textureCoordAttribute != -1) {
         gl.disableVertexAttribArray(textureCoordAttribute);
      }
      if (tangentAttribute != -1) {
         gl.disableVertexAttribArray(tangentAttribute);
      }
      if (bitangentAttribute != -1) {
         gl.disableVertexAttribArray(bitangentAttribute);
      }
   }

   mvPopMatrix(GC);
}

// Initialize webgl
demo.prototype.initWebGL = function(){
   gl = null;

   try {
      gl = GC.canvas.getContext("webgl2");
   }
   catch(e) {
      //pass through
   }

   // If we don't have a GL context, give up now
   if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
   }
}

demo.prototype.compileShader = function(vertexSource, fragmentSource) {
   //Load the shaders
   var vertexShader = this.getShader(vertexSource);
   var fragmentShader = this.getShader(fragmentSource);

   var shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);

   if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
      console.log("unable to init shader program -- " + gl.getProgramInfoLog(shaderProgram));
   }

   return shaderProgram;
}

//compile shader located within a script tag
demo.prototype.getShader = function(id){
   var shaderScript, theSource, currentChild, shader;

   shaderScript = document.getElementById(id);
   if(!shaderScript){
      return null;
   }

   //init the source code variable
   theSource = "";

   //begin reading the shader source from the beginning
   currentChild = shaderScript.firstChild;

   //read the shader source as text
   while(currentChild){
      if(currentChild.nodeType == currentChild.TEXT_NODE){
         theSource += currentChild.textContent;
      }
      currentChild = currentChild.nextSibling;
   }

   //check type of shader to give openGL the correct hint
   if(shaderScript.type == "x-shader/x-fragment"){
      shader = gl.createShader(gl.FRAGMENT_SHADER);
   } else if(shaderScript.type == "x-shader/x-vertex"){
      shader = gl.createShader(gl.VERTEX_SHADER);
   } else {
      return null;
   }

   //add the shader source code to the created shader object
   gl.shaderSource(shader, theSource);

   //compile the shader
   gl.compileShader(shader);

   if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      console.log("error compiling shaders -- " + gl.getShaderInfoLog(shader));
      return null;
   }

   return shader;
}


//handle mousedown
demo.prototype.mouseDown = function(event){
   GC.mouseDown = true;

   switch(GC.activeCamera) {
      case 0:
         //update the base rotation so model doesn't jerk around upon new clicks
         camera.LastRot = camera.ThisRot;
         camera.click(event.clientX,event.clientY);
         break;

      case 1:
         GC.canvas.requestPointerLock();
         break;
   }

   return false;
}

//handle mouseup
demo.prototype.mouseUp = function(event){
   GC.mouseDown = false;
   return false;
}

//handle mouse movement
demo.prototype.mouseMove = function(event){
   if(GC.mouseDown == true) {
      var X = event.clientX;
      var Y = event.clientY;

      //call camera function for handling mouse movement
      camera.move(X,Y);
   }
   return false;
}

//handle locked mouse movement
demo.prototype.mouseMoveLocked = function(event){
   cameraFP.move(event.movementX, event.movementY);
   return false;
}

//handle mouse scroll event
demo.prototype.mouseWheel = function(event){
   if(GC.activeCamera == 0) {
      camera.position[1] = Math.max(camera.position[1] - event.wheelDeltaY*0.0005*6, 0.01*6);
      camera.position[2] = Math.max(camera.position[2] - event.wheelDeltaY*0.0005*20, 0.01*20);
      camera.distance = Math.sqrt(Math.pow(camera.position[1], 2) + Math.pow(camera.position[2], 2));
   }

   return false;
}


//--------- handle keyboard events
demo.prototype.keyDown = function(e){
   camera.LastRot = camera.ThisRot;
   var center = {x: GC.canvas.width/2, y:GC.canvas.height/2};
   var delta = 8;

   switch(e.keyCode){
      case 37: //Left arrow
         camera.click(center.x, center.y);
         camera.move(center.x - delta, center.y);
         cameraFP.move(-delta, 0.0);
         break;
      case 38: //Up arrow
         camera.click(center.x, center.y);
         camera.move(center.x, center.y - delta);
         cameraFP.move(0.0, -delta);
         break;
      case 39: //Right arrow
         camera.click(center.x, center.y);
         camera.move(center.x + delta, center.y);
         cameraFP.move(+delta, 0.0);
         break;
      case 40: //Down arrow
         camera.click(center.x, center.y);
         camera.move(center.x, center.y + delta);
         cameraFP.move(0.0, +delta);
         break;
   }

   cameraFP.keyPress(e.key);
}

demo.prototype.keyUp = function(e){
   cameraFP.keyRelease(e.key);
}

// --------- handle touch events
demo.prototype.touchDown = function(event){
   GC.mouseDown = true;

   //update the base rotation so model doesn't jerk around upon new clicks
   camera.LastRot = camera.ThisRot;

   //tell the camera where the touch event happened
   camera.click(event.changedTouches[0].pageX,event.changedTouches[0].pageY);

   return false;
}

//handle touchEnd
demo.prototype.touchUp = function(event){
   GC.mouseDown = false;
   return false;
}

//handle touch movement
demo.prototype.touchMove = function(event){
   if(GC.mouseDown == true){
      X = event.changedTouches[0].pageX;
      Y = event.changedTouches[0].pageY;

      //call camera function for handling mouse movement
      camera.move(X,Y);
   }
   return false;
}
// --------- end handle touch events
