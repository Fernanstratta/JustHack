'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Send, CheckCircle } from 'lucide-react'

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

interface EmailSenderProps {
  validatedStudents: Student[]
  justificanteData: JustificanteData
}

export default function EmailSender({ validatedStudents, justificanteData }: EmailSenderProps) {
  const [emailData, setEmailData] = useState({
    recipientEmail: '',
    ccEmails: '',
    subject: `Justificante de Ausencia - ${justificanteData.reason}`,
    additionalMessage: ''
  })
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    // Prepare email content
    const emailContent = {
      ...emailData,
      justificante: justificanteData,
      students: validatedStudents,
      timestamp: new Date().toISOString()
    }

    console.log('[v0] Sending email with data:', emailContent)

    // Call the real email API
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailContent)
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      setEmailSent(true)
      setTimeout(() => {
        setEmailSent(false)
      }, 5000)
    } catch (error) {
      console.error('[v0] Error sending email:', error)
      alert('Error al enviar el correo. Por favor verifica la configuración de email.')
    } finally {
      setIsSending(false)
    }
  }

  const generateEmailPreview = () => {
    const studentList = validatedStudents.map(s => `- ${s.name} (ID: ${s.id})`).join('\n')
    
    // Calculate number of days
    const start = new Date(justificanteData.startDate)
    const end = new Date(justificanteData.endDate)
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const dateRange = daysDiff === 1 
      ? start.toLocaleDateString('es-MX')
      : `${start.toLocaleDateString('es-MX')} - ${end.toLocaleDateString('es-MX')} (${daysDiff} días)`
    
    const hourRange = `${justificanteData.startHour} - ${justificanteData.endHour}`
    
    return `
JUSTIFICANTE DE AUSENCIA - CETYS UNIVERSIDAD
Escuela de Ingeniería

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INFORMACIÓN DEL JUSTIFICANTE:
• Motivo: ${justificanteData.reason}
• Período de Ausencia: ${dateRange}
• Horario de Clase: ${hourRange}
• Descripción: ${justificanteData.description}

ESTUDIANTES AFECTADOS (${validatedStudents.length}):
${studentList}

${emailData.additionalMessage ? `\nMENSAJE ADICIONAL:\n${emailData.additionalMessage}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generado automáticamente por el Sistema de Justificantes
${new Date().toLocaleString('es-MX')}
    `.trim()
  }

  if (validatedStudents.length === 0) {
    return (
      <Card className="border-2 border-muted">
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-muted-foreground" />
            Envío de Justificante
          </CardTitle>
          <CardDescription>
            No hay estudiantes validados para enviar
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            Valida estudiantes primero para habilitar el envío por email
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Envío de Justificante
        </CardTitle>
        <CardDescription>
          Envía el justificante validado por correo electrónico
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {emailSent ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              Correo Enviado Exitosamente
            </h3>
            <p className="text-muted-foreground">
              El justificante ha sido enviado a {emailData.recipientEmail}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendEmail} className="space-y-6">
            {/* Email Recipients */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Destinatario Principal *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="coordinador@cetys.mx"
                  value={emailData.recipientEmail}
                  onChange={(e) => setEmailData({ ...emailData, recipientEmail: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ccEmails">CC (Opcional)</Label>
                <Input
                  id="ccEmails"
                  type="text"
                  placeholder="profesor1@cetys.mx, profesor2@cetys.mx"
                  value={emailData.ccEmails}
                  onChange={(e) => setEmailData({ ...emailData, ccEmails: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Separa múltiples emails con comas</p>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto del Correo *</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                required
              />
            </div>

            {/* Additional Message */}
            <div className="space-y-2">
              <Label htmlFor="additionalMessage">Mensaje Adicional (Opcional)</Label>
              <Textarea
                id="additionalMessage"
                placeholder="Agrega cualquier información adicional que desees incluir en el correo..."
                value={emailData.additionalMessage}
                onChange={(e) => setEmailData({ ...emailData, additionalMessage: e.target.value })}
                rows={3}
              />
            </div>

            {/* Email Preview */}
            <div className="space-y-2">
              <Label>Vista Previa del Correo</Label>
              <div className="bg-muted p-4 rounded-lg border">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {generateEmailPreview()}
                </pre>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="font-semibold mb-2">Resumen del Envío:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {validatedStudents.length} estudiante{validatedStudents.length !== 1 ? 's' : ''} validado{validatedStudents.length !== 1 ? 's' : ''}</li>
                <li>• Motivo: {justificanteData.reason}</li>
                <li>• Período: {new Date(justificanteData.startDate).toLocaleDateString('es-MX')} - {new Date(justificanteData.endDate).toLocaleDateString('es-MX')}</li>
                <li>• Horario de Clase: {justificanteData.startHour} - {justificanteData.endHour}</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isSending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Enviando...' : 'Enviar Correo'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setEmailData({
                  recipientEmail: '',
                  ccEmails: '',
                  subject: `Justificante de Ausencia - ${justificanteData.reason}`,
                  additionalMessage: ''
                })}
              >
                Limpiar Formulario
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
