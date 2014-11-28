var app =angular.module('weatherApp',['angular-skycons','mgcrea.ngStrap']);

app.controller('WeatherController',['$scope','$log','$http','$filter','WeatherService',function($scope,$log,$http,$filter,WeatherService){
    

    $scope.zipCode = '';
    $scope.WeatherResult={};
    $scope.geoLocation = {};
    
    $scope.getWeather=function(){
        
        
        $scope.WeatherResult={};
        $scope.geoLocation = {};      
       
        var geoLocation = WeatherService.findGeoLocation($scope.zipCode);
        
            
         geoLocation.then(function (geoLocation){
            $scope.geoLocation = geoLocation 
            if(geoLocation.status === "Success"){
               var weatherDetails = WeatherService.findWeatherByGeo(geoLocation.latitude,geoLocation.longitude);    
               weatherDetails
                .then(function(WeatherResult){
                    $scope.WeatherResult = WeatherResult;
                });
            }
            else{
                $log.error("Incorrect ZipCode");
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
