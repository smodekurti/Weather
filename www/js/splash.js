angular.module('splashDemo', ['ui.splash'])
.controller('MainCtrl', ['$splash', function ($splash) {
  this.openSplash = function () {
    $splash.open({
      title: 'Quick Weather !!!',
      message: "Weather Information at its quickest best !!!    "
    });
  };
}]);


angular.module('ui.splash', ['ui.bootstrap'])
.service('$splash', [
  '$modal',
  '$rootScope',
  function($modal, $rootScope) {
    return {
      open: function (attrs, opts) {
        // Create a new scope so we can pass custom
        // variables into the splash modal
        var scope = $rootScope.$new();
        angular.extend(scope, attrs);
        opts = angular.extend(opts || {}, {
          backdrop: false,
          scope: scope,
          templateUrl: 'splash/content.html',
          windowTemplateUrl: 'splash/index.html'
        });
        return $modal.open(opts);
      },
     close : function(){
         console.log("Modal Close Called");
         $modal.close();
     }
    };
  }
]);

angular.module('ui.splash').run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('splash/index.html',
      '<section class="splash" ng-class="{\'splash-open\': animate}" ng-style="{\'z-index\': 1000, display: \'block\'}" ng-click="close($event)">' +
      '  <div class="splash-inner" ng-transclude></div>' +
      '</section>'
    );
      
    $templateCache.put('splash/content.html',
      '<div class="splash-content text-center">' +
      '  <h1 ng-bind="title"></h1>' +
      '  <p class="lead" ng-bind="message"></p>' +
      '  <button class="btn btn-lg btn-outline" ng-bind="btnText || \'Ok, cool\'" ng-click="$close()"></button>' +
      '  <img src = "../images/powered-by-google-on-non-white2.png"></img>' +
      '</div>'
    );
  }
]);