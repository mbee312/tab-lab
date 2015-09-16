/**
 * CartCtrl.js
 * Created by albertllavore on 8/28/15.
 */
(function () {
    'use strict';

    var app = angular.module('tabLabApp');
    app.$inject = ['$scope', 'cartProperties'];
    app.service('cartProperties', function (){
        var subTotal = 0;
        var cart = {};
        return{
            getCart: function (){
                return cart;
            },
            updateCart: function(item, type){
                cart[type] = item;
            },
            getSubTotal: function () {
                return subTotal;
            },
            calculateSubTotal: function () {
                var cartSize = _.size(cart)
                if(cartSize == 3) {
                    subTotal = cart["shoe"].price + cart["tabLeft"].price + cart["tabRight"].price;
                }
                return subTotal;
            }
        };
    });
    app.controller('CartCtrl', ['$scope', '$http', 'tabLabProperties', 'sizeProperties', 'cartProperties', function ($scope, $http, tabLabProperties, sizeProperties, cartProperties) {

        $scope.$on('shoe-set', function(event, args) {
            cartProperties.updateCart(tabLabProperties.getShoe(), "shoe");
            $scope.subTotal = cartProperties.calculateSubTotal();

        });

        $scope.$on('tab-set', function(event, pos) {
            var type = "tabLeft";
            if(pos == 1 || pos == 3){
                type = "tabRight";
            }
            cartProperties.updateCart(tabLabProperties.getTab(pos), type);
            $scope.subTotal = cartProperties.calculateSubTotal();

        });



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

        $scope.addToCart = function () {

            var url = '/ajax/index/add/product/';
            var shoe = tabLabProperties.getShoe();
            var tabs = {};
            for (var i = 0; i < 4; i++) {
                var tab = tabLabProperties.getTab(i);
                tabs[tab.id] = (tabs[tab.id] || 0) + 1;
            }
            if (shoe) {
                var size = sizeProperties.getShoeSize();
                var shoeParams = {'isAjax':1};
                shoeParams["super_attribute[" + $scope.attributeOptions["code"]["color"] + "]"] = $scope.attributeOptions["color"][shoe.name][shoe.color];
                shoeParams["super_attribute[" + $scope.attributeOptions["code"]["size"] + "]"] = "216";
                var shoeurl = url + shoe.id;

                var responsePromise = $http.get(shoeurl, {'params': shoeParams});

                responsePromise.success(function(data, status, headers, config) {
                    if (status == 200) {
                        console.log(data);
                    } else {
                        console.log("Adding " + shoe.id + " failed!");
                    }
                });
                responsePromise.error(function(data, status, headers, config) {
                    console.log("Adding " + shoe.id + " failed!");
                });
            }
            _.each(tabs, function(tabCount, tabId){
                var tabUrl = url + tabId;
                var tabParams = {'isAjax':1};
                tabParams["super_attribute[" + $scope.attributeOptions["code"]["tabsize"] + "]"] = $scope.tabs.size.id;
                tabParams["qty"] = tabCount / 2;

                var tabResponsePromise = $http.get(tabUrl, {'params': tabParams});

                tabResponsePromise.success(function(data, status, headers, config) {
                    if (status == 200) {
                        console.log(data);
                    } else {
                        console.log("Adding " + tabSelected[0] + " failed!");
                    }
                });
                tabResponsePromise.error(function(data, status, headers, config) {
                    console.log("Adding " + tabSelected[0] + " failed!");
                });
            });
        }

    }]);
    console.log(app.contorl)
}());
