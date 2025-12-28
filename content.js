// Content Script - Executa na página do Dreamstime

console.log('🚀 Dreamstime Auto Submitter - Content Script carregado');
console.log('📍 URL:', window.location.href);

// Estado local
let isProcessing = false;
let isPaused = false;
let config = {
    delayBetweenClicks: 2000
};

// ========== URL OBSERVER (detecta navegação SPA/AJAX) ==========
let currentUrlTracked = window.location.href;
console.log('👀 URL Observer ativado - detectando mudanças...');

setInterval(() => {
    if (window.location.href !== currentUrlTracked) {
        const oldUrl = currentUrlTracked;
        currentUrlTracked = window.location.href;

        console.log('🔀 URL MUDOU (SPA navigation)!');
        console.log('   📍 De:', oldUrl);
        console.log('   📍 Para:', currentUrlTracked);

        // Verifica se voltou para /upload (finalizado)
        if (oldUrl.includes('/upload/edit') &&
            (currentUrlTracked.endsWith('/upload') || currentUrlTracked.endsWith('/upload/'))) {
            console.log('🔙 Voltou para página de upload - verificando se finalizou...');

            chrome.storage.local.get(['isRunning'], (data) => {
                if (data.isRunning) {
                    // Aguarda um pouco e verifica se há mais imagens
                    setTimeout(() => {
                        const firstImage = document.querySelector('.upload-item__link.js-upload-edit');
                        if (!firstImage) {
                            console.log('🎉 FINALIZADO! Não há mais imagens para processar!');
                            stopProcessing();
                            showNotification('✅ Concluído! Todas as imagens foram processadas!', 'success');

                            // Para a automação no background
                            chrome.runtime.sendMessage({ action: 'STOP_AUTOMATION' });
                        } else {
                            console.log('⚠️ Ainda há imagens. Parando por segurança.');
                            stopProcessing();
                            showNotification('⚠️ Automação concluída. Verifique se há imagens restantes.', 'warning');
                            chrome.runtime.sendMessage({ action: 'STOP_AUTOMATION' });
                        }
                    }, 1500);
                }
            });
            return; // Não processa mais
        }

        // Verifica se deve processar quando URL muda para /upload/edit
        if (currentUrlTracked.includes('/upload/edit')) {
            chrome.storage.local.get(['isRunning', 'isPaused'], (data) => {
                console.log('💾 Storage após mudança de URL:', data);

                if (data.isRunning && !data.isPaused) {
                    console.log('⚡ ATIVA! URL mudou para página de edição - processando em 1.5s!');

                    // Aguarda a página carregar
                    setTimeout(() => {
                        console.log('🎬 Iniciando processamento pós-navegação...');
                        if (!isProcessing) {
                            isProcessing = true;
                            isPaused = false;
                        }
                        processCurrentImage();
                    }, 1500);
                } else {
                    console.log('❌ Automação não está rodando');
                }
            });
        }
    }
}, 500); // Verifica URL a cada 500ms
// ================================================================

// Listener para mensagens do background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Content script recebeu mensagem:', message);

    switch (message.action) {
        case 'START_PROCESSING':
            config = message.config || config;
            startProcessing();
            sendResponse({ success: true });
            break;

        case 'PAUSE_PROCESSING':
            pauseProcessing();
            sendResponse({ success: true });
            break;

        case 'CONTINUE_PROCESSING':
            config = message.config || config;
            continueProcessing();
            sendResponse({ success: true });
            break;

        case 'STOP_PROCESSING':
            stopProcessing();
            sendResponse({ success: true });
            break;

        case 'UPDATE_WIDGET':
            console.log('📊 Atualizando widget via mensagem:', message);
            if (typeof updateWidget === 'function') {
                updateWidget(message.processed, message.total, message.percentage);
            }
            sendResponse({ success: true });
            break;
    }

    return true;
});

// Inicia o processamento
function startProcessing() {
    console.log('🔵 startProcessing() chamado');
    console.log('📊 Estado atual - isProcessing:', isProcessing, 'isPaused:', isPaused);
    console.log('📍 URL atual:', window.location.href);

    if (isProcessing) {
        console.log('⚠️ Processamento já está em andamento');
        return;
    }

    isProcessing = true;
    isPaused = false;
    console.log('✅ Iniciando processamento automático');

    // Cria widget flutuante
    if (typeof createFloatingWidget === 'function') {
        createFloatingWidget();
        startWidgetTimer();
    }

    // Verifica se está na página de edição
    if (window.location.href.includes('/upload/edit')) {
        console.log('📝 Detectado página de EDIÇÃO - processando imagem');
        processCurrentImage();
    } else if (window.location.href.includes('/upload')) {
        console.log('📋 Detectado página de LISTA - aguardando AJAX carregar...');

        // Aguarda as imagens carregarem via AJAX
        waitForImagesLoaded().then(() => {
            console.log('✅ Imagens carregadas! Extraindo total...');
            // Extrai o total de imagens da página
            extractTotalImages();
            // Clica na primeira imagem
            clickFirstImage();
        }).catch((error) => {
            console.error('❌ Erro ao aguardar imagens:', error);
            stopProcessing();
            showNotification('Erro: As imagens não carregaram. Tente novamente.', 'warning');
        });
    } else {
        console.log('❌ URL não reconhecida:', window.location.href);
    }
}

// Aguarda as imagens carregarem via AJAX
function waitForImagesLoaded(maxAttempts = 30, delay = 500) {
    console.log('⏳ Aguardando imagens carregarem via AJAX...');

    return new Promise((resolve, reject) => {
        let attempts = 0;

        const checkInterval = setInterval(() => {
            attempts++;

            // Verifica se a div.row existe (container das imagens)
            const rowDiv = document.querySelector('.row');

            if (!rowDiv) {
                console.log(`⏳ Tentativa ${attempts}/${maxAttempts} - Aguardando div.row aparecer...`);

                if (attempts >= maxAttempts) {
                    console.error('❌ Timeout: div.row não apareceu');
                    clearInterval(checkInterval);
                    reject(new Error('Timeout ao aguardar div.row'));
                }
                return;
            }

            // Verifica se NÃO há loading ativo
            const loadingIndicator = document.querySelector('.loading, .spinner, [class*="load"]');
            if (loadingIndicator && loadingIndicator.offsetParent !== null) {
                console.log(`⏳ Tentativa ${attempts}/${maxAttempts} - Ainda há loading ativo...`);

                if (attempts >= maxAttempts) {
                    console.error('❌ Timeout: Loading não terminou');
                    clearInterval(checkInterval);
                    reject(new Error('Timeout - loading ativo'));
                }
                return;
            }

            // Verifica se há imagens carregadas (.upload-item__link.js-upload-edit)
            const uploadItems = document.querySelectorAll('.upload-item__link.js-upload-edit');

            if (uploadItems.length > 0) {
                // Também verifica o span do total
                const uploadTab = document.querySelector('#js-upload span');
                let total = uploadItems.length; // Usa quantidade de itens como fallback

                if (uploadTab && uploadTab.textContent) {
                    const parsedTotal = parseInt(uploadTab.textContent.trim());
                    if (!isNaN(parsedTotal) && parsedTotal > 0) {
                        total = parsedTotal;
                    }
                }

                console.log(`✅ AJAX carregou! ${uploadItems.length} itens visíveis (total: ${total}) após ${attempts} tentativas`);
                clearInterval(checkInterval);
                resolve(total);
                return;
            }

            console.log(`⏳ Tentativa ${attempts}/${maxAttempts} - Aguardando itens aparecerem...`);

            // Timeout após maxAttempts
            if (attempts >= maxAttempts) {
                console.error('❌ Timeout: Nenhum item de upload encontrado após', maxAttempts * delay, 'ms');
                clearInterval(checkInterval);
                reject(new Error('Timeout - nenhuma imagem encontrada'));
            }
        }, delay);
    });
}

// Pausa o processamento
function pauseProcessing() {
    isPaused = true;
    console.log('⏸️ Processamento pausado');
    showNotification('Processamento pausado', 'warning');
}

// Continua o processamento
function continueProcessing() {
    if (!isProcessing) {
        isProcessing = true;
    }
    isPaused = false;
    console.log('▶️ Processamento retomado');
    showNotification('Processamento retomado', 'info');

    // Retoma o processamento baseado na URL
    if (window.location.href.includes('/upload/edit')) {
        console.log('📝 Em página de edição - processando imagem atual');
        processCurrentImage();
    } else if (window.location.href.includes('/upload')) {
        console.log('📋 Em página de lista - clicando próxima imagem');
        clickFirstImage();
    } else {
        console.log('❌ URL não reconhecida:', window.location.href);
    }
}

// Para o processamento
function stopProcessing() {
    isProcessing = false;
    isPaused = false;
    console.log('⏹️ Processamento parado');

    // Remove widget após 3 segundos
    if (typeof removeFloatingWidget === 'function') {
        setTimeout(() => removeFloatingWidget(), 3000);
    }
}

// Extrai o total de imagens da página
function extractTotalImages() {
    // Procura pelo elemento que contém o total
    const uploadTab = document.querySelector('#js-upload span');

    if (uploadTab && uploadTab.textContent) {
        const total = parseInt(uploadTab.textContent.trim());
        if (!isNaN(total) && total > 0) {
            console.log('📊 Total de imagens detectado:', total);

            // Envia o total para o background
            chrome.runtime.sendMessage({
                action: 'UPDATE_TOTAL',
                totalCount: total
            });

            // Atualiza widget
            if (typeof updateWidget === 'function') {
                updateWidget(0, total, 0);
            }
        }
    }
}

