// Popup Script - v1.2 com Timer e Reset

console.log('Popup script carregado v1.2');

// Elementos do DOM
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const continueBtn = document.getElementById('continueBtn');
const resetBtn = document.getElementById('resetBtn');
const delayInput = document.getElementById('delayInput');
const processedCount = document.getElementById('processedCount');
const totalCount = document.getElementById('totalCount');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Estado
let currentStatus = {
    isRunning: false,
    isPaused: false,
    isCompleted: false,
    processedCount: 0,
    totalCount: 0,
    startTime: null
};

let timerInterval = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    updateStatus();
    checkURL();

    // Atualiza status e URL a cada 1 segundo
    setInterval(() => {
        updateStatus();
        checkURL();
    }, 1000);
});

// Verifica se está na URL correta
function checkURL() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const urlWarning = document.getElementById('urlWarning');

        if (!currentTab || !currentTab.url || !currentTab.url.includes('dreamstime.com/upload')) {
            if (urlWarning) {
                urlWarning.style.display = 'block';
            }
            if (!currentStatus.isRunning) {
                startBtn.disabled = true;
                startBtn.title = 'Vá para dreamstime.com/upload primeiro';
            }
        } else {
            if (urlWarning) {
                urlWarning.style.display = 'none';
            }
            if (!currentStatus.isRunning && !currentStatus.isCompleted) {
                startBtn.disabled = false;
                startBtn.title = '';
            }
        }
    });
}

// Event Listeners
startBtn.addEventListener('click', startAutomation);
pauseBtn.addEventListener('click', pauseAutomation);
continueBtn.addEventListener('click', continueAutomation);
resetBtn.addEventListener('click', resetAll);
document.getElementById('resetBtn2').addEventListener('click', resetAll);
delayInput.addEventListener('change', saveConfig);

// Carrega configuração salva
function loadConfig() {
    chrome.storage.local.get(['config', 'startTime', 'isRunning', 'isPaused'], (data) => {
        if (data.config && data.config.delayBetweenClicks) {
            delayInput.value = data.config.delayBetweenClicks;
        }
        if (data.startTime) {
            console.log('✅ StartTime recuperado:', new Date(data.startTime));
            currentStatus.startTime = data.startTime;
            // Se está rodando e não pausado, inicia timer
            if (data.isRunning && !data.isPaused) {
                console.log('▶️ Iniciar timer - isRunning:', data.isRunning, 'isPaused:', data.isPaused);
                startTimer();
            }
        } else {
            console.log('❌ Nenhum startTime encontrado no storage');
        }
    });
}

// Salva configuração
function saveConfig() {
    const config = {
        delayBetweenClicks: parseInt(delayInput.value)
    };

    chrome.runtime.sendMessage({
        action: 'UPDATE_CONFIG',
        config: config
    });

    showFeedback('⚙️ Configuração salva!');
}

// Inicia automação
function startAutomation() {
    console.log('Iniciando automação...');

    // Verifica se está na página correta
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];

        if (!currentTab || !currentTab.url) {
            showError('❌ Não foi possível detectar a aba ativa');
            return;
        }

        if (!currentTab.url.includes('dreamstime.com/upload')) {
            showError('❌ Vá para: dreamstime.com/upload');
            return;
        }

        const config = {
            delayBetweenClicks: parseInt(delayInput.value)
        };

        // DEFINE E SALVA startTime IMEDIATAMENTE
        const startTime = Date.now();
        currentStatus.startTime = startTime;
        console.log('⏱️ [POPUP] startTime definido:', new Date(startTime));
        console.log('⏱️ [POPUP] currentStatus.startTime:', currentStatus.startTime);

        // Salva no storage
        chrome.storage.local.set({ startTime: startTime }, () => {
            console.log('✅ [POPUP] startTime salvo no storage');

            // Timer removido - só no widget
            // startTimer();
        });

        // Envia mensagem para o background
        chrome.runtime.sendMessage({
            action: 'START_AUTOMATION',
            config: config
        }, (response) => {
            // Verifica se houve erro de conexão
            if (chrome.runtime.lastError) {
                console.error('Erro de conexão:', chrome.runtime.lastError);
                showError('🔄 Recarregue a página (F5) e tente novamente');
                return; // NÃO fecha popup se houver erro
            }

            if (response && response.success) {
                console.log('✅ Automação iniciada com sucesso');
                updateUIState(true);
                showFeedback('✅ Automação iniciada!');

                // SÓ FECHA se tudo deu certo
                setTimeout(() => {
                    console.log('🚪 Fechando popup...');
                    window.close();
                }, 500);
            } else {
                // Se não teve sucesso, mostra erro e NÃO fecha
                console.error('❌ Falha ao iniciar automação');
                showError('❌ Erro ao iniciar. Verifique se está na página correta.');
            }
        });
    });
}

// Pausa automação
function pauseAutomation() {
    console.log('Pausando automação...');

    chrome.runtime.sendMessage({
        action: 'PAUSE_AUTOMATION'
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('Erro:', chrome.runtime.lastError);
            return;
        }

        if (response && response.success) {
            console.log('Automação pausada com sucesso');
            currentStatus.isPaused = true;
            updateUIState(false, true);
            // stopTimer(); // Timer removido
            showFeedback('⏸️ Automação pausada!');
        }
    });
}

