
/**
 * SliderCtrl.js
 */
(function () {
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
            var i = $scope.setRandomIndex('shoe', 0);
            var j = $scope.setRandomIndex('tab', 0);
            var k = $scope.setRandomIndex('tab', 1);

            // set  shoe
            $scope.$broadcast('new-shoe-index', i);

            // set  tabs
            $scope.$broadcast('new-tab-left-index', j);
            $scope.$broadcast('new-tab-right-index', k);

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
            $scope.updateTabs($scope.scene, 0);
            $scope.updateTabs($scope.scene, 1);
            $scope.updateTabs($scope.scene, 2);
            $scope.updateTabs($scope.scene, 3);

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
                    var oldShoe = $scope.currentShoeObj["shoe"];
                    console.log("old shoe is:");
                    console.log(oldShoe);
                }
                $scope.setShoe($scope.shoeList[index]);

                var shoe = tabLabProperties.getShoe();

                cartProperties.updateCart(shoe, "shoe");
                if(oldShoe.name == shoe.name.toString()){
                    $scope.updateShoeTexture($scope.scene, $scope.group, shoe.name, "left");
                    $scope.updateShoeTexture($scope.scene, $scope.group, shoe.name, "right");
                }else {

                    $scope.drawShoe($scope.scene, 'left', 1.5);
                    $scope.drawShoe($scope.scene, 'right', -1.5);

                    // redraw tabs
                    $scope.drawTabs($scope.scene, 0, -1.5, 0, 0);
                    $scope.drawTabs($scope.scene, 1, 1.5, 0, 0);
                    if(shoe.numOfTabs != 2) {
                        $scope.drawTabs($scope.scene, 2, -1.5, 0, 0);
                        $scope.drawTabs($scope.scene, 3, 1.5, 0, 0);
                    }else{
                        //remove current bottom tabs
                        if (_.isEmpty($scope.currentTabObj[2]) == false) {
                            $scope.removeFromScene($scope.scene, $scope.currentTabObj[2]);
                        }
                        if (_.isEmpty($scope.currentTabObj[3]) == false) {
                            $scope.removeFromScene($scope.scene, $scope.currentTabObj[3]);
                        }
                    }
                }
        });

        $scope.$on('new-tab-right-index', function(event, index) {
                var shoe = tabLabProperties.getShoe();
                $scope.setTab($scope.tabList[index], 0);
                $scope.setTab($scope.tabList[index], 2);
                $scope.updateTabTexture($scope.scene, 0);
                if(shoe.numOfTabs != 2) {
                    $scope.updateTabs($scope.scene, 2);
                }
                var tabRight = tabLabProperties.getTab(0);
                cartProperties.updateCart(tabRight, "tabRight");
        });

        $scope.$on('new-tab-left-index', function(event, index) {
                var shoe = tabLabProperties.getShoe();
                $scope.setTab($scope.tabList[index], 1);
                $scope.setTab($scope.tabList[index], 3);
                $scope.updateTabs($scope.scene, 1);
                if(shoe.numOfTabs != 2) {
                    $scope.updateTabs($scope.scene, 3);
                }
                var tabLeft = tabLabProperties.getTab(1);
                cartProperties.updateCart(tabLeft, "tabLeft");
        });

    }]);
}());