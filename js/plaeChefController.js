(function () {
    'use strict';

    // Declare app level module which depends on views, and components
    var plaeChefApp = angular.module('plaeChefApp',
        ['ngAnimate',
            'ngTouch',
            'ngMaterial',
            'ui.bootstrap',
            'angular-carousel',
            'slick',
            'ui.bootstrap.modal'
        ]);


    plaeChefApp.controller('PlaeChefController',
        ['$scope',
            '$http',
            '$mdDialog',
            '$mdToast',
            '$animate',
            '$window',
            function ($scope, $http, $mdDialog, $mdToast, $animate, $window) {

                /**
                 * On init select random shoe and tab
                 *
                 */

                /*   $scope.index = Math.floor(Math.random() * 10); */
                $scope.index = 0;
                $scope.carouselIndex = 1;

                $scope.rightTabIndex = 0;
                $scope.rTindex = 1;

                $scope.leftTabIndex = 0;
                $scope.lTindex = 1;

                /*  CANVAS SETUP start   */


                var topViewCanvas = document.getElementById('plae-chef-canvas-top');
                var tpcontext = topViewCanvas.getContext('2d');

                var topViewTabCanvas = document.getElementById('plae-chef-canvas-tab-top');
                var tptabcontext = topViewTabCanvas.getContext('2d');


                topViewCanvas.style.width = 512;//actual width of canvas
                topViewCanvas.style.height = 512;//actual height of canvas
                topViewTabCanvas.style.width = 512;//actual width of canvas
                topViewTabCanvas.style.height = 512;//actual height of canvas

                $scope.isMobile = false;
                $scope.cWidth = 0; // canvas width

                $scope.isMobileScreen = function (){
                    return $scope.isMobile;
                } //end isMobileScreen()

                $scope.calculateCanvasWidth = function (){
                    var iWidth = window.innerWidth;
                    console.log ( "innerWidth " + window.innerWidth);
                    var wScaleFactor = .96; // canvas border % on mobile set in css
                    if(!$scope.isMobile) {
                        if (iWidth < 360) {
                            wScaleFactor = .4;
                        }else if(iWidth < 600) {
                            wScaleFactor = .4;
                        }else if(iWidth < 660){
                                wScaleFactor = .4;
                        }else if(iWidth < 767){
                            wScaleFactor = .5;
                        }else if(iWidth < 800){
                            wScaleFactor = .5;
                        }else if (iWidth < 1024){
                            wScaleFactor = .5;
                        }else if (iWidth < 1200){
                            wScaleFactor = .5;
                        }else{
                            wScaleFactor = .46;
                        }
                    }

                    return iWidth*wScaleFactor;
                }

                $scope.setAllCanvasWidthsAndHeight = function (x, y){
                    $scope.cWidth = $scope.calculateCanvasWidth(); // canvas calculated width

                    //x and y is used in case canvas is not a square
                    topViewCanvas.width = $scope.cWidth+x;
                    topViewCanvas.height = $scope.cWidth+y;

                    topViewTabCanvas.width = $scope.cWidth+x;
                    topViewTabCanvas.height = $scope.cWidth+y;
                }


                var mobileScaleFactor = .41;
                var mobileScaleFactorWide = .27;
                var smartphoneScaleFactor = .85;
                var smartphoneScaleFactorWide = .27;
                var tabletScaleFactor = .6;
                var tabletScaleFactorWide = .5;
                var defaultScaleFactor = .8;

                $scope.scaleFactor = 1;

                $scope.findAndSetCanvasDimensions = function(){


                    if (window.innerWidth < 468){
                        $scope.isMobile = true;
                        $scope.scaleFactor = mobileScaleFactor;
                    }else if (window.innerWidth < 600){
                        $scope.isMobile = false;
                        $scope.scaleFactor = mobileScaleFactorWide;
                    }else if(window.innerWidth < 768){
                        $scope.isMobile = false;
                        $scope.scaleFactor = smartphoneScaleFactorWide;
                    }else if(window.innerWidth < 1024){
                        $scope.isMobile = false;
                        $scope.scaleFactor = tabletScaleFactorWide;
                    }else if(window.innerWidth < 1200){
                        $scope.isMobile = false;
                        $scope.scaleFactor = tabletScaleFactor;
                    }else{
                        $scope.isMobile = false;
                        $scope.scaleFactor = defaultScaleFactor;
                    } //end if-else
                    $scope.setAllCanvasWidthsAndHeight(0,0);
                    $scope.setViews();
                    $scope.setTabViews("right");
                    $scope.setTabViews("left");


                } //end checkWindowSize()

                window.onload = $scope.findAndSetCanvasDimensions;       // When the page first loads
                window.onresize = $scope.findAndSetCanvasDimensions;     // When the browser changes size

                /*  CANVAS SETUP end   */
                // Tabs on canvas List Arrays
                $scope.tabs = [];
                $scope.tabs.size = [];
                $scope.tabLeft = [];
                $scope.tabRight = [];

                $scope.shoeSelected = [];
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

                $scope.preLoader = function (list, shoeBool ){
                    for(var i = 0; i < list.length ; i++){
                        list[i].menuImg = new Image();
                        list[i].menuImg.src=list[i].menuImgUrl;
                        if(shoeBool){
                            list[i].topViewLeft = new Image();
                            list[i].topViewLeft.src=list[i].mainViewTopLeft;
                            list[i].topViewRight = new Image();
                            list[i].topViewRight.src=list[i].mainViewTopRight;
                        }else{
                            list[i].topViewLeftTopTab = new Image();
                            list[i].topViewLeftTopTab.src = list[i].topViewLeftOne;

                            list[i].topViewLeftBottomTab = new Image();
                            list[i].topViewLeftBottomTab.src = list[i].topViewLeftTwo;

                            list[i].topViewRightTopTab = new Image();
                            list[i].topViewRightTopTab.src = list[i].topViewRightOne;

                            list[i].topViewRightBottomTab = new Image();
                            list[i].topViewRightBottomTab.src = list[i].topViewRightTwo;

                        }//end else-if
                    }// end for
                }// end preLoader()

                $http.get('product/shoeStyles_local.json').success(function (data) {
                    $scope.shoeStyles = data;
                });
                $http.get('product/shoes_ty_local.json').success(function (data) {
                    $scope.shoeList = data;
                    $scope.preLoader ($scope.shoeList, true);
                    $scope.setShoe($scope.shoeList[$scope.index]);
                });

                $http.get('product/tabs_local.json').success(function (data) {
                    $scope.tabList = data;
                    $scope.preLoader ($scope.tabList, false);
                    $scope.addTab($scope.tabList[$scope.leftTabIndex], "left");
                    $scope.addTab($scope.tabList[$scope.rightTabIndex], "right");
                });

                /*                                 */
                /* helper function to clear canvas */
                /*                                 */

                $scope.clearImage = function (c, ctx, side) {

                    // Store the current transformation matrix
                    ctx.save();

                    if (side == "left") {
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.clearRect(0, 0, c.width / 2, c.height);
                    } else if (side == "right") {
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

                $scope.setShoe = function (shoe) {

                    while ($scope.shoeSelected.length > 0) {
                        $scope.subTotal -= $scope.shoeSelected[0].price;
                        console.log($scope.shoeSelected.pop() + " was removed as selected style");
                    }
                    $scope.shoeSelected.push(shoe);
                    $scope.subTotal += $scope.shoeSelected[0].price;

                    $scope.setViews();
                    if ($scope.tabLeft.length > 0) {
                        this.setTabViews("left");
                    }//end if
                    if ($scope.tabRight.length > 0) {
                        this.setTabViews("right");
                    }//end if


                }; //end setShoe()


                // Add a Item to the list
                $scope.addTab = function (tab, side) {
                    $scope.tabs.push(tab);
                    switch (side) {
                        case "left":
                            if ($scope.tabLeft.length > 0) {
                                $scope.subTotal -= $scope.tabLeft[0].price;
                                $scope.tabLeft.pop();
                            }
                            $scope.tabLeft.push(tab);
                            $scope.subTotal += $scope.tabLeft[0].price;
                            break;
                        case "right":
                            if ($scope.tabRight.length > 0) {
                                $scope.subTotal -= $scope.tabRight[0].price;
                                $scope.tabRight.pop();
                            }
                            $scope.tabRight.push(tab);
                            $scope.subTotal += $scope.tabRight[0].price;
                            break;
                        default :
                            console.log("error: no tab side selected in addTab()");
                    }// end switch


                    /* only show tabs when there is a shoe selected */
                    if ($scope.shoeSelected.length > 0) {
                        $scope.setViews();
                        $scope.setTabViews(side);
                    } else {
                        console.log("no shoe selected");
                    }// end-if

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
                            $scope.subTotal -= $scope.shoeSelected[0].price;
                            console.log("popped " + $scope.shoeSelected.pop().name + " from shoeSelected");
                            $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                            $scope.clearImage(topViewCanvas, tpcontext, side);
                            break;
                        default:
                            console.log("no tabs removed");
                    }
                };

                $scope.setViews = function (side) {
                    if (side == "left") {
                        $scope.drawTopViewImage(side);
                    } else if (side == "right") {
                        $scope.drawTopViewImage(side);
                    } else {
                        $scope.drawTopViewImage();
                    }//end else-if
                }; //end setViews

                $scope.setTabViews = function (side) {
                    $scope.drawTopTabsViewImage(side);

                }; //end setViews

                $scope.leftImageWidth =  0;
                $scope.leftImageHeight = 0;
                $scope.rightImageWidth =  0;
                $scope.rightImageHeight = 0;


                $scope.drawTopViewImage = function (side) {
                    $scope.clearImage(topViewCanvas, tpcontext, side);
                    console.log("THE canvas width is " + topViewCanvas.width);

                    var right_image = new Image();
                    var left_image = new Image();

                    left_image.src = $scope.shoeSelected[0].topViewLeft.src;
                    right_image.src = $scope.shoeSelected[0].topViewRight.src;


                    /* getImageNaturalDimensions */

                    $scope.leftImageWidth =  left_image.width;
                    $scope.leftImageHeight = left_image.height;
                    $scope.rightImageWidth =  right_image.width;
                    $scope.rightImageHeight = right_image.height;

                    /* scaleImageDimensions */
                    $scope.leftImageWidth = $scope.leftImageWidth*$scope.scaleFactor;
                    $scope.leftImageHeight = $scope.leftImageHeight*$scope.scaleFactor;
                    $scope.rightImageWidth = $scope.rightImageWidth*$scope.scaleFactor;
                    $scope.rightImageHeight = $scope.rightImageHeight*$scope.scaleFactor;

                    var leftXOrigin = $scope.cWidth/2 - $scope.leftImageWidth;
                    var yOrigin = 20;
                    var rightXOrigin = $scope.cWidth/2;

                    console.log("leftXOrigin = " + leftXOrigin);
                    console.log("rightXOrigin = " + rightXOrigin);
                    console.log("yOrigin = " + yOrigin);

                    if (side == "left") {
                        //draw just the left shoe
                        left_image.onload = function () {
                            tpcontext.drawImage(left_image, leftXOrigin, yOrigin, $scope.leftImageWidth, $scope.leftImageHeight);
                        };

                    } else if (side == "right") {
                        //draw just the right shoe
                        right_image.onload = function () {
                            tpcontext.drawImage(right_image, rightXOrigin, yOrigin, $scope.rightImageWidth, $scope.rightImageHeight);
                        };

                    } else {
                        //draw both
                        left_image.onload = function () {
                            tpcontext.drawImage(left_image, leftXOrigin, yOrigin, $scope.leftImageWidth, $scope.leftImageHeight);
                        };

                        right_image.onload = function () {
                            tpcontext.drawImage(right_image,  rightXOrigin, yOrigin, $scope.rightImageWidth, $scope.rightImageHeight);
                        };

                    }//end else-if
                };// end drawTopViewImage



                $scope.drawTopTabsViewImage = function (side) {
                    $scope.clearImage(topViewTabCanvas, tptabcontext, side);

                    /* Temp section                                                                 */
                    /* rotation and and scaling variables for inconsistencies of photographed tabs  */


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

                    var tabTopY = 20 + ($scope.leftImageHeight *.34);
                    var tabBottomY = 20 + ($scope.leftImageHeight *.48);


                    switch (side) {
                        case "left":
                            /** Draw Left Shoe tabs **/
                            $scope.tab_image_top_left = new Image();
                            $scope.tab_image_bot_left = new Image();

                            $scope.tab_image_top_left.src = $scope.tabLeft[0].topViewLeftTopTab.src;
                            $scope.tab_image_bot_left.src = $scope.tabLeft[0].topViewLeftBottomTab.src;

                            var tabTopLeftX = $scope.cWidth/2 - ($scope.leftImageWidth *.89);
                            var tabBottomLeftX = $scope.cWidth/2 - ($scope.leftImageWidth *.89);


                            /* getImageNaturalDimensions */
                            var tabTopLeftImageWidth =  $scope.tab_image_top_left.width;
                            console.log("tabTopLeftImageWidth=" + tabTopLeftImageWidth);
                            var tabTopLeftImageHeight = $scope.tab_image_top_left.height;
                            var tabBottomLeftImageWidth =  $scope.tab_image_bot_left.width;
                            var tabBottomLeftImageHeight = $scope.tab_image_bot_left.height;

                            /* scaleImageDimensions */
                            tabTopLeftImageWidth = tabTopLeftImageWidth*$scope.scaleFactor*1.25;
                            console.log("tabTopLeftImageWidth=" + tabTopLeftImageWidth);
                            tabTopLeftImageHeight = tabTopLeftImageHeight*$scope.scaleFactor*1.25;
                            tabBottomLeftImageWidth = tabBottomLeftImageWidth*$scope.scaleFactor*1.25;
                            tabBottomLeftImageHeight = tabBottomLeftImageHeight*$scope.scaleFactor*1.25;


                            $scope.tab_image_top_left.onload = function () {
                                    tptabcontext.drawImage($scope.tab_image_top_left, tabTopLeftX, tabTopY, tabTopLeftImageWidth-11, tabTopLeftImageHeight+5);
                                };


                            $scope.tab_image_bot_left.onload = function () {
                                    tptabcontext.drawImage($scope.tab_image_bot_left, tabBottomLeftX, tabBottomY, tabBottomLeftImageWidth-11, tabBottomLeftImageHeight+5);
                                };

                            break;

                        case "right" :
                            /** Draw Right Shoe tabs **/

                            var tab_image_top_right = new Image();
                            var tab_image_bot_right = new Image();


                            tab_image_top_right.src = $scope.tabRight[0].topViewRightTopTab.src;
                            tab_image_bot_right.src = $scope.tabRight[0].topViewRightBottomTab.src;

                            var tabTopRightX = $scope.cWidth/2 + ($scope.rightImageWidth *.2);
                            var tabBottomRightX = $scope.cWidth/2 + ($scope.rightImageWidth *.2);


                            /* getImageNaturalDimensions */

                            var tabTopRightImageWidth =  tab_image_top_right.width;
                            var tabTopRightImageHeight = tab_image_top_right.height;
                            var tabBottomRightImageWidth =  tab_image_bot_right.width;
                            var tabBottomRightImageHeight = tab_image_bot_right.height;

                            /* scaleImageDimensions */
                            tabTopRightImageWidth = tabTopRightImageWidth*$scope.scaleFactor*1.25;
                            tabTopRightImageHeight = tabTopRightImageHeight*$scope.scaleFactor*1.25;
                            tabBottomRightImageWidth = tabBottomRightImageWidth*$scope.scaleFactor*1.25;
                            tabBottomRightImageHeight = tabBottomRightImageHeight*$scope.scaleFactor*1.25;

                                tab_image_top_right.onload = function () {
                                    tptabcontext.drawImage(tab_image_top_right, tabTopRightX, tabTopY, tabTopRightImageWidth-11, tabTopRightImageHeight+5);
                                };

                                tab_image_bot_right.onload = function () {
                                    tptabcontext.drawImage(tab_image_bot_right, tabBottomRightX, tabBottomY, tabBottomRightImageWidth-11, tabBottomRightImageHeight+5);

                                };

                            break;

                        default:
                            console.log("error: no tab view side selected");
                    }// end switch

                }; //end drawTopTabsViewImage()


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
                    /*    $scope.clearImage(canvas,context ); */
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

                this.getSubTotal = function () {
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
                    {size: "S", label: "small"},
                    {size: "M", label: "medium"},
                    {size: "L", label: "large"},
                    {size: "XL", label: "x-large"}
                ];

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
        //end plaeChefApp Controller
        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('pink')
                .accentPalette('orange');
        });

    plaeChefApp.service('anchorSmoothScroll', function(){

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

    plaeChefApp.controller('ScrollCtrl', function($scope, $location, anchorSmoothScroll) {

        $scope.gotoElement = function (eID){
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('bottom');

            // call $anchorScroll()
            anchorSmoothScroll.scrollTo(eID);

        };
    });

    plaeChefApp.controller('SliderCtrl', function($scope) {
        $scope.random = function (){
            $scope.index = Math.floor(Math.random() * 10);
            $scope.carouselIndex = $scope.index;
            $scope.leftTabIndex = Math.floor(Math.random() * 11);
            $scope.lTindex = $scope.leftTabIndex;
            $scope.rightTabIndex = Math.floor(Math.random() * 11);
            $scope.rTindex = $scope.rightTabIndex;

            if(!$scope.isMobile) {
                $('#shoe-car-desktop').slick('slickGoTo', $scope.carouselIndex, false);
                $('#tab-left-car-desktop').slick('slickGoTo', $scope.lTindex, false);
                $('#tab-right-car-desktop').slick('slickGoTo', $scope.rTindex, false);
            }else{
                $('#shoe-car-mobile').slick('slickGoTo', $scope.carouselIndex, false);
                $('#tab-left-car').slick('slickGoTo', $scope.lTindex, false);
                $('#tab-right-car').slick('slickGoTo', $scope.rTindex, false);
            }

        }; //end random ()

        $scope.shuffle = function (){

            $scope.index =  Math.floor(Math.random() * 10);
            $scope.carouselIndex = $scope.index;

            $scope.leftTabIndex = Math.floor(Math.random() * 11);
            $scope.lTindex = $scope.leftTabIndex;

            $scope.rightTabIndex = Math.floor(Math.random() * 11);
            $scope.rTindex =  $scope.rightTabIndex;

            var posTopLeft;
            var posBottomLeft;
            var posTopRight;
            var posBottomRight;


            /* number of tab positions. Will vary with different styles */
            var numOfPos = 4;

        }; //end shuffle ()

        $scope.previous = function (side) {
            switch (side) {
                case "left":
                    $('#tab-left-car-desktop').slick('slickPrev');
                    break;
                case "center":
                    $('#shoe-car-desktop').slick('slickPrev');
                    break;
                case "right":
                    $('#tab-right-car-desktop').slick('slickPrev');
                    break;
                case "top":
                    $('#shoe-car-mobile').slick('slickPrev');
                    break;
                case "middle":
                    $('#tab-left-car').slick('slickPrev');
                    break;
                case "bottom":
                    $('#tab-right-car').slick('slickPrev');
                    break;
            } //end switch

        }// end previous()

        $scope.next = function (side){
            switch (side) {
                case "left":
                    $('#tab-left-car-desktop').slick('slickNext');
                    break;
                case "center":
                    $('#shoe-car-desktop').slick('slickNext');
                    break;
                case "right":
                    $('#tab-right-car-desktop').slick('slickNext');
                    break;
                case "top":
                    $('#shoe-car-mobile').slick('slickNext');
                    break;
                case "middle":
                    $('#tab-left-car').slick('slickNext');
                    break;
                case "bottom":
                    $('#tab-right-car').slick('slickNext');
                    break;
            } //end switch
        }// end next()

        $scope.$watch(function () {
            return $scope.index;
        }, function (index, carouselIndex) {
            if (index !== carouselIndex) {
                if(index == $scope.shoeList.length -1 ){
                    $scope.isEndOfShoeList = true;
                    $(".slick-shoe .slick-cloned").addClass("translate-slider-x");
                }else{
                    $scope.isEndOfShoeList = false;
                    $(".slick-shoe .slick-cloned").removeClass("translate-slider-x");
                }
                $scope.carouselIndex = index;
                // Get the current slide
                var currentSlide = $("#shoe-car-mobile").slick('slickCurrentSlide');
                console.log(currentSlide);

                console.log('hey, carouselIndex has changed! ' + $scope.carouselIndex);
                console.log("the shoe is " + $scope.shoeList[index]);
                $scope.setShoe($scope.shoeList[index]);
            }
        });

        $scope.$watch(function () {
            return $scope.leftTabIndex;
        }, function (leftTabIndex, lTIndex) {
            if (leftTabIndex !== lTIndex) {
                if(leftTabIndex == $scope.tabList.length -1 ){
                    $scope.isEndOfTabListL = true;
                    $(".slick-left .slick-cloned").addClass("translate-slider-x");
                }else{
                    $scope.isEndOfTabListL = false;
                    $(".slick-left .slick-cloned").removeClass("translate-slider-x");
                }
                $scope.lTIndex = leftTabIndex;
                console.log('hey, lTIndex has changed! ' + $scope.lTIndex);
                console.log("the left tab is " + $scope.tabList[leftTabIndex]);
                $scope.addTab($scope.tabList[leftTabIndex], "left");
            }
        });

        $scope.$watch(function () {
            return $scope.rightTabIndex;
        }, function (rightTabIndex, rTIndex) {

            if (rightTabIndex !== rTIndex) {
                if(rightTabIndex == $scope.tabList.length -1 ){
                    $scope.isEndOfTabListR = true;
                    $(".slick-right .slick-cloned").addClass("translate-slider-x");
                }else{
                    $scope.isEndOfTabListR = false;
                    $(".slick-right .slick-cloned").removeClass("translate-slider-x");
                }
                $scope.rTIndex = rightTabIndex;
                console.log('hey, rTIndex has changed! ' + $scope.rTIndex);
                console.log("the right tab is " + $scope.tabList[rightTabIndex]);
                $scope.addTab($scope.tabList[rightTabIndex], "right");
                console.log($scope.isEndOfTabListR);
            }

        });


    });

    plaeChefApp.controller('ListController', function($scope, iScrollService) {
        $scope.vm = this;  // Use 'controller as' syntax

        $scope.vm.iScrollState = iScrollService.state;
    });


})();
