// import { useState } from 'react'
import { PieChart } from './components/index'

function App() {
  // const [display, setDisplay] = useState()

  return (
    <div id='page'>
      <h1>Data Grapher</h1>
      <PieChart />
      {/* <DisplaySelection setter={setDisplay} /> */}
      {/* {display} */}
    </div>
  )
}

export default App
