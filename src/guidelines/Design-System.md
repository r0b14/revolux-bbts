# Sistema de Design - Revolux

## Documentação de Padronização Visual

Este documento define os padrões visuais unificados aplicados em todo o sistema Revolux.

---

## 🎨 Paleta de Cores

### Cores Principais
- **Primary:** `#465EFF` (Azul principal)
- **Secondary:** `#C2D6FF` (Azul claro)
- **Accent:** `#FCFC30` (Amarelo - robô IA)

### Cores de Status
- **Success:** `text-green-600` / `bg-green-50` / `border-green-500`
- **Warning:** `text-orange-600` / `bg-orange-50` / `border-orange-500`
- **Error:** `text-red-600` / `bg-red-50` / `border-red-500`
- **Info:** `text-blue-600` / `bg-blue-50` / `border-blue-500`
- **Pending:** `text-yellow-600` / `bg-yellow-50` / `border-yellow-500`

---

## 📐 Tipografia

### Fonte
- **Sistema:** Calibri (definida em `globals.css`)

### Hierarquia de Títulos
- **Página (h2):** Sem classes de tamanho (usa padrão do globals.css)
  ```tsx
  <h2 className="dark:text-white">Título da Página</h2>
  ```

- **Descrição de Página:**
  ```tsx
  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
    Descrição da página
  </p>
  ```

- **Seção (h3):**
  ```tsx
  <h3 className="dark:text-white">Título de Seção</h3>
  ```

### Card Headers

#### Padrão para Cards de Estatísticas
```tsx
<CardHeader className="pb-3">
  <div className="flex items-center justify-between">
    <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">
      Nome da Métrica
    </CardTitle>
    <IconComponent className="w-5 h-5 text-[cor-contextual]" />
  </div>
</CardHeader>
<CardContent>
  <div className="text-3xl dark:text-white">{valor}</div>
  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
    Descrição adicional
  </p>
</CardContent>
```

#### Padrão para Cards de Conteúdo
```tsx
<CardHeader className="pb-3">
  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
    <IconComponent className="w-4 h-4" />
    <CardTitle className="text-sm font-normal">Título do Card</CardTitle>
  </div>
  <CardDescription className="text-xs">
    Descrição do conteúdo
  </CardDescription>
</CardHeader>
```

---

## 🎯 Ícones

### Tamanhos Padronizados

1. **Ícones de Header (Cards de Conteúdo):** `w-4 h-4`
2. **Ícones de Estatísticas:** `w-5 h-5`
3. **Ícones de Ação (Botões):** `w-4 h-4`

### Cores de Ícones

- **Headers Neutros:** `text-gray-400` ou `text-gray-500`
- **Contextuais:** Use cores específicas do status
  - Sucesso: `text-green-600`
  - Alerta: `text-orange-600`
  - Erro: `text-red-600`
  - Informação: `text-blue-600`
  - Principal: `style={{ color: '#465EFF' }}`

---

## 📦 Componentes

### Filtros Globais

```tsx
<div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border dark:border-gray-800">
  <div className="flex flex-wrap items-center gap-4">
    <div className="flex items-center gap-2">
      <FileText className="w-4 h-4 text-gray-400" />
      <span className="text-xs dark:text-white">Filtros:</span>
    </div>
    
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 dark:text-gray-400">Campo</label>
      <Select>
        <SelectTrigger className="w-[200px] h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        {/* ... */}
      </Select>
    </div>
  </div>
</div>
```

### Barra de Busca e Filtros

```tsx
<div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-800">
  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input className="pl-10 h-9" />
      </div>
    </div>
    <Select>
      <SelectTrigger className="w-[200px] h-9" />
    </Select>
  </div>
</div>
```

### Cards de Status

```tsx
<Card className="border-l-4" style={{ borderLeftColor: '#465EFF' }}>
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">
        Status
      </CardTitle>
      <Icon className="w-5 h-5" style={{ color: '#465EFF' }} />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-3xl dark:text-white" style={{ color: '#465EFF' }}>
      {count}
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      Descrição
    </p>
  </CardContent>
</Card>
```

### Alertas

```tsx
<Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30">
  <AlertCircle className="h-4 w-4 text-orange-600" />
  <AlertTitle className="text-orange-900 dark:text-orange-400">Título</AlertTitle>
  <AlertDescription className="text-orange-800 dark:text-orange-300">
    Descrição
  </AlertDescription>
</Alert>
```

---

## 🌓 Modo Escuro

### Cores de Background
- **Página:** `dark:bg-gray-950`
- **Cards:** `dark:bg-gray-900`
- **Filtros/Containers:** `dark:bg-gray-900`
- **Hover:** `dark:hover:bg-gray-800`

### Cores de Texto
- **Título:** `dark:text-white`
- **Corpo:** `dark:text-gray-300`
- **Secundário:** `dark:text-gray-400`
- **Terciário:** `dark:text-gray-500`

### Bordas
- **Principal:** `dark:border-gray-800`
- **Secundária:** `dark:border-gray-700`

---

## ✅ Checklist de Padronização

Ao criar ou modificar componentes, verifique:

- [ ] Headers de cards seguem o padrão correto (4x4 para conteúdo, 5x5 para estatísticas)
- [ ] Títulos usam `text-sm font-normal` para cards
- [ ] Descrições usam `text-xs`
- [ ] Números grandes usam `text-3xl`
- [ ] Ícones têm tamanho consistente (4x4 ou 5x5)
- [ ] Cores de ícones são contextuais ou neutras (gray-400/500)
- [ ] Inputs e Selects em filtros têm altura padronizada (`h-8` ou `h-9`)
- [ ] Modo escuro está implementado em todos os elementos
- [ ] Containers de filtros usam `bg-gray-50 dark:bg-gray-900`
- [ ] Espaçamentos são consistentes (p-3, p-4, pb-3, etc.)

---

## 🎨 Exemplos de Uso

### Página Completa
```tsx
<div className="space-y-6">
  {/* Header */}
  <div>
    <h2 className="dark:text-white">Título da Página</h2>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Descrição da funcionalidade
    </p>
  </div>

  {/* Estatísticas */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Cards de estatísticas aqui */}
  </div>

  {/* Filtros */}
  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border dark:border-gray-800">
    {/* Controles de filtro */}
  </div>

  {/* Conteúdo */}
  <Card>
    {/* Conteúdo principal */}
  </Card>
</div>
```

---

## 📝 Notas Importantes

1. **Nunca** adicione classes de tamanho de fonte (text-xl, text-2xl, etc.) em títulos principais (h1, h2, h3) a menos que solicitado
2. **Sempre** use `font-normal` em CardTitle para manter consistência
3. **Prefira** ícones de 4x4 para headers de conteúdo e 5x5 para estatísticas/métricas
4. **Mantenha** altura consistente em inputs (h-8 para compactos, h-9 para padrão)
5. **Use** cores contextuais para ícones de status e neutras (gray) para ícones informativos

---

**Última atualização:** Outubro 2025  
**Versão:** 1.0
