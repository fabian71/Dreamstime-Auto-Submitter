// Background Service Worker para a extensão Dreamstime Auto Submitter

// Estado da automação
let automationState = {
  isRunning: false,
  isPaused: false,
  isCompleted: false,
  processedCount: 0,
  totalCount: 0,
  startTime: null,
  config: {
    delayBetweenClicks: 2000 // 2 segundos de delay padrão
  }
};

// Listener para mensagens do popup e content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background recebeu mensagem:', message);

  switch (message.action) {
    case 'START_AUTOMATION':
      handleStartAutomation(message.config);
      sendResponse({ success: true, message: 'Automação iniciada' });
      break;

    case 'PAUSE_AUTOMATION':
      handlePauseAutomation();
      sendResponse({ success: true, message: 'Automação pausada' });
      break;

    case 'CONTINUE_AUTOMATION':
      handleContinueAutomation();
      sendResponse({ success: true, message: 'Automação retomada' });
      break;

    case 'STOP_AUTOMATION':
      handleStopAutomation();
      sendResponse({ success: true, message: 'Automação parada' });
      break;

    case 'GET_STATUS':
      sendResponse({
        success: true,
        isRunning: automationState.isRunning,
        isPaused: automationState.isPaused,
        processedCount: automationState.processedCount,
        totalCount: automationState.totalCount
      });
      break;

    case 'UPDATE_TOTAL':
      automationState.totalCount = message.totalCount;
      chrome.storage.local.set({ totalCount: automationState.totalCount });
      sendResponse({ success: true });
      break;

    case 'IMAGE_SUBMITTED':
      handleImageSubmitted();
      sendResponse({ success: true });
      break;

    case 'UPDATE_CONFIG':
      automationState.config = { ...automationState.config, ...message.config };
      chrome.storage.local.set({ config: automationState.config });
      sendResponse({ success: true });
      break;

    case 'RESET_ALL':
      console.log('🔄 Background: Resetando TUDO');
      automationState.isRunning = false;
      automationState.isPaused = false;
      automationState.isCompleted = false;
      automationState.processedCount = 0;
      automationState.totalCount = 0;
      automationState.startTime = null;

      chrome.storage.local.clear(() => {
        console.log('🗑️ Background: Storage limpo');
      });

      sendResponse({ success: true });
      break;
  }

  return true; // Mantém o canal de mensagem aberto para resposta assíncrona
});

// Incrementa o contador de imagens processadas
function handleImageSubmitted() {
  automationState.processedCount++;
  console.log('Imagem submetida. Total processado:', automationState.processedCount);

  chrome.storage.local.set({
    processedCount: automationState.processedCount
  });

  // Envia atualização para o content script atualizar o widget
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      console.warn('⚠️ Nenhuma tab para atualizar widget');
      return;
    }

    if (tabs[0]) {
      const percentage = automationState.totalCount > 0
        ? Math.round((automationState.processedCount / automationState.totalCount) * 100)
        : 0;

      console.log(`📤 Enviando UPDATE_WIDGET: ${automationState.processedCount}/${automationState.totalCount} = ${percentage}%`);

      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'UPDATE_WIDGET',
        processed: automationState.processedCount,
        total: automationState.totalCount,
        percentage: percentage
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn('⚠️ Widget não disponível:', chrome.runtime.lastError.message);
        }
      });
    }
  });
}

// Inicia a automação
function handleStartAutomation(config) {
  console.log('Iniciando automação com config:', config);
  automationState.isRunning = true;
  automationState.isPaused = false;
  automationState.isCompleted = false;
  automationState.processedCount = 0;

  // Salva startTime
  const startTime = Date.now();
  automationState.startTime = startTime;

  if (config) {
    automationState.config = { ...automationState.config, ...config };
  }

  // Salva config no storage
  chrome.storage.local.set({
    isRunning: true,
    isPaused: false,
    processedCount: 0,
    startTime: startTime,
    config: automationState.config
  });

  // Envia mensagem para o content script começar
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'START_PROCESSING',
        config: automationState.config
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Erro ao enviar mensagem para content script:', chrome.runtime.lastError.message);
          console.log('Dica: Recarregue a página do Dreamstime');
          // Reverte o estado
          automationState.isRunning = false;
          chrome.storage.local.set({ isRunning: false });
        } else {
          console.log('Mensagem enviada com sucesso para content script');
        }
      });
    }
  });
}

// Envia comando para o content script na tab ativa
function sendToContentScript(action, config = null) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      console.warn('⚠️ Nenhuma tab ativa encontrada');
      return;
    }

    const message = config ? { action, config } : { action };

    chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('⚠️ Erro ao enviar mensagem:', chrome.runtime.lastError.message);
        return;
      }

      if (response && response.success) {
        console.log('✅ Mensagem enviada:', action);
      }
    });
  });
}

// Pausa a automação
function handlePauseAutomation() {
  console.log('Pausando automação');
  automationState.isPaused = true;

  chrome.storage.local.set({ isPaused: true });

  // Envia mensagem para o content script pausar
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'PAUSE_PROCESSING'
      });
    }
  });
}

// Continua a automação
function handleContinueAutomation() {
  console.log('Continuando automação');
  automationState.isPaused = false;

  chrome.storage.local.set({ isPaused: false });

  // Envia mensagem para o content script continuar
  sendToContentScript('CONTINUE_PROCESSING', automationState.config);
}

// Para a automação
function handleStopAutomation() {
  console.log('Parando automação');
  automationState.isRunning = false;
  automationState.isPaused = false;

  chrome.storage.local.set({ isRunning: false, isPaused: false });

  // Envia mensagem para o content script parar
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'STOP_PROCESSING'
      });
    }
  });
}

// Restaura o estado quando o service worker acorda
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['isRunning', 'isPaused', 'config', 'processedCount', 'totalCount'], (data) => {
    if (data.isRunning) {
      automationState.isRunning = data.isRunning;
      automationState.isPaused = data.isPaused || false;
      automationState.processedCount = data.processedCount || 0;
      automationState.totalCount = data.totalCount || 0;
    }
    if (data.config) {
      automationState.config = data.config;
    }
  });
});
