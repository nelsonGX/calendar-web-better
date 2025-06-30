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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const eventId = parseInt(params.id);
    
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