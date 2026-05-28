import { useNavigate } from "react-router-dom"

function Home() {
  // Hook di react-router-dom, ritorna funzione che fa navigare nel browser
  const navigate = useNavigate()

  return (
    <div className="page">
      <h1>Griglia collaborativa</h1>
      <button onClick={() => navigate("/grid")}>Gioca</button>
    </div>
  )
}

export default Home
