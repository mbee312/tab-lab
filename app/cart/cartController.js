/**
 * CartCtrl.js
 * Created by albertllavore on 8/28/15.
 */
(function ($) {
    'use strict';

    var app = angular.module('tabLabApp');
    app.$inject = ['$scope', 'cartProperties'];
    app.service('cartProperties', function (){
        var DEBUG = true;
        var shoeSize = '';
        var tabSize = '';
        var wide = false;
        var subTotal = 0;
        var cart = [];
        return{
            getCart: function (){
                return cart;
            },
            updateCart: function(item, pos){
                cart[pos] = item;
            },
            getSubTotal: function () {
                return subTotal;
            },
            calculateSubTotal: function () {
                var cartSize = _.size(cart);
                if(cartSize == 3) {
                    subTotal = Number(cart[2].price) + Number(cart[1].price) + Number(cart[0].price);
                }
                return subTotal;
            },
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
                tabSize = size;
            },
            getFitWide: function () {
                return wide;
            },
            setFitWide: function () {
                wide = !wide;
            }
        };
    });
    app.controller('CartCtrl', ['$scope', '$rootScope', '$http', '$q', 'tabLabProperties', 'cartProperties', function ($scope, $rootScope, $http, $q, tabLabProperties, cartProperties) {

        $scope.DEBUG = true;
        // shoeSize variable for use in template
        $scope.shoe.size = 0;
        $scope.tabs.size = 0;

        $scope.isSizeSelected = function () {
            if (cartProperties.getShoeSize != null) {
                return true;
            } else {
                return false;
            }
        };//end isSizeSelected ()

        $scope.setSizeSelectMode = function (side){
            if(side == 'left') {
                $scope.isSizeEdit = !$scope.isSizeEdit;
            }else{
                $scope.isSizeEditRight = !$scope.isSizeEditRight;
            }
        };//end setSizeEditMode()

        $scope.getSizeSelectMode = function (side){
            if(side == 'left') {
                return $scope.isSizeEdit;
            }else{
                return $scope.isSizeEditRight;
            }
        };//end getSizeSelectMode ()

        $scope.showSize = function(size) {
            return size.show;
        };//end showSize) ()

        $scope.$watch(function () { return $scope.shoe.size; }, function (newValue, oldValue) {
            cartProperties.setShoeSize(newValue);
            calculateShoePrice();
            setTabSize();
            $scope.$broadcast('calculate-subtotal');
        });

        $scope.$watch(function () { return $scope.tabs.size; }, function (newValue, oldValue) {
            cartProperties.setTabSize(newValue);
            $scope.$broadcast('calculate-subtotal');
        });

        $scope.$watch(function () { return $scope.fit.wide; }, function (newValue, oldValue) {
            setTabSize();
        });

        $scope.$watch("fit.wide", function (newValue, oldValue) {
            setTabSize();
        });

        $scope.setWideFit = function (){
            cartProperties.setFitWide();
        };

        var calculateShoePrice = function () {
            var shoe = tabLabProperties.getShoe();
            if (shoe && shoe.simpleProducts && shoe.initial_price) {
                var simpleshoe = null;
                var size = cartProperties.getShoeSize().size;
                for (var s in shoe.simpleProducts) {
                    var simpleProduct = shoe.simpleProducts[s];
                    if (simpleProduct.sku == shoe.sku + '-' + size) {
                        simpleshoe = simpleProduct;
                        break;
                    }
                }
                shoe.price = simpleshoe ? simpleshoe.price : tabLabProperties.getShoe().initial_price;
            }
        };

        var setTabSize = function () {
            var size = cartProperties.getShoeSize();
            var wideOffset = 0;
            if(size){
                if (cartProperties.getFitWide() == true) {
                    wideOffset = 1;
                }

                // 8-9=S 9.5-12.5=M 13-3-L
                switch (size.size) {
                    case "6":
                    case "6.5":
                    case "7":
                    case "7.5":
                    case "8":
                    case "8.5":
                    case "9":
                        $scope.tabs.size = $scope.tabSizeOptions[wideOffset];
                        break;
                    case "9.5":
                    case "10":
                    case "10.5":
                    case "11":
                    case "11.5":
                    case "12":
                    case "12.5":
                        $scope.tabs.size = $scope.tabSizeOptions[1 + wideOffset];
                        break;
                    case "13":
                    case "13.5":
                    case "1":
                    case "1.5":
                    case "2":
                    case "2.5":
                    case "3":
                        $scope.tabs.size = $scope.tabSizeOptions[2 + wideOffset];
                        break;
                }// end switch
                cartProperties.setTabSize($scope.tabs.size);
            }//end if-else
        };// end setTabSize()

        $scope.moreOptions = function () {
            return $scope.sizeMoreOptions;
        };//end showMoreOptions()

        $scope.showMoreOptions = function () {
            if ($scope.sizeMoreOptions) {
                $scope.sizeMoreOptions = false;
            } else {
                $scope.sizeMoreOptions = true;
            }//end if-else
        };//end showMoreOptions()

        $scope.$on('calculate-subtotal', function(event, args) {
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

        $scope.addToCart = _.debounce(_addToCart, 500, true);

        function _addToCart () {

            var url = '/ajax/index/add/product/';
            var shoe = tabLabProperties.getShoe();
            var tabs = {};
            var calls = [];
            var callsData = [];
            for (var i = 0; i < 4; i++) {
                var tab = tabLabProperties.getTab(i);
                tabs[tab.product_id] = (tabs[tab.product_id] || 0) + 1;
            }
            var shoeSize = cartProperties.getShoeSize();
            if (shoe && !shoeSize) {
                toastr.error("Please select a shoe size.");
                return;
            }
            if (!_.isEmpty(tabs)) {
                var tabSize = cartProperties.getTabSize();
                if (!tabSize) {
                    toastr.error("Please select a tab size.");
                    return;
                }
            }
            if (shoe) {
                var shoeParams = {'isAjax':1};
                shoeParams["super_attribute[" + $scope.dataOptions["code"]["color"] + "]"] = shoe.color;
                shoeParams["super_attribute[" + $scope.dataOptions["code"]["size"] + "]"] = shoeSize.id;
                var shoeurl = url + shoe.super_id;

                callsData.push(shoe);
                calls.push(function(additionalParams) {
                    shoeParams = _.extend(shoeParams, additionalParams || {})
                    return $http.get(shoeurl, {'params': shoeParams})
                });
            }
            for (var tabId in tabs) {
                var tabCount = tabs[tabId];
                var tabUrl = url + tabId;
                var tabParams = {'isAjax':1};
                tabParams["super_attribute[" + $scope.dataOptions["code"]["tabsize"] + "]"] = tabSize.id;
                tabParams["qty"] = tabCount / 2;

                (function(tabUrl, tabParams){
                    callsData.push({"id": tabId});
                    calls.push(function(additionalParams) {
                        tabParams = _.extend(tabParams, additionalParams || {})
                        return $http.get(tabUrl, {'params': tabParams})
                    });
                })(tabUrl, tabParams);
            }

// serially add the products
            var data = [];
            if (calls[0]) {
                var additionalParams = [];
                additionalParams[calls.length - 1] = {'render':1};
                if (window.plae && window.plae.controllers && window.plae.controllers.mask) plae.controllers.mask.showProgressMask("adding to cart");
                calls[0](additionalParams[0]).then(function(result){
                    if (result) data.push(result.data);
                    return calls[1] ? calls[1](additionalParams[1]) : null;
                }).then(function(result){
                    if (result) data.push(result.data);
                    return calls[2] ? calls[2](additionalParams[2]) : null;
                }).then(function(result){
                    if (result) data.push(result.data);
                }).finally(function(error){
                    if (window.plae && window.plae.controllers && window.plae.controllers.mask) plae.controllers.mask.hideProgressMask();
                    if (error) {
                        console.log(error);
                    }
                    else {
                        if(data.length > 0) {
                            var lastDataIndex = data.length - 1;
                            var header = data[lastDataIndex].header;
                            while (!header && lastDataIndex > 0) {
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

                        }
                        $scope.togglePane("design");
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
