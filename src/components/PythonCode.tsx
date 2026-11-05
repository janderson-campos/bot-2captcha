import { useState, useEffect } from 'react'

interface FileData {
  name: string
  description: string
  code: string
  path: string
}

export default function PythonCode() {
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const [activeFile, setActiveFile] = useState('main')
  const [files, setFiles] = useState<Record<string, FileData>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFiles = async () => {
      const fileList: Record<string, { name: string; description: string; path: string }> = {
        main: { name: 'main.py', description: 'Arquivo principal - ponto de entrada do bot', path: '/code/main.py' },
        captcha_solver: { name: 'captcha_solver.py', description: 'Módulo principal de resolução de captchas', path: '/code/captcha_solver.py' },
        config: { name: 'config.py', description: 'Módulo de configuração do bot', path: '/code/config.py' },
        selenium_bot: { name: 'selenium_bot.py', description: 'Bot com Selenium para automação completa', path: '/code/selenium_bot.py' },
        env_example: { name: '.env.example', description: 'Template do arquivo de configuração', path: '/code/.env.example' },
      }

      const loaded: Record<string, FileData> = {}
      for (const [key, meta] of Object.entries(fileList)) {
        try {
          const response = await fetch(meta.path)
          const code = await response.text()
          loaded[key] = { ...meta, code }
        } catch {
          loaded[key] = { ...meta, code: '// Erro ao carregar arquivo' }
        }
      }
      setFiles(loaded)
      setLoading(false)
    }
    loadFiles()
  }, [])

  const copyToClipboard = (text: string, file: string) => {
    navigator.clipboard.writeText(text)
    setCopiedFile(file)
    setTimeout(() => setCopiedFile(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-green-400 mb-4"></i>
          <p className="text-gray-400">Carregando código Python...</p>
        </div>
      </div>
    )
  }

  const fileList = Object.entries(files)

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-code text-green-400 text-xl"></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Código Python Completo</h2>
            <p className="text-gray-300 text-sm">
              Copie cada arquivo para seu projeto. O bot suporta reCAPTCHA v2/v3, hCaptcha, FunCaptcha e TextCaptcha.
              Inclui modo loop, retry automático, detecção de site key e integração com Selenium.
            </p>
          </div>
        </div>
      </div>

      {/* File Tabs */}
      <div className="flex flex-wrap gap-2">
        {fileList.map(([key, file]) => (
          <button
            key={key}
            onClick={() => setActiveFile(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFile === key
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <i className="fas fa-file-code mr-2"></i>
            {file.name}
          </button>
        ))}
      </div>

      {/* Active File */}
      {files[activeFile] && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <i className="fas fa-file-code text-green-400"></i>
                {files[activeFile].name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{files[activeFile].description}</p>
            </div>
            <button
              onClick={() => copyToClipboard(files[activeFile].code, activeFile)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-white transition-colors"
            >
              <i className={`fas ${copiedFile === activeFile ? 'fa-check' : 'fa-copy'}`}></i>
              {copiedFile === activeFile ? 'Copiado!' : 'Copiar Código'}
            </button>
          </div>
          <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
            <pre className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              <code>{files[activeFile].code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Quick Copy All */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <i className="fas fa-layer-group text-blue-400"></i>
          Copiar Todos os Arquivos
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Copie todos os arquivos de uma vez para criar o projeto completo.
        </p>
        <button
          onClick={() => {
            const allCode = Object.entries(files)
              .map(([_, file]) => `# ===== ${file.name} =====\n${file.code}`)
              .join('\n\n')
            copyToClipboard(allCode, 'all')
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition-colors"
        >
          <i className={`fas ${copiedFile === 'all' ? 'fa-check' : 'fa-copy'}`}></i>
          {copiedFile === 'all' ? 'Todos Copiados!' : 'Copiar Todos os Arquivos'}
        </button>
      </div>
    </div>
  )
}
