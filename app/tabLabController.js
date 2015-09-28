(function ($) {
    'use strict';

    var assetRoot = "/tab-lab/";

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

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
                return true;
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

                $scope.MENUIMGPATH = assetRoot + "assets/media/thumbnails/";
                // Tabs on canvas List Arrays
                $scope.tabs = {};
                $scope.tabsSelected = [];

                $scope.shoe = {};
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

                $scope.tabsNoMirror = ["201110-610", "201122-908", "201131-009", "201161-822"];
            /*
                var loadNormals = function (){
                    var s;
                    var texturePathLeft;
                    var texturePathRight;
                    var imgMap = {};
                    var imgNormalMap = {};
                    var specularMap = {};
                    var i;
                    for (i = 0 ; i < getNumOfShoesInList() ; i++ ){
                        s = $scope.shoeList[i];
                        $scope.shoeList[i].map = [];
                        $scope.shoeList[i].normalMap = [];
                        $scope.shoeList[i].specularMap = [];

                        texturePathLeft = assetRoot + 'assets/models/texture/shoe/' + s.name + '/left/' + s.sku;
                        texturePathRight = assetRoot + 'assets/models/texture/shoe/' + s.name + '/right/' + s.sku;
                        imgMap['left'] = new Image();
                        imgMap['left'].src = texturePathLeft + '/diffuse.jpg';
                        $scope.shoeList[i].map['left'] =  imgMap['left'];

                        imgMap['right'] = new Image();
                        imgMap['right'].src = texturePathRight + '/diffuse.jpg';
                        $scope.shoeList[i].map['right'] =  imgMap['right'];

                        imgNormalMap['left'] = new Image();
                        imgNormalMap['left'].src = texturePathLeft + '/normal.jpg';
                        $scope.shoeList[i].normalMap['left'] = imgNormalMap['left'];

                        imgNormalMap['right'] = new Image();
                        imgNormalMap['right'].src = texturePathRight + '/normal.jpg';
                        $scope.shoeList[i].normalMap['right'] = imgNormalMap['right'];

                        try {
                            specularMap['left'] = new Image();
                            specularMap['left'].src = texturePathLeft + '/specular.jpg';
                            $scope.shoeList[i].specularMap['left'] = specularMap['left'];
                        }
                        catch(err) {
                          //  console.log(err);
                        }

                        try {
                            specularMap['right'] = new Image();
                            specularMap['right'].src = texturePathRight + '/specular.jpg';
                            $scope.shoeList[i].specularMap['right'] = specularMap['right'];
                        }
                        catch(err) {
                           // console.log(err);
                        }
                    }
                };
            */

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
                 //   loadNormals();
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
                        // if right shoe
                        if(pos == 0) {
                            sliderProperties.setTabIndex(0, index);
                            sliderProperties.setTabIndex(2, index);
                            $scope.rightTabIndex =  index;

                            //else left shoe
                        }else{
                            sliderProperties.setTabIndex(1, index);
                            sliderProperties.setTabIndex(3, index);
                            $scope.leftTabIndex =  index;
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
                                    });
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
                            _.extend(product, productData[product.sku] || {});
                        })
                    };

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
                    };

                    $http.get(assetRoot + 'assets/data/data.json').success(function (data) {
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
                }; // end initLoad()

                /*
                 START Canvas Drawing

                 */
                $scope.container = document.querySelector('.tablab-viewer');
                $scope.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
                $scope.renderer._microCache = new MicroCache();
            /*    $scope.stats = new Stats();
                $scope.stats.domElement.style.position = 'absolute';
                $scope.stats.domElement.style.top = '0px';
                $scope.container.appendChild( $scope.stats.domElement );
                // for debuging stats
                $scope.interval = setInterval( debugInfo, 50 );
             */
                $scope.scene;
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
                var windowHalfX = $scope.WIDTH / 2;
                var windowHalfY = $scope.HEIGHT / 2;
                var finalRotationY;
                var VIEW_ANGLE = 45;
            //    var ASPECT = $scope.WIDTH / $scope.HEIGHT;
                var ASPECT = 1;
                var NEAR = 1;
                var FAR = 1000;
                $scope.isMobile = false;
                $scope.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

                $scope.isMobileScreen = function (){
                    return $scope.isMobile;
                }; //end isMobileScreen()

                $scope.findAndSetCanvasDimensions = function(){
                    $scope.isMobile = true;
                    var windowWidth = window.innerWidth;

                    if(windowWidth > 768){
                        $scope.isMobile = false;
                        // the rest of the desktop screens
                    }

                    var s = "#white-bg-mobile";
                    var canvasWindowWidth = $(s).css('width').replace(/[^-\d\.]/g, '') - 10;
                    var canvasWindowHeight = $(s).css('height').replace(/[^-\d\.]/g, '') - 10;
                    $scope.WIDTH = Number(canvasWindowWidth);
                    $scope.HEIGHT = Number(canvasWindowHeight);

                }; //end findAndSetCanvasDimensions()

                $scope.createScene = function (){

                    $scope.camera.position.set(0, 6, 6);
                    $scope.camera.lookAt(new THREE.Vector3 (0.0, -1.0, 0.0));

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
                    $scope.renderer.setClearColor(0xffffff,0);
                    $scope.container.appendChild($scope.renderer.domElement);

                    $(document).ready(function() {
                        document.getElementById("white-bg-mobile").addEventListener( 'mousedown', onDocumentMouseDown, false );
                        document.getElementById("white-bg-mobile").addEventListener( 'touchstart', onDocumentTouchStart, false );
                        document.getElementById("white-bg-mobile").addEventListener( 'touchmove', onDocumentTouchMove, false );
                        window.addEventListener( 'resize', onWindowResize, false );
                    });

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

                        initDrawShoeHelper($scope.scene, $scope.group, s, 'left', 1.1, -1, 0);
                        initDrawShoeHelper($scope.scene, $scope.group, s, 'right', -1.1, -1, 0);

                        // draw tabs
                        initDrawTabHelper($scope.scene, 0, -1.1, -1, 0);
                        initDrawTabHelper($scope.scene, 1, 1.1, -1, 0);
                        if(s.numOfTabs != 2) {
                            initDrawTabHelper($scope.scene, 2, -1.1, -1, 0);
                            initDrawTabHelper($scope.scene, 3, 1.1, -1, 0);
                        }else{
                            //remove current bottom tabs
                            if (_.isEmpty($scope.currentTabObj[2]) == false) {
                                removeFromScene($scope.scene, $scope.currentTabObj[2]);
                            }
                            if (_.isEmpty($scope.currentTabObj[3]) == false) {
                                removeFromScene($scope.scene, $scope.currentTabObj[3]);
                            }
                        }
                    }else {
                        setTimeout(initDrawScene, 500); // check again in a .5 second
                    }//end if-else

                    $scope.group.name = "group";
                    $scope.scene.add($scope.group);
                    $scope.render();

                    console.log("in my group: ");
                    console.log($scope.group);
                    console.log("in my scene: ");
                    console.log($scope.scene);
                }

                function initDrawShoeHelper(scene, group, shoe, side, x, y, z){
                    var shoeMesh = {};

                    // load shoe
                    var shoePath = assetRoot + '/assets/models/' + shoe.name + '/' + shoe.name;
                    var loader = new THREE.JSONLoader();
                    var texturePath = assetRoot + 'assets/models/texture/shoe/' + shoe.name + '/' + side + '/' + shoe.sku;
                //    var textureMap = THREE.ImageUtils.loadTexture(texturePath + '/diffuse.jpg');
                //    var normalMap = THREE.ImageUtils.loadTexture(texturePath + '/normal.jpg');
                    var uniqueName = shoe.name + '-' + shoe.sku + '-' + side;
                    var textureMap = $scope.renderer._microCache.getSet(uniqueName + "-textureMap", THREE.ImageUtils.loadTexture(texturePath + '/diffuse.jpg'));
                    var normalMap = $scope.renderer._microCache.getSet(uniqueName + "-normalMap", THREE.ImageUtils.loadTexture(texturePath + '/normal.jpg'));
                    var specularMap;
                   try{
                    //    specularMap = THREE.ImageUtils.loadTexture(texturePath + '/specular.jpg');
                        specularMap = $scope.renderer._microCache.getSet(uniqueName + "-specular" + side, THREE.ImageUtils.loadTexture(texturePath + '/specular.jpg'));
                    }catch(err) {
                       console.log(err);
                   }

                    loader.load(shoePath + '-shoe-'+ side + '.js', function (geometry, materials) {
                        var material = new THREE.MeshPhongMaterial({map: textureMap, normalMap: normalMap, specularMap: specularMap, shininess: 35});
                        material.side = THREE.DoubleSide;
                        geometry.dynamic = true;
                        shoeMesh[side] = new THREE.Mesh(geometry, material);
                        shoeMesh[side].receiveShadow = false;
                        shoeMesh[side].castShadow = false;
                        shoeMesh[side].rotation.y = Math.PI;
                        shoeMesh[side].position.x = x;
                        shoeMesh[side].position.y = y;
                        shoeMesh[side].position.z = z;
                        shoeMesh[side].name = shoe.name + "-" + side;
                        $scope.group.add( shoeMesh[side]);

                        // remember the current shoe object
                        // remember current shoe object
                        $scope.currentShoeObj = shoe;
                        console.log("currentShoeObj:");
                        console.log($scope.currentShoeObj);
                    });
                }

                function initDrawTabHelper(scene, pos, x, y, z){
                    var shoe = getShoe();
                    var tab = getTab(pos);
                    var whichTab = 'top';
                    var side='left';
                    var tabSide='';

                    if(pos == 0 || pos == 2){
                        side = 'right';
                    }

                    if(pos == 2 ||  pos == 3){
                        whichTab = 'bottom';
                    }

                    // check for non-mirror tabs
                    if(_.indexOf($scope.tabsNoMirror, tab.sku) != -1){
                        if(pos == 0 || pos == 2){
                            tabSide = '/right';
                        }else{
                            tabSide = '/left';
                        }// end else-if
                        console.log("tabSide:");
                        console.log(tabSide);
                    }

                    // load tab
                    var tabMesh = {};
                    var loader = new THREE.JSONLoader();
                    var meshPath = assetRoot + 'assets/models/' + shoe.name + '/' + shoe.name;
                    var texturePath = assetRoot + 'assets/models/texture/tabs/' + tab.sku;
                //    var textureMap = THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + whichTab + '.jpg');
                //    var normalMap = THREE.ImageUtils.loadTexture(texturePath + '/normals-' + whichTab + '.jpg');
                    var uniqueName = tab.name + '-' + tab.sku + '-' + whichTab;
                    var textureMap = $scope.renderer._microCache.getSet(uniqueName + "-textureMap", THREE.ImageUtils.loadTexture(texturePath + tabSide + '/difuse-' + whichTab + '.jpg'));
                    var normalMap = $scope.renderer._microCache.getSet(uniqueName + "-normalMap", THREE.ImageUtils.loadTexture(texturePath + tabSide + '/normals-' + whichTab + '.jpg'));
                    var specularMap;
                    try{
                    //    specularMap = THREE.ImageUtils.loadTexture(texturePath + '/specular.jpg');
                        specularMap = $scope.renderer._microCache.getSet(uniqueName + "-specular", THREE.ImageUtils.loadTexture(texturePath + '/specular.jpg'));
                    }catch(err) {
                        console.log(err);
                    }

                    loader.load(meshPath + '-tab-' + side + '-' + whichTab + '.js', function (geometry, materials) {
                        var material = new THREE.MeshPhongMaterial({map: textureMap, normalMap: normalMap, specularMap: specularMap, shininess: 35});
                        geometry.dynamic = true;
                        tabMesh[pos] = new THREE.Mesh(geometry, material);
                        tabMesh[pos].receiveShadow = false;
                        tabMesh[pos].castShadow = false;
                        tabMesh[pos].rotation.y = Math.PI;
                        tabMesh[pos].position.x = x;
                        tabMesh[pos].position.y = y;
                        tabMesh[pos].position.z = z;
                       // tabMesh[pos].name = tab.name + '-' + whichTab  + '-' + side;
                        tabMesh[pos].name = "tab" + pos;
                        $scope.group.add(tabMesh[pos]);

                        // remember current tab object
                        $scope.currentTabObj[pos] = tabMesh[pos];
                        console.log("currentTabObj[" + pos.toString() +"]");
                        console.log($scope.currentTabObj[pos].name);
                    });
                }

                $scope.updateShoeTexture = function (scene, group, og, shoe, side){
                /*
                    if(og.name == shoe.name){
                        // load path
                        var shoeObj = $scope.currentShoeObj;
                        var texturePath =  '/assets/models/texture/shoe/' + shoe.name + '/' + side + '/' + shoe.sku;
                        var textureMap = THREE.ImageUtils.loadTexture(texturePath + '/difuse.jpg');
                        var normalMap = THREE.ImageUtils.loadTexture(texturePath + '/Normal.jpg');
                        var specularMap;
                        if(shoe.specularMap[side] != null) {
                            specularMap = THREE.ImageUtils.loadTexture(texturePath + '/specular.jpg');
                            console.log("specularMap:");
                            console.log(specularMap);
                        }

                        console.log("shoeObj:");
                        console.log(shoeObj);
                        var updateMe = scene.getObjectByName("group").getObjectByName(shoeObj.name + "-" + side);

                        console.log("updateMe object:");
                        console.log(updateMe);

                        updateMe.material.map = THREE.ImageUtils.loadTexture(textureMap);
                        updateMe.material.normalMap = THREE.ImageUtils.loadTexture(normalMap);

                        if(specularMap != null) {
                            updateMe.material.specularMap = THREE.ImageUtils.loadTexture(specularMap);
                        }
                        updateMe.material.needsUpdate = true;
                       // updateMe.material.map.needsUpdate = true;


                   }else{
                */
                    var grp = $scope.scene.getObjectByName("group");
                    var i = grp.children.length - 1;

                    // remove all meshes from 3D object
                    while(i >= 0) {
                        grp.children[i].material.dispose();
                        grp.remove(grp.getObjectByName(grp.children[i].name));
                        i--;
                    }
                    initDrawScene();
                //    }
                    console.log("in my group: ");
                    console.log($scope.group);
                    console.log("in my scene: ");
                    console.log($scope.scene);
                };

                $scope.updateTabTexture = function (scene, pos, whichTab){
                    var s = getShoe();

                    var tabObj = $scope.currentTabObj[pos];
                    var t = getTab(pos);

                    // load path
                    var texturePath = assetRoot + 'assets/models/texture/tabs/' + t.sku;
                    var uniqueName = t.name + '-' + t.sku + '-' + whichTab;
                    var updateMe = scene.getObjectByName("group").getObjectByName(tabObj.name);
                    updateMe.material.map = $scope.renderer._microCache.getSet(uniqueName + "-textureMap", THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + whichTab + '.jpg'));
                    updateMe.material.normalMap = $scope.renderer._microCache.getSet(uniqueName + "-normalMap", THREE.ImageUtils.loadTexture(texturePath + '/normals-' + whichTab + '.jpg'));
                    var specularMap;
                    try{
                    //    specularMap = THREE.ImageUtils.loadTexture(texturePath + '/specular.jpg');
                        specularMap = $scope.renderer._microCache.getSet(uniqueName + "-specular", THREE.ImageUtils.loadTexture(texturePath + '/specular.jpg'));
                        if(specularMap != null){
                            updateMe.material.specularMap = specularMap;
                        }

                    }catch(err) {
                        console.log(err);
                    }
                    updateMe.material.needsUpdate = true;

                    console.log("in my group: ");
                    console.log($scope.group);
                    console.log("in my scene: ");
                    console.log($scope.scene);

                };

                $scope.updateTabTextureShuffle = function(index, tab, position, topOrBottom){
                    var specularMap;
                    var texturePath;
                    var updateMe;
                    
                    // load path
                    texturePath = assetRoot + 'assets/models/texture/tabs/' + tab.sku;
                    updateMe = $scope.scene.getObjectByName("group").getObjectByName("tab"+index);

                    updateMe.material.map = THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + topOrBottom + '.jpg');
                    updateMe.material.normalMap = THREE.ImageUtils.loadTexture(texturePath + '/normals-' + topOrBottom + '.jpg');
                    try{
                        specularMap = THREE.ImageUtils.loadTexture(texturePath + '/specular.jpg');
                        if(specularMap != null){
                            updateMe.material.specularMap = specularMap;
                        }
                    }catch(err) {
                        console.log(err);
                    }
                    updateMe.material.needsUpdate = true;
                };

                $scope.reDrawShoe = function (){
                    initDrawScene();
                };

                function removeFromScene(scene, tab){
                    scene.remove(tab);
                }

                // When the page first loads
                window.onload = function (){
                    $scope.findAndSetCanvasDimensions();
                    $scope.initLoad();
                  //  animate();
                };

                function onWindowResize (){
                    $scope.findAndSetCanvasDimensions();
                    $scope.camera.updateProjectionMatrix();
                    $scope.renderer.setSize($scope.WIDTH, $scope.HEIGHT);
                }

                function onDocumentMouseDown( event ) {

                    event.preventDefault();

                    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
                    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
                    document.addEventListener( 'mouseout', onDocumentMouseOut, false );

                    mouseXOnMouseDown = event.clientX - windowHalfX;
                    targetRotationOnMouseDownX = targetRotationX;

                    mouseYOnMouseDown = event.clientY - windowHalfY;
                    targetRotationOnMouseDownY = targetRotationY;

                }

                function onDocumentMouseMove( event ) {

                    mouseX = event.clientX - windowHalfX;
                    mouseY = event.clientY - windowHalfY;

                    targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
                    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;

                }

                function onDocumentMouseUp( event ) {

                    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
                    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
                    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

                }

                function onDocumentMouseOut( event ) {

                    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
                    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
                    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

                }

                function onDocumentTouchStart( event ) {

                    if ( event.touches.length == 1 ) {

                        event.preventDefault();

                        mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
                        targetRotationOnMouseDownX = targetRotationX;

                        mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
                        targetRotationOnMouseDownY = targetRotationY;

                    }

                }

                function onDocumentTouchMove( event ) {

                    if ( event.touches.length == 1 ) {

                        event.preventDefault();

                        mouseX = event.touches[ 0 ].pageX - windowHalfX;
                        targetRotationX = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.05;

                        mouseY = event.touches[ 0 ].pageY - windowHalfY;
                        targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;

                    }

                }

                function animate() {
                    requestAnimationFrame( animate );
                    $scope.render();
                   // $scope.stats.update();
                }

                function debugInfo()
                {
                    $('#debug').html("mouseX : " + mouseX + "   mouseY : " + mouseY );

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

})(jQuery);
