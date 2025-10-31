import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertTriangle, Trash2 } from 'lucide-react';

interface CalculationResult {
  breakEven: number;
  conservative: number;
  moderate: number;
  aggressive: number;
  profitPercentage: number;
  profitAmount: number;
}

interface HistoryEntry extends CalculationResult {
  id: string;
  stockName: string;
  timestamp: number;
}

const STORAGE_KEY = 'stopLossHistory';

export default function StopLossCalculator() {
  const [stockName, setStockName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [assumedGain, setAssumedGain] = useState('100');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const saveToHistory = (newResult: CalculationResult) => {
    const entry: HistoryEntry = {
      ...newResult,
      id: Date.now().toString(),
      stockName,
      timestamp: Date.now(),
    };
    const updated = [entry, ...history];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteFromHistory = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const calculateStopLoss = (e: React.FormEvent) => {
    e.preventDefault();

    const buy = parseFloat(buyPrice);
    const current = parseFloat(currentPrice);
    const gain = parseFloat(assumedGain);

    if (isNaN(buy) || isNaN(current) || isNaN(gain) || buy <= 0 || current <= 0) {
      return;
    }

    const profitPercentage = ((current - buy) / buy) * 100;
    const profitAmount = current - buy;

    const breakEven = buy;
    const conservative = buy + (profitAmount * 0.75);
    const moderate = buy + (profitAmount * 0.50);
    const aggressive = buy + (profitAmount * 0.25);

    const newResult = {
      breakEven,
      conservative,
      moderate,
      aggressive,
      profitPercentage,
      profitAmount,
    };

    setResult(newResult);
    saveToHistory(newResult);
  };

  const reset = () => {
    setStockName('');
    setBuyPrice('');
    setCurrentPrice('');
    setAssumedGain('100');
    setResult(null);
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={calculateStopLoss} className="space-y-6">
          <div>
            <label htmlFor="stockName" className="block text-sm font-semibold text-slate-700 mb-2">
              Stock Name
            </label>
            <input
              type="text"
              id="stockName"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              placeholder="e.g., AAPL, TSLA, NVDA"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="buyPrice" className="block text-sm font-semibold text-slate-700 mb-2">
                Buy Price ($)
              </label>
              <input
                type="number"
                id="buyPrice"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="currentPrice" className="block text-sm font-semibold text-slate-700 mb-2">
                Current Price ($)
              </label>
              <input
                type="number"
                id="currentPrice"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="assumedGain" className="block text-sm font-semibold text-slate-700 mb-2">
              Assumed Gain (%)
            </label>
            <input
              type="number"
              id="assumedGain"
              value={assumedGain}
              onChange={(e) => setAssumedGain(e.target.value)}
              placeholder="100"
              step="1"
              min="0"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              required
            />
            <p className="mt-2 text-sm text-slate-500">
              This helps calculate conservative stop loss levels based on expected gains
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Calculator className="w-5 h-5" />
              Calculate Stop Loss
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-3 rounded-lg font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {stockName || 'Stock'} Analysis
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">Current Profit:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    ${result.profitAmount.toFixed(2)} ({result.profitPercentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Break Even</h3>
                </div>
                <p className="text-2xl font-bold text-red-700">
                  ${result.breakEven.toFixed(2)}
                </p>
                <p className="text-xs text-red-600 mt-1">0% profit protected</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Aggressive</h3>
                </div>
                <p className="text-2xl font-bold text-orange-700">
                  ${result.aggressive.toFixed(2)}
                </p>
                <p className="text-xs text-orange-600 mt-1">25% profit protected</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Moderate</h3>
                </div>
                <p className="text-2xl font-bold text-yellow-700">
                  ${result.moderate.toFixed(2)}
                </p>
                <p className="text-xs text-yellow-600 mt-1">50% profit protected</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-emerald-800">Conservative</h3>
                </div>
                <p className="text-2xl font-bold text-emerald-700">
                  ${result.conservative.toFixed(2)}
                </p>
                <p className="text-xs text-emerald-600 mt-1">75% profit protected</p>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-700 mb-2">How to use these levels:</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li><strong>Break Even:</strong> Exit at cost if stock reverses completely</li>
                <li><strong>Aggressive:</strong> Hold for maximum gains, risk more profit</li>
                <li><strong>Moderate:</strong> Balance between profit protection and growth</li>
                <li><strong>Conservative:</strong> Lock in most gains, minimize risk</li>
              </ul>
            </div>
          </div>
        )}
        </div>
      </div>

      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">History</h2>

          {history.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">
              No calculations yet
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs hover:bg-slate-100 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-semibold text-slate-800">
                      {entry.stockName}
                    </div>
                    <button
                      onClick={() => deleteFromHistory(entry.id)}
                      className="text-slate-400 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Profit:</span>
                      <span className="font-semibold text-emerald-600">
                        ${entry.profitAmount.toFixed(2)} ({entry.profitPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Break Even:</span>
                      <span className="font-mono">${entry.breakEven.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aggressive:</span>
                      <span className="font-mono">${entry.aggressive.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moderate:</span>
                      <span className="font-mono">${entry.moderate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conservative:</span>
                      <span className="font-mono">${entry.conservative.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
