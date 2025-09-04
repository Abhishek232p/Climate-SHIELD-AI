// This is a conceptual test file. It requires a test runner like Vitest or Jest
// and a mocking library like `vi` from Vitest.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDisasterPrediction } from './geminiService';
import { GoogleGenAI } from '@google/genai';
import { DisasterType, RiskLevel, ApiError } from '../types';

// Mock the entire @google/genai module
vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();
  const GoogleGenAI = vi.fn(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  }));
  return { GoogleGenAI, Type: {} };
});

const mockGenerateContent = (GoogleGenAI as any).mock.results[0].value.models.generateContent;


describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDisasterPrediction', () => {
    it('should return a valid prediction result on success', async () => {
      const mockApiResponse = {
        riskLevel: RiskLevel.Severe,
        analysis: 'A severe event is imminent.',
        safetyMeasures: { before: ['prepare'], during: ['act'], after: ['recover'] },
        coordinates: { lat: 34.05, lon: -118.25 },
        simulatedEvents: ['Event A', 'Event B'],
        shortSummary: 'Severe risk in LA.',
      };

      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(mockApiResponse),
      });

      const result = await getDisasterPrediction('Los Angeles', DisasterType.Earthquake);
      
      expect(result).toEqual(mockApiResponse);
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('should throw an ApiError when the API call fails', async () => {
      const errorMessage = 'API is down';
      mockGenerateContent.mockRejectedValue(new Error(errorMessage));

      await expect(getDisasterPrediction('Invalid Place', DisasterType.Flood))
        .rejects
        .toThrowError('The AI model could not generate a risk assessment. This may be due to an invalid location or a temporary service issue. Please try again.');
        
      await expect(getDisasterPrediction('Invalid Place', DisasterType.Flood))
        .rejects
        .toSatisfy((error: ApiError) => {
           expect(error.title).toBe('Prediction Failed');
           return true;
        });
    });

    it('should throw an ApiError when the response is not valid JSON', async () => {
        mockGenerateContent.mockResolvedValue({
            text: 'This is not JSON',
        });

        await expect(getDisasterPrediction('Some Place', DisasterType.Wildfire))
            .rejects
            .toThrowError('The AI model could not generate a risk assessment. This may be due to an invalid location or a temporary service issue. Please try again.');
    });
  });
});
