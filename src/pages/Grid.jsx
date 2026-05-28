import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Grid.css"

function Pixel({ coords }) {
  return (
    <button className="pixel">{coords}</button>
  )
}

function Grid() {
  const navigate = useNavigate() // Hook di react-router-dom, ritorna funzione che fa navigare nel browser
  const [pixels, setPixels] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/pixels")
      .then(response => response.json())
      .then(data => setPixels(data))
  }, []) // L'array vuoto evita di farlo ripetere a ogni render

  // Ricava dimensioni della griglia dai valori massimi di riga e colonna nel db
  const numRows = pixels.length > 0 ? Math.max(...pixels.map(p => p.pixel_row)) + 1 : 0
  const numCols = pixels.length > 0 ? Math.max(...pixels.map(p => p.pixel_col)) + 1 : 0

  return (
    <div className="page">

      <div className="grid">
        {[...Array(numRows).keys()].map(row => (
          <div key={row} className="grid-row">
            {[...Array(numCols).keys()].map(col =>
              <Pixel key={`${row},${col}`} coords={`${row},${col}`} />
            )}
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/")}>Indietro</button>

    </div>
  )
}

export default Grid
