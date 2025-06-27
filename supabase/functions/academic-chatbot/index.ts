
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    
    console.log('Received message:', message);
    console.log('Context:', context);

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('Google API key not configured');
    }

    // Create a detailed prompt for academic assistance
    const systemPrompt = `You are an Academic Assistant AI specializing in helping students with their CGPA, SGPA calculations and academic planning. 

Current Student Context:
- Current SGPA: ${context.currentSGPA}
- Current CGPA: ${context.currentCGPA}
- Current Semester: ${context.semester}
- Total Subjects: ${context.totalSubjects}
- Average Marks: ${context.averageMarks?.toFixed(1)}%

Subject-wise Performance:
${context.marks?.map(mark => `- ${mark.subject}: ${mark.total}% (Mid1: ${mark.mid1}, Mid2: ${mark.mid2}, Assignment: ${mark.assignment})`).join('\n')}

Your role is to:
1. Help students understand their current academic standing
2. Calculate what SGPA/CGPA they need to achieve their targets
3. Provide specific advice on marks needed in upcoming exams
4. Explain grading systems and calculations
5. Motivate and guide students towards their academic goals

Guidelines:
- Be encouraging and positive
- Provide specific, actionable advice
- Use the context data to give personalized responses
- Explain calculations when relevant
- Keep responses concise but informative (max 200 words)
- Use Indian grading system context (10-point scale)

For CGPA calculations, assume:
- Each semester has equal weight
- SGPA to CGPA conversion follows standard Indian university practices
- Grade points: A+ (10), A (9), B+ (8), B (7), C (6), D (5), F (0)`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nStudent Question: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google AI API error:', errorData);
      throw new Error(`Google AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google AI response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Google AI API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in academic-chatbot function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process your question',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
