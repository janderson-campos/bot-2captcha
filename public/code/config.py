"""
Configurações do 2Captcha Bot
Carrega variáveis de ambiente do arquivo .env
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Classe de configuração centralizada."""
    
    # 2Captcha API
    API_KEY: str = os.getenv('TWOCAPTCHA_API_KEY', '')
    
    # Target
    TARGET_URL: str = os.getenv('TARGET_URL', '')
    SITE_KEY: str = os.getenv('SITE_KEY', '')
    
    # Retry settings
    MAX_RETRIES: int = int(os.getenv('MAX_RETRIES', '3'))
    TIMEOUT: int = int(os.getenv('TIMEOUT', '120'))
    POLLING_INTERVAL: int = int(os.getenv('POLLING_INTERVAL', '5'))
    
    # Logging
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    
    # Selenium
    HEADLESS: bool = os.getenv('HEADLESS', 'true').lower() == 'true'
    BROWSER: str = os.getenv('BROWSER', 'chrome')
    
    # Proxy (opcional)
    PROXY_TYPE: str = os.getenv('PROXY_TYPE', '')
    PROXY_ADDRESS: str = os.getenv('PROXY_ADDRESS', '')
    
    # Callbacks
    CALLBACK_URL: str = os.getenv('CALLBACK_URL', '')
    
    # Soft timeout (cancelar se demorar muito)
    SOFT_TIMEOUT: int = int(os.getenv('SOFT_TIMEOUT', '300'))
    
    @classmethod
    def validate(cls) -> bool:
        """Valida se as configurações mínimas estão presentes."""
        if not cls.API_KEY:
            raise ValueError("TWOCAPTCHA_API_KEY não configurada no .env!")
        return True
    
    @classmethod
    def display(cls) -> str:
        """Retorna string com as configurações atuais."""
        masked_key = f"{cls.API_KEY[:8]}..." if cls.API_KEY else "NÃO CONFIGURADA"
        return (
            "╔══════════════════════════════════════╗\n"
            "║       Configurações Atuais           ║\n"
            "╠══════════════════════════════════════╣\n"
            f"║ API Key: {masked_key:<27}║\n"
            f"║ Target URL: {cls.TARGET_URL[:24]:<24}║\n"
            f"║ Max Retries: {cls.MAX_RETRIES:<25}║\n"
            f"║ Timeout: {cls.TIMEOUT:<29}║\n"
            f"║ Browser: {cls.BROWSER:<29}║\n"
            f"║ Headless: {str(cls.HEADLESS):<28}║\n"
            f"║ Log Level: {cls.LOG_LEVEL:<27}║\n"
            "╚══════════════════════════════════════╝\n"
        )
