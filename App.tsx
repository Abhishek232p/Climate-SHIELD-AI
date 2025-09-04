
// Fix: Import `useState` from React to resolve reference error.
import React, { useCallback, useEffect, useRef, useReducer, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PredictionForm } from './components/PredictionForm';
import { PredictionDisplay } from './components/PredictionDisplay';
import { NewsSection } from './components/NewsSection';
import { MapDisplay } from './components/MapDisplay';
import { LiveSimulationFeed, LiveEvent } from './components/LiveSimulationFeed';
import { getDisasterPrediction, getLatestNews, getHistoricalAnalysis, analyzeHistory } from './services/geminiService';
import type { DisasterType, HistoricalPrediction, Settings } from './types';
import { RiskLevel } from './types';
import { NotificationBanner } from './components/NotificationBanner';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { EducationalResources } from './components/EducationalResources';
import { appReducer, initialState } from './hooks/appReducer';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const {
    prediction,
    news,
    historicalContext,
    status,
    error,
    currentLocation,
    isLive,
    liveEvents,
    historyAnalysisResult,
  } = state;

  const [history, setHistory] = useLocalStorage<HistoricalPrediction[]>('disasterHistory', []);
  const [settings, setSettings] = useLocalStorage<Settings>('appSettings', { alertThreshold: RiskLevel.High });
  const [notification, setNotification] = useState<string | null>(null);

  const eventIntervalRef = useRef<number | null>(null);

  const clearSimulation = useCallback(() => {
    dispatch({ type: 'CLEAR_SIMULATION' });
    if (eventIntervalRef.current) {
      clearInterval(eventIntervalRef.current);
      eventIntervalRef.current = null;
    }
  }, []);
  
  const riskLevelToNumber = (level: RiskLevel) => {
    const order = [RiskLevel.Low, RiskLevel.Moderate, RiskLevel.High, RiskLevel.Severe];
    return order.indexOf(level);
  }

  useEffect(() => {
    if (prediction && riskLevelToNumber(prediction.riskLevel) >= riskLevelToNumber(settings.alertThreshold)) {
        setNotification(`High risk alert: ${prediction.riskLevel} threat detected for ${currentLocation}.`);
    } else {
        setNotification(null);
    }

    if (prediction?.simulatedEvents && prediction.simulatedEvents.length > 0) {
      clearSimulation();
      dispatch({ type: 'START_SIMULATION' });
      
      let eventIndex = 0;
      const events = prediction.simulatedEvents;

      eventIntervalRef.current = window.setInterval(() => {
        if (eventIndex < events.length) {
          const newEvent: LiveEvent = {
            timestamp: new Date().toLocaleTimeString(),
            message: events[eventIndex],
          };
          dispatch({ type: 'ADD_LIVE_EVENT', payload: newEvent });
          eventIndex++;
        } else {
          if (eventIntervalRef.current) {
            clearInterval(eventIntervalRef.current);
            setTimeout(() => dispatch({ type: 'STOP_SIMULATION' }), 5000);
          }
        }
      }, 3500);
    }

    return () => {
      if (eventIntervalRef.current) {
        clearInterval(eventIntervalRef.current);
      }
    };
  }, [prediction, settings.alertThreshold, currentLocation, clearSimulation]);

  const handlePrediction = useCallback(async (location: string, disaster: DisasterType) => {
    clearSimulation();
    setNotification(null);
    dispatch({ type: 'FETCH_PREDICTION_START', payload: { location, disaster } });

    try {
      const result = await getDisasterPrediction(location, disaster);
      
      const newHistoryItem: HistoricalPrediction = {
          ...result,
          id: new Date().toISOString(),
          location,
          disasterType: disaster,
          timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]); // Keep history to 20 items

      dispatch({ type: 'FETCH_PREDICTION_SUCCESS', payload: result });

      try {
        const [newsResult, historyResult] = await Promise.all([
          getLatestNews(location, disaster),
          getHistoricalAnalysis(location, disaster),
        ]);
        dispatch({ type: 'FETCH_CONTEXT_SUCCESS', payload: { news: newsResult, historicalContext: historyResult } });
      } catch (contextError) {
         dispatch({ type: 'FETCH_CONTEXT_FAILURE', payload: { title: 'Context Error', message: 'Could not load supplementary news and historical data.' } });
      }

    } catch (err: unknown) {
      dispatch({ type: 'FETCH_PREDICTION_FAILURE', payload: err as any });
      clearSimulation();
    }
  }, [setHistory, clearSimulation]);

  const handleLoadFromHistory = useCallback(async (item: HistoricalPrediction) => {
    dispatch({ type: 'LOAD_FROM_HISTORY', payload: item });
    try {
        const [newsResult, historyResult] = await Promise.all([
            getLatestNews(item.location, item.disasterType),
            getHistoricalAnalysis(item.location, item.disasterType)
        ]);
        dispatch({ type: 'FETCH_CONTEXT_SUCCESS', payload: { news: newsResult, historicalContext: historyResult } });
    } catch (contextError) {
        dispatch({ type: 'FETCH_CONTEXT_FAILURE', payload: { title: 'Context Error', message: 'Could not load supplementary news and historical data for this historical item.' } });
    }
  }, []);

  const handleAnalyzeHistory = async () => {
    if (history.length < 2) {
        dispatch({ type: 'ANALYZE_HISTORY_SUCCESS', payload: "Not enough data to analyze. Please run at least two assessments." });
        return;
    }
    dispatch({ type: 'ANALYZE_HISTORY_START' });
    try {
        const result = await analyzeHistory(history);
        dispatch({ type: 'ANALYZE_HISTORY_SUCCESS', payload: result });
    } catch (err) {
        dispatch({ type: 'ANALYZE_HISTORY_FAILURE', payload: { title: "Analysis Failed", message: "Failed to analyze history. The AI service may be unavailable." } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header isLive={isLive} />
      <NotificationBanner message={notification} onDismiss={() => setNotification(null)} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-3 space-y-8 animate-fade-in">
            <PredictionForm onPredict={handlePrediction} isLoading={status.isPredicting} />
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>

          <div className="lg:col-span-5 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {historyAnalysisResult ? (
                 <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-brand-text">Historical Trend Analysis</h2>
                     <p className="text-brand-text leading-relaxed whitespace-pre-wrap">{historyAnalysisResult}</p>
                 </div>
            ) : (
                <PredictionDisplay 
                    prediction={prediction} 
                    isLoading={status.isPredicting} 
                    error={error} 
                />
            )}
          </div>
          
          <div className="lg:col-span-4 space-y-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <HistoryPanel 
                history={history} 
                onLoad={handleLoadFromHistory} 
                onDelete={(id) => setHistory(history.filter(h => h.id !== id))}
                onAnalyze={handleAnalyzeHistory}
                isAnalyzing={status.isAnalyzingHistory}
            />
          </div>
        </div>

        {prediction && !status.isPredicting && !historyAnalysisResult && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-in-up">
            <div className="space-y-8">
              <MapDisplay 
                prediction={prediction}
                location={currentLocation} 
                isLoading={status.isFetchingContext}
              />
              {liveEvents.length > 0 && <LiveSimulationFeed events={liveEvents} />}
               <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-brand-text">Historical Context</h2>
                  {status.isFetchingContext ? (
                    <div className="space-y-3 animate-pulse">
                        <div className="h-4 bg-brand-bg rounded w-3/4"></div>
                        <div className="h-4 bg-brand-bg rounded w-full"></div>
                        <div className="h-4 bg-brand-bg rounded w-5/6"></div>
                    </div>
                  ) : historicalContext ? (
                    <p className="text-brand-text leading-relaxed">{historicalContext}</p>
                  ) : (
                    <p className="text-brand-secondary">Historical analysis could not be loaded.</p>
                  )}
              </div>
            </div>
            
            <NewsSection 
              news={news} 
              isLoading={status.isFetchingContext} 
            />
          </div>
        )}
        
        <div className="mt-12 animate-slide-in-up" style={{ animationDelay: '600ms' }}>
          <EducationalResources />
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default App;