import { useState, useEffect, useRef } from 'react'

interface LogEntry {
  id: number
  timestamp: string
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  message: string
}

const sampleLogs: LogEntry[] = [
  { id: 1, timestamp: '2024-01-15 10:00:01', level: 'INFO', message: '🤖 2CAPTCHA BOT v2.0.0 iniciado' },
  { id: 2, timestamp: '2024-01-15 10:00:01', level: 'INFO', message: '✅ Solver inicializado com sucesso' },
  { id: 3, timestamp: '2024-01-15 10:00:02', level: 'INFO', message: '💰 Saldo atual: $2.8400' },
  { id: 4, timestamp: '2024-01-15 10:00:02', level: 'INFO', message: '🔵 Resolvendo reCAPTCHA v2...' },
  { id: 5, timestamp: '2024-01-15 10:00:03', level: 'INFO', message: 'Enviando captcha para resolução...' },
  { id: 6, timestamp: '2024-01-15 10:00:08', level: 'INFO', message: 'Aguardando resolução (5s)...' },
  { id: 7, timestamp: '2024-01-15 10:00:13', level: 'SUCCESS', message: '✅ Resolvido em 11.2s | Tipo: recaptcha_v2' },
  { id: 8, timestamp: '2024-01-15 10:00:13', level: 'INFO', message: '✅ CAPTCHA resolvido com sucesso em 11.2s' },
  { id: 9, timestamp: '2024-01-15 10:00:14', level: 'INFO', message: '📊 Estatísticas: Total: 1 | Sucessos: 1 | Taxa: 100%' },
  { id: 10, timestamp: '2024-01-15 10:00:44', level: 'INFO', message: '🟠 Resolvendo hCaptcha...' },
  { id: 11, timestamp: '2024-01-15 10:00:59', level: 'SUCCESS', message: '✅ Resolvido em 14.8s | Tipo: hcaptcha' },
  { id: 12, timestamp: '2024-01-15 10:01:30', level: 'INFO', message: '🔷 Resolvendo reCAPTCHA v3...' },
  { id: 13, timestamp: '2024-01-15 10:01:38', level: 'SUCCESS', message: '✅ Resolvido em 8.5s | Tipo: recaptcha_v3' },
  { id: 14, timestamp: '2024-01-15 10:02:10', level: 'INFO', message: '🟣 Resolvendo FunCaptcha...' },
  { id: 15, timestamp: '2024-01-15 10:02:40', level: 'ERROR', message: '❌ Erro ao resolver funcaptcha: TIMEOUT_EXCEEDED' },
  { id: 16, timestamp: '2024-01-15 10:02:40', level: 'WARNING', message: '🔄 Tentando novamente... (2 tentativas restantes)' },
  { id: 17, timestamp: '2024-01-15 10:02:42', level: 'INFO', message: '🟣 Resolvendo FunCaptcha...' },
  { id: 18, timestamp: '2024-01-15 10:02:55', level: 'SUCCESS', message: '✅ Resolvido em 13.1s | Tipo: funcaptcha' },
  { id: 19, timestamp: '2024-01-15 10:03:25', level: 'INFO', message: '🔵 Resolvendo reCAPTCHA v2...' },
  { id: 20, timestamp: '2024-01-15 10:03:35', level: 'SUCCESS', message: '✅ Resolvido em 10.1s | Tipo: recaptcha_v2' },
]

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>(sampleLogs)
  const [autoScroll, setAutoScroll] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  // Simular novos logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLogTypes = [
        { level: 'INFO' as const, message: '🔵 Resolvendo reCAPTCHA v2...' },
        { level: 'SUCCESS' as const, message: `✅ Resolvido em ${(Math.random() * 15 + 5).toFixed(1)}s` },
        { level: 'INFO' as const, message: '📊 Verificando saldo...' },
        { level: 'INFO' as const, message: '💰 Saldo: $' + (Math.random() * 3 + 1).toFixed(4) },
      ]
      const randomLog = newLogTypes[Math.floor(Math.random() * newLogTypes.length)]
      const now = new Date()
      const timestamp = now.toISOString().replace('T', ' ').substring(0, 19)
      
      setLogs(prev => [...prev, {
        id: prev.length + 1,
        timestamp,
        ...randomLog
      }])
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-blue-400'
      case 'SUCCESS': return 'text-green-400'
      case 'WARNING': return 'text-yellow-400'
      case 'ERROR': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'INFO': return 'bg-blue-900/20'
      case 'SUCCESS': return 'bg-green-900/20'
      case 'WARNING': return 'bg-yellow-900/20'
      case 'ERROR': return 'bg-red-900/20'
      default: return 'bg-gray-900/20'
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <i className="fas fa-terminal text-green-400"></i>
            <h2 className="font-semibold text-white">Logs do Bot</h2>
            <span className="text-xs text-gray-400">({filteredLogs.length} entradas)</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-green-500"
            >
              <option value="all">Todos</option>
              <option value="INFO">Info</option>
              <option value="SUCCESS">Sucesso</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Erro</option>
            </select>

            {/* Auto-scroll toggle */}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                autoScroll ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              <i className="fas fa-arrow-down"></i>
              Auto-scroll
            </button>

            {/* Clear logs */}
            <button
              onClick={() => setLogs([])}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 border border-red-700 rounded-lg text-sm text-red-400 hover:bg-red-600/30 transition-colors"
            >
              <i className="fas fa-trash"></i>
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Log Output */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-xs text-gray-400 ml-2 font-mono">bot_output.log</span>
        </div>
        <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-sm">
          {filteredLogs.map((log) => (
            <div key={log.id} className={`py-1 px-2 rounded ${getLevelBg(log.level)} mb-0.5`}>
              <span className="text-gray-500">[{log.timestamp}]</span>
              {' '}
              <span className={`font-bold ${getLevelColor(log.level)}`}>
                [{log.level}]
              </span>
              {' '}
              <span className="text-gray-300">{log.message}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Log Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{logs.filter(l => l.level === 'INFO').length}</p>
          <p className="text-xs text-gray-400">Info</p>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{logs.filter(l => l.level === 'SUCCESS').length}</p>
          <p className="text-xs text-gray-400">Sucesso</p>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{logs.filter(l => l.level === 'WARNING').length}</p>
          <p className="text-xs text-gray-400">Warnings</p>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{logs.filter(l => l.level === 'ERROR').length}</p>
          <p className="text-xs text-gray-400">Erros</p>
        </div>
      </div>
    </div>
  )
}
