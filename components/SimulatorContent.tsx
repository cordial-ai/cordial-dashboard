"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"

const scenarios = [
  { value: "scenario-01", label: "Scenario 01" },
  { value: "scenario-02", label: "Scenario 02" },
  { value: "scenario-03", label: "Scenario 03" },
]

export default function SimulatorContent() {
  const router = useRouter()
  const [selectedScenario, setSelectedScenario] = useState("")
  const [showSimulator, setShowSimulator] = useState(false)

  const handleRunSimulator = () => {
    if (selectedScenario) {
      setShowSimulator(true)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Simulator</h2>
            <p className="text-slate-500">Run simulations for different scenarios</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Run Simulation</CardTitle>
            <CardDescription>Select a scenario and run the simulator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-[200px]">
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.value} value={scenario.value}>
                        {scenario.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleRunSimulator} disabled={!selectedScenario}>
                Run the Simulator
              </Button>
            </div>
          </CardContent>
        </Card>

        {showSimulator && (
          <div className="mt-8 h-[calc(100vh-300px)] w-full">
            <iframe
              src="http://localhost:8000"
              className="w-full h-full border-0 rounded-lg shadow-lg"
              title="Simulator"
            />
          </div>
        )}
      </div>
    </div>
  )
}

