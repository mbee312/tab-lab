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
    tabLabApp.service('tabLabProperties', function(){
        var shoeSelected = {};
        var isShoeSelected = false;
        var tabsRight = {};
        var areTabsRightSelected = false;
        var tabsLeft = {};
        var areTabsLeftSelected = false;

        return {
            getShoe: function () {
                console.log("returning shoe: ");
                console.log(shoeSelected);
                return shoeSelected;
            },
            setShoeSelected: function(shoe) {
                shoeSelected = shoe;
                isShoeSelected = true;
                console.log("setShoe: ");
                console.log(shoeSelected);
            },
            isShoeSelected: function () {
                console.log("is shoe set: ");
                console.log(isShoeSelected);
                return isShoeSelected;
            },
            getTab: function (side) {
                console.log("returning tab: ");
                var tab = 'tabs'+side;
                console.log(tab);
                return tab;
            },
            setTabSelected: function(tab, side) {
                if(side == 'right') {
                    tabsRight = tab;
                    areTabsRightSelected = true;
                    console.log("setTab: ");
                    console.log(tabsRight);
                }else{
                    tabsLeft = tab;
                    areTabsLeftSelected = true;
                    console.log("setTab: ");
                    console.log(tabsLeft);
                }// end if-else
            },
            isTabSelected: function (side) {
                console.log("is tab set: ");
                if(side=='right'){
                    console.log(areTabsRightSelected);
                    return areTabsRightSelected;
                }else{
                    console.log(areTabsLeftSelected);
                    return areTabsLeftSelected;
                }//end if-else

            }
        };
    });
    tabLabApp.service('sizeProperties', function (){
        var shoeSize = '';
        var tabSize = '';
        var wide = false;

        return {
            getShoeSize: function () {
                console.log("returning shoe size: ");
                console.log(shoeSize);
                return shoeSize;
            },
            setShoeSize: function (size) {
                shoeSize = size;
                console.log("setShoeSize: ");
                console.log(shoeSize);
            },
            getTabSize: function () {
                console.log("returning tab size: ");
                console.log(tabSize);
                return tabSize;
            },
            setTabSize: function (size) {
                shoeSize = size;
                console.log("setTabSize: ");
                console.log(tabSize);
            },
            getFitWide: function () {
                console.log("returning fit wide: ");
                console.log(wide);
                return wide;
            },
            setFitWide: function () {
                wide = !wide;
                console.log("set fit wide ");
                console.log(wide);
            }
        };
    });
    tabLabApp.service('sliderProperties', function (){
        var shoeIndex;
        var tabOneIndex;
        var tabTwoIndex;

        return {
            getShoeIndex: function () {
                console.log("returning shoe index: ");
                console.log(shoeIndex);
                return shoeIndex;
            },
            setShoeIndex: function (index) {
                shoeIndex = index;
                console.log("setShoeIndex: ");
                console.log(shoeIndex);
            },
            getTabIndex: function (tabNum) {
                var tabIndex;
                console.log("returning tab index: ");
                if(tabNum == 1) {
                    tabIndex = tabOneIndex;
                    console.log("tabOneIndex=" + tabIndex);
                }else{
                    tabIndex = tabTwoIndex;
                    console.log("tabTwoIndex=" + tabIndex);
                }
                return tabIndex;
            },
            setTabIndex: function (tabNum, index) {
                console.log("set tab index: ");
                if(tabNum == 1) {
                    tabOneIndex = index;
                    console.log("tabOneIndex=" + tabOneIndex);
                }else{
                    tabTwoIndex = index;
                    console.log("tabTwoIndex=" + tabTwoIndex);
                }// end if-else
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
            'tabLabProperties',
            'sizeProperties',
            'sliderProperties',
            function ($scope, $http, $mdDialog, $mdToast, $animate, $window, tabLabProperties, sizeProperties, sliderProperties) {

                // Tabs on canvas List Arrays
                $scope.tabs = {};
                $scope.tabs.left = {};
                $scope.tabs.left.price = 0;
                $scope.tabs.right = {};
                $scope.tabs.right.price = 0;

                $scope.shoeSelected = {};
                $scope.shoeSelected.tab = {};
                $scope.shoeSelected.tab.left = {};
                $scope.shoeSelected.tab.right = {};
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
                $scope.numOfShoes = 1;

                $scope.shoeIndex=0;
                $scope.shoeIndexNew=0;

                $scope.rightTabIndex=0;
                $scope.rTindex=0;

                $scope.leftTabIndex=0;
                $scope.lTindex=0;

                $scope.loadMenu = function (list, shoeBool ){
                    for(var i = 0; i < list.length ; i++){
                        list[i].menuImg = new Image();
                        list[i].menuImg.src=list[i].menuImgUrl;
                    }// end for
                    return list;
                }// end preLoader()

                $scope.setShoe = function(shoe){
                    tabLabProperties.setShoeSelected(shoe);
                };

                $scope.setRandomIndex = function (type, pos){
                    if(type == 'shoe'){
                        sliderProperties.setShoeIndex(Math.floor(Math.random() * $scope.numOfShoes));
                    } else{
                        sliderProperties.setTabIndex(pos, Math.floor(Math.random() * $scope.numOfTabs));
                    }
                };// end setRandomIndex()

                $scope.isIndexSet = function() {
                    // returns shoe index or null if not set
                    return sliderProperties.getShoeIndex();
                };

                $scope.loadShoeStyle = function (file) {

                    $http.get(file).success(function (data) {
                        $scope.shoeList = data;
                        $scope.shoeList = $scope.loadMenu($scope.shoeList, true);
                        $scope.numOfShoes = $scope.shoeList.length;
                        $scope.loaded.push('shoeList');
                    });
                };// end loadShoeStyle()

                $scope.loadTabStyles = function (file) {

                    $http.get(file).success(function (data) {
                        $scope.tabList = data;
                        $scope.tabList = $scope.loadMenu($scope.tabList, false);
                        $scope.numOfTabs = $scope.tabList.length;
                        $scope.loaded.push('tabList');
                    });
                };// end loadTabStyles()

                $scope.initializeSelected = function (){
                    if($scope.loaded.indexOf('shoeList') && $scope.loaded.indexOf('shoeList') != -1) {
                        $scope.setRandomIndex('shoe', 0);
                        $scope.setRandomIndex('tab', 1);
                        $scope.setRandomIndex('tab', 2);
                        var sliderIndexSelected = false;
                        while (!sliderIndexSelected) {
                            var i = $scope.isIndexSet();
                            if (i >= 0) {
                                sliderIndexSelected = true;
                            }
                        }// end while

                        $scope.shoeSelected = $scope.shoeList[i];
                        console.log("loaded: ");
                        console.log($scope.shoeSelected);
                        $scope.setShoe($scope.shoeSelected);
                    }else {
                        // wait until all is loaded
                        setTimeout($scope.initializeSelected, 500); // check again in a .5 second
                    }// end else-if
                };

                $scope.loaded = [];

                $scope.initLoad = function () {

                    $http.get('assets/data/shoeStyles.json').success(function (data) {
                        $scope.shoeStyles = data;
                        $scope.loaded.push('shoeStyles');
                    });
                    $http.get('assets/data/shoeSizes.json').success(function (data) {
                        $scope.shoeSizeOptions = data;
                        $scope.loaded.push('shoeSizeOptions');
                    });
                    $http.get('assets/data/tabSizes.json').success(function (data) {
                        $scope.tabSizeOptions = data;
                        $scope.loaded.push('tabSizeOptions');
                    });
                    $scope.shoeStyleFile = 'assets/data/shoes_max.json';
                    $scope.loadShoeStyle($scope.shoeStyleFile);
                    $scope.tabsFile = 'assets/data/tabs.json';
                    $scope.loadTabStyles($scope.tabsFile);
                    $scope.initializeSelected();

                } // end initLoad()

                /*
                    START Canvas Drawing

                 */


                $scope.container = document.querySelector('.tablab-viewer');
                $scope.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
                $scope.clock = new THREE.Clock();
                $scope.scene = new THREE.Scene();
                $scope.camera;

                $scope.loader;
                $scope.WIDTH = 600;
                $scope.HEIGHT = 600;

                var VIEW_ANGLE = 45;
                var ASPECT = $scope.WIDTH / $scope.HEIGHT;
                var NEAR = 1;
                var FAR = 100;

                $scope.mesh;
                $scope.oldMesh


                var mobileScaleFactor = .41;
                var mobileScaleFactorWide = .27;
                var smartphoneScaleFactor = .85;
                var smartphoneScaleFactorWide = .27;
                var tabletScaleFactor = .6;
                var tabletScaleFactorWide = .5;
                var defaultScaleFactor = .8;

                $scope.scaleFactor = 1;
                $scope.tabScaleFactorOffset = 1.25;
                $scope.isMobile = false;
                $scope.cWidth = 0; // canvas width

                $scope.isMobileScreen = function (){
                    return $scope.isMobile;
                }; //end isMobileScreen()

                $scope.calculateCanvasWidth = function (){
                    var iWidth = window.innerWidth;
                    console.log ( "innerWidth " + window.innerWidth);
                    var wScaleFactor = .96; // canvas border % on mobile set in styles
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
                };

                $scope.setAllCanvasWidthsAndHeight = function (x, y){
                    $scope.cWidth = $scope.calculateCanvasWidth(); // canvas calculated width

                    //x and y is used in case canvas is not a square
                    $scope.WIDTH = $scope.cWidth+x;
                    $scope.HEIGHT = $scope.cWidth+y;
                };

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
                }; //end checkWindowSize()

                $scope.createScene = function (){
                    $scope.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
                    $scope.camera.position.set(0, 1, 10);
                  //  $scope.camera.rotation.x = -Math.PI / 12;
                    $scope.addLight();
                    $scope.scene.add($scope.camera);
                    $scope.renderer.setSize($scope.WIDTH, $scope.HEIGHT);
                //    $scope.renderer.shadowMapEnabled = false;
                //    $scope.renderer.shadowMapSoft = true;
                //    $scope.renderer.shadowMapType = THREE.PCFShadowMap;
                //    $scope.renderer.shadowMapAutoUpdate = true;
                    $scope.renderer.setClearColor(0xffffff, 1);
                    $scope.container.appendChild($scope.renderer.domElement);


                };

                $scope.addLight = function (scene){
                    var lightKey = new THREE.DirectionalLight(0xffffff);
                    lightKey.position.set(5, 5, 5);
                    lightKey.castShadow = false;

                   lightKey.target.position.x = 0;
                    lightKey.target.position.y = 0;
                    lightKey.target.position.z = 0;

                    lightKey.intensity = .6;
                    $scope.scene.add(lightKey);


                    var lightFill = new THREE.DirectionalLight(0xffffff);
                    lightFill.position.set(-5, 5, 5);
                    lightFill.intensity = .3;
                    lightFill.castShadow = false;
                    $scope.scene.add(lightFill);

                    var lightRim = new THREE.DirectionalLight(0xffffff);
                    lightRim.position.set(0, 5, 50);
                    lightRim.intensity = .3;
                    lightRim.castShadow = false;
                    $scope.scene.add(lightRim);


                };

                $scope.render = function (mesh) {
                    var time = $scope.clock.getElapsedTime();
                    mesh.rotation.y += .01;

                    $scope.renderer.render($scope.scene, $scope.camera);
                    requestAnimationFrame($scope.render);
                };

                $scope.getShoe = function(shoe){
                    var shoeSelected = tabLabProperties.getShoe();
                    console.log("shoe selected !!: ");
                    console.log(shoeSelected);
                    return shoeSelected;
                };


                $scope.drawShoe = function (scene, mesh, side, x){
                    // load shoe
                    var meshPath = 'assets/models/' + $scope.shoeSelected.name + '/' + $scope.shoeSelected.name;
                    var texturePath = 'assets/models/texture/shoe/' + $scope.shoeSelected.name + '/' + side + '/' +$scope.shoeSelected.color;
                    var loader = new THREE.JSONLoader();

                    loader.load(meshPath + '-shoe-'+ side + '.js', function (geometry, materials) {
                        var material = new THREE.MeshPhongMaterial({
                            map: THREE.ImageUtils.loadTexture(texturePath + '/Difuse.jpg'),
                            normalMap: THREE.ImageUtils.loadTexture( texturePath + '/Normal.jpg' ),
                            normalScale: new THREE.Vector2( 0.6, 0.6 ),
                            colorAmbient: [0.480000026226044, 0.480000026226044, 0.480000026226044],
                            colorDiffuse: [0.480000026226044, 0.480000026226044, 0.480000026226044],
                            colorSpecular: [0.8999999761581421, 0.8999999761581421, 0.8999999761581421],
                            shininess: 15
                        });

                        mesh = new THREE.Mesh(
                            geometry,
                            material
                        );

                        mesh.receiveShadow = false;
                        mesh.castShadow = false;
                        mesh.rotation.y = 3*Math.PI/4;
                     //   mesh.scale.multiplyScalar(3);
                        mesh.position.x = x;
                        mesh.position.y = 0;
                        mesh.position.z = 0;

                        $scope.scene.add(mesh);
                        $scope.render(mesh);
                        $scope.oldMesh = mesh;

                    });

                };

                $scope.drawTabs = function (scene, mesh, side, isDefault){
                    var def = '';
                    if(isDefault){
                        def = 'default';
                    }

                    // load tab
                    var meshPath = 'assets/models/' + $scope.shoeSelected.name + '/' + $scope.shoeSelected.name;
                    var texturePath = 'assets/models/texture/shoe/' + $scope.shoeSelected.name + '/tabs/' + def + '/' + $scope.tabSelected.name;
                    var loader = new THREE.JSONLoader();

                    loader.load(meshPath + '-tab-'+ side + '.js', function (geometry, materials) {
                        var material = new THREE.MeshPhongMaterial({
                            map: THREE.ImageUtils.loadTexture(texturePath + '/Difuse.jpg'),
                            normalMap: THREE.ImageUtils.loadTexture( texturePath + '/Normal.jpg' ),
                            normalScale: new THREE.Vector2( 0.6, 0.6 ),
                            colorAmbient: [0.480000026226044, 0.480000026226044, 0.480000026226044],
                            colorDiffuse: [0.480000026226044, 0.480000026226044, 0.480000026226044],
                            colorSpecular: [0.8999999761581421, 0.8999999761581421, 0.8999999761581421],
                            shininess: 15
                        });

                        mesh = new THREE.Mesh(
                            geometry,
                            material
                        );

                        mesh.receiveShadow = false;
                        mesh.castShadow = false;
                        mesh.rotation.y = 3*Math.PI/4;
                        //   mesh.scale.multiplyScalar(3);
                      //  mesh.position.x = x;
                      //  mesh.position.y = 0;
                      //  mesh.position.z = 0;

                        $scope.scene.add(mesh);
                        $scope.render(mesh);
                        $scope.oldMesh = mesh;

                    });

                };


                var checkIfShoeHasBeenSet = function(){
                    if(tabLabProperties.isShoeSelected()){
                        $scope.drawShoe($scope.scene, $scope.mesh, 'left', 1.5);
                        $scope.drawShoe($scope.scene, $scope.mesh, 'right', -1.5);
                    }
                    else {
                        setTimeout(checkIfShoeHasBeenSet, 500); // check again in a .5 second
                    }
                };

                // When the page first loads
                window.onload = function (){
                    $scope.findAndSetCanvasDimensions();
                    $scope.createScene();
                    $scope.initLoad();
                    checkIfShoeHasBeenSet();
                };

                // When the browser changes size
                window.onresize = function (){
                    $scope.findAndSetCanvasDimensions();
                    $scope.drawShoe($scope.scene, $scope.mesh, 'left', 1.5);
                    $scope.drawShoe($scope.scene, $scope.mesh, 'right', -1.5);
                }

                /*
                    END Canvas Drawing
                 */




                /*                                 */
                /* helper function to clear canvas */
                /*                                 */

                $scope.setDefaultTabs = function (){
                    $scope.shoeSelected.tab.left.top = $scope.tabs[0].top;
                    $scope.shoeSelected.tab.left.bottom = $scope.tabs[0].bottom;
                    $scope.shoeSelected.tab.right.top = $scope.tabs[1].top;
                    $scope.shoeSelected.tab.right.bottom = $scope.tabs[1].bottom;
                }


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
