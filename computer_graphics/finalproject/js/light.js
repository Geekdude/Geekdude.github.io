"use strict";
// Light class
// Based off of http://voxelent.com/html/beginners-guide/chapter_6/ch6_Wall_LightArrays.html

function Light(name) {
   this.id = name
   this.position = [0.0, 0.0, 0.0];
   this.ambient = [0.0, 0.0, 0.0];
   this.diffuse = [0.0, 0.0, 0.0];
   this.specular = [0.0, 0.0, 0.0];
   this.enabled = false;
}

Light.prototype.setColorAndEnergy = function(color, energy) {
   var c = $V(color);
   this.ambient = c.x(energy).elements;
   this.diffuse = c.x(energy).elements;
   this.specular = [energy, energy, energy];
};

var Lights = {
   list: [],

   add: function(light) {
      if (!(light instanceof Light)) {
         alert('The parameter is not a light');
         return;
      }
      this.list.push(light);
   },

   getArray: function(type) {
      var a = [];
      for (var i = 0; i < 16; i++) {
         if (i < this.list.length) {
            a = a.concat(this.list[i][type]);
         }
         else {
            a = a.concat(this.getDefault[type]);
         }
      }
      return a;
   },

   get: function(idx){
      if ((typeof idx == 'number') && idx >= 0 && idx < this.list.length){
         return this.list[idx];
      }
      else if (typeof idx == 'string'){
         for(var i=0, max = this.list.length; i < max; i+=1){
            if (this.list[i].id == idx) return this.list[i];
         }
         throw 'Light ' + idx + ' does not exist';
      }
      else {
         throw 'Unknown parameter';
      }
   },

   getDefault: new Light
}
