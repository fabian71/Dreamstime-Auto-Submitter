# 🔄 SIGA ESTES PASSOS AGORA:

## ✅ PASSO 1: Recarregue a Extensão

1. Abra uma nova aba
2. Digite: `chrome://extensions/`
3. Encontre **"Dreamstime Auto Submitter"**
4. Clique no ícone de **RECARREGAR** 🔄 (botão circular)

---

## ✅ PASSO 2: Vá para o Dreamstime  

1. Abra uma nova aba
2. Acesse: `https://www.dreamstime.com/upload`
3. Faça login se necessário
4. Aguarde a página carregar **COMPLETAMENTE**

---

## ✅ PASSO 3: Verifique se o Content Script Carregou

1. Na página do Dreamstime, pressione **F12**
2. Clique na aba **"Console"** 
3. Procure pela mensagem:
   ```
   ✅ Dreamstime Auto Submitter - Content Script carregado
   ```
4. Se aparecer: **PERFEITO!** Pode fechar o console
5. Se NÃO aparecer: Pressione **F5** para recarregar a página

---

## ✅ PASSO 4: Use a Extensão

1. Clique no ícone da extensão (barra de ferramentas)
2. O popup vai abrir
3. Se ver aviso amarelo "Você precisa estar em dreamstime.com/upload":
   - Recarregue a página (F5)
4. Clique em **"Iniciar Automação"** ▶️
5. **PRONTO!** A automação deve começar! 🎉

---

## 🎯 O que Você Deve Ver

### No Popup da Extensão:
```
Status: Em execução... (bolinha verde)
Processadas: 1 / 49
[███░░░░░░░] 6%
```

### No Console (F12):
```
Dreamstime Auto Submitter - Content Script carregado
Iniciando processamento automático
Total de imagens detectado: 49
Processando imagem atual...
Botão "Submit commercial" encontrado, clicando...
URL mudou, processando próxima imagem...
```

### Na Página:
- Notificações verdes aparecem no canto superior direito
- A página avança automaticamente para a próxima imagem
- O botão Submit é clicado automaticamente

---

## ❌ Se AINDA não funcionar

### Verifique:
- [ ] Extensão recarregada em chrome://extensions/
- [ ] Página do Dreamstime recarregada (F5)
- [ ] Está em dreamstime.com/**upload** (não outra URL)
- [ ] Console mostra "Content Script carregado"
- [ ] Não há erro vermelho em chrome://extensions/

### Teste Manual:
Abra o console (F12) e digite:
```javascript
isProcessing
```

Se retornar `false` ou `true`: ✅ Content script está carregado!  
Se retornar `undefined`: ❌ Recarregue a página

---

## 💡 RESUMO RÁPIDO

```
1. chrome://extensions/ → Recarregar extensão 🔄
2. dreamstime.com/upload → Pressionar F5
3. F12 → Verificar "Content Script carregado"
4. Clicar ícone extensão → Iniciar Automação ▶️
5. SUCESSO! 🎉
```

---

## 📞 Ainda com problemas?

Feche **TODAS** as abas do Dreamstime e:
1. Recarregue a extensão em chrome://extensions/
2. Abra UMA nova aba do Dreamstime
3. Tente novamente

**Isso sempre funciona!** 😊
