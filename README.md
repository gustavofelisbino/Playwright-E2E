# Playwright E2E

Testes end-to-end com [Playwright](https://playwright.dev/) e TypeScript, executados no GitHub Actions com análise de qualidade no SonarCloud.

## GitHub Actions + SonarCloud

[![Build and Tests](https://github.com/gustavofelisbino/Playwright-E2E/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/gustavofelisbino/Playwright-E2E/actions/workflows/node.js.yml)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=gustavofelisbino_Playwright-E2E&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=gustavofelisbino_Playwright-E2E)

## Cenários de teste — KaBuM! (produto e carrinho)

Arquivo: `src/scenarios/KabumCarrinho.spec.ts`

| # | Caso de teste | O que é validado |
|---|---|---|
| 1 | Adicionar ao carrinho | Clicar em "Comprar agora" leva o produto ao carrinho com o nome, a quantidade (1) e o preço corretos |
| 2 | Alterar quantidade | Aumentar para 2 e diminuir para 1 recalcula na hora o preço do item e o valor total |
| 3 | Link do produto | Clicar no produto dentro do carrinho redireciona para a página do produto |
| 4 | Remover produtos | Remover os itens um por um deixa o carrinho vazio, com a mensagem "Seu carrinho está vazio." |

Os testes não usam nenhuma ferramenta de IA: são escritos apenas com a API do Playwright (`getByRole`, asserções web-first com `expect`, `test.step` e fixtures customizadas).

## Como executar

1. Instale o [Node.js](https://nodejs.org/) (versão >= 22.x)
1. Execute `npm ci` para instalar as dependências
1. Execute `npx playwright install chrome` para instalar o navegador usado nos testes
1. Execute `npm test` para rodar toda a suíte (ou `npm run scenario` para rodar só o cenário da KaBuM!)
1. Execute `npm run show-report` para abrir o relatório HTML

Os artefatos de execução (relatório, screenshots e traces) ficam em `./artifacts`. Para apagá-los, execute `npm run clean`.

## Estrutura do projeto

- `src/scenarios`: cenários de teste
- `src/support`: arquivos de apoio
  - `elements`: mapeamento dos elementos (locators) de cada tela
  - `fixtures`: configurações (URLs) e fixtures customizadas do Playwright
  - `pages`: Page Objects com as ações usadas nos testes
