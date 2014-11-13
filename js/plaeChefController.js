(function() {
  'use strict';

  // Declare app level module which depends on views, and components
  var plaeChefApp = angular.module('plaeChefApp', ["ngAnimate"]);


  plaeChefApp.controller('PlaeChefController', ['$scope', '$http', function($scope, $http){
    var canvas = document.getElementById('plae-chef-canvas');
    var context = canvas.getContext('2d');

    $http.get('product/shoeStyles.json').success(function(data) {
      $scope.shoesStyles = data;
    });
    $http.get('product/shoes.json').success(function(data) {
      $scope.shoeList = data;
    });

    $http.get('product/tabs.json').success(function(data) {
      $scope.tabList = data;
    }); 
    
    // setup canvas
    canvas.width=727;//horizontal resolution (?) - increase for better looking text
    canvas.height=512;//vertical resolution (?) - increase for better looking text
    canvas.style.width=512;//actual width of canvas
    canvas.style.height=512;//actual height of canvas

    this.makeBaseImage = function(imageUrl, specialSize)
    {

      // Store the current transformation matrix
      context.save();

      // Use the identity matrix while clearing the canvas
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Restore the transform
      context.restore();

      console.log("im in the makeBaseImage function");
      var base_image = new Image();
      base_image.src = imageUrl;
      if(specialSize === 0){
        context.drawImage(base_image, 40, 100);
      }else{ //draw camille to fit window
        context.drawImage(base_image, 40, 100, 400,400);
      }
    }; //end makeBaseImage

    console.log("testing!");

  }]);

  plaeChefApp.controller('StylesTabController', function(){
    this.stylestab = '';
    this.setTab = function(newValue){
      this.stylestab = newValue;
    };

    this.isSet = function(tabName){
      return this.stylestab === tabName;
    };

  });
  

})();

