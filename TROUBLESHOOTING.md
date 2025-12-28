# 🔧 SOLUÇÃO DE PROBLEMAS

## Problemas Comuns e Soluções

### ❌ "A extensão não aparece após instalação"

**Causa:** Falta de ícones ou erro no manifest.json

**Solução:**
1. Verifique se os 3 ícones existem na pasta `icons/`
2. Execute novamente: `powershell -ExecutionPolicy Bypass -File create_icons.ps1`
3. Recarregue a extensão em chrome://extensions/
4. Verifique se o "Modo desenvolvedor" está ativado

---

### ❌ "A automação não inicia"

**Causas possíveis:**
- Não está na página correta
- Não há imagens para processar
- Content script não carregou

**Soluções:**
1. Certifique-se de estar em: `https://www.dreamstime.com/upload`
2. Verifique se há imagens na lista
3. Recarregue a página (F5)
4. Abra o console (F12) e procure por erros
5. Tente desinstalar e reinstalar a extensão

---

### ❌ "A extensão para no meio do processo"

**Causas possíveis:**
- Conexão instável
- Delay muito curto
- Página não carregou completamente
- Service worker foi suspenso

**Soluções:**
1. Aumente o delay para 3000ms (3 segundos)
2. Verifique sua conexão de internet
3. Clique em "Parar" e depois "Iniciar" novamente
4. Recarregue a página e retome

---

### ❌ "O botão Submit não é clicado"

**Causas possíveis:**
- A estrutura da página mudou
- O botão tem um seletor diferente
- Problema de timing

**Soluções:**
1. Abra o console do navegador (F12)
2. Verifique se há mensagens de erro
3. Tente aumentar o delay
4. No console, digite: `document.querySelector('a#submitbutton')`
   - Se retornar `null`, o seletor mudou
5. Se mudou, reporte o problema

---

### ❌ "Erro ao clicar nos ícones"

**Causa:** Erro no script create_icons.ps1

**Solução:**
Execute este comando alternativo:

```powershell
# Cria ícones simples usando apenas pixel único
$sizes = @(16, 48, 128)
foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::FromArgb(102, 126, 234))
    $bmp.Save("c:\lab\extencao_navegador\dreamstime\icons\icon$size.png")
    $g.Dispose()
    $bmp.Dispose()
}
```

---

### ❌ "Service Worker inativo"

**Causa:** O Chrome suspende service workers após inatividade

**Solução:**
1. Em chrome://extensions/, clique em "Recarregar" na extensão
2. Ou feche e abra o popup da extensão
3. Isso reativa o service worker

---

### ❌ "Notificações não aparecem"

**Causa:** Problema no content script

**Solução:**
1. Verifique se o content script está ativo:
   - F12 → Console
   - Procure por: "Dreamstime Auto Submitter - Content Script carregado"
2. Se não aparecer, recarregue a página
3. Verifique se a URL corresponde ao padrão no manifest

---

### ❌ "Contador não atualiza"

**Causa:** Perda de comunicação entre scripts

**Solução:**
1. Feche e abra o popup novamente
2. O contador deve sincronizar
3. Se não funcionar, recarregue a página

---

## 🐛 Como Reportar Bugs

Se encontrar um problema não listado aqui:

1. **Abra o Console:** Pressione F12 → aba Console
2. **Copie os Erros:** Procure por mensagens em vermelho
3. **Anote o Comportamento:** O que você esperava vs. o que aconteceu
4. **Capture Screenshots:** Se possível, tire prints da tela

### Informações Úteis:
- Versão da extensão: v1.0.0
- Navegador e versão
- URL exata onde ocorreu o problema
- Passos para reproduzir

---

## 📋 Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Está usando Chrome ou Edge atualizado
- [ ] Está logado no Dreamstime
- [ ] Está na URL correta (dreamstime.com/upload)
- [ ] O modo desenvolvedor está ativado
- [ ] A extensão aparece em chrome://extensions/
- [ ] Os 3 ícones existem na pasta icons/
- [ ] Já tentou recarregar a página
- [ ] Já tentou recarregar a extensão
- [ ] Verificou o console por erros (F12)

---

## 🔍 Debugging Avançado

### Ver Logs do Content Script:
1. F12 → Console
2. Procure por mensagens com "Dreamstime" ou "Content script"

### Ver Logs do Background:
1. chrome://extensions/
2. Clique em "service worker" na extensão
3. Abre um console separado para o background

### Verificar Armazenamento:
```javascript
// No console:
chrome.storage.local.get(null, (data) => console.log(data))
```

### Limpar Armazenamento:
```javascript
// No console:
chrome.storage.local.clear()
```

---

## ✅ Tudo Funcionando?

Se tudo estiver funcionando bem:
- Ajuste o delay conforme sua preferência
- Monitore o processo periodicamente
- Aproveite a automação! 🎉

**Lembre-se:** Use com responsabilidade e monitore o processo!
