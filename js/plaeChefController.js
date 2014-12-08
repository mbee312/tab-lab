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

      /* canvas for each main view */
      var topViewCanvas = document.getElementById('plae-chef-canvas-top');
      var tpcontext = topViewCanvas.getContext('2d');

      var leftProfileCanvas = document.getElementById('plae-chef-canvas-left');
      var lpcontext = leftProfileCanvas.getContext('2d');

      var rightProfileCanvas = document.getElementById('plae-chef-canvas-right');
      var rpcontext = rightProfileCanvas.getContext('2d');

      var pairViewCanvas = document.getElementById('plae-chef-canvas-pair');
      var pcontext = pairViewCanvas.getContext('2d');

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

    $http.get('product/shoeStyles_local.json').success(function(data) {
      $scope.shoeStyles = data;
    });
    $http.get('product/shoes_ty_local.json').success(function(data) {
      $scope.shoeList = data;
    });

    $http.get('product/tabs_local.json').success(function(data) {
      $scope.tabList = data;
    });

      $http.get('product/views.json').success(function(data) {
          $scope.mainViews = data;
      });

      // setup canvas
    canvas.width=1024;//horizontal resolution (?) - increase for better looking text
    canvas.height=512;//vertical resolution (?) - increase for better looking text
    canvas.style.width=512;//actual width of canvas
    canvas.style.height=512;//actual height of canvas

      topViewCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      topViewCanvas.height=512;//vertical resolution (?) - increase for better looking text
      topViewCanvas.style.width=512;//actual width of canvas
      topViewCanvas.style.height=512;//actual height of canvas

      leftProfileCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      leftProfileCanvas.height=512;//vertical resolution (?) - increase for better looking text
      leftProfileCanvas.style.width=512;//actual width of canvas
      leftProfileCanvas.style.height=512;//actual height of canvas

      rightProfileCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      rightProfileCanvas.height=512;//vertical resolution (?) - increase for better looking text
      rightProfileCanvas.style.width=512;//actual width of canvas
      rightProfileCanvas.style.height=512;//actual height of canvas

      pairViewCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      pairViewCanvas.height=512;//vertical resolution (?) - increase for better looking text
      pairViewCanvas.style.width=512;//actual width of canvas
      pairViewCanvas.style.height=512;//actual height of canvas

      this.makeTabsCanvas = function(imageUrl, view)
      {
          this.clearImage();
          context.fillStyle="#FFFFFF";
          context.fillRect(0,0,canvas.width,100);

          var image = new Image();
          image.src = imageUrl;

          switch (view){
              case "top":
                  break;
              case "left":
                  break;
              case "right":
                  break;
              case "pair":
                  break;
              default:
                  break;

          }
      }; //end makeTabsCanvas

      /*                                 */
      /* helper function to clear canvas */
      /*                                 */

      this.clearImage = function(c, ctx) {

          // Store the current transformation matrix
          ctx.save();

          // Use the identity matrix while clearing the canvas
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, c.width, c.height);


          // Restore the transform
          ctx.restore();
      } // end clearImage

      this.setShoe = function(shoe,event) {
          console.log($scope.shoeSelected.pop() + " was removed as selected style");
          $scope.shoeSelected.push(shoe);
          console.log(shoe.name + " style selected");
          console.log($scope.shoeSelected)

          this.setViews();


      };

      this.setViews = function(){
          console.log("inside setViews");
          this.drawDefaultViewImage();
          this.drawTopViewImage();
          this.drawLeftProfileViewImage();
          this.drawRightProfileViewImage();


      } //end setViews

      this.drawDefaultViewImage = function (){
          this.clearImage(canvas,context );
          context.fillStyle="#FFFFFF";
          context.fillRect(0,0,canvas.width,100);
          var base_image = new Image();
          base_image.src = $scope.shoeSelected[0]["mainViewDefault"];
          context.drawImage(base_image, 150, 60,800,409);
          console.log("drawDefaultImage set!");
      }

      this.drawTopViewImage = function (){
          this.clearImage(topViewCanvas,tpcontext );
          tpcontext.fillStyle="#FFFFFF";
          tpcontext.fillRect(0,0,topViewCanvas.width,100);
          var right_image = new Image();
          right_image.src = $scope.shoeSelected[0]["mainViewTopRight"];
          tpcontext.drawImage(right_image, 520, 0, 250, 489);
          var left_image = new Image();
          left_image.src = $scope.shoeSelected[0]["mainViewTopLeft"];
          tpcontext.drawImage(left_image, 300, 0, 250, 489);
          console.log("drawTopViewImage set!");
      }

      this.drawLeftProfileViewImage = function (){
          this.clearImage(leftProfileCanvas,lpcontext );
          lpcontext.fillStyle="#FFFFFF";
          lpcontext.fillRect(0,0,leftProfileCanvas.width,100);
          var base_image = new Image();
          base_image.src = $scope.shoeSelected[0]["mainViewLeftProfileNoTab"];
          lpcontext.drawImage(base_image, 170, 110);
          console.log("drawLeftProfileImage set!");
      }

      this.drawRightProfileViewImage = function (){
          this.clearImage(rightProfileCanvas,rpcontext );
          rpcontext.fillStyle="#FFFFFF";
          rpcontext.fillRect(0,0,rightProfileCanvas.width,100);
          var base_image = new Image();
          base_image.src = $scope.shoeSelected[0]["mainViewRightProfileNoTab"];
          rpcontext.drawImage(base_image, 170, 110);
          console.log("drawRightProfileImage set!");
      }

      /**                                       **/
      /*      Logic to set viewable canvas       */
      /**                                       **/
      this.canvasView = "default";

      this.isCanvasSet = function(checkCanvas) {
          return this.canvasView === checkCanvas;
      };

      this.setCanvas = function(setCanvas) {
          this.canvasView = setCanvas;
      };

      /* end canvas view logic code */

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
            base_image.src = $scope.shoeSelected[0]["mainViewLeftProfileNoTab"];

            context.drawImage(base_image, 170, 110);
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
              var topDegree = 65;
              var topTabSel = '.tab.large.top.ng-scope';
              $(topTabSel).css({ WebkitTransform: 'rotate(' + topDegree + 'deg)'});
              $(topTabSel).css({ '-moz-transform': 'rotate(' + topDegree + 'deg)'});
              $(topTabSel).css({left: "976px"});
              $(topTabSel).css({top: "674px"});

          });
      }; //end moveTabTop

      this.moveTabBottom = function(){
          $(document).ready(function ($) {

                  var bottomDegree = 69;
                  var bottomTabSel = '.tab.large.bottom.ng-scope';
                  $(bottomTabSel).css({WebkitTransform: 'rotate(' + bottomDegree + 'deg)'});
                  $(bottomTabSel).css({'-moz-transform': 'rotate(' + bottomDegree + 'deg)'});
                  $(bottomTabSel).css({left: "884px"});
                  $(bottomTabSel).css({top: "565px"});

          });
      }; //end moveTabBottom


      this.isShoeSelected = function (){
          return $scope.shoeSelected.length > 0;
      };

      this.isTabSelected = function (){
          return $scope.tabs.length > 0;
      };


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
          /*    this.stylestab = newValue;
        this.slideTab(newValue); */
          this.stylestab = "ty";
      };

      this.isSet = function(tabName){
          return this.stylestab === tabName;

      };

      /* slide not used for demo version */
      /* only Ty style is shown          */
/*
      this.slideTab = function(newValue){
          $(document).ready(function ($) {

              switch(newValue){
                  case "emme":
                      $('#colors-emme').animate({left: "+=1200px"}, 1000, function () {
                          $('#colors-emme').siblings().removeAttr('style');
                      });
                      break;
                  case "ty":
                      $('#colors-ty').animate({left: "-=1200px"}, 1000, function () {
                          $('#colors-ty').siblings().removeAttr('style');
                      });
                      break;
                  case "roan":
                      $('#colors-roan').animate({left: "+=1200px"}, 1000, function () {
                          $('#colors-roan').siblings().removeAttr('style');
                      });
                      break;
                  case "max":
                      $('#colors-max').animate({left: "-=1200px"}, 1000, function () {
                          $('#colors-max').siblings().removeAttr('style');
                      });
                      break;


              }
          });
      }; //end slideTab
      */



  });

})();

