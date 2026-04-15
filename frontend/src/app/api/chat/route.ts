import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  let message = ''
  try {
    const body = await request.json()
    message = body.message
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    
    // Forward the request to Django backend
    const response = await fetch(`${BACKEND_URL}/api/chat/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Fallback to mock response if backend is unavailable
    const fallbackResponse = getFallbackResponse(message || '')
    return NextResponse.json({ response: fallbackResponse })
  }
}

function getFallbackResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  // Simple fallback responses
  if (lowerQuery.includes('cheapest rent') || lowerQuery.includes('lowest rent')) {
    return "Based on current data, Yelahanka has the most affordable rental options starting around ₹15,000/month. It's great for budget-conscious renters!"
  }
  
  if (lowerQuery.includes('gym')) {
    return "Several locations offer gym facilities including Whitefield, Bellandur, and Yelahanka. These areas provide fitness amenities for residents."
  }
  
  if (lowerQuery.includes('whitefield') && lowerQuery.includes('average rent')) {
    return "The average rent in Whitefield is approximately ₹25,000/month. This premium area offers excellent amenities and connectivity."
  }
  
  if (lowerQuery.includes('2bhk') || lowerQuery.includes('2 bhk')) {
    return "2BHK properties are widely available across all localities, typically ranging from 800-1200 sqft with rents between ₹15,000-25,000 depending on the area."
  }
  
  if (lowerQuery.includes('family') || lowerQuery.includes('families')) {
    return "For families, I recommend Whitefield, Bellandur, and Yelahanka. These areas have good schools, parks, and family-friendly amenities."
  }
  
  if (lowerQuery.includes('invest') || lowerQuery.includes('investment')) {
    return "Electronic City and Whitefield show strong investment potential. Electronic City offers growth opportunities, while Whitefield provides premium rental yields."
  }
  
  return "I can help you with Bangalore rental properties! Ask me about specific locations, average rents, amenities, or budget requirements. For example: 'What's the average rent in Whitefield?'"
}
