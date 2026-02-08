# <img src="./fleetu-logo.svg" alt="Fleetu Logo" width="25"> Fleetu

> **Plataforma de Fleet Engineering Governance & Automation**

## **1\. Visão Geral**

Este documento descreve a proposta de uma plataforma voltada à governança ativa, evolução contínua e padronização técnica em larga escala para empresas que mantêm múltiplos produtos, repositórios, stacks e times.

A plataforma funciona como um **Sistema Operacional de Evolução de Engenharia**, permitindo que organizações planejem, executem, acompanhem e auditem mudanças técnicas transversais. Diferente de ferramentas tradicionais de auditoria passiva, o foco aqui é a **automação da manutenção**: transformar a "ordem de mudança" em código executável.

O objetivo central é transformar mudanças organizacionais — correções, migrações, padronizações e features compartilhadas — em processos reproduzíveis, versionados e governados, reduzindo a dependência de intervenção manual.

## **2\. Contexto e Problema de Mercado**

Em empresas de médio e grande porte, é comum encontrar:

* Centenas ou milhares de repositórios (a "frota")  
* Dezenas de stacks e frameworks fragmentados  
* Times autônomos com maturidades diferentes  
* Dependências defasadas (Security Debt)  
* Padrões técnicos inconsistentes que dificultam a mobilidade interna  
* Dificuldade de implantar funcionalidades transversais (ex: novo padrão de log)  
* Processos de atualização baseados em comunicação informal e planilhas

Na prática, mudanças organizacionais são conduzidas via documentos, reuniões e pressão hierárquica. Esse modelo não escala e gera "Drift" (desvio de padrão) técnico ao longo do tempo.

## **3\. Objetivo da Plataforma**

A plataforma tem como objetivo fornecer uma infraestrutura permanente para:

* **Detectar** riscos técnicos e oportunidades de melhoria (Observability)  
* **Definir** políticas de engenharia como código (Policy as Code)  
* **Executar** transformações reutilizáveis em massa (Automation)  
* **Orquestrar** rollouts progressivos para evitar incidentes (Safety)  
* **Garantir** auditoria e rastreabilidade (Compliance)

O foco não é substituir a autonomia dos times, mas oferecer um sistema de "Golden Path" que amplifique sua capacidade de execução, removendo o atrito da manutenção repetitiva.

## **4\. Conceito Central: Shift**

### **4.1 Definição**

Um **Shift** representa uma mudança organizacional formalizada. Ele é a menor unidade governável da plataforma. Funciona como um "setpoint" para a frota de software.

Cada Shift encapsula:

* Critérios de seleção de repositórios (Targeting)  
* Transformações técnicas (Action)  
* Validações (Testing)  
* Estratégia de rollout (Deployment)  
* Regras de monitoramento (Feedback)

### **4.2 Tipos de Shifts**

Os Shifts podem representar:

* Correções de segurança (CVE patching)  
* Atualizações de dependências e linguagens  
* Refatorações de código (ex: migração de sintaxe)  
* Padronizações arquiteturais  
* Migrações tecnológicas (ex: On-prem para Cloud)  
* Features compartilhadas (Cross-cutting concerns)  
* Instrumentação de observabilidade

### **4.3 Exemplo**

shift: python-http-timeout-v1  
scope:  
  language: python  
  framework: fastapi  
transform:  
  operator: add-timeout@1.2.0  
validate:  
  tests: pytest  
rollout:  
  strategy: canary  
  waves: \[10, 50, 100\]

Este Shift representa uma política organizacional executável: todos os serviços FastAPI devem usar timeout padronizado.

## **5\. Conceito Central: Operator**

### **5.1 Definição**

Um **Operator** é um componente executável criado pelos próprios usuários da plataforma ou pela comunidade interna. Ele implementa lógica personalizada que pode ser reutilizada em múltiplos Shifts.

Operators funcionam como plugins versionados, isolados e agnósticos à orquestração.

### **5.2 Função**

Um Operator pode:

* Analisar código (Static Analysis)  
* Modificar arquivos (AST Transformation)  
* Aplicar templates (Scaffolding)  
* Integrar scanners de terceiros  
* Executar codemods complexos  
* Consumir LLMs para refatoração contextual  
* Validar estruturas de arquivos

### **5.3 Modelo**

name: add-nps-hook  
version: 1.0.0  
runtime: python  
permissions:  
  \- repo:write  
  \- secrets:read

### **5.4 Objetivo Estratégico**

O modelo de Operators garante extensibilidade infinita. O fornecedor da plataforma não se torna um gargalo, pois a lógica de negócio específica (ex: regra de compliance bancário) é desenvolvida e mantida pelo cliente.

## **6\. Pipeline de Execução**

Cada Shift é executado por um pipeline declarativo e extensível.

### **6.1 Etapas Padrão**

