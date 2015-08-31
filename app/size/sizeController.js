/**
 * CartCtrl.js
 * Created by albertllavore on 8/28/15.
 */
(function () {
    'use strict';

    var app = angular.module('tabLabApp');
    app.controller('SizeCtrl',
        ['$scope',
            'tabLabProperties',
            'sizeProperties',
            function ($scope, tabLabProperties, sizeProperties) {

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

        $scope.$watch("sizeProperties.shoeSize", function (newValue, oldValue) {
            $scope.setTabSize();

        });

        $scope.$watch("fit.wide", function (newValue, oldValue) {
            $scope.setTabSize();

        });

        $scope.setTabSize = function () {
            if( $scope.shoeSize.size != null){
                if ($scope.fit.wide == false) {
                    switch ($scope.shoeSize.size.size) {
                        case 8 :
                            $scope.tabs.size = $scope.tabSizeOptions[0];
                            break;
                        case 8.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[0];
                            break;
                        case 9 :
                            $scope.tabs.size = $scope.tabSizeOptions[0];
                            break;
                        case 9.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[1];
                            break;
                        case 10 :
                            $scope.tabs.size = $scope.tabSizeOptions[1];
                            break;
                        case 10.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[1];
                            break;
                        case 11 :
                            $scope.tabs.size = $scope.tabSizeOptions[1];
                            break;
                        case 11.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[1];
                            break;
                        case 12 :
                            $scope.tabs.size = $scope.tabSizeOptions[1];
                            break;
                        case 12.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[1];
                            break;
                        case 13 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 13.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 1 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 1.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 2 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 2.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 3 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                    }
                } else {
                    switch ($scope.shoeSize.size.size) {
                        case 8 :
                            $scope.tabs.size = $scope.tabSizeOptions[1];
                            break;
                        case 8.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[1];
                            break;
                        case 9 :
                            $scope.tabs.size = $scope.tabSizeOptions[1];
                            break;
                        case 9.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 10 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 10.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 11 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 11.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 12 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 12.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[2];
                            break;
                        case 13 :
                            $scope.tabs.size = $scope.tabSizeOptions[3];
                            break;
                        case 13.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[3];
                            break;
                        case 1 :
                            $scope.tabs.size = $scope.tabSizeOptions[3];
                            break;
                        case 1.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[3];
                            break;
                        case 2 :
                            $scope.tabs.size = $scope.tabSizeOptions[3];
                            break;
                        case 2.5 :
                            $scope.tabs.size = $scope.tabSizeOptions[3];
                            break;
                        case 3 :
                            $scope.tabs.size = $scope.tabSizeOptions[3];
                            break;
                    }// end switch
                }//end if-else
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
