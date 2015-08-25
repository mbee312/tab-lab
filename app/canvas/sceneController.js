/**
* SceneCtrl.js
*/
(function () {
    'use strict';

    var app = angular.module('plaeChefApp');
    app.controller('SceneCtrl', ['$scope', function($scope) {
    var container, scene, renderer, camera, clock, loader;
    var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;

    $scope.isMobile = false;
    $scope.cWidth = 0; // canvas width

    $scope.isMobileScreen = function (){
        return $scope.isMobile;
    } //end isMobileScreen()

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
    }

    $scope.setAllCanvasWidthsAndHeight = function (x, y){
        $scope.cWidth = $scope.calculateCanvasWidth(); // canvas calculated width

        //x and y is used in case canvas is not a square
        WIDTH = $scope.cWidth+x;
        HEIGHT = $scope.cWidth+y;
    }


    var mobileScaleFactor = .41;
    var mobileScaleFactorWide = .27;
    var smartphoneScaleFactor = .85;
    var smartphoneScaleFactorWide = .27;
    var tabletScaleFactor = .6;
    var tabletScaleFactorWide = .5;
    var defaultScaleFactor = .8;

    $scope.scaleFactor = 1;
    $scope.tabScaleFactorOffset = 1.25;

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
        $scope.drawShoe();
        $scope.drawTabs();


    } //end checkWindowSize()

    // When the page first loads
    window.onload = $scope.findAndSetCanvasDimensions;

    // When the browser changes size
    window.onresize = $scope.findAndSetCanvasDimensions;




    container = document.querySelector('.tablab-viewer');

    clock = new THREE.Clock();

    WIDTH = 600,
        HEIGHT = 600;

    VIEW_ANGLE = 40,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 1,
        FAR = 100;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFShadowMap;
    renderer.shadowMapAutoUpdate = true;
    renderer.setClearColor(0xffffff, 1);

    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    camera.position.set(0, 10, 30);
    camera.rotation.x = -Math.PI / 12;

    scene.add(camera);



    loader = new THREE.JSONLoader();
    var mesh;
    loader.load('assets/models/max/shoe.js', function (geometry, materials) {
        var material = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('assets/models/texture/shoe/max/left/suede-camo-print-steel-camo/Difuse.jpg'),
            normalMap: THREE.ImageUtils.loadTexture( "assets/models/texture/shoe/max/left/suede-camo-print-steel-camo/Normal.jpg" ),
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

        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.rotation.y = -Math.PI/5;
        mesh.scale.multiplyScalar(3);

        scene.add(mesh);
        render();
    });

    loader.load('assets/models/max/tab1.js', function (geometry, materials) {
        var materialTabOne = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('assets/models/texture/tabs/flames-fiery-red-glow-in-the-dark/difuse.jpg'),
            normalMap: THREE.ImageUtils.loadTexture( "assets/models/texture/tabs/flames-fiery-red-glow-in-the-dark/normals.jpg" ),
            normalScale: new THREE.Vector2( 0.6, 0.6 ),
            colorAmbient: [0.480000026226044, 0.480000026226044, 0.480000026226044],
            colorDiffuse: [0.480000026226044, 0.480000026226044, 0.480000026226044],
            colorSpecular: [0.8999999761581421, 0.8999999761581421, 0.8999999761581421],
            shininess: 15
        });

        mesh = new THREE.Mesh(
            geometry,
            materialTabOne
        );

        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.rotation.y = -Math.PI/5;
        mesh.scale.multiplyScalar(3);

        scene.add(mesh);
        render();
    });

    function render() {
        var time = clock.getElapsedTime();
        mesh.rotation.y += .01;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    var lightKey = new THREE.DirectionalLight(0xffffff);

    lightKey.position.set(-3, 5, 3);
    lightKey.target.position.x = 0;
    lightKey.target.position.y = 0;
    lightKey.target.position.z = 0;
    lightKey.castShadow = false;
    lightKey.intensity = .9
    lightKey.shadowCameraLeft = -60;
    lightKey.shadowCameraTop = -60;
    lightKey.shadowCameraRight = 60;
    lightKey.shadowCameraBottom = 60;
    lightKey.shadowCameraNear = 1;
    lightKey.shadowCameraFar = 1000;
    lightKey.shadowBias = -.0001
    lightKey.shadowMapWidth = lightKey.shadowMapHeight = 2048;
    lightKey.shadowDarkness = .7;

    scene.add(lightKey);

    var lightFill = new THREE.DirectionalLight(0xffffff);

    lightFill.position.set(3, 5, 3);
    lightFill.intensity = .6
    lightFill.castShadow = false;
    /*   lightFill.shadowCameraLeft = -60;
     lightFill.shadowCameraTop = -60;
     lightFill.shadowCameraRight = 60;
     lightFill.shadowCameraBottom = 60;
     lightFill.shadowCameraNear = 1;
     lightFill.shadowCameraFar = 1000;
     lightFill.shadowBias = -.0001
     lightFill.shadowMapWidth = light.shadowMapHeight = 1024;
     lightFill.shadowDarkness = .7;
     */

    scene.add(lightFill);

    var lightRim = new THREE.DirectionalLight(0xffffff);

    lightRim.position.set(0, 5, -3);
    lightRim.intensity = .2
    lightRim.castShadow = false;
    /*   lightRim.shadowCameraLeft = -60;
     lightRim.shadowCameraTop = -60;
     lightRim.shadowCameraRight = 60;
     lightRim.shadowCameraBottom = 60;
     lightRim.shadowCameraNear = 1;
     lightRim.shadowCameraFar = 1000;
     lightRim.shadowBias = -.0001
     lightRim.shadowMapWidth = light.shadowMapHeight = 1024;
     lightRim.shadowDarkness = .7;
     */

    scene.add(lightRim);


}]);

}());