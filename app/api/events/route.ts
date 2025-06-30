import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const expectedApiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey !== expectedApiKey) {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' }
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      const events = [];
      const errors = [];

      for (let i = 0; i < body.length; i++) {
        const eventData = body[i];
        
        if (!eventData.title || !eventData.start_time) {
          errors.push({
            index: i,
            error: 'Title and start_time are required',
            data: eventData
          });
          continue;
        }

        try {
          const startDateTime = new Date(eventData.start_time);
          const endDateTime = eventData.end_time ? new Date(eventData.end_time) : null;
          
          const event = await prisma.event.create({
            data: {
              title: eventData.title,
              startTime: startDateTime.toTimeString().slice(0, 5),
              endTime: endDateTime ? endDateTime.toTimeString().slice(0, 5) : null,
              location: eventData.location || null,
              description: eventData.description || null,
              color: eventData.color || '#3b82f6',
              startDate: startDateTime.toISOString().slice(0, 10),
              endDate: endDateTime ? endDateTime.toISOString().slice(0, 10) : null
            }
          });
          
          events.push(event);
        } catch (eventError) {
          errors.push({
            index: i,
            error: 'Failed to create event',
            details: eventError instanceof Error ? eventError.message : 'Unknown error',
            data: eventData
          });
        }
      }

      return NextResponse.json({
        success: events.length,
        failed: errors.length,
        events,
        errors
      }, { status: 201 });
    } else {
      const { title, startTime, endTime, location, description, color, startDate, endDate } = body;

      if (!title || !startDate) {
        return NextResponse.json(
          { error: 'Title and start date are required' },
          { status: 400 }
        );
      }

      const event = await prisma.event.create({
        data: {
          title,
          startTime: startTime || null,
          endTime: endTime || null,
          location: location || null,
          description: description || null,
          color: color || '#3b82f6',
          startDate,
          endDate: endDate || null
        }
      });

      return NextResponse.json(event, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating event(s):', error);
    return NextResponse.json(
      { error: 'Failed to create event(s)' },
      { status: 500 }
    );
  }
}