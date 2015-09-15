/**
 * CartCtrl.js
 * Created by albertllavore on 8/28/15.
 */
(function () {
    'use strict';

    var app = angular.module('tabLabApp');
    app.$inject = ['$scope', 'sizeProperties'];
    app.service('sizeProperties', function (){
        var shoeSize = '';
        var tabSize = '';
        var wide = false;
        var debug = true;

        return {
            getShoeSize: function () {
                return shoeSize;
            },
            setShoeSize: function (size) {
                shoeSize = size;
                if(debug) {
                    console.log("shoe size is set:");
                    console.log(shoeSize.size);
                }
            },
            getTabSize: function () {
                return tabSize;
            },
            setTabSize: function (size) {
                tabSize = size;
                if(debug) {
                    console.log("tab size is set:");
                    console.log(tabSize.size);
                }
            },
            getFitWide: function () {
                return wide;
            },
            setFitWide: function () {
                wide = !wide;
            }
        };
    });
    app.controller('SizeCtrl', ['$scope', 'tabLabProperties', 'sizeProperties', function ($scope, tabLabProperties, sizeProperties) {

        $scope.DEBUG = true;
        // shoeSize variable for use in template
        $scope.shoe.size = 0;
        $scope.tabs.size = 0;

        $scope.isSizeSelected = function () {
            if (sizeProperties.getShoeSize != null) {
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

        $scope.$watch(function () { return $scope.shoe.size; }, function (newValue, oldValue) {
            if($scope.DEBUG) {
                console.log("shoe size changed:");
                console.log(newValue);
            }
            sizeProperties.setShoeSize(newValue);
            setTabSize();
        });

        $scope.$watch(function () { return $scope.tabs.size; }, function (newValue, oldValue) {
            if($scope.DEBUG) {
                console.log("tab size changed:");
                console.log(newValue);
            }
            sizeProperties.setTabSize(newValue);
        });

        $scope.$watch(function () { return $scope.fit.wide; }, function (newValue, oldValue) {
            if($scope.DEBUG) {
                console.log("fit wide changed:");
                console.log(newValue);
            }

            setTabSize();
        });

        $scope.$watch("fit.wide", function (newValue, oldValue) {
            setTabSize();
        });

        $scope.setWideFit = function (){
            sizeProperties.setFitWide();
        };

        var setTabSize = function () {
            var size = sizeProperties.getShoeSize();
            var wideOffset = 0;
            if(size){
                if (sizeProperties.getFitWide() == true) {
                    wideOffset = 1;
                    console.log("wide fit = " + wideOffset);
                }

                if($scope.DEBUG){
                    console.log(size.size);
                }
                // 8-9=S 9.5-12.5=M 13-3-L
                switch (size.size) {
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
                sizeProperties.setTabSize($scope.tabs.size);
            }//end if-else
        };// end setTabSize()

        $scope.moreOptions = function () {
            return $scope.sizeMoreOptions;
        };//end showMoreOptions()

        $scope.showMoreOptions = function () {
            console.log("inside showMoreOptions()");
            if ($scope.sizeMoreOptions) {
                $scope.sizeMoreOptions = false;
                console.log("$scope.sizeMoreOptions set to false");
            } else {
                $scope.sizeMoreOptions = true;
                console.log("$scope.sizeMoreOptions set to true");
            }//end if-else
        };//end showMoreOptions()

    }]);
}());
