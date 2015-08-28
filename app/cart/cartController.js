/**
 * CartCtrl.js
 * Created by albertllavore on 8/28/15.
 */
(function () {
    'use strict';

    var app = angular.module('tabLabApp');
    app.controller('CartCtrl', ['$scope', 'sharedProperties', function ($scope, sharedProperties) {

        $scope.getSubTotal = function () {
            console.log("subtotal is " + $scope.subTotal);
            return $scope.subTotal;
        };

        $scope.calculateSubTotal = function (){
            var sTotal = 0;
            sTotal = $scope.shoeSelected.price + $scope.tabs.left.price + $scope.tabs.right.price;
            console.log("subtotal=" +sTotal);
            $scope.subTotal = sTotal;
        };
        
        $scope.remove = function (side) {
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
                    $scope.subTotal -= $scope.shoeSelected.price;
                    $scope.shoeSelected = null;
                    $scope.clearImage(topViewTabCanvas, tptabcontext, side);
                    $scope.clearImage(topViewCanvas, tpcontext, side);
                    break;
                default:
                    console.log("no tabs removed");
            }
        };

    }]);
}());
