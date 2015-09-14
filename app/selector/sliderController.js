
/**
 * SliderCtrl.js
 */
(function () {
    'use strict';

    var app = angular.module('tabLabApp');
    app.controller('SliderCtrl', ['$scope', 'tabLabProperties', 'sizeProperties', 'sliderProperties', function ($scope, tabLabProperties, sizeProperties, sliderProperties) {
        $scope.innerWidthSize = 0;
        $scope.innerWidthSizeNew = window.innerWidth;

        $scope.random = function (){
            $scope.shoeIndex = Math.floor(Math.random() * sliderProperties.getNumOfShoes());
            $scope.shoeIndexNew = $scope.shoeIndex;
            $scope.leftTabIndex = Math.floor(Math.random() * sliderProperties.getNumOfTabs());
            $scope.lTindex = $scope.leftTabIndex;
            $scope.rightTabIndex = Math.floor(Math.random() * sliderProperties.getNumOfTabs());
            $scope.rTindex = $scope.rightTabIndex;

            if(!$scope.isMobile) {
                $('#shoe-car-desktop').slick('slickGoTo', $scope.shoeIndexNew, false);
                $('#tab-left-car-desktop').slick('slickGoTo', $scope.lTindex, false);
                $('#tab-right-car-desktop').slick('slickGoTo', $scope.rTindex, false);
            }else{
                $('#shoe-car-mobile').slick('slickGoTo', $scope.shoeIndexNew, false);
                $('#tab-left-car').slick('slickGoTo', $scope.lTindex, false);
                $('#tab-right-car').slick('slickGoTo', $scope.rTindex, false);
            }
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
                    $('#tab-left-car-desktop').slick('slickPrev');
                    break;
                case "center":
                    $('#shoe-car-desktop').slick('slickPrev');
                    break;
                case "right":
                    $('#tab-right-car-desktop').slick('slickPrev');
                    break;
                case "top":
                    $('#shoe-car-mobile').slick('slickPrev');
                    break;
                case "middle":
                    $('#tab-left-car').slick('slickPrev');
                    break;
                case "bottom":
                    $('#tab-right-car').slick('slickPrev');
                    break;
            } //end switch

        };// end previous()

        $scope.next = function (side){
            switch (side) {
                case "left":
                    $('#tab-left-car-desktop').slick('slickNext');
                    break;
                case "center":
                    $('#shoe-car-desktop').slick('slickNext');
                    break;
                case "right":
                    $('#tab-right-car-desktop').slick('slickNext');
                    break;
                case "top":
                    $('#shoe-car-mobile').slick('slickNext');
                    break;
                case "middle":
                    $('#tab-left-car').slick('slickNext');
                    break;
                case "bottom":
                    $('#tab-right-car').slick('slickNext');
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
                $scope.shoeIndexNew = shoeIndex;
                // Get the current slide
                var currentSlide = $("#shoe-car-mobile").slick('slickCurrentSlide');
                tabLabProperties.setShoeSelected($scope.shoeList[shoeIndex]);
                var shoe = tabLabProperties.getShoe();
                if(oldShoe.name.toString() == shoe.name.toString()){
                    $scope.updateShoe($scope.scene, 'left', false);
                    $scope.updateShoe($scope.scene, 'right', false);
                }else {
                    $scope.drawShoe($scope.scene, 'left', 1.5);
                    $scope.drawShoe($scope.scene, 'right', -1.5);

                    // redraw tabs
                    $scope.drawTabs($scope.scene, 0, -1.5, 0, 0);
                    $scope.drawTabs($scope.scene, 1, 1.5, 0, 0);
                    if(shoe.numOfTabs != 1) {
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
             //   console.log("drawShoe complete. calculate subtotal...");
            //    $scope.calculateSubTotal();
            //    console.log($scope.getSubTotal());
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
                $scope.lTIndex = leftTabIndex;
                $scope.setTab($scope.tabList[leftTabIndex], 0);
                $scope.setTab($scope.tabList[leftTabIndex], 2);
                $scope.updateTabs($scope.scene, 0);
                $scope.updateTabs($scope.scene, 2);
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
                $scope.rTIndex = rightTabIndex;
                $scope.setTab($scope.tabList[rightTabIndex], 1);
                $scope.setTab($scope.tabList[rightTabIndex], 3);
                $scope.updateTabs($scope.scene, 1);
                $scope.updateTabs($scope.scene, 3);
            }

        });

    }]);
}());