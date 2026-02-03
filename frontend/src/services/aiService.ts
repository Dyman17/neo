import { PreservationAnalysis, Artifact } from '@/types/api';

// Groq API configuration
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = GROQ_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = GROQ_API_URL;
  }

  /**
   * Analyze preservation index for an artifact using Groq AI
   */
  async analyzePreservation(artifact: Artifact): Promise<PreservationAnalysis> {
    const systemPrompt = `You are an expert archaeologist specializing in artifact preservation analysis. 
    Analyze the given artifact and provide a preservation assessment.

    Consider these factors:
    - Material type and its preservation characteristics
    - Environmental conditions (soil, moisture, temperature)
    - Depth and burial conditions
    - Age and historical context
    - Potential degradation factors

    Return a JSON response with:
    {
      "score": number (0-100),
      "risk": "low" | "medium" | "high",
      "comparison": [
        {"material": string, "preservation": number}
      ],
      "recommendations": [string]
    }`;

    const userPrompt = `Analyze this artifact for preservation assessment:
    
    Type: ${artifact.type}
    Material: ${artifact.material || 'Unknown'}
    Depth: ${artifact.depth || 'Unknown'} meters
    Confidence: ${artifact.confidence}%
    Location: ${artifact.lat.toFixed(6)}, ${artifact.lng.toFixed(6)}
    Description: ${artifact.description || 'No description available'}
    
    Provide detailed preservation analysis with specific recommendations.`;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data: GroqResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from AI');
      }

      // Parse JSON response
      const analysis = this.parseAIResponse(content);
      
      return {
        score: analysis.score || 50,
        risk: analysis.risk || 'medium',
        comparison: analysis.comparison || this.getDefaultComparison(artifact.material),
        recommendations: analysis.recommendations || [
          'Further analysis recommended',
          'Consider environmental factors'
        ]
      };

    } catch (error) {
      console.error('AI analysis failed:', error);
      // Return fallback analysis
      return this.getFallbackAnalysis(artifact);
    }
  }

  /**
   * Generate material comparison analysis
   */
  async generateMaterialComparison(artifacts: Artifact[]): Promise<{
    materials: Array<{ name: string; count: number; avgPreservation: number }>;
    insights: string[];
  }> {
    const materialStats = artifacts.reduce((acc, artifact) => {
      const material = artifact.material || 'Unknown';
      if (!acc[material]) {
        acc[material] = { count: 0, totalPreservation: 0, hasPreservation: 0 };
      }
      acc[material].count++;
      if (artifact.preservation_index) {
        acc[material].totalPreservation += artifact.preservation_index;
        acc[material].hasPreservation++;
      }
      return acc;
    }, {} as Record<string, { count: number; totalPreservation: number; hasPreservation: number }>);

    const materials = Object.entries(materialStats).map(([name, stats]) => ({
      name,
      count: stats.count,
      avgPreservation: stats.hasPreservation > 0 
        ? stats.totalPreservation / stats.hasPreservation 
        : 50
    }));

    const userPrompt = `Analyze this archaeological material data and provide insights:
    
    ${materials.map(m => `${m.name}: ${m.count} artifacts, avg preservation: ${m.avgPreservation.toFixed(1)}%`).join('\n')}
    
    Provide 3-5 key insights about preservation patterns, material distribution, or archaeological significance.`;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { 
              role: 'system', 
              content: 'You are an expert archaeologist analyzing material distribution patterns. Provide concise, actionable insights.' 
            },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data: GroqResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      return {
        materials,
        insights: content ? this.parseInsights(content) : [
          'Material distribution shows typical archaeological patterns',
          'Further analysis recommended for preservation insights'
        ]
      };

    } catch (error) {
      console.error('Material comparison failed:', error);
      return {
        materials,
        insights: [
          'Material distribution shows typical archaeological patterns',
          'Further analysis recommended for preservation insights'
        ]
      };
    }
  }

  /**
   * Parse AI response safely
   */
  private parseAIResponse(content: string): Partial<PreservationAnalysis> {
    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {};
    }
  }

  /**
   * Parse insights from AI response
   */
  private parseInsights(content: string): string[] {
    // Split by common delimiters and clean up
    return content
      .split(/\n|•|\d\.|\-/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .slice(0, 5); // Limit to 5 insights
  }

  /**
   * Get default material comparison
   */
  private getDefaultComparison(material?: string): Array<{ material: string; preservation: number }> {
    const defaults: Record<string, number[]> = {
      'ceramic': [85, 80, 75],
      'stone': [90, 85, 80],
      'metal': [40, 35, 30],
      'organic': [25, 20, 15],
      'bone': [60, 55, 50],
      'wood': [30, 25, 20],
    };

    const materialPreservation = defaults[material?.toLowerCase() || ''] || [50, 45, 40];
    
    return [
      { material: material || 'Unknown', preservation: materialPreservation[0] },
      { material: 'Stone', preservation: 85 },
      { material: 'Ceramic', preservation: 80 },
      { material: 'Metal', preservation: 40 },
    ];
  }

  /**
   * Get fallback analysis when AI fails
   */
  private getFallbackAnalysis(artifact: Artifact): PreservationAnalysis {
    const materialScores: Record<string, { score: number; risk: 'low' | 'medium' | 'high' }> = {
      'ceramic': { score: 75, risk: 'medium' as const },
      'stone': { score: 85, risk: 'low' as const },
      'metal': { score: 35, risk: 'high' as const },
      'organic': { score: 25, risk: 'high' as const },
      'bone': { score: 55, risk: 'medium' as const },
      'wood': { score: 30, risk: 'high' as const },
    };

    const material = artifact.material?.toLowerCase() || 'unknown';
    const fallback = materialScores[material] || { score: 50, risk: 'medium' as const };

    return {
      score: fallback.score,
      risk: fallback.risk,
      comparison: this.getDefaultComparison(artifact.material),
      recommendations: [
        'Further analysis recommended',
        'Consider environmental factors',
        'Professional assessment advised'
      ]
    };
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'user', content: 'Respond with "OK"' }
          ],
          max_tokens: 10,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('AI service test failed:', error);
      return false;
    }
  }
}

export const aiService = new AIService();
export default aiService;
