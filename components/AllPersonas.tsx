'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Edit, Check, X, Search, ChevronLeft } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MedicationDisplay } from './MedicationDisplay'

interface Persona {
  id: string
  name: string
  medication: string
  persona_description: string
  is_visually_impaired: boolean
  isDefault: boolean
}

export default function AllPersonas() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPersonasAndDefault()
  }, [])

  const fetchPersonasAndDefault = async () => {
    setIsLoading(true)
    setError('')
    try {
      const [personasResponse, defaultPersonaResponse] = await Promise.all([
        fetch('http://127.0.0.1:5000/api/view_personas'),
        fetch('http://127.0.0.1:5000/api/get_current_persona')
      ])

      if (!personasResponse.ok || !defaultPersonaResponse.ok) {
        throw new Error('Failed to fetch personas or default persona')
      }

      const personasData = await personasResponse.json()
      const defaultPersonaData = await defaultPersonaResponse.json()

      const updatedPersonas = personasData.map((persona: Persona) => ({
        ...persona,
        isDefault: persona.id === defaultPersonaData.id
      }))

      setPersonas(updatedPersonas)
    } catch (error) {
      setError('Failed to load personas. Please try again.')
      console.error('Error fetching personas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/make_persona_default', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ persona_id: id }),
      })
      if (!response.ok) {
        throw new Error('Failed to set default persona')
      }
      setPersonas(personas.map(p => ({
        ...p,
        isDefault: p.id === id
      })))
    } catch (error) {
      setError('Failed to set default persona. Please try again.')
      console.error('Error setting default persona:', error)
    }
  }

  const filteredPersonas = personas.filter(persona =>
    persona.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    persona.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
    persona.persona_description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSave = async (id: string, updatedPersona: Partial<Persona>) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/edit_persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updatedPersona }),
      });
      if (!response.ok) {
        throw new Error('Failed to update persona');
      }
      const updatedData = await response.json();
      setPersonas(personas.map(persona => 
        persona.id === id ? { ...persona, ...updatedData } : persona
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating persona:', error);
      setError('Failed to update persona. Please try again.');
    }
  };



  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">All Personas</h2>
            <p className="text-muted-foreground">
              View and manage all your CoRDial personas
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search personas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersonas.map((persona) => (
              <Card key={persona.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold">
                    {persona.name}
                  </CardTitle>
                  {persona.isDefault && (
                    <Badge className="bg-sky-500 text-white">Default</Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  {editingId === persona.id ? (
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      handleSave(persona.id, {
                        name: formData.get('name') as string,
                        medication: formData.get('medication') as string,
                        persona_description: formData.get('persona_description') as string,
                        is_visually_impaired: formData.get('is_visually_impaired') === 'on',
                      })
                    }} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${persona.id}`}>Name</Label>
                        <Input
                          id={`name-${persona.id}`}
                          name="name"
                          defaultValue={persona.name}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`medication-${persona.id}`}>Medication</Label>
                        <Textarea
                          id={`medication-${persona.id}`}
                          name="medication"
                          defaultValue={persona.medication}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`persona_description-${persona.id}`}>Description</Label>
                        <Textarea
                          id={`persona_description-${persona.id}`}
                          name="persona_description"
                          defaultValue={persona.persona_description}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`is_visually_impaired-${persona.id}`}
                          name="is_visually_impaired"
                          defaultChecked={persona.is_visually_impaired}
                        />
                        <Label htmlFor={`is_visually_impaired-${persona.id}`}>
                          Visually impaired or color blind
                        </Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button type="submit" className="bg-slate-600 hover:bg-slate-700 text-white">
                          <Check className="mr-2 h-4 w-4" /> Save
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Medication</Label>
                          <MedicationDisplay medication={persona.medication} variant="compact" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                          <p className="text-sm">{persona.persona_description}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Visual Impairment</Label>
                          <p className="text-sm">{persona.is_visually_impaired ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        {!persona.isDefault && (
                          <Button
                            onClick={() => handleSetDefault(persona.id)}
                            variant="outline"
                            className="w-full"
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button
                          onClick={() => setEditingId(persona.id)}
                          variant="secondary"
                          className="w-full"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

