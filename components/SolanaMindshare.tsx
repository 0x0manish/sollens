"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, Loader2, Brain, BarChart2, PieChart } from 'lucide-react';
import { XLogo } from "@/components/icons/XLogo";

type MindshareData = {
  name: string;
  symbol: string;
  mindshare: {
    rank: number;
    latestScore: number;
    scoreChange1d: number;
    scoreChange7d: number;
    scoreChange30d: number;
    latestPercentage: number;
    percentageChange1d: number;
    percentageChange7d: number;
    percentageChange30d: number;
  };
  sentiment: {
    rank: number;
    sentimentScore: number;
    sentimentMomentumScore: number;
    positivePostPercent: number;
    negativePostPercent: number;
    neutralPostPercent: number;
    tweetVolume: number;
  };
};

export function SolanaMindshare() {
  const [data, setData] = useState<MindshareData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMindshareData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/solana/mindshare');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Solana mindshare data');
        }
        
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error('Error fetching Solana mindshare data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load mindshare data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMindshareData();
  }, []);

  // Helper function to format percentages
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Helper function to get color based on value
  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-emerald-400' : 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <span className="ml-3 text-slate-300">Loading Solana mindshare data...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="text-center py-8">
          <p className="text-red-400">{error || 'No mindshare data available'}</p>
        </div>
      </div>
    );
  }

  // Calculate percentage for the sentiment donut chart
  const sentimentPositiveStyle = { 
    width: `${data.sentiment.positivePostPercent * 100}%`,
    backgroundColor: '#10b981' // emerald-500
  };
  const sentimentNegativeStyle = { 
    width: `${data.sentiment.negativePostPercent * 100}%`,
    backgroundColor: '#ef4444' // red-500
  };
  const sentimentNeutralStyle = { 
    width: `${data.sentiment.neutralPostPercent * 100}%`,
    backgroundColor: '#94a3b8' // slate-400
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Brain className="h-5 w-5 mr-2 text-emerald-500" />
        Solana Network Mindshare
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Mindshare metrics */}
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="bg-emerald-500/20 rounded-full p-3 mr-3">
              <BarChart2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center">
                <h4 className="text-lg font-medium mr-2">{data.symbol} Mindshare</h4>
                <div className="bg-slate-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  Rank #{data.mindshare.rank}
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Solana's prominence in the crypto conversation
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Mindshare Score</div>
              <div className="text-2xl font-bold">{data.mindshare.latestScore.toLocaleString()}</div>
              <div className={`text-sm flex items-center mt-1 ${getChangeColor(data.mindshare.scoreChange1d)}`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                {formatPercentage(data.mindshare.scoreChange1d)} (24h)
              </div>
            </div>
            
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Market Share</div>
              <div className="text-2xl font-bold">{data.mindshare.latestPercentage.toFixed(2)}%</div>
              <div className={`text-sm flex items-center mt-1 ${getChangeColor(data.mindshare.percentageChange7d)}`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                {formatPercentage(data.mindshare.percentageChange7d)} (7d)
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-slate-400">Growth Trend</div>
              <div className="text-sm text-slate-400">Last 30 days</div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>24h</span>
                  <span className={getChangeColor(data.mindshare.percentageChange1d)}>
                    {formatPercentage(data.mindshare.percentageChange1d)}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${data.mindshare.percentageChange1d >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(data.mindshare.percentageChange1d), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>7d</span>
                  <span className={getChangeColor(data.mindshare.percentageChange7d)}>
                    {formatPercentage(data.mindshare.percentageChange7d)}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${data.mindshare.percentageChange7d >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(data.mindshare.percentageChange7d), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>30d</span>
                  <span className={getChangeColor(data.mindshare.percentageChange30d)}>
                    {formatPercentage(data.mindshare.percentageChange30d)}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${data.mindshare.percentageChange30d >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(data.mindshare.percentageChange30d), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column: Sentiment analysis */}
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="bg-emerald-500/20 rounded-full p-3 mr-3">
              <PieChart className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center">
                <h4 className="text-lg font-medium mr-2">Sentiment Analysis</h4>
                <div className="bg-slate-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  Rank #{data.sentiment.rank}
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                How the community feels about Solana
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Sentiment Score</div>
              <div className="text-2xl font-bold">{data.sentiment.sentimentScore.toFixed(1)}</div>
              <div className="text-sm text-slate-400 mt-1">
                {data.sentiment.sentimentScore > 60 
                  ? 'Very Positive' 
                  : data.sentiment.sentimentScore > 50 
                    ? 'Positive' 
                    : data.sentiment.sentimentScore > 40 
                      ? 'Neutral' 
                      : 'Negative'}
              </div>
            </div>
            
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">
                <div className="flex items-center">
                  <XLogo className="h-3.5 w-3.5 mr-1" /> 
                  Tweet Volume
                </div>
              </div>
              <div className="text-2xl font-bold">{data.sentiment.tweetVolume.toLocaleString()}</div>
              <div className="text-sm text-slate-400 mt-1">
                Last 24 hours
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex justify-between mb-3">
              <div className="text-sm text-slate-400">Sentiment Breakdown</div>
            </div>
            
            <div className="mb-4 h-3 bg-slate-700 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500" style={sentimentPositiveStyle}></div>
              <div className="h-full bg-red-500" style={sentimentNegativeStyle}></div>
              <div className="h-full bg-slate-400" style={sentimentNeutralStyle}></div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="text-emerald-400 font-medium">
                  {(data.sentiment.positivePostPercent * 100).toFixed(1)}%
                </div>
                <div className="text-slate-400">Positive</div>
              </div>
              
              <div>
                <div className="text-red-400 font-medium">
                  {(data.sentiment.negativePostPercent * 100).toFixed(1)}%
                </div>
                <div className="text-slate-400">Negative</div>
              </div>
              
              <div>
                <div className="text-slate-300 font-medium">
                  {(data.sentiment.neutralPostPercent * 100).toFixed(1)}%
                </div>
                <div className="text-slate-400">Neutral</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-right text-slate-500">
        Data source: Messari Signal API
      </div>
    </div>
  );
}
