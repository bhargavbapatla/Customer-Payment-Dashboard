import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"
import { useCounterStore } from './store/useCounterStore'
import { useQuery } from '@tanstack/react-query'

function App() {
  const { count, increment, decrement, reset } = useCounterStore()

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then((res) =>
        res.json(),
      ),
  })

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold underline mb-4">Vite + React + Shadcn UI + Zustand + Query</h1>
      <div className="card space-y-4">
        <div className="flex justify-center gap-4 items-center">
           <Button variant="outline" onClick={decrement}>-</Button>
           <span className="text-2xl font-bold">Count: {count}</span>
           <Button variant="outline" onClick={increment}>+</Button>
        </div>
        
        <Button onClick={reset} variant="destructive">
          Reset Count
        </Button>

        <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold mb-2">TanStack Query Example</h2>
          {isPending ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-destructive">Error: {error.message}</p>
          ) : (
            <div>
              <p className="font-medium">{data.full_name}</p>
              <p className="text-sm text-muted-foreground">{data.description}</p>
              <div className="mt-2 flex gap-2 justify-center">
                <span className="text-xs bg-secondary px-2 py-1 rounded">🍴 {data.forks_count}</span>
                <span className="text-xs bg-secondary px-2 py-1 rounded">⭐ {data.stargazers_count}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