1. **Scan:** Coleta de sinais técnicos e inventário.  
2. **Select:** Definição do escopo baseada em metadados.  
3. **Plan:** Simulação das mudanças (Dry-run).  
4. **Transform:** Aplicação das mudanças (via Operators).  
5. **Review:** Revisão automática (Linter/LLM) ou humana.  
6. **Validate:** Execução de testes em CI isolado.  
7. **PR/Commit:** Criação de Pull Request ou Commit direto.  
8. **Track:** Monitoramento da adoção e estabilidade.

### **6.2 Exemplo**

steps:  
  \- scan: snyk  
  \- apply: renovate-custom  
  \- review: llm-code-reviewer  
  \- test: ci-check  
  \- pr: auto-merge-if-green

## **7\. Capability Packages (Features Transversais)**

### **7.1 Definição**

Capabilities representam funcionalidades organizacionais reutilizáveis empacotadas como produtos internos.

### **7.2 Estrutura**

capability: authentication-module  
versions:  
  \- v1 (deprecated)  
  \- v2 (stable)

Incluem:

* Operators de instalação/atualização  
* Shifts de migração  
* Templates de código  
* Documentação viva

### **7.3 Benefício**

Transforma features internas em produtos gerenciados. Se a biblioteca de autenticação muda, a plataforma orquestra a atualização em todos os consumidores automaticamente.

## **8\. Capability: Padronização com Dev Containers**

### **8.1 Motivação**

Ambientes de desenvolvimento inconsistentes ("funciona na minha máquina") geram perda massiva de produtividade.

### **8.2 Dev Container como Capability**

A plataforma fornece e gerencia pacotes de ambiente:

capability: devcontainer-standard  
variant: java-springboot

Incluindo:

* Templates de .devcontainer  
* Base images homologadas e cacheadas  
* Ferramentas corporativas pré-instaladas  
* Configuração de tasks (VS Code / IntelliJ)

### **8.3 Shift de Adoção e Manutenção (Drift Control)**

O grande diferencial não é apenas criar o arquivo, mas mantê-lo.

* **Day 1:** Detectar repositórios sem configuração e abrir PR de setup.  
* **Day 2+:** Quando a imagem base de segurança for atualizada, a plataforma gera PRs automáticos para toda a frota sincronizar a versão. Isso garante "Imutabilidade do Ambiente de Desenvolvimento".

### **8.5 Impacto Esperado**

* Onboarding reduzido de dias para horas.  
* Eliminação de erros de configuração local.  
* Garantia de que todos usam as ferramentas de segurança corretas.

## **9\. Registry Interno**

A plataforma mantém registros versionados de:

* Shifts (Campanhas)  
* Operators (Executáveis)  
* Capabilities (Produtos Internos)

Cada item possui ownership, ciclo de vida (alpha, beta, GA, deprecated) e histórico de execução. O registry atua como a "Fonte da Verdade" da evolução técnica.

## **10\. Governança, Segurança e Cultura**

### **10.1 Isolamento**

* Execução em containers efêmeros.  
* Sandboxes para execução de código não confiável.  
* Limites de recursos (CPU/RAM) por execução.

### **10.2 Permissões e RBAC**

| Papel | Responsabilidade |
| :---- | :---- |
| Admin | Gestão da infraestrutura da plataforma |
| Lead | Publicar Shifts e Capabilities |
| Dev | Aprovar PRs gerados pela plataforma |
| Auditor | Leitura e extração de relatórios |

### **10.3 Auditoria**

Todas as ações são imutáveis: Shift ID → Repo ID → Commit Hash → Autor → Timestamp.

### **10.4 Assinatura**

Artefatos e commits gerados pela plataforma podem ser assinados digitalmente (GPG/Sigstore) para garantir integridade e "Non-repudiation".

### **10.5 Cultura: Golden Path vs. Gatekeeper**

Para evitar rejeição cultural, a plataforma deve priorizar a abordagem de **Golden Path** (facilitar o caminho certo) em vez de apenas atuar como Gatekeeper (bloquear o caminho errado).

* **Modo Sugestivo:** Abre PRs, sugere melhorias.  
* **Modo Mandatório:** Apenas para riscos críticos de segurança (ex: Log4Shell).

## **11\. LLM como Operador Especializado**

LLMs não são apenas "chatbots" aqui, mas motores de transformação de código integrados ao pipeline:

* **Refatoração Complexa:** "Migre este código de Java 8 para 17, substituindo as bibliotecas depreciadas X e Y".  
* **Revisão Semântica:** Analisar se o código atende aos requisitos de negócio do Shift, não apenas sintaxe.  
* **Geração de Patches:** Criar correções para vulnerabilidades detectadas por scanners tradicionais.

## **12\. Arquitetura Geral**

┌──────────────────────────┐  
│   Fleet Control Plane    │  
├──────────────────────────┤  
│ Campaign Manager         │◄─── Interface para Leads/Archs  
│ Policy Engine            │  
│ Repo Catalog             │  
│ Audit / Metrics          │  
└───────────┬──────────────┘  
            │  
┌───────────▼──────────────┐  
│   Execution Runners      │  
├──────────────────────────┤  
│ Operator Runtime (Docker)│  
│ LLM Gateway              │  
│ Test Runner              │  
│ PR Bot / Git Client      │  
└──────────────────────────┘

