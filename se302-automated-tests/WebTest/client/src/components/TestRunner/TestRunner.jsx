import { CheckCircle2, Clock, Loader2, Play, Square, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TestRunner({ selectedTests, isRunning, onStop, socket, onResultsChange, workerCount: initialWorkerCount }) {
  const [testStatuses, setTestStatuses] = useState({});
  const [progress, setProgress] = useState({ total: 0, completed: 0, passed: 0, failed: 0 });
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workers, setWorkers] = useState(initialWorkerCount || 1);

  // Update workers from parent
  useEffect(() => {
    if (initialWorkerCount) {
      setWorkers(initialWorkerCount);
    }
  }, [initialWorkerCount]);

  useEffect(() => {
    if (!socket) return;

    const handleTestStarted = (data) => {
      setStartTime(new Date());
      setElapsedTime(0);
      setProgress({ total: selectedTests.length, completed: 0, passed: 0, failed: 0 });
      setTestStatuses({});
    };

    const handleTestProgress = (data) => {
      setProgress(prev => ({ ...prev, total: data.total || prev.total }));
    };

    const handleTestPassed = (data) => {
      setTestStatuses(prev => ({
        ...prev,
        [data.test]: { status: 'passed', timestamp: new Date() }
      }));
      setProgress(prev => ({
        ...prev,
        completed: prev.completed + 1,
        passed: prev.passed + 1
      }));
    };

    const handleTestFailed = (data) => {
      setTestStatuses(prev => ({
        ...prev,
        [data.test]: { status: 'failed', timestamp: new Date() }
      }));
      setProgress(prev => ({
        ...prev,
        completed: prev.completed + 1,
        failed: prev.failed + 1
      }));
    };

    const handleTestCompleted = (data) => {
      setProgress(prev => ({ ...prev, completed: prev.total }));
      onResultsChange(data.results);
    };

    socket.on('test:started', handleTestStarted);
    socket.on('test:progress', handleTestProgress);
    socket.on('test:passed', handleTestPassed);
    socket.on('test:failed', handleTestFailed);
    socket.on('test:completed', handleTestCompleted);

    return () => {
      socket.off('test:started', handleTestStarted);
      socket.off('test:progress', handleTestProgress);
      socket.off('test:passed', handleTestPassed);
      socket.off('test:failed', handleTestFailed);
      socket.off('test:completed', handleTestCompleted);
    };
  }, [socket, selectedTests, onResultsChange]);

  useEffect(() => {
    let interval;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = progress.total > 0 
    ? (progress.completed / progress.total) * 100 
    : 0;

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Test Execution</h2>
        <div className="flex items-center gap-4">
          {/* Worker Selection */}
          {!isRunning && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <label className="text-sm text-gray-400" htmlFor="workers">
                Workers:
              </label>
              <select
                id="workers"
                value={workers}
                onChange={(e) => setWorkers(parseInt(e.target.value))}
                className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isRunning}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          )}
          
          {isRunning && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>{workers} worker{workers > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {formatTime(elapsedTime)}
              </div>
              <button
                onClick={onStop}
                className="btn-secondary flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">
              Progress: {progress.completed} / {progress.total}
            </span>
            <div className="flex gap-4">
              <span className="text-green-400">✓ {progress.passed}</span>
              <span className="text-red-400">✗ {progress.failed}</span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Test Status List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {selectedTests.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select tests to run</p>
          </div>
        ) : (
          selectedTests.map(testId => {
            const status = testStatuses[testId];
            const testName = testId.split('-').slice(1).join('-');

            return (
              <div
                key={testId}
                className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 flex items-center gap-3"
              >
                {!status && isRunning && (
                  <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
                )}
                {status?.status === 'passed' && (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                )}
                {status?.status === 'failed' && (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                {!isRunning && !status && (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-200 truncate">{testName}</div>
                  {status?.timestamp && (
                    <div className="text-xs text-gray-500">
                      {status.timestamp.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

