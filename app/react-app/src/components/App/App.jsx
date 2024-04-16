import { useState } from 'react'
import './App.css'
import AreaSelector from "../AreaSelector/AreaSelector.jsx";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AreaSelector inputStyle={{height: "400px", width: "400px" }}/>
    </>
  )
}

export default App
