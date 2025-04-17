import { NextRequest, NextResponse } from 'next/server';

export function withApiMiddleware(handler: Function) {
  return async (request: NextRequest) => {
    // Check if this is an internal API route request with bypass header
    const isApiBypass = request.headers.get('x-api-route-bypass') === 'true';
    
    if (isApiBypass) {
      // Process the API request without auth checks
      return handler(request);
    }
    
    // For normal API requests, you could add rate limiting, auth checks, etc.
    // ...
    
    // Continue to the handler function
    return handler(request);
  };
} 