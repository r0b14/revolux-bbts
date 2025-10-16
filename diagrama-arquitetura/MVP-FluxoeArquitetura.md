# MVP – Fluxos e Arquitetura

Abaixo estão os fluxos essenciais para visualizar toda a arquitetura do MVP proposto (Frontend React + Firebase Auth/Firestore, Azure Static Web Apps + Azure Functions Python, n8n e Azure OpenAI opcional).

---

## 1) Visão geral (Contexto do Sistema)

```mermaid
flowchart LR
    subgraph Client[Cliente]
      U[Usuário - admin/gestor/operador]
    end

    subgraph FE[Frontend – React - Vite/TS/Tailwind]
      RT[Rotas + Guards - RBAC]
      TT[TanStack Table + PapaParse]
      RC[Recharts]
    end

    subgraph FB[Firebase]
      FA[Auth - Email/Senha + Custom Claims]
      FS[Firestore - users, uploads, metrics]
      FST[(Storage – opcional p/ CSV bruto)]
    end

    subgraph AZ[Azure]
      SWA[Azure Static Web Apps\nhosting do FE]
      AF[Azure Functions Python\nanalyze-csv]
      AOAI[Azure OpenAI\nopcional para insights]
    end

    subgraph N8N[n8n]
      WH[Webhook de Notificação]
    end

    U -->|HTTP/HTTPS| FE
    FE -->|Deploy| SWA

    FE -- Login/Token --> FA
    FA <---> FE
    FE <---> FS

    FE -- Upload/Processar --> TT
    FE -- Enviar arquivo --> AF
    AF -- métricas/insights --> FE
    AF -- persistir resultados --> FS

    AF -- opcional prompt métricas --> AOAI
    AOAI -- resumo/insights --> AF

    AF -- POST --> WH
    WH -- opcional callback/atualização --> FS

    FE --> RC
```

> **Pontos-chave:**
>
> - **RBAC** com Custom Claims no Firebase Auth; guards nas rotas do FE.
> - **CSV**: preview e métricas rápidas no client (PapaParse) + análise robusta no **Azure Functions (pandas)**.
> - **Persistência**: Firestore armazena uploads, status e métricas; Storage opcional para o CSV bruto.
> - **Azure** obrigatório atendido via **Static Web Apps + Functions** e, se desejar, **Azure OpenAI** para insights.
> - **n8n** recebe webhook pós-processamento e dispara notificações/rotinas.

---

## 2) Fluxo de Autenticação e RBAC

```mermaid
flowchart TD
    A[Usuário acessa /login] --> B[Firebase Auth - email/senha]
    B --> C[Recebe ID Token]
    C --> D[Custom Claims - role: admin/gestor/operador]
    D --> E[Frontend lê claims]
    E -->|RequireRole| F{Rota solicitada}
    F -->|/dashboard| G[admin ou gestor]
    F -->|/upload-csv| H[gestor ou admin]
    F -->|/relatorios| I[operador, gestor, admin]
    G --> J[Permitir acesso]
    H --> J
    I --> J
    F -->|nao autorizado| K[403 – bloqueio + redirect]
```

**Coleções/estruturas (exemplo):**

- `users/{uid}` → `{ role, name, email, createdAt }`
- `uploads/{id}` → `{ ownerUid, status: 'pending'|'processed'|'error', metrics, insights, createdAt }`

---

## 3) Fluxo de Upload e Análise de CSV

```mermaid
sequenceDiagram
    participant U as Usuário
    participant FE as React (Vite/TS/TW + PapaParse)
    participant FA as Firebase Auth
    participant FS as Firestore
    participant AF as Azure Functions (Python/pandas)
    participant AO as Azure OpenAI (opcional)
    participant N8 as n8n Webhook

    U->>FE: Seleciona arquivo .csv
    FE->>FE: PapaParse preview + validação básica
    FE->>FS: Criar doc uploads (status=pending)
    FE->>AF: POST /analyze-csv (multipart file)
    AF->>AF: pandas calcula métricas (CMM 6m, missing, outliers)
    AF->>AO: (opcional) prompt com métricas p/ insights
    AO-->>AF: insights em texto
    AF->>FS: Atualiza uploads/{id} com metrics/insights (status=processed)
    AF->>N8: POST webhook (dados essenciais)
    N8-->>FS: (opcional) callback/log
    AF-->>FE: { metrics, insights }
    FE->>FE: Atualiza UI (tabela, gráficos, cards)
```

**Métricas sugeridas (exemplo):**

- `rows`, `columns`, `missingRatio` global e por coluna
- `cmmBySku` (média últimos 6 meses por SKU)
- `leadTimeDaysAvg` (se houver datas de pedido/entrega)
- `anomalies` (quebras de padrão, negativos, datas inválidas)

---

## 4) Fluxo de Notificações/Automação (n8n)

