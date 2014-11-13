(function() {
'use strict';

  // Declare app level module which depends on views, and components
  var plaeChefApp = angular.module('plaeChefApp', ["ngAnimate"]);


  plaeChefApp.controller('PlaeChefController', ['$scope', '$http', function($scope, $http){
    $http.get('product/shoeStyles.json').success(function(data) {
      $scope.shoesStyles = data;
    });
    $http.get('product/shoes.json').success(function(data) {
      $scope.shoeList = data;
    });

    $http.get('product/tabs.json').success(function(data) {
      $scope.tabList = data;
    }); 

  }]);

plaeChefApp.controller('StylesTabController', function(){
    this.stylestab = '';

    this.setTab = function(newValue){
      this.stylestab = newValue;
    };

    this.isSet = function(tabName){
      return this.stylestab === tabName;
    };
  });


 // angular.module('angularSlideables', [])
plaeChefApp.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
})
plaeChefApp.directive('slideToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target = document.querySelector(attrs.slideToggle);
            attrs.expanded = false;
            element.bind('click', function() {
                var content = target.querySelector('.slideable_content');
                if(!attrs.expanded) {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                } else {
                    target.style.height = '0px';
                }
                attrs.expanded = !attrs.expanded;
            });
        }
    }
});



    /*

  function imgURLsShoe(menuIcon, profileMain){
      this.menuIcon = menuIcon;
      this.profileMain = profileMain;
    } //end imgURLsShoe

  function imgURLsTab(menuIcon, tabOne, tabTwo, tabOneMain, tabTwoMain){
      this.menuIcon = menuIcon;
      this.tabOne = tabOne;
      this.tabTwo = tabTwo;
      this.tabOneMain = tabOneMain;
      this.tabTwoMain = tabTwoMain;
    } //end imgURLsTabs

  Shoe.prototype = {
        getNumOfTabs: function (){return this.numOfTabs;}
  };

  function Shoe(styleName, id, numOfTabs, color, sku, imgURLsObj){
        this.name = styleName;
        this.id = id;
    //    this.sizes = [8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,1,1.5,2,2.5,3];
    //    this.qtyArray = qtyArray;
        this.numOfTabs = numOfTabs;
        this.color = color;
        this.sku = sku;
        this.imgURLsObj = imgURLsObj; // for example purposes lets use a single URL but should be object
  }

  function Tab(styleName, id, color, sku, imgURLsObj){
        this.name = styleName;
        this.id = id;
    //    this.qtyArray = qtyArray;
        this.color = color;
        this.sku = sku;
        this.imgURLsObj = imgURLsObj;

      //  this.size = [S,M,L,XL];
      //  this.isAPair = false; //bool to check if tabs needs to stay a pair
  }
  */
   

  })();

