"use strict";
// First Person Camera
// See http://in2gpu.com/2016/02/26/opengl-fps-camera/ for calculations

function FirstPerson(){
   this.roll = 0.0;
   this.pitch = 0.0;
   this.yaw = 0.0;
   this.eyeVector = Vector.create([0.0, 0.0, 0.0]);
   this.viewMatrix = Matrix.I(4);
   this.dx = 0.0;
   this.dz = 0.0;
   this.shiftPressed = 0;
   this.active = false;
}

FirstPerson.prototype = {
   // Update the view based on roll, pitch, yaw, and eye vector.
   updateView : function(timeDelta) {
      if (this.active) {
         // Update the eye vector
         var forward = Vector.create([this.viewMatrix.elements[2][0], 0.0, this.viewMatrix.elements[2][2]]);
         var strafe = Vector.create([this.viewMatrix.elements[0][0], 0.0, this.viewMatrix.elements[0][2]]);
         var speed = this.shiftPressed ? 1.0 : 0.5;
         speed *= timeDelta
         this.eyeVector = this.eyeVector.add(forward.x(-this.dz).add(strafe.x(this.dx)).x(speed));

         // Update the rotation
         var matRoll = Matrix.Rotate($V([0.0, 0.0, 1.0]), this.roll);
         var matPitch = Matrix.Rotate($V([1.0, 0.0, 0.0]), this.pitch);
         var matYaw = Matrix.Rotate($V([0.0, 1.0, 0.0]), this.yaw);

         // Build the matrices
         var rotate = matRoll.x(matPitch).x(matYaw);
         var translate = Matrix.Translation(this.eyeVector.x(-1));
         this.viewMatrix = rotate.x(translate);
      }
   },

   // Handle key press
   keyPress : function(key) {
      if (this.active) {
         switch (key)
         {
            case 'w':
            case 'W':
               this.dz = 1;
               break;
            case 's':
            case 'S':
               this.dz = -1;
               break;
            case 'a':
            case 'A':
               this.dx = -1;
               break;
            case 'd':
            case 'D':
               this.dx = 1;
               break;
            case "Shift":
               this.shiftPressed = 1;
               break;
         }
      }
   },

   // Handle key release
   keyRelease : function(key) {
      switch (key)
      {
         case 'w':
         case 'W':
            this.dz = 0;
            break;
         case 's':
         case 'S':
            this.dz = 0;
            break;
         case 'a':
         case 'A':
            this.dx = 0;
            break;
         case 'd':
         case 'D':
            this.dx = 0;
            break;
         case "Shift":
            this.shiftPressed = 0;
            break;
      }
   },

   // Handle mouse movement
   move : function(x, y) {
      if (this.active) {
         const mouseX_Sensitivity = 0.0015;
         const mouseY_Sensitivity = 0.0015;

         this.yaw += mouseX_Sensitivity * x;
         this.pitch += mouseY_Sensitivity * y;

         // Clamp the pitch
         this.pitch = Math.min(Math.max(this.pitch, -Math.PI/2+0.1), Math.PI/2-0.1);
      }
   }
};

