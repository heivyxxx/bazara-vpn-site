import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .in('status', ['approved', 'published'])
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, reviews: data });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, text, rating } = data;
    if (!userId || !text || !rating) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    const { error, data: inserted } = await supabase
      .from('reviews')
      .insert({
        userId,
        text,
        rating,
        createdAt: new Date().toISOString(),
        status: 'moderation',
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, id: inserted.id });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 