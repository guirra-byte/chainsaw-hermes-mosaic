# Chainsaw Hermes Mosaic - Youtube Shorts Creator
Este projeto utiliza Node.js para criar vídeos curtos do YouTube (YouTube Shorts) a partir de vídeos mais longos.

## ⚙ Funcionalidades:
- [x] **`Segmentação de Vídeos`**: Divide vídeos longos em chunks menores com base em timestamps fornecidos.
- [x] **`Geração de Conteúdo e Definição da Minutagem`**: Áudios transcritos do vídeo são enviados para a API da OpenAI que realiza a análise do texto transcrito e determina a relevância do conteúdo dentro de cada segmento do vídeo. Com base na análise de relevância do conteúdo, a API da OpenAI pode sugerir ou definir os tempos de início (startTime) e término (endTime) ideais criação do vídeo curto.
- [x] **`Processamento em Paralelo`**: Aproveita o Node.js Worker Threads para processar múltiplos vídeos simultaneamente, melhorando a eficiência.
- [ ] **`Webhooks para Notificação de Finalização de Execução`**: Implementar webhooks que notificam o usuário ou outros sistemas quando a criação de um YouTube Short for concluída.
- [ ] **`Integração com YouTube`**: Facilitar o upload automatizado dos vídeos curtos gerados para o YouTube.

## 🚧 Recomendações:
A aplicação é projetada para gerar vídeos curtos a partir de conteúdos mais longos, como podcasts, reacts, e outros `formatos que possuem falas significativas`. O foco é identificar e extrair os momentos mais relevantes com base na transcrição do áudio, garantindo cortes precisos e envolventes. 
Por essa razão, **conteúdos com diálogos ou narrações são preferidos**, pois permitem uma **`análise mais eficaz e uma seleção mais criteriosa dos trechos`** para criar vídeos curtos impactantes e bem estruturados.

<img src="https://github.com/user-attachments/assets/9d9532f0-7132-42a9-8de1-a39f3dd2e9cc"/>

## Stack de Tecnologias
<p align="center">
    <img src="https://www.aikonbox.com.br/icons?i=typescript,nodejs,expressjs&t=70" />
</p>
