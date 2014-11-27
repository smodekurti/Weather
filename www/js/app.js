var app =angular.module('weatherApp',['angular-skycons']);

app.controller('WeatherController',['$scope','$log','$http','$filter',function($scope,$log,$http,$filter){
    
   
    
    var d = new Date();
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    
    
    $scope.currentdDay = weekday[d.getDay()];
    
    $scope.zipCode = '60089';
    $scope.latitude = '42.1295221';
    $scope.longitude = '-87.994985';
    $scope.citylocation='';
    $scope.CurrentWeather={};
    $scope.DailyWeather={};
    
    $scope.getWeather=function(){
        
        
        var googleURL = "http://maps.google.com/maps/api/geocode/json?address="+$scope.zipCode;
        
        $http.get(googleURL,{})
            .success(function(result){
                
                if(result.results.length >0){
                    
                    $scope.latitude = result.results[0].geometry.location.lat;
                    $scope.longitude = result.results[0].geometry.location.lng;
                    $scope.citylocation=result.results[0].formatted_address;
                    
                    var forecastURL = "https://api.forecast.io/forecast/88c86c20c4bbc82064e39c376f56a295/"+$scope.latitude+","+$scope.longitude+"?callback=JSON_CALLBACK";
                   $log.info(forecastURL);
                    $http.jsonp(forecastURL,{})
                        .then(function(result1){
                        $log.info(result1);
                        $log.info(result1.data.currently.summary);
                        $scope.CurrentWeather = 
                            {
                                currentTemperature : Math.round(result1.data.currently.temperature),
                                icon : result1.data.currently.icon,
                                iconSize : 30,
                                summary : result1.data.currently.summary,
                                weekSummary : result1.data.daily.summary
                            };
                        var dailyWeatherArray = new Array(7);
                        
                        for(i=0;i<dailyWeatherArray.length;i++){
                            
                            var dayCount = "Day"+i;
                            var day = d.getDay()+i;
                            
                            if(day >= weekday.length){
                                day = day-weekday.length;
                            }
                            var dailyWeather = {"DayName" : weekday[day],
                                                "minTemperature" : Math.round(result1.data.daily.data[i].temperatureMin),
                                                "maxTemperature" : Math.round(result1.data.daily.data[i].temperatureMax),
                                                "icon" : result1.data.daily.data[i].icon,
                                                "iconSize" : 30,
                                                "summary" : result1.data.daily.data[i].summary
                                               };
                       
                            dailyWeatherArray[i] = dailyWeather;   
                            
                             
                        }; 
                        
                        $scope.DailyWeatherArray = dailyWeatherArray;
                    
                    
                    })
                }
                else{
                    $log.error("Incorrect ZipCode");
                }
            })
            .error(function(data, status){
                $log.error(status); 
        });
    }
                                   
}]);