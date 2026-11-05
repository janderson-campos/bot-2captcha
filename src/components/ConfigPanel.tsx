import { useState } from 'react'

export default function ConfigPanel() {
  const [config, setConfig] = useState({
    apiKey: '',
    targetUrl: 'https://exemplo.com/login',
    siteKey: '',
    captchaType: 'recaptcha_v2',
    maxRetries: 3,
    timeout: 120,
    browser: 'chrome',
    headless: true,
    logLevel: 'INFO',
    proxyType: '',
    proxyAddress: '',
  })

  const [saved, setSaved] = useState(false)
  const [generatedEnv, setGeneratedEnv] = useState('')

  const handleSave = () => {
    const envContent = `# ============================================
# 2Captcha Bot - Configuração Gerada
# Data: ${new Date().toLocaleString('pt-BR')}
# ============================================

# API Key do 2captcha (obrigatório)
TWOCAPTCHA_API_KEY=${config.apiKey || 'sua_api_key_aqui'}

# URL alvo onde o CAPTCHA está
TARGET_URL=${config.targetUrl}

# Site Key do CAPTCHA
SITE_KEY=${config.siteKey}

# Configurações de Retry
MAX_RETRIES=${config.maxRetries}
TIMEOUT=${config.timeout}
POLLING_INTERVAL=5
SOFT_TIMEOUT=300

# Configurações do Navegador
BROWSER=${config.browser}
HEADLESS=${config.headless}

# Proxy (opcional)
PROXY_TYPE=${config.proxyType}
PROXY_ADDRESS=${config.proxyAddress}

# Logging
LOG_LEVEL=${config.logLevel}`

    setGeneratedEnv(envContent)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const copyEnv = () => {
    navigator.clipboard.writeText(generatedEnv)
  }

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-sliders text-purple-400 text-xl"></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Configuração do Bot</h2>
            <p className="text-gray-300 text-sm">
              Configure os parâmetros do bot e gere o arquivo .env pronto para uso.
              A API Key é obtida em <a href="https://2captcha.com" target="_blank" className="text-purple-400 underline">2captcha.com</a>
            </p>
          </div>
        </div>
      </div>

      {/* Config Form */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <i className="fas fa-key text-yellow-400"></i>
            Credenciais e Target
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              API Key do 2Captcha *
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({...config, apiKey: e.target.value})}
              placeholder="Cole sua API Key aqui..."
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Encontre em: 2captcha.com → Account → Your API Key
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                URL Alvo
              </label>
              <input
                type="url"
                value={config.targetUrl}
                onChange={(e) => setConfig({...config, targetUrl: e.target.value})}
                placeholder="https://exemplo.com"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Site Key do CAPTCHA
              </label>
              <input
                type="text"
                value={config.siteKey}
                onChange={(e) => setConfig({...config, siteKey: e.target.value})}
                placeholder="6Le-wvkSAAAAAPBMRTvw0Q4..."
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo de CAPTCHA
            </label>
            <select
              value={config.captchaType}
              onChange={(e) => setConfig({...config, captchaType: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
            >
              <option value="recaptcha_v2">reCAPTCHA v2</option>
              <option value="recaptcha_v3">reCAPTCHA v3</option>
              <option value="hcaptcha">hCaptcha</option>
              <option value="funcaptcha">FunCaptcha</option>
              <option value="text">TextCaptcha (Imagem)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <i className="fas fa-cog text-blue-400"></i>
            Configurações Avançadas
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Máximo de Retries
              </label>
              <input
                type="number"
                value={config.maxRetries}
                onChange={(e) => setConfig({...config, maxRetries: parseInt(e.target.value)})}
                min={1}
                max={10}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Timeout (segundos)
              </label>
              <input
                type="number"
                value={config.timeout}
                onChange={(e) => setConfig({...config, timeout: parseInt(e.target.value)})}
                min={30}
                max={600}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Navegador
              </label>
              <select
                value={config.browser}
                onChange={(e) => setConfig({...config, browser: e.target.value})}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              >
                <option value="chrome">Chrome</option>
                <option value="firefox">Firefox</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nível de Log
              </label>
              <select
                value={config.logLevel}
                onChange={(e) => setConfig({...config, logLevel: e.target.value})}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              >
                <option value="DEBUG">DEBUG</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.headless}
                onChange={(e) => setConfig({...config, headless: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
            <span className="text-sm text-gray-300">Modo Headless (navegador invisível)</span>
          </div>

          {/* Proxy */}
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Proxy (Opcional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                <select
                  value={config.proxyType}
                  onChange={(e) => setConfig({...config, proxyType: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500"
                >
                  <option value="">Sem proxy</option>
                  <option value="HTTP">HTTP</option>
                  <option value="HTTPS">HTTPS</option>
                  <option value="SOCKS5">SOCKS5</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Endereço</label>
                <input
                  type="text"
                  value={config.proxyAddress}
                  onChange={(e) => setConfig({...config, proxyAddress: e.target.value})}
                  placeholder="user:pass@ip:port"
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 rounded-xl text-white font-semibold shadow-lg shadow-green-600/20 transition-all"
        >
          <i className={`fas ${saved ? 'fa-check' : 'fa-wand-magic-sparkles'}`}></i>
          {saved ? 'Configuração Gerada!' : 'Gerar Arquivo .env'}
        </button>
      </div>

      {/* Generated .env */}
      {generatedEnv && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <i className="fas fa-file-code text-green-400"></i>
              Arquivo .env Gerado
            </h3>
            <button
              onClick={copyEnv}
              className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
            >
              <i className="fas fa-copy"></i>
              Copiar
            </button>
          </div>
          <div className="p-4">
            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-green-300 border border-gray-700">
              <code>{generatedEnv}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
