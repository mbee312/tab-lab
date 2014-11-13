(function() {
  var app = angular.module('plae-chef-shoes', [ ]);

  app.directive("shoeStylesMenu", function() {
    return {
      restrict: "E",
      templateUrl: "shoe-styles-menu.html",
      controller: function() {
        this.shoe = 1;

        this.isSet = function(checkStyle) {
          return this.shoe === checkStyle;
        };

        this.setStyle = function(activeStyle) {
          this.shoe = activeStyle;
        };
      },
      controllerAs: "shoe"
    };
  });

  app.directive("tabStylesMenu", function() {
    return {
      restrict: "E",
      templateUrl: "tab-styles-menu.html",
      controller: function() {
        this.tab = 1;

        this.isSet = function(checkStyle) {
          return this.tab === checkStyle;
        };

        this.setTab = function(activeStyle) {
          this.tab = activeStyle;
        };
      },
      controllerAs: "tab"
    };
  });
})();
