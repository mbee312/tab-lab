(function() {
  'use strict';

  // Declare app level module which depends on views, and components
  var plaeChefApp = angular.module('plaeChefApp', ['ngAnimate','ngDragDrop']);


  plaeChefApp.controller('PlaeChefController', ['$scope', '$http', function($scope, $http){
      $scope.list1 = [];
      $scope.list2 = [];
      $scope.list3 = [];
      $scope.list4 = [];

      /* canvas for each main view */

      var canvas = document.getElementById('plae-chef-canvas');
      var context = canvas.getContext('2d');


      var topViewCanvas = document.getElementById('plae-chef-canvas-top');
      var tpcontext = topViewCanvas.getContext('2d');

      var topViewTabCanvas = document.getElementById('plae-chef-canvas-tab-top');
      var tptabcontext = topViewTabCanvas.getContext('2d');

      var leftProfileCanvas = document.getElementById('plae-chef-canvas-left');
      var lpcontext = leftProfileCanvas.getContext('2d');

      var leftProfileTabCanvas = document.getElementById('plae-chef-canvas-tab-left');
      var lptabcontext = leftProfileTabCanvas.getContext('2d');

      var rightProfileCanvas = document.getElementById('plae-chef-canvas-right');
      var rpcontext = rightProfileCanvas.getContext('2d');

      var rightProfileTabCanvas = document.getElementById('plae-chef-canvas-tab-right');
      var rptabcontext = rightProfileTabCanvas.getContext('2d');

      var pairViewCanvas = document.getElementById('plae-chef-canvas-pair');
      var pcontext = pairViewCanvas.getContext('2d');

      var pairViewTabCanvas = document.getElementById('plae-chef-canvas-tab-pair');
      var ptabcontext = pairViewTabCanvas.getContext('2d');

      // setup canvas
    canvas.width=1024;//horizontal resolution (?) - increase for better looking text
    canvas.height=512;//vertical resolution (?) - increase for better looking text
    canvas.style.width=512;//actual width of canvas
    canvas.style.height=512;//actual height of canvas

      topViewCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      topViewCanvas.height=512;//vertical resolution (?) - increase for better looking text
      topViewCanvas.style.width=512;//actual width of canvas
      topViewCanvas.style.height=512;//actual height of canvas

      topViewTabCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      topViewTabCanvas.height=512;//vertical resolution (?) - increase for better looking text
      topViewTabCanvas.style.width=512;//actual width of canvas
      topViewTabCanvas.style.height=512;//actual height of canvas

      leftProfileCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      leftProfileCanvas.height=512;//vertical resolution (?) - increase for better looking text
      leftProfileCanvas.style.width=512;//actual width of canvas
      leftProfileCanvas.style.height=512;//actual height of canvas

      leftProfileTabCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      leftProfileTabCanvas.height=512;//vertical resolution (?) - increase for better looking text
      leftProfileTabCanvas.style.width=512;//actual width of canvas
      leftProfileTabCanvas.style.height=512;//actual height of canvas

      rightProfileCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      rightProfileCanvas.height=512;//vertical resolution (?) - increase for better looking text
      rightProfileCanvas.style.width=512;//actual width of canvas
      rightProfileCanvas.style.height=512;//actual height of canvas

      rightProfileTabCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      rightProfileTabCanvas.height=512;//vertical resolution (?) - increase for better looking text
      rightProfileTabCanvas.style.width=512;//actual width of canvas
      rightProfileTabCanvas.style.height=512;//actual height of canvas

      pairViewCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      pairViewCanvas.height=512;//vertical resolution (?) - increase for better looking text
      pairViewCanvas.style.width=512;//actual width of canvas
      pairViewCanvas.style.height=512;//actual height of canvas

      pairViewTabCanvas.width=1024;//horizontal resolution (?) - increase for better looking text
      pairViewTabCanvas.height=512;//vertical resolution (?) - increase for better looking text
      pairViewTabCanvas.style.width=512;//actual width of canvas
      pairViewTabCanvas.style.height=512;//actual height of canvas

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
      };
      $scope.hideMeLB = function() {
          return $scope.tabLB.length > 0;
      };

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
      }; // end clearImage

      this.setShoe = function(shoe,event) {
          console.log($scope.shoeSelected.pop() + " was removed as selected style");
          $scope.shoeSelected.push(shoe);
          console.log(shoe.name + " style selected");
          console.log($scope.shoeSelected);

          this.setViews();


      }; //end setShoe()

      // Add a Item to the list
      this.addTab = function (tab, event) {
          $scope.tabs.push(tab);
          $scope.tabLT.pop();
          $scope.tabLB.pop();
          $scope.tabLT.push(tab);
          $scope.tabLB.push(tab);
          if($scope.shoeSelected.length>0){
              this.setViews();
          }
          this.setTabViews();
      }; //end addTab()

      this.setViews = function(){
          console.log("inside setViews");
          this.drawDefaultViewImage();
          this.drawTopViewImage();
          this.drawLeftProfileViewImage();
          this.drawRightProfileViewImage();


      }; //end setViews

      this.setTabViews = function(){
          console.log("inside setTabViews");
      /*    this.drawDefaultViewImage(); */
      /*    this.drawTopViewImage(); */
          this.drawLeftTabsProfileViewImage();
          this.drawRightTabsProfileViewImage();


      }; //end setViews

      this.drawDefaultViewImage = function (){
          this.clearImage(canvas,context );
          context.fillStyle="#FFFFFF";
          context.fillRect(0,0,canvas.width,100);
          var base_image = new Image();
          if (this.isTabSelected()) {
              base_image.src = $scope.shoeSelected[0]["mainViewDefault"];
              context.drawImage(base_image, 150, 60, 800, 409);
              console.log("drawDefaultImage set!");
          }else{
              base_image.src = $scope.shoeSelected[0]["mainViewDefault"];
              context.drawImage(base_image, 150, 60, 800, 409);
              console.log("drawDefaultImage set!");
          }//end if-else
      }; //end drawDefaultViewImage

      this.drawTopViewImage = function (){
          this.clearImage(topViewCanvas,tpcontext );
          tpcontext.fillStyle="#FFFFFF";
          tpcontext.fillRect(75,0,topViewCanvas.width-150,150);
          var right_image = new Image();
          right_image.src = $scope.shoeSelected[0]["mainViewTopRight"];
          tpcontext.drawImage(right_image, 520, 0, 240, 469);
          var left_image = new Image();
          left_image.src = $scope.shoeSelected[0]["mainViewTopLeft"];
          tpcontext.drawImage(left_image, 300, 0, 240, 469);
          console.log("drawTopViewImage set!");
      };// end drawTopViewImage

      this.drawLeftProfileViewImage = function (){
          this.clearImage(leftProfileCanvas,lpcontext );
          lpcontext.translate(0,0);
          lpcontext.fillStyle="#FFFFFF";
          lpcontext.fillRect(75,0,leftProfileCanvas.width-150,150);
          var base_image = new Image();
          if (this.isTabSelected()) {
              base_image.src = $scope.shoeSelected[0]["mainViewLeftProfileNoTab"];
              lpcontext.drawImage(base_image, 210, 110, 600, 307);
              console.log("drawLeftProfileImage mainViewLeftProfileNoTab set!");
          }else{
              base_image.src = $scope.shoeSelected[0]["mainViewLeftProfile"];
              lpcontext.drawImage(base_image, 210, 110, 600, 307);
              console.log("drawLeftProfileImage mainViewLeftProfile set!");
          }// end if-else
      };// end drawLeftProfileViewImage

      this.drawRightProfileViewImage = function (){
          this.clearImage(rightProfileCanvas,rpcontext );
          rpcontext.translate(0,0);
          rpcontext.fillStyle="#FFFFFF";
          rpcontext.fillRect(75,0,rightProfileCanvas.width-150,150);
          var base_image = new Image();
          if (this.isTabSelected()) {
              base_image.src = $scope.shoeSelected[0]["mainViewRightProfileNoTab"];
              rpcontext.drawImage(base_image, 240, 110, 600, 307);
              console.log("drawRightProfileImage mainViewRightProfileNoTab set!");
          }else{
              base_image.src = $scope.shoeSelected[0]["mainViewRightProfile"];
              rpcontext.drawImage(base_image, 240, 110, 600, 307);
              console.log("drawRightProfileImage mainViewRightProfile set!");
          }// end if-else
      }; //end drawRightProfileViewImage

      this.drawLeftTabsProfileViewImage = function (){
          this.clearImage(leftProfileTabCanvas,lptabcontext );

          var tab_image = new Image();
          var tabWidth = 275;
          var tabHeight = 75;

          var topXOffset = $scope.shoeSelected[0]["topXOffsetL"];
          var topYOffset = $scope.shoeSelected[0]["topYOffsetL"];
          var topRotation = $scope.shoeSelected[0]["topRotationL"];

          var botXOffset = $scope.shoeSelected[0]["botXOffsetL"];
          var botYOffset = $scope.shoeSelected[0]["botYOffsetL"];
          var botRotation = $scope.shoeSelected[0]["botRotationL"];

          tab_image.src = $scope.tabLT[0]["tabOneImg"];
          this.drawRotated(topRotation,leftProfileTabCanvas,lptabcontext,tab_image, topXOffset, topYOffset, tabWidth, tabHeight);
          console.log("drawLeftTabProfileImage top is set!");

          tab_image.src = $scope.tabLT[0]["tabTwoImg"];
          this.drawRotated(botRotation,leftProfileTabCanvas,lptabcontext,tab_image, botXOffset, botYOffset, tabWidth, tabHeight);
          console.log("drawLeftTabProfileImage bottom is set!");
      }; // end drawLeftTabsProfileViewImage


      this.drawRightTabsProfileViewImage = function (){
          this.clearImage(rightProfileTabCanvas,rptabcontext );
          var tab_image = new Image();
          var tabWidth = 275;
          var tabHeight = 75;

          var topXOffset = $scope.shoeSelected[0]["topXOffsetR"];
          var topYOffset = $scope.shoeSelected[0]["topYOffsetR"];
          var topRotation = $scope.shoeSelected[0]["topRotationR"];

          var botXOffset = $scope.shoeSelected[0]["botXOffsetR"];
          var botYOffset = $scope.shoeSelected[0]["botYOffsetR"];
          var botRotation = $scope.shoeSelected[0]["botRotationR"];

          tab_image.src = $scope.tabLT[0]["tabOneImg"];
          this.drawRotated(topRotation,rightProfileTabCanvas,rptabcontext,tab_image, topXOffset, topYOffset, tabWidth, tabHeight);
          console.log("drawRightTabProfileImage top is set!");

          tab_image.src = $scope.tabLT[0]["tabTwoImg"];
          this.drawRotated(botRotation,rightProfileTabCanvas,rptabcontext,tab_image, botXOffset, botYOffset, tabWidth, tabHeight);
          console.log("drawRightTabProfileImage bottom is set!");
      }; // end drawRightTabsProfileViewImage


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

      this.clearSelections = function (){
          if($scope.shoeSelected.length > 0)
          {
              console.log("popped " + $scope.shoeSelected.pop().name);
          }
          while($scope.tabs.length > 0 ){
              console.log("popped " + $scope.tabs.pop().name + " from tabs");
          }
          this.clearImage(canvas,context );
          this.clearImage(topViewCanvas,tpcontext );
          this.clearImage(leftProfileCanvas,lpcontext );
          this.clearImage(rightProfileCanvas,rpcontext );
          this.canvasView = "default";

      };

      this.drawRotated = function(degrees, cnvs, ctx, image, xOffset, yOffset, tabWidth, tabHeight){

          // save the unrotated context of the canvas so we can restore it later
          // the alternative is to untranslate & unrotate after drawing
          ctx.save();

          // move to the center of the canvas
       //   ctx.translate(cnvs.width/2,cnvs.height/2);
          ctx.translate(xOffset,yOffset);

          // rotate the canvas to the specified degrees
          ctx.rotate(degrees*Math.PI/180);

          // draw the image
          // since the context is rotated, the image will be rotated also
          ctx.drawImage(image,-image.width/2,-image.width/2,tabWidth,tabHeight);

          // we’re done with the rotating so restore the unrotated context
          ctx.restore();
      }; //end drawRotated()

      this.isShoeSelected = function (){
          return $scope.shoeSelected.length > 0;
      };

      this.isTabSelected = function (){
          console.log($scope.tabs.length > 0);
          return $scope.tabs.length > 0;
      };

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

