import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {ConfigProvider, ThemeConfig} from "antd";
import './index.scss'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#2a2a2a',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    colorBgBase: '#3f3f3f',
    colorTextBase: '#ffffff',
    colorBorder: '#e8e8e8',
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
