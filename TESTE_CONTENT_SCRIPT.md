# 🧪 TESTE: Content Script Carregado?

Abra o console na página do Dreamstime (F12) e cole este código:

```javascript
// Teste se o content script está carregado
if (typeof isProcessing !== 'undefined') {
  console.log('✅ CONTENT SCRIPT CARREGADO!');
  console.log('Estado:', {
    isProcessing: isProcessing,
    isPaused: isPaused,
    config: config
  });
} else {
  console.log('❌ CONTENT SCRIPT NÃO CARREGADO!');
  console.log('SOLUÇÃO: Feche esta aba e abra uma nova aba do Dreamstime');
}
```

---

## ✅ Se aparecer "CONTENT SCRIPT CARREGADO":
→ Tudo certo! Pode usar a extensão normalmente

## ❌ Se aparecer "CONTENT SCRIPT NÃO CARREGADO":
→ Faça isto:
1. FECHE esta aba completamente
2. Vá para chrome://extensions/
3. Recarregue a extensão (ícone 🔄)
4. Abra NOVA aba do dreamstime.com/upload
5. Teste novamente

---

## 🎯 IMPORTANTE:

**O content script SÓ carrega em:**
- Abas abertas DEPOIS de instalar a extensão
- Abas abertas DEPOIS de recarregar a extensão
- Páginas recarregadas DEPOIS de instalar/recarregar extensão

**O content script NÃO carrega em:**
- Abas que já estavam abertas ANTES de instalar
- Abas que já estavam abertas ANTES de recarregar
- Mesmo se você der F5 na aba (precisa fechar e abrir nova)

---

## 📋 CHECKLIST:

- [ ] Extensão recarregada em chrome://extensions/
- [ ] Todas abas antigas do Dreamstime FECHADAS
- [ ] Nova aba aberta DEPOIS de recarregar
- [ ] Console (F12) mostra "🚀 Content Script carregado"
- [ ] Teste JavaScript retorna "✅ CONTENT SCRIPT CARREGADO"

**Só DEPOIS de tudo ✅ acima:** Use a extensão!
