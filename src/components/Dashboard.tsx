import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalResolved: 1247,
    successRate: 98.5,
    avgTime: 12.3,
    balance: 2.84,
    activeNow: 1,
    errors: 18,
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'reCAPTCHA v2', status: 'success', time: '2s atrás', duration: '11.2s' },
    { id: 2, type: 'hCaptcha', status: 'success', time: '45s atrás', duration: '14.8s' },
    { id: 3, type: 'reCAPTCHA v3', status: 'success', time: '1m atrás', duration: '8.5s' },
    { id: 4, type: 'FunCaptcha', status: 'error', time: '2m atrás', duration: '30s' },
    { id: 5, type: 'reCAPTCHA v2', status: 'success', time: '3m atrás', duration: '10.1s' },
    { id: 6, type: 'TextCaptcha', status: 'success', time: '5m atrás', duration: '6.3s' },
    { id: 7, type: 'reCAPTCHA v2', status: 'success', time: '6m atrás', duration: '12.7s' },
    { id: 8, type: 'hCaptcha', status: 'success', time: '8m atrás', duration: '15.2s' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalResolved: prev.totalResolved + Math.floor(Math.random() * 2),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon="fa-check-circle"
          label="Captchas Resolvidos"
          value={stats.totalResolved.toLocaleString()}
          color="green"
          subtext="Total acumulado"
        />
        <StatCard
          icon="fa-chart-line"
          label="Taxa de Sucesso"
          value={`${stats.successRate}%`}
          color="blue"
          subtext="Últimas 24h"
        />
        <StatCard
          icon="fa-clock"
          label="Tempo Médio"
          value={`${stats.avgTime}s`}
          color="purple"
          subtext="Por captcha"
        />
        <StatCard
          icon="fa-wallet"
          label="Saldo 2Captcha"
          value={`$${stats.balance.toFixed(2)}`}
          color="yellow"
          subtext="Créditos disponíveis"
        />
        <StatCard
          icon="fa-bolt"
          label="Status"
          value="Ativo"
          color="green"
          subtext="Bot rodando"
        />
        <StatCard
          icon="fa-exclamation-triangle"
          label="Erros"
          value={stats.errors.toString()}
          color="red"
          subtext="Últimas 24h"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i className="fas fa-history text-blue-400"></i>
            Atividade Recente
          </h2>
          <span className="text-xs text-gray-400">Últimas resoluções</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Duração</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Quando</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentActivity.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">{item.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'success'
                        ? 'bg-green-900/30 text-green-400 border border-green-800'
                        : 'bg-red-900/30 text-red-400 border border-red-800'
                    }`}>
                      <i className={`fas ${item.status === 'success' ? 'fa-check' : 'fa-times'}`}></i>
                      {item.status === 'success' ? 'Sucesso' : 'Erro'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{item.duration}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supported Types */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-puzzle-piece text-purple-400"></i>
          Tipos de CAPTCHA Suportados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'reCAPTCHA v2', icon: '🔵' },
            { name: 'reCAPTCHA v3', icon: '🔷' },
            { name: 'hCaptcha', icon: '🟠' },
            { name: 'FunCaptcha', icon: '🟣' },
            { name: 'TextCaptcha', icon: '📝' },
            { name: 'GeeTest', icon: '🟢' },
            { name: 'KeyCaptcha', icon: '🔑' },
            { name: 'Capy Puzzle', icon: '🧩' },
          ].map((type) => (
            <div key={type.name} className="bg-gray-700/50 rounded-lg p-3 text-center border border-gray-600">
              <span className="text-2xl">{type.icon}</span>
              <p className="text-sm text-gray-300 mt-1">{type.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, subtext }: {
  icon: string
  label: string
  value: string
  color: string
  subtext: string
}) {
  const colorClasses: Record<string, string> = {
    green: 'from-green-500/20 to-green-600/5 border-green-800/50 text-green-400',
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-800/50 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-800/50 text-purple-400',
    yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-800/50 text-yellow-400',
    red: 'from-red-500/20 to-red-600/5 border-red-800/50 text-red-400',
  }

  const iconColor: Record<string, string> = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <i className={`fas ${icon} ${iconColor[color]} text-lg`}></i>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtext}</p>
    </div>
  )
}
