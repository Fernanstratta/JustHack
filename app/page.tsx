'use client'

import { useState } from 'react'
import JustificanteForm from '@/components/justificante-form'
import StudentsTable from '@/components/students-table'
import ValidationComponent from '@/components/validation-component'
import EmailSender from '@/components/email-sender'

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

export default function HomePage() {
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
  const [validatedStudents, setValidatedStudents] = useState<Student[]>([])
  const [justificanteData, setJustificanteData] = useState<JustificanteData>({
    reason: '',
    startDate: '',
    endDate: '',
    startHour: '',
    endHour: '',
    description: ''
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-foreground">
                CETYS Universidad
              </h1>
              <p className="text-sm text-muted-foreground">
                Escuela de Ingeniería - Sistema de Justificantes
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Form Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-balance">
                Crear Justificante de Ausencia
              </h2>
              <p className="text-muted-foreground mt-2">
                Completa la información y selecciona los estudiantes para generar el justificante
              </p>
            </div>
            <JustificanteForm 
              onDataChange={setJustificanteData}
            />
          </section>

          {/* Students Table Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Estudiantes de Ingeniería</h2>
              <p className="text-muted-foreground mt-2">
                Selecciona los estudiantes que requieren justificante
              </p>
            </div>
            <StudentsTable 
              onSelectionChange={setSelectedStudents}
            />
          </section>

          {/* Validation Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Validación de Estudiantes</h2>
              <p className="text-muted-foreground mt-2">
                Verifica la elegibilidad de los estudiantes seleccionados
              </p>
            </div>
            <ValidationComponent
              selectedStudents={selectedStudents}
              justificanteData={justificanteData}
              onValidationComplete={setValidatedStudents}
            />
          </section>

          {/* Email Sender Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Enviar Justificante</h2>
              <p className="text-muted-foreground mt-2">
                Envía el justificante validado por correo electrónico
              </p>
            </div>
            <EmailSender
              validatedStudents={validatedStudents}
              justificanteData={justificanteData}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 CETYS Universidad - Sistema de Justificantes
          </p>
        </div>
      </footer>
    </div>
  )
}
