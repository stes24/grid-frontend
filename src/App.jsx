import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Grid from "./pages/Grid"

// Normalmente ritorna solo il div di classe app, ma ora gestisce le route
function App() {
  return (
    // BrowserRouter ascolta i cambiamenti dell'URL e decide quale route renderizzare
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grid" element={<Grid />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
