import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RedoIcon } from "./images/redo.svg";
import WeatherIcon from "./WeatherIcon";
import sunriseAndSunsetData from "./sunrise-sunset.json";

const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Redo = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const getMoment = (locationName) => {
  // 新北 => 新北市
  locationName = locationName + "市";

  // STEP 2：從日出日落時間中找出符合的地區
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  // STEP 3：找不到的話則回傳 null
  if (!location) return null;

  // STEP 4：取得當前時間
  const now = new Date();
  now.setFullYear(2019);
  // STEP 5：將當前時間以 "2019-10-08" 的時間格式呈現
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .replace(/\//g, "-");

  // STEP 6：從該地區中找到對應的日期
  const locationDate =
    location.time && location.time.find((time) => time.dataTime === nowDate);

  // STEP 7：將日出日落以及當前時間轉成時間戳記（TimeStamp）
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  // STEP 8：若當前時間介於日出和日落中間，則表示為白天，否則為晚上
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? "day"
    : "night";
};

const WeatherApp = () => {
  console.log("--- invoke function component ---");
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
  });

  // useCallback 的用法是將一個函式包覆並將該函式記憶起來，最後回傳記憶的函式
  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      // 使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(),
        fetchWeatherForecast(),
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
      });
    };
    fetchingData();
    // 因為 fetchingData 沒有相依到 React 組件中的資料狀態，
    // 所以 dependencies 陣列中不帶入元素
  }, []); // dependincies 改變才會產生新的 fetchData

  useEffect(() => {
    console.log("execute function in useEffect");
    fetchData();
  }, [fetchData]); //如果沒有寫 useCallback 會造成無限迴圈
  // (因為 fetchData function 是一個物件，物件指到的記憶體都不相同)

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

  // STEP 3：透過 useMemo 避免每次都須重新計算取值，記得帶入 dependencies
  const moment = useMemo(
    () => getMoment(weatherElement.locationName),
    [weatherElement.locationName]
  );

  return (
    <Container>
      {console.log("render")}
      <WeatherCard>
        <Location>{weatherElement.locationName}</Location>
        <Description>
          {weatherElement.description} {weatherElement.comfortability}
        </Description>
        <CurrentWeather>
          <Temperature>
            {Math.round(weatherElement.temperature)} <Celsius>°C</Celsius>
          </Temperature>
          <WeatherIcon
            currentWeatherCode={weatherElement.weatherCode}
            moment={moment || "day"}
          />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon />
          {weatherElement.windSpeed} m/h
        </AirFlow>
        <Rain>
          <RainIcon />
          {Math.round(weatherElement.rainPossibility)} %
        </Rain>

        <Redo onClick={fetchData}>
          最後觀測時間：
          {new Intl.DateTimeFormat("zh-TW", {
            hour: "numeric",
            minute: "numeric",
          }).format(new Date(weatherElement.observationTime))}{" "}
          <RedoIcon />
        </Redo>
      </WeatherCard>
    </Container>
  );
};

export default WeatherApp;
