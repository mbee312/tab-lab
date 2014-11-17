(function() {
  'use strict';

  // Declare app level module which depends on views, and components
  var plaeChefApp = angular.module('plaeChefApp', ['ngDragDrop']);


  plaeChefApp.controller('PlaeChefController', ['$scope', '$http', function($scope, $http){
    var canvas = document.getElementById('plae-chef-canvas');
    var context = canvas.getContext('2d');
    // Tabs on canvas List Arrays
    $scope.tabs = [];
    $scope.basket =[];

    $http.get('product/shoeStyles.json').success(function(data) {
      $scope.shoesStyles = data;
    });
    $http.get('product/shoes.json').success(function(data) {
      $scope.shoeList = data;
    });

    $http.get('product/tabs.json').success(function(data) {
      $scope.tabList = data;
    }); 
    
    // setup canvas
    canvas.width=727;//horizontal resolution (?) - increase for better looking text
    canvas.height=512;//vertical resolution (?) - increase for better looking text
    canvas.style.width=512;//actual width of canvas
    canvas.style.height=512;//actual height of canvas

    this.makeBaseImage = function(imageUrl, specialSize)
    {

      // Store the current transformation matrix
      context.save();

      // Use the identity matrix while clearing the canvas
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Restore the transform
      context.restore();

      var base_image = new Image();
      base_image.src = imageUrl;
      if(specialSize === 0){
        context.drawImage(base_image, 40, 100);
      }else{ //draw camille to fit window
        context.drawImage(base_image, 40, 100, 400,400);
      }
    }; //end makeBaseImage


        // Add a Item to the list
    this.addTab = function (tab, event) {

        $scope.tabs.push(tab);


    };




  }]);


  plaeChefApp.controller('StylesTabController', function($scope){
    this.stylestab = '';
    this.setTab = function(newValue){
      this.stylestab = newValue;
    };

    this.isSet = function(tabName){
        return this.stylestab === tabName;

    };

      /*
    $scope.handleDrop = function() {
        alert('Item has been dropped');
    } */


  });

    /*
  plaeChefApp.directive('draggable', function() {
    return function(scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }
  });

  plaeChefApp.directive('droppable', function() {
    return {
        scope: {
          drop: '&', //parent
          bin: '=' //bi-directional scope
        },
        link: function(scope, element) {
          // again we need the native object
          var el = element[0];

          el.addEventListener(
            'dragover',
            function(e) {
              e.dataTransfer.dropEffect = 'move';
              // allows us to drop
              if (e.preventDefault) e.preventDefault();
              this.classList.add('over');
              return false;
            },
            false
          );

          el.addEventListener(
            'dragenter',
            function(e) {
              this.classList.add('over');
              return false;
            },
          false
          );

          el.addEventListener(
            'dragleave',
            function(e) {
              this.classList.remove('over');
              return false;
            },
            false
          );
          el.addEventListener(
            'drop',
            function(e) {
              // Stops some browsers from redirecting.
              if (e.stopPropagation) e.stopPropagation();

              this.classList.remove('over');

              var binId = this.id;
              var item = document.getElementById(e.dataTransfer.getData('Text'));
              this.appendChild(item);

              // call the drop passed drop function
              scope.$apply(function(scope) {
                var fn = scope.drop();
                if ('undefined' !== typeof fn) {
                  fn(item.id, binId);
                  }
                });
              return false;
          },
          false
          );
        }//end link
    }
  });

  */

})();

