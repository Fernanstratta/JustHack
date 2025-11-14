import { NextResponse } from 'next/server'
// import clientPromise from '@/lib/mongodb'

// GET all students
export async function GET() {
  try {
    // TODO: Uncomment when MongoDB is connected
    // const client = await clientPromise
    // const db = client.db('cetys_absence')
    // const students = await db.collection('students').find({}).toArray()
    
    // Sample data for now
    const students = [
      { id: '001234', name: 'García Martínez, Juan Carlos', career: 'Ing. en Sistemas Computacionales' },
      { id: '001235', name: 'López Hernández, María Fernanda', career: 'Ing. Industrial' },
      { id: '001236', name: 'Rodríguez Pérez, Luis Alberto', career: 'Ing. Mecatrónica' },
    ]
    
    return NextResponse.json({ students })
  } catch (error) {
    console.error('[v0] Error fetching students:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

// POST create new student
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // TODO: Uncomment when MongoDB is connected
    // const client = await clientPromise
    // const db = client.db('cetys_absence')
    // const result = await db.collection('students').insertOne(body)
    
    console.log('[v0] Creating student:', body)
    
    return NextResponse.json({ success: true, message: 'Student created' })
  } catch (error) {
    console.error('[v0] Error creating student:', error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}
