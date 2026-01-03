import { Wifi, WifiOff } from 'lucide-react';

export default function Layout({ children, connected }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="glass-dark border-b border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                WebTest Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {connected ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm">Disconnected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 h-[calc(100vh-80px)]">
        {children}
      </main>
    </div>
  );
}

