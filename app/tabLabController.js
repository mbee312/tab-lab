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
                return shoeSelected;
            },
            setShoeSelected: function(shoe) {
                shoeSelected = shoe;
                isShoeSelected = true;
            },
            isShoeSelected: function () {
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
                return tabs[pos];
            },
            setTabSelected: function(tab, shoePos) {
                tabs[shoePos] = tab;
            },
            isTabSelected: function (pos) {
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
                return shoeSize;
            },
            setShoeSize: function (size) {
                shoeSize = size;
            },
            getTabSize: function () {
                return tabSize;
            },
            setTabSize: function (size) {
                shoeSize = size;
            },
            getFitWide: function () {
                return wide;
            },
            setFitWide: function () {
                wide = !wide;
            }
        };
    });
    tabLabApp.service('sliderProperties', function (){
        var shoeIndex;
        var tabIndex = [];
        var numOfShoes;
        var numOfTabs;

        return {
            getShoeIndex: function () {
                return shoeIndex;
            },
            setShoeIndex: function (index) {
                shoeIndex = index;
            },
            getTabIndex: function (pos) {
                return tabIndex[pos];
            },
            setTabIndex: function (pos, index) {
                tabIndex[pos] = index;
            },
            getNumOfShoes: function () {
                return numOfShoes;
            },
            setNumOfShoes: function (number) {
                numOfShoes = number;
            },
            getNumOfTabs: function () {
                return numOfTabs;
            },
            setNumOfTabs: function (number) {
                numOfTabs = number;
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

                $scope.MENUIMGPATH = "assets/media/thumbnails/";
                // Tabs on canvas List Arrays
                $scope.tabs = {};
                $scope.tabs.left = {};
                $scope.tabs.left.price = 0;
                $scope.tabs.right = {};
                $scope.tabs.right.price = 0;

                $scope.styleName = "emme";
                $scope.shoeMesh = {};
                $scope.currentShoeObj = {};
                $scope.tabMesh = {};
                $scope.currentTabObj = {};


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


                $scope.shoeIndex=0;
                $scope.shoeIndexNew=1;

                $scope.rightTabIndex=0;
                $scope.rTindex=1;

                $scope.leftTabIndex=0;
                $scope.lTindex=1;


                var loadNormals = function (){
                    var s;
                    var texturePathLeft;
                    var texturePathRight;
                    var imgMap = {};
                    var imgNormalMap = {};
                    var i;
                    for (i = 0 ; i < getNumOfShoesInList() ; i++ ){
                        s = $scope.shoeList[i];
                        $scope.shoeList[i].map = [];
                        $scope.shoeList[i].normalMap = [];

                        texturePathLeft = 'assets/models/texture/shoe/' + s.name + '/left/' + s.color;
                        texturePathRight = 'assets/models/texture/shoe/' + s.name + '/right/' + s.color;
                        imgMap['left'] = new Image();
                        imgMap['left'].src = texturePathLeft + '/Difuse.jpg';
                        $scope.shoeList[i].map['left'] =  imgMap['left'];

                        imgMap['right'] = new Image();
                        imgMap['right'].src = texturePathRight + '/Difuse.jpg';
                        $scope.shoeList[i].map['right'] =  imgMap['right'];

                        imgNormalMap['left'] = new Image();
                        imgNormalMap['left'].src = texturePathLeft + '/Normal.jpg';
                        $scope.shoeList[i].normalMap['left'] = imgNormalMap['left'];

                        imgNormalMap['right'] = new Image();
                        imgNormalMap['right'].src = texturePathRight + '/Normal.jpg';
                        $scope.shoeList[i].normalMap['right'] = imgNormalMap['right'];
                    }
                };

                $scope.loadMenu = function (list, shoesOrTabs ){
                    for(var i = 0; i < list.length ; i++){
                        list[i].menuImg = new Image();
                        list[i].menuImg.src= $scope.MENUIMGPATH + shoesOrTabs + '/' + list[i].name + '-' + list[i].color + '.jpg';
                    }// end for
                    return list;
                }// end loadMenu()

                var setNumOfShoesInList = function (number){
                    sliderProperties.setNumOfShoes(number);
                };

                var getNumOfShoesInList = function (){
                    return sliderProperties.getNumOfShoes();
                };

                var setNumOfTabsInList = function (number){
                    sliderProperties.setNumOfTabs(number);
                };

                var getNumOfTabsInList = function (){
                    return sliderProperties.getNumOfTabs();
                };

                $scope.loadShoeStyle = function (file) {

                    $http.get(file).success(function (data) {
                        $scope.shoeList = data;
                        $scope.shoeList = $scope.loadMenu($scope.shoeList, 'shoes');
                        setNumOfShoesInList($scope.shoeList.length);
                        loadNormals();
                        $scope.loaded.push('shoeList');
                    });
                };// end loadShoeStyle()

                $scope.loadTabStyles = function (file) {

                    $http.get(file).success(function (data) {
                        $scope.tabList = data;
                        $scope.tabList = $scope.loadMenu($scope.tabList, 'tabs');
                        setNumOfTabsInList($scope.tabList.length);
                        $scope.loaded.push('tabList');
                    });
                };// end loadTabStyles()

                $scope.setRandomIndex = function (type, pos){
                    if(type == 'shoe'){
                        sliderProperties.setShoeIndex(Math.floor(Math.random() * getNumOfShoesInList()));
                    } else{
                        // if right shoe
                        if(pos == 0) {
                            sliderProperties.setTabIndex(0, Math.floor(Math.random() * getNumOfTabsInList()));
                            sliderProperties.setTabIndex(2, sliderProperties.getTabIndex(0));

                            //else left shoe
                        }else{
                            sliderProperties.setTabIndex(1, Math.floor(Math.random() * getNumOfTabsInList()));
                            sliderProperties.setTabIndex(3, sliderProperties.getTabIndex(1));
                        }
                    }
                };// end setRandomIndex()

                $scope.getShoeIndex = function() {
                    // returns shoe index or null if not set
                    return sliderProperties.getShoeIndex();
                };

                $scope.getTabIndex = function(pos) {
                    // returns shoe index or null if not set
                    return sliderProperties.getTabIndex(pos);
                };

                var getShoe = function(){
                    return tabLabProperties.getShoe();
                };

                var getTab = function (pos){
                    return tabLabProperties.getTab(pos);
                };

                $scope.setShoe = function(shoe){
                    tabLabProperties.setShoeSelected(shoe);
                };

                $scope.setTab = function(tab, shoePos){
                    tabLabProperties.setTabSelected(tab, shoePos);
                };

                $scope.initializeSelected = function (){
                    if($scope.loaded.indexOf('shoeList') && $scope.loaded.indexOf('tabList') != -1) {
                        $scope.setRandomIndex('shoe', 0);
                        $scope.setRandomIndex('tab', 0);
                        $scope.setRandomIndex('tab', 1);
                        var sliderIndexesSelected = false;
                        var i = $scope.getShoeIndex();
                        var j = $scope.getTabIndex(0);
                        var k = $scope.getTabIndex(1);

                        // set initial shoe
                        $scope.setShoe($scope.shoeList[i]);

                        // set initial tabs
                        $scope.setTab($scope.tabList[j], 0);
                        $scope.setTab($scope.tabList[j], 2);
                        $scope.setTab($scope.tabList[k], 1);
                        $scope.setTab($scope.tabList[k], 3);

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
                    $http.get('assets/data/attributes.json').success(function (data) {
                        $scope.attributeOptions = data;
                        $scope.loaded.push('attributeOptions');
                    });
                    $scope.shoeStyleFile = 'assets/data/shoes.json';
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
                }; //end findAndSetCanvasDimensions()

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

                }; //end getImageNaturalDimensionsAndScale ()

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

                var checkIfShoeHasBeenSet = function(){
                    if(tabLabProperties.isShoeSelected()){
                        var s = tabLabProperties.getShoe();
                        $scope.drawShoe($scope.scene, 'left', 1.5);
                        $scope.drawShoe($scope.scene, 'right', -1.5);

                        // redraw tabs
                        $scope.drawTabs($scope.scene, 0, -1.5, 0, 0);
                        $scope.drawTabs($scope.scene, 1, 1.5, 0, 0);
                        $scope.drawTabs($scope.scene, 2, -1.5, 0, 0);
                        $scope.drawTabs($scope.scene, 3, 1.5, 0, 0);

                    }else {
                        setTimeout(checkIfShoeHasBeenSet, 500); // check again in a .5 second
                    }//end if-else
                };

                $scope.removeFromScene = function (scene, obj) {
                    var removeMeObj = scene.getObjectByName(obj.name);
                    console.log("removed from scene");
                    console.log(removeMeObj);
                    $scope.scene.remove(removeMeObj);

                };

                $scope.updateShoe = function (scene, side, styleChange){

                    var s = getShoe();

                    // load path
                    var texturePath = 'assets/models/texture/shoe/' + s.name + '/' + side + '/' + s.color;
                    var loader = new THREE.JSONLoader();


                    $scope.shoeMesh['\'' + side +'\'' ].material.map = THREE.ImageUtils.loadTexture( texturePath + '/Difuse.jpg' );
                    $scope.shoeMesh['\'' + side +'\'' ].material.normalMap = THREE.ImageUtils.loadTexture( texturePath + '/Normal.jpg' );
                    $scope.shoeMesh['\'' + side +'\'' ].material.needsUpdate = true;
                };

                $scope.updateTabs= function (scene, pos){
                    var shoe = getShoe();
                    var tab = getTab(pos);

                    var whichTab = 'top';

                    if(pos == 2 ||  pos == 3){
                        whichTab = 'bottom';
                    }

                    // load path
                    var texturePath = 'assets/models/texture/tabs/' + tab.name + '-' + tab.color;

                    $scope.tabMesh[pos].material.map = THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + whichTab + '.jpg');
                    $scope.tabMesh[pos].material.normalMap = THREE.ImageUtils.loadTexture( texturePath + '/normals-' + whichTab + '.jpg' );
                    $scope.tabMesh[pos].material.needsUpdate = true;
                };

                $scope.drawShoe = function (scene, side, x){
                    //first remove current shoe
                    if(_.isEmpty($scope.currentShoeObj) == false) {
                        $scope.removeFromScene(scene, $scope.currentShoeObj['\'' + side + '\'']);
                    }
                    console.log(scene);

                    var s = getShoe();

                    // load shoe
                    var shoePath = 'assets/models/' + s.name + '/' + s.name;
                    var loader = new THREE.JSONLoader();

                    loader.load(shoePath + '-shoe-'+ side + '.js', function (geometry, materials) {
                        var material = new THREE.MeshPhongMaterial({
                            map: THREE.ImageUtils.loadTexture(s.map[side].src),
                            normalMap: THREE.ImageUtils.loadTexture(s.normalMap[side].src),
                            normalScale: new THREE.Vector2( 0.6, 0.6 ),
                            shininess: 15
                        });

                        geometry.dynamic = true;

                        $scope.shoeMesh['\'' + side +'\'' ] = new THREE.Mesh(
                            geometry,
                            material
                        );

                        $scope.shoeMesh['\'' + side +'\'' ].receiveShadow = false;
                        $scope.shoeMesh['\'' + side +'\'' ].castShadow = true;
                        $scope.shoeMesh['\'' + side +'\'' ].rotation.y = 3*Math.PI/4;
                        //   mesh.scale.multiplyScalar(3);
                        $scope.shoeMesh['\'' + side +'\'' ].position.x = x;
                        $scope.shoeMesh['\'' + side +'\'' ].position.y = 0;
                        $scope.shoeMesh['\'' + side +'\'' ].position.z = 0;

                        scene.add($scope.shoeMesh['\'' + side +'\'' ]);
                        $scope.render($scope.shoeMesh['\'' + side +'\'' ]);

                        // remember current shoe object
                        $scope.currentShoeObj['\'' + side +'\'' ] = $scope.shoeMesh['\'' + side +'\'' ];
                        $scope.currentShoeObj['\'' + side +'\''].name = s.name + '-' + s.color;
                    });

                };

                $scope.drawTabs = function (scene, pos, x, y, z){
                    var shoe = getShoe();
                    var tab = getTab(pos);
                    var whichTab = 'top';
                    var side = 'left';

                    if(pos == 0 || pos == 2){
                        side = 'right';
                    }

                    if(pos == 2 ||  pos == 3){
                        whichTab = 'bottom';
                    }

                    //first remove current tab
                    if (_.isEmpty($scope.currentTabObj[pos]) == false) {
                        $scope.removeFromScene(scene, $scope.currentTabObj[pos]);
                    }

                    // load tab
                    var meshPath = 'assets/models/' + shoe.name + '/' + shoe.name;
                    var texturePath = 'assets/models/texture/tabs/' + tab.name + '-' + tab.color;
                    var loader = new THREE.JSONLoader();

                    loader.load(meshPath + '-tab-' + side + '-' + whichTab + '.js', function (geometry, materials) {
                        var material = new THREE.MeshPhongMaterial({
                            map: THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + whichTab + '.jpg'),
                            normalMap: THREE.ImageUtils.loadTexture(texturePath + '/normals-' + whichTab + '.jpg'),
                            normalScale: new THREE.Vector2(0.6, 0.6),
                            shininess: 15
                        });

                        geometry.dynamic = true;

                        $scope.tabMesh[pos] = new THREE.Mesh(
                            geometry,
                            material
                        );

                        $scope.tabMesh[pos].receiveShadow = false;
                        $scope.tabMesh[pos].castShadow = true;
                        $scope.tabMesh[pos].rotation.y = 3 * Math.PI / 4;
                        $scope.tabMesh[pos].position.x = x;
                        $scope.tabMesh[pos].position.y = y;
                        $scope.tabMesh[pos].position.z = z;

                        scene.add($scope.tabMesh[pos]);
                        $scope.render($scope.tabMesh[pos]);

                        // remember current tab object
                        $scope.currentTabObj[pos] = $scope.tabMesh[pos];
                        $scope.currentTabObj[pos].name = shoe.name + '-' + tab.name + '-' + tab.color + '-' + side;
                    });
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
                    $scope.drawShoe($scope.scene, 'left', 1.5);
                    $scope.drawShoe($scope.scene, 'right', -1.5);
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
                    var s = tabLabProperties.getShoe();
                    if (s.length > 0) {
                        console.log("popped " + s.pop().name);
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
                    return tabLabProperties.getShoe().length > 0;
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
                }; //end setTabSelectorFocus

                this.isTabSizeSelected = function () {
                    if ($scope.tabs.size.size != null) {
                        return true;
                    } else {
                        return false;
                    }
                };//end isSizeSelected ()

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



            }]);
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
