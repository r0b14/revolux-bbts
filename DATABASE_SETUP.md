# 🔥 Configuração do Banco de Dados Firebase

## ✅ Status Atual

Seu projeto **Revolux** está configurado para usar **Firebase** como banco de dados, com:

- **Firebase Authentication** - Para autenticação de usuários
- **Cloud Firestore** - Para armazenamento de dados NoSQL

## 📦 Dependências Instaladas

```json
"firebase": "^12.4.0"
```

## 🔑 Variáveis de Ambiente

Suas credenciais estão configuradas no arquivo `.env.local`:

```bash
VITE_FIREBASE_API_KEY=AIzaSyDO0Ig2xLkO9cDKWK0RjHNB6BYKXxj0KXs
VITE_FIREBASE_AUTH_DOMAIN=revolux-a54ca.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=revolux-a54ca
```

### ⚠️ Segurança

- ✅ O arquivo `.env.local` está no `.gitignore` (não será commitado)
- ✅ Mantenha suas chaves seguras e nunca as compartilhe publicamente

## 🏗️ Arquitetura do Banco de Dados

### Coleções Firestore Recomendadas

```
revolux-a54ca (projeto)
├── users/
│   └── {userId}
│       ├── email: string
│       ├── displayName: string
│       ├── role: string (admin, analyst, estrategista)
│       ├── createdAt: timestamp
│       └── lastLogin: timestamp
│
├── orders/
│   └── {orderId}
│       ├── orderNumber: string
│       ├── description: string
│       ├── status: string (crítico, urgente, normal)
│       ├── priority: string
│       ├── supplier: string
│       ├── requestedBy: string
│       ├── deadline: timestamp
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── forecasts/
│   └── {forecastId}
│       ├── title: string
│       ├── description: string
│       ├── data: array
│       ├── createdBy: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── uploads/
    └── {uploadId}
        ├── fileName: string
        ├── fileUrl: string
        ├── uploadedBy: string
        ├── processedData: object
        ├── status: string
        └── uploadedAt: timestamp
```

## 🚀 Como Usar

### 1. Importar o Firebase em seus componentes

```typescript
import { db, auth } from '@/app/services/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
```

### 2. Criar um novo documento

```typescript
// Adicionar uma nova ordem
const addOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Ordem criada com ID:', docRef.id);
  } catch (error) {
    console.error('Erro ao criar ordem:', error);
  }
};
```

### 3. Ler documentos

```typescript
// Buscar todas as ordens
const getOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return orders;
  } catch (error) {
    console.error('Erro ao buscar ordens:', error);
  }
};
```

### 4. Filtrar documentos

```typescript
// Buscar ordens críticas
const getCriticalOrders = async () => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('status', '==', 'crítico')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar ordens críticas:', error);
  }
};
```

### 5. Atualizar documentos

```typescript
import { doc, updateDoc } from 'firebase/firestore';

// Atualizar uma ordem
const updateOrder = async (orderId, updates) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('Ordem atualizada!');
  } catch (error) {
    console.error('Erro ao atualizar ordem:', error);
  }
};
```

## 🔐 Regras de Segurança do Firestore

Configure as regras de segurança no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função para verificar se o usuário está autenticado
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Função para verificar se é admin
    function isAdmin() {
      return isSignedIn() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Regras para users
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Regras para orders
    match /orders/{orderId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn();
      allow delete: if isAdmin();
    }
    
    // Regras para forecasts
    match /forecasts/{forecastId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn();
      allow delete: if isAdmin();
    }
    
    // Regras para uploads
    match /uploads/{uploadId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn();
      allow delete: if isAdmin();
    }
  }
}
```

## 📊 Índices do Firestore

Para melhorar a performance, crie índices compostos no Firebase Console:

1. **Orders por Status e Data:**
   - `status` (Ascending)
   - `createdAt` (Descending)

2. **Orders por Prioridade e Deadline:**
   - `priority` (Ascending)
   - `deadline` (Ascending)

## 🔧 Scripts Úteis

### Inicializar coleções com dados de teste

Crie um arquivo `scripts/seedDatabase.ts`:

```typescript
import { db } from './src/app/services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const seedOrders = async () => {
  const orders = [
    {
      orderNumber: 'ORD-001',
      description: 'Peças de reposição urgentes',
      status: 'crítico',
      priority: 'alta',
      supplier: 'Fornecedor A',
      requestedBy: 'João Silva',
      deadline: new Date('2025-10-20')
    },
    // Adicione mais dados aqui...
  ];

  for (const order of orders) {
    await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  
  console.log('✅ Banco de dados inicializado!');
};

seedOrders();
```

## 🧪 Testando a Conexão

Execute seu projeto e verifique o console:

```powershell
npm run dev
```

Você deve ver:
- ✅ Sem erros de Firebase no console
- ✅ Autenticação funcionando (se habilitada)
- ✅ Leitura/escrita de dados funcionando

## 📚 Recursos Adicionais

- [Documentação Firebase](https://firebase.google.com/docs)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## 🆘 Troubleshooting

### Erro: "Firebase não está configurado"

Verifique se o arquivo `.env.local` existe e contém as variáveis corretas.

### Erro de permissão ao ler/escrever

Atualize as regras de segurança do Firestore no Firebase Console.

### Dados não aparecem em tempo real

Use `onSnapshot` para atualizações em tempo real:

```typescript
import { onSnapshot } from 'firebase/firestore';

const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
  const orders = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  console.log('Ordens atualizadas:', orders);
});

// Cancelar inscrição quando o componente desmontar
return () => unsubscribe();
```

---

**✅ Configuração concluída!** Seu banco de dados Firebase está pronto para uso.
