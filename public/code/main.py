#!/usr/bin/env python3
"""
2Captcha Bot - Resolvedor Automatizado de CAPTCHA
Versão: 2.0.0
"""

import os
import sys
import time
import logging
import argparse
from datetime import datetime
from dotenv import load_dotenv

from config import Config
from captcha_solver import CaptchaSolver

# Carregar variáveis de ambiente
load_dotenv()

# Configurar logging
logging.basicConfig(
    level=getattr(logging, Config.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(
            os.path.join('logs', f'bot_{datetime.now().strftime("%Y%m%d")}.log'),
            encoding='utf-8'
        )
    ]
)

logger = logging.getLogger('CaptchaBot')


def create_directories():
    """Cria diretórios necessários se não existirem."""
    dirs = ['logs', 'screenshots']
    for directory in dirs:
        os.makedirs(directory, exist_ok=True)


def run_single_solve(solver: CaptchaSolver, captcha_type: str, site_key: str, url: str):
    """Resolve um único captcha."""
    logger.info(f"Iniciando resolução de {captcha_type}...")
    logger.info(f"Site Key: {site_key[:20]}...")
    logger.info(f"URL: {url}")
    
    try:
        start_time = time.time()
        result = solver.solve(captcha_type, site_key, url)
        elapsed = time.time() - start_time
        
        if result:
            logger.info(f"✅ CAPTCHA resolvido com sucesso em {elapsed:.1f}s")
            logger.info(f"Token: {result[:50]}...")
            return result
        else:
            logger.error("❌ Falha ao resolver CAPTCHA")
            return None
            
    except Exception as e:
        logger.error(f"❌ Erro ao resolver CAPTCHA: {str(e)}")
        return None


def run_loop(solver: CaptchaSolver, captcha_type: str, site_key: str, url: str, interval: int):
    """Executa o bot em loop contínuo."""
    logger.info(f"🔄 Iniciando modo loop (intervalo: {interval}s)")
    
    stats = {
        'total': 0,
        'success': 0,
        'errors': 0,
        'start_time': datetime.now()
    }
    
    try:
        while True:
            stats['total'] += 1
            logger.info(f"\n{'='*50}")
            logger.info(f"Tentativa #{stats['total']}")
            logger.info(f"{'='*50}")
            
            result = run_single_solve(solver, captcha_type, site_key, url)
            
            if result:
                stats['success'] += 1
            else:
                stats['errors'] += 1
            
            # Mostrar estatísticas
            success_rate = (stats['success'] / stats['total']) * 100 if stats['total'] > 0 else 0
            logger.info(f"\n📊 Estatísticas:")
            logger.info(f"   Total: {stats['total']}")
            logger.info(f"   Sucessos: {stats['success']}")
            logger.info(f"   Erros: {stats['errors']}")
            logger.info(f"   Taxa de sucesso: {success_rate:.1f}%")
            
            # Aguardar intervalo
            logger.info(f"\n⏳ Aguardando {interval}s para próxima tentativa...")
            time.sleep(interval)
            
    except KeyboardInterrupt:
        logger.info("\n\n🛑 Bot interrompido pelo usuário")
        logger.info(f"Estatísticas finais: {stats}")


def main():
    """Função principal do bot."""
    parser = argparse.ArgumentParser(description='2Captcha Bot - Resolvedor Automatizado')
    parser.add_argument('--type', default='recaptcha_v2', 
                       choices=['recaptcha_v2', 'recaptcha_v3', 'hcaptcha', 'funcaptcha', 'text'],
                       help='Tipo de CAPTCHA a resolver')
    parser.add_argument('--sitekey', default=None, help='Site Key do CAPTCHA')
    parser.add_argument('--url', default=None, help='URL da página com o CAPTCHA')
    parser.add_argument('--loop', action='store_true', help='Executar em loop contínuo')
    parser.add_argument('--interval', type=int, default=30, help='Intervalo entre resoluções (segundos)')
    parser.add_argument('--verbose', action='store_true', help='Ativar log detalhado')
    
    args = parser.parse_args()
    
    # Criar diretórios
    create_directories()
    
    # Banner
    print("""
╔══════════════════════════════════════════════╗
║         🤖 2CAPTCHA BOT v2.0.0              ║
║    Resolvedor Automatizado de CAPTCHA        ║
╚══════════════════════════════════════════════╝
    """)
    
    # Inicializar solver
    try:
        solver = CaptchaSolver()
        logger.info("✅ Solver inicializado com sucesso")
    except Exception as e:
        logger.error(f"❌ Erro ao inicializar solver: {str(e)}")
        logger.error("Verifique sua API Key no arquivo .env")
        sys.exit(1)
    
    # Verificar saldo
    try:
        balance = solver.get_balance()
        logger.info(f"💰 Saldo atual: ${balance:.4f}")
        
        if balance <= 0:
            logger.error("❌ Saldo insuficiente! Recarregue sua conta no 2captcha.com")
            sys.exit(1)
    except Exception as e:
        logger.warning(f"⚠️ Não foi possível verificar saldo: {str(e)}")
    
    # Obter parâmetros
    captcha_type = args.type
    site_key = args.sitekey or Config.SITE_KEY
    url = args.url or Config.TARGET_URL
    
    if not site_key or not url:
        logger.error("❌ Site Key e URL são obrigatórios!")
        logger.error("Use --sitekey e --url ou configure no arquivo .env")
        sys.exit(1)
    
    # Executar
    if args.loop:
        run_loop(solver, captcha_type, site_key, url, args.interval)
    else:
        run_single_solve(solver, captcha_type, site_key, url)
    
    logger.info("\n✅ Operação concluída!")


if __name__ == '__main__':
    main()
