(function() {
  'use strict';

  // Declare app level module which depends on views, and components
  var plaeChefApp = angular.module('plaeChefApp', ['ngAnimate','ngDragDrop', 'ngTouch', 'ngMaterial', 'ui.bootstrap', 'angular-carousel', 'slick']);


  plaeChefApp.controller('PlaeChefController', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog){

      /* canvas for each main view */
/*
      var canvas = document.getElementById('plae-chef-canvas');
      var context = canvas.getContext('2d'); */


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

      /*
      var pairViewCanvas = document.getElementById('plae-chef-canvas-pair');
      var pcontext = pairViewCanvas.getContext('2d');

      var pairViewTabCanvas = document.getElementById('plae-chef-canvas-tab-pair');
      var ptabcontext = pairViewTabCanvas.getContext('2d'); */

      // setup canvas
  /*  canvas.width=1014;//horizontal resolution (?) - increase for better looking text
    canvas.height=512;//vertical resolution (?) - increase for better looking text
    canvas.style.width=512;//actual width of canvas
    canvas.style.height=512;//actual height of canvas
      */

      topViewCanvas.width=610;//horizontal resolution (?) - increase for better looking text
      topViewCanvas.height=512;//vertical resolution (?) - increase for better looking text
      topViewCanvas.style.width=512;//actual width of canvas
      topViewCanvas.style.height=512;//actual height of canvas

      topViewTabCanvas.width=610;//horizontal resolution (?) - increase for better looking text
      topViewTabCanvas.height=512;//vertical resolution (?) - increase for better looking text
      topViewTabCanvas.style.width=512;//actual width of canvas
      topViewTabCanvas.style.height=512;//actual height of canvas

      leftProfileCanvas.width=610;//horizontal resolution (?) - increase for better looking text
      leftProfileCanvas.height=512;//vertical resolution (?) - increase for better looking text
      leftProfileCanvas.style.width=512;//actual width of canvas
      leftProfileCanvas.style.height=512;//actual height of canvas

      leftProfileTabCanvas.width=610;//horizontal resolution (?) - increase for better looking text
      leftProfileTabCanvas.height=512;//vertical resolution (?) - increase for better looking text
      leftProfileTabCanvas.style.width=512;//actual width of canvas
      leftProfileTabCanvas.style.height=512;//actual height of canvas

      rightProfileCanvas.width=610;//horizontal resolution (?) - increase for better looking text
      rightProfileCanvas.height=512;//vertical resolution (?) - increase for better looking text
      rightProfileCanvas.style.width=512;//actual width of canvas
      rightProfileCanvas.style.height=512;//actual height of canvas

      rightProfileTabCanvas.width=610;//horizontal resolution (?) - increase for better looking text
      rightProfileTabCanvas.height=512;//vertical resolution (?) - increase for better looking text
      rightProfileTabCanvas.style.width=512;//actual width of canvas
      rightProfileTabCanvas.style.height=512;//actual height of canvas

      /*
      pairViewCanvas.width=1014;//horizontal resolution (?) - increase for better looking text
      pairViewCanvas.height=512;//vertical resolution (?) - increase for better looking text
      pairViewCanvas.style.width=512;//actual width of canvas
      pairViewCanvas.style.height=512;//actual height of canvas

      pairViewTabCanvas.width=1014;//horizontal resolution (?) - increase for better looking text
      pairViewTabCanvas.height=512;//vertical resolution (?) - increase for better looking text
      pairViewTabCanvas.style.width=512;//actual width of canvas
      pairViewTabCanvas.style.height=512;//actual height of canvas

      */

      // Tabs on canvas List Arrays
      $scope.tabs = [];
      $scope.tabsTop=[];
      $scope.tabsBottom=[];
      $scope.tabLeft =[];
      $scope.tabRight = [];

      $scope.shoeSelected = [];
      $scope.size = "8 kids";
      $scope.fit = {};
      $scope.fit.autoselect = true;

      $scope.basket =[];
      $scope.subTotal = 0;
      $scope.editMode = false;

      $scope.carouselIndex = 5;

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

      this.clearImage = function(c, ctx, side) {

          // Store the current transformation matrix
          ctx.save();

          if(side == "left"){
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.clearRect(0, 0, c.width/2, c.height);
              console.log("clear left tab");
          }else if(side=="right"){
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.clearRect(c.width/2, 0, c.width/2, c.height);
          } else{
              // Use the identity matrix while clearing the canvas
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.clearRect(0, 0, c.width, c.height);
          }//end if-else


          // Restore the transform
          ctx.restore();
      }; // end clearImage

      this.setShoe = function(shoe,event) {

          while($scope.shoeSelected.length > 0){
              $scope.subTotal -= $scope.shoeSelected[0].price;
              console.log($scope.shoeSelected.pop() + " was removed as selected style");
          }
          $scope.shoeSelected.push(shoe);
          console.log(shoe.name + " style selected");
          console.log("the price is " + $scope.shoeSelected[0].price);
          $scope.subTotal += $scope.shoeSelected[0].price;

          this.setViews();
          if($scope.tabLeft.length>0){
              this.setTabViews("left");
          }//end if
          if($scope.tabRight.length>0){
              this.setTabViews("right");
          }//end if


      }; //end setShoe()

      // Add a Item to the list
      this.addTab = function (tab, side, event) {
          $scope.tabs.push(tab);
          switch (side){
              case "left":
                  if($scope.tabLeft.length > 0){
                      $scope.subTotal -= $scope.tabLeft[0].price;
                      $scope.tabLeft.pop();
                      console.log("tabLeft.pop()");
                      console.log($scope.subTotal);
                  }
                  $scope.tabLeft.push(tab);
                  $scope.subTotal += $scope.tabLeft[0].price;
                  console.log("the tab price is " + $scope.tabLeft[0].price);

                  break;
              case "right":
                  if($scope.tabRight.length > 0){
                      $scope.subTotal -= $scope.tabRight[0].price;
                      $scope.tabRight.pop();
                      console.log("tabRight.pop()");
                  }
                  $scope.tabRight.push(tab);
                  $scope.subTotal += $scope.tabRight[0].price;
                  console.log("the tab price is " + $scope.tabRight[0].price);

                  break;
              default :
                  console.log("error: no tab side selected in addTab()");
          }// end switch

          if($scope.shoeSelected.length>0){
              this.setViews();
              this.setTabViews(side);
          }else{
              console.log("no shoe selected");
          }// end-if

      }; //end addTab()

      this.remove = function (side){
          switch (side){
              case "left":
                  $scope.subTotal -= $scope.tabLeft[0].price;
                  console.log("popped " + $scope.tabLeft.pop().name + " from tabLeft");
                  this.clearImage(leftProfileTabCanvas,lptabcontext );
                  this.clearImage(leftProfileCanvas,lpcontext );
                  this.clearImage(topViewTabCanvas,tptabcontext, side );
                  this.clearImage(topViewCanvas,tpcontext, side );
                  this.setViews(side);
                  break;
              case "right":
                  $scope.subTotal -= $scope.tabRight[0].price;
                  console.log("popped " + $scope.tabRight.pop().name + " from tabRight");
                  this.clearImage(rightProfileTabCanvas,rptabcontext );
                  this.clearImage(rightProfileCanvas,rpcontext );
                  this.clearImage(topViewTabCanvas,tptabcontext, side );
                  this.clearImage(topViewCanvas,tpcontext, side );
                  this.setViews(side);
                  break;
              case "shoe":
                  $scope.subTotal -= $scope.shoeSelected[0].price;
                  console.log("popped " + $scope.shoeSelected.pop().name + " from shoeSelected");
                  this.clearImage(rightProfileTabCanvas,rptabcontext );
                  this.clearImage(rightProfileCanvas,rpcontext );
                  this.clearImage(leftProfileTabCanvas,lptabcontext );
                  this.clearImage(leftProfileCanvas,lpcontext );
                  this.clearImage(topViewTabCanvas,tptabcontext, side );
                  this.clearImage(topViewTabCanvas,tptabcontext, side );
                  this.clearImage(topViewCanvas,tpcontext, side );
                  break;
              default:
                  console.log("no tabs removed");
          }
      };

      this.setViews = function(side){
          if(side == "left"){
              console.log("inside left setviews()");
              this.drawTopViewImage(side);
              this.drawLeftProfileViewImage();
          }else if(side == "right"){
              console.log("inside right setviews()");
              this.drawTopViewImage(side);
              this.drawRightProfileViewImage();
          }else{
              console.log("inside else setviews()");
              this.drawTopViewImage();
              this.drawLeftProfileViewImage();
              this.drawRightProfileViewImage();
          }//end else-if
      }; //end setViews

      this.setTabViews = function(side){
          this.drawTopTabsViewImage(side);
          switch(side) {
              case "left":
                  console.log("drawing left side");
                  this.drawLeftTabsProfileViewImage();
                  break;
              case "right":
                  console.log("drawing right side");
                this.drawRightTabsProfileViewImage();
                  break;
              default:
                  console.log("error: no tab view side selected");
          }// end switch


      }; //end setViews

      this.drawDefaultViewImage = function (){
          this.clearImage(canvas,context );
          context.fillStyle="#FFFFFF";
          context.fillRect(0,0,canvas.width,100);
          var base_image = new Image();
          if (this.isTabSelected()) {
              base_image.onload = function(){
                  context.drawImage(base_image, 150, 60, 800, 409);
              };
              base_image.src = $scope.shoeSelected[0]["mainViewDefault"];
              console.log("drawDefaultImage set!");
          }else{
              base_image.onload = function(){
                  context.drawImage(base_image, 150, 60, 800, 409);
              };
              base_image.src = $scope.shoeSelected[0]["mainViewDefault"];
              console.log("drawDefaultImage set!");
              }//end if-else

      }; //end drawDefaultViewImage

      this.drawTopViewImage = function (side){
          this.clearImage(topViewCanvas,tpcontext, side );
      /*    tpcontext.fillStyle="#FFFFFF";
          tpcontext.fillRect(75,0,topViewCanvas.width-150,150); */
          var right_image = new Image();
          var left_image = new Image();
              if(side == "left"){
                  if($scope.tabLeft.length > 0) {
                      left_image.onload = function () {
                          tpcontext.drawImage(left_image, 90, 0, 240, 469);
                      };
                      left_image.src = $scope.shoeSelected[0]["mainViewTopLeftNoTab"];
                  }else{
                      left_image.onload = function () {
                          tpcontext.drawImage(left_image, 90, 0, 240, 469);
                      };
                      left_image.src = $scope.shoeSelected[0]["mainViewTopLeft"];
                  }
              }else if(side == "right"){
                  if($scope.tabRight.length > 0) {
                      right_image.onload = function () {
                          tpcontext.drawImage(right_image, 310, 0, 240, 469);
                      };
                      right_image.src = $scope.shoeSelected[0]["mainViewTopRightNoTab"];
                      console.log("inside drawTopViewImage() right");
                  }else{
                      right_image.onload = function () {
                          tpcontext.drawImage(right_image, 310, 0, 240, 469);
                      };
                      right_image.src = $scope.shoeSelected[0]["mainViewTopRight"];
                  }//end else-if
              }else{
                  left_image.onload = function () {
                      tpcontext.drawImage(left_image, 90, 0, 240, 469);
                  };
                  left_image.src = $scope.shoeSelected[0]["mainViewTopLeft"];
                  right_image.onload = function () {
                      tpcontext.drawImage(right_image, 310, 0, 240, 469);
                  };
                  right_image.src = $scope.shoeSelected[0]["mainViewTopRight"];
              }//end else-if

          console.log("drawTopViewImage set!");
      };// end drawTopViewImage


      this.drawTopTabsViewImage = function (side){
          this.clearImage(topViewTabCanvas,tptabcontext, side );

          var tab_image_top_left = new Image();
          var tab_image_bot_left = new Image();
          var tab_image_top_right = new Image();
          var tab_image_bot_right = new Image();
          var tabWidth = $scope.shoeSelected[0]["topViewTabWidth"];
          var tabHeight = $scope.shoeSelected[0]["topViewTabHeight"];


            /** Left Shoe tabs vars **/
          var topXOffsetL = $scope.shoeSelected[0]["topViewLeftShoeTopTabXOffset"];
          var topYOffsetL = $scope.shoeSelected[0]["topViewLeftShoeTopTabYOffset"];
          var topRotationL = $scope.shoeSelected[0]["topViewLeftShoeTopTabRotation"];

          var botXOffsetL = $scope.shoeSelected[0]["topViewLeftShoeBottomTabXOffset"];
          var botYOffsetL = $scope.shoeSelected[0]["topViewLeftShoeBottomTabYOffset"];
          var botRotationL = $scope.shoeSelected[0]["topViewLeftShoeBottomTabRotation"];

          /** Right Shoe tabs vars **/
          var topXOffsetR = $scope.shoeSelected[0]["topViewRightShoeTopTabXOffset"];
          var topYOffsetR = $scope.shoeSelected[0]["topViewRightShoeTopTabYOffset"];
          var topRotationR = $scope.shoeSelected[0]["topViewRightShoeTopTabRotation"];

          var botXOffsetR = $scope.shoeSelected[0]["topViewRightShoeBottomTabXOffset"];
          var botYOffsetR = $scope.shoeSelected[0]["topViewRightShoeBottomTabYOffset"];
          var botRotationR = $scope.shoeSelected[0]["topViewRightShoeBottomTabRotation"];



          switch(side) {
              case "left":
                  /** Draw Left Shoe tabs **/

                  tab_image_top_left.onload = function () {
                      tptabcontext.drawImage(tab_image_top_left, topXOffsetL-210, topYOffsetL, tabWidth, tabHeight);
                      console.log("drawTopTabsViewImage top is set!");
                  };
                  tab_image_top_left.src = $scope.tabLeft[0]["topViewLeftOne"];

                  tab_image_bot_left.onload = function () {
                      tptabcontext.drawImage(tab_image_bot_left, botXOffsetL-210, botYOffsetL, tabWidth, tabHeight);
                      console.log("drawTopTabsViewImage bottom is set!");
                  };
                  tab_image_bot_left.src = $scope.tabLeft[0]["topViewLeftTwo"];
                  break;

              case "right" :
                  /** Draw Right Shoe tabs **/

                  tab_image_top_right.onload = function () {
                      tptabcontext.drawImage(tab_image_top_right, topXOffsetR-210, topYOffsetR, tabWidth, tabHeight);
                      console.log("drawTopTabsViewImage top is set!");
                  };
                  tab_image_top_right.src = $scope.tabRight[0]["topViewRightOne"];

                  tab_image_bot_right.onload = function () {
                      tptabcontext.drawImage(tab_image_bot_right, botXOffsetR-210, botYOffsetR, tabWidth, tabHeight);
                      console.log("drawTopTabsViewImage bottom is set!");

                  };
                  tab_image_bot_right.src = $scope.tabRight[0]["topViewRightTwo"];
                  break;

              default:
                  console.log("error: no tab view side selected");
          }// end switch

      }; //end drawTopTabsViewImage()





      this.drawLeftProfileViewImage = function (){
          this.clearImage(leftProfileCanvas,lpcontext );
          lpcontext.translate(0,0);
          lpcontext.fillStyle="#FFFFFF";
          lpcontext.fillRect(75,0,leftProfileCanvas.width-150,150);
          var base_image = new Image();
          if ($scope.tabLeft.length > 0) {
              base_image.onload = function(){
                  lpcontext.drawImage(base_image, 20, 110, 600, 307);
              };
              base_image.src = $scope.shoeSelected[0]["mainViewLeftProfileNoTab"];
              console.log("drawLeftProfileImage mainViewLeftProfileNoTab set!");
          }else{
              base_image.onload = function(){
                  lpcontext.drawImage(base_image, 20, 110, 600, 307);
              };
              base_image.src = $scope.shoeSelected[0]["mainViewLeftProfile"];
              console.log("drawLeftProfileImage mainViewLeftProfile set!");
          }// end if-else
      };// end drawLeftProfileViewImage

      this.drawRightProfileViewImage = function (){
          this.clearImage(rightProfileCanvas,rpcontext );
          rpcontext.translate(0,0);
          rpcontext.fillStyle="#FFFFFF";
          rpcontext.fillRect(75,0,rightProfileCanvas.width-150,150);
          var base_image = new Image();
          if ($scope.tabRight.length > 0) {
              base_image.onload = function(){
                  rpcontext.drawImage(base_image, 20, 110, 600, 307);
              };
              base_image.src = $scope.shoeSelected[0]["mainViewRightProfileNoTab"];
              console.log("drawRightProfileImage mainViewRightProfileNoTab set!");
          }else{
              base_image.onload = function(){
                  rpcontext.drawImage(base_image, 20, 110, 600, 307);
              };
              base_image.src = $scope.shoeSelected[0]["mainViewRightProfile"];
              console.log("drawRightProfileImage mainViewRightProfile set!");
          }// end if-else
      }; //end drawRightProfileViewImage

      this.drawLeftTabsProfileViewImage = function (){
          this.clearImage(leftProfileTabCanvas,lptabcontext );

          var tab_image_top = new Image();
          var tab_image_bottom = new Image();
          var tabWidth = 275;
          var tabHeight = 75;

          var topXOffset = $scope.shoeSelected[0]["profileTopXOffsetL"];
          var topYOffset = $scope.shoeSelected[0]["profileTopYOffsetL"];
          var topRotation = $scope.shoeSelected[0]["profileTopRotationL"];

          var botXOffset = $scope.shoeSelected[0]["profileBotXOffsetL"];
          var botYOffset = $scope.shoeSelected[0]["profileBotYOffsetL"];
          var botRotation = $scope.shoeSelected[0]["profileBotRotationL"];

          tab_image_top.onload = function(){
              $scope.drawRotated(topRotation,leftProfileTabCanvas,lptabcontext,tab_image_top, topXOffset-190, topYOffset, tabWidth, tabHeight);
          };
          tab_image_top.src = $scope.tabLeft[0]["tabOneImg"];
          console.log("drawLeftTabProfileImage top is set!");

          tab_image_bottom.onload = function(){
              $scope.drawRotated(botRotation,leftProfileTabCanvas,lptabcontext,tab_image_bottom, botXOffset-190, botYOffset, tabWidth, tabHeight);
          };
          tab_image_bottom.src = $scope.tabLeft[0]["tabTwoImg"];
          console.log("drawLeftTabProfileImage bottom is set!");
      }; // end drawLeftTabsProfileViewImage


      this.drawRightTabsProfileViewImage = function (){
          this.clearImage(rightProfileTabCanvas,rptabcontext );
          var tab_image_top = new Image();
          var tab_image_bottom = new Image();
          var tabWidth = 275;
          var tabHeight = 75;

          var topXOffset = $scope.shoeSelected[0]["profileTopXOffsetR"];
          var topYOffset = $scope.shoeSelected[0]["profileTopYOffsetR"];
          var topRotation = $scope.shoeSelected[0]["profileTopRotationR"];

          var botXOffset = $scope.shoeSelected[0]["profileBotXOffsetR"];
          var botYOffset = $scope.shoeSelected[0]["profileBotYOffsetR"];
          var botRotation = $scope.shoeSelected[0]["profileBotRotationR"];

          tab_image_top.onload = function(){
              $scope.drawRotated(topRotation,rightProfileTabCanvas,rptabcontext,tab_image_top, topXOffset-190, topYOffset, tabWidth, tabHeight);
              console.log("drawRightTabProfileImage top is set!");
          };
          tab_image_top.src = $scope.tabRight[0]["tabOneImg"];


          tab_image_bottom.onload = function(){
              $scope.drawRotated(botRotation,rightProfileTabCanvas,rptabcontext,tab_image_bottom, botXOffset-220, botYOffset, tabWidth, tabHeight);
              console.log("drawRightTabProfileImage bottom is set!");
          };
          tab_image_bottom.src = $scope.tabRight[0]["tabTwoImg"];
      }; // end drawRightTabsProfileViewImage


      /**                                       **/
      /*      Logic to set viewable canvas       */
      /**                                       **/
      this.canvasView = "top";

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
              while($scope.tabs.length > 0 ) {
                  console.log("popped " + $scope.tabs.pop().name + " from tabs");
              }
          while($scope.tabLeft.length >0) {
              console.log("popped " + $scope.tabLeft.pop().name + " from tabLeft");
          }
          while($scope.tabRight.length > 0){
                  console.log("popped " + $scope.tabRight.pop().name + " from tabRight");
              }
          $scope.subTotal = 0;
          /*    this.clearImage(canvas,context ); */
              this.clearImage(topViewCanvas,tpcontext );
              this.clearImage(leftProfileCanvas,lpcontext );
              this.clearImage(rightProfileCanvas,rpcontext );
              this.clearImage(topViewTabCanvas,tptabcontext );
              this.clearImage(leftProfileTabCanvas,lptabcontext );
              this.clearImage(rightProfileTabCanvas,rptabcontext );
              this.canvasView = "top";

          this.setEditMode();


      };

      $scope.drawRotated = function(degrees, cnvs, ctx, image, xOffset, yOffset, tabWidth, tabHeight){

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
          ctx.save();
      }; //end drawRotated()

      this.isShoeSelected = function (){
          return $scope.shoeSelected.length > 0;
      };

      this.isTabSelected = function (){
          console.log($scope.tabs.length > 0);
          return $scope.tabs.length > 0;
      };

      this.getSubTotal = function(){
          return $scope.subTotal;
      };

      this.setEditMode = function(){
          if($scope.editMode == true){
              $scope.editMode = false;
          }else{
              $scope.editMode = true;
          }
      };

      this.isEditMode = function(){
          return $scope.editMode;
      };



      $scope.shoe = {};
      $scope.tab ={};

      $scope.shoeSizeOptions = [
          {size: 8, label: "8 - kids"},
          {size: 8.5, label: "8.5 - kids"},
          {size: 9, label: "9 - kids"},
          {size: 9.5, label: "9.5 - kids"},
          {size: 10, label: "10 - kids"},
          {size: 10.5, label: "10.5 - kids"},
          {size: 11, label: "11 - kids"},
          {size: 11.5, label: "11.5 - kids"},
          {size: 12, label: "12 - kids"},
          {size: 12.5, label: "12.5 - kids"},
          {size: 13, label: "13 - kids"},
          {size: 13.5, label: "13.5 - kids"},
          {size: 1, label: "1 - youth"},
          {size: 1.5, label: "1.5 - youth"},
          {size: 2, label: "2 - youth"},
          {size: 2.5, label: "2.5 - youth"},
          {size: 3, label: "3 - youth"}
      ];

      $scope.tabSizeOptions = [
          {size: "small", label: "small"},
          {size: "medium", label: "medium"},
          {size: "large", label: "large"},
          {size: "x-large", label: "x-large"}
      ];


      $scope.$watch($scope.carouselIndex, function() {
         console.log('hey, carouselIndex has changed! ' + $scope.carouselIndex );
      });


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

  });

})();

