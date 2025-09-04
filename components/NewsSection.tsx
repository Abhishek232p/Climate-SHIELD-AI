import React from 'react';
import type { NewsArticle } from '../types';

interface NewsSectionProps {
    news: { summary: string, articles: NewsArticle[] } | null;
    isLoading: boolean;
}

const NewsSkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="h-6 bg-brand-bg rounded w-1/3 mb-4"></div>
        <div className="space-y-2 mb-6">
            <div className="h-4 bg-brand-bg rounded w-full"></div>
            <div className="h-4 bg-brand-bg rounded w-full"></div>
            <div className="h-4 bg-brand-bg rounded w-5/6"></div>
        </div>
        <div className="h-5 bg-brand-bg rounded w-1/4 mb-3"></div>
        <div className="space-y-3">
            <div className="h-4 bg-brand-bg rounded w-full"></div>
            <div className="h-4 bg-brand-bg rounded w-full"></div>
        </div>
    </div>
);


export const NewsSection: React.FC<NewsSectionProps> = ({ news, isLoading }) => {
    return (
        <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg h-full">
            <h2 className="text-xl font-bold mb-4 text-brand-text">Latest News & Updates</h2>

            {isLoading && <NewsSkeletonLoader />}

            {news && !isLoading && (
                <div className="animate-fade-in">
                    <h3 className="font-semibold text-lg text-brand-primary mb-2">AI Summary</h3>
                    <p className="text-brand-text mb-4 whitespace-pre-wrap leading-relaxed">{news.summary || 'No summary available.'}</p>
                    {news.articles.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-brand-secondary mb-2">Sources</h4>
                            <ul className="space-y-2">
                                {news.articles.map((article, index) => (
                                    <li key={index} className="truncate">
                                        <a href={article.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all" title={article.title}>
                                            {article.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
             {!news && !isLoading && (
                <div className="text-center text-brand-secondary">
                    <p>News and updates will appear here after a risk assessment is completed.</p>
                </div>
            )}
        </div>
    );
};
