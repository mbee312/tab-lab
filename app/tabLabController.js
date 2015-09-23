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
    tabLabApp.service('tabLabProperties', ['$http', '$q', '$rootScope', function($http, $q, $rootScope){
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
                return shoeSelected;
            },
            isShoeSelected: function () {
                return isShoeSelected;
            },

            /*                              Heel
             *                          Shoe Positions
             *   Tab Positions   Right Shoe(0)    Left Shoe(1)
             *   Top(0)                 0           1
             *   Bottom(1)              2           3
             *                              Toe
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
            },
            getAllTabs: function () {
                return tabs;
            },
            setAllTabs: function(tabArray) {
                for( var i = 0; i < tabArray.length; i++){
                    tabs[i] = tabArray[i];
                }
            }
        };
    }]);


    tabLabApp.controller('tabLabController',
        ['$scope',
            '$rootScope',
            '$q',
            '$http',
            '$mdDialog',
            '$mdToast',
            '$animate',
            '$window',
            'tabLabProperties',
            'sizeProperties',
            'sliderProperties',
            'cartProperties',
            function ($scope, $rootScope, $q, $http, $mdDialog, $mdToast, $animate, $window, tabLabProperties, sizeProperties, sliderProperties, cartProperties) {

                $scope.MENUIMGPATH = "assets/media/thumbnails/";
                // Tabs on canvas List Arrays
                $scope.tabs = {};
                $scope.tabsSelected = [];

                $scope.shoe = {};
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
                $scope.editMode = false;
                $scope.shoeEditMode = false;
                $scope.isSizeEdit = false;
                $scope.isSizeEditRight = false;

                $scope.tabEditModeL = false;
                $scope.tabEditModeR = false;

                $scope.shoeIndex=0;
                $scope.shoeIndexNew=0;

                $scope.rightTabIndex=0;
                $scope.rTindex=0;

                $scope.leftTabIndex=0;
                $scope.lTindex=0;


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

                        texturePathLeft = 'assets/models/texture/shoe/' + s.name + '/left/' + s.sku;
                        texturePathRight = 'assets/models/texture/shoe/' + s.name + '/right/' + s.sku;
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
                        list[i].menuImg.src = '/media/catalog/product' + list[i].image_url; // $scope.MENUIMGPATH + shoesOrTabs + '/' + list[i].name + '-' + list[i].color + '.jpg';
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

                $scope.loadShoeStyle = function (data) {
                    $scope.shoeList = data;
                    $scope.shoeList = $scope.loadMenu($scope.shoeList, 'shoes');
                    setNumOfShoesInList($scope.shoeList.length);
                    loadNormals();
                    $scope.loaded.push('shoeList');
                };// end loadShoeStyle()

                $scope.loadTabStyles = function (data) {
                    $scope.tabList = data;
                    $scope.tabList = $scope.loadMenu($scope.tabList, 'tabs');
                    setNumOfTabsInList($scope.tabList.length);
                    $scope.loaded.push('tabList');
                };// end loadTabStyles()

                $scope.setRandomIndex = function (type, pos){
                    var index;
                    if(type == 'shoe'){
                        index = Math.floor(Math.random() * getNumOfShoesInList());
                        sliderProperties.setShoeIndex(index);
                        $scope.shoeIndex = index;

                    } else{
                        index = Math.floor(Math.random() * getNumOfTabsInList());
                        // if left shoe
                        if(pos == 0) {
                            sliderProperties.setTabIndex(0, index);
                            sliderProperties.setTabIndex(2, index);
                            $scope.rightTabIndex =  index;

                            //else right shoe
                        }else{
                            sliderProperties.setTabIndex(1, index);
                            sliderProperties.setTabIndex(3, index);
                            $scope.leftTabIndex =  index;
                            $rootScope.$broadcast('move-slider-tab', pos);
                        }
                    }
                    return index;
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
                    // check the simple products to make sure we have htem in stock
                    var params = [{
                        // configurable products that are shoes
                        'type':"simple",
                        'sku':{'like': shoe.sku + '-%'},
                        'status': '1'
                    }, 0, {"includeStockInfo":true}];
                    var magento = new MagentoClient();
                    magento.login().then(function() {
                        magento.call('catalog_product.list', params).then(
                            function(products) {
                                shoe.simpleProducts = products;
                                // do something with the simple products
                                if(products && products[0]) {
                                    // update the color info since we have it
                                    shoe.color = products[0].color;
                                    shoe.color_label = products[0].color_label;

                                    _.each($scope.shoeSizeOptions, function(s){
                                       var product = _.find(products, function(product) {
                                            var productSize = product.sku.split('-').pop();
                                            return s.size === productSize;
                                        });
                                        if (product) {
                                            s.disabled = (!product.is_saleable || !product.has_qty || !product.in_stock);
                                            s.show = true;
                                        }
                                        else {
                                            s.show = false;
                                        }
                                    })
//                                  $scope.$apply(function(){$scope.shoe.size = 0});
                                    $scope.shoe.size = 0;
                                    $scope.$apply(function(){$scope.shoeSizeOptions = _.toArray($scope.shoeSizeOptions)});

                                    $scope.loaded.push('shoeSizeOptions');
                                }
                            },
                            function(error) {
                                alert('Magento API error: ' + error);
                            }
                        );
                    });
                    $scope.shoeSelected = shoe;
                    $rootScope.$broadcast('move-slider-shoe', 0);
                };

                $scope.setTab = function(tab, shoePos){
                    tabLabProperties.setTabSelected(tab, shoePos);
                    $scope.tabsSelected[shoePos] = tab;
                    $rootScope.$broadcast('move-slider-tab', shoePos);
                };

                $scope.initializeSelected = function (){
                    var i = $scope.setRandomIndex('shoe', 0);
                    var j = $scope.setRandomIndex('tab', 0);
                    var k = $scope.setRandomIndex('tab', 1);

                    // set initial shoe
                    $scope.setShoe($scope.shoeList[i]);
                    var shoe = getShoe();
                    console.log("initializedSelected:");
                    console.log(shoe);

                    // set initial tabs
                    $scope.setTab($scope.tabList[j], 0);
                    $scope.setTab($scope.tabList[j], 2);
                    $scope.setTab($scope.tabList[k], 1);
                    $scope.setTab($scope.tabList[k], 3);
                };

                $scope.loaded = [];

                $scope.initLoad = function () {

                    var updateProductData = function(products, productData) {
                        _.each(products, function(product, productIndex) {
                            _.extend(product, productData[product.sku.substr(0,3)] || {});
                        })
                    }

                    // load products
                    var loadConfigurableProductsFromSkus = function(skus, productData, callback) {
                        var deferred = $q.defer();
                        var params = [{
                            // configurable products that are shoes
                            'sku':{'in':skus},
                            'type': 'configurable',
                            'status': '1'
                        }];
                        var magento = new MagentoClient();
                        magento.login().then(function() {
                            magento.call('catalog_product.list', params).then(
                                function(products) {
                                    updateProductData(products, productData);
                                    callback(products);
                                    deferred.resolve(products);
                                },
                                function(error) {
                                    alert('Magento API error: ' + error);
                                    deferred.reject('Magento API error: ' + error);
                                }
                            );
                        });
                        return deferred.promise;
                    }

                    $http.get('assets/data/data.json').success(function (data) {
                        $scope.dataOptions = data;
                        $scope.loaded.push('dataOptions');
                        $scope.shoeSizeOptions = data.shoeSizes;
                        $scope.loaded.push('shoeSizeOptions');
                        $scope.tabSizeOptions = data.tabSizes;
                        $scope.loaded.push('tabSizeOptions');

                        var shoePromise = loadConfigurableProductsFromSkus(data.shoeSkus, data.shoeData, function(shoes) {
                            $scope.loadShoeStyle(shoes);
                        });
                        var tabPromise = loadConfigurableProductsFromSkus(data.tabSkus, {}, function(tabs) {
                            $scope.loadTabStyles(tabs);
                        });
                        $q.all([shoePromise, tabPromise]).then(function(data){
                            $scope.initializeSelected();
                            $scope.createScene();
                            initDrawScene();
                        });
                    });
                } // end initLoad()

                /*
                 START Canvas Drawing

                 */
                $scope.container = document.querySelector('.tablab-viewer');
                $scope.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
                $scope.clock = new THREE.Clock();
                $scope.scene;
                $scope.camera;

                $scope.loader;
                $scope.WIDTH = 400;
                $scope.HEIGHT = 400;
                $scope.group = new THREE.Object3D();
                var text;
                var plane;

                var targetRotationX = 0;
                var targetRotationOnMouseDownX = 0;

                var targetRotationY = 0;
                var targetRotationOnMouseDownY = 0;

                var mouseX = 0;
                var mouseXOnMouseDown = 0;

                var mouseY = 0;
                var mouseYOnMouseDown = 0;

                var windowHalfX = window.innerWidth / 2;
                var windowHalfY = window.innerHeight / 2;

                var finalRotationY;

                var VIEW_ANGLE = 45;
                var ASPECT = $scope.WIDTH / $scope.HEIGHT;
                var NEAR = 1;
                var FAR = 100;
                $scope.isMobile = false;

                $scope.isMobileScreen = function (){
                    return $scope.isMobile;
                }; //end isMobileScreen()

                $scope.findAndSetCanvasDimensions = function(){
                    $scope.isMobile = true;

                    var windowWidth = window.innerWidth;

                    if(windowWidth < 321){
                        $scope.WIDTH = windowWidth*0.93;
                        $scope.HEIGHT = windowWidth*0.93;

                        // iphone 6 portrait
                    }else if(windowWidth < 376) {
                        $scope.WIDTH = windowWidth*0.94;
                        $scope.HEIGHT = windowWidth*0.94;

                        // iphone 6 Plus portrait
                    }else if(windowWidth < 415) {
                        $scope.WIDTH = windowWidth * 0.90;
                        $scope.HEIGHT = windowWidth * 0.90;

                    }else if(windowWidth < 468){
                            $scope.WIDTH = windowWidth*0.80;
                            $scope.HEIGHT = windowWidth*0.80;

                        // iphone 4 landscape
                    } else if (windowWidth < 481){
                        $scope.WIDTH = windowWidth*0.39;
                        $scope.HEIGHT = windowWidth*0.39;

                        // iphone 5 landscape
                    } else if (windowWidth < 569){
                        $scope.WIDTH = windowWidth*0.39;
                        $scope.HEIGHT = windowWidth*0.39;

                        // Samsung Galaxy Note II landscape
                    } else if (windowWidth < 641){
                        $scope.WIDTH = windowWidth*0.39;
                        $scope.HEIGHT = windowWidth*0.39;

                        // iphone 6 landscape
                    } else if (windowWidth < 668){
                        $scope.WIDTH = windowWidth*0.44;
                        $scope.HEIGHT = windowWidth*0.44;

                        // iphone 6 Plus landscape
                    } else if (windowWidth < 739){
                        $scope.WIDTH = windowWidth*0.44;
                        $scope.HEIGHT = windowWidth*0.44;

                        // iPad Mini Portrait
                    } else if(windowWidth < 769){
                        $scope.isMobile = false;
                        $scope.WIDTH = windowWidth*0.48;
                        $scope.HEIGHT = windowWidth*0.48;

                        // the rest of the desktop screens
                    }else if(window.innerWidth < 1025){
                        $scope.isMobile = false;
                        $scope.WIDTH = windowWidth*0.44;
                        $scope.HEIGHT = windowWidth*0.44;
                    }else if(window.innerWidth < 1201){
                        $scope.isMobile = false;
                        $scope.WIDTH = windowWidth*0.38;
                        $scope.HEIGHT = windowWidth*0.38;
                    }else{
                        $scope.isMobile = false;
                        $scope.WIDTH = windowWidth*0.38;
                        $scope.HEIGHT = windowWidth*0.38;
                    } //end if-else
                }; //end findAndSetCanvasDimensions()

                $scope.createScene = function (){
                    $scope.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
                    $scope.camera.position.set(-1, 1, 9.8);
                    //  $scope.camera.rotation.x = -Math.PI / 12;
                    $scope.scene = new THREE.Scene();
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
                    lightRim.position.set(0, 5, -3);
                    lightRim.intensity = .3;
                    lightRim.castShadow = false;
                    $scope.scene.add(lightRim);

                    var lightBottom = new THREE.DirectionalLight(0xffffff);
                    lightBottom.position.set(0, -5, 0);
                    lightBottom.intensity = .6;
                    lightBottom.castShadow = false;
                    $scope.scene.add(lightBottom);

                    var lightAmbient = lightKey = new THREE.AmbientLight(0x2b2b2a);
                    $scope.scene.add(lightAmbient);
                    $scope.scene.add($scope.camera);
                    $scope.renderer.setSize($scope.WIDTH, $scope.HEIGHT);
                    //    $scope.renderer.shadowMapEnabled = false;
                    //    $scope.renderer.shadowMapSoft = true;
                    //    $scope.renderer.shadowMapType = THREE.PCFShadowMap;
                    //    $scope.renderer.shadowMapAutoUpdate = true;
                    $scope.renderer.setClearColor(0xffffff, 1);
                    $scope.container.appendChild($scope.renderer.domElement);
                };

                $scope.render = function () {
                    //horizontal rotation
                    $scope.group.rotation.y += ( targetRotationX - $scope.group.rotation.y ) * 0.1;

                    //vertical rotation
                    finalRotationY = (targetRotationY - $scope.group.rotation.x);

                    if ($scope.group.rotation.x  <= 1 && $scope.group.rotation.x >= -1 ) {

                        $scope.group.rotation.x += finalRotationY * 0.1;
                    }
                    if ($scope.group.rotation.x  > 1 ) {

                        $scope.group.rotation.x = 1
                    }

                    if ($scope.group.rotation.x  < -1 ) {

                        $scope.group.rotation.x = -1
                    }

                    $scope.renderer.render($scope.scene, $scope.camera);
                    requestAnimationFrame($scope.render);
                };

                function initDrawScene (){
                    if(tabLabProperties.isShoeSelected()){
                        var s = tabLabProperties.getShoe();

                        // load left shoe
                        var shoePath = 'assets/models/' + s.name + '/' + s.name;
                        var loader = new THREE.JSONLoader();
                        var textureMap = THREE.ImageUtils.loadTexture(s.map['left'].src);
                        var normalMap = THREE.ImageUtils.loadTexture(s.normalMap['left'].src);

                        loader.load(shoePath + '-shoe-'+ 'left' + '.js', function (geometry, materials) {
                            var material = new THREE.MeshPhongMaterial({map: textureMap, normalMap: normalMap, shininess: 35});
                            geometry.dynamic = true;
                            $scope.shoeMesh['left'] = new THREE.Mesh(
                                geometry,
                                material
                            );
                            $scope.shoeMesh['left'].receiveShadow = false;
                            $scope.shoeMesh['left'].castShadow = false;
                            $scope.shoeMesh['left'].rotation.y = 3*Math.PI/4;
                            $scope.shoeMesh['left'].position.x = 1.5;
                            $scope.shoeMesh['left'].position.y = 0;
                            $scope.shoeMesh['left' ].position.z = 0;
                            $scope.group.add($scope.shoeMesh['left']);
                        });


                        // load right shoe
                        textureMap = THREE.ImageUtils.loadTexture(s.map['right'].src);
                        normalMap = THREE.ImageUtils.loadTexture(s.normalMap['right'].src);

                        loader.load(shoePath + '-shoe-'+ 'right' + '.js', function (geometry, materials) {
                            var material = new THREE.MeshPhongMaterial({map: textureMap, normalMap: normalMap, shininess: 35});
                            geometry.dynamic = true;
                            $scope.shoeMesh['right' ] = new THREE.Mesh(geometry, material);
                            $scope.shoeMesh['right'].receiveShadow = false;
                            $scope.shoeMesh['right'].castShadow = false;
                            $scope.shoeMesh['right'].rotation.y = 3*Math.PI/4;
                            $scope.shoeMesh['right'].position.x = -1.5;
                            $scope.shoeMesh['right'].position.y = 0;
                            $scope.shoeMesh['right'].position.z = 0;
                            $scope.group.add($scope.shoeMesh['right']);
                        });

                        // draw tabs
                        initDrawTabHelper($scope.scene, 0, -1.5, 0, 0);
                        initDrawTabHelper($scope.scene, 1, 1.5, 0, 0);
                        if(s.numOfTabs != 2) {
                            initDrawTabHelper($scope.scene, 2, -1.5, 0, 0);
                            initDrawTabHelper($scope.scene, 3, 1.5, 0, 0);
                        }else{
                            //remove current bottom tabs
                            if (_.isEmpty($scope.currentTabObj[2]) == false) {
                                $scope.removeFromScene($scope.scene, $scope.currentTabObj[2]);
                            }
                            if (_.isEmpty($scope.currentTabObj[3]) == false) {
                                $scope.removeFromScene($scope.scene, $scope.currentTabObj[3]);
                            }
                        }
                    }else {
                        setTimeout(initDrawScene, 500); // check again in a .5 second
                    }//end if-else
                    $scope.scene.add($scope.group);
                    $scope.render();
                    console.log("in my group: ");
                    console.log($scope.group);
                    console.log("in my scene: ");
                    console.log($scope.scene);
                }

                function initDrawTabHelper(scene, pos, x, y, z){
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

                    // load tab
                    var meshPath = 'assets/models/' + shoe.name + '/' + shoe.name;
                    var texturePath = 'assets/models/texture/tabs/' + tab.sku;
                    var textureMap = THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + whichTab + '.jpg');
                    var normalMap = THREE.ImageUtils.loadTexture(texturePath + '/normals-' + whichTab + '.jpg');
                    var loader = new THREE.JSONLoader();

                    loader.load(meshPath + '-tab-' + side + '-' + whichTab + '.js', function (geometry, materials) {
                        var material = new THREE.MeshPhongMaterial({map: textureMap, normalMap: normalMap, shininess: 35});
                        geometry.dynamic = true;
                        $scope.tabMesh[pos] = new THREE.Mesh(geometry, material);
                        $scope.tabMesh[pos].receiveShadow = false;
                        $scope.tabMesh[pos].castShadow = false;
                        $scope.tabMesh[pos].rotation.y = 3 * Math.PI / 4;
                        $scope.tabMesh[pos].position.x = x;
                        $scope.tabMesh[pos].position.y = y;
                        $scope.tabMesh[pos].position.z = z;
                        $scope.group.add($scope.tabMesh[pos]);

                        // remember current tab object
                        $scope.currentTabObj[pos] = $scope.tabMesh[pos];
                        $scope.currentTabObj[pos].name = shoe.name + '-' + tab.name + '-' + tab.color + '-' + side;
                    });
                }

                $scope.removeFromScene = function (scene, obj) {
                    var removeMeObj = scene.getObjectByName(obj.name);
                    console.log("removed from scene");
                    console.log(removeMeObj);
                    $scope.scene.remove(removeMeObj);
                };

                $scope.updateShoe = function (scene, side, styleChange){

                    var s = getShoe();

                    // load path
                    var texturePath = 'assets/models/texture/shoe/' + s.name + '/' + side + '/' + s.sku;
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
                    var texturePath = 'assets/models/texture/tabs/' + tab.sku;

                    $scope.tabMesh[pos].material.map = THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + whichTab + '.jpg');
                    $scope.tabMesh[pos].material.normalMap = THREE.ImageUtils.loadTexture( texturePath + '/normals-' + whichTab + '.jpg' );
                    $scope.tabMesh[pos].material.needsUpdate = true;
                };

                $scope.drawShoeMe = function (scene, side, x){
                    //first remove current shoe
                    if(_.isEmpty($scope.currentShoeObj) == false) {
                        console.log("remove shoe:" + side);
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
                            shininess: 35
                        });

                        geometry.dynamic = true;

                        $scope.shoeMesh['\'' + side +'\'' ] = new THREE.Mesh(
                            geometry,
                            material
                        );

                        $scope.shoeMesh['\'' + side +'\'' ].receiveShadow = false;
                        $scope.shoeMesh['\'' + side +'\'' ].castShadow = false;
                        $scope.shoeMesh['\'' + side +'\'' ].rotation.y = 3*Math.PI/4;
                        //   mesh.scale.multiplyScalar(3);
                        $scope.shoeMesh['\'' + side +'\'' ].position.x = x;
                        $scope.shoeMesh['\'' + side +'\'' ].position.y = 0;
                        $scope.shoeMesh['\'' + side +'\'' ].position.z = 0;

                        scene.add($scope.shoeMesh['\'' + side +'\'' ]);
                        $scope.render($scope.shoeMesh['\'' + side +'\'' ]);

                        // remember current shoe object
                        $scope.currentShoeObj["shoe"] = s;
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
                    var texturePath = 'assets/models/texture/tabs/' + tab.sku;
                    var loader = new THREE.JSONLoader();

                    loader.load(meshPath + '-tab-' + side + '-' + whichTab + '.js', function (geometry, materials) {
                        var material = new THREE.MeshPhongMaterial({
                            map: THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + whichTab + '.jpg'),
                            normalMap: THREE.ImageUtils.loadTexture(texturePath + '/normals-' + whichTab + '.jpg'),
                            shininess: 35
                        });

                        geometry.dynamic = true;

                        $scope.tabMesh[pos] = new THREE.Mesh(
                            geometry,
                            material
                        );

                        $scope.tabMesh[pos].receiveShadow = false;
                        $scope.tabMesh[pos].castShadow = false;
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
                    $scope.initLoad();
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
