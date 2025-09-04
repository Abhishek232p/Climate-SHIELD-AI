import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionResult, DisasterType, NewsArticle, HistoricalPrediction, EducationalResource, ApiError } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: {
      type: Type.STRING,
      enum: ['Low', 'Moderate', 'High', 'Severe'],
      description: 'The simulated risk level for the disaster.'
    },
    analysis: {
      type: Type.STRING,
      description: 'A detailed paragraph explaining the simulated risk factors for the location and disaster type.'
    },
    safetyMeasures: {
      type: Type.OBJECT,
      properties: {
        before: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Actionable safety tips for before the disaster occurs.' },
        during: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Actionable safety tips for during the disaster.' },
        after: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Actionable safety tips for after the disaster has passed.' }
      },
      required: ['before', 'during', 'after']
    },
    coordinates: {
        type: Type.OBJECT,
        description: "The geographical coordinates for the center of the specified location.",
        properties: {
            lat: { type: Type.NUMBER, description: "Latitude" },
            lon: { type: Type.NUMBER, description: "Longitude" }
        },
        required: ["lat", "lon"]
    },
    simulatedEvents: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'An array of 10-15 short, chronological, simulated event log messages for a live feed. Example: ["Seismic sensors activated.", "Minor tremors detected."]'
    },
    shortSummary: {
        type: Type.STRING,
        description: 'A concise, one-sentence summary of the risk assessment, suitable for sharing. E.g., "Simulated Risk for Earthquake in San Francisco, CA: High."'
    }
  },
  required: ['riskLevel', 'analysis', 'safetyMeasures', 'coordinates', 'simulatedEvents', 'shortSummary']
};


export const getDisasterPrediction = async (location: string, disasterType: DisasterType): Promise<PredictionResult> => {
  try {
    const prompt = `You are Climate Shield AI, a disaster preparedness assistant. Based on the location '${location}' and disaster type '${disasterType}', provide a simulated risk analysis, safety advisory, coordinates, and a short shareable summary. This is for a fictional scenario for educational purposes and is not a real prediction. Also, generate a list of 10-15 realistic, chronological event log messages for a live monitoring feed based on this scenario.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as PredictionResult;

  } catch (error) {
    console.error("Error fetching disaster prediction:", error);
    const apiError: ApiError = {
        title: "Prediction Failed",
        message: "The AI model could not generate a risk assessment. This may be due to an invalid location or a temporary service issue. Please try again."
    };
    throw apiError;
  }
};


export const getLatestNews = async (location: string, disasterType: string): Promise<{ summary: string; articles: NewsArticle[] }> => {
    if (!location || !disasterType) {
        return { summary: '', articles: [] };
    }
    
    try {
        const prompt = `Provide a concise summary of the latest news and updates regarding '${disasterType}' in or around '${location}'. Include any official alerts or warnings if available.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const summary = response.text;
        const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        const articles: NewsArticle[] = (rawChunks || [])
            .map((chunk: any) => ({
                uri: chunk.web?.uri || '',
                title: chunk.web?.title || 'Untitled Source',
            }))
            .filter((article: NewsArticle) => article.uri);

        const uniqueArticles = Array.from(new Map(articles.map(item => [item.uri, item])).values());
        
        return { summary, articles: uniqueArticles };

    } catch (error) {
        console.error("Error fetching latest news:", error);
        throw new Error("Failed to fetch news. The AI service may be unavailable.");
    }
};

export const getHistoricalAnalysis = async (location: string, disasterType: DisasterType): Promise<string> => {
    try {
        const prompt = `Provide a brief, single-paragraph summary of historical '${disasterType}' events for '${location}'. Focus on significant past events, general frequency, or notable geological/climatological factors that contribute to the risk. This is for an educational simulation.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching historical analysis:", error);
        return "Could not load historical data at this time.";
    }
}

export const getCityFromCoords = async (lat: number, lon: number): Promise<string> => {
    try {
        const prompt = `Based on the coordinates latitude=${lat} and longitude=${lon}, what is the city and state/country? Please provide a concise, single-line answer in the format "City, State/Country".`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error fetching city from coordinates:", error);
        throw new Error("Could not determine location from coordinates.");
    }
};


const educationalSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A brief, encouraging intro to disaster preparedness." },
        keyTopics: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    topic: { type: Type.STRING },
                    details: { type: Type.STRING, description: "A detailed paragraph on the topic." }
                }
            }
        }
    }
}

export const getEducationalContent = async (disasterType: DisasterType): Promise<EducationalResource> => {
    try {
        const prompt = `Create an educational guide on preparing for a(n) ${disasterType}. Provide a brief summary and then several key topics like "Building a Kit", "Making a Plan", and "Staying Informed", each with a detailed paragraph.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: educationalSchema
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as EducationalResource;
    } catch (error) {
        console.error("Error fetching educational content:", error);
        throw new Error("Could not load educational resources at this time.");
    }
};

export const analyzeHistory = async (history: HistoricalPrediction[]): Promise<string> => {
    try {
        const simplifiedHistory = history.map(h => ({
            location: h.location,
            disasterType: h.disasterType,
            riskLevel: h.riskLevel,
            timestamp: h.timestamp
        }));

        const prompt = `Analyze the following historical disaster risk assessments and provide a brief, insightful summary of any trends, recurring high-risk areas, or patterns. The user wants to understand their simulated risk profile over time. History: ${JSON.stringify(simplifiedHistory)}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing history:", error);
        throw new Error("Failed to analyze historical data.");
    }
};
