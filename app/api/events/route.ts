import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase/service';

// Retry utility function
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}

// Check for duplicate events
async function isDuplicate(title: string, startDate: string, startTime: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('Event')
    .select('*')
    .eq('title', title)
    .eq('startDate', startDate)
    .eq('startTime', startTime)
    .limit(1);
  
  return !!data && data.length > 0;
}

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
    const supabase = createServiceClient();
    const { data: events, error } = await supabase
      .from('Event')
      .select('*')
      .order('startDate', { ascending: true });

    if (error) {
      throw error;
    }
    
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
      const skipped = [];
      const processedEvents = new Set<string>(); // Track events in current batch

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
          // Extract time and date from ISO string while preserving original timezone
          const startISOString = eventData.start_time;
          const endISOString = eventData.end_time;
          
          // Extract time (HH:MM) from ISO string (e.g., "2025-08-08T00:00:00+08:00" -> "00:00")
          const startTime = startISOString.substring(11, 16);
          const endTime = endISOString ? endISOString.substring(11, 16) : null;
          
          // Extract date (YYYY-MM-DD) from ISO string
          const startDate = startISOString.substring(0, 10);
          const endDate = endISOString ? endISOString.substring(0, 10) : null;
          
          // Create unique key for this event
          const eventKey = `${eventData.title}|${startDate}|${startTime}`;
          
          // Check for duplicates in current batch
          if (processedEvents.has(eventKey)) {
            skipped.push({
              index: i,
              reason: 'Duplicate in current batch (same title, date, and time)',
              data: eventData
            });
            continue;
          }
          
          // Check for duplicates in database
          const duplicate = await retryOperation(() => 
            isDuplicate(eventData.title, startDate, startTime)
          );
          
          if (duplicate) {
            skipped.push({
              index: i,
              reason: 'Duplicate event already exists in database',
              data: eventData
            });
            continue;
          }
          
          // Mark as processed
          processedEvents.add(eventKey);
          
          // Create event with retry logic
          const supabase = createServiceClient();
          const { data: event, error: createError } = await supabase
            .from('Event')
            .insert({
              title: eventData.title,
              startTime,
              endTime,
              location: eventData.location || null,
              description: eventData.description || null,
              color: eventData.color || '#3b82f6',
              startDate,
              endDate
            })
            .select()
            .single();

          if (createError) {
            throw createError;
          }
          
          events.push(event);
        } catch (eventError) {
          errors.push({
            index: i,
            error: 'Failed to create event after retries',
            details: eventError instanceof Error ? eventError.message : 'Unknown error',
            data: eventData
          });
        }
      }

      return NextResponse.json({
        success: events.length,
        failed: errors.length,
        skipped: skipped.length,
        events,
        errors,
        skippedEvents: skipped
      }, { status: 201 });
    } else {
      const { title, startTime, endTime, location, description, color, startDate, endDate } = body;

      if (!title || !startDate) {
        return NextResponse.json(
          { error: 'Title and start date are required' },
          { status: 400 }
        );
      }

      const supabase = createServiceClient();
      const { data: event, error } = await supabase
        .from('Event')
        .insert({
          title,
          startTime: startTime || null,
          endTime: endTime || null,
          location: location || null,
          description: description || null,
          color: color || '#3b82f6',
          startDate,
          endDate: endDate || null
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

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