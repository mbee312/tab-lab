/**
* SceneCtrl.js
*/
(function () {
    'use strict';

    var app = angular.module('tabLabApp');
    app.controller('SceneCtrl', ['$scope', 'tabLabProperties', 'sizeProperties', function($scope, tabLabProperties, sizeProperties) {
        var group, text, plane;
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
}]);

}());