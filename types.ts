export enum DisasterType {
  Earthquake = 'Earthquake',
  Flood = 'Flood',
  Wildfire = 'Wildfire',
  Hurricane = 'Hurricane',
  Tornado = 'Tornado',
  Tsunami = 'Tsunami',
}

export enum RiskLevel {
    Low = 'Low',
    Moderate = 'Moderate',
    High = 'High',
    Severe = 'Severe'
}

export interface SafetyMeasures {
  before: string[];
  during: string[];
  after:string[];
}

export interface PredictionResult {
  riskLevel: RiskLevel;
  analysis: string;
  safetyMeasures: SafetyMeasures;
  coordinates: {
    lat: number;
    lon: number;
  };
  simulatedEvents: string[];
  shortSummary: string;
}

export interface ApiError {
  title: string;
  message: string;
}

export interface NewsArticle {
    uri: string;
    title: string;
}

export interface Settings {
  alertThreshold: RiskLevel;
}

export interface HistoricalPrediction extends PredictionResult {
  id: string;
  location: string;
  disasterType: DisasterType;
  timestamp: string;
}

export interface EducationalResource {
    summary: string;
    keyTopics: { topic: string; details: string; }[];
}


// --- State Management Types ---
import { LiveEvent } from "./components/LiveSimulationFeed";

export interface AppState {
  prediction: PredictionResult | null;
  news: { summary: string; articles: NewsArticle[] } | null;
  historicalContext: string | null;
  status: {
    isPredicting: boolean;
    isFetchingContext: boolean;
    isAnalyzingHistory: boolean;
  };
  error: ApiError | null;
  currentLocation: string;
  isLive: boolean;
  liveEvents: LiveEvent[];
  historyAnalysisResult: string | null;
}

export type AppAction =
  | { type: 'FETCH_PREDICTION_START'; payload: { location: string; disaster: DisasterType } }
  | { type: 'FETCH_PREDICTION_SUCCESS'; payload: PredictionResult }
  | { type: 'FETCH_PREDICTION_FAILURE'; payload: ApiError }
  | { type: 'FETCH_CONTEXT_SUCCESS'; payload: { news: { summary: string; articles: NewsArticle[] }; historicalContext: string } }
  | { type: 'FETCH_CONTEXT_FAILURE'; payload: ApiError }
  | { type: 'LOAD_FROM_HISTORY'; payload: HistoricalPrediction }
  | { type: 'ANALYZE_HISTORY_START' }
  | { type: 'ANALYZE_HISTORY_SUCCESS'; payload: string }
  | { type: 'ANALYZE_HISTORY_FAILURE'; payload: ApiError }
  | { type: 'START_SIMULATION' }
  | { type: 'STOP_SIMULATION' }
  | { type: 'ADD_LIVE_EVENT'; payload: LiveEvent }
  | { type: 'CLEAR_SIMULATION' };
