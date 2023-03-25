import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { QueryClient, QueryClientProvider } from  'react-query' 
import { ReactQueryDevtools } from 'react-query-devtools'

import './styles.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <AuthProvider>
    {/* <ReactQueryDevtools /> */ }
      <Routes>
        <Route path="/*" element={<App />} />
    </Routes> 
    </AuthProvider>
    </BrowserRouter>
    {/* */}
    </QueryClientProvider>

  //</React.StrictMode>,
)
 