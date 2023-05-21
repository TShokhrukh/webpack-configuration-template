import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

export const render = (selector: string) => {
  const root = ReactDOM.createRoot(document.querySelector(selector) as HTMLElement)

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
