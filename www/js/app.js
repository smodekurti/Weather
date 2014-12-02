var app =angular.module('weatherApp',['angular-skycons','mgcrea.ngStrap','ngAnimate','ui.bootstrap']);

app.run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('splash/index.html',
      '<section class="splash flip" ng-class="{\'splash-open\': animate }" ng-style="{\'z-index\': 1000, display: \'auto\'}" ng-click="close($event)">' +
      '  <div class="splash-inner" ng-transclude></div>' +
      '</section>'
    );
      
   $templateCache.put('splash/content.html',
      '  <div class="splash-content text-center">' +
      '     <div class="container">' +
      '         <div class="row">' +
      '            <div class="col-xs-12 col-sm-12 col-lg-12">' +
      '                 <div><h1 ng-bind="title"></h1></div>' +
      '                 <div style="text-align: center; display:auto;"><img src = "logo.png" class="img-responsive" height="142" width="142"></img></div>' +                
      '                 <br/><div><p class="lead" ng-bind="message"></p></div>' +    
      '                 <div><img src = "powered-by-google-on-non-white2.png"></img></div>' +
      '                 <div><h6>Version - v0.0.1-beta</h6></div>' +
      '             </div>' +
      '         </div>'+
      '     </div>' +
      '   </div>'
    );
  }
]);

app.controller('MainCtrl', ['$splash', '$timeout','$modalStack',function ($splash,$timeout,$modalStack) {
  $timeout(function(){
      //console.log("Timeout Invoked");
      $modalStack. dismissAll();
  }, 5000);
  this.openSplash = function () {
    $splash.open({
      title: 'Quick Weather',
      message: "Weather in a Blink !!!"
    });
    
  };
}]);

app.controller('WeatherController',['$scope','$log','$http','$filter','WeatherService','$timeout', function($scope,$log,$http,$filter,WeatherService,$timeout){
    
    $scope.result1 = '';
    $scope.options1 = null;
    $scope.details1 = '';

    $scope.modd

    $scope.result2 = '';
    $scope.options2 = {
      types: '(cities)',
      getPlaceOnBlur : false
    };    $scope.details2 = '';
    
    
    
    $scope.result3 = '';
    $scope.options3 = {
      country: 'gb',
      types: 'establishment'
    };
    $scope.details3 = '';
    $scope.geoLocation = {status : 'false',
                         latitude: '',
                         longitude: '',
                         citylocation : ''};
   
   
  
  if (navigator.geolocation) {
      $scope.startPinning = true;
      
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.$apply(function(){
                        $scope.position = position; 
                        var geoLocation =           WeatherService.findGeoLocationByLatLong($scope.position.coords.latitude,$scope.position.coords.longitude);
                        //$scope.geoLocation = geoLocation;
                        geoLocation.then(function (geoLocation){
                            $scope.geoLocation = geoLocation; 
                            $scope.zipCode = geoLocation.citylocation;
                            var result = findForecastByLatLong(geoLocation);
                        });
                    });
        },
        function(){
          $scope.$apply(function(){
            $scope.startPinning = false;
            
          });
      });
      
  }
  

    
    
    $scope.getWeather=function(){
        $timeout(function(){
        //$log.warn($scope.zipCode);
        $scope.startPinning = false;
      
        if($scope.geoLocation.status){
            var geoLocation = WeatherService.findGeoLocationByZip($scope.zipCode);
            geoLocation.then(function (geoLocation){
                $scope.geoLocation = geoLocation; 
                $scope.zipCode = geoLocation.citylocation;
                findForecastByLatLong(geoLocation);
            });
        }
        else{
            findForecastByLatLong($scope.geoLocation);
        }
        },500);
            

    }
                 
    
    function findForecastByLatLong(geoLocation){
        if(geoLocation.status){
               var weatherDetails = WeatherService.findWeatherByGeo(geoLocation.latitude,geoLocation.longitude);    
               weatherDetails
                .then(function(WeatherResult){
                    $scope.WeatherResult = WeatherResult;
                    $scope.headline = WeatherResult.CurrentWeatherArray[0].weekSummary;
                });
            }
            else{
                $scope.geoLocation.citylocation = "Incorrect ZipCode";
                $scope.geoLocation.status = true;
                $scope.WeatherResult = {};
                $scope.WeatherResult.status = false;
                
            }
        $scope.startPinning = false; 
        return true;
        
    }
    
                                   
}]);


app.service('$splash',[
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
      }
    };
  }
]);

// ng-directive to put focus on a field
app.directive('focus',function($timeout) {
    return {
        scope : {
            trigger : '@focus'
        },
        link : function(scope, element) {
            scope.$watch('trigger', function(value) {
                if (value === "true") {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
  };    

});


app.directive('handlePhoneSubmit', function () {
    return function (scope, element, attr) {

        var textFields = $(element).children('div').children('input[type=text]');
        

        $(element).submit(function() {
            //console.log('form was submitted');
            textFields.blur();
        });
    };
});

app.directive('ngAutocomplete', function() {
    return {
      require: 'ngModel',
      scope: {
        ngModel: '=',
        options: '=?',
        details: '=?',
        location : '='
      },
      controller : 'WeatherController',

      link: function(scope, element, attrs, controller) {

        //options for autocomplete
        var opts
        var watchEnter = false
        //convert options provided to opts
        var initOpts = function() {

          opts = {}
          if (scope.options) {

            if (scope.options.watchEnter !== true) {
              watchEnter = false
            } else {
              watchEnter = true
            }

            if (scope.options.types) {
              opts.types = []
              opts.types.push(scope.options.types)
              scope.gPlace.setTypes(opts.types)
            } else {
              scope.gPlace.setTypes([])
            }

            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds
              scope.gPlace.setBounds(opts.bounds)
            } else {
              scope.gPlace.setBounds(null)
            }

            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              }
              scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
            } else {
              scope.gPlace.setComponentRestrictions(null)
            }
          }
        }

        if (scope.gPlace == undefined) {
          scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
        }
        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
          var result = scope.gPlace.getPlace();
          if (result !== undefined) {
            if (result.address_components !== undefined) {

              scope.$apply(function() {

                scope.details = result;
                //console.log(scope.geoLocation.status);
                scope.location= {status : true,
                                     latitude : result.geometry.location.k,
                                     longitude : result.geometry.location.B,
                                     citylocation :result.geometry.formatted_address
                                    };
                
                //console.info("NgModel : " + controller.$viewValue);
              
                  
                controller.$setViewValue(element.val());
                   //console.info("NgModel : " + controller.$viewValue);
              });
            }
            else {
              if (watchEnter) {
                getPlace(result)
              }
            }
          }
        })

        //function to get retrieve the autocompletes first result using the AutocompleteService 
        var getPlace = function(result) {
          var autocompleteService = new google.maps.places.AutocompleteService();
          if (result.name.length > 0){
            autocompleteService.getPlacePredictions(
              {
                input: result.name,
                offset: result.name.length
              },
              function listentoresult(list, status) {
                if(list == null || list.length == 0) {

                  scope.$apply(function() {
                    scope.details = null;
                  });

                } else {
                  var placesService = new google.maps.places.PlacesService(element[0]);
                  placesService.getDetails(
                    {'reference': list[0].reference},
                    function detailsresult(detailsResult, placesServiceStatus) {

                      if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
                        scope.$apply(function() {

                          controller.$setViewValue(detailsResult.formatted_address);
                          element.val(detailsResult.formatted_address);

                          scope.details = detailsResult;

                          //on focusout the value reverts, need to set it again.
                          var watchFocusOut = element.on('focusout', function(event) {
                            element.val(detailsResult.formatted_address);
                            element.unbind('focusout')
                          })

                        });
                      }
                    }
                  );
                }
              });
          }
        }

        if (scope.options.getPlaceOnBlur) {
          element.bind('blur', function () {
            getPlace({ name: controller.$viewValue });
          });
        }
        
        controller.$render = function () {
          var location = controller.$viewValue;
          element.val(location);
        };

        //watch options provided to directive
        scope.watchOptions = function () {
          return scope.options
        };
        scope.$watch(scope.watchOptions, function () {
          initOpts()
        }, true);

      }
    };
  });





