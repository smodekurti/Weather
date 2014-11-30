var app =angular.module('weatherApp',['angular-skycons','mgcrea.ngStrap','ngAnimate']);



app.controller('WeatherController',['$scope','$log','$http','$filter','WeatherService','$timeout', function($scope,$log,$http,$filter,WeatherService,$timeout){
    
  if (navigator.geolocation) {
      $scope.startPinning = true;
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.$apply(function(){
                        $scope.position = position; 
                        var geoLocation = WeatherService.findGeoLocationByLatLong($scope.position.coords.latitude,$scope.position.coords.longitude);
                        //$scope.geoLocation = geoLocation;
                        geoLocation.then(function (geoLocation){
                            $scope.geoLocation = geoLocation; 
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
        $scope.startPinning = false;
        var geoLocation = WeatherService.findGeoLocationByZip($scope.zipCode);
        //$scope.geoLocation = geoLocation;
            
         geoLocation.then(function (geoLocation){
            $scope.geoLocation = geoLocation; 
            findForecastByLatLong(geoLocation);
         });
            
    }
    
    function findForecastByLatLong(geoLocation){
        if(geoLocation.status){
               var weatherDetails = WeatherService.findWeatherByGeo(geoLocation.latitude,geoLocation.longitude);    
               weatherDetails
                .then(function(WeatherResult){
                    $scope.WeatherResult = WeatherResult;
                    $scope.headline = WeatherResult.CurrentWeather.weekSummary;
                });
            }
            else{
                $log.error("Incorrect ZipCode");
                $scope.geoLocation.citylocation = "Incorrect ZipCode";
                $scope.geoLocation.status = true;
                $scope.WeatherResult = {};
                $scope.WeatherResult.status = false;
                
            }
        $scope.startPinning = false; 
        return true;
        
    }
    
                                   
}]);


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
        console.log(textFields);

        $(element).submit(function() {
            console.log('form was submitted');
            textFields.blur();
        });
    };
});
