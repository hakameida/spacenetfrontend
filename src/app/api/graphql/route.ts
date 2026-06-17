// src/app/api/graphql/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GRAPHQL_ENDPOINT = 'https://api.spacenetstore.com/graphql/';
const MARKET_SECRET_TOKEN = process.env.MARKET_SECRET_TOKEN;

export async function POST(request: NextRequest) {
  console.log('🚀 API Route /api/graphql was called!');
  console.log('🔑 Token exists:', !!MARKET_SECRET_TOKEN);
  
  try {
    const body = await request.json();
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MARKET_SECRET_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from GraphQL' },
      { status: 500 }
    );
  }
}