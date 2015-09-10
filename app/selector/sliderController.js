
/**
 * SliderCtrl.js
 */
(function () {
    'use strict';

    var app = angular.module('tabLabApp');
    app.controller('SliderCtrl', ['$scope', 'tabLabProperties', 'sizeProperties', 'sliderProperties', function ($scope, tabLabProperties, sizeProperties, sliderProperties) {
        $scope.innerWidthSize = 0;
        $scope.innerWidthSizeNew = window.innerWidth;

        $scope.setShoe = function(shoe){
            tabLabProperties.setShoeSelected(shoe);
        };

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
            console.log("randomNum=" + randomNum);
            $scope.setTabPositions(randomNum);
            $scope.drawTabs("left");
            $scope.drawTabs("right");

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
                if(shoeIndex == $scope.shoeList.length -1 ){
                    $scope.isEndOfShoeList = true;
                    $(".slick-shoe .slick-cloned").addClass("translate-slider-x");
                }else{
                    $scope.isEndOfShoeList = false;
                    $(".slick-shoe .slick-cloned").removeClass("translate-slider-x");
                }
                // save old shoe for comparison
                var oldShoe = $scope.shoeList[$scope.shoeIndexNew];
                $scope.shoeIndexNew = shoeIndex;
                // Get the current slide
                var currentSlide = $("#shoe-car-mobile").slick('slickCurrentSlide');
                $scope.shoeSelected = $scope.shoeList[shoeIndex];
                $scope.setShoe($scope.shoeSelected);
                if(oldShoe.name.toString() == $scope.shoeSelected.name.toString()){
                    $scope.updateShoe($scope.scene, 'left');
                    $scope.updateShoe($scope.scene, 'right');
                }else {
                    $scope.drawShoe($scope.scene, 'left', 1.5);
                    $scope.drawShoe($scope.scene, 'right', -1.5);

                    // redraw tabs
                    $scope.drawTabs($scope.scene, 0, -1.5, 0, 0);
                    $scope.drawTabs($scope.scene, 2, -1.5, 0, 0);

                    $scope.drawTabs($scope.scene, 1, 1.5, 0, 0);
                    $scope.drawTabs($scope.scene, 3, 1.5, 0, 0);
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
                if(leftTabIndex == $scope.tabList.length -1 ){
                    $scope.isEndOfTabListL = true;
                    $(".slick-left .slick-cloned").addClass("translate-slider-x");
                }else{
                    $scope.isEndOfTabListL = false;
                    $(".slick-left .slick-cloned").removeClass("translate-slider-x");
                }
                $scope.lTIndex = leftTabIndex;
                $scope.tabSelected[0] = $scope.tabList[leftTabIndex];
                $scope.tabSelected[2] = $scope.tabList[leftTabIndex];
                $scope.setTab($scope.tabSelected[0], 0);
                $scope.setTab($scope.tabSelected[2], 2);
                $scope.updateTabs($scope.scene, 0);
                $scope.updateTabs($scope.scene, 2);
            //    $scope.drawTabs($scope.scene, 0, 0, 0, -1.5, 0, 0);
            //    $scope.drawTabs($scope.scene, 0, 1, 1, -1.5, 0, 0);

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
                $scope.tabSelected[1] = $scope.tabList[rightTabIndex];
                $scope.tabSelected[3] = $scope.tabList[rightTabIndex];
                $scope.setTab($scope.tabSelected[1], 1);
                $scope.setTab($scope.tabSelected[3], 3);
                $scope.updateTabs($scope.scene, 1);
                $scope.updateTabs($scope.scene, 3);
            //    $scope.drawTabs($scope.scene, 1, 0, 0, 1.5, 0, 0);
            //    $scope.drawTabs($scope.scene, 1, 1, 1, 1.5, 0, 0);

            }

        });

    }]);
}());