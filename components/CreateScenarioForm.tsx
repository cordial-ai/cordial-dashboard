"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { AlertCircle, ChevronLeft, Plus, X, House } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const roomTypes = [
  { value: "kitchen", label: "Kitchen" },
  { value: "living-room", label: "Living Room" },
  { value: "bathroom", label: "Bathroom" },
  { value: "bedroom", label: "Bedroom" },
]

const riskOptions = [
  {
    label: "Environmental Risks",
    options: [
      { value: "temperature-discomfort", label: "Risk of temperature discomfort or health issues" },
      { value: "inadequate-lighting", label: "Risk of inadequate lighting impacting safety and well-being" },
      { value: "power-outage", label: "Risk of being unprepared during a power outage" },
    ],
  },
  {
    label: "Electrical Safety Risks",
    options: [
      { value: "fire-overheating", label: "Risk of fire or overheating" },
      { value: "essential-devices-unusable", label: "Risk of essential devices being unusable in emergencies" },
    ],
  },
  {
    label: "Security Risks",
    options: [
      { value: "unauthorized-access", label: "Risk of unauthorized access or security breach" },
      { value: "break-ins", label: "Risk of break-ins or vulnerability" },
    ],
  },
]

export default function CreateScenarioForm() {
  const router = useRouter()
  const [scenarioName, setScenarioName] = useState("")
  const [roomType, setRoomType] = useState("")
  const [selectedRisks, setSelectedRisks] = useState<string[]>([])
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!scenarioName || !roomType || selectedRisks.length === 0) {
      setError("Please fill in all fields")
      return
    }

    // Here you would typically send the data to your backend
    console.log({ scenarioName, roomType, selectedRisks })

    // Navigate back to the dashboard after submission
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Create a Scenario</h2>
            <p className="text-slate-500">Set up a new scenario for risk assessment</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Scenario Details</CardTitle>
              <CardDescription>Enter the details for the new scenario</CardDescription>
            </div>
            <Button variant="outline" onClick={() => router.push("/scenarios")}>
            <House className="mr-2 h-4 w-4" />
              View Scenarios
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="scenarioName">Scenario Name</Label>
                <Input
                  id="scenarioName"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="Enter scenario name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="risks">Risks</Label>
                <MultiSelect
                  options={riskOptions}
                  selected={selectedRisks}
                  onChange={setSelectedRisks}
                  placeholder="Select risks"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Create Scenario</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

