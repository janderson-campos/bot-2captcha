"""
Módulo de resolução de CAPTCHAs usando 2captcha API
Suporta: reCAPTCHA v2, reCAPTCHA v3, hCaptcha, FunCaptcha, TextCaptcha
"""

import os
import time
import logging
import requests
from typing import Optional, Dict, Any
from twocaptcha import TwoCaptcha
from config import Config

logger = logging.getLogger('CaptchaSolver')


class CaptchaSolver:
    """Classe principal para resolução de CAPTCHAs via 2captcha."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Inicializa o solver com a API key do 2captcha.
        
        Args:
            api_key: API Key do 2captcha. Se não fornecida, usa a do .env
        """
        self.api_key = api_key or Config.API_KEY
        
        if not self.api_key:
            raise ValueError("API Key do 2captcha não configurada!")
        
        # Inicializar cliente 2captcha
        self.solver = TwoCaptcha(self.api_key)
        
        # Estatísticas
        self.stats = {
            'total_requests': 0,
            'successful': 0,
            'failed': 0,
            'total_time': 0.0,
        }
        
        logger.info(f"Solver inicializado com API Key: {self.api_key[:8]}...")
    
    def solve(self, captcha_type: str, site_key: str, url: str, **kwargs) -> Optional[str]:
        """
        Resolve um CAPTCHA do tipo especificado.
        
        Args:
            captcha_type: Tipo do captcha (recaptcha_v2, recaptcha_v3, hcaptcha, funcaptcha, text)
            site_key: Site key do CAPTCHA
            url: URL da página com o CAPTCHA
            **kwargs: Parâmetros adicionais específicos do tipo
            
        Returns:
            Token de resposta do CAPTCHA ou None se falhar
        """
        self.stats['total_requests'] += 1
        start_time = time.time()
        
        try:
            if captcha_type == 'recaptcha_v2':
                result = self._solve_recaptcha_v2(site_key, url, **kwargs)
            elif captcha_type == 'recaptcha_v3':
                result = self._solve_recaptcha_v3(site_key, url, **kwargs)
            elif captcha_type == 'hcaptcha':
                result = self._solve_hcaptcha(site_key, url, **kwargs)
            elif captcha_type == 'funcaptcha':
                result = self._solve_funcaptcha(site_key, url, **kwargs)
            elif captcha_type == 'text':
                result = self._solve_text_captcha(**kwargs)
            else:
                raise ValueError(f"Tipo de CAPTCHA não suportado: {captcha_type}")
            
            elapsed = time.time() - start_time
            self.stats['total_time'] += elapsed
            self.stats['successful'] += 1
            
            logger.info(f"✅ Resolvido em {elapsed:.1f}s | Tipo: {captcha_type}")
            return result
            
        except Exception as e:
            self.stats['failed'] += 1
            logger.error(f"❌ Erro ao resolver {captcha_type}: {str(e)}")
            
            # Retry logic
            retries = kwargs.get('retries', Config.MAX_RETRIES)
            if retries > 0:
                logger.info(f"🔄 Tentando novamente... ({retries} tentativas restantes)")
                time.sleep(2)
                return self.solve(captcha_type, site_key, url, retries=retries - 1, **kwargs)
            
            return None
    
    def _solve_recaptcha_v2(self, site_key: str, url: str, **kwargs) -> str:
        """Resolve reCAPTCHA v2."""
        logger.info("🔵 Resolvendo reCAPTCHA v2...")
        
        result = self.solver.recaptcha(
            sitekey=site_key,
            url=url,
            invisible=kwargs.get('invisible', False),
        )
        
        return result['code']
    
    def _solve_recaptcha_v3(self, site_key: str, url: str, **kwargs) -> str:
        """Resolve reCAPTCHA v3."""
        logger.info("🔷 Resolvendo reCAPTCHA v3...")
        
        result = self.solver.recaptcha(
            sitekey=site_key,
            url=url,
            version='v3',
            action=kwargs.get('action', 'verify'),
            score=kwargs.get('score', 0.9),
        )
        
        return result['code']
    
    def _solve_hcaptcha(self, site_key: str, url: str, **kwargs) -> str:
        """Resolve hCaptcha."""
        logger.info("🟠 Resolvendo hCaptcha...")
        
        result = self.solver.hcaptcha(
            sitekey=site_key,
            url=url,
        )
        
        return result['code']
    
    def _solve_funcaptcha(self, site_key: str, url: str, **kwargs) -> str:
        """Resolve FunCaptcha."""
        logger.info("🟣 Resolvendo FunCaptcha...")
        
        result = self.solver.funcaptcha(
            public_key=site_key,
            url=url,
            surl=kwargs.get('surl', 'https://api.funcaptcha.com'),
        )
        
        return result['code']
    
    def _solve_text_captcha(self, **kwargs) -> str:
        """Resolve CAPTCHA de texto (imagem)."""
        logger.info("📝 Resolvendo TextCaptcha...")
        
        image_path = kwargs.get('image_path')
        if not image_path:
            raise ValueError("image_path é obrigatório para TextCaptcha")
        
        result = self.solver.captcha(
            filename=image_path,
            numeric=kwargs.get('numeric', 0),
            min_len=kwargs.get('min_len', 4),
            max_len=kwargs.get('max_len', 6),
        )
        
        return result['code']
    
    def get_balance(self) -> float:
        """Obtém o saldo atual da conta 2captcha."""
        try:
            response = requests.get(
                "https://2captcha.com/res.php",
                params={
                    'key': self.api_key,
                    'action': 'getbalance',
                    'json': 1
                }
            )
            data = response.json()
            
            if data.get('status') == 1:
                return float(data['request'])
            else:
                raise Exception(data.get('request', 'Erro desconhecido'))
                
        except Exception as e:
            logger.error(f"Erro ao verificar saldo: {str(e)}")
            raise
    
    def get_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas do solver."""
        avg_time = (self.stats['total_time'] / self.stats['successful'] 
                   if self.stats['successful'] > 0 else 0)
        
        return {
            **self.stats,
            'average_time': round(avg_time, 2),
            'success_rate': round(
                (self.stats['successful'] / self.stats['total_requests'] * 100)
                if self.stats['total_requests'] > 0 else 0, 2
            )
        }
    
    def report_good(self, task_id: str):
        """Reporta que o captcha foi resolvido corretamente."""
        try:
            requests.get(
                "https://2captcha.com/res.php",
                params={
                    'key': self.api_key,
                    'action': 'reportgood',
                    'id': task_id,
                    'json': 1
                }
            )
            logger.info(f"✅ Reportado como correto: {task_id}")
        except Exception as e:
            logger.warning(f"Erro ao reportar: {str(e)}")
    
    def report_bad(self, task_id: str):
        """Reporta que o captcha foi resolvido incorretamente."""
        try:
            requests.get(
                "https://2captcha.com/res.php",
                params={
                    'key': self.api_key,
                    'action': 'reportbad',
                    'id': task_id,
                    'json': 1
                }
            )
            logger.info(f"❌ Reportado como incorreto: {task_id}")
        except Exception as e:
            logger.warning(f"Erro ao reportar: {str(e)}")
