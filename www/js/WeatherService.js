var app = angular.module('weatherApp');
app.factory('WeatherService',['$http','$q','$log',function($http,$q,$log){
   
    var googleURL = "http://maps.google.com/maps/api/geocode/json?address=";
    var forecastURLBegin = "https://api.forecast.io/forecast/88c86c20c4bbc82064e39c376f56a295/";
    var forecastURLEnd = "?callback=JSON_CALLBACK";
   
    var geoLocation = {};
    WeatherResult = {};
    
    
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    
    return ({
        findGeoLocation : findGeoLocation,
        findWeatherByGeo: findWeatherByGeo
    });
    


function findGeoLocation(zipCode){
    var request = $http.get(googleURL+zipCode,{});
        
    return (request.then(handleGeoSuccess,handleGeoError));
}

    
function findWeatherByGeo(latitude, longitude){
    
    var forecastURL = forecastURLBegin+latitude+","+longitude+forecastURLEnd;
    var request     = $http.jsonp(forecastURL,{});
    return(request.then(handleWeatherCallSuccess, handleWeatherCallError));
}
    
function handleWeatherCallSuccess(response){
    var result1 = response;
    $log.info(result1);
    var d = new Date();
    WeatherResult.Status = true;
    WeatherResult.CurrentDay = weekday[d.getDay()];
    WeatherResult.CurrentWeather = 
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


    } 

    WeatherResult.DailyWeatherArray = dailyWeatherArray;
   
    return WeatherResult;

}

    

function handleWeatherCallError(response){   
    if (
        ! angular.isObject( response.data ) ||
        ! response.data.message
        ) {
            return( $q.reject( "An unknown error occurred." ) );
        }
    WeatherResult.Status = false;
    WeatherResult.CurrentDay = '';
    WeatherResult.CurrentWeather = {};
    WeatherResult.DailyWeatherArray = {};
    
    return( WeatherResult);
}

    
    
function handleGeoError(response){
    if (
        ! angular.isObject( response.data ) ||
        ! response.data.message
        ) {
            return( $q.reject( "An unknown error occurred." ) );
        }
    
      geoLocation.status = false;
      geoLocation.latitude = '';
      geoLocation.longitude = '';
      geoLocation.citylocation='';
    
    return( geoLocation);
}

function handleGeoSuccess(response){
   var result = response.data;

    if(result.results.length >0){
        geoLocation.status = true;
        geoLocation.latitude = result.results[0].geometry.location.lat;
        geoLocation.longitude = result.results[0].geometry.location.lng;
        geoLocation.citylocation=result.results[0].formatted_address;
    }
    else{
      geoLocation.status = false;
      geoLocation.latitude = '';
      geoLocation.longitude = '';
      geoLocation.citylocation='';   
        
    }

        
        return geoLocation;
}
    
    
}]);