import { useEffect, useState } from 'react';
import Console from './components/Console/Console';
import Layout from './components/Layout/Layout';
import Results from './components/Results/Results';
import TestList from './components/TestList/TestList';
import TestRunner from './components/TestRunner/TestRunner';
import { useSocket } from './hooks/useSocket';

function App() {
  const { connected, socket } = useSocket();
  const [selectedTests, setSelectedTests] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testSuites, setTestSuites] = useState([]);
  const [results, setResults] = useState(null);
  const [workerCount, setWorkerCount] = useState(1);

  useEffect(() => {
    // Load test suites on mount
    fetch('/api/tests')
      .then(res => res.json())
      .then(data => setTestSuites(data))
      .catch(err => console.error('Failed to load tests:', err));
  }, []);

  const handleRunTests = (testIds, workers = 1) => {
    if (testIds.length === 0) return;
    
    setSelectedTests(testIds);
    setIsRunning(true);
    setResults(null);
    setWorkerCount(workers);
    
    if (socket) {
      socket.emit('run:tests', { testIds, options: { workers } });
    }
  };

  const handleStop = () => {
    if (socket) {
      socket.emit('stop:tests');
    }
    setIsRunning(false);
  };

  const handleResultsChange = (newResults) => {
    setResults(newResults);
    setIsRunning(false);
  };

  return (
    <Layout connected={connected}>
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Sidebar - Test List */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-[calc(100vh-140px)]">
          <TestList
            testSuites={testSuites}
            onRunTests={handleRunTests}
            isRunning={isRunning}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          {/* Top Row - Runner & Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Runner */}
            <div className="min-h-[320px]">
              <TestRunner
                selectedTests={selectedTests}
                isRunning={isRunning}
                onStop={handleStop}
                socket={socket}
                onResultsChange={handleResultsChange}
                workerCount={workerCount}
              />
            </div>

            {/* Results */}
            <div className="min-h-[320px]">
              <Results results={results} />
            </div>
          </div>

          {/* Bottom Row - Console (Full Width) */}
          <div className="flex-1 min-h-[450px]">
            <Console socket={socket} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
