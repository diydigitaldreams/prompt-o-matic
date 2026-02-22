import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PromptOMatic from './PromptOMatic.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PromptOMatic />
  </StrictMode>
)
