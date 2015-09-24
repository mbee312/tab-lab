
/**
 * SliderCtrl.js
 */
(function ($) {
    'use strict';

    var app = angular.module('tabLabApp');
    app.$inject = ['$scope', 'sliderProperties'];
    app.service('sliderProperties', function (){
        var DEBUG = true;
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
                if(DEBUG) {
                    console.log("shoe index is set:" + shoeIndex);
                }
            },
            getTabIndex: function (pos) {
                return tabIndex[pos];
            },
            setTabIndex: function (pos, index) {
                tabIndex[pos] = index;
                if(DEBUG) {
                    console.log("tab index: " + pos + " is set to: " + tabIndex[pos]);
                }
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
    app.controller('SliderCtrl', ['$scope', 'tabLabProperties', 'sizeProperties', 'sliderProperties', 'cartProperties', function ($scope, tabLabProperties, sizeProperties, sliderProperties, cartProperties) {
        $scope.innerWidthSize = 0;
        $scope.innerWidthSizeNew = window.innerWidth;


        $scope.$on('move-slider-shoe', function(event, pos) {
            $scope.moveSlider('shoe', pos);
        });

        $scope.$on('move-slider-tab', function(event, pos) {
            $scope.moveSlider('tab', pos);
        });

        $scope.sliderSetShoe = function(i){
            $scope.$broadcast('new-shoe-index', i);
        };

        $scope.sliderSetLeftTab = function(i){
            $scope.$broadcast('new-tab-left-index', i);
        };

        $scope.sliderSetRightTab = function(i){
            $scope.$broadcast('new-tab-right-index', i);
        };

        $scope.moveSlider = function (type, pos){
            var selector = "#" + type;
            var screen = "";
            var index;
            if (!$scope.isMobile) {
                screen = "-desktop";
            }
            if(type != 'shoe') {
                if (pos == 0 || pos == 2) {
                    index = $scope.getTabIndex(0);
                    selector += "-left";
                } else {
                    index = $scope.getTabIndex(1);
                    selector += "-right";
                }
            }else{
                index = $scope.getShoeIndex();
            }

            selector = selector + "-slider" + screen;
            console.log(selector);
        };

        $scope.random = function (){
            /*
            if(tabLabProperties.isShoeSelected()){
                // save old shoe for comparison
                var oldShoe = $scope.currentShoeObj;
            }
            */
            var i = $scope.setRandomIndex('shoe', 0);
            var j = $scope.setRandomIndex('tab', 0);
            var k = $scope.setRandomIndex('tab', 1);

            // set  tabs
            $scope.setTab($scope.tabList[j], 0);
            $scope.setTab($scope.tabList[j], 2);
            $scope.setTab($scope.tabList[k], 1);
            $scope.setTab($scope.tabList[k], 3);

            $scope.$broadcast('new-shoe-index', i);
            $scope.$broadcast('new-tab-left-index-random', j);
            $scope.$broadcast('new-tab-right-index-random', k);

        }; //end random ()

        $scope.shuffle = function (){
            var numOfCombinations = 24;

            var randomNum = Math.floor(Math.random() * 24 );
            var tabs = tabLabProperties.getAllTabs();
            for (var n = 0; n < tabs.length - 1; n++) {
                var k = n + Math.floor(Math.random() * (tabs.length - n));
                var temp = tabs[k];
                tabs[k] = tabs[n];
                tabs[n] = temp;
            }
            tabLabProperties.setAllTabs(tabs)
            $scope.updateTabTexture($scope.scene, 0);
            $scope.updateTabTexture($scope.scene, 1);
            $scope.updateTabTexture($scope.scene, 2);
            $scope.updateTabTexture($scope.scene, 3);

        }; //end shuffle ()

        $scope.previous = function (side) {
            var i;
            var selector;
            switch (side) {
                case "left":
                    selector = '#tab-left-slider-desktop';
                    $(selector).slick('slickPrev');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-tab-left-index', i);
                    break;
                case "center":
                    selector = '#shoe-slider-desktop';
                    $(selector).slick('slickPrev');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-shoe-index', i);
                    break;
                case "right":
                    selector = '#tab-right-slider-desktop';
                    $(selector).slick('slickPrev');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-tab-right-index', i);
                    break;
                case "top":
                    selector = '#shoe-slider';
                    $(selector).slick('slickPrev');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-shoe-index', i);
                    break;
                case "middle":
                    selector = '#tab-left-slider';
                    $(selector).slick('slickPrev');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-tab-left-index', i);
                    break;
                case "bottom":
                    selector = '#tab-right-slider';
                    $(selector).slick('slickPrev');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-tab-right-index', i);
                    break;
            } //end switch

        };// end previous()

        $scope.next = function (side){
            var i;
            var selector;
            switch (side) {
                case "left":
                    selector = '#tab-left-slider-desktop';
                    $(selector).slick('slickNext');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-tab-left-index', i);
                    break;
                case "center":
                    selector = '#shoe-slider-desktop';
                    $(selector).slick('slickNext');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-shoe-index', i);
                    break;
                case "right":
                    selector = '#tab-right-slider-desktop';
                    $(selector).slick('slickNext');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-tab-right-index', i);
                    break;
                case "top":
                    selector = '#shoe-slider';
                    $(selector).slick('slickNext');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-shoe-index', i);
                    break;
                case "middle":
                    selector = '#tab-left-slider';
                    $(selector).slick('slickNext');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-tab-left-index', i);
                    break;
                case "bottom":
                    selector = '#tab-right-slider';
                    $(selector).slick('slickNext');
                    i = $(selector).slick('slickCurrentSlide');
                    $scope.$broadcast('new-tab-right-index', i);
                    break;
            } //end switch
        };// end next()

        $scope.$on('new-shoe-index', function(event, index) {
            if(tabLabProperties.isShoeSelected()){
                    // save old shoe for comparison
                    var oldShoe = $scope.currentShoeObj;
                    console.log("old shoe is:");
                    console.log(oldShoe.name);
                    console.log(oldShoe);
            }
            $scope.setShoe($scope.shoeList[index]);

            var shoe = $scope.shoeList[index];
            $scope.updateShoeTexture($scope.scene, $scope.group, oldShoe, shoe);
            cartProperties.updateCart(shoe, "shoe");
        });

        $scope.$on('new-tab-right-index', function(event, index) {
            var shoe = tabLabProperties.getShoe();
            $scope.setTab($scope.tabList[index], 0);
            $scope.setTab($scope.tabList[index], 2);
            $scope.updateTabTexture($scope.scene, 0);
            if(shoe.numOfTabs != 2) {
                $scope.updateTabTexture($scope.scene, 2);
            }
            var tabRight = tabLabProperties.getTab(0);
            cartProperties.updateCart(tabRight, "tabRight");
        });

        $scope.$on('new-tab-left-index', function(event, index) {
            var shoe = tabLabProperties.getShoe();
            $scope.setTab($scope.tabList[index], 1);
            $scope.setTab($scope.tabList[index], 3);
            $scope.updateTabTexture($scope.scene, 1);
            if(shoe.numOfTabs != 2) {
                $scope.updateTabTexture($scope.scene, 3);
            }
            var tabLeft = tabLabProperties.getTab(1);
            cartProperties.updateCart(tabLeft, "tabLeft");
        });

        $scope.$on('new-tab-right-index-random', function(event, index) {
            var shoe = tabLabProperties.getShoe();
            var tabRight = tabLabProperties.getTab(0);
            cartProperties.updateCart(tabRight, "tabRight");
        });

        $scope.$on('new-tab-left-index-random', function(event, index) {
            var shoe = tabLabProperties.getShoe();
            var tabLeft = tabLabProperties.getTab(1);
            cartProperties.updateCart(tabLeft, "tabLeft");
        });

    }]);
}(jQuery));