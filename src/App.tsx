import { useState } from 'react'
import Dashboard from './components/Dashboard'
import PythonCode from './components/PythonCode'
import SetupGuide from './components/SetupGuide'
import Logs from './components/Logs'
import ConfigPanel from './components/ConfigPanel'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'setup', label: 'Instalação', icon: 'fa-download' },
    { id: 'code', label: 'Código Python', icon: 'fa-code' },
    { id: 'config', label: 'Configuração', icon: 'fa-gear' },
    { id: 'logs', label: 'Logs', icon: 'fa-terminal' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">2Captcha Bot</h1>
              <p className="text-xs text-gray-400">Resolvedor Automatizado de CAPTCHA</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-700 rounded-full text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Bot Pronto
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-400 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'setup' && <SetupGuide />}
        {activeTab === 'code' && <PythonCode />}
        {activeTab === 'config' && <ConfigPanel />}
        {activeTab === 'logs' && <Logs />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>2Captcha Bot - Resolvedor Automatizado de CAPTCHA</p>
          <p className="mt-1">Use de forma responsável e de acordo com os termos de serviço do 2captcha</p>
        </div>
      </footer>
    </div>
  )
}

export default App
