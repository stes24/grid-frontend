import { useEffect } from "react"
import "./Grid.css"

function Grid() {
  useEffect(() => {
    fetch("http://localhost:5000/pixels")
      .then((response) => response.json())
      .then((data) => console.log(data))
  })

  return (
    <div className="grid">
      <h1>Griglia</h1>
      <p>La griglia verrà costruita qui.</p>
    </div>
  )
}

export default Grid
