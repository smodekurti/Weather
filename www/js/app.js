var app =angular.module('weatherApp',['angular-skycons','mgcrea.ngStrap','ngAnimate']);

app.controller('WeatherController',['$scope','$log','$http','$filter','WeatherService',function($scope,$log,$http,$filter,WeatherService){
    
  
    
    $scope.getWeather=function(){
        
        var geoLocation = WeatherService.findGeoLocation($scope.zipCode);
        $scope.geoLocation = geoLocation;
            
         geoLocation.then(function (geoLocation){
            $scope.geoLocation = geoLocation 
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
                $sscope.WeatherResult.status = false;
                
            }
         });
            
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

        var textFields = $(element).children('input[type=text]');
        console.log(textFields);

        $(element).submit(function() {
            console.log('form was submitted');
            textFields.blur();
        });
    };
});
