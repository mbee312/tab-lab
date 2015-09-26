/**
 * CartCtrl.js
 * Created by albertllavore on 8/28/15.
 */
(function ($) {
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
    app.controller('CartCtrl', ['$scope', '$http', '$q', 'tabLabProperties', 'sizeProperties', 'cartProperties', function ($scope, $http, $q, tabLabProperties, sizeProperties, cartProperties) {

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
            var calls = [];
            var callsData = [];
            for (var i = 0; i < 4; i++) {
                var tab = tabLabProperties.getTab(i);
                tabs[tab.product_id] = (tabs[tab.product_id] || 0) + 1;
            }
            var shoeSize = sizeProperties.getShoeSize();
            if (shoe && !shoeSize) {
                toastr.error("Please select a shoe size.");
                return;
            }
            if (!_.isEmpty(tabs)) {
                var tabSize = sizeProperties.getTabSize();
                if (!tabSize) {
                    toastr.error("Please select a tab size.");
                    return;
                }
            }
            if (shoe) {
                var shoeParams = {'isAjax':1};
                shoeParams["super_attribute[" + $scope.dataOptions["code"]["color"] + "]"] = shoe.color;
                shoeParams["super_attribute[" + $scope.dataOptions["code"]["size"] + "]"] = shoeSize.id;
                var shoeurl = url + shoe.product_id;

                callsData.push(shoe);
                calls.push(function() {return $http.get(shoeurl, {'params': shoeParams})});
            }
            for (var tabId in tabs) {
                var tabCount = tabs[tabId];
                var tabUrl = url + tabId;
                var tabParams = {'isAjax':1};
                tabParams["super_attribute[" + $scope.dataOptions["code"]["tabsize"] + "]"] = tabSize.id;
                tabParams["qty"] = tabCount / 2;

                (function(tabUrl, tabParams){
                    callsData.push({"id": tabId});
                    calls.push(function() {
                        return $http.get(tabUrl, {'params': tabParams})
                    });
                })(tabUrl, tabParams);
            }

// serially add the products
            var data = [];
            if (calls[0]) {
                calls[0]().then(function(result){
                    if (result) data.push(result.data);
                    return calls[1] ? calls[1]() : null;
                }).then(function(result){
                    if (result) data.push(result.data);
                    return calls[2] ? calls[2]() : null;
                }).then(function(result){
                    if (result) data.push(result.data);
                }).finally(function(error){
                    if (error) {
                        console.log(error);
                    }
                    else {
                        if(data.length > 0) {
                            var lastDataIndex = data.length - 1;
                            var header = data[lastDataIndex].header;
                            while (!header) {
                                lastDataIndex = lastDataIndex - 1;
                                header = data[lastDataIndex].header;
                            }
                            if (header) {
                                var $header = $($.parseHTML(header));
                                $("#cart").html($header.filter("#cart").html());
                                $(".cart-link").html($header.find(".cart-link").html());
                            }
                            for (var l in data) {
                                toastr[data[l].status.toLowerCase()](data[l].message);
                            }

                            console.log(data);
                        }
                    }
                });
            }


// Add all products at once
//            var promises = [];
//            for(var a in calls) {
//                promises.push(calls[a]());
//            }
//            $q.all(promises).then(function(results) {
//                /* your logic here */
//                console.log(results);
//            });

        }

    }]);
}(jQuery));
