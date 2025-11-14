'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from 'lucide-react'

interface JustificanteFormProps {
  onDataChange?: (data: { 
    reason: string
    startDate: string
    endDate: string
    startHour: string
    endHour: string
    description: string 
  }) => void
}

export default function JustificanteForm({ onDataChange }: JustificanteFormProps) {
  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    endDate: '',
    startHour: '',
    endHour: '',
    description: '',
  })

  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData)
    }
  }, [formData, onDataChange])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin')
      return
    }

    if (formData.startHour && formData.endHour && formData.startHour >= formData.endHour) {
      alert('La hora de inicio debe ser anterior a la hora de fin')
      return
    }
    
    console.log('[v0] Form submitted:', formData)
    alert('Datos del justificante guardados. Continúa con la selección de estudiantes.')
  }

  return (
    <Card className="border-2">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Información del Justificante
        </CardTitle>
        <CardDescription>
          Completa los detalles del justificante de ausencia
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo de la Ausencia</Label>
              <Input
                id="reason"
                placeholder="Ej: Cita médica, evento familiar..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startHour">Hora de Inicio de Clase</Label>
              <Input
                id="startHour"
                type="time"
                value={formData.startHour}
                onChange={(e) => setFormData({ ...formData, startHour: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                min={formData.startDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Para un solo día, selecciona la misma fecha
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="endHour">Hora de Fin de Clase</Label>
              <Input
                id="endHour"
                type="time"
                value={formData.endHour}
                min={formData.startHour}
                onChange={(e) => setFormData({ ...formData, endHour: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Especifica el rango de horas de la clase
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción Detallada</Label>
            <Textarea
              id="description"
              placeholder="Proporciona detalles adicionales sobre el motivo de la ausencia..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Guardar Información
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setFormData({ 
                reason: '', 
                startDate: '', 
                endDate: '', 
                startHour: '', 
                endHour: '', 
                description: '' 
              })}
            >
              Limpiar Formulario
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