// Continua automação
function continueAutomation() {
    console.log('Continuando automação...');

    chrome.runtime.sendMessage({
        action: 'CONTINUE_AUTOMATION'
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('Erro:', chrome.runtime.lastError);
            showError('🔄 Recarregue a página e tente novamente');
            return;
        }

        if (response && response.success) {
            console.log('Automação retomada com sucesso');
            currentStatus.isPaused = false;
            updateUIState(true);
            // stopTimer(); // Timer removido
            showFeedback('▶️ Automação retomada!');
        }
    });
}

// Reseta tudo
function resetAll() {
    console.log('🔄 Resetando TUDO...');

    // Timer removido
    // stopTimer();

    // Reseta estado local
    currentStatus = {
        isRunning: false,
        isPaused: false,
        isCompleted: false,
        processedCount: 0,
        totalCount: 0,
        startTime: null
    };

    // Envia RESET para background
    chrome.runtime.sendMessage({
        action: 'RESET_ALL'
    }, (response) => {
        console.log('✅ Background resetado');

        // Força atualização imediata da UI
        // elapsedTime.textContent = '00:00'; // REMOVIDO - sem timer no popup
        processedCount.textContent = '0';
        totalCount.textContent = '';
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        statusDot.className = 'status-dot';
        statusText.textContent = 'Aguardando...';

        // Reseta botões
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        continueBtn.disabled = true;
        delayInput.disabled = false;

        console.log('✅ Reset completo!');
        showFeedback('🔄 Tudo resetado!');
    });
}

// Atualiza status
function updateStatus() {
    chrome.runtime.sendMessage({
        action: 'GET_STATUS'
    }, (response) => {
        if (chrome.runtime.lastError) {
            // Ignora erro silenciosamente no polling
            return;
        }

        if (response && response.success) {
            const wasCompleted = currentStatus.isCompleted;

            currentStatus = {
                isRunning: response.isRunning,
                isPaused: response.isPaused || false,
                isCompleted: response.isCompleted || false,
                processedCount: response.processedCount,
                totalCount: response.totalCount || 0
            };

            // Se acabou de completar, para o timer
            if (!wasCompleted && currentStatus.isCompleted) {
                stopTimer();
            }

            updateUIState(currentStatus.isRunning, currentStatus.isPaused, currentStatus.isCompleted);
            processedCount.textContent = currentStatus.processedCount;

            // Atualiza total
            if (currentStatus.totalCount > 0) {
                totalCount.textContent = ` / ${currentStatus.totalCount} `;

                // Atualiza barra de progresso
                const percentage = Math.round((currentStatus.processedCount / currentStatus.totalCount) * 100);
                progressFill.style.width = `${percentage}% `;
                progressText.textContent = `${percentage}% `;
            } else {
                totalCount.textContent = '';
                progressFill.style.width = '0%';
                progressText.textContent = '0%';
            }
        }
    });
}

// Atualiza estado da UI
function updateUIState(isRunning, isPaused = false, isCompleted = false) {
    if (isCompleted) {
        // Completo
        statusDot.className = 'status-dot completed';
        statusText.textContent = '✅ Concluído!';
        startBtn.disabled = true;
        pauseBtn.disabled = true;
        continueBtn.disabled = true;
        delayInput.disabled = true;
    } else if (isRunning && !isPaused) {
        // Rodando
        statusDot.className = 'status-dot running';
        statusText.textContent = 'Em execução...';
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        continueBtn.disabled = true;
        delayInput.disabled = true;
    } else if (isPaused) {
        // Pausado
        statusDot.className = 'status-dot paused';
        statusText.textContent = 'Pausado';
        startBtn.disabled = true;
        pauseBtn.disabled = true;
        continueBtn.disabled = false;
        delayInput.disabled = true;
    } else {
        // Parado
        statusDot.className = 'status-dot';
        statusText.textContent = 'Aguardando...';
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        continueBtn.disabled = true;
        delayInput.disabled = false;
    }
}

// Timer removido - agora só no widget flutuante

// Mostra feedback visual
function showFeedback(message) {
    createFeedback(message, 'rgba(76, 175, 80, 0.95)');
}

// Mostra erro visual
function showError(message) {
    createFeedback(message, 'rgba(244, 67, 54, 0.95)');
}

// Cria feedback/erro
function createFeedback(message, backgroundColor) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    feedback.textContent = message;
    feedback.style.cssText = `
position: fixed;
top: 10px;
left: 50 %;
transform: translateX(-50 %);
background: ${backgroundColor};
color: white;
padding: 12px 24px;
border - radius: 8px;
font - size: 13px;
font - weight: 600;
z - index: 10000;
animation: slideDown 0.3s ease - out;
box - shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
max - width: 350px;
text - align: center;
line - height: 1.4;
`;

    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

// Adiciona estilos de animação
const style = document.createElement('style');
style.textContent = `
@keyframes slideDown {
    from {
        transform: translateX(-50 %) translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateX(-50 %) translateY(0);
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateX(-50 %) translateY(0);
        opacity: 1;
    }
    to {
        transform: translateX(-50 %) translateY(-50px);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);
