import { TrendingUp } from 'lucide-react';
import StopLossCalculator from './components/StopLossCalculator';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-emerald-600" />
            <h1 className="text-4xl font-bold text-slate-800">
              Stop Loss Calculator
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Calculate optimal stop loss levels for your stock positions
          </p>
        </header>

        <StopLossCalculator />
      </div>
    </div>
  );
}

export default App;