## **13\. Integração com IDPs (Ex: Backstage)**

É crucial diferenciar esta plataforma de IDPs como o Backstage.

* **Backstage (O Painel):** Exibe o estado atual, catálogo e documentação. Mostra "Este serviço está vulnerável".  
* **Fleet Governance (O Motor):** Recebe o sinal e **executa a correção**.

A plataforma pode expor plugins para o Backstage, permitindo que desenvolvedores disparem Shifts (ex: "Atualizar meu framework") diretamente do portal do desenvolvedor (Self-service).

## **14\. Análise de Concorrência**

### **14.1 Categorias**

| Categoria | Exemplos |
| :---- | :---- |
| Dependências | Dependabot, Renovate |
| AppSec | Snyk, Semgrep |
| Batch PR | Sourcegraph Batch Changes |
| Refactor | OpenRewrite, Moderne |
| IDP | Backstage, OpsLevel |

### **14.2 Diferencial**

As ferramentas existentes ou são focadas apenas em dependências (Renovate) ou apenas em visualização (Backstage). A proposta aqui integra **Governança \+ Execução Customizável \+ Orquestração de Campanhas**.

## **15\. Estratégia de Composição e Licenciamento**

### **15.1 Princípio**

**Core proprietário \+ Motores Open Source \+ Integrações Enterprise.**

A plataforma orquestra ferramentas *best-in-class* sem reinventar a roda.

### **15.2 Motores (Exemplos)**

* **Refatoração:** OpenRewrite (Java), LibCST (Python), jscodeshift (JS).  
* **Detecção:** OSV (Vulns), Semgrep (Padrões).  
* **IA:** Ollama / vLLM (Local), OpenAI (Cloud).

O valor está na **coordenação** desses motores para cumprir uma política de negócio, não na criação dos motores em si.

## **16\. Diferenciais Competitivos**

1. **Governance-as-Code:** Regras auditáveis e versionadas, não PDFs.  
2. **Active Drift Control:** O sistema trabalha ativamente para manter a conformidade, não apenas alerta sobre o problema.  
3. **Extensibilidade (Operators):** O cliente não depende do roadmap do fornecedor para criar automações específicas.  
4. **Multi-Stack & Multi-Host:** Agnóstico a linguagem e provedor de git (GitHub/GitLab/Bitbucket/AzureDevOps).  
5. **LLM-Augmented:** Uso de IA para reduzir a fadiga de revisão de código.

## **17\. Modelo de Negócio**

### **17.1 Público-Alvo**

* Empresas com \> 200 engenheiros ou \> 500 repositórios.  
* Verticais reguladas (Fintechs, Saúde) ou Big Techs.

### **17.2 Modelo Comercial**

* **SaaS Enterprise:** Cobrança por assento (dev) ou por repositório ativo.  
* **Self-Hosted:** Para clientes com requisitos estritos de data sovereignty.

## **18\. Roadmap**

### **Fase 1 — MVP (Foco em Valor Imediato)**

* Integração GitHub.  
* Registry de Shifts básicos.  
* Engine de execução simples.  
* Capability de "Padronização de Repositório" (DevContainers/Linter).

### **Fase 2 — Escala e Governança**

* Campaign Manager (Rollout em ondas).  
* Policy Engine (Bloqueios e Alertas).  
* Suporte a GitLab/Azure.  
* Integração com Backstage.

### **Fase 3 — Plataforma Inteligente**

* Marketplace de Operators.  
* LLM Sandbox para refatorações complexas.  
* Analytics preditivo de dívida técnica.

## **19\. Riscos**

* **Fadiga de PRs:** Desenvolvedores ignorarem automações se o volume for muito alto (ruído).  
* **Falsos Positivos:** Operators que quebram código em produção geram desconfiança imediata.  
* **Complexidade de Integração:** Ambientes corporativos com redes fechadas e proxies complexos.  
* **Resistência Cultural:** Times sentirem que perderam autonomia sobre seus repositórios.

## **20\. Próximos Passos**

1. Validar tese técnica com arquitetos de grandes empresas.  
2. Definir stack do MVP (Linguagem do orquestrador e runtime dos operators).  
3. Criar protótipo focado em um caso de uso de alta dor (ex: atualização de Java/Spring ou padronização de CI/CD).  
4. Estruturar modelo de parceria.

## **21\. Definições Técnicas de Partida (Decisões MVP)**

Para garantir simplicidade e adoção inicial, definimos os seguintes padrões:

* **Linguagem de Definição:** **YAML**. Padrão de mercado para pipelines e IaC (Kubernetes, GitHub Actions), reduzindo a curva de aprendizado para engenheiros de plataforma.  
* **Estratégia de Execução:** **Containers (Docker/OCI)**. Garante isolamento total entre o código do cliente e a plataforma, permitindo execução segura de código de terceiros e reprodutibilidade de ambiente.  
* **Modelo de Precificação:** **SaaS por Assento (Seat-based)**. Modelo mais simples para início, alinhado com ferramentas como GitHub e Jira, facilitando a aprovação de orçamento.