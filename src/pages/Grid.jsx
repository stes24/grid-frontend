import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Grid.css"

function Pixel({ coords, color }) {
  return (
    <button className="pixel" style={{ backgroundColor: color }}>{coords}</button>
  )
}

function Grid() {
  const navigate = useNavigate() // Hook di react-router-dom, ritorna funzione che fa navigare nel browser
  const [pixels, setPixels] = useState({})
  const [gridSize, setGridSize] = useState({ numRows: 0, numCols: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5000/pixels")
      .then(response => response.json())
      .then(data => {
        // Crea mappa che usa (r,c) come hash, contiene dati tipo 0,0: {color: "#FFFFFF", "pixel_col": 0, "pixel_row": 0}
        const pixelMap = {}
        data.forEach(p => {
          pixelMap[computeHash(p.pixel_row, p.pixel_col)] = p
        })

        setGridSize({ // Ricava dimensioni della griglia dai valori massimi di riga e colonna nel db
          numRows: data.length > 0 ? Math.max(...data.map(p => p.pixel_row)) + 1 : 0,
          numCols: data.length > 0 ? Math.max(...data.map(p => p.pixel_col)) + 1 : 0
        })
        setPixels(pixelMap)
        setLoading(false)
      })
  }, []) // L'array vuoto evita di farlo ripetere a ogni render

  // Ritorna subito se sta ancora caricando i dati
  if (loading) {
    return <div className="page"><p>Caricamento...</p></div>
  }

  return (
    <div className="page">

      <div className="grid">
        {[...Array(gridSize.numRows).keys()].map(row => (
          <div key={row} className="grid-row">
            {[...Array(gridSize.numCols).keys()].map(col => {
              const coords = computeHash(row, col)
              const color = pixels[coords]?.color
              return <Pixel key={coords} coords={coords} color={color} />
            })}
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/")}>Indietro</button>

    </div>
  )
}

function computeHash(row, col) {
  return `${row},${col}`
}

export default Grid
