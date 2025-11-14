import { NextResponse } from 'next/server'
// import clientPromise from '@/lib/mongodb'

// GET all justificantes
export async function GET() {
  try {
    // TODO: Uncomment when MongoDB is connected
    // const client = await clientPromise
    // const db = client.db('cetys_absence')
    // const justificantes = await db.collection('justificantes').find({}).toArray()
    
    return NextResponse.json({ justificantes: [] })
  } catch (error) {
    console.error('[v0] Error fetching justificantes:', error)
    return NextResponse.json({ error: 'Failed to fetch justificantes' }, { status: 500 })
  }
}

// POST create new justificante
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // TODO: Uncomment when MongoDB is connected
    // const client = await clientPromise
    // const db = client.db('cetys_absence')
    // const result = await db.collection('justificantes').insertOne({
    //   ...body,
    //   createdAt: new Date(),
    // })
    
    console.log('[v0] Creating justificante:', body)
    
    return NextResponse.json({ success: true, message: 'Justificante created' })
  } catch (error) {
    console.error('[v0] Error creating justificante:', error)
    return NextResponse.json({ error: 'Failed to create justificante' }, { status: 500 })
  }
}
