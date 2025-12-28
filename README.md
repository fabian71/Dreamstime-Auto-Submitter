# 🚀 Dreamstime Auto Submitter

Extensão para automatizar a submissão comercial de imagens no Dreamstime.

## 📋 Funcionalidades

- ✅ Clica automaticamente em cada imagem da lista de uploads
- ✅ Abre a página de edição da imagem
- ✅ Clica no botão "Submit commercial"
- ✅ Processa a próxima imagem automaticamente
- ✅ Interface moderna com controle de status em tempo real
- ✅ Configuração de delay personalizável entre clicks
- ✅ Notificações visuais de progresso

## 🔧 Instalação

### 1. Criar os Ícones (Obrigatório)

Antes de instalar, você precisa criar os ícones da extensão. Você pode usar qualquer ferramenta de edição de imagens ou este site gratuito: https://www.favicon-generator.org/

Crie três arquivos PNG na pasta `icons/`:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

**Sugestão:** Use um ícone de foguete 🚀 ou upload ⬆️ com cores roxo/azul.

### 2. Instalar a Extensão no Chrome/Edge

1. Abra o Chrome ou Edge
2. Digite na barra de endereço: `chrome://extensions/` (ou `edge://extensions/`)
3. Ative o **Modo de desenvolvedor** (toggle no canto superior direito)
4. Clique em **"Carregar sem compactação"**
5. Selecione a pasta: `c:/lab/extencao_navegador/dreamstime`
6. A extensão será instalada e aparecerá na barra de ferramentas

## 🎯 Como Usar

1. **Acesse o Dreamstime:**
   - Faça login na sua conta
   - Vá para: `https://www.dreamstime.com/upload`

2. **Configure a Extensão:**
   - Clique no ícone da extensão na barra de ferramentas
   - Configure o delay entre clicks (padrão: 2000ms = 2 segundos)
   - Valores recomendados: 1500-3000ms

3. **Inicie a Automação:**
   - Clique em **"Iniciar Automação"**
   - A extensão começará a processar cada imagem automaticamente
   - Você verá notificações na página a cada ação
   - O contador de imagens processadas será atualizado

4. **Pausar/Parar:**
   - Clique em **"Parar Automação"** a qualquer momento
   - A automação pode ser retomada depois

## ⚙️ Configurações

### Delay entre Clicks
- **Mínimo:** 1000ms (1 segundo)
- **Máximo:** 10000ms (10 segundos)
- **Recomendado:** 2000ms (2 segundos)
- **Propósito:** Evitar sobrecarga no servidor e dar tempo para a página carregar

## 🔍 Como Funciona

1. A extensão detecta quando você está na página `/upload`
2. Ao iniciar, ela clica na primeira imagem disponível
3. Na página de edição (`/upload/edit*`), encontra o botão "Submit commercial"
4. Aguarda o delay configurado e clica no botão
5. O Dreamstime automaticamente redireciona para a próxima imagem
6. O processo se repete até não haver mais imagens

## 📊 Status e Feedback

A extensão fornece feedback em tempo real:

- **Indicador de Status:** 
  - 🟢 Verde = Em execução
  - 🔴 Vermelho = Parado
  - ⚪ Cinza = Aguardando

- **Contador:** Mostra quantas imagens foram processadas

- **Notificações na Página:** 
  - Aparecem no canto superior direito
  - Informam sobre cada ação realizada
  - ✅ Verde = Sucesso
  - ⚠️ Laranja = Aviso
  - ℹ️ Azul = Informação

## 🛠️ Estrutura do Projeto

```
dreamstime/
├── manifest.json      # Configuração da extensão
├── background.js      # Service worker (gerencia estado)
├── content.js         # Script injetado na página
├── popup.html         # Interface do popup
├── popup.css          # Estilos do popup
├── popup.js           # Lógica do popup
├── icons/             # Ícones da extensão
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # Este arquivo
```

## ⚠️ Avisos Importantes

1. **Uso Responsável:** Use delays adequados para não sobrecarregar o servidor do Dreamstime
2. **Monitoramento:** Monitore o processo periodicamente para garantir que está funcionando corretamente
3. **Conexão:** Mantenha uma conexão de internet estável durante o processo
4. **Sessão:** Certifique-se de estar logado no Dreamstime antes de iniciar

## 🐛 Resolução de Problemas

### A extensão não aparece após instalação
- Verifique se criou os três arquivos de ícone necessários
- Certifique-se de que o "Modo de desenvolvedor" está ativado
- Tente recarregar a extensão em `chrome://extensions/`

### A automação não inicia
- Verifique se está na página correta (`dreamstime.com/upload`)
- Certifique-se de que há imagens para processar
- Recarregue a página e tente novamente

### A extensão para no meio do processo
- Verifique sua conexão com a internet
- Aumente o delay entre clicks
- Recarregue a página e inicie novamente

### O botão não é clicado
- Verifique se a estrutura da página do Dreamstime não mudou
- Abra o console do navegador (F12) para ver logs de erro
- Reporte o problema com detalhes

## 📝 Changelog

### v1.0.0 (28/12/2025)
- 🎉 Versão inicial
- ✅ Automação de submissão comercial
- ✅ Interface moderna com gradientes
- ✅ Configuração de delay
- ✅ Contador de imagens processadas
- ✅ Notificações em tempo real

## 📄 Licença

Este projeto foi desenvolvido para uso pessoal. Use por sua própria conta e risco.

## 💡 Suporte

Em caso de problemas ou dúvidas, verifique:
1. Este README
2. Os logs no console do navegador (F12 → Console)
3. Se a estrutura da página do Dreamstime mudou

---

**Desenvolvido com ❤️ para automatizar seu workflow no Dreamstime**
