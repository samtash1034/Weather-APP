// ./src/WeatherSetting.js

import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

const locations = [
  '嘉義縣',
  '新北市',
  '嘉義市',
  '新竹縣',
  '新竹市',
  '臺北市',
  '臺南市',
  '宜蘭縣',
  '苗栗縣',
  '雲林縣',
  '花蓮縣',
  '臺中市',
  '臺東縣',
  '桃園市',
  '南投縣',
  '高雄市',
  '金門縣',
  '屏東縣',
  '基隆市',
  '澎湖縣',
  '彰化縣',
  '連江縣',
];

const WeatherSetting = ({ setCurrentPage }) => {
  // ===================== UnControlled Components ========================
  const inputLocationRef = useRef(null);

  //===================== Controlled Components ========================
  const [locationName, setLocationName] = useState('臺北市');

  const handleChange = (e) => {
    console.log(e.target.value);

    setLocationName(e.target.value);
  };

  const handleSave = () => {
    const locationName = inputLocationRef.current.value;
    console.log(locationName);

    if (locations.includes(locationName)) {
      console.log(`儲存的地區資訊為：${locationName}`);

      setCurrentPage('WeatherCard');
    } else {
      alert(`儲存失敗，您輸入的${locationName} 並非有效的地區`);
      return;
    }
  };

  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlFor='location'>地區</StyledLabel>
      <StyledInputList
        ref={inputLocationRef}
        // 在 uncontrolled components 中可以使用 defaultValue 定義預設值
        defaultValue='臺南市'
        list='location-list'
        id='location'
        name='location'
        onChange={handleChange}
        value={locationName}
      />
      <datalist id='location-list'>
        {/* 利用迴圈的方式跑出所有 option */}
        {locations.map((location) => (
          <option value={location} key={location} />
        ))}
      </datalist>

      <ButtonGroup>
        {/* 如何從子層組件去修改父層組件的資料狀態 */}
        <Back onClick={() => setCurrentPage('WeatherCard')}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
