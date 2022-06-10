import BarChart from './BarChart'
import Graph from './Graph'
import HeatMap from './HeatMap'
import PieChart from '../piechart/PieChart'

function DisplaySelection({ setter }) {
  return (
    <div>
      <button onClick={() => setter(<Graph />)}>Graph</button>
      <button onClick={() => setter(<PieChart />)}>Pie Chart</button>
      <button onClick={() => setter(<BarChart />)}>Bar Chart</button>
      <button onClick={() => setter(<HeatMap />)}>Heat Map</button>
    </div>
  )
}

export default DisplaySelection
