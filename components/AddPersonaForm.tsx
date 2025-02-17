'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Plus, X } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MedicationDisplay } from './MedicationDisplay'

interface AddPersonaFormProps {
  onClose: () => void
  onAdd: () => void
}

export default function AddPersonaForm({ onClose, onAdd }: AddPersonaFormProps) {
  const [name, setName] = useState('')
  const [medication, setMedication] = useState('')
  const [personaDescription, setPersonaDescription] = useState('')
  const [isVisuallyImpaired, setIsVisuallyImpaired] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [medicationError, setMedicationError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('http://127.0.0.1:5000/api/add_persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          medication, 
          persona_description: personaDescription,
          is_visually_impaired: isVisuallyImpaired
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add persona')
      }

      onAdd()
      onClose()
    } catch (error) {
      setError('Failed to add persona. Please try again.')
      console.error('Error adding persona:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Add New Persona</CardTitle>
          <CardDescription>
            Create a new persona with their details and preferences
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter persona name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medication" className="text-sm font-medium">
              Medication Schedule
            </Label>
            <Textarea
              id="medication"
              value={medication}
              onChange={(e) => {
                setMedication(e.target.value);
                try {
                  JSON.parse(e.target.value);
                  setMedicationError("");
                } catch (e) {
                  setMedicationError("Please enter valid JSON format");
                }
              }}
              placeholder={`Example:
{
  "medication_schedule": {
    "Medication Name": [
      {
        "status": "not taken",
        "time": "08:00 AM"
      }
    ]
  }
}`}
              className="min-h-[200px] font-mono text-sm"
            />
            {medicationError && (
              <p className="text-sm text-red-500">{medicationError}</p>
            )}
            {medication && !medicationError && (
              <div className="mt-4 p-4 bg-slate-50 rounded-md">
                <h4 className="text-sm font-medium mb-2">Preview:</h4>
                <MedicationDisplay medication={medication} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="personaDescription" className="text-sm font-medium">
              Persona Description
            </Label>
            <Textarea
              id="personaDescription"
              value={personaDescription}
              onChange={(e) => setPersonaDescription(e.target.value)}
              required
              placeholder="Enter a detailed description of the persona"
              className="min-h-[150px] resize-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isVisuallyImpaired"
              checked={isVisuallyImpaired}
              onCheckedChange={(checked) => setIsVisuallyImpaired(checked as boolean)}
            />
            <Label
              htmlFor="isVisuallyImpaired"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Person is visually impaired or has color blindness
            </Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
                <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-slate-600 hover:bg-slate-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Adding...' : 'Add Persona'}
          </Button>
        </div>
      </form>
    </div>
  )
}

