"""
Bot com Selenium - Automação completa com navegador
Resolve CAPTCHAs automaticamente em páginas web
"""

import os
import time
import logging
from datetime import datetime
from typing import Optional

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager

from config import Config
from captcha_solver import CaptchaSolver

logger = logging.getLogger('SeleniumBot')


class SeleniumCaptchaBot:
    """Bot que usa Selenium para navegar e resolver CAPTCHAs automaticamente."""
    
    def __init__(self):
        """Inicializa o bot com navegador e solver."""
        self.solver = CaptchaSolver()
        self.driver = None
        self._setup_browser()
    
    def _setup_browser(self):
        """Configura o navegador."""
        if Config.BROWSER == 'chrome':
            options = ChromeOptions()
            if Config.HEADLESS:
                options.add_argument('--headless')
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-blink-features=AutomationControlled')
            options.add_experimental_option('excludeSwitches', ['enable-automation'])
            options.add_experimental_option('useAutomationExtension', False)
            
            # User-Agent para evitar detecção
            options.add_argument(
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            )
            
            service = ChromeService(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=options)
            
        elif Config.BROWSER == 'firefox':
            options = FirefoxOptions()
            if Config.HEADLESS:
                options.add_argument('--headless')
            
            service = FirefoxService(GeckoDriverManager().install())
            self.driver = webdriver.Firefox(service=service, options=options)
        
        # Configurar timeouts
        self.driver.set_page_load_timeout(30)
        self.driver.implicitly_wait(10)
        
        logger.info(f"✅ Navegador {Config.BROWSER} inicializado (headless={Config.HEADLESS})")
    
    def navigate_and_solve(self, url: str, captcha_type: str = 'recaptcha_v2') -> Optional[str]:
        """
        Navega até a URL e resolve o CAPTCHA encontrado.
        
        Args:
            url: URL da página
            captcha_type: Tipo do CAPTCHA
            
        Returns:
            Token do CAPTCHA ou None
        """
        try:
            logger.info(f"🌐 Navegando para: {url}")
            self.driver.get(url)
            
            # Aguardar página carregar
            time.sleep(3)
            
            # Detectar site key automaticamente
            site_key = self._detect_site_key(captcha_type)
            
            if not site_key:
                logger.error("❌ Não foi possível detectar a Site Key do CAPTCHA")
                self._save_screenshot('error_no_sitekey')
                return None
            
            logger.info(f"🔑 Site Key detectada: {site_key}")
            
            # Resolver CAPTCHA
            token = self.solver.solve(captcha_type, site_key, url)
            
            if token:
                # Injetar token na página
                self._inject_token(token, captcha_type)
                logger.info("✅ Token injetado na página com sucesso")
                
                # Salvar screenshot de sucesso
                self._save_screenshot('success')
                return token
            else:
                self._save_screenshot('error_solve_failed')
                return None
                
        except Exception as e:
            logger.error(f"❌ Erro: {str(e)}")
            self._save_screenshot('error_exception')
            return None
    
    def _detect_site_key(self, captcha_type: str) -> Optional[str]:
        """Detecta automaticamente a site key do CAPTCHA na página."""
        try:
            if captcha_type in ['recaptcha_v2', 'recaptcha_v3']:
                # Procurar no iframe do reCAPTCHA
                elements = self.driver.find_elements(
                    By.CSS_SELECTOR, 
                    '[data-sitekey], .g-recaptcha[data-sitekey]'
                )
                if elements:
                    return elements[0].get_attribute('data-sitekey')
                
                # Procurar em iframes
                iframes = self.driver.find_elements(
                    By.CSS_SELECTOR,
                    'iframe[src*="recaptcha"]'
                )
                for iframe in iframes:
                    src = iframe.get_attribute('src')
                    if 'k=' in src:
                        return src.split('k=')[1].split('&')[0]
                        
            elif captcha_type == 'hcaptcha':
                elements = self.driver.find_elements(
                    By.CSS_SELECTOR,
                    '[data-sitekey].h-captcha'
                )
                if elements:
                    return elements[0].get_attribute('data-sitekey')
            
            return None
            
        except Exception as e:
            logger.error(f"Erro ao detectar site key: {str(e)}")
            return None
    
    def _inject_token(self, token: str, captcha_type: str):
        """Injeta o token do CAPTCHA na página."""
        try:
            self.driver.execute_script(f"""
                // Preencher o textarea do g-recaptcha-response
                var textareas = document.querySelectorAll(
                    '[name="g-recaptcha-response"], [id="g-recaptcha-response"]'
                );
                textareas.forEach(function(ta) {{
                    ta.style.display = 'block';
                    ta.value = '{token}';
                }});
                
                // Para hCaptcha
                var hTextareas = document.querySelectorAll(
                    '[name="h-captcha-response"], [id="h-captcha-response"]'
                );
                hTextareas.forEach(function(ta) {{
                    ta.style.display = 'block';
                    ta.value = '{token}';
                }});
            """)
            
            logger.info("✅ Token injetado via JavaScript")
            
        except Exception as e:
            logger.error(f"Erro ao injetar token: {str(e)}")
    
    def _save_screenshot(self, label: str):
        """Salva screenshot da página atual."""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"screenshots/{label}_{timestamp}.png"
            self.driver.save_screenshot(filename)
            logger.info(f"📸 Screenshot salvo: {filename}")
        except Exception as e:
            logger.warning(f"Erro ao salvar screenshot: {str(e)}")
    
    def close(self):
        """Fecha o navegador."""
        if self.driver:
            self.driver.quit()
            logger.info("🔒 Navegador fechado")


# Exemplo de uso
if __name__ == '__main__':
    import sys
    logging.basicConfig(level=logging.INFO)
    
    url = sys.argv[1] if len(sys.argv) > 1 else Config.TARGET_URL
    captcha_type = sys.argv[2] if len(sys.argv) > 2 else 'recaptcha_v2'
    
    if not url:
        print("Uso: python selenium_bot.py <URL> [tipo_captcha]")
        sys.exit(1)
    
    bot = SeleniumCaptchaBot()
    
    try:
        token = bot.navigate_and_solve(url, captcha_type)
        if token:
            print(f"\n✅ Token obtido: {token[:50]}...")
        else:
            print("\n❌ Falha ao resolver CAPTCHA")
    finally:
        bot.close()
