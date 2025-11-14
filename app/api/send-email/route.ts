import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function generateEmailContent(emailData: any): string {
  const { justificanteInfo, selectedStudents } = emailData
  
  let content = `JUSTIFICANTE DE AUSENCIAS - CETYS UNIVERSIDAD\n\n`
  content += `INFORMACIÓN DEL JUSTIFICANTE\n`
  content += `================================\n\n`
  content += `Tipo: ${justificanteInfo.tipo}\n`
  content += `Motivo: ${justificanteInfo.motivo}\n`
  content += `Fecha de inicio: ${justificanteInfo.fechaInicio}\n`
  content += `Fecha de fin: ${justificanteInfo.fechaFin}\n`
  content += `Observaciones: ${justificanteInfo.observaciones || 'N/A'}\n\n`
  
  content += `ESTUDIANTES SELECCIONADOS\n`
  content += `================================\n\n`
  
  selectedStudents.forEach((student: any, index: number) => {
    content += `${index + 1}. ${student.name}\n`
    content += `   ID: ${student.id}\n`
    content += `   Carrera: ${student.carrera}\n`
    if (student.validationStatus) {
      content += `   Estado: ${student.validationStatus}\n`
    }
    content += `\n`
  })
  
  content += `\nEste justificante ha sido generado automáticamente por el sistema de justificantes de CETYS Universidad.\n`
  
  return content
}

export async function POST(request: Request) {
  try {
    const emailData = await request.json()
    
    console.log('[v0] Email API called with data:', emailData)
    
    // Create transporter using SMTP credentials from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS, // Your email password or app password
      },
    })

    // Generate email content
    const emailContent = generateEmailContent(emailData)
    
    // Prepare email options
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: emailData.recipientEmail,
      cc: emailData.ccEmails ? emailData.ccEmails.split(',').map((e: string) => e.trim()) : [],
      subject: emailData.subject,
      text: emailContent,
      html: `<pre style="font-family: monospace; white-space: pre-wrap;">${emailContent}</pre>`,
    }

    // Send email
    await transporter.sendMail(mailOptions)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado exitosamente' 
    })
  } catch (error) {
    console.error('[v0] Error sending email:', error)
    return NextResponse.json(
      { success: false, message: 'Error al enviar el email: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
