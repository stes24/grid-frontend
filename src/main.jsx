import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"

// createRoot affida la gestione del DOM dentro root a React, poi renderizza il componente
// StrictMode viene ignorato in produzione (npm run build)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
