/**
 * Frame Catalog Redirect - High Conversion Flow
 * Versão Autônoma e Persistente
 */
(function () {
    'use strict';

    const CONFIG = {
        colors: {
            primary: '#FF2D55', // Rosa/Vermelho vibrante
            primaryGrad: 'linear-gradient(135deg, #FF2D55, #D4145A)',
            textDark: '#1A1A1A',
            overlay: 'rgba(0, 0, 0, 0.85)',
            border: '#FF2D55'
        },
        image: 'https://framerusercontent.com/images/AlJ6r5sMXncChi21H1cwx5BoBI.webp',
        redirectUrl: 'https://frameag.com/models',
        storageKey: 'user_detected_city'
    };

    const injectStyles = () => {
        const css = `
        .catalog-popup-overlay {
            position: fixed; inset: 0; background: ${CONFIG.colors.overlay};
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            z-index: 999999; display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.5s ease; font-family: 'Montserrat', sans-serif;
            padding: 20px;
        }
        .catalog-popup-overlay.active { opacity: 1; }
        
        .catalog-modal {
            background: #fff; width: 100%; max-width: 400px; border-radius: 25px;
            padding: 30px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            transform: translateY(30px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            text-align: center; color: ${CONFIG.colors.textDark}; position: relative;
        }
        .catalog-popup-overlay.active .catalog-modal { transform: translateY(0); }
        
        .catalog-img { width: 100%; height: auto; border-radius: 15px; margin-bottom: 20px; object-fit: cover; }
        
        .catalog-title { font-size: 22px; font-weight: 700; margin-bottom: 12px; line-height: 1.3; color: #000; }
        .catalog-desc { font-size: 15px; color: #444; margin-bottom: 20px; line-height: 1.4; }
        
        .location-badge {
            display: inline-block; padding: 10px 20px; border: 2px solid ${CONFIG.colors.border};
            border-radius: 30px; margin-bottom: 25px; font-weight: 700; color: ${CONFIG.colors.primary};
            font-size: 16px; min-width: 120px;
        }

        .catalog-btn {
            width: 100%; padding: 18px; border-radius: 50px; font-size: 18px; font-weight: 700;
            cursor: pointer; border: none; transition: all 0.3s ease; text-align: center;
            background: ${CONFIG.colors.primaryGrad}; color: #fff;
            box-shadow: 0 4px 15px rgba(255, 45, 85, 0.3); text-transform: uppercase;
        }
        .catalog-btn:hover { transform: scale(1.02); brightness: 1.1; }

        /* Redirect Overlay */
        .redirect-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.9);
            z-index: 1000000; display: none; flex-direction: column;
            align-items: center; justify-content: center; color: #fff;
        }
        .spinner {
            width: 50px; height: 50px; border: 5px solid #333;
            border-top: 5px solid ${CONFIG.colors.primary}; border-radius: 50%;
            animation: spin 1s linear infinite; margin-bottom: 20px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        @media (max-width: 480px) {
            .catalog-modal { padding: 25px; }
            .catalog-title { font-size: 20px; }
        }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    const GeoService = {
        async getCity() {
            const cached = localStorage.getItem(CONFIG.storageKey);
            if (cached) return cached;

            const apis = [
                { url: 'https://ipwho.is/', key: 'city' },
                { url: 'https://ipapi.co/json/', key: 'city' },
                { url: 'https://ipinfo.io/json', key: 'city' },
                { url: 'https://freeipapi.com/api/json', key: 'cityName' }
            ];

            for (const api of apis) {
                try {
                    const controller = new AbortController();
                    const timeout = setTimeout(() => controller.abort(), 5000);
                    
                    const response = await fetch(api.url, { signal: controller.signal });
                    const data = await response.json();
                    
                    if (data[api.key]) {
                        localStorage.setItem(CONFIG.storageKey, data[api.key]);
                        return data[api.key];
                    }
                } catch (e) {
                    console.warn(`API ${api.url} falhou, tentando próxima...`);
                }
            }
            return "Um raio de 2km da sua cidade";
        }
    };

    const CatalogPopup = {
        async init() {
            injectStyles();
            const city = await GeoService.getCity();
            this.render(city);
            this.preventExit();
        },

        preventExit() {
            document.body.style.overflow = 'hidden';
            // Impede fechar no ESC
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') e.preventDefault();
            }, true);
        },

        handleRedirect() {
            const loader = document.getElementById('redirect-loader');
            loader.style.display = 'flex';

            setTimeout(() => {
                window.open(CONFIG.redirectUrl, '_blank');
                loader.style.display = 'none';
            }, 1500);
        },

        render(city) {
            const container = document.createElement('div');
            container.innerHTML = `
                <div class="catalog-popup-overlay" id="catalog-overlay">
                    <div class="catalog-modal">
                        <img src="${CONFIG.image}" class="catalog-img" alt="Modelo indisponível">
                        <h2 class="catalog-title">Parece que a página desta modelo ainda não foi finalizada.</h2>
                        <p class="catalog-desc">O que acha de visitar o catálogo de acompanhantes disponíveis em:</p>
                        
                        <div class="location-badge">${city}</div>
                        
                        <button class="catalog-btn" id="btn-catalog-action" aria-label="Redirecionar para catálogo de modelos">
                            Quero conhecer
                        </button>
                    </div>
                </div>

                <div class="redirect-overlay" id="redirect-loader">
                    <div class="spinner"></div>
                    <p style="font-weight:600; letter-spacing:1px;">Redirecionando...</p>
                </div>
            `;

            document.body.appendChild(container);

            const overlay = document.getElementById('catalog-overlay');
            const btn = document.getElementById('btn-catalog-action');

            // Trigger animation
            requestAnimationFrame(() => overlay.classList.add('active'));

            btn.onclick = () => this.handleRedirect();
        }
    };

    // Inicialização imediata
    if (document.readyState === 'complete') {
        CatalogPopup.init();
    } else {
        window.addEventListener('load', () => CatalogPopup.init());
    }

})();