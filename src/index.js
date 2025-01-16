import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 스타일 파일 (없으면 삭제 가능)
import App from './App'; // App.js 연결

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
