
/**
 * SliderCtrl.js
 */
(function () {
    'use strict';

    var app = angular.module('tabLabApp');
    app.$inject = ['$scope', 'sliderProperties'];
    app.service('sliderProperties', function (){
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
            },
            getTabIndex: function (pos) {
                return tabIndex[pos];
            },
            setTabIndex: function (pos, index) {
                tabIndex[pos] = index;
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
            $(selector).slick('slickGoTo', index, false);
        };

        $scope.random = function (){
            $scope.shoeIndex = Math.floor(Math.random() * sliderProperties.getNumOfShoes());
            $scope.shoeIndexNew = $scope.shoeIndex;
            $scope.leftTabIndex = Math.floor(Math.random() * sliderProperties.getNumOfTabs());
            $scope.lTindex = $scope.leftTabIndex;
            $scope.rightTabIndex = Math.floor(Math.random() * sliderProperties.getNumOfTabs());
            $scope.rTindex = $scope.rightTabIndex;
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
            switch (side) {
                case "left":
                    $('#tab-left-slider-desktop').slick('slickPrev');
                    break;
                case "center":
                    $('#shoe-slider-desktop').slick('slickPrev');
                    break;
                case "right":
                    $('#tab-right-slider-desktop').slick('slickPrev');
                    break;
                case "top":
                    $('#shoe-slider').slick('slickPrev');
                    break;
                case "middle":
                    $('#tab-left-slider').slick('slickPrev');
                    break;
                case "bottom":
                    $('#tab-right-slider').slick('slickPrev');
                    break;
            } //end switch

        };// end previous()

        $scope.next = function (side){
            switch (side) {
                case "left":
                    $('#tab-left-slider-desktop').slick('slickNext');
                    break;
                case "center":
                    $('#shoe-slider-desktop').slick('slickNext');
                    break;
                case "right":
                    $('#tab-right-slider-desktop').slick('slickNext');
                    break;
                case "top":
                    $('#shoe-slider').slick('slickNext');
                    break;
                case "middle":
                    $('#tab-left-slider').slick('slickNext');
                    break;
                case "bottom":
                    $('#tab-right-slider').slick('slickNext');
                    break;
            } //end switch
        };// end next()

        $scope.$watch(function () {
            return $scope.shoeIndex;
        }, function (shoeIndex, shoeIndexNew) {
            if (shoeIndex !== shoeIndexNew) {
            /*    if(shoeIndex == $scope.shoeList.length -1 ){
                    $scope.isEndOfShoeList = true;
                    $(".slick-shoe .slick-cloned").addClass("translate-slider-x");
                }else{
                    $scope.isEndOfShoeList = false;
                    $(".slick-shoe .slick-cloned").removeClass("translate-slider-x");
                }
                */
                // save old shoe for comparison
                var oldShoe = $scope.shoeList[$scope.shoeIndexNew];
                console.log("old shoe is:");
                console.log(oldShoe);
                $scope.shoeIndexNew = shoeIndex;
                // Get the current slide
             //   var currentSlide = $("#shoe-slider-mobile").slick('slickCurrentSlide');
                $scope.setShoe($scope.shoeList[shoeIndex]);
                var shoe = tabLabProperties.getShoe();

                cartProperties.updateCart(shoe, "shoe");
                if(oldShoe.name.toString() == shoe.name.toString()){
                    $scope.updateShoe($scope.scene, 'left', false);
                    $scope.updateShoe($scope.scene, 'right', false);
                }else {

                    // need to add promise to delete old shoe first


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
            }
        });

        $scope.$watch(function () {
            return $scope.leftTabIndex;
        }, function (leftTabIndex, lTIndex) {
            if (leftTabIndex !== lTIndex) {
            /*    if(leftTabIndex == $scope.tabList.length -1 ){
                    $scope.isEndOfTabListL = true;
                    $(".slick-left .slick-cloned").addClass("translate-slider-x");
                }else{
                    $scope.isEndOfTabListL = false;
                    $(".slick-left .slick-cloned").removeClass("translate-slider-x");
                }
                */
                var shoe = tabLabProperties.getShoe();
                $scope.lTIndex = leftTabIndex;
                $scope.setTab($scope.tabList[leftTabIndex], 0);
                $scope.setTab($scope.tabList[leftTabIndex], 2);
                $scope.updateTabs($scope.scene, 0);
                if(shoe.numOfTabs != 2) {
                    $scope.updateTabs($scope.scene, 2);
                }
                var tabLeft = tabLabProperties.getTab(1);
                cartProperties.updateCart(tabLeft, "tabLeft");
            }
        });

        $scope.$watch(function () {
            return $scope.rightTabIndex;
        }, function (rightTabIndex, rTIndex) {

            if (rightTabIndex !== rTIndex) {
                if(rightTabIndex == $scope.tabList.length -1 ){
                    $scope.isEndOfTabListR = true;
                    $(".slick-right .slick-cloned").addClass("translate-slider-x");
                }else{
                    $scope.isEndOfTabListR = false;
                    $(".slick-right .slick-cloned").removeClass("translate-slider-x");
                }
                var shoe = tabLabProperties.getShoe();
                $scope.rTIndex = rightTabIndex;
                $scope.setTab($scope.tabList[rightTabIndex], 1);
                $scope.setTab($scope.tabList[rightTabIndex], 3);
                $scope.updateTabs($scope.scene, 1);
                if(shoe.numOfTabs != 2) {
                    $scope.updateTabs($scope.scene, 3);
                }
                var tabRight = tabLabProperties.getTab(1);
                cartProperties.updateCart(tabRight, "tabRight");
            }
        });

    }]);
}());