import { NextResponse } from 'next/server';
import { getUser } from '@civic/auth-web3/nextjs';

export async function GET(request: Request) {
  try {
    // Get the current user
    const user = await getUser();
    
    // If no active user session, return a 401 Unauthorized
    if (!user) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }
    
    // If session exists, return success
    // The mere fact that getUser() returned a user object means the session is valid
    return NextResponse.json({ 
      status: 'success',
      message: 'Session validated',
      userId: user.id
    });
  } catch (error) {
    console.error('Auth refresh error:', error);
    return NextResponse.json(
      { error: 'Authentication refresh failed' },
      { status: 500 }
    );
  }
}
