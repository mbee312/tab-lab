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
        var tabs = [];

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

            /*
             *                          Shoe Positions
             *   Tab Positions       Left(0)    Right(1)
             *   Top(0)                 0           1
             *   Bottom(1)              2           3
             *
             */

            getTab: function (pos) {
                console.log("returning tab: ");
                console.log(tabs[pos]);
                return tabs[pos];
            },
            setTabSelected: function(tab, shoePos) {
                tabs[shoePos] = tab;
                console.log("setTab: ");
                console.log(tabs[shoePos]);
            },
            isTabSelected: function (pos) {
                console.log("is tab set: ");
                console.log(tabs[pos]);
                if(tabs[pos] != null) {
                    return tabs[pos];
                }else{
                    return false;
                }//end else-if
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
        var tabIndex = [];


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
            getTabIndex: function (pos) {
                return tabIndex[pos];
            },
            setTabIndex: function (pos, index) {
                tabIndex[pos] = index;
                console.log("set tab index: " + tabIndex[pos]);
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
                $scope.tabSelected = [];

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



                $scope.setRandomIndex = function (type, pos){
                    if(type == 'shoe'){
                        sliderProperties.setShoeIndex(Math.floor(Math.random() * $scope.numOfShoes));
                    } else{
                        // if right shoe
                        if(pos == 0) {
                            sliderProperties.setTabIndex(0, Math.floor(Math.random() * $scope.numOfTabs));
                            sliderProperties.setTabIndex(2, sliderProperties.getTabIndex(0));

                            //else left shoe
                        }else{
                            sliderProperties.setTabIndex(1, Math.floor(Math.random() * $scope.numOfTabs));
                            sliderProperties.setTabIndex(3, sliderProperties.getTabIndex(1));
                        }
                    }
                };// end setRandomIndex()

                $scope.getShoeIndex = function() {
                    // returns shoe index or null if not set
                    return sliderProperties.getShoeIndex();
                };

                $scope.setShoe = function(shoe){
                    tabLabProperties.setShoeSelected(shoe);
                };

                $scope.getTabIndex = function(pos) {
                    // returns shoe index or null if not set
                    return sliderProperties.getTabIndex(pos);
                };

                $scope.setTab = function(tab, shoePos){
                    tabLabProperties.setTabSelected(tab, shoePos);
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
                        $scope.setRandomIndex('tab', 0);
                        $scope.setRandomIndex('tab', 1);
                        var sliderIndexesSelected = false;
                        var i = $scope.getShoeIndex();
                        var j = $scope.getTabIndex(0);
                        var k = $scope.getTabIndex(1);
                        console.log("indexes:" + i + " " + j + " " + k);
                        //    while (!sliderIndexesSelected) {
                        //
                        //        if (i && j && k >= 0) {
                        //            sliderIndexesSelected = true;
                        //        }
                        //   }// end while

                        // set initial shoe
                        $scope.shoeSelected = $scope.shoeList[i];
                        console.log("loaded: ");
                        console.log($scope.shoeSelected);
                        $scope.setShoe($scope.shoeSelected);

                        // set initial tabs
                        $scope.tabSelected[0] = $scope.tabList[j];
                        $scope.tabSelected[1] = $scope.tabList[k];
                        $scope.setTab($scope.tabSelected[0], 0);
                        $scope.setTab($scope.tabSelected[0], 2);
                        $scope.setTab($scope.tabSelected[1], 1);
                        $scope.setTab($scope.tabSelected[1], 3);

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
                $scope.WIDTH = 400;
                $scope.HEIGHT = 400;

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
                    $scope.WIDTH = $scope.cWidth-100;
                    $scope.HEIGHT = $scope.cWidth-100;
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
                    $scope.camera.position.set(-1, 1, 10);
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
                    // mesh.rotation.y += .01;

                    $scope.renderer.render($scope.scene, $scope.camera);
                    requestAnimationFrame($scope.render);
                };

                $scope.getShoe = function(){
                    var shoeSelected = tabLabProperties.getShoe();
                    console.log("shoe selected !!: ");
                    console.log(shoeSelected);
                    return shoeSelected;
                };


                $scope.drawShoe = function (scene, mesh, side, x){
                    var s = $scope.getShoe();

                    // load shoe
                    var meshPath = 'assets/models/' + s.name + '/' + s.name;
                    var texturePath = 'assets/models/texture/shoe/' + s.name + '/' + side + '/' + s.color;
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
                        mesh.castShadow = true;
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

                $scope.drawTabs = function (scene, mesh, s, p, wTab, x, y, z){
                    var side = 'right';
                    var pos = 'top';
                    var whichTab = 'top';
                    var shoe = $scope.getShoe();

                    if(s == 1){
                        side = 'left';
                    }

                    if(p == 1){
                        pos = 'bottom';
                    }

                    if(wTab ==  1){
                        whichTab = 'bottom';
                    }


                    // load tab
                    var meshPath = 'assets/models/' + shoe.name + '/' + shoe.name;
                    var texturePath = 'assets/models/texture/tabs/' + $scope.tabSelected[s].name + '-' + $scope.tabSelected[s].color;
                    var loader = new THREE.JSONLoader();

                    loader.load(meshPath + '-tab-'+ side + '-' + pos +'.js', function (geometry, materials) {
                        var material = new THREE.MeshPhongMaterial({
                            map: THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + whichTab + '.jpg'),
                            normalMap: THREE.ImageUtils.loadTexture( texturePath + '/normals-' + whichTab + '.jpg' ),
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
                        mesh.castShadow = true;
                        mesh.rotation.y = 3*Math.PI/4;
                        //   mesh.scale.multiplyScalar(3);
                        mesh.position.x = x;
                        mesh.position.y = y;
                        mesh.position.z = z;

                        $scope.scene.add(mesh);
                        $scope.render(mesh);
                        $scope.oldMesh = mesh;

                    });

                };


                var checkIfShoeHasBeenSet = function(){
                    if(tabLabProperties.isShoeSelected()){
                        $scope.drawShoe($scope.scene, $scope.mesh, 'left', 1.5);
                        $scope.drawShoe($scope.scene, $scope.mesh, 'right', -1.5);


                        $scope.drawTabs($scope.scene, $scope.mesh, 0, 0, 0, -1.5, 0, 0);
                        $scope.drawTabs($scope.scene, $scope.mesh, 0, 1, 1, -1.5, 0, 0);

                        $scope.drawTabs($scope.scene, $scope.mesh, 1, 0, 0, 1.5, 0, 0);
                        $scope.drawTabs($scope.scene, $scope.mesh, 1, 1, 1, 1.5, 0, 0);

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

                /**** Start Survey *********

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

                 **** End Survey *********/

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
