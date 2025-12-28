# 🚨 ERRO: "Could not establish connection"

## O que significa?

Este erro acontece quando o **content script** não está carregado na página. Isso é NORMAL na primeira vez ou após atualizar a extensão.

## ✅ SOLUÇÃO (3 passos simples)

### 1️⃣ Recarregue a Extensão
```
chrome://extensions/
→ Encontre "Dreamstime Auto Submitter"  
→ Clique no ícone de RECARREGAR (🔄)
```

### 2️⃣ Recarregue a Página do Dreamstime
```
Vá para dreamstime.com/upload
→ Pressione F5 ou Ctrl+R
→ Aguarde carregar completamente
```

### 3️⃣ Tente Novamente
```
Clique no ícone da extensão
→ Clique em "Iniciar Automação" ▶️
→ Pronto! Deve funcionar agora ✨
```

---

## 🔍 Por que isso acontece?

O **content script** é injetado automaticamente apenas em:
- Novas abas abertas APÓS instalar a extensão
- Páginas recarregadas APÓS instalar a extensão

Se você estava com a aba aberta ANTES de instalar, ela não tem o content script carregado.

**Solução:** Basta recarregar a página (F5) 😊

---

## ⚠️ Se ainda não funcionar

### Verifique:
1. Está em `dreamstime.com/upload` (não outra URL)?
2. A extensão está ativada em chrome://extensions/?
3. Não há erro vermelho na extensão em chrome://extensions/?

### Teste o Console:
1. Abra o console na página do Dreamstime (F12)
2. Vá para a aba "Console"
3. Procure por: `"Dreamstime Auto Submitter - Content Script carregado"`
4. Se aparecer: ✅ Content script está OK
5. Se NÃO aparecer: ❌ Recarregue a página novamente

### Dica Pro:
Sempre que atualizar a extensão no `chrome://extensions/`, **recarregue TODAS as abas** do Dreamstime abertas.

---

## 📞 Debug Avançado

Se mesmo assim não funcionar, abra o console (F12) e digite:

```javascript
// Verifica se o content script está carregado
console.log('Content script presente?', typeof isProcessing !== 'undefined');

// Força reload do content script (caso extremo)
location.reload();
```

---

## ✅ Checklist de Funcionamento

- [ ] Extensão instalada e ativada
- [ ] Extensão recarregada após qualquer mudança
- [ ] Está em dreamstime.com/upload
- [ ] Página recarregada (F5) após instalar extensão
- [ ] Console mostra "Content Script carregado"
- [ ] Popup não mostra aviso amarelo de URL incorreta

**Se tudo acima está OK:** A extensão deve funcionar! 🎉

---

## 💡 Dica Final

Deixe o console aberto (F12) enquanto usa a extensão. Assim você vê:
- ✅ "Content Script carregado"
- ✅ "Iniciando processamento automático"
- ✅ "Botão Submit commercial encontrado"
- ✅ "URL mudou, processando próxima imagem"

Isso ajuda a acompanhar o que está acontecendo! 👀
