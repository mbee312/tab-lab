(function() {
  'use strict';

  // Declare app level module which depends on views, and components
  var plaeChefApp = angular.module('plaeChefApp', ['ngDragDrop']);


  plaeChefApp.controller('PlaeChefController', ['$scope', '$http', function($scope, $http){
      $scope.list1 = [];
      $scope.list2 = [];
      $scope.list3 = [];
      $scope.list4 = [];
      var canvas = document.getElementById('plae-chef-canvas');
    var context = canvas.getContext('2d');


    // Tabs on canvas List Arrays
    $scope.tabs = [];
      $scope.tabsTop=[];
      $scope.tabsBottom=[];
      $scope.tabLT =[];
      $scope.tabLB = [];

      $scope.shoeSelected = [];
      $scope.basket =[];

      $scope.hideMeLT = function() {
          return $scope.tabLT.length > 0;
      }
      $scope.hideMeLB = function() {
          return $scope.tabLB.length > 0;
      }

      $scope.currentView;

    $http.get('product/shoeStyles.json').success(function(data) {
      $scope.shoeStyles = data;
    });
    $http.get('product/shoes.json').success(function(data) {
      $scope.shoeList = data;
    });

    $http.get('product/tabs.json').success(function(data) {
      $scope.tabList = data;
    }); 
    
    // setup canvas
    canvas.width=767;//horizontal resolution (?) - increase for better looking text
    canvas.height=512;//vertical resolution (?) - increase for better looking text
    canvas.style.width=512;//actual width of canvas
    canvas.style.height=512;//actual height of canvas


    this.makeBaseImage = function(imageUrl, specialSize)
    {
        this.clearImage();
        context.fillStyle="#FFFFFF";
        context.fillRect(0,0,canvas.width,100);

      var base_image = new Image();
      base_image.src = imageUrl;
      if(specialSize === 0){
        context.drawImage(base_image, 50, 60);
      }else{ //draw camille to fit window
        context.drawImage(base_image, 40, 100, 400,400);
      }
    }; //end makeBaseImage

      this.clearImage = function() {
          // Store the current transformation matrix
          context.save();

          // Use the identity matrix while clearing the canvas
          context.setTransform(1, 0, 0, 1, 0, 0);
          context.clearRect(0, 0, canvas.width, canvas.height);


          // Restore the transform
          context.restore();
      }

      this.setShoe = function(shoe,event) {
          console.log($scope.shoeSelected.pop() + " was removed as selected style");
          $scope.shoeSelected.push(shoe);
          console.log(shoe.name + " style selected");
          console.log($scope.shoeSelected)

          if(shoe.name === 'camille'){
              this.makeBaseImage(shoe.mainViewDefault, 1);
          }else{
              this.makeBaseImage(shoe.mainViewDefault, 0);
          }

      };
/*
      this.redrawMainWithTabs = function(imageUrl, specialSize)
      {

          // Store the current transformation matrix
          context.save();

          var base_image = new Image();
          base_image.src = imageUrl;
          if(specialSize === 0){
              context.drawImage(base_image, 40, 100);
          }else{ //draw camille to fit window
              context.drawImage(base_image, 40, 100, 400,400);
          }
      }; //end makeBaseImage
*/
        // Add a Item to the list
    this.addTab = function (tab, event) {
        $scope.tabs.push(tab);
        $scope.tabLT.pop();
        $scope.tabLB.pop();
        $scope.tabLT.push(tab);
        $scope.tabLB.push(tab);
        this.resetTabsPos();
        this.moveTabTop();
        this.moveTabBottom();

        // Store the current transformation matrix
        context.save();

        // Use the identity matrix while clearing the canvas
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        context.restore();
        console.log($scope.shoeSelected);

        if($scope.shoeSelected.length > 0) {
            var base_image = new Image();
            console.log("I'm in!");
            base_image.src = $scope.shoeSelected[0]["mainViewLeftProfileNoTab"];

            context.drawImage(base_image, 50, 60);
        }

    };

      this.resetTabsPos = function(){
          $(document).ready(function ($) {
           /*   $('.tab.large.top.ng-scope').animate({left: "-=300px"}, 100, function() {
                  $('.tab.large.top.ng-scope').removeAttr('style'); });
              $('.tab.large.bottom.ng-scope').animate({left: "-=300px"}, 100, function() {
                  $('.tab.large.bottom.ng-scope').removeAttr('style'); }); */
          });
      }; //end resetTabsPos

      this.moveTabTop = function(){
          $(document).ready(function ($) {
              var topDegree = 64;
              var topTabSel = '.tab.large.top.ng-scope';
              $(topTabSel).css({ WebkitTransform: 'rotate(' + topDegree + 'deg)'});
              $(topTabSel).css({ '-moz-transform': 'rotate(' + topDegree + 'deg)'});
              $(topTabSel).css({left: "922px"});
              $(topTabSel).css({top: "44px"});

          });
      }; //end moveTabTop

      this.moveTabBottom = function(){
          $(document).ready(function ($) {

                  var bottomDegree = 69;
                  var bottomTabSel = '.tab.large.bottom.ng-scope';
                  $(bottomTabSel).css({WebkitTransform: 'rotate(' + bottomDegree + 'deg)'});
                  $(bottomTabSel).css({'-moz-transform': 'rotate(' + bottomDegree + 'deg)'});
                  $(bottomTabSel).css({left: "830px"});
                  $(bottomTabSel).css({top: "-60px"});

          });
      }; //end moveTabBottom

/*
  var TO_RADIANS = Math.PI/180;
  this.drawRotatedImage = function (imageURL, x, y, angle) {

      // save the current co-ordinate system
      // before we screw with it
      context.save();

      // move to the middle of where we want to draw our image
      context.translate(x, y);

      // rotate around that point, converting our
      // angle from degrees to radians
      context.rotate(angle * TO_RADIANS);

      // draw it up and to the left by half the width
      // and height of the image
      var image = new Image();
      image.src = imageUrl;
      context.drawImage(image, -(image.width/2), -(image.height/2));

      // and restore the co-ords to how they were when we began
      context.restore();
  };

      $scope.startCallback = function(event, ui) {

      };
 */

      $scope.tabDropCallback = function() {
          // Store the current transformation matrix
          context.save();

          // Use the identity matrix while clearing the canvas
          context.setTransform(1, 0, 0, 1, 0, 0);
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Restore the transform
          context.restore();

          var base_image = new Image();
          base_image.src = this.shoeSelected[0]["mainViewLeftProfileNoTab"];

          context.drawImage(base_image, 50, 60);

          var tabImage = new Image();

          context.drawImage(tabImage, 50, 60);



      }


  }]);


  plaeChefApp.controller('StylesTabController', function($scope){
      this.stylestab='';
      this.setTab = function(newValue){
          this.stylestab = newValue;
      };

      this.isSet = function(tabName){
          return this.stylestab === tabName;

      };


  });

})();

