
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
    app.controller('SliderCtrl', ['$scope', '$rootScope', 'tabLabProperties', 'sliderProperties', 'cartProperties', function ($scope, $rootScope, tabLabProperties, sliderProperties, cartProperties) {
        $scope.innerWidthSize = 0;
        $scope.innerWidthSizeNew = window.innerWidth;

        $scope.$on('move-slider-shoe', function(event, pos) {
            $scope.moveSlider('shoe', pos);
        });

        $scope.$on('move-slider-tab', function(event, pos) {
            $scope.moveSlider('tab', pos);
        });

        $scope.sliderSetShoe = _.debounce(_sliderSetShoe, 1000, true);

        function _sliderSetShoe (i){
            $scope.$broadcast('new-shoe-index', i);
        }

        $scope.sliderSetLeftTab = _.debounce(_sliderSetLeftTab, 1000, true);

        function _sliderSetLeftTab (i){
            $scope.$broadcast('new-tab-left-index', i);
        }

        $scope.sliderSetRightTab = _.debounce(_sliderSetRightTab, 1000, true);

        function _sliderSetRightTab (i){
            $scope.$broadcast('new-tab-right-index', i);
        }

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

        $scope.random = _.debounce(_random, 1000, true);

        function _random(){
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

        } //end random ()

        $scope.shuffle = _.debounce(_shuffle, 1000, true);

        function _shuffle(){
            var tabs = tabLabProperties.getAllTabs();
            var newTabs = [];
            var newTabsPosition = [];
            var newTabsTopOrBottom = [];

            // represents the physical tabs
            // [0]  [1]
            // [2]  [3]
            var tabPos = ['rt','lt','rb','lb'];
            tabPos = _.shuffle(tabPos);

            for(var i = 0; i < tabs.length; i++){
                if(tabPos[i] == 'rt'){
                    newTabs[i] = tabs[0];
                    newTabsPosition[i] = 0;
                    newTabsTopOrBottom[i] = 'top';
                }else if(tabPos[i] == 'lt'){
                    newTabs[i] = tabs[1];
                    newTabsPosition[i] = 1;
                    newTabsTopOrBottom[i] = 'top';
                }else if(tabPos[i] == 'rb'){
                    newTabs[i] = tabs[2];
                    newTabsPosition[i] = 2;
                    newTabsTopOrBottom[i] = 'bottom';
                }else{
                    newTabs[i] = tabs[3];
                    newTabsPosition[i] = 3;
                    newTabsTopOrBottom[i] = 'bottom';
                } // end if-else
                $scope.updateTabTextureShuffle(i, newTabs[i], newTabsPosition[i], newTabsTopOrBottom[i]);

            } //end for

        } //end shuffle ()

        $scope.previous = _.debounce(_previous, 1000, true);

        function _previous (side) {
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

        }// end previous()

        $scope.next = _.debounce(_next, 1000, true);

        function _next (side){
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
        }// end next()

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
            $scope.updateShoeTexture(function(){
                $scope.initDrawScene();
            });
            cartProperties.updateCart(shoe, 2);
            $rootScope.$broadcast('calculate-subtotal');
        });

        $scope.$on('new-tab-right-index', function(event, index) {
            var shoe = tabLabProperties.getShoe();
            $scope.setTab($scope.tabList[index], 0);
            $scope.setTab($scope.tabList[index], 2);
            $scope.updateTabTexture($scope.scene, 0, 'top');
            // update just in case shuffle
            $scope.updateTabTexture($scope.scene, 1, 'top');
            if(shoe.numOfTabs != 2) {
                $scope.updateTabTexture($scope.scene, 2, 'bottom');
                // update just in case shuffle
                $scope.updateTabTexture($scope.scene, 3, 'bottom');
            }

            var tabRight = tabLabProperties.getTab(0);
            cartProperties.updateCart(tabRight, 0);
            console.log("current right tab:");
            console.log(tabRight);
        });

        $scope.$on('new-tab-left-index', function(event, index) {
            var shoe = tabLabProperties.getShoe();
            $scope.setTab($scope.tabList[index], 1);
            $scope.setTab($scope.tabList[index], 3);
            $scope.updateTabTexture($scope.scene, 1, 'top');
            // update just in case shuffle
            $scope.updateTabTexture($scope.scene, 0, 'top');
            if(shoe.numOfTabs != 2) {
                $scope.updateTabTexture($scope.scene, 3, 'bottom');
                // update just in case shuffle
                $scope.updateTabTexture($scope.scene, 2, 'bottom');
            }
            
            var tabLeft = tabLabProperties.getTab(1);
            cartProperties.updateCart(tabLeft, 1);
            console.log("current left tab:");
            console.log(tabLeft);

        });

        $scope.$on('new-tab-right-index-random', function(event, index) {
            var shoe = tabLabProperties.getShoe();
            var tabRight = tabLabProperties.getTab(0);
            cartProperties.updateCart(tabRight, 0);
        });

        $scope.$on('new-tab-left-index-random', function(event, index) {
            var shoe = tabLabProperties.getShoe();
            var tabLeft = tabLabProperties.getTab(1);
            cartProperties.updateCart(tabLeft, 1);
        });

    }]);
}(jQuery));