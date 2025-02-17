'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, AlertCircle, Plus, Users, ChevronRight, MessageSquare, FileText, HousePlus, PlayCircle } from 'lucide-react'
import AddPersonaForm from './AddPersonaForm'
import { MedicationDisplay } from './MedicationDisplay'

interface Persona {
  id: string
  name: string
  medication: string
  persona_description: string
  is_visually_impaired: boolean
}

export default function DashboardContent() {
  const [showAddPersona, setShowAddPersona] = useState(false)
  const [defaultPersona, setDefaultPersona] = useState<Persona | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDefaultPersona()
  }, [])

  const fetchDefaultPersona = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('http://127.0.0.1:5000/api/get_current_persona')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (!data || Object.keys(data).length === 0) {
        throw new Error('No default persona found')
      }
      setDefaultPersona(data)
    } catch (error) {
      console.error('Error fetching default persona:', error)
      setError(`Failed to load default persona: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPersona = () => {
    fetchDefaultPersona()
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">CoRDial CMS Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your personas
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => setShowAddPersona(true)}
              className="bg-slate-600 hover:bg-slate-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Persona
            </Button>
            <Link href="/chat">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" /> Chat Interface
              </Button>
            </Link>
            <Link href="/personas">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" /> View All Personas
              </Button>
            </Link>
            <Link href="/create-scenario">
              <Button variant="outline">
                <HousePlus className="mr-2 h-4 w-4" /> Create a Scenario
              </Button>
            </Link>
            <Link href="/simulator">
              <Button variant="outline">
                <PlayCircle className="mr-2 h-4 w-4" /> Simulator
              </Button>
            </Link>
          </div>
        </div>
        <Separator />

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-6">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading default persona...</span>
            </CardContent>
          </Card>
        ) : error ? (
          <Alert variant="destructive" className="border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button 
              onClick={fetchDefaultPersona} 
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Retry
            </Button>
          </Alert>
        ) : defaultPersona ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-semibold">Default Persona</CardTitle>
                <CardDescription>Currently active persona configuration</CardDescription>
              </div>
              <Badge className="font-semibold bg-sky-500 text-white">
                Active
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{defaultPersona.name}</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Medication Schedule</label>
                      <MedicationDisplay medication={defaultPersona.medication} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-sm">{defaultPersona.persona_description}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Visual Impairment</label>
                      <p className="text-sm">{defaultPersona.is_visually_impaired ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link href="/personas">
                    <Button variant="ghost" size="sm">
                      View All Personas <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-600">
              No default persona set. Please add a persona or set an existing one as default.
            </AlertDescription>
          </Alert>
        )}

        {showAddPersona && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <AddPersonaForm 
                onClose={() => setShowAddPersona(false)} 
                onAdd={handleAddPersona}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
