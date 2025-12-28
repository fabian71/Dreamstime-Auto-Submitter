# ⚠️ LEIA ISTO ANTES DE USAR

## 🔴 ERRO MAIS COMUM:

```
"Could not establish connection. Receiving end does not exist"
```

### O que significa?
→ O content script NÃO está carregado na página

### Por que acontece?
→ Você NÃO fechou e abriu a aba após recarregar a extensão

---

## ✅ SEQUÊNCIA CORRETA (SEMPRE):

```
┌─────────────────────────────────────┐
│ 1. Mexeu nos arquivos da extensão?  │
│    → chrome://extensions/           │
│    → Clique RECARREGAR 🔄           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 2. FECHE todas abas do Dreamstime   │
│    → Clique no X de CADA aba        │
│    → NÃO DÊ SÓ F5!                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 3. Abra NOVA aba                    │
│    → dreamstime.com/upload          │
│    → Aguarde carregar               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 4. Pressione F12                    │
│    → Procure no console:            │
│    → "🚀 Content Script carregado"  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 5. Se aparecer ✅                   │
│    → Use a extensão!                │
│                                     │
│ 6. Se NÃO aparecer ❌               │
│    → Volte ao passo 1               │
└─────────────────────────────────────┘
```

---

## 🚫 O QUE **NÃO** FUNCIONA:

❌ Dar F5 na aba antiga  
❌ Dar Ctrl+R na aba antiga  
❌ Dar Ctrl+Shift+R na aba antiga  
❌ Recarregar pelo menu do navegador  

## ✅ O QUE **FUNCIONA**:

✅ Fechar a aba completamente (X)  
✅ Abrir NOVA aba  
✅ Navegar para dreamstime.com/upload  

---

## 💡 REGRA DE OURO:

```
Sempre que recarregar a extensão:
→ FECHE as abas do Dreamstime
→ ABRA novas abas

NÃO recarrega = NÃO funciona! ⚠️
```

---

## 🧪 TESTE RÁPIDO:

Abra o console (F12) e digite:

```javascript
isProcessing
```

**Se retornar:** `false` ou `true` → ✅ Carregado!  
**Se retornar:** `undefined` → ❌ NÃO carregado!

---

## 📞 AINDA COM PROBLEMA?

1. Feche o Chrome completamente
2. Abra o Chrome novamente
3. Vá para chrome://extensions/
4. Recarregue a extensão
5. Abra dreamstime.com/upload (NOVA aba)
6. Teste novamente

**Isso SEMPRE funciona!** 😊
