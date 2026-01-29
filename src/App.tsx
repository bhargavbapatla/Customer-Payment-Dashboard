import './App.css'
import DataTable from './components/table/page'

function App() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline mb-4">Payments Dashboard</h1>
      </div>
      <div className="card space-y-4">
        <DataTable />
      </div>
    </>
  )
}

export default App
