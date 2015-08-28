
/**
 * SliderCtrl.js
 */
(function () {
    'use strict';

    var app = angular.module('tabLabApp');
    app.controller('SliderCtrl', ['$scope', 'sharedProperties', function($scope, sharedProperties) {

        $scope.innerWidthSize = 0;
        $scope.innerWidthSizeNew = window.innerWidth;

        $scope.setShoe = function(shoe){
            sharedProperties.setShoeSelected(shoe);
        };

    $scope.random = function (){
        $scope.index = Math.floor(Math.random() * 10);
        $scope.carouselIndex = $scope.index;
        $scope.leftTabIndex = Math.floor(Math.random() * 11);
        $scope.lTindex = $scope.leftTabIndex;
        $scope.rightTabIndex = Math.floor(Math.random() * 11);
        $scope.rTindex = $scope.rightTabIndex;

        if(!$scope.isMobile) {
            $('#shoe-car-desktop').slick('slickGoTo', $scope.carouselIndex, false);
            $('#tab-left-car-desktop').slick('slickGoTo', $scope.lTindex, false);
            $('#tab-right-car-desktop').slick('slickGoTo', $scope.rTindex, false);
        }else{
            $('#shoe-car-mobile').slick('slickGoTo', $scope.carouselIndex, false);
            $('#tab-left-car').slick('slickGoTo', $scope.lTindex, false);
            $('#tab-right-car').slick('slickGoTo', $scope.rTindex, false);
        }

    }; //end random ()

    $scope.shuffle = function (){
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

    }// end previous()

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
    }// end next()

    $scope.$watch(function () {
        return $scope.index;
    }, function (index, carouselIndex) {
        if (index !== carouselIndex) {
            if(index == $scope.shoeList.length -1 ){
                $scope.isEndOfShoeList = true;
                $(".slick-shoe .slick-cloned").addClass("translate-slider-x");
            }else{
                $scope.isEndOfShoeList = false;
                $(".slick-shoe .slick-cloned").removeClass("translate-slider-x");
            }
            $scope.carouselIndex = index;
            // Get the current slide
            var currentSlide = $("#shoe-car-mobile").slick('slickCurrentSlide');
            console.log(currentSlide);
            console.log('hey, carouselIndex has changed! ' + $scope.carouselIndex);
            console.log("the shoe is " + $scope.shoeList[index]);
            $scope.setShoe($scope.shoeList[index]);
            console.log("inside SlideController! " + sharedProperties.getShoe());
            console.log("drawShoe complete. calculate subtotal...");
            $scope.calculateSubTotal();
            console.log($scope.getSubTotal());
            console.log("watch shoe. complete");
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
            console.log('hey, lTIndex has changed! ' + $scope.lTIndex);
            console.log("the left tab is " + $scope.tabList[leftTabIndex]);
            $scope.addTab($scope.tabList[leftTabIndex], "left");
            $scope.setTabPositions();
            $scope.drawTabs("left");
            $scope.calculateSubTotal();
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
            console.log('hey, rTIndex has changed! ' + $scope.rTIndex);
            console.log("the right tab is " + $scope.tabList[rightTabIndex]);
            $scope.addTab($scope.tabList[rightTabIndex], "right");
            $scope.setTabPositions();
            $scope.drawTabs("right");

        }

    });

    }]);
}());