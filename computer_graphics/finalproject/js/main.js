"use strict";
function executeMainLoop() {

   // create a new model viewing demo
   var myDemo = new demo("glcanvas");

   // Initialize the Demo
   myDemo.init();

   // Enter the event driven loop.
   requestAnimationFrame(myDemo.MainLoop);
}
