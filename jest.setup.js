
import 'whatwg-fetch';

// Polyfill for Request/Response
if (typeof Request === 'undefined' || typeof Response === 'undefined') {
  const { Request, Response } = require('node-fetch');
  global.Request = Request;
  global.Response = Response;
}

// Mock Next.js server components
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextRequest: class NextRequest {
      constructor(input, init) {
        return new Request(input, init);
      }
    },
    NextResponse: {
      json: (data, init) => {
        return new Response(JSON.stringify(data), init);
      },
      // Add other NextResponse methods as needed
    },
  };
});