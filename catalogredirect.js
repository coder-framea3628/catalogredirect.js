/**
 * Frame Catalog Redirect - High Conversion Flow
 * Versão Autônoma, Persistente e Imersiva
 */
(function () {
    'use strict';

    const CONFIG = {
        colors: {
            accent: '#8E6E4A',
            gradient: 'linear-gradient(135deg, #8E6E4A, #C7AB8F)',
            textDark: '#262626',
            overlay: 'rgba(0, 0, 0, 0.35)',
            modalBg: '#ffffff',
            textMain: '#1a1a1a',
            textSec: '#444444',
            textLight: '#777777',
            borderInput: '#eeeeee',
            loaderBase: '#f3f3f3',
            error: '#e74c3c',
            hoverOutline: 'rgba(142, 110, 74, 0.05)',
            disclaimerLink: '#A0704A'
        },
        image: 'https://framerusercontent.com/images/AlJ6r5sMXncChi21H1cwx5BoBI.webp',
        videoUrl: 'https://myvidplay.com/e/nujkjaj5q2ce',
        redirectUrl: 'https://frameag.com/models?redirect=popup-brandpage',
        exitUrl: 'https://frameag.com',
        storageKey: 'user_detected_location',
        disclaimerKey: 'disclaimerViewed'
    };

    // Preload da imagem inicial para carregamento instantâneo
    const preloadedImage = new Image();
    preloadedImage.src = CONFIG.image;

    // Estado global das preferências do usuário
    const UserState = {
        city: 'sua região',
        state: '',
        hair: '',
        age: 18,
        body: ''
    };

    const injectStyles = () => {
        const css = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
        
        .fr-overlay {
            position: fixed; inset: 0; background: ${CONFIG.colors.overlay};
            backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            z-index: 999999; display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.5s ease; font-family: 'Montserrat', sans-serif;
            padding: 15px; box-sizing: border-box;
        }
        .fr-overlay.active { opacity: 1; }
        .fr-overlay * { box-sizing: border-box; }
        
        .fr-modal {
            background: ${CONFIG.colors.modalBg}; width: 100%; max-width: 420px; border-radius: 24px;
            padding: 30px 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            transform: translateY(20px) scale(0.98); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            text-align: center; color: ${CONFIG.colors.textDark}; position: relative;
            overflow: hidden; display: flex; flex-direction: column;
        }
        .fr-overlay.active .fr-modal { transform: translateY(0) scale(1); }
        
        .fr-close {
            position: absolute; top: 15px; right: 15px; width: 30px; height: 30px;
            background: ${CONFIG.colors.loaderBase}; border-radius: 50%; display: flex;
            align-items: center; justify-content: center; cursor: pointer; border: none;
            color: ${CONFIG.colors.textSec}; font-size: 14px; transition: all 0.2s;
            z-index: 10;
        }
        .fr-close:hover { background: #e0e0e0; color: ${CONFIG.colors.textMain}; }

        .fr-step { display: none; animation: frFadeIn 0.4s ease forwards; width: 100%; }
        .fr-step.active { display: block; }
        @keyframes frFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Typography & Image */
        .fr-img { width: 100%; height: auto; border-radius: 16px; margin-bottom: 20px; object-fit: cover; box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
        .fr-title { font-size: 22px; font-weight: 700; margin-bottom: 10px; line-height: 1.3; color: ${CONFIG.colors.textMain}; }
        .fr-desc { font-size: 15px; color: ${CONFIG.colors.textSec}; margin-bottom: 20px; line-height: 1.5; }
        
        /* Location Badge */
        .fr-location {
            display: inline-flex; align-items: center; justify-content: center; gap: 8px;
            padding: 10px 20px; border: 1.5px solid ${CONFIG.colors.borderInput};
            background: #fafafa; border-radius: 30px; margin-bottom: 25px;
            font-weight: 600; color: ${CONFIG.colors.accent}; font-size: 15px;
        }
        .fr-location svg { width: 18px; height: 18px; stroke: ${CONFIG.colors.accent}; }

        /* Buttons */
        .fr-btn {
            width: 100%; padding: 16px; border-radius: 50px; font-size: 16px; font-weight: 700;
            cursor: pointer; border: none; transition: all 0.3s ease; text-align: center;
            background: ${CONFIG.colors.gradient}; color: #fff; text-transform: uppercase;
            letter-spacing: 0.5px; position: relative;
        }
        .fr-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(142, 110, 74, 0.3); }
        .fr-btn.pulse { animation: frPulseBtn 2s infinite; }
        
        @keyframes frPulseBtn {
            0% { box-shadow: 0 0 0 0 rgba(142, 110, 74, 0.5); }
            70% { box-shadow: 0 0 0 15px rgba(142, 110, 74, 0); }
            100% { box-shadow: 0 0 0 0 rgba(142, 110, 74, 0); }
        }

        .fr-btn-outline {
            width: 100%; padding: 14px; border-radius: 14px; font-size: 15px; font-weight: 600;
            cursor: pointer; border: 1.5px solid ${CONFIG.colors.borderInput}; background: transparent;
            color: ${CONFIG.colors.textSec}; transition: all 0.2s ease; margin-bottom: 10px;
        }
        .fr-btn-outline:hover { background: ${CONFIG.colors.hoverOutline}; border-color: ${CONFIG.colors.accent}; color: ${CONFIG.colors.accent}; }
        .fr-btn-outline.selected { background: ${CONFIG.colors.hoverOutline}; border-color: ${CONFIG.colors.accent}; color: ${CONFIG.colors.accent}; transform: scale(0.98); }

        /* Disclaimer */
        .fr-disclaimer { font-size: 11px; color: ${CONFIG.colors.textLight}; margin-top: 15px; line-height: 1.4; }
        .fr-disclaimer a { color: ${CONFIG.colors.disclaimerLink}; text-decoration: underline; font-weight: 500; cursor: pointer; }

        /* Video Step */
        .fr-video-wrapper {
            width: 100%; aspect-ratio: 4/3; border-radius: 18px; overflow: hidden;
            margin: 0 auto 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); background: #000;
        }
        .fr-video-wrapper iframe { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
        .fr-subtitle { font-size: 17px; font-weight: 700; color: ${CONFIG.colors.textMain}; margin-bottom: 15px; }
        
        /* Slider (Premium style like noUiSlider) */
        .fr-slider-container { margin: 25px 0 30px; position: relative; }
        .fr-slider-label { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; color: ${CONFIG.colors.textSec}; margin-bottom: 15px; }
        .fr-slider-val { color: ${CONFIG.colors.accent}; font-weight: 700; font-size: 18px; }
        .fr-range {
            -webkit-appearance: none; width: 100%; height: 6px; background: ${CONFIG.colors.borderInput};
            border-radius: 4px; outline: none; margin: 0;
        }
        .fr-range::-webkit-slider-thumb {
            -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%;
            background: ${CONFIG.colors.accent}; cursor: pointer; box-shadow: 0 2px 6px rgba(142, 110, 74, 0.4);
            transition: transform 0.1s; border: 2px solid #fff;
        }
        .fr-range::-webkit-slider-thumb:active { transform: scale(1.15); }

        /* Sub Modals (Body & Exit) */
        .fr-submodal-overlay {
            position: absolute; inset: 0; background: rgba(255,255,255,0.95); z-index: 100;
            display: flex; flex-direction: column; justify-content: center; padding: 25px;
            opacity: 0; pointer-events: none; transition: opacity 0.3s; border-radius: 24px;
            backdrop-filter: blur(5px);
        }
        .fr-submodal-overlay.active { opacity: 1; pointer-events: all; }
        
        .fr-body-card {
            background: #fff; border: 1.5px solid ${CONFIG.colors.borderInput}; border-radius: 16px;
            padding: 16px; margin-bottom: 12px; cursor: pointer; text-align: left; transition: all 0.2s;
        }
        .fr-body-card:hover { border-color: ${CONFIG.colors.accent}; box-shadow: 0 6px 15px ${CONFIG.colors.hoverOutline}; transform: translateY(-2px); }
        .fr-body-title { font-size: 16px; font-weight: 700; color: ${CONFIG.colors.textMain}; margin-bottom: 4px; }
        .fr-body-desc { font-size: 13px; color: ${CONFIG.colors.textLight}; line-height: 1.4; }

        /* Loaders & Results */
        .fr-loader-step { text-align: center; padding: 40px 0; }
        .fr-spinner {
            width: 45px; height: 45px; border: 4px solid ${CONFIG.colors.loaderBase};
            border-top: 4px solid ${CONFIG.colors.accent}; border-radius: 50%;
            animation: frSpin 0.8s linear infinite; margin: 0 auto 20px;
        }
        @keyframes frSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .fr-loading-text { font-size: 16px; font-weight: 600; color: ${CONFIG.colors.textSec}; height: 24px; }
        
        .fr-result-number { font-size: 48px; font-weight: 700; color: ${CONFIG.colors.accent}; line-height: 1; margin: 15px 0; }
        .fr-micro-text { font-size: 13px; color: ${CONFIG.colors.textLight}; margin: 15px 0 25px; }

        @media (max-width: 480px) {
            .fr-modal { padding: 25px 20px; border-radius: 20px; }
            .fr-title { font-size: 20px; }
            .fr-video-wrapper { border-radius: 14px; }
        }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    // Áudio sutil para cliques
    const playSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {}
    };

    const GeoService = {
        async fetchLocation() {
            const cached = localStorage.getItem(CONFIG.storageKey);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if(parsed.city) return parsed;
                } catch(e) {}
            }

            const apis = [
                { url: 'https://ipapi.co/json/', extract: d => ({ city: d.city, state: d.region_code || d.region }) },
                { url: 'https://ipinfo.io/json', extract: d => ({ city: d.city, state: d.region }) },
                { url: 'https://freeipapi.com/api/json', extract: d => ({ city: d.cityName, state: d.regionName }) }
            ];

            const fetchWithTimeout = (url, timeout = 5000) => {
                return Promise.race([
                    fetch(url).then(r => r.json()),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
                ]);
            };

            for (const api of apis) {
                try {
                    const data = await fetchWithTimeout(api.url);
                    const result = api.extract(data);
                    if (result.city) {
                        localStorage.setItem(CONFIG.storageKey, JSON.stringify(result));
                        return result;
                    }
                } catch (e) {
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        console.error(`API ${api.url} falhou:`, e);
                    }
                }
            }
            return { city: "um raio de 2km", state: "sua região" };
        }
    };

    const CatalogPopup = {
        async init() {
            injectStyles();
            this.setupTabVisibility();
            
            const loc = await GeoService.fetchLocation();
            UserState.city = loc.city;
            UserState.state = loc.state;
            
            this.render();
            this.preventExit();
        },

        setupTabVisibility() {
            const originalTitle = document.title;
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "hidden" && document.getElementById('fr-overlay')) {
                    document.title = "⚠️ (1) MENSAGEM RECEBIDA";
                } else {
                    document.title = originalTitle;
                }
            });
        },

        preventExit() {
            document.body.style.overflow = 'hidden';
        },

        switchStep(hideId, showId) {
            document.getElementById(hideId).classList.remove('active');
            setTimeout(() => {
                document.getElementById(showId).classList.add('active');
            }, 50);
        },

        showExitIntent() {
            playSound();
            document.getElementById('fr-exit-modal').classList.add('active');
        },

        handleHairSelection(hairType, btnElement) {
            playSound();
            UserState.hair = hairType;
            btnElement.classList.add('selected');
            setTimeout(() => {
                this.switchStep('step-hair', 'step-age');
            }, 400);
        },

        updateAgeVal(val) {
            document.getElementById('fr-age-display').innerText = val;
            UserState.age = val;
        },

        openBodyModal() {
            playSound();
            document.getElementById('fr-body-modal').classList.add('active');
        },

        handleBodySelection(bodyType) {
            playSound();
            UserState.body = bodyType;
            document.getElementById('fr-body-modal').classList.remove('active');
            this.switchStep('step-age', 'step-loading');
            this.startLoadingSequence();
        },

        startLoadingSequence() {
            const textEl = document.getElementById('fr-loading-text');
            const term = UserState.hair.toLowerCase();
            const locText = UserState.state ? `${UserState.city}, ${UserState.state}` : UserState.city;
            
            const messages = [
                "Salvando preferências...",
                `Localizando modelos ${term} em ${locText}...`,
                "Verificando disponibilidade imediata...",
                "Acesso liberado!"
            ];

            let i = 0;
            textEl.innerText = messages[i];

            const interval = setInterval(() => {
                i++;
                if (i < messages.length) {
                    textEl.innerText = messages[i];
                } else {
                    clearInterval(interval);
                    this.showFinalResult();
                }
            }, 1200);
        },

        showFinalResult() {
            this.switchStep('step-loading', 'step-result');
            
            // Textos dinâmicos
            const term = UserState.hair.toLowerCase();
            const locText = UserState.state ? `${UserState.city}, ${UserState.state}` : UserState.city;
            document.getElementById('fr-final-desc').innerText = 
                `Encontramos modelos ${term}, em torno de ${UserState.age} anos em ${locText}.`;

            // Animação Count-up
            const el = document.getElementById('fr-count');
            let startTimestamp = null;
            const duration = 2000;
            const target = 9543;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // Ease out
                const ease = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(ease * target);
                
                el.innerText = current.toLocaleString('pt-BR');
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.innerText = target.toLocaleString('pt-BR');
                }
            };
            window.requestAnimationFrame(step);
        },

        redirectFinal() {
            playSound();
            window.location.href = CONFIG.redirectUrl;
        },

        render() {
            const container = document.createElement('div');
            const locString = UserState.state ? `${UserState.city}, ${UserState.state}` : UserState.city;
            
            const showDisclaimer = !localStorage.getItem(CONFIG.disclaimerKey);
            if (showDisclaimer) localStorage.setItem(CONFIG.disclaimerKey, 'true');

            container.innerHTML = `
                <div class="fr-overlay" id="fr-overlay">
                    <div class="fr-modal">
                        <button class="fr-close" onclick="CatalogPopup.showExitIntent()">✕</button>

                        <div class="fr-step active" id="step-initial">
                            <img src="${CONFIG.image}" class="fr-img" alt="Modelo">
                            <h2 class="fr-title">O perfil desta modelo ainda não foi finalizado.</h2>
                            <p class="fr-desc">O que acha de visitar o catálogo de acompanhantes disponíveis em:</p>
                            
                            <div class="fr-location">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                ${locString}
                            </div>
                            
                            <button class="fr-btn pulse" onclick="playSound(); CatalogPopup.switchStep('step-initial', 'step-hair')">
                                Quero conhecer
                            </button>
                            
                            ${showDisclaimer ? `
                            <p class="fr-disclaimer">
                                Na Frame Agency, conforme a <a>Política de Privacidade</a>, utilizamos tecnologias para aprimorar sua experiência.
                            </p>` : ''}
                        </div>

                        <div class="fr-step" id="step-hair">
                            <div class="fr-video-wrapper">
                                <iframe src="${CONFIG.videoUrl}?autoplay=1&loop=1&muted=1" scrolling="no" frameborder="0" allowfullscreen="true"></iframe>
                            </div>
                            <h3 class="fr-subtitle">Compartilhe suas preferências para uma experiência personalizada</h3>
                            <button class="fr-btn-outline" onclick="CatalogPopup.handleHairSelection('Loiras', this)">Modelos Loiras</button>
                            <button class="fr-btn-outline" onclick="CatalogPopup.handleHairSelection('Morenas', this)">Modelos Morenas</button>
                            <button class="fr-btn-outline" onclick="CatalogPopup.handleHairSelection('Pretas', this)">Modelos Pretas</button>
                        </div>

                        <div class="fr-step" id="step-age">
                            <div class="fr-video-wrapper" style="aspect-ratio: 16/9;">
                                <iframe src="${CONFIG.videoUrl}?autoplay=1&loop=1&muted=1" scrolling="no" frameborder="0" allowfullscreen="true"></iframe>
                            </div>
                            <h3 class="fr-subtitle">Qual a faixa de idade ideal?</h3>
                            
                            <div class="fr-slider-container">
                                <div class="fr-slider-label">
                                    <span>Idade desejada</span>
                                    <span class="fr-slider-val" id="fr-age-display">18</span>
                                </div>
                                <input type="range" min="18" max="35" value="18" class="fr-range" 
                                    oninput="CatalogPopup.updateAgeVal(this.value)">
                            </div>

                            <button class="fr-btn" onclick="CatalogPopup.openBodyModal()">
                                Definir Corpo
                            </button>
                        </div>

                        <div class="fr-step fr-loader-step" id="step-loading">
                            <div class="fr-spinner"></div>
                            <div class="fr-loading-text" id="fr-loading-text">Salvando preferências...</div>
                        </div>

                        <div class="fr-step" id="step-result" style="padding: 20px 0;">
                            <h3 class="fr-title" style="font-size: 24px;">A escolha ideal para você</h3>
                            <p class="fr-desc" id="fr-final-desc" style="margin-bottom:5px;"></p>
                            
                            <div class="fr-result-number" id="fr-count">0</div>
                            <p class="fr-micro-text">Gostaria de conhecer essas opções exclusivas?</p>
                            
                            <button class="fr-btn pulse" onclick="CatalogPopup.redirectFinal()">
                                Quero conhecer agora
                            </button>
                        </div>

                        <div class="fr-submodal-overlay" id="fr-body-modal">
                            <h3 class="fr-title" style="margin-bottom: 20px;">Preferência de corpo</h3>
                            
                            <div class="fr-body-card" onclick="CatalogPopup.handleBodySelection('Magrinha')">
                                <div class="fr-body-title">Magrinha</div>
                                <div class="fr-body-desc">Corpo esguio, cintura fina, pernas longas e definidas. Pequenininha e delicada, perfeita pra quem gosta de dominar.</div>
                            </div>
                            <div class="fr-body-card" onclick="CatalogPopup.handleBodySelection('Cavalona')">
                                <div class="fr-body-title">Cavalona</div>
                                <div class="fr-body-desc">Curvas marcantes e voluptuosas: bunda grande e empinada, cintura bem marcada. Aguenta ritmo forte e adora rebolar.</div>
                            </div>
                            <div class="fr-body-card" onclick="CatalogPopup.handleBodySelection('Cheinha')">
                                <div class="fr-body-title">Cheinha</div>
                                <div class="fr-body-desc">Barriguinha sensual, coxas grossas, bunda grande e redonda, seios pesados. Ideal pra quem gosta de mulher real e curvilínea.</div>
                            </div>
                        </div>

                        <div class="fr-submodal-overlay" id="fr-exit-modal" style="justify-content: center; text-align: center;">
                            <h3 class="fr-title">Tem certeza que deseja sair?</h3>
                            <p class="fr-desc">Isso pode te fazer perder acesso exclusivo às modelos da sua região.</p>
                            <button class="fr-btn pulse" style="margin-bottom: 15px;" onclick="window.location.href='${CONFIG.redirectUrl}'">Ver catálogo</button>
                            <button class="fr-btn-outline" onclick="window.location.href='${CONFIG.exitUrl}'">Sim, sair</button>
                        </div>

                    </div>
                </div>
            `;

            document.body.appendChild(container);

            // Trigger animation para o overlay principal
            requestAnimationFrame(() => {
                document.getElementById('fr-overlay').classList.add('active');
            });

            // Expõe o objeto para o HTML inline
            window.CatalogPopup = this;
        }
    };

    // Inicialização segura
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        CatalogPopup.init();
    } else {
        window.addEventListener('DOMContentLoaded', () => CatalogPopup.init());
    }

})();