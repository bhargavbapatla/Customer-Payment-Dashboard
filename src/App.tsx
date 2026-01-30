import './App.css'
import DataTable from './components/table/page'
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <div className="card space-y-4">
        <DataTable />
      </div>
      <Toaster position="top-right" />
    </>
  )
}

export default App