// Clica na primeira imagem da lista
function clickFirstImage() {
    console.log('🔍 Procurando primeira imagem para clicar...');

    const firstImage = document.querySelector('.upload-item__link.js-upload-edit');

    if (firstImage) {
        console.log('✅ Primeira imagem encontrada, clicando...');
        firstImage.click();
        console.log('🎬 Clique executado! Aguardando navegação...');
    } else {
        console.log('❌ Nenhuma imagem encontrada na página');
        stopProcessing();
        showNotification('Nenhuma imagem encontrada para processar', 'warning');
    }
}

// Processa a imagem atual
function processCurrentImage() {
    console.log('🔄 processCurrentImage() chamado');
    console.log('📊 Estado - isProcessing:', isProcessing, 'isPaused:', isPaused);

    if (!isProcessing || isPaused) {
        console.log('❌ Processamento foi parado ou pausado');
        return;
    }

    console.log('✅ Processando imagem atual... Delay:', config.delayBetweenClicks, 'ms');

    console.log('🔍 INICIANDO setTimeout para validação...');

    // Aguarda um pouco para garantir que a página carregou
    setTimeout(() => {
        console.log('⏰ Dentro do setTimeout - começando validação!');

        // VALIDA O TÍTULO ANTES DE SUBMETER
        const titleInput = document.querySelector('input#title[name="M_title"]');

        console.log('🔎 Buscando input de título...', titleInput ? 'ENCONTRADO' : 'NÃO ENCONTRADO');

        if (titleInput) {
            const titleValue = titleInput.value.trim();
            const titleLength = titleValue.length;

            console.log(`📝 Verificando título: "${titleValue}"`);
            console.log(`📏 Comprimento: ${titleLength} caracteres (máx: 130)`);

            if (titleLength > 130) {
                console.error(`❌ TÍTULO MUITO LONGO! ${titleLength} caracteres (máx: 130)`);
                console.log('🚨 Preparando para mostrar modal...');

                // Pausa a automação
                pauseProcessing();

                // Envia mensagem para pausar no background também
                chrome.runtime.sendMessage({
                    action: 'PAUSE_AUTOMATION'
                });

                // Destaca o campo com problema
                titleInput.style.border = '3px solid red';
                titleInput.style.boxShadow = '0 0 10px red';

                // Rola até o campo
                titleInput.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                console.log('📢 Chamando showBigNotification...');

                // Mostra notificação grande e persistente
                try {
                    showBigNotification(
                        `⚠️ TÍTULO MUITO LONGO!`,
                        `O título tem ${titleLength} caracteres, mas o máximo permitido é 130.\n\n` +
                        `Por favor, edite o título e clique em "Continuar" na extensão para prosseguir.`,
                        'error'
                    );
                    console.log('✅ Modal deve estar visível agora');
                } catch (error) {
                    console.error('❌ Erro ao criar modal:', error);
                }

                return; // Para aqui, não continua processando
            } else {
                console.log(`✅ Título OK: ${titleLength} caracteres`);
            }
        } else {
            console.warn('⚠️ Campo de título não encontrado');
        }

        // Primeiro, rola até o final da página para encontrar o botão
        console.log('📜 Rolando página para encontrar o botão Submit...');
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });

        // Aguarda o scroll completar
        setTimeout(() => {
            const submitButton = document.querySelector('a#submitbutton');

            if (submitButton) {
                console.log('✅ Botão "Submit commercial" encontrado!');
                console.log('📜 Rolando até o botão...');

                // Garante que o botão está visível no centro da tela
                submitButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Aguarda scroll completar e clica
                setTimeout(() => {
                    console.log('🖱️ Clicando no botão Submit...');

                    // Notifica o background que uma imagem foi submetida
                    chrome.runtime.sendMessage({
                        action: 'IMAGE_SUBMITTED'
                    }, (response) => {
                        console.log('📨 Resposta IMAGE_SUBMITTED:', response);

                        // Aguarda um pouco e busca valores atualizados
                        setTimeout(() => {
                            chrome.storage.local.get(['processedCount', 'totalCount'], (data) => {
                                console.log('💾 Storage após submissão:', data);

                                if (data.totalCount > 0 && typeof updateWidget === 'function') {
                                    const percentage = Math.round((data.processedCount / data.totalCount) * 100);
                                    console.log(`📊 Atualizando widget: ${data.processedCount}/${data.totalCount} = ${percentage}%`);
                                    updateWidget(data.processedCount, data.totalCount, percentage);
                                }
                            });
                        }, 100);
                    });

                    // Clica no botão
                    submitButton.click();
                    console.log('✅ Botão clicado! Aguardando próxima página...');
                    console.log('👀 URL Observer irá detectar mudança e processar automaticamente');

                }, 800); // Aguarda 800ms após scroll para o botão

            } else {
                console.log('❌ Botão "Submit commercial" não encontrado após scroll');
                console.log('🔍 Tentando localizar botão no DOM...');
                console.log('Seletor testado: a#submitbutton');

                // Debug: lista todos os links com "submit" no ID ou classe
                const allSubmitLinks = document.querySelectorAll('a[id*="submit"], a[class*="submit"]');
                console.log('Links com "submit" encontrados:', allSubmitLinks.length);
                allSubmitLinks.forEach((link, index) => {
                    console.log(`Link ${index}:`, link.id, link.className, link.textContent.trim());
                });

                // Verifica se não há mais imagens (finalizado)
                if (document.body.textContent.includes('No files') ||
                    document.querySelector('.upload-list__empty')) {
                    console.log('🎉 Todas as imagens foram processadas!');
                    stopProcessing();
                    showNotification('Todas as imagens foram processadas!', 'success');
                } else {
                    // Tenta novamente após um delay
                    console.log('🔄 Tentando novamente em 1 segundo...');
                    setTimeout(() => processCurrentImage(), 1000);
                }
            }
        }, 1000); // Aguarda 1s para o scroll até o final completar
    }, config.delayBetweenClicks);
}

