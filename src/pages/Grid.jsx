import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import "./Grid.css"

// Il client si connette all'URL base del server
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL

function Pixel({ coords, color, onPixelClick }) {
  return (
    <button className="pixel" style={{ backgroundColor: color }} onClick={onPixelClick}>
      {coords}
    </button>
  )
}

function Grid() {
  const navigate = useNavigate() // Hook di react-router-dom, ritorna funzione che fa navigare nel browser
  const socketRef = useRef(null) // Persistente tra render e se cambia non attiva un rerender
  const [pixels, setPixels] = useState({})
  const [gridSize, setGridSize] = useState({ numRows: 0, numCols: 0 })
  const [loading, setLoading] = useState(true)

  // Endpoint per le chiamate API
  const BACKEND_URL = `${BACKEND_BASE_URL}/pixels`

  // Connessione WebSocket
  useEffect(() => {
    const socket = io(BACKEND_BASE_URL)
    socketRef.current = socket

    socket.on("connect", () => {
      console.debug(`ID ${socket.id} - Connesso al server`)
    })
    socket.on("message", (msg) => {
      console.debug("Messaggio dal server:", msg)
    })
    socket.on("disconnect", () => {
      console.debug("WebSocket disconnesso")
    })
    socket.on("update_pixel", (data) => {
      setPixels(prev => ({
        ...prev,                                        // Copia i pixel già esistenti
        [computeHash(data.pixel_row, data.pixel_col)]: data // Sovrascrivi il pixel cliccato
      }))
      console.debug("Pixel aggiornato:", data)
    })

    return () => { // Disconnessione
      console.debug("Disconnessione...")
      socket.disconnect()
    }
  }, [])

  // Caricamento iniziale dei pixel
  useEffect(() => {
    console.debug("Caricamento dati...")
    fetch(BACKEND_URL)
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
        console.debug("Stati inizializzati")
      })
  }, []) // L'array vuoto evita di farlo ripetere a ogni render

  // Ritorna subito se sta ancora caricando i dati
  if (loading) {
    return <div className="page"><p>Caricamento...</p></div>
  }

  // Esempio di aggiornamento con PUT
  /* function handleClick(row, col) {
    console.debug("Cliccato pixel", row, col)
    fetch(`${BACKEND_URL}/${row},${col}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color: "red" })
    })
      .then(response => response.json())
      .then(data => {
        // Invece di sostituire direttamente lo stato con un oggetto, usi una arrow function
        // per prendere lo stato attuale e farci delle operazioni sopra
        setPixels(prev => ({
          ...prev,                      // Copia i pixel già esistenti
          [computeHash(row, col)]: data // Sovrascrivi il pixel cliccato
        }))
        console.debug("Aggiornato pixel:", data)
      })
  } */

  function handleClick(row, col) {
    console.debug("Cliccato pixel", row, col)
    const socket = socketRef.current
    if (!socket) return

    socket.emit("update_pixel", { "pixel_row": row, "pixel_col": col, "color": "blue" })
  }

  return (
    <div className="page">

      <div className="grid">
        {[...Array(gridSize.numRows).keys()].map(row => (
          <div key={row} className="grid-row">
            {[...Array(gridSize.numCols).keys()].map(col => {
              const coords = computeHash(row, col)
              const color = pixels[coords]?.color
              return <Pixel key={coords} coords={coords} color={color} onPixelClick={() => handleClick(row, col)} />
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
