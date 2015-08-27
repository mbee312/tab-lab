(function () {
    'use strict';

    // Declare app level module which depends on views, and components
    var tabLabApp = angular.module('tabLabApp',
        ['ngAnimate',
            'ngTouch',
            'ngMaterial',
            'ui.bootstrap',
            'angular-carousel',
            'slick',
            'ui.bootstrap.modal'
        ]);
    tabLabApp.service('sharedProperties', function(){
        var shoeSelected = {};

        return {
            getShoe: function () {
                console.log("returning shoe: ");
                console.log(shoeSelected);
                return shoeSelected;
            },
            setShoeSelected: function(shoe) {
                shoeSelected = shoe;
                console.log("setShoe: ");
                console.log(shoeSelected);
            }
        };
    });


    tabLabApp.controller('tabLabController',
        ['$scope',
            '$http',
            '$mdDialog',
            '$mdToast',
            '$animate',
            '$window',
            'sharedProperties',
            function ($scope, $http, $mdDialog, $mdToast, $animate, $window, sharedProperties) {

                // Tabs on canvas List Arrays
                $scope.tabs = {};
                $scope.tabs.size;
                $scope.tabs.left = {};
                $scope.tabs.left.price = 0;
                $scope.tabs.right = {};
                $scope.tabs.right.price = 0;

                $scope.shoeSelected = {};
                $scope.shoeSelected.tab = {};
                $scope.shoeSelected.tab.left = {};
                $scope.shoeSelected.tab.right = {}; 

                $scope.shoeSize = {};
                $scope.shoeSize.size = {};
                $scope.fit = {};
                //  $scope.fit.autoselect = true;
                $scope.fit.wide = false;
                $scope.sizeMoreOptions = false;
                $scope.tabSelectorFocus = false; //false equals left tab selector focus

                $scope.basket = [];
                $scope.subTotal = 0;
                $scope.editMode = false;
                $scope.shoeEditMode = false;
                $scope.isSizeEdit = false;
                $scope.isSizeEditRight = false;

                $scope.tabEditModeL = false;
                $scope.tabEditModeR = false;


                $scope.isEndOfShoeList = false;
                $scope.isEndOfTabListL = false;
                $scope.isEndOfTabListR = false;
                $scope.isTabIndexAtOne = false;

                $scope.numOfTabs = 0;
                $scope.numofShoes = 0;

                var loadMenu = function (list, shoeBool ){
                    for(var i = 0; i < list.length ; i++){
                        list[i].menuImg = new Image();
                        list[i].menuImg.src=list[i].menuImgUrl;
                    }// end for
                    return list;
                }// end preLoader()

                $scope.setShoe = function(shoe){
                    sharedProperties.setShoeSelected(shoe);
                };

                $http.get('assets/data/shoeStyles.json').success(function (data) {
                    $scope.shoeStyles = data;
                });
                $http.get('assets/data/shoes_max.json').success(function (data) {
                    $scope.shoeList = data;
                    $scope.shoeList = loadMenu ($scope.shoeList, true);
                    $scope.numofShoes = $scope.shoeList.length;
                    $scope.shoeSelected = $scope.shoeList[$scope.index];
                    console.log("loaded: ");
                    console.log($scope.shoeSelected);
                    $scope.setShoe($scope.shoeSelected);
                //    $scope.drawShoe();
                //    $scope.calculateSubTotal();
                });

                $http.get('assets/data/tabs.json').success(function (data) {
                    $scope.tabList = data;
                    $scope.tabList = loadMenu ($scope.tabList, false);
                    $scope.numOfTabs = $scope.tabList.length;
                //    $scope.addTab($scope.tabList[$scope.leftTabIndex], "left");
                //    $scope.addTab($scope.tabList[$scope.rightTabIndex], "right");
                //    $scope.setTabPositions();
                //    $scope.drawTabs("left");
                //    $scope.drawTabs("right");
                //    $scope.calculateSubTotal();
                    
                });

                $http.get('assets/data/shoeSizes.json').success(function (data) {
                    $scope.shoeSizeOptions = data;
                });
                $http.get('assets/data/tabSizes.json').success(function (data) {
                    $scope.tabSizeOptions = data;
                });


                /**
                 * On init select random shoe and tab
                 *
                 */

                $scope.index = 0;
                $scope.carouselIndex = 1;

                $scope.rightTabIndex = 0;
                $scope.rTindex = 1;

                $scope.leftTabIndex = 0;
                $scope.lTindex = 1;

                $scope.calculateSubTotal = function (){
                    var sTotal = 0;
                        sTotal = $scope.shoeSelected.price + $scope.tabs.left.price + $scope.tabs.right.price;
                    console.log("subtotal=" +sTotal);
                    $scope.subTotal = sTotal;
                };

                /*                                 */
                /* helper function to clear canvas */
                /*                                 */

                $scope.setDefaultTabs = function (){
                    $scope.shoeSelected.tab.left.top = $scope.tabs[0].top;
                    $scope.shoeSelected.tab.left.bottom = $scope.tabs[0].bottom;
                    $scope.shoeSelected.tab.right.top = $scope.tabs[1].top;
                    $scope.shoeSelected.tab.right.bottom = $scope.tabs[1].bottom;
                }

                $scope.initRandom = function (){
                    $scope.index = Math.floor(Math.random() * 10);
                    $scope.carouselIndex = $scope.index;
                    $scope.leftTabIndex = Math.floor(Math.random() * 11);
                    $scope.lTindex = $scope.leftTabIndex;
                    $scope.rightTabIndex = Math.floor(Math.random() * 11);
                    $scope.rTindex = $scope.rightTabIndex;
                };

                $scope.clearImage = function (c, ctx, pos) {
                    console.log("clearing image");

                    // Store the current transformation matrix
                    ctx.save();

                    if (pos == "left") {
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.clearRect(0, 0, c.width / 2, c.height);
                    } else if (pos == "right") {
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.clearRect(c.width / 2, 0, c.width / 2, c.height);
                    } else {
                        // Use the identity matrix while clearing the canvas
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.clearRect(0, 0, c.width, c.height);
                    }//end if-else


                    // Restore the transform
                    ctx.restore();
                }; // end clearImage
/*
                $scope.setShoe = function (shoe) {
                    $scope.shoeSelected = shoe;
                    console.log("setShoe! " + shoe.model);
                }; //end setShoe()
                */


                // Add a Item to the list
                $scope.addTab = function (tab, side) {
                    
                    switch (side) {
                        case "left":
                            $scope.tabs.left = tab;
                            break;
                        case "right":
                            $scope.tabs.right = tab;
                            break;
                        default :
                            console.log("error: no tab side selected in addTab()");
                    }// end switch
                }; //end addTab()

                this.remove = function (side) {
                    switch (side) {
                        case "left":
                            $scope.subTotal -= $scope.tabLeft[0].price;
                            console.log("popped " + $scope.tabLeft.pop().name + " from tabLeft");
                            $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                            $scope.clearImage(topViewCanvas, tpcontext, side);
                            $scope.setViews(side);
                            break;
                        case "right":
                            $scope.subTotal -= $scope.tabRight[0].price;
                            console.log("popped " + $scope.tabRight.pop().name + " from tabRight");
                            $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                            $scope.clearImage(topViewCanvas, tpcontext, side);
                            $scope.setViews(side);
                            break;
                        case "shoe":
                            $scope.subTotal -= $scope.shoeSelected.price;
                            $scope.shoeSelected = null;
                            $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                            $scope.clearImage(topViewCanvas, tpcontext, side);
                            break;
                        default:
                            console.log("no tabs removed");
                    }
                };

                $scope.leftShoeImage = {};
                $scope.leftShoeImage.width =  0;
                $scope.leftShoeImage.height = 0;
                $scope.rightShoeImage = {};
                $scope.rightShoeImage.width =  0;
                $scope.rightShoeImage.height = 0;

                $scope.tab_image_top_left = new Image();
                $scope.tab_image_bot_left = new Image();
                $scope.tab_image_top_right = new Image();
                $scope.tab_image_bot_right = new Image();

                $scope.getImageNaturalDimensionsAndScale = function (image, scaleFactor, tabScale){
                    
                    /* getImageNaturalDimensions */
                    var imageWidth =  image.width;
                    var imageHeight = image.height;

                     /* scaleImage */
                    imageWidth *= $scope.scaleFactor * tabScale;
                    imageHeight *= $scope.scaleFactor * tabScale;

                    return{
                        width: imageWidth,
                        height: imageHeight
                    };

                } //end getImageNaturalDimensionsAndScale ()

                $scope.right_image = new Image();
                $scope.left_image = new Image();

                /*
                $scope.drawShoe = function (side) {
                    
                //    $scope.left_image.src = $scope.shoeSelected.topViewLeft.src;
                //    $scope.right_image.src = $scope.shoeSelected.topViewRight.src;

                    var leftImage = $scope.getImageNaturalDimensionsAndScale(
                        $scope.left_image, 
                        $scope.scaleFactor, 1);

                    var rightImage = $scope.getImageNaturalDimensionsAndScale(
                        $scope.right_image, 
                        $scope.scaleFactor, 1);

                    $scope.leftShoeImage = leftImage;
                    $scope.rightShoeImage = rightImage;



                    var leftXOrigin = $scope.cWidth/2 - leftImage.width;
                    var yOrigin = 20;
                    var rightXOrigin = $scope.cWidth/2;

                    console.log("leftXOrigin = " + leftXOrigin);
                    console.log("rightXOrigin = " + rightXOrigin);
                    console.log("yOrigin = " + yOrigin);
                    


                    if (side == "left") {
                        //draw just the left shoe
                    //    $scope.left_image.onload = function () {
                            console.log("leftImage.width = " + leftImage.width);
                            console.log("leftImage.height = " + leftImage.height);
                            tpcontext.drawImage($scope.left_image, leftXOrigin, yOrigin, leftImage.width, leftImage.height);
                    //    };

                    } else if (side == "right") {
                        //draw just the right shoe
                    //    $scope.right_image.onload = function () {
                            console.log("rightImage.width = " + rightImage.width);
                            console.log("rightImage.height = " + rightImage.height);
                            tpcontext.drawImage($scope.right_image, rightXOrigin, yOrigin, rightImage.width, rightImage.height);
                    //    };

                    } else {
                        console.log("drawing both shoes");
                        //draw both
                     //   $scope.left_image.onload = function () {
                            console.log("leftImage.width = " + leftImage.width);
                            console.log("leftImage.height = " + leftImage.height);
                            tpcontext.drawImage($scope.left_image, leftXOrigin, yOrigin, leftImage.width, leftImage.height);
                      //  };

                    //    $scope.right_image.onload = function () {
                            console.log("rightImage.width = " + rightImage.width);
                            console.log("rightImage.height = " + rightImage.height);
                            tpcontext.drawImage($scope.right_image,  rightXOrigin, yOrigin, rightImage.width, rightImage.height);
                    //    };

                    }//end else-if
                };// end drawShoe()

                */

                $scope.setTabPositions = function (num){
                    /*     
                    *   Tab Positions 
                    *       1   3
                    *       2   4
                    */
                    switch (num){
                        case 1: // 1 2 4 3
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            break;
                        case 2: // 1 3 2 4
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            break;
                        case 3: // 1 3 4 2
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            break;
                        case 4: // 1 4 3 2
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            break;
                        case 5: // 1 4 2 3
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            break;
                        case 6: // 2 1 3 4
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            break;
                        case 7: // 2 1 4 3
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            break;
                        case 8: // 2 3 1 4
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            break;
                        case 9: // 2 3 4 1
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            break;
                        case 10: // 2 4 1 3
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            break;
                        case 11: // 2 4 3 1
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            break;
                        case 12: // 3 1 2 4
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            break;
                        case 13: // 3 1 4 2
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            break;
                        case 14: // 3 2 1 4
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            break;
                        case 15: // 3 2 4 1
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            break;
                        case 16: // 3 4 1 2
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            break;
                        case 17: // 3 4 2 1
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            break;
                        case 18: // 4 1 2 3
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            break;
                        case 19: // 4 2 3 1
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            break;
                        case 20: // 4 3 1 2
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            break;
                        case 21: // 4 1 3 2
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightBottomTab.src;
                            break;
                        case 22: // 4 2 1 3
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            break;
                        case 23: // 4 3 2 1
                            $scope.tab_image_top_left.src = $scope.tabs.right.topViewLeftBottomTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.right.topViewLeftTopTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.left.topViewRightBottomTab.src; 
                            $scope.tab_image_bot_right.src = $scope.tabs.left.topViewRightTopTab.src;
                            break;
                        default: // default : 1 2 3 4
                            $scope.tab_image_top_left.src = $scope.tabs.left.topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabs.left.topViewLeftBottomTab.src;
                            $scope.tab_image_top_right.src = $scope.tabs.right.topViewRightTopTab.src;
                            $scope.tab_image_bot_right.src = $scope.tabs.right.topViewRightBottomTab.src;
                    }

                };



                $scope.drawTabs = function (side) {

                    switch (side) {
                        case "left":
                            /** Draw Left Shoe tabs **/

                            var tabTopY = 20 + ($scope.leftShoeImage.height *.34);
                            var tabBottomY = 20 + ($scope.leftShoeImage.height *.48);

                            var tabTopLeftImage = $scope.getImageNaturalDimensionsAndScale(
                                $scope.tab_image_top_left, 
                                $scope.scaleFactor,
                                $scope.tabScaleFactorOffset);


                            var tabBottomLeftImage = $scope.getImageNaturalDimensionsAndScale(
                                $scope.tab_image_bot_left, 
                                $scope.scaleFactor, 
                                $scope.tabScaleFactorOffset);

                            var tabTopLeftX = $scope.cWidth/2 - ($scope.leftShoeImage.width *.89);
                            var tabBottomLeftX = $scope.cWidth/2 - ($scope.leftShoeImage.width *.89);
                            console.log("tabTopLeftX="+tabTopLeftX);

                            $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                            tptabcontext.drawImage($scope.tab_image_top_left, tabTopLeftX, tabTopY, tabTopLeftImage.width-11, tabTopLeftImage.height+5);
                            tptabcontext.drawImage($scope.tab_image_bot_left, tabBottomLeftX, tabBottomY, tabBottomLeftImage.width-11, tabBottomLeftImage.height+5);

                            break;

                        case "right" :
                            /** Draw Right Shoe tabs **/

                            var tabTopY = 20 + ($scope.rightShoeImage.height *.34);
                            var tabBottomY = 20 + ($scope.rightShoeImage.height *.48);

                            var tabTopRightImage = $scope.getImageNaturalDimensionsAndScale(
                                $scope.tab_image_top_right, 
                                $scope.scaleFactor,
                                $scope.tabScaleFactorOffset);

                            var tabBottomRightImage = $scope.getImageNaturalDimensionsAndScale(
                                $scope.tab_image_bot_right, 
                                $scope.scaleFactor, 
                                $scope.tabScaleFactorOffset);

                            var tabTopRightX = $scope.cWidth/2 + ($scope.rightShoeImage.width *.2);
                            var tabBottomRightX = $scope.cWidth/2 + ($scope.rightShoeImage.width *.2);

                            $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                            tptabcontext.drawImage($scope.tab_image_top_right, tabTopRightX, tabTopY, tabTopRightImage.width-11, tabTopRightImage.height+5);
                            tptabcontext.drawImage($scope.tab_image_bot_right, tabBottomRightX, tabBottomY, tabBottomRightImage.width-11, tabBottomRightImage.height+5);

                            break;

                        default: //  Draw both
                            console.log("error: no tab view side selected. Drawing both sides");

                            var tabTopY = 20 + ($scope.leftShoeImage.height *.34);
                            var tabBottomY = 20 + ($scope.leftShoeImage.height *.48);

                            var tabTopLeftImage = $scope.getImageNaturalDimensionsAndScale(
                                $scope.tab_image_top_left, 
                                $scope.scaleFactor,
                                $scope.tabScaleFactorOffset);

                            var tabBottomLeftImage = $scope.getImageNaturalDimensionsAndScale(
                                $scope.tab_image_bot_left, 
                                $scope.scaleFactor, 
                                $scope.tabScaleFactorOffset);

                            var tabTopLeftX = $scope.cWidth/2 - ($scope.leftShoeImage.width *.89);
                            var tabBottomLeftX = $scope.cWidth/2 - ($scope.leftShoeImage.width *.89);
                           // $scope.clearImage(topViewTabCanvas, tptabcontext);

                                tptabcontext.drawImage($scope.tab_image_top_left, tabTopLeftX, tabTopY, tabTopLeftImage.width-11, tabTopLeftImage.height+5);
                                tptabcontext.drawImage($scope.tab_image_bot_left, tabBottomLeftX, tabBottomY, tabBottomLeftImage.width-11, tabBottomLeftImage.height+5);

                            var tabTopRightImage = $scope.getImageNaturalDimensionsAndScale(
                                $scope.tab_image_top_right, 
                                $scope.scaleFactor,
                                $scope.tabScaleFactorOffset);

                            var tabBottomRightImage = $scope.getImageNaturalDimensionsAndScale(
                                $scope.tab_image_bot_right, 
                                $scope.scaleFactor, 
                                $scope.tabScaleFactorOffset);

                            var tabTopRightX = $scope.cWidth/2 + ($scope.rightShoeImage.width *.2);
                            var tabBottomRightX = $scope.cWidth/2 + ($scope.rightShoeImage.width *.2);

                                tptabcontext.drawImage($scope.tab_image_top_right, tabTopRightX, tabTopY, tabTopRightImage.width-11, tabTopRightImage.height+5);
                                tptabcontext.drawImage($scope.tab_image_bot_right, tabBottomRightX, tabBottomY, tabBottomRightImage.width-11, tabBottomRightImage.height+5);
                            
                    }// end switch

                }; //end drawTabs()


                /**                                       **/
                /*      Logic to set viewable canvas       */
                /**                                       **/
                this.canvasView = "top";

                this.isCanvasSet = function (checkCanvas) {
                    return this.canvasView === checkCanvas;
                };

                this.setCanvas = function (setCanvas) {
                    this.canvasView = setCanvas;
                };
                /* end canvas view logic code */

                this.clearSelections = function () {
                    if ($scope.shoeSelected.length > 0) {
                        console.log("popped " + $scope.shoeSelected.pop().name);
                    }
                    while ($scope.tabs.length > 0) {
                        console.log("popped " + $scope.tabs.pop().name + " from tabs");
                    }
                    while ($scope.tabLeft.length > 0) {
                        console.log("popped " + $scope.tabLeft.pop().name + " from tabLeft");
                    }
                    while ($scope.tabRight.length > 0) {
                        console.log("popped " + $scope.tabRight.pop().name + " from tabRight");
                    }
                    $scope.subTotal = 0;
                    $scope.clearImage(topViewCanvas, tpcontext);
                    $scope.clearImage(topViewTabCanvas, tptabcontext);
                    this.canvasView = "top";

                    this.setEditMode();


                };

                $scope.drawRotated = function (degrees, cnvs, ctx, image, xOffset, yOffset, tabWidth, tabHeight) {

                    // save the unrotated context of the canvas so we can restore it later
                    // the alternative is to untranslate & unrotate after drawing
                    ctx.save();

                    // move to the center of the canvas
                    //   ctx.translate(cnvs.width/2,cnvs.height/2);
                    ctx.translate(xOffset, yOffset);

                    // rotate the canvas to the specified degrees
                    ctx.rotate(degrees * Math.PI / 180);

                    // draw the image
                    // since the context is rotated, the image will be rotated also
                    ctx.drawImage(image, -image.width / 2, -image.width / 2, tabWidth, tabHeight);

                    // we’re done with the rotating so restore the unrotated context
                    ctx.restore();
                    ctx.save();
                }; //end drawRotated()

                this.isShoeSelected = function () {
                    return $scope.shoeSelected.length > 0;
                };

                this.isTabSelected = function () {
                    return $scope.tabs.length > 0;
                };

                $scope.getSubTotal = function () {
                    console.log("subtotal is " + $scope.subTotal);
                    return $scope.subTotal;
                };

                this.setEditMode = function () {
                    if ($scope.editMode == true) {
                        $scope.editMode = false;
                        $scope.shoeEditMode = false;
                        $scope.tabEditModeL = false;
                        $scope.tabEditModeR = false;
                    } else {
                        $scope.editMode = true;
                        $scope.shoeEditMode = true;
                        $scope.tabEditModeL = true;
                        $scope.tabEditModeR = true;
                    }// end if-else
                };

                this.isEditMode = function () {
                    return $scope.editMode;
                };

                this.isShoeEditMode = function () {
                    return $scope.shoeEditMode;
                };

                this.setShoeEditMode = function () {
                    $scope.shoeEditMode = !$scope.shoeEditMode;
                    this.setSizeSelectMode();
                };

                this.isSizeSelected = function () {
                    if ($scope.shoeSize.size.size != null) {
                        return true;
                    } else {
                        return false;
                    }
                }//end isSizeSelected ()

                this.setSizeSelectMode = function (side){
                    if(side == 'left') {
                        $scope.isSizeEdit = !$scope.isSizeEdit;
                    }else{
                        $scope.isSizeEditRight = !$scope.isSizeEditRight;
                    }
                }//end setSizeEditMode()

                this.getSizeSelectMode = function (side){
                    if(side == 'left') {
                        return $scope.isSizeEdit;
                    }else{
                        return $scope.isSizeEditRight;
                    }
                }//end getSizeSelectMode ()

                this.isTabEditMode = function (side) {
                    if (side == "left") {
                        return $scope.tabEditModeL;
                    } else {
                        return $scope.tabEditModeR;
                    }//end if-else
                };

                this.setTabEditMode = function (side) {
                    this.setSizeSelectMode();
                    if (side == "left") {
                        $scope.tabEditModeL = !$scope.tabEditModeL;
                    } else {
                        $scope.tabEditModeR = !$scope.tabEditModeR;
                    }//end if-else
                };

                this.setTabSelectorFocus = function (){
                    this.tabSelectorFocus = !this.tabSelectorFocus;
                } //end setTabSelectorFocus

                this.isTabSizeSelected = function () {
                    if ($scope.tabs.size.size != null) {
                        return true;
                    } else {
                        return false;
                    }
                }//end isSizeSelected ()

                $scope.selectorModes = [true, true, false];


                this.getSelectorModes = function (side){
                    if(side == "left"){
                        return $scope.selectorModes[0];
                    }else if(side == "right"){
                        return $scope.selectorModes[2];
                    }else{
                        return $scope.selectorModes[1];
                    } //end else-if
                } //end getSelectorModes()

                this.setSelectorModes = function (side){
                    if(side == "left"){
                        if($scope.selectorModes[0] == false){
                            $scope.selectorModes[0] = !$scope.selectorModes[0];
                            $scope.selectorModes[2] = !$scope.selectorModes[2];
                        }
                    }else if(side == "right"){
                        if($scope.selectorModes[2] == false){
                            $scope.selectorModes[2] = !$scope.selectorModes[2];
                            $scope.selectorModes[0] = !$scope.selectorModes[0];
                        }
                    }else{
                        $scope.selectorModes[1] = !$scope.selectorModes[1];
                    } //end else-if

                } //end setSelectorModes()

                $scope.isSurveyOn = false;

                this.getSurveyForm = function (){
                    return $scope.isSurveyOn;
                }//end getSurveyForm ()

                $scope.setSurveyMode = function () {
                    $scope.isSurveyOn = !$scope.isSurveyOn;
                };


                $scope.shoe = {};
                $scope.tab = {};

                $scope.$watch("shoeSize.size.size", function (newValue, oldValue) {
                    $scope.setTabSize();

                });

                $scope.$watch("fit.wide", function (newValue, oldValue) {
                    $scope.setTabSize();

                });

                $scope.setTabSize = function () {
                    if( $scope.shoeSize.size != null){
                        if ($scope.fit.wide == false) {
                            switch ($scope.shoeSize.size.size) {
                                case 8 :
                                    $scope.tabs.size = $scope.tabSizeOptions[0];
                                    break;
                                case 8.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[0];
                                    break;
                                case 9 :
                                    $scope.tabs.size = $scope.tabSizeOptions[0];
                                    break;
                                case 9.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[1];
                                    break;
                                case 10 :
                                    $scope.tabs.size = $scope.tabSizeOptions[1];
                                    break;
                                case 10.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[1];
                                    break;
                                case 11 :
                                    $scope.tabs.size = $scope.tabSizeOptions[1];
                                    break;
                                case 11.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[1];
                                    break;
                                case 12 :
                                    $scope.tabs.size = $scope.tabSizeOptions[1];
                                    break;
                                case 12.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[1];
                                    break;
                                case 13 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 13.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 1 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 1.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 2 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 2.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 3 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                            }
                        } else {
                            switch ($scope.shoeSize.size.size) {
                                case 8 :
                                    $scope.tabs.size = $scope.tabSizeOptions[1];
                                    break;
                                case 8.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[1];
                                    break;
                                case 9 :
                                    $scope.tabs.size = $scope.tabSizeOptions[1];
                                    break;
                                case 9.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 10 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 10.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 11 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 11.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 12 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 12.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[2];
                                    break;
                                case 13 :
                                    $scope.tabs.size = $scope.tabSizeOptions[3];
                                    break;
                                case 13.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[3];
                                    break;
                                case 1 :
                                    $scope.tabs.size = $scope.tabSizeOptions[3];
                                    break;
                                case 1.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[3];
                                    break;
                                case 2 :
                                    $scope.tabs.size = $scope.tabSizeOptions[3];
                                    break;
                                case 2.5 :
                                    $scope.tabs.size = $scope.tabSizeOptions[3];
                                    break;
                                case 3 :
                                    $scope.tabs.size = $scope.tabSizeOptions[3];
                                    break;
                            }// end switch
                        }//end if-else
                    }//end if-else
                };// end setTabSize()



                this.moreOptions = function () {
                    return $scope.sizeMoreOptions;
                }//end showMoreOptions()

                this.showMoreOptions = function () {
                    console.log("inside showMoreOptions()");
                    if ($scope.sizeMoreOptions) {
                        $scope.sizeMoreOptions = false;
                        console.log("$scope.sizeMoreOptions set to false");
                    } else {
                        $scope.sizeMoreOptions = true;
                        console.log("$scope.sizeMoreOptions set to true");
                    }//end if-else
                }//end showMoreOptions()


                $scope.label_3 = "How likely would you recommend Tab Lab to a friend? \n0 to 10. (10 is Extremely likely)";

                $scope.userSurvey = {
                    email: '',
                    question_1: '' ,
                    question_2: '' ,
                    question_3: ''
                };

                $scope.isSurveyEmpty = function (){
                    if($scope.userSurvey.email != ''
                        && $scope.userSurvey.question_3 != ''){
                        return false;
                    }else{
                        return true;
                    }

                }// is SurveyEmpty()

                // process the form
                $scope.submitData = function (survey, resultVarName)
                {
                    var config = {
                        params: {
                            survey: survey
                        }
                    };

                    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

                    $http.post("server.php", null, config)
                        .success(function (data, status, headers, config)
                        {
                            $scope[resultVarName] = data;
                            $scope.setSurveyMode();

                        })
                        .error(function (data, status, headers, config)
                        {
                            $scope[resultVarName] = "SUBMIT ERROR";
                        });
                };

                $scope.options = {
                    display: 'bottom',
                    mode: 'scroller',
                    theme: 'ios7',
                    showLabel: true,
                    wheels: [
                        [
                            {
                                label: 'first wheel',
                                values: ['0', '1', '2', '3', '4', '5', '6', '7']
                            }, {
                            label: 'second wheel',
                            values: ['a','b','c','d']
                        }
                        ]
                    ]
                }



            }])
        //end tabLabAppController

    tabLabApp.controller('ScrollCtrl', function($scope, $location, anchorSmoothScroll) {

        $scope.gotoElement = function (eID){
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('bottom');

            // call $anchorScroll()
            anchorSmoothScroll.scrollTo(eID);

        };
    });

    tabLabApp.controller('ListController', function($scope, iScrollService) {
        $scope.vm = this;  // Use 'controller as' syntax

        $scope.vm.iScrollState = iScrollService.state;
    });


    tabLabApp.service('anchorSmoothScroll', function(){

        this.scrollTo = function(eID) {

            // This scrolling function
            // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

            var startY = currentYPosition();
            var stopY = elmYPosition(eID);
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                scrollTo(0, stopY); return;
            }
            var speed = Math.round(distance / 100);
            if (speed >= 20) speed = 20;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for ( var i=startY; i<stopY; i+=step ) {
                    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                    leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                } return;
            }
            for ( var i=startY; i>stopY; i-=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }

            function currentYPosition() {
                // Firefox, Chrome, Opera, Safari
                if (self.pageYOffset) return self.pageYOffset;
                // Internet Explorer 6 - standards mode
                if (document.documentElement && document.documentElement.scrollTop)
                    return document.documentElement.scrollTop;
                // Internet Explorer 6, 7 and 8
                if (document.body.scrollTop) return document.body.scrollTop;
                return 0;
            }

            function elmYPosition(eID) {
                var elm = document.getElementById(eID);
                var y = elm.offsetTop;
                var node = elm;
                while (node.offsetParent && node.offsetParent != document.body) {
                    node = node.offsetParent;
                    y += node.offsetTop;
                } return y;
            }

        };

    });

})();