// Mostra notificação na página
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `dreamstime-auto-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;

    document.body.appendChild(notification);

    // Remove a notificação após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Mostra notificação GRANDE e persistente (não desaparece sozinha)
function showBigNotification(title, message, type = 'warning') {
    // Remove notificação anterior se existir
    const existingNotif = document.querySelector('.dreamstime-big-notification');
    if (existingNotif) existingNotif.remove();

    const notification = document.createElement('div');
    notification.className = 'dreamstime-big-notification';
    notification.innerHTML = `
    <div class="big-notif-header">
      <span class="big-notif-icon">${type === 'error' ? '⚠️' : '💡'}</span>
      <h2>${title}</h2>
      <button class="big-notif-close">✕</button>
    </div>
    <div class="big-notif-body">
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
  `;

    notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    color: #333;
    padding: 0;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    z-index: 99999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 500px;
    width: 90%;
    animation: bigNotifSlideIn 0.3s ease-out;
  `;

    // Adiciona estilos internos
    const style = document.createElement('style');
    style.textContent = `
    .big-notif-header {
      background: ${type === 'error' ? 'linear-gradient(135deg, #f44336, #d32f2f)' : 'linear-gradient(135deg, #FF9800, #F57C00)'};
      color: white;
      padding: 20px;
      border-radius: 16px 16px 0 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .big-notif-icon {
      font-size: 32px;
    }

    .big-notif-header h2 {
      margin: 0;
      flex: 1;
      font-size: 18px;
      font-weight: 700;
    }

    .big-notif-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .big-notif-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .big-notif-body {
      padding: 24px;
      line-height: 1.6;
      font-size: 15px;
    }

    .big-notif-body p {
      margin: 0;
    }

    @keyframes bigNotifSlideIn {
      from {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0;
      }
      to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }
  `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Fecha ao clicar no X
    notification.querySelector('.big-notif-close').addEventListener('click', () => {
        notification.style.animation = 'bigNotifSlideIn 0.2s ease-out reverse';
        setTimeout(() => notification.remove(), 200);
    });

    // Fecha ao clicar fora
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            notification.style.animation = 'bigNotifSlideIn 0.2s ease-out reverse';
            setTimeout(() => notification.remove(), 200);
        }
    });
}

// Adiciona estilos de animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Ao carregar a página, verifica se deve continuar processando
console.log('🔍 Verificando storage para retomar processamento...');
chrome.storage.local.get(['isRunning', 'isPaused'], (data) => {
    console.log('💾 Storage:', data);
    console.log('📍 URL atual:', window.location.href);

    if (data.isRunning && !data.isPaused) {
        console.log('⚡ Retomando processamento automático...');

        // Aguarda a página estar completamente carregada
        if (document.readyState === 'loading') {
            console.log('⏳ Aguardando página carregar (readyState: loading)...');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('✅ Página carregada (DOMContentLoaded), iniciando em 500ms');
                setTimeout(() => startProcessing(), 500);
            });
        } else {
            console.log('✅ Página já carregada (readyState:', document.readyState, '), iniciando em 500ms');
            setTimeout(() => startProcessing(), 500);
        }
    } else {
        console.log('❌ Automação não está rodando');
        console.log('   isRunning:', data.isRunning);
        console.log('   isPaused:', data.isPaused);
    }
});
