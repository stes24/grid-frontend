import { useNavigate } from "react-router-dom"
import "./Home.css"

function Home() {
  // Hook di react-router-dom, ritorna funzione che fa navigare nel browser
  const navigate = useNavigate()

  return (
    <div className="home">
      <h1>Griglia collaborativa</h1>
      <button onClick={() => navigate("/grid")}>Gioca</button>
    </div>
  )
}

export default Home
