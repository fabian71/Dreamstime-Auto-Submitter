// Floating Widget para Dreamstime - Exibe progresso na página

let floatingWidget = null;
let widgetMinimized = false;
let widgetStartTime = null;
let widgetTimerInterval = null;

// Estado do widget (para preservar dados ao minimizar/maximizar)
let widgetState = {
  processed: 0,
  total: 0,
  percentage: 0
};

// Cria o widget flutuante
function createFloatingWidget() {
  if (floatingWidget) return; // Já existe

  console.log('🎨 Criando widget flutuante...');

  // Container principal
  floatingWidget = document.createElement('div');
  floatingWidget.id = 'dreamstime-auto-widget';
  floatingWidget.innerHTML = `
    <div class="widget-header">
      <div class="widget-title">
        <span class="widget-icon">🚀</span>
        <span>Dreamstime Auto</span>
      </div>
    </div>
    
    <div class="widget-body">
      <div class="widget-stats">
        <div class="widget-stat">
          <span class="widget-stat-label">Processadas</span>
          <span class="widget-stat-value" id="widget-processed">0 / 0</span>
        </div>
        <div class="widget-stat">
          <span class="widget-stat-label">Tempo</span>
          <span class="widget-stat-value" id="widget-time">00:00</span>
        </div>
      </div>
      
      <div class="widget-progress">
        <div class="widget-progress-bar">
          <div class="widget-progress-fill" id="widget-progress-fill"></div>
        </div>
        <div class="widget-progress-text" id="widget-progress-text">0%</div>
      </div>
      
      <div class="widget-actions">
        <button class="widget-btn widget-pause" id="widget-pause-btn">
          <span>⏸️</span> Pausar
        </button>
        <button class="widget-btn widget-continue" id="widget-continue-btn" style="display: none;">
          <span>▶️</span> Continuar
        </button>
      </div>

      <div class="widget-footer">
        Gosta do projeto? ❤️ <a href="https://ko-fi.com/dentparanoide" target="_blank">Me paga um cafezinho</a>
      </div>
    </div>
  `;

  // Adiciona estilos
  const widgetStyles = document.createElement('style');
  widgetStyles.textContent = `
    #dreamstime-auto-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 320px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      z-index: 9999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: slideInUp 0.4s ease-out;
    }

    @keyframes slideInUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px 16px 0 0;
      transition: all 0.3s;
    }

    .widget-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 15px;
      transition: all 0.3s;
    }

    .widget-icon {
      font-size: 18px;
      transition: all 0.3s;
    }

    .widget-controls {
      display: flex;
      gap: 6px;
    }

    .widget-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      padding: 8px 12px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .widget-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .widget-btn:active {
      transform: scale(0.95);
    }

    .widget-minimize {
      width: 32px;
      height: 32px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .widget-body {
      padding: 16px;
    }

    .widget-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }

    .widget-stat {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      padding: 12px;
      border-radius: 10px;
      text-align: center;
    }

    .widget-stat-label {
      display: block;
      font-size: 11px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .widget-stat-value {
      display: block;
      font-size: 18px;
      font-weight: 800;
      line-height: 1;
    }

    .widget-progress {
      margin-bottom: 16px;
    }

    .widget-progress-bar {
      width: 100%;
      height: 24px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .widget-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #45a049);
      border-radius: 12px;
      width: 0%;
      transition: width 0.5s ease;
      position: relative;
      overflow: hidden;
    }

    .widget-progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .widget-progress-text {
      text-align: center;
      margin-top: 8px;
      font-size: 13px;
      font-weight: 700;
    }

    .widget-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .widget-pause {
      flex: 1;
      background: linear-gradient(135deg, #FF9800, #F57C00);
      justify-content: center;
    }

    .widget-continue {
      flex: 1;
      background: linear-gradient(135deg, #2196F3, #1976D2);
      justify-content: center;
    }

    .widget-btn span {
      font-size: 16px;
    }

    .widget-footer {
      padding: 12px 0 0 0;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      text-align: center;
      font-size: 11px;
      opacity: 0.9;
      line-height: 1.5;
    }

    .widget-footer a {
      color: #FFD700;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }

    .widget-footer a:hover {
      color: #FFC700;
      text-decoration: underline;
    }
  `;

  document.head.appendChild(widgetStyles);
  document.body.appendChild(floatingWidget);

  // Event listeners
  floatingWidget.querySelector('#widget-pause-btn').addEventListener('click', pauseFromWidget);
  floatingWidget.querySelector('#widget-continue-btn').addEventListener('click', continueFromWidget);

  // Torna o widget arrastável
  makeWidgetDraggable();

  console.log('✅ Widget criado com sucesso!');
}

