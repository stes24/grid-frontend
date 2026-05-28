import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Grid.css"

const NUM_ROWS = 10

function Pixel({ id }) {
  return (
    <button className="pixel">{id}</button>
  )
}

function Grid() {
  // Hook di react-router-dom, ritorna funzione che fa navigare nel browser
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:5000/pixels")
      .then((response) => response.json())
      .then((data) => console.log(data))
  }, []) // L'array vuoto evita di farlo ripetere a ogni render

  // La chiave dei pixel è i+1 a causa del serial nel db che parte da 1
  return (
    <div className="page">

      <div className="grid">
        {[...Array(NUM_ROWS).keys()].map(row => (
          <div key={row} className="grid-row">
            {[...Array(NUM_ROWS).keys()].map(column => {
              const i = row * NUM_ROWS + column + 1
              return <Pixel key={i} id={i} />
            })}
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/")}>Indietro</button>

    </div>
  )
}

export default Grid
