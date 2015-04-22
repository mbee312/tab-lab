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

                var leftProfileCanvas = document.getElementById('plae-chef-canvas-left');
                var lpcontext = leftProfileCanvas.getContext('2d');

                var leftProfileTabCanvas = document.getElementById('plae-chef-canvas-tab-left');
                var lptabcontext = leftProfileTabCanvas.getContext('2d');

                var rightProfileCanvas = document.getElementById('plae-chef-canvas-right');
                var rpcontext = rightProfileCanvas.getContext('2d');

                var rightProfileTabCanvas = document.getElementById('plae-chef-canvas-tab-right');
                var rptabcontext = rightProfileTabCanvas.getContext('2d');

                topViewCanvas.style.width = 512;//actual width of canvas
                topViewCanvas.style.height = 512;//actual height of canvas
                topViewTabCanvas.style.width = 512;//actual width of canvas
                topViewTabCanvas.style.height = 512;//actual height of canvas
                leftProfileCanvas.style.width = 512;//actual width of canvas
                leftProfileCanvas.style.height = 512;//actual height of canvas
                leftProfileTabCanvas.style.width = 512;//actual width of canvas
                leftProfileTabCanvas.style.height = 512;//actual height of canvas
                rightProfileCanvas.style.width = 512;//actual width of canvas
                rightProfileCanvas.style.height = 512;//actual height of canvas
                rightProfileTabCanvas.style.width = 512;//actual width of canvas
                rightProfileTabCanvas.style.height = 512;//actual height of canvas

                var mobileScaleFactor = .65;
                var mobileScaleFactorWide = .40;
                var smartphoneScaleFactor = .85;
                var smartphoneScaleFactorWide = .46;
                var tabletScaleFactor = .91;
                var tabletScaleFactorWide = .67;
                var defaultScaleFactor = 1;

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
                        }else if(iWidth < 767){
                            wScaleFactor = .5;
                        }else if(iWidth < 800){
                            wScaleFactor = .5;
                        }else if (iWidth < 1024){
                            wScaleFactor = .5;
                        }else if (iWidth < 1200){
                            console.log ("im here width <1200");
                            wScaleFactor = .5;
                        }else{
                            wScaleFactor = .46;
                        }
                    }

                    return iWidth*wScaleFactor;
                }
                $scope.scaleViews = function (scaleFactor){
                    console.log("inside scaleViews")
                    tpcontext.scale(scaleFactor,scaleFactor);
                    tptabcontext.scale(scaleFactor,scaleFactor);
                    lpcontext.scale(scaleFactor,scaleFactor);
                    lptabcontext.scale(scaleFactor,scaleFactor);
                    rpcontext.scale(scaleFactor,scaleFactor);
                    rptabcontext.scale(scaleFactor,scaleFactor);
                } //end scaleViews()

                $scope.setCanvasWidthAndHeight = function (canvas, width, height){
                    canvas.width = width;
                    canvas.height = height;
                } //end scaleViews()

                $scope.setAllCanvasWidthsAndHeight = function (x, y){
                    $scope.cWidth = $scope.calculateCanvasWidth(); // canvas calculated width

                    //x and y is used in case canvas is not a square
                    $scope.setCanvasWidthAndHeight(topViewCanvas,$scope.cWidth+x,$scope.cWidth+y);
                    $scope.setCanvasWidthAndHeight(topViewTabCanvas,$scope.cWidth+x,$scope.cWidth+y);
                    $scope.setCanvasWidthAndHeight(leftProfileCanvas,$scope.cWidth+x,$scope.cWidth+y);
                    $scope.setCanvasWidthAndHeight(leftProfileTabCanvas,$scope.cWidth+x,$scope.cWidth+y);
                    $scope.setCanvasWidthAndHeight(rightProfileCanvas,$scope.cWidth+x,$scope.cWidth+y);
                    $scope.setCanvasWidthAndHeight(rightProfileTabCanvas,$scope.cWidth+x,$scope.cWidth+y);
                }

                $scope.setCanvasWidthHeightAndUpdateSize = function(){

                    if (window.innerWidth < 468){
                        $scope.isMobile = true;
                        $scope.setAllCanvasWidthsAndHeight(0,0);
                        $scope.scaleViews(mobileScaleFactor);
                    }else if (window.innerWidth < 520){
                        $scope.isMobile = false;
                        $scope.setAllCanvasWidthsAndHeight(0,0);
                        $scope.scaleViews(mobileScaleFactorWide);
                    }else if (window.innerWidth < 568) {
                        $scope.isMobile = false;
                        $scope.setAllCanvasWidthsAndHeight(0,0);
                        $scope.scaleViews(mobileScaleFactorWide);

                    }else if (window.innerWidth < 600){
                        $scope.isMobile = false;
                        $scope.setAllCanvasWidthsAndHeight(0,0);
                        $scope.scaleViews(mobileScaleFactorWide);
                    }else if(window.innerWidth < 768){
                        $scope.isMobile = false;
                        $scope.setAllCanvasWidthsAndHeight(0,-100);
                        $scope.scaleViews(smartphoneScaleFactorWide);
                    }else if(window.innerWidth < 1024){
                        $scope.isMobile = false;
                        $scope.setAllCanvasWidthsAndHeight(0,0);
                        $scope.scaleViews(tabletScaleFactorWide);
                    }else if(window.innerWidth < 1200){
                        $scope.isMobile = false;
                        $scope.setAllCanvasWidthsAndHeight(0,0);
                        $scope.scaleViews(tabletScaleFactor);
                    }else{
                        $scope.isMobile = false;
                        $scope.setAllCanvasWidthsAndHeight(0,0);
                        $scope.scaleViews(1);
                    } //end if-else
                    $scope.setViews();
                    $scope.setTabViews("right");
                    $scope.setTabViews("left");
                } //end checkWindowSize()

                window.onload = $scope.setCanvasWidthHeightAndUpdateSize;       // When the page first loads
                window.onresize = $scope.setCanvasWidthHeightAndUpdateSize;     // When the browser changes size

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
                        console.log("loaded "  + list[i].menuImg.src);

                        if(shoeBool){
                            list[i].topViewLeft = new Image();
                            list[i].topViewLeft.src=list[i].mainViewTopLeft;
                            list[i].topViewRight = new Image();
                            list[i].topViewRight.src=list[i].mainViewTopRight;
                            console.log("loaded " + list[i].topViewLeft.src);
                            console.log("loaded " + list[i].topViewRight.src);
                        }else{
                            list[i].topViewRightTopTab = new Image();
                            list[i].topViewRightTopTab.src = list[i].topViewRightOne;
                            list[i].topViewRightBottomTab = new Image();
                            list[i].topViewRightBottomTab.src = list[i].topViewRightTwo;

                            list[i].topViewLeftTopTab = new Image();
                            list[i].topViewLeftTopTab.src = list[i].topViewLeftOne;
                            list[i].topViewLeftBottomTab = new Image();
                            list[i].topViewLeftBottomTab.src = list[i].topViewLeftTwo;

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

                $http.get('product/views.json').success(function (data) {
                    $scope.mainViews = data;
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
                        console.log("clear left tab");
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
                    console.log("inside setShoe");

                    while ($scope.shoeSelected.length > 0) {
                        $scope.subTotal -= $scope.shoeSelected[0].price;
                        console.log($scope.shoeSelected.pop() + " was removed as selected style");
                    }
                    $scope.shoeSelected.push(shoe);
                    console.log(shoe.name + " style selected");
                    console.log("the price is " + $scope.shoeSelected[0].price);
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
                                console.log("tabLeft.pop()");
                                console.log($scope.subTotal);
                            }
                            $scope.tabLeft.push(tab);
                            $scope.subTotal += $scope.tabLeft[0].price;
                            console.log("the tab price is " + $scope.tabLeft[0].price);
                            break;
                        case "right":
                            if ($scope.tabRight.length > 0) {
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
                            $scope.clearImage(leftProfileTabCanvas, lptabcontext);
                            $scope.clearImage(leftProfileCanvas, lpcontext);
                            $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                            $scope.clearImage(topViewCanvas, tpcontext, side);
                            $scope.setViews(side);
                            break;
                        case "right":
                            $scope.subTotal -= $scope.tabRight[0].price;
                            console.log("popped " + $scope.tabRight.pop().name + " from tabRight");
                            $scope.clearImage(rightProfileTabCanvas, rptabcontext);
                            $scope.clearImage(rightProfileCanvas, rpcontext);
                            $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                            $scope.clearImage(topViewCanvas, tpcontext, side);
                            $scope.setViews(side);
                            break;
                        case "shoe":
                            $scope.subTotal -= $scope.shoeSelected[0].price;
                            console.log("popped " + $scope.shoeSelected.pop().name + " from shoeSelected");
                            $scope.clearImage(rightProfileTabCanvas, rptabcontext);
                            $scope.clearImage(rightProfileCanvas, rpcontext);
                            $scope.clearImage(leftProfileTabCanvas, lptabcontext);
                            $scope.clearImage(leftProfileCanvas, lpcontext);
                            $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                            $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                            $scope.clearImage(topViewCanvas, tpcontext, side);
                            break;
                        default:
                            console.log("no tabs removed");
                    }
                };

                $scope.setViews = function (side) {
                    if (side == "left") {
                        console.log("inside left setviews()");
                        $scope.drawTopViewImage(side);
                        /*    $scope.drawLeftProfileViewImage(); */
                    } else if (side == "right") {
                        console.log("inside right setviews()");
                        $scope.drawTopViewImage(side);
                        /*   $scope.drawRightProfileViewImage(); */
                    } else {
                        console.log("inside else setviews()");
                        $scope.drawTopViewImage();
                        /*
                         $scope.drawLeftProfileViewImage();
                         $scope.drawRightProfileViewImage(); */
                    }//end else-if
                }; //end setViews

                $scope.setTabViews = function (side) {
                    $scope.drawTopTabsViewImage(side);
                    /*    switch (side) {
                     case "left":
                     console.log("drawing left side");
                     $scope.drawLeftTabsProfileViewImage();
                     break;
                     case "right":
                     console.log("drawing right side");
                     $scope.drawRightTabsProfileViewImage();
                     break;
                     default:
                     console.log("error: no tab view side selected");
                     }// end switch
                     */


                }; //end setViews

                $scope.drawDefaultViewImage = function () {
                    $scope.clearImage(canvas, context);
                    context.fillStyle = "#FFFFFF";
                    context.fillRect(0, 0, canvas.width, 100);
                    var base_image = new Image();
                    if ($scope.isTabSelected()) {
                        base_image.onload = function () {
                            context.drawImage(base_image, 150, 60, 800, 409);
                        };
                        base_image.src = $scope.shoeSelected[0]["mainViewDefault"];
                        console.log("drawDefaultImage set!");
                    } else {
                        base_image.onload = function () {
                            context.drawImage(base_image, 150, 60, 800, 409);
                        };
                        base_image.src = $scope.shoeSelected[0]["mainViewDefault"];
                        console.log("drawDefaultImage set!");
                    }//end if-else

                }; //end drawDefaultViewImage

                $scope.drawTopViewImage = function (side) {
                    $scope.clearImage(topViewCanvas, tpcontext, side);

                    var right_image = new Image();
                    var left_image = new Image();
                    console.log("THE canvas width is " + topViewCanvas.width);
                    var xOrigin = $scope.cWidth/20;
                    var yOrigin = $scope.cWidth/20;

                    if (side == "left") {
                        //draw just the left shoe
                        left_image.src = $scope.shoeSelected[0].topViewLeft.src;
                        left_image.onload = function () {
                            tpcontext.drawImage(left_image, xOrigin, yOrigin, 240, 469);
                        };

                        console.log("set shoe left" + left_image.src);
                    } else if (side == "right") {
                        //draw just the right shoe
                        right_image.src = $scope.shoeSelected[0].topViewRight.src;
                        right_image.onload = function () {
                            tpcontext.drawImage(right_image, 210, yOrigin, 240, 469);
                        };

                        console.log("set shoe right" + right_image.src);
                    } else {
                        //draw both
                        left_image.src = $scope.shoeSelected[0].topViewLeft.src;
                        left_image.onload = function () {
                            tpcontext.drawImage(left_image, xOrigin, yOrigin, 240, 469);
                        };

                        console.log("set shoe left" + left_image.src);

                        right_image.src = $scope.shoeSelected[0].topViewRight.src;
                        right_image.onload = function () {
                            tpcontext.drawImage(right_image, 210, yOrigin, 240, 469);
                        };

                        console.log("set shoe right" + right_image.src);
                    }//end else-if
                };// end drawTopViewImage



                $scope.drawTopTabsViewImage = function (side) {
                    $scope.clearImage(topViewTabCanvas, tptabcontext, side);

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


                    switch (side) {
                        case "left":
                            /** Draw Left Shoe tabs **/

                                tab_image_top_left.onload = function () {
                                    tptabcontext.drawImage(tab_image_top_left, topXOffsetL - 278, topYOffsetL, tabWidth - 3, tabHeight);
                                };
                                tab_image_top_left.src = $scope.tabLeft[0].topViewLeftTopTab.src;

                                tab_image_bot_left.onload = function () {
                                    tptabcontext.drawImage(tab_image_bot_left, botXOffsetL - 279, botYOffsetL-1, tabWidth - 3, tabHeight);
                                };
                                tab_image_bot_left.src = $scope.tabLeft[0].topViewLeftBottomTab.src;

                            break;

                        case "right" :
                            /** Draw Right Shoe tabs **/

                                tab_image_top_right.onload = function () {
                                    tptabcontext.drawImage(tab_image_top_right, topXOffsetR - 309, topYOffsetR-1, tabWidth - 3, tabHeight);
                                };
                                tab_image_top_right.src = $scope.tabRight[0].topViewRightTopTab.src;

                                tab_image_bot_right.onload = function () {
                                    tptabcontext.drawImage(tab_image_bot_right, botXOffsetR - 309, botYOffsetR-1, tabWidth - 3, tabHeight);

                                };
                                tab_image_bot_right.src = $scope.tabRight[0].topViewRightTopTab.src;
                            
                            break;

                        default:
                            console.log("error: no tab view side selected");
                    }// end switch

                }; //end drawTopTabsViewImage()


                $scope.drawLeftProfileViewImage = function () {
                    $scope.clearImage(leftProfileCanvas, lpcontext);
                    lpcontext.translate(0, 0);
                    lpcontext.fillStyle = "#FFFFFF";
                    lpcontext.fillRect(75, 0, leftProfileCanvas.width - 150, 150);
                    var base_image = new Image();
                    if ($scope.tabLeft.length > 0) {
                        base_image.onload = function () {
                            lpcontext.drawImage(base_image, 0, 110, 600, 307);
                        };
                        base_image.src = $scope.shoeSelected[0]["mainViewLeftProfileNoTab"];
                    } else {
                        base_image.onload = function () {
                            lpcontext.drawImage(base_image, 0, 110, 600, 307);
                        };
                        base_image.src = $scope.shoeSelected[0]["mainViewLeftProfile"];
                    }// end if-else
                };// end drawLeftProfileViewImage

                $scope.drawRightProfileViewImage = function () {
                    $scope.clearImage(rightProfileCanvas, rpcontext);
                    rpcontext.translate(0, 0);
                    rpcontext.fillStyle = "#FFFFFF";
                    rpcontext.fillRect(75, 0, rightProfileCanvas.width - 150, 150);
                    var base_image = new Image();
                    if ($scope.tabRight.length > 0) {
                        base_image.onload = function () {
                            rpcontext.drawImage(base_image, 2, 112, 600, 307);
                        };
                        base_image.src = $scope.shoeSelected[0]["mainViewRightProfileNoTab"];
                    } else {
                        base_image.onload = function () {
                            rpcontext.drawImage(base_image, 2, 112, 600, 307);
                        };
                        base_image.src = $scope.shoeSelected[0]["mainViewRightProfile"];
                    }// end if-else
                }; //end drawRightProfileViewImage

                $scope.drawLeftTabsProfileViewImage = function () {
                    $scope.clearImage(leftProfileTabCanvas, lptabcontext);

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

                    tab_image_top.onload = function () {
                        $scope.drawRotated(topRotation, leftProfileTabCanvas, lptabcontext, tab_image_top, topXOffset - 211, topYOffset, tabWidth, tabHeight);
                    };
                    tab_image_top.src = $scope.tabLeft[0]["tabOneImg"];

                    tab_image_bottom.onload = function () {
                        $scope.drawRotated(botRotation, leftProfileTabCanvas, lptabcontext, tab_image_bottom, botXOffset - 211, botYOffset, tabWidth, tabHeight);
                    };
                    tab_image_bottom.src = $scope.tabLeft[0]["tabTwoImg"];
                }; // end drawLeftTabsProfileViewImage


                $scope.drawRightTabsProfileViewImage = function () {
                    $scope.clearImage(rightProfileTabCanvas, rptabcontext);
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

                    tab_image_top.onload = function () {
                        $scope.drawRotated(topRotation, rightProfileTabCanvas, rptabcontext, tab_image_top, topXOffset - 205, topYOffset, tabWidth, tabHeight);
                    };
                    tab_image_top.src = $scope.tabRight[0]["tabOneImg"];

                    tab_image_bottom.onload = function () {
                        $scope.drawRotated(botRotation, rightProfileTabCanvas, rptabcontext, tab_image_bottom, botXOffset - 235, botYOffset, tabWidth, tabHeight);
                    };
                    tab_image_bottom.src = $scope.tabRight[0]["tabTwoImg"];
                }; // end drawRightTabsProfileViewImage


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
                    $scope.clearImage(leftProfileCanvas, lpcontext);
                    $scope.clearImage(rightProfileCanvas, rpcontext);
                    $scope.clearImage(topViewTabCanvas, tptabcontext);
                    $scope.clearImage(leftProfileTabCanvas, lptabcontext);
                    $scope.clearImage(rightProfileTabCanvas, rptabcontext);
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
                    console.log($scope.tabs.length > 0);
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
                    console.log("inside setSelectorModes");
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
                    console.log($scope.fit.wide);
                    console.log($scope.shoeSize.size);
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

                    console.log("inside submitData");

                    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

                    $http.post("server.php", null, config)
                        .success(function (data, status, headers, config)
                        {
                            $scope[resultVarName] = data;
                            console.log("inside success");
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
        console.log("inside here");
        $scope.vm = this;  // Use 'controller as' syntax

        $scope.vm.iScrollState = iScrollService.state;
    });


})();
