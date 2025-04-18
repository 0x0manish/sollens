import { NextResponse } from 'next/server';
import { getSession, updateSession } from '@civic/auth-web3/nextjs';

export async function GET(request: Request) {
  try {
    // Get the current session
    const session = await getSession();
    
    // If no active session, return a 401 Unauthorized
    if (!session) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }
    
    // If session exists but approaching expiry, you would refresh the token here
    // For now, we'll just return the existing session data
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Session validated',
      expiresAt: session.expiresAt
    });
  } catch (error) {
    console.error('Auth refresh error:', error);
    return NextResponse.json(
      { error: 'Authentication refresh failed' },
      { status: 500 }
    );
  }
}
