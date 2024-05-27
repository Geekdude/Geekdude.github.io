"use strict";
// Code obtained from https://github.com/tiansijie/ObjLoader
function ObjLoader() {

  this.vertices = [];
  this.normals = [];
  this.textureCoords = [];
  this.faces = [];
  this.facesMaterialsIndex = [{materialName: null, materialStartIndex: 0}];
  this.materials = {};

}

ObjLoader.prototype.load = function(objFilePath, mtlFilePath, callback) {

   var self = this;

  if(typeof mtlFilePath === "function") {
    callback = mtlFilePath;
    mtlFilePath = "";
  }

  fetch(objFilePath).then(function(response) {
     return response.text();
  }).then(function(objData) {
      // Read the obj file by lines
      var lines = objData.split( '\n' );
      var current_mat_name = "";
      for (var i = 0; i < lines.length; i++) {
         current_mat_name = self.parseObj(lines[i], current_mat_name);
      }

      // Read the .mtl file
      if(typeof mtlFilePath === "string" && mtlFilePath !== "") {
         fetch(mtlFilePath).then(function(response) {
            return response.text();
         }).then(function(mtlData) {
            var currentMat = {};
            var mtlLines = mtlData.split( '\n' );
            for (var i = 0; i < mtlLines.length; i++) {
               currentMat = self.parseMtl(mtlLines[i], currentMat);
            }
            if (currentMat.name) {
               self.materials[currentMat.name] = currentMat;
            }

            callback(
               {
                  vertices: self.vertices,
                  normals: self.normals,
                  textureCoords: self.textureCoords,
                  faces: self.faces,
                  facesMaterialsIndex: self.facesMaterialsIndex,
                  materials: self.materials
               }
            );

         });
      }
      else {
         /*Only Geometry*/
         callback(
            {
               vertices: self.vertices,
               normals: self.normals,
               textureCoords: self.textureCoords,
               faces: self.faces
            }
         );
      }
  });
}


ObjLoader.prototype.parseObj = function(line, current_mat_name) {
  /*Not include comment*/
  var commentStart = line.indexOf("#");
  if(commentStart != -1) {
    line = line.substring(0, commentStart);
  }
  line = line.trim();

  var splitedLine = line.split(/\s+/);

  if(splitedLine[0] === 'v') {
    var vertex = [Number(splitedLine[1]), Number(splitedLine[2]), Number(splitedLine[3]), splitedLine[4] ? Number(splitedLine[4]) : 1];
    this.vertices.push(vertex);
  }
  else if(splitedLine[0] === 'vt') {
    var textureCoord = [Number(splitedLine[1]), Number(splitedLine[2]), splitedLine[3] ? Number(splitedLine[3]) : 1]
    this.textureCoords.push(textureCoord);
  }
  else if(splitedLine[0] === 'vn') {
    var normal = [Number(splitedLine[1]), Number(splitedLine[2]), Number(splitedLine[3])];
    this.normals.push(normal);
  }
  else if(splitedLine[0] === 'f') {
    var face = {
      indices: [],
      texture: [],
      normal: [],
      material: current_mat_name
      };

    for(var i = 1; i < splitedLine.length; ++i) {
      var dIndex = splitedLine[i].indexOf('//');
      var splitedFaceIndices = splitedLine[i].split(/\W+/);

      if(dIndex > 0) {
        /*Vertex Normal Indices Without Texture Coordinate Indices*/
        face.indices.push(Number(splitedFaceIndices[0])-1);
        face.normal.push(Number(splitedFaceIndices[1])-1);
      }
      else {
        if(splitedFaceIndices.length === 1) {
          /*Vertex Indices*/
          face.indices.push(Number(splitedFaceIndices[0])-1);
        }
        else if(splitedFaceIndices.length === 2) {
          /*Vertex Texture Coordinate Indices*/
          face.indices.push(Number(splitedFaceIndices[0])-1);
          face.texture.push(Number(splitedFaceIndices[1])-1);
        }
        else if(splitedFaceIndices.length === 3) {
          /*Vertex Normal Indices*/
          face.indices.push(Number(splitedFaceIndices[0])-1);
          face.texture.push(Number(splitedFaceIndices[1])-1);
          face.normal.push(Number(splitedFaceIndices[2])-1);
        }
      }
    }

    this.faces.push(face);
  }
  else if(splitedLine[0] === "usemtl") {
     current_mat_name = splitedLine[1];
     if(this.faces.length === 0) {
        this.facesMaterialsIndex[0].materialName = splitedLine[1];
     }
     else {
        var materialName = splitedLine[1];
        var materialStartIndex = this.faces.length;

        this.facesMaterialsIndex.push({materialName: materialName, materialStartIndex: materialStartIndex});
     }
  }
  return current_mat_name;
}


ObjLoader.prototype.parseMtl = function(line, currentMat) {

  /*Not include comment*/
  var commentStart = line.indexOf("#");
  if(commentStart != -1) {
    line = line.substring(0, commentStart);
  }

  line = line.trim();
  var splitedLine = line.split(/\s+/);

  if(splitedLine[0] === "newmtl") {
    if(currentMat.name) {
      // this.materials.push(currentMat);
      this.materials[currentMat.name] = currentMat;
      currentMat = {};
    }
    currentMat.name = splitedLine[1];
  }
  else if(splitedLine[0] === "Ka") {
    currentMat.ambient = [];
    for(var i = 0; i < 3; ++i) {
      currentMat.ambient.push(splitedLine[i+1]);
    }
  }
  else if(splitedLine[0] === "Kd") {
    currentMat.diffuse = [];
    for(var i = 0; i < 3; ++i) {
      currentMat.diffuse.push(splitedLine[i+1]);
    }
  }
  else if(splitedLine[0] === "Ks") {
    currentMat.specular = [];
    for(var i = 0; i < 3; ++i) {
      currentMat.specular.push(splitedLine[i+1]);
    }
  }
  else if(splitedLine[0] === "Ns") {
    currentMat.specularExponent = splitedLine[1];
  }
  else if(splitedLine[0] === "d" || splitedLine[0] === "Tr") {
    currentMat.transparent = splitedLine[1];
  }
  else if(splitedLine[0] === "illum") {
    currentMat.illumMode = splitedLine[1];
  }
  else if(splitedLine[0] === "map_Ka") {
    currentMat.ambientMap = splitedLine[1];
  }
  else if(splitedLine[0] === "map_Kd") {
    currentMat.diffuseMap = splitedLine[1];
  }
  else if(splitedLine[0] === "map_Ks") {
    currentMat.specularMap = splitedLine[1];
  }
  else if(splitedLine[0] === "map_d") {
    currentMat.alphaMat = splitedLine[1];
  }
  else if(splitedLine[0] === "map_Bump" || splitedLine[0] === "bump") {
    currentMat.bumpMap = splitedLine[1];
  }
  else if(splitedLine[0] === "disp") {
    currentMat.displacementMap = splitedLine[1];
  }

  return currentMat;
}
