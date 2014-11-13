(function() {
'use strict';

angular.module('plunker', ['ui.bootstrap']);
var TabsDemoCtrl = function ($scope, $timeout) {
  
  $scope.tabs = [];
  var previousTab = 0;
  $scope.currentTab = 0;
  
  $scope.$watch( 'tabs', function(newValue, oldValue) {
    // Only do this if the value changed
    var activeTab = null;
    var oldTab = newValue[$scope.currentTab];
    if(!oldTab.active) {
      previousTab = $scope.currentTab;
    }
    for(i=0;i<newValue.length;i++) {
      if(newValue[i].active) {
        activeTab=newValue[i];
        $scope.currentTab = i;  
        break;
      }
    }
    $scope.totalTabs = newValue.length-1; 
    $scope.previousTab = previousTab;
    if ($scope.previousTab > $scope.currentTab || ($scope.previousTab == $scope.totalTabs && $scope.currentTab == 0) ) {
      // going left
      console.log('Back');
      $scope.tabs[$scope.currentTab].foregroundTransitionState = "bounceInLeft";
      $scope.tabs[$scope.previousTab].foregroundTransitionState = "slideOutRight";
      $scope.tabs[$scope.currentTab].backgroundTransitionState = 'fadeIn';
      $scope.tabs[$scope.previousTab].backgroundTransitionState = 'fadeOut';
    } else if ($scope.previousTab < $scope.currentTab || ($scope.previousTab == 0  && $scope.currentTab == $scope.totalTabs) ) {
      // going right
      console.log('Forward');
      $scope.tabs[$scope.currentTab].foregroundTransitionState = "bounceInRight";
      $scope.tabs[$scope.previousTab].foregroundTransitionState = "slideOutLeft";
      $scope.tabs[$scope.currentTab].backgroundTransitionState = 'fadeIn';
      $scope.tabs[$scope.previousTab].backgroundTransitionState = 'fadeOut';
    }
    console.log('Watched');
  }, true);
  
  $scope.gotoTab = function(tabIndex) {
    $scope.tabs[tabIndex].active = true; 
  };
    
  $scope.nextTab = function() {
    if($scope.currentTab < $scope.totalTabs) {
      $scope.currentTab++;
      $scope.gotoTab($scope.currentTab);
    } else {
      $scope.currentTab=0;
      $scope.gotoTab($scope.currentTab);
    }
  };

  $scope.prevTab = function() {
    if($scope.currentTab !== 0) {
      $scope.currentTab--;
      $scope.gotoTab($scope.currentTab);
    } else {
      $scope.currentTab=$scope.totalTabs;
      $scope.gotoTab($scope.currentTab);
    }
  };
  

  
  
    // //$scope.tabSwitch = function(index) {
      
    //   if (index < $scope.currentTab) {
    //     // going left
    //     $scope.tabs[index].transition = "bounceInLeft";
    //     $scope.tabs[$scope.currentTab].transition = "slideOutRight";
    //   }
    //   else if (index > $scope.currentTab) {
    //     // going right
    //     $scope.tabs[index].transition = "bounceInRight";
    //     $scope.tabs[$scope.currentTab].transition = "slideOutLeft";
    //   }
    //   $scope.currentTab = index;
    // //};
    
    angular.forEach($scope.tabs,function(val,i) {
      if(i!==0) {
        $scope.tabs[i].transition = "hide";
      }
    });
  
  
   
}
})();
