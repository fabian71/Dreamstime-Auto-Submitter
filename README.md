# 🚀 Dreamstime Auto Submitter

Extensão Chrome que automatiza o processo de submissão de imagens no Dreamstime.com, economizando horas de trabalho repetitivo.

![Version](https://img.shields.io/badge/version-1.2.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-extension-yellow.svg)

---

## 📋 Índice

- [Características](#-características)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Funcionalidades](#-funcionalidades)
- [Avisos Importantes](#-avisos-importantes)
- [Solução de Problemas](#-solução-de-problemas)
- [Suporte](#-suporte)

---

## ✨ Características

- ✅ **Automação completa** do processo de submissão
- ✅ **Widget flutuante** com progresso em tempo real
- ✅ **Validação automática** de títulos (máx. 130 caracteres)
- ✅ **Pausa e continuação** a qualquer momento
- ✅ **Contador de tempo** e progresso visual
- ✅ **Interface moderna** e intuitiva
- ✅ **Zero configuração complexa**

---

## ⚠️ Pré-requisitos

### **IMPORTANTE: Dados Devem Estar Preenchidos!**

A extensão **NÃO PREENCHE** os metadados das imagens. Ela apenas **AUTOMATIZA O CLIQUE** no botão "Submit".

**Antes de usar esta extensão, você DEVE:**

1. ✅ **Fazer upload das imagens** para o Dreamstime
2. ✅ **Preencher TODOS os campos** de cada imagem:
   - **Título** (máx. 130 caracteres)
   - **Descrição**
   - **Palavras-chave**
   - **Categorias**
   - **Releases** (se necessário)
   - **Outras informações** exigidas pelo Dreamstime

3. ✅ **Salvar os metadados** de cada imagem

**A extensão só funcionará se os dados já estiverem salvos!**

---

## 📥 Instalação

### Método 1: Instalação Manual (Recomendado)

1. **Baixe o código:**
   ```bash
   git clone https://github.com/fabian71/Dreamstime-Auto-Submitter.git
   ```
   
   Ou baixe o [ZIP direto do GitHub](https://github.com/fabian71/Dreamstime-Auto-Submitter/archive/refs/heads/main.zip)

2. **Abra o Chrome** e vá para:
   ```
   chrome://extensions/
   ```

3. **Ative o "Modo do desenvolvedor"** (canto superior direito)

4. **Clique em "Carregar sem compactação"**

5. **Selecione a pasta** onde você baixou a extensão

6. **Pronto!** A extensão está instalada ✅

---

## 🎯 Como Usar

### Passo 1: Prepare suas Imagens

1. Faça login no [Dreamstime.com](https://www.dreamstime.com)
2. Faça upload das suas imagens
3. **PREENCHA TODOS OS METADADOS** de cada imagem:
   - Título
   - Descrição
   - Palavras-chave (mínimo exigido pelo Dreamstime)
   - Categorias
   - Releases (se aplicável)
4. **SALVE** as informações de cada imagem

### Passo 2: Inicie a Automação

1. Vá para a página de uploads:
   ```
   https://www.dreamstime.com/upload
   ```

2. **Clique no ícone da extensão** na barra do Chrome

3. **Configure o delay** entre cliques (padrão: 2000ms)
   - Recomendado: entre 1000ms e 3000ms
   - Delays muito curtos podem causar problemas

4. **Clique em "Iniciar Automação"**

5. O popup fecha automaticamente e o processo começa!

### Passo 3: Acompanhe o Progresso

Um **widget flutuante** aparecerá na página mostrando:

- 📊 **Progresso**: Quantas imagens foram processadas
- ⏱️ **Tempo**: Tempo decorrido desde o início
- 📈 **Porcentagem**: Progresso visual em barra

### Passo 4: Controles

**Durante a execução, você pode:**

- ⏸️ **Pausar**: Para a automação temporariamente
- ▶️ **Continuar**: Retoma de onde parou
- 🔄 **Resetar**: Limpa tudo e volta ao início

---

## 🎨 Funcionalidades

### 1. Validação Automática de Título

Se um título tiver **mais de 130 caracteres**, a extensão:
- ⏸️ Pausa automaticamente
- 🚨 Mostra um modal grande de aviso
- 🔴 Destaca o campo com problema
- 📜 Rola até o campo para você corrigir

**Você deve:**
1. Editar o título para ≤ 130 caracteres
2. Salvar
3. Clicar em "Continuar" no popup da extensão

### 2. Widget Flutuante

- 📍 **Sempre visível** (z-index alto)
- 📊 **Progresso em tempo real**
- ⏱️ **Contador de tempo**
- 💚 **Design moderno** e não intrusivo
- 🔗 **Link para Ko-fi** (suporte ao desenvolvedor)

### 3. Detecção Inteligente

A extensão:
- ✅ Aguarda o AJAX carregar
- ✅ Detecta mudanças de URL automaticamente
- ✅ Processa imagens sequencialmente
- ✅ Atualiza progresso a cada submissão

---

## ⚠️ Avisos Importantes

### ⛔ O Que a Extensão NÃO Faz

- ❌ **NÃO preenche** título, descrição ou palavras-chave
- ❌ **NÃO seleciona** categorias
- ❌ **NÃO adiciona** releases
- ❌ **NÃO faz upload** de imagens

### ✅ O Que a Extensão FAZ

- ✅ **Clica automaticamente** no botão "Submit commercial"
- ✅ **Navega** entre as imagens
- ✅ **Valida** o comprimento do título
- ✅ **Mostra progresso** em tempo real
- ✅ **Permite pausar/continuar** o processo

### 🔒 Segurança

- 🔐 **Código aberto** - Você pode revisar todo o código
- 🚫 **Sem coleta de dados** - Nada é enviado para servidores externos
- ✅ **Executa localmente** - Tudo funciona no seu navegador
- 🛡️ **Sem permissões sensíveis** - Só acessa dreamstime.com

---

## 🐛 Solução de Problemas

### ❓ "A extensão não inicia"

**Solução:**
1. Verifique se está na página: `https://www.dreamstime.com/upload`
2. Recarregue a página (F5)
3. Recarregue a extensão em `chrome://extensions/`

### ❓ "Modal de título longo não aparece"

**Solução:**
1. Abra o console (F12)
2. Procure por erros
3. Verifique se há títulos realmente > 130 caracteres
4. Recarregue a extensão

### ❓ "Popup não fecha após iniciar"

**Causa:** Erro ao conectar com o content script

**Solução:**
1. Recarregue a página do Dreamstime (F5)
2. Recarregue a extensão
3. Tente novamente

### ❓ "Widget não aparece"

**Solução:**
1. Abra o console (F12)
2. Procure por erros no `widget.js`
3. Recarregue a página (F5)

### ❓ "Tempo fica em 00:00"

**Solução:**
1. Clique em "Resetar Tudo"
2. Inicie novamente

---

## 📊 Fluxo de Funcionamento

```
┌─────────────────────────────────────────┐
│  1. Usuário faz upload e preenche dados │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  2. Usuário vai para /upload e inicia   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  3. Extensão detecta total de imagens   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  4. Clica na primeira imagem            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  5. Valida título (≤ 130 chars)         │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
    ERRO │               │ OK
         ▼               ▼
┌──────────────┐  ┌──────────────┐
│ Pausa e      │  │ Clica Submit │
│ mostra modal │  └──────┬───────┘
└──────────────┘         │
                         ▼
              ┌─────────────────────┐
              │ Aguarda navegação   │
              └──────┬──────────────┘
                     │
                     ▼
              ┌─────────────────────┐
              │ Próxima imagem      │
              └─────────────────────┘
                     │
                     ▼
              (Repete até acabar)
```

---

## 💝 Suporte ao Projeto

Gostou da extensão? Considere me pagar um cafezinho! ☕

**[☕ Ko-fi: @dentparanoide](https://ko-fi.com/dentparanoide)**

---

## 📝 Changelog

### v1.2.1 (2025-12-28)
- ✅ Validação de título com modal
- ✅ Widget flutuante melhorado
- ✅ Timer removido do popup
- ✅ Correção de bugs de sincronização
- ✅ Tratamento de erros aprimorado

---

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Desenvolvido por:** Fabian

**GitHub:** [fabian71](https://github.com/fabian71)

**Ko-fi:** [dentparanoide](https://ko-fi.com/dentparanoide)

---

## ⭐ Gostou?

Se esta extensão te ajudou, considere:
- ⭐ Dar uma estrela no GitHub
- 🐛 Reportar bugs
- 💡 Sugerir melhorias
- ☕ Pagar um cafezinho

---

**Feito com ❤️ para a comunidade de fotógrafos do Dreamstime**
