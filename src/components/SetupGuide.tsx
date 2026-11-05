import { useState } from 'react'

export default function SetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const steps = [
    {
      title: '1. Instalar Python 3.8+',
      description: 'Baixe e instale o Python mais recente do site oficial.',
      code: '# Verificar versão do Python\npython --version\n\n# Ou no Windows:\npython3 --version',
      link: 'https://python.org/downloads',
    },
    {
      title: '2. Criar ambiente virtual',
      description: 'Crie um ambiente virtual isolado para o projeto.',
      code: '# Criar ambiente virtual\npython -m venv captcha_bot_env\n\n# Ativar no Windows:\ncaptcha_bot_env\\Scripts\\activate\n\n# Ativar no Linux/Mac:\nsource captcha_bot_env/bin/activate',
    },
    {
      title: '3. Instalar dependências',
      description: 'Instale os pacotes necessários para o bot funcionar.',
      code: 'pip install requests twocaptcha-python selenium webdriver-manager python-dotenv schedule',
    },
    {
      title: '4. Criar arquivo .env',
      description: 'Configure suas credenciais do 2captcha.',
      code: '# Arquivo .env\nTWOCAPTCHA_API_KEY=sua_api_key_aqui\nTARGET_URL=https://exemplo.com\nMAX_RETRIES=3\nTIMEOUT=120\nLOG_LEVEL=INFO',
    },
    {
      title: '5. Criar estrutura de pastas',
      description: 'Organize os arquivos do projeto.',
      code: 'captcha_bot/\n├── .env\n├── main.py\n├── captcha_solver.py\n├── config.py\n├── requirements.txt\n├── logs/\n│   └── bot.log\n└── screenshots/\n    └── (capturas de erro)',
    },
    {
      title: '6. Executar o bot',
      description: 'Inicie o bot resolvedor de captcha.',
      code: '# Executar o bot\npython main.py\n\n# Ou com log detalhado:\npython main.py --verbose\n\n# Executar em loop contínuo:\npython main.py --loop --interval 5',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-rocket text-blue-400 text-xl"></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Guia de Instalação Rápida</h2>
            <p className="text-gray-300 text-sm">
              Siga os passos abaixo para configurar e executar o bot resolvedor de captcha.
              Certifique-se de ter uma conta ativa no <a href="https://2captcha.com" target="_blank" className="text-blue-400 underline">2captcha.com</a> com créditos disponíveis.
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-list-check text-yellow-400"></i>
          Pré-requisitos
        </h3>
        <ul className="space-y-2">
          {[
            'Conta ativa no 2captcha.com com créditos',
            'Python 3.8 ou superior instalado',
            'pip (gerenciador de pacotes Python)',
            'Navegador Chrome ou Firefox (para Selenium)',
            'Conexão com internet estável',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
              <i className="fas fa-check-circle text-green-400"></i>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="w-7 h-7 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-sm font-bold">
                  {index + 1}
                </span>
                {step.title}
              </h3>
              <button
                onClick={() => copyToClipboard(step.code, index)}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
              >
                <i className={`fas ${copiedStep === index ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
                {copiedStep === index ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-400 text-sm mb-3">{step.description}</p>
              <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-green-300 border border-gray-700">
                <code>{step.code}</code>
              </pre>
              {step.link && (
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-blue-400 hover:text-blue-300"
                >
                  <i className="fas fa-external-link-alt"></i>
                  Link externo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Requirements.txt */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <i className="fas fa-file-code text-orange-400"></i>
            requirements.txt
          </h3>
          <button
            onClick={() => copyToClipboard(
              'requests>=2.31.0\ntwocaptcha-python>=1.2.0\nselenium>=4.15.0\nwebdriver-manager>=4.0.1\npython-dotenv>=1.0.0\nschedule>=1.2.0\nPillow>=10.0.0',
              99
            )}
            className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
          >
            <i className={`fas ${copiedStep === 99 ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
            {copiedStep === 99 ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
        <div className="p-6">
          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-green-300 border border-gray-700">
            <code>{`requests>=2.31.0
twocaptcha-python>=1.2.0
selenium>=4.15.0
webdriver-manager>=4.0.1
python-dotenv>=1.0.0
schedule>=1.2.0
Pillow>=10.0.0`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