```mermaid
flowchart LR
    AF[Azure Functions] -- POST --> WH[n8n Webhook]
    WH --> ACT{Ações}
    ACT -->|Enviar e-mail/Slack| NOT[Notificador]
    ACT -->|Gravar log| LOG[(DB n8n/Google Sheets)]
    ACT -->|Chamar Azure OpenAI| AOAI[Resumo executivo]
    AOAI --> WH
    WH --> FS[Atualizar Firestore - opcional]
```

**Gatilhos comuns:**

- Novo upload processado
- Erro na análise
- Anomalias acima de um limiar

---

## 5) Diagrama de Deploy & Integração

```mermaid
flowchart TB
    Dev[Dev local] -->|build| FE[React app]
    FE -->|deploy| SWA[Azure Static Web Apps]
    AF[Azure Functions - Python] -->|exposto via HTTP| SWA
    SWA -->|CORS liberado| FE

    FE --- FB[Firebase - Auth + Firestore + Storage opcional]
    AF --- AOAI[Azure OpenAI - opcional]
    AF --- N8N[n8n Cloud / self-host]
```

**.env (exemplo mínimo do FE):**

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_AZURE_FN_URL=https://<seu-app>.azurewebsites.net/api
VITE_N8N_WEBHOOK=https://n8n.example.com/webhook/notify
```

---

## 6) Backlog pós-MVP (rápidos wins)

```mermaid
flowchart TD
    MVP[MVP Entregue] --> B1[Validação de schema CSV com Zod]
    MVP --> B2[Persistir CSV bruto no Storage]
    MVP --> B3[Exportar PDF/CSV de relatório]
    MVP --> B4[Paginação/virtualização na tabela]
    MVP --> B5[Telas de auditoria]
    
    B1 --> B1A[Cabeçalhos obrigatórios]
    B1 --> B1B[Validação de tipos de dados]
    
    B2 --> B2A[Reprocesso de CSV]
    B2 --> B2B[Auditoria histórica]
    
    B3 --> B3A[Métricas + insights]
    B3 --> B3B[Gráficos exportados]
    
    B4 --> B4A[CSVs grandes > 10MB]
    B4 --> B4B[Performance otimizada]
    
    B5 --> B5A[Histórico de uploads]
    B5 --> B5B[Diffs de métricas]
    
    style MVP fill:#4CAF50
    style B1 fill:#2196F3
    style B2 fill:#2196F3
    style B3 fill:#2196F3
    style B4 fill:#2196F3
    style B5 fill:#2196F3
```

- Validação de schema de CSV (cabeçalhos obrigatórios) com Zod.
- Persistir CSV bruto no Storage (para reprocesso/auditoria).
- Exportar PDF/CSV de relatório (metrics + insights + gráficos).
- Paginação/virtualização na tabela para CSVs grandes.
- Telas de auditoria: histórico de uploads e diffs de métricas.

---

## 7) Observações de Performance e Risco (resumo)

```mermaid
flowchart TD
    PERF[Performance & Risco] --> CSV[Tamanho de CSV]
    PERF --> CORS[Segurança CORS]
    PERF --> RBAC[RBAC Backend]
    PERF --> COST[Custos/Limites]
    
    CSV --> CSV1[Cliente: até 5-10MB]
    CSV --> CSV2[Servidor: > 10MB]
    CSV2 --> CSV2A[Upload direto Storage]
    CSV2A --> CSV2B[Processamento 100% Azure Functions]
    
    CORS --> CORS1[Permitir domínio SWA]
    CORS --> CORS2[Validar origem no AF]
    
    RBAC --> RBAC1[Não confiar apenas no FE]
    RBAC --> RBAC2[Validar token no AF]
    RBAC2 --> RBAC2A[Header: Authorization Bearer idToken]
    
    COST --> COST1[Azure Functions: consumo]
    COST --> COST2[Firestore: free/low tier]
    COST --> COST3[Monitorar crescimento]
    
    style PERF fill:#FF9800
    style CSV fill:#F44336
    style CORS fill:#9C27B0
    style RBAC fill:#E91E63
    style COST fill:#4CAF50
```

- **Tamanho de CSV no client:** para >5–10MB, considere streaming/chunk e/ou upload direto para Storage + processamento 100% no AF.
- **CORS:** garantir domínio do SWA permitido no AF.
- **RBAC:** não confiar só no FE; validar role no AF (verificar token Firebase no header `Authorization: Bearer <idToken>`).
- **Custos/limites:** Azure Functions em consumo + Firestore free/low tier cobrem MVP.

---

## 8) Resumo Visual - Tecnologias Utilizadas

```mermaid
mindmap
  root((MVP Hacka-BBTS))
    Frontend
      React + Vite
      TypeScript
      Tailwind CSS
      TanStack Table
      PapaParse
      Recharts
    Backend
      Azure Functions
      Python + pandas
      Azure OpenAI
    Database
      Firebase Auth
        Custom Claims
        RBAC
      Firestore
        users
        uploads
        metrics
      Firebase Storage
        CSV bruto
    Deploy
      Azure Static Web Apps
      GitHub Actions CI/CD
    Automação
      n8n
        Webhooks
        Notificações
        Integrações
```
