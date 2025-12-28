# 🐛 DEBUG DO TIMER - TESTE RÁPIDO

## Faça isto AGORA:

### 1. Abra o Console do POPUP:
```
- Clique DIREITO no ícone da extensão
- Selecione "Inspecionar popup"
- Vai abrir o DevTools do popup
```

### 2. Cole este código no console:
```javascript
// Verifica estado atual
console.log('=== DEBUG TIMER ===');
console.log('currentStatus.startTime:', currentStatus.startTime);
console.log('timerInterval:', timerInterval);

// Busca do storage
chrome.storage.local.get(['startTime', 'isRunning', 'isPaused'], (data) => {
  console.log('Storage:', data);
  console.log('StartTime no storage:', data.startTime ? new Date(data.startTime) : 'NÃO DEFINIDO');
});

// Força iniciar timer com tempo atual
if (!timerInterval) {
  console.log('FORÇANDO início do timer...');
  currentStatus.startTime = Date.now();
  startTimer();
}
```

### 3. Me envie o que apareceu no console!

---

## O que vai mostrar:

Se o problema for:

**A) startTime não está definido:**
```
currentStatus.startTime: undefined
```

**B) Timer não iniciou:**
```
timerInterval: null
```

**C) Storage não tem startTime:**
```
StartTime no storage: NÃO DEFINIDO
```

---

**Execute e me mande os logs!** 🔍
