'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search } from 'lucide-react'

// Sample data - This will be replaced with MongoDB data
const SAMPLE_STUDENTS = [
  { id: '001234', name: 'García Martínez, Juan Carlos', career: 'Ing. en Sistemas Computacionales' },
  { id: '001235', name: 'López Hernández, María Fernanda', career: 'Ing. Industrial' },
  { id: '001236', name: 'Rodríguez Pérez, Luis Alberto', career: 'Ing. Mecatrónica' },
  { id: '001237', name: 'Sánchez González, Ana Patricia', career: 'Ing. en Sistemas Computacionales' },
  { id: '001238', name: 'Torres Ramírez, Carlos Eduardo', career: 'Ing. Civil' },
  { id: '001239', name: 'Flores Morales, Diana Laura', career: 'Ing. Industrial' },
  { id: '001240', name: 'Mendoza Silva, Roberto José', career: 'Ing. Mecatrónica' },
  { id: '001241', name: 'Castro Ruiz, Sofía Alejandra', career: 'Ing. en Sistemas Computacionales' },
]

interface StudentsTableProps {
  onSelectionChange?: (students: typeof SAMPLE_STUDENTS) => void
}

export default function StudentsTable({ onSelectionChange }: StudentsTableProps) {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = SAMPLE_STUDENTS.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.includes(searchTerm)
  )

  useEffect(() => {
    if (onSelectionChange) {
      const selected = SAMPLE_STUDENTS.filter(s => selectedStudents.has(s.id))
      onSelectionChange(selected)
    }
  }, [selectedStudents, onSelectionChange])

  const toggleStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedStudents(newSelected)
  }

  const selectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)))
    }
  }

  return (
    <Card className="border-2">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Selección de Estudiantes
        </CardTitle>
        <CardDescription>
          {selectedStudents.size} estudiante{selectedStudents.size !== 1 ? 's' : ''} seleccionado{selectedStudents.size !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Search Bar */}
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={selectAll}
            className="whitespace-nowrap"
          >
            {selectedStudents.size === filteredStudents.length ? 'Deseleccionar' : 'Seleccionar'} Todos
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-sm">
                    <Checkbox
                      checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                      onCheckedChange={selectAll}
                      aria-label="Seleccionar todos"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Carrera</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No se encontraron estudiantes
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr 
                      key={student.id}
                      className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                        selectedStudents.has(student.id) ? 'bg-accent/10' : ''
                      }`}
                      onClick={() => toggleStudent(student.id)}
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedStudents.has(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                          aria-label={`Seleccionar ${student.name}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-sm">{student.id}</td>
                      <td className="px-4 py-3 font-medium">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{student.career}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
