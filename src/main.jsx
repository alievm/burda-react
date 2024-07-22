import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './style.scss'
import './DarkMode.css'
import {BrowserRouter} from "react-router-dom";
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
          <ConfigProvider
              theme={{
                  token: {

                  },
                  components: {
                      Form: {
                      },
                      Segmented: {
                          /* here is your component tokens */
                      },
                  },
              }}
              locale={ruRU}>
              <App />
          </ConfigProvider>
      </BrowserRouter>
  </React.StrictMode>,
)