// Remove o widget
function removeFloatingWidget() {
  if (floatingWidget) {
    floatingWidget.remove();
    floatingWidget = null;
    stopWidgetTimer();
  }
}

// Minimiza/Maximiza widget
function toggleWidgetMinimize() {
  widgetMinimized = !widgetMinimized;
  if (widgetMinimized) {
    floatingWidget.classList.add('minimized');
    floatingWidget.querySelector('.widget-minimize').textContent = '➕';
    floatingWidget.querySelector('.widget-minimize').title = 'Maximizar';
  } else {
    floatingWidget.classList.remove('minimized');
    floatingWidget.querySelector('.widget-minimize').textContent = '➖';
    floatingWidget.querySelector('.widget-minimize').title = 'Minimizar';

    // Restaura valores ao maximizar
    setTimeout(() => {
      updateWidget(widgetState.processed, widgetState.total, widgetState.percentage);
    }, 100);
  }
}

// Atualiza widget
function updateWidget(processed, total, percentage) {
  if (!floatingWidget) return;

  // Valida valores
  processed = parseInt(processed) || 0;
  total = parseInt(total) || 0;
  percentage = parseInt(percentage) || 0;

  // Armazena no estado
  widgetState.processed = processed;
  widgetState.total = total;
  widgetState.percentage = percentage;

  // Atualiza DOM
  const processedEl = document.getElementById('widget-processed');
  const fillEl = document.getElementById('widget-progress-fill');
  const textEl = document.getElementById('widget-progress-text');

  if (processedEl) {
    processedEl.textContent = `${processed} / ${total}`;
  }

  if (fillEl) {
    fillEl.style.width = `${percentage}%`;
  }

  if (textEl) {
    textEl.textContent = `${percentage}%`;
  }
}

// Timer do widget
function startWidgetTimer() {
  if (widgetTimerInterval) return;

  widgetStartTime = Date.now();

  widgetTimerInterval = setInterval(() => {
    if (!floatingWidget) return;

    const elapsed = Date.now() - widgetStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);

    document.getElementById('widget-time').textContent =
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

function stopWidgetTimer() {
  if (widgetTimerInterval) {
    clearInterval(widgetTimerInterval);
    widgetTimerInterval = null;
  }
}

// Pausar do widget
function pauseFromWidget() {
  chrome.runtime.sendMessage({ action: 'PAUSE_AUTOMATION' });
  floatingWidget.querySelector('#widget-pause-btn').style.display = 'none';
  floatingWidget.querySelector('#widget-continue-btn').style.display = 'flex';
  stopWidgetTimer();
}

// Continuar do widget
function continueFromWidget() {
  chrome.runtime.sendMessage({ action: 'CONTINUE_AUTOMATION' });
  floatingWidget.querySelector('#widget-pause-btn').style.display = 'flex';
  floatingWidget.querySelector('#widget-continue-btn').style.display = 'none';
  startWidgetTimer();
}

// Torna widget arrastável
function makeWidgetDraggable() {
  const header = floatingWidget.querySelector('.widget-header');
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  header.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    if (e.target.classList.contains('widget-minimize') ||
      e.target.closest('.widget-minimize')) {
      return; // Não arrasta se clicar no botão minimizar
    }

    initialX = e.clientX - floatingWidget.offsetLeft;
    initialY = e.clientY - floatingWidget.offsetTop;

    if (e.target === header || header.contains(e.target)) {
      isDragging = true;
      header.style.cursor = 'grabbing';
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      // Limita às bordas da janela
      const maxX = window.innerWidth - floatingWidget.offsetWidth;
      const maxY = window.innerHeight - floatingWidget.offsetHeight;

      currentX = Math.max(0, Math.min(currentX, maxX));
      currentY = Math.max(0, Math.min(currentY, maxY));

      floatingWidget.style.left = currentX + 'px';
      floatingWidget.style.top = currentY + 'px';
      floatingWidget.style.right = 'auto';
      floatingWidget.style.bottom = 'auto';
    }
  }

  function dragEnd() {
    isDragging = false;
    header.style.cursor = 'move';
  }
}

// Exporta funções para uso no content script principal
window.createFloatingWidget = createFloatingWidget;
window.removeFloatingWidget = removeFloatingWidget;
window.updateWidget = updateWidget;
window.startWidgetTimer = startWidgetTimer;
window.stopWidgetTimer = stopWidgetTimer;
