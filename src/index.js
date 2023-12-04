import React from 'react';
import ReactDOM from 'react-dom/client'; // 匯入新的 ReactDOM 客戶端模組
import WeatherApp from './WeatherApp';
import './styles.css';

function App() {
  return <WeatherApp />;
}

// 使用 React 18 的 createRoot API
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
