import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const expectedApiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey !== expectedApiKey) {
    return false;
  }
  return true;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, startTime, endTime, location, description, color, startDate, endDate } = body;

    if (!title || !startDate) {
      return NextResponse.json(
        { error: 'Title and startDate are required' },
        { status: 400 }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        startTime,
        endTime,
        location,
        description,
        color,
        startDate,
        endDate
      }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const awaitedParams = await params;
    const eventId = parseInt(awaitedParams.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    await prisma.event.delete({
      where: { id: eventId }
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}