import type { AppState, AppAction } from '../types';

export const initialState: AppState = {
    prediction: null,
    news: null,
    historicalContext: null,
    status: {
        isPredicting: false,
        isFetchingContext: false,
        isAnalyzingHistory: false,
    },
    error: null,
    currentLocation: '',
    isLive: false,
    liveEvents: [],
    historyAnalysisResult: null,
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'FETCH_PREDICTION_START':
            return {
                ...initialState,
                status: { ...initialState.status, isPredicting: true },
                currentLocation: action.payload.location,
            };
        case 'FETCH_PREDICTION_SUCCESS':
            return {
                ...state,
                status: { ...state.status, isPredicting: false, isFetchingContext: true },
                prediction: action.payload,
                error: null,
            };
        case 'FETCH_PREDICTION_FAILURE':
            return {
                ...state,
                status: { ...initialState.status },
                error: action.payload,
            };
        case 'FETCH_CONTEXT_SUCCESS':
            return {
                ...state,
                status: { ...state.status, isFetchingContext: false },
                news: action.payload.news,
                historicalContext: action.payload.historicalContext,
            };
        case 'FETCH_CONTEXT_FAILURE':
            // Keep existing prediction data, but show context error
            return {
                ...state,
                status: { ...state.status, isFetchingContext: false },
                news: { summary: action.payload.message, articles: [] },
                historicalContext: action.payload.message,
            };
        case 'LOAD_FROM_HISTORY':
            return {
                ...initialState,
                prediction: action.payload,
                currentLocation: action.payload.location,
                status: { ...initialState.status, isFetchingContext: true },
            }
        case 'ANALYZE_HISTORY_START':
            return {
                ...initialState,
                status: { ...initialState.status, isAnalyzingHistory: true },
            };
        case 'ANALYZE_HISTORY_SUCCESS':
            return {
                ...state,
                status: { ...initialState.status },
                historyAnalysisResult: action.payload
            };
        case 'ANALYZE_HISTORY_FAILURE':
             return {
                ...state,
                status: { ...initialState.status },
                error: action.payload,
                historyAnalysisResult: action.payload.message,
            };
        case 'START_SIMULATION':
            return { ...state, isLive: true };
        case 'STOP_SIMULATION':
            return { ...state, isLive: false };
        case 'ADD_LIVE_EVENT':
            return { ...state, liveEvents: [action.payload, ...state.liveEvents] };
        case 'CLEAR_SIMULATION':
            return { ...state, isLive: false, liveEvents: [] };
        default:
            return state;
    }
};
