'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react'

interface Student {
  id: string
  name: string
  career: string
}

interface JustificanteData {
  reason: string
  startDate: string
  endDate: string
  startHour: string
  endHour: string
  description: string
}

interface ValidationComponentProps {
  selectedStudents: Student[]
  justificanteData: JustificanteData
  onValidationComplete: (validatedStudents: Student[]) => void
}

interface ValidationResult {
  studentId: string
  isValid: boolean
  reason: string
}

export default function ValidationComponent({ 
  selectedStudents, 
  justificanteData,
  onValidationComplete 
}: ValidationComponentProps) {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)

  const validateStudents = async () => {
    setIsValidating(true)
    
    // Simulate validation logic - This would connect to MongoDB to check:
    // - Student attendance record
    // - Previous justifications count
    // - Academic standing
    // - Date conflicts
    // - Class hour conflicts
    const results: ValidationResult[] = selectedStudents.map((student) => {
      const hasExcessiveAbsences = Math.random() > 0.8 // 20% chance
      const hasPendingJustification = Math.random() > 0.9 // 10% chance
      const isStartDateValid = new Date(justificanteData.startDate) <= new Date()
      const isEndDateValid = new Date(justificanteData.endDate) <= new Date()
      const isDateRangeValid = justificanteData.startDate <= justificanteData.endDate
      const isHourRangeValid = justificanteData.startHour < justificanteData.endHour
      
      let isValid = true
      let reason = 'Estudiante elegible para justificante'
      
      if (hasExcessiveAbsences) {
        isValid = false
        reason = 'Exceso de ausencias previas'
      } else if (hasPendingJustification) {
        isValid = false
        reason = 'Justificante pendiente de resolver'
      } else if (!isStartDateValid || !isEndDateValid) {
        isValid = false
        reason = 'Fecha de ausencia inválida (futura)'
      } else if (!isDateRangeValid) {
        isValid = false
        reason = 'Rango de fechas inválido'
      } else if (!isHourRangeValid) {
        isValid = false
        reason = 'Rango de horas inválido'
      }
      
      return {
        studentId: student.id,
        isValid,
        reason
      }
    })
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setValidationResults(results)
    setIsValidating(false)
    
    // Pass only valid students to parent
    const validStudents = selectedStudents.filter(
      student => results.find(r => r.studentId === student.id)?.isValid
    )
    onValidationComplete(validStudents)
  }

  const validCount = validationResults.filter(r => r.isValid).length
  const invalidCount = validationResults.filter(r => !r.isValid).length

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Validación de Candidatos
        </CardTitle>
        <CardDescription>
          Verifica que los estudiantes seleccionados sean elegibles para justificante
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {validationResults.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {selectedStudents.length} estudiante{selectedStudents.length !== 1 ? 's' : ''} listo{selectedStudents.length !== 1 ? 's' : ''} para validar
            </p>
            <Button 
              onClick={validateStudents}
              disabled={selectedStudents.length === 0 || !justificanteData.reason}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isValidating ? 'Validando...' : 'Validar Estudiantes'}
            </Button>
            {selectedStudents.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Selecciona estudiantes para continuar
              </p>
            )}
            {!justificanteData.reason && selectedStudents.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Completa la información del justificante primero
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{validCount}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Aprobados</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{invalidCount}</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Rechazados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-3">
              {selectedStudents.map((student) => {
                const result = validationResults.find(r => r.studentId === student.id)
                if (!result) return null

                return (
                  <div
                    key={student.id}
                    className={`p-4 rounded-lg border-2 flex items-center justify-between ${
                      result.isValid
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                      </div>
                    </div>
                    <Badge variant={result.isValid ? 'default' : 'destructive'}>
                      {result.reason}
                    </Badge>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex gap-4">
              <Button 
                onClick={validateStudents}
                variant="outline"
              >
                Volver a Validar
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
