import { CheckCircle2, XCircle, MinusCircle, BarChart3 } from 'lucide-react';

export default function Results({ results }) {
  if (!results) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No results yet</p>
          <p className="text-sm mt-1">Run tests to see results</p>
        </div>
      </div>
    );
  }

  const total = results.passed + results.failed + results.skipped;
  const passRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary-400" />
        <h2 className="text-xl font-semibold">Results</h2>
      </div>

      <div className="flex-1 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Passed</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{results.passed}</div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-400">Failed</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{results.failed}</div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <MinusCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Skipped</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{results.skipped}</div>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Pass Rate</span>
            <span className="text-lg font-semibold">{passRate}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
              style={{ width: `${passRate}%` }}
            />
          </div>
        </div>

        {/* Total Tests */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Total Tests</div>
          <div className="text-3xl font-bold">{total}</div>
        </div>
      </div>
    </div>
  );
}

