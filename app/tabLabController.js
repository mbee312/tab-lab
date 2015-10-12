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

    if(window.maskControl == undefined) window.maskControl = null;

    // Declare app level module which depends on views, and components
    var tabLabApp = angular.module('tabLabApp',
        ['ngAnimate',
            'ngTouch',
            'ngMaterial',
            'ui.bootstrap',
            'angular-carousel',
            'slick',
            'ui.bootstrap.modal',
            'ngModal'
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
            'sliderProperties',
            'cartProperties',
            function ($scope, $rootScope, $q, $http, $mdDialog, $mdToast, $animate, $window, tabLabProperties, sliderProperties, cartProperties) {

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

                $scope.tabs = {
                    main: {active:true},
                    tabs: {active:false},
                    shoes: {active:false},
                    random: {active:false},
                    shuffle: {active:false},
                    design: {active:false},
                    comment: {active:false}
                }

                $scope.loadMenu = function (list, shoesOrTabs ){
                    for(var i = 0; i < list.length ; i++){
                        list[i].menuImg = new Image();
                        list[i].menuImg.src = '/media/catalog/product' + list[i].image_url; // $scope.MENUIMGPATH + shoesOrTabs + '/' + list[i].name + '-' + list[i].color + '.jpg';
                    }// end for
                    return list;
                };// end loadMenu()

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
                };

                $scope.setTab = function(tab, shoePos){
                    tabLabProperties.setTabSelected(tab, shoePos);
                    $scope.tabsSelected[shoePos] = tab;
                };

                function initializeSelected (){
                    var i = $scope.setRandomIndex('shoe', 0);
                    var j = $scope.setRandomIndex('tab', 0);
                    var k = $scope.setRandomIndex('tab', 1);

                    // set initial shoe
                    $scope.setShoe($scope.shoeList[i]);
                    var shoe = getShoe();

                    // set initial tabs
                    $scope.setTab($scope.tabList[j], 0);
                    $scope.setTab($scope.tabList[j], 2);
                    $scope.setTab($scope.tabList[k], 1);
                    $scope.setTab($scope.tabList[k], 3);

                    cartProperties.updateCart(getShoe(), 2);
                    cartProperties.updateCart(getTab(0), 0);
                    cartProperties.updateCart(getTab(1), 1);
                    $rootScope.$broadcast('calculate-subtotal');
                }

                $scope.loaded = [];

                $scope.initLoad = function () {

                    var updateProductData = function(products, productData) {
                        _.each(products, function(product, productIndex) {
                            product.initial_price = product.price;
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
                            initializeSelected();
                            $scope.createScene();
                            render();
                            $scope.initDrawScene();
                            if (maskControl) maskControl.hideFullMask();
                        });
                    });
                }; // end initLoad()

                /*
                 START Canvas Drawing
                 */
                $scope.container = document.querySelector('.tablab-viewer');
                $scope.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
                $scope.renderer._microCache = new MicroCache();
                $scope.scene;
                $scope.loader;
                $scope.WIDTH = 400;
                $scope.HEIGHT = 400;
                $scope.group = new THREE.Object3D();
                /*
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
                */
                var VIEW_ANGLE = 45;
                var ASPECT = 1;
                var NEAR = 1;
                var FAR = 1000;
                $scope.isMobile = false;
                $scope.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
                $scope.controls;
                $scope.autoRotate = true;
                $scope.isZoom = false;

                $scope.isMobileScreen = function (){
                    return $scope.isMobile;
                }; //end isMobileScreen()

                $scope.findAndSetCanvasDimensions = function(){
                    $scope.isMobile = true;
                    var windowWidth = window.innerWidth;

                    if(windowWidth > 768){
                        $scope.isMobile = false;
                    }

                    var winWidth = $(window).width();;
                    var winHeight = $(window).height();
                    var shippingBarHeight = $(".shipping-bar").height();
                    var headerHeight = $(".header-container").height();
                    var navTabsHeight = $(".nav-tabs").height();

                    var canvasHeight = winHeight - shippingBarHeight - headerHeight - navTabsHeight;

                    if(winWidth < canvasHeight){
                        $scope.HEIGHT = Number(winWidth);
                        $scope.WIDTH = Number(winWidth);
                    }else{
                        $scope.HEIGHT = Number(canvasHeight);
                        $scope.WIDTH = Number(canvasHeight);
                    }

                }; //end findAndSetCanvasDimensions()

                $scope.createScene = function (){

                    $scope.camera.position.set(0.0, 5.5, 8.0);
                    $scope.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));

                    $scope.scene = new THREE.Scene();

                    var lightKey = new THREE.DirectionalLight(0xFFFFFF);
                    lightKey.position.set(5, 5, 5);
                    lightKey.intensity = .4;
                    lightKey.castShadow = false;
                    $scope.scene.add(lightKey);

                    var lightFill = new THREE.DirectionalLight(0xFFFFFF);
                    lightFill.position.set(-5, 5, 5);
                    lightFill.intensity = .4;
                    lightFill.castShadow = false;
                    $scope.scene.add(lightFill);

                    var lightRim = new THREE.DirectionalLight(0xFFFFFF);
                    lightRim.position.set(0, 5, -3);
                    lightRim.intensity = .2;
                    lightRim.castShadow = false;
                    $scope.scene.add(lightRim);

                    var lightBottom = new THREE.DirectionalLight(0xFFFFFF);
                    lightBottom.position.set(0, -5, 0);
                    lightBottom.intensity = .3;
                    lightBottom.castShadow = false;
                    $scope.scene.add(lightBottom);

                    var lightAmbient = new THREE.AmbientLight(0x2E2E2E);
                    $scope.scene.add(lightAmbient);
                    $scope.scene.add($scope.camera);
                    $scope.renderer.setSize($scope.WIDTH, $scope.HEIGHT);
                    $scope.renderer.setClearColor(0xffffff,0);
                    $scope.renderer.autoClear = true;
                    $scope.container.appendChild($scope.renderer.domElement);

                    $scope.controls = new THREE.OrbitControls( $scope.camera, $scope.renderer.domElement );
                    $scope.controls.enableDamping = true;
                    $scope.controls.dampingFactor = 0.025;
                    $scope.controls.noZoom = false;
                    $scope.controls.autoRotate = $scope.autoRotate;
                    $scope.controls.autoRotateSpeed = 1;
                    $scope.controls.addEventListener( 'change', light_update );

                    function light_update()
                    {
                        lightKey.position.copy( $scope.camera.position );
                        lightFill.position.copy( $scope.camera.position );
                        lightRim.position.copy( $scope.camera.position );
                    }

                    $(document).ready(function() {
                        document.getElementById("white-bg-mobile").addEventListener( 'mousedown', onDocumentMouseDown, false );
                    //    document.getElementById("white-bg-mobile").addEventListener( 'touchstart', onDocumentTouchStart, false );
                    //    document.getElementById("white-bg-mobile").addEventListener( 'touchmove', onDocumentTouchMove, false );
                        document.getElementById("white-bg-mobile").addEventListener('dblclick', onDocumentDoubleClick);
                        window.addEventListener( 'resize', onWindowResize, false );
                    });
                };

                function render () {
                    requestAnimationFrame(render);

                    /*
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
                    */
                    $scope.controls.autoRotate = $scope.autoRotate;
                    $scope.controls.update();
                    $scope.renderer.clear();
                    $scope.renderer.render($scope.scene, $scope.camera);
                }

                $scope.resetRotation = function (){
                    $scope.controls.reset();
                };

                $scope.setRotation = function (){
                    $scope.autoRotate = !$scope.autoRotate;
                };

                $scope.initDrawScene = function (){
                    $scope.group.name = "group";
                    $scope.scene.add($scope.group);
                    if(tabLabProperties.isShoeSelected()){
                        var s = tabLabProperties.getShoe();

                        initDrawShoeHelper(s, 0, -0.75, -1, -0.75);

                        // draw tabs
                        initDrawTabHelper(0, -0.75, -1, -0.75, true);
                        initDrawTabHelper(1, 0.75, -1, 0.75, true);
                        if(s.numOfTabs == 2) {
                            initDrawTabHelper(2, -0.75, -1, -0.75, false);
                            initDrawTabHelper(3, 0.75, -1, 0.75, false);
                        }else{
                            initDrawTabHelper(2, -0.75, -1, -0.75, true);
                            initDrawTabHelper(3, 0.75, -1, 0.75, true);
                        }
                    }else {
                        setTimeout($scope.initDrawScene, 500); // check again in a .5 second
                    }//end if-else
                };

                var loader = new THREE.JSONLoader();
                var materialLoader = new THREE.MaterialLoader();

                // 0 = right shoe
                // 1 = left shoe
                var shoeMesh = [];
                var geometry = new THREE.Geometry();
                shoeMesh[0] = new THREE.Mesh(geometry);
                shoeMesh[1] = new THREE.Mesh(geometry);

                var shoeMaterial = [];
                shoeMaterial[0] = new THREE.MeshPhongMaterial();
                shoeMaterial[1] = new THREE.MeshPhongMaterial();

                function initDrawShoeHelper(shoe, pos, x, y, z){
                    var side;
                    if (pos == 0){
                        side = 'right';
                    }else{
                        side = 'left';
                    }

                    var grp = $scope.scene.getObjectByName("group");
                    // load shoe
                    var shoePath = assetRoot + '/assets/models/' + shoe.name + '/' + shoe.name;
                    var shoeTexturePath = assetRoot + 'assets/models/texture/shoe/' + shoe.name + '/' + side + '/' + shoe.sku + '/';
                    var uniqueName = shoe.name + '-' + shoe.sku + '-' + side;

                    shoeMaterial[pos].map = $scope.renderer._microCache.getSet(uniqueName + "-textureMap", THREE.ImageUtils.loadTexture(shoeTexturePath + '/diffuse.jpg', undefined, function(textureMap){
                        shoeMaterial[pos].normalMap = $scope.renderer._microCache.getSet(uniqueName + "-normalMap", THREE.ImageUtils.loadTexture(shoeTexturePath + '/normal.jpg', undefined, function(normalMap){
                            shoeMaterial[pos].specularMap = $scope.renderer._microCache.getSet(uniqueName + "-specular", THREE.ImageUtils.loadTexture(shoeTexturePath + '/specular.jpg'));
                            loader.load(shoePath + '-shoe-'+ side + '.js', function (geometry) {
                                shoeMaterial[pos].side = THREE.DoubleSide;
                                shoeMesh[pos].geometry = $scope.renderer._microCache.getSet(shoePath + '-shoe-'+ side + '.js', geometry);
                                shoeMesh[pos].material = shoeMaterial[pos];
                                shoeMesh[pos].receiveShadow = false;
                                shoeMesh[pos].castShadow = false;
                                shoeMesh[pos].rotation.y = 3*Math.PI/4;
                                shoeMesh[pos].position.x = x;
                                shoeMesh[pos].position.y = y;
                                shoeMesh[pos].position.z = z;
                                shoeMesh[pos].name = "shoe" + "-" + side;
                                grp.add(shoeMesh[pos]);
                                if(pos == 0) {
                                    pos++;
                                    initDrawShoeHelper(shoe, pos, -x, y, -z);
                                }

                                // remember the current shoe object
                                $scope.currentShoeObj = shoe;
                            });
                        }));
                    }));
                }

                var tabMesh = [];
                tabMesh[0] = new THREE.Mesh(geometry);
                tabMesh[1] = new THREE.Mesh(geometry);
                tabMesh[2] = new THREE.Mesh(geometry);
                tabMesh[3] = new THREE.Mesh(geometry);

                var tabMaterial = [];
                tabMaterial[0] = new THREE.MeshPhongMaterial();
                tabMaterial[1] = new THREE.MeshPhongMaterial();
                tabMaterial[2] = new THREE.MeshPhongMaterial();
                tabMaterial[3] = new THREE.MeshPhongMaterial();

                function initDrawTabHelper(pos, x, y, z, showOrHide){
                    var grp = $scope.scene.getObjectByName("group");
                    var shoe = getShoe();
                    var tab = getTab(pos);
                    var whichTab = 'top';
                    var side='left';
                    var tabTopOrBottom = 'top';

                    if(pos == 0 || pos == 2){
                        side = 'right';
                    }

                    if(pos == 2 ||  pos == 3){
                        if(shoe.numOfTabs != 2) {
                            whichTab = 'bottom';
                        }else{
                            whichTab = 'top';
                        }
                    }

                    if(pos == 0 || pos == 3){
                        tabTopOrBottom = 'bottom';
                    }

                    // load tab
                    var tabMeshPath = assetRoot + 'assets/models/' + shoe.name + '/' + shoe.name;
                    var tabTexturePath = assetRoot + 'assets/models/texture/tabs/' + tab.sku;
                    var tabUniqueName = tab.name + '-' + tab.sku + '-' + side + '-' + whichTab;
                    tabMaterial[pos].map = $scope.renderer._microCache.getSet(tabUniqueName + "-textureMap", THREE.ImageUtils.loadTexture(tabTexturePath + '/difuse-' + tabTopOrBottom + '.jpg', undefined, function(textureMap){
                        tabMaterial[pos].normalMap = $scope.renderer._microCache.getSet(tabUniqueName + "-normalMap", THREE.ImageUtils.loadTexture(tabTexturePath + '/normals-' + tabTopOrBottom + '.jpg', undefined, function(normalMap){
                            tabMaterial[pos].specularMap = $scope.renderer._microCache.getSet(tabUniqueName + "-specular", THREE.ImageUtils.loadTexture(tabTexturePath + '/specular.jpg', undefined, function(specularMap){
                                loader.load(tabMeshPath + '-tab-' + side + '-' + whichTab + '.js', function (geometry) {
                                    tabMesh[pos].geometry = $scope.renderer._microCache.getSet(tabMeshPath + '-tab-' + side + '-' + whichTab + '.js', geometry);
                                    tabMesh[pos].material = tabMaterial[pos];
                                    tabMesh[pos].receiveShadow = false;
                                    tabMesh[pos].castShadow = false;
                                    tabMesh[pos].position.x = x;
                                    tabMesh[pos].position.y = y;
                                    tabMesh[pos].position.z = z;
                                    tabMesh[pos].rotation.y = 3*Math.PI/4;
                                    tabMesh[pos].name = "tab" + pos;
                                    tabMesh[pos].visible = showOrHide;
                                    grp.add(tabMesh[pos]);

                                    // remember current tab object
                                    $scope.currentTabObj[pos] = tabMesh[pos];
                                });
                            }));
                        }));
                    }));
                }

                $scope.updateShoes = function (){
                    var updateDeferred = $q.defer();
                    var shoe = getShoe();

                    if(shoe) {
                        setTimeout(function(){updateDeferred.resolve(initDrawShoeHelper(shoe, 0, -0.75, -1, -0.75))}, 1000);
                    }else{
                        updateDeferred.reject("Couldn't draw shoes");
                    }

                    /*
                     var shoePath;
                     var shoeTexturePath;
                     var uniqueName;
                    var shoeIndex = 0;
                    if(side == 'left'){
                        shoeIndex = 1;
                    }

                    // load shoe
                    shoePath = assetRoot + '/assets/models/' + shoe.name + '/' + shoe.name;
                    shoeTexturePath = assetRoot + 'assets/models/texture/shoe/' + shoe.name + '/' + side + '/' + shoe.sku;
                    uniqueName = shoe.name + '-' + shoe.sku + '-' + side;

                        loader.load(shoePath + '-shoe-'+ side + '.js', function (geometry) {
                            shoeMaterial[shoeIndex].map = $scope.renderer._microCache.getSet(uniqueName + "-textureMap", THREE.ImageUtils.loadTexture(shoeTexturePath + '/diffuse.jpg'));
                            shoeMaterial[shoeIndex].normalMap = $scope.renderer._microCache.getSet(uniqueName + "-normalMap", THREE.ImageUtils.loadTexture(shoeTexturePath + '/normal.jpg'));
                            var shoeSpecularMap;
                            try{
                                shoeSpecularMap = $scope.renderer._microCache.getSet(uniqueName + "-specular", THREE.ImageUtils.loadTexture(shoeTexturePath + '/specular.jpg'));
                                if(shoeSpecularMap != null){
                                    shoeMaterial[shoeIndex].specularMap = shoeSpecularMap;
                                }
                            }catch(err) {
                                console.log(err);
                            }
                            updateDeferred.resolve(shoeMesh[shoeIndex].geometry = geometry);
                        //    updateDeferred.resolve(shoeMesh[shoeIndex].geometry = $scope.renderer._microCache.getSet(shoePath + '-shoe-'+ side + '.js', geometry));
                        //    updateDeferred.resolve(shoeMesh[shoeIndex].geometry = $scope.renderer._microCache.getSet(shoePath + '-shoe-'+ side + '.js', geometry));
                            shoeMesh[shoeIndex].geometry.needsUpdate = true;
                            shoeMesh[shoeIndex].material.needsUpdate = true;
                            // remember current shoe object
                            $scope.currentShoeObj[shoeIndex] = shoeMesh[shoeIndex];
                        });
                        */


                    console.log("group:");
                    console.log($scope.scene.getObjectByName("group"));
                    $scope.autoRotate = true;

                    return updateDeferred.promise;
                };

                $scope.removeAllFromGroup = function (){
                    var q = $q.defer();
                    var grp = $scope.scene.getObjectByName("group");
                    var i = grp.children.length - 1;
                    // remove all meshes from 3D object
                    while(i >= 0) {
                        grp.children[i].material.dispose();
                        grp.children[i].geometry.dispose();
                        grp.remove(grp.getObjectByName(grp.children[i].name));
                        i--;
                    }
                    if(grp.children.length == 0){
                        q.resolve(grp);
                    }else{
                        q.reject("Couldn't remove all objects.");
                    }
                    return q.promise;
                };

                var tab;
                $scope.updateTab = function(pos){
                    var updateDeferred = $q.defer();
                    var shoe = getShoe();
                    tab = getTab(pos);
                    // draw tabs

                    if(pos == 0) {
                        updateDeferred.resolve(initDrawTabHelper(pos, -0.75, -1, -0.75, true));
                    }else if (pos == 1) {
                        updateDeferred.resolve(initDrawTabHelper(pos, 0.75, -1, 0.75, true));
                    }
                    if(shoe.numOfTabs == 2) {
                        if(pos == 2) {
                            updateDeferred.resolve(initDrawTabHelper(2, -0.75, -1, -0.75, false));
                        }else if(pos == 3) {
                            updateDeferred.resolve(initDrawTabHelper(3, 0.75, -1, 0.75, false));
                        }
                    }else{
                        if(pos == 2) {
                            updateDeferred.resolve(initDrawTabHelper(2, -0.75, -1, -0.75, true));
                        }else if (pos ==3) {
                            updateDeferred.resolve(initDrawTabHelper(3, 0.75, -1, 0.75, true));
                        }
                    }
                    

                    /*
                    var whichTab = 'top';
                    var side='left';
                    var tabTopOrBottom = 'top';

                    if(pos == 0 || pos == 2){
                        side = 'right';
                    }

                    if(pos == 2 ||  pos == 3){
                        whichTab = 'bottom';
                    }

                    if(pos == 0 || pos == 3){
                        tabTopOrBottom = 'bottom';
                    }

                    // load tab
                    var tabMeshPath = assetRoot + 'assets/models/' + shoe.name + '/' + shoe.name;
                    var tabTexturePath = assetRoot + 'assets/models/texture/tabs/' + tab.sku;
                    var tabUniqueName = tab.name + '-' + tab.sku + '-' + side + '-' + whichTab;

                    tabMaterial[pos].map = $scope.renderer._microCache.getSet(tabUniqueName + "-textureMap", THREE.ImageUtils.loadTexture(tabTexturePath + '/difuse-' + tabTopOrBottom + '.jpg', undefined, function(textureMap){
                        tabMaterial[pos].normalMap = $scope.renderer._microCache.getSet(tabUniqueName + "-normalMap", THREE.ImageUtils.loadTexture(tabTexturePath + '/normals-' + tabTopOrBottom + '.jpg', undefined, function(normalMap){
                            tabMaterial[pos].specularMap = $scope.renderer._microCache.getSet(tabUniqueName + "-specular", THREE.ImageUtils.loadTexture(tabTexturePath + '/specular.jpg', undefined, function(specularMap){
                                loader.load(tabMeshPath + '-tab-' + side + '-' + whichTab + '.js', function (geometry) {
                                    tabMesh[pos].geometry = geometry;
                                    tabMesh[pos].material = tabMaterial[pos];
                                    tabMesh[pos].material.needsUpdate = true;
                                    updateDeferred.resolve();
                                    // remember current tab object
                                    $scope.currentTabObj[pos] = tabMesh[pos];
                                })
                            }));
                        }));
                    }));
                    */

                    return updateDeferred.promise;
                };


                $scope.hideTab = function (pos){
                    tabMesh[pos].visible = false;
                };

                $scope.showTab = function (pos){
                    tabMesh[pos].visible = true;
                };

                $scope.updateTabTexture = function (scene, pos, whichTab){
                    var s = getShoe();

                    var tabObj = $scope.currentTabObj[pos];
                    var t = getTab(pos);
                    var tabTopOrBottom = 'top';
                    var side='left';

                    if(pos == 0 || pos == 2){
                        side = 'right';
                    }

                    if(pos == 2 ||  pos == 3){
                        whichTab = 'bottom';
                    }

                    if(pos == 0 || pos == 3){
                        tabTopOrBottom = 'bottom';
                    }

                    // load path
                    var texturePath = assetRoot + 'assets/models/texture/tabs/' + t.sku;
                    var uniqueName = t.name + '-' + t.sku + '-' + '-' + side + '-' + whichTab;
                    tabMaterial[pos].map = $scope.renderer._microCache.getSet(uniqueName + "-textureMap", THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + tabTopOrBottom + '.jpg'));
                    tabMaterial[pos].normalMap = $scope.renderer._microCache.getSet(uniqueName + "-normalMap", THREE.ImageUtils.loadTexture(texturePath + '/normals-' + tabTopOrBottom + '.jpg'));
                    var specularMap;
                    try{
                        specularMap = $scope.renderer._microCache.getSet(uniqueName + "-specular", THREE.ImageUtils.loadTexture(texturePath + '/specular.jpg'));
                        if(specularMap != null){
                            tabMaterial[pos].specularMap = specularMap;
                        }
                    }catch(err) {
                        console.log(err);
                    }
                    tabMesh[pos].material.needsUpdate = true;
                };

                $scope.updateTabTextureShuffle = function(index, tab, position, topOrBottom){
                    var specularMap;
                    var texturePath;
                    var updateMe;
                    var s = getShoe();

                    // load path
                    texturePath = assetRoot + 'assets/models/texture/tabs/' + tab.sku;

                    if((s.numOfTabs == 2) && (index == 2 || index == 3)){
                        // do nothing
                    }else{
                        updateMe = $scope.scene.getObjectByName("group").getObjectByName("tab" + index);
                        updateMe.material.map = THREE.ImageUtils.loadTexture(texturePath + '/difuse-' + topOrBottom + '.jpg');
                        updateMe.material.normalMap = THREE.ImageUtils.loadTexture(texturePath + '/normals-' + topOrBottom + '.jpg');
                        try {
                            specularMap = THREE.ImageUtils.loadTexture(texturePath + '/specular.jpg');
                            if (specularMap != null) {
                                updateMe.material.specularMap = specularMap;
                            }
                        } catch (err) {
                            console.log(err);
                        }
                        updateMe.material.needsUpdate = true;
                    }
                };

                $scope.reDrawShoe = function (){
                    $scope.initDrawScene();
                };

                function removeFromScene(scene, tab){
                    scene.remove(tab);
                }

                // When the page first loads
                window.onload = function (){
                    $scope.findAndSetCanvasDimensions();
                    $scope.initLoad();
                };

                function onWindowResize (){
                    $scope.findAndSetCanvasDimensions();
                    $scope.renderer.setSize($scope.WIDTH, $scope.HEIGHT);
                    $scope.camera.updateProjectionMatrix();
                }

                function onDocumentMouseDown( event ) {
                    $scope.autoRotate = false;
                    /*
                    event.preventDefault();

                    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
                    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
                    document.addEventListener( 'mouseout', onDocumentMouseOut, false );

                    mouseXOnMouseDown = event.clientX - windowHalfX;
                    targetRotationOnMouseDownX = targetRotationX;

                    mouseYOnMouseDown = event.clientY - windowHalfY;
                    targetRotationOnMouseDownY = targetRotationY;
                    */

                }
                function onDocumentDoubleClick (event){
                    if(!$scope.isZoom){
                        $scope.controls.dollyIn(2);
                    }else{
                        $scope.controls.dollyOut(2);
                    }
                    $scope.isZoom = !$scope.isZoom;
                }
             /*
                function onDocumentMouseMove( event ) {
                    mouseX = event.clientX - windowHalfX;
                    mouseY = event.clientY - windowHalfY;

                    targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.01;
                    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.01;
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

                function debugInfo()
                {
                    $('#debug').html("mouseX : " + mouseX + "   mouseY : " + mouseY );

                }
             */

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

                $scope.paneChanged = function(pane) {
                    $scope.selectedPane = pane;
                    if(pane == "tabs" || pane == "shoes") {
                        _.defer(function() {
                            var left = $(".slick-left");
                            if(left.length > 0) {
                                left.slick('resize');
                                left.slick('setPosition');
                            }
                            var right = $(".slick-right");
                            if(right.length > 0) {
                                right.slick('resize');
                                right.slick('setPosition');
                            }

                            var shoe = $(".slick-shoe");
                            if(shoe.length > 0) {
                                shoe.slick('resize');
                                shoe.slick('setPosition');
                            }
                        });
                    } else if (pane == "comment") {
                        $scope.setSurveyMode();
                    } else if (pane == "shuffle" || pane == "random") {
                        _.delay(function() {
                            $scope.selectedPane = "main";
                            $scope.tabs['main'].active = true;
                        });
                    }
                }

                $scope.togglePane = function(pane) {

                    if ($scope.selectedPane == pane) {
                        _.delay(function() {
                            $scope.$apply(function() {
                            $scope.selectedPane = "main";
                            $scope.tabs['main'].active = true;
                            });
                        });
                    }
                }

                $scope.isSurveyOn = false;

                $scope.getSurveyForm = function (){
                    return $scope.isSurveyOn;
                }//end getSurveyForm ()

                $scope.setSurveyMode = function () {
                    $scope.isSurveyOn = !$scope.isSurveyOn;
                    console.log("survery mode is: " + $scope.isSurveyOn);
                };

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

                    $http.post("/tab-lab/server.php", null, config)
                        .success(function (data, status, headers, config)
                        {
                            $scope[resultVarName] = data;
                            $scope.setSurveyMode();
                            $scope.togglePane("comment");

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
