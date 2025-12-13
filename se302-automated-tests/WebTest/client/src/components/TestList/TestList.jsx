import { useState } from 'react';
import { Play, ChevronDown, ChevronRight, FileText, CheckSquare, Square, Users } from 'lucide-react';

export default function TestList({ testSuites, onRunTests, isRunning }) {
  const [expandedSuites, setExpandedSuites] = useState({});
  const [selectedTests, setSelectedTests] = useState(new Set());
  const [workerCount, setWorkerCount] = useState(1);

  const toggleSuite = (suiteId) => {
    setExpandedSuites(prev => ({
      ...prev,
      [suiteId]: !prev[suiteId]
    }));
  };

  const toggleTest = (testId) => {
    setSelectedTests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testId)) {
        newSet.delete(testId);
      } else {
        newSet.add(testId);
      }
      return newSet;
    });
  };

  const toggleAllInSuite = (suite, checked) => {
    setSelectedTests(prev => {
      const newSet = new Set(prev);
      suite.testCases.forEach(test => {
        if (checked) {
          newSet.add(`${suite.id}-${test.id}`);
        } else {
          newSet.delete(`${suite.id}-${test.id}`);
        }
      });
      return newSet;
    });
  };

  const handleRun = () => {
    const testIds = Array.from(selectedTests);
    onRunTests(testIds, workerCount);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'functional':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'smoke':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex flex-col gap-3 mb-4">
        <h2 className="text-xl font-bold">Test Suites</h2>
        
        {/* Controls Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Worker Selection */}
          <div className="flex items-center gap-2 bg-gray-700/30 rounded-lg px-3 py-2 border border-gray-600/30">
            <Users className="w-4 h-4 text-primary-400" />
            <label className="text-sm text-gray-300 font-medium" htmlFor="workers">
              Workers:
            </label>
            <select
              id="workers"
              value={workerCount}
              onChange={(e) => setWorkerCount(parseInt(e.target.value))}
              className="worker-select"
              disabled={isRunning}
              title="Number of parallel workers (1-5)"
            >
              <option value={1}>1 (Sequential)</option>
              <option value={2}>2 (Fast)</option>
              <option value={3}>3 (Faster)</option>
              <option value={4}>4 (Very Fast)</option>
              <option value={5}>5 (Maximum)</option>
            </select>
          </div>
          
          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={selectedTests.size === 0 || isRunning}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
          >
            <Play className="w-4 h-4" />
            Run ({selectedTests.size})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {testSuites.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No test suites found</p>
          </div>
        ) : (
          testSuites.map(suite => {
            const isExpanded = expandedSuites[suite.id];
            const suiteTests = suite.testCases.map(t => `${suite.id}-${t.id}`);
            const allSelected = suiteTests.every(id => selectedTests.has(id));
            const someSelected = suiteTests.some(id => selectedTests.has(id));

            return (
              <div key={suite.id} className="border border-gray-700/50 rounded-lg overflow-hidden">
                {/* Suite Header */}
                <div
                  className="p-3 bg-gray-800/50 hover:bg-gray-800/70 cursor-pointer flex items-center justify-between"
                  onClick={() => toggleSuite(suite.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-sm">{suite.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs border ${getCategoryColor(suite.category)}`}>
                      {suite.category}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{suite.testCases.length} tests</span>
                </div>

                {/* Suite Tests */}
                {isExpanded && (
                  <div className="bg-gray-900/50">
                    {/* Select All */}
                    <div className="px-3 py-2 border-b border-gray-700/30">
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={input => {
                            if (input) input.indeterminate = someSelected && !allSelected;
                          }}
                          onChange={(e) => toggleAllInSuite(suite, e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-gray-300">Select All</span>
                      </label>
                    </div>

                    {/* Test Cases */}
                    {suite.testCases.map(test => {
                      const testId = `${suite.id}-${test.id}`;
                      const isSelected = selectedTests.has(testId);

                      return (
                        <div
                          key={test.id}
                          className="px-3 py-2 hover:bg-gray-800/30 flex items-center gap-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTest(testId);
                          }}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary-400" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-500" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-200">{test.name}</div>
                            {test.description && (
                              <div className="text-xs text-gray-500 truncate">{test.description}</div>
                            )}
                          </div>
                          {test.skipped && (
                            <span className="text-xs text-yellow-400">Skipped</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

