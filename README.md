# Hermes Mosaic - Youtube Shorts Creator
Este projeto utiliza Node.js para criar vídeos curtos do YouTube (YouTube Shorts) a partir de vídeos mais longos.

## Funcionalidades
- [x] Segmentação de Vídeos: Divide vídeos longos em chunks menores com base em timestamps fornecidos.
- [x] Geração de Conteúdo e Definição da Minutagem: Áudios transcritos do vídeo são enviados para a API da OpenAI que realiza a análise do texto transcrito e determina a relevância do conteúdo dentro de cada segmento do vídeo. Com base na análise de relevância do conteúdo, a API da OpenAI pode sugerir ou definir os tempos de início (startTime) e término (endTime) ideais criação do vídeo curto.
- [x] Processamento em Paralelo: Aproveita o Node.js Worker Threads para processar múltiplos vídeos simultaneamente, melhorando a eficiência.
- [ ] Integração com YouTube: Facilitar o upload automatizado dos vídeos curtos gerados para o YouTube.

<img src="https://github.com/guirra-byte/hermes-mosaic/assets/77081114/da1d9e7c-bba8-4f46-b43b-71d22d567e1f"/>

##
<p align="center">
    <img src="https://www.aikonbox.com.br/icons?i=typescript,nodejs,express&t=40" />
</p>