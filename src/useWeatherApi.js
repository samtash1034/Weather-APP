import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = () => {
  return fetch(
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-507B37E0-0383-4D8C-878D-628B54EC3536&StationName=新北"
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.Station[0];

      const weatherElements = {
        WindSpeed: locationData.WeatherElement.WindSpeed,
        AirTemperature: locationData.WeatherElement.AirTemperature,
        RelativeHumidity: locationData.WeatherElement.RelativeHumidity,
      };
      return {
        observationTime: locationData.ObsTime.DateTime,
        locationName: locationData.StationName,
        temperature: weatherElements.AirTemperature,
        windSpeed: weatherElements.WindSpeed,
        humid: weatherElements.RelativeHumidity,
      };
    });
};

const fetchWeatherForecast = () => {
  return fetch(
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-507B37E0-0383-4D8C-878D-628B54EC3536&locationName=臺北市"
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};

//===================================================

const useWeatherApi = (currentLocation) => {
  // console.log(currentLocation);

  const { locationName, cityName } = currentLocation;

  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true,
  });

  // useCallback 的用法是將一個函式包覆並將該函式記憶起來，最後回傳記憶的函式
  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      // 使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForecast(cityName),
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false,
      });
    };

    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    fetchingData();
    // 因為 fetchingData 沒有相依到 React 組件中的資料狀態，
    // 所以 dependencies 陣列中不帶入元素
  }, [locationName, cityName]); // dependincies 改變才會產生新的 fetchData

  useEffect(() => {
    console.log("execute function in useEffect");
    fetchData();
  }, [fetchData]); //如果沒有寫 useCallback 會造成無限迴圈
  // (因為 fetchData function 是一個物件，物件指到的記憶體都不相同)

  return [weatherElement, fetchData];
};

export default useWeatherApi;
