import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  type WhereFilterOp
} from 'firebase/firestore';

// Tipos para as coleções principais
export interface Order {
  id?: string;
  orderNumber: string;
  description: string;
  status: 'crítico' | 'urgente' | 'normal';
  priority: 'alta' | 'média' | 'baixa';
  supplier: string;
  requestedBy: string;
  deadline: Date | Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface User {
  id?: string;
  email: string;
  displayName: string;
  role: 'admin' | 'analyst' | 'estrategista';
  createdAt?: Timestamp;
  lastLogin?: Timestamp;
}

export interface Forecast {
  id?: string;
  title: string;
  description: string;
  data: any[];
  createdBy: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ===== FUNÇÕES GENÉRICAS =====

/**
 * Adiciona um novo documento a uma coleção
 */
export const addDocument = async <T>(collectionName: string, data: Partial<T>) => {
  if (!db) {
    console.warn('Firebase não configurado. Operação simulada.');
    return { id: 'mock-id', ...data };
  }

  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Erro ao adicionar documento em ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Busca todos os documentos de uma coleção
 */
export const getAllDocuments = async <T>(collectionName: string): Promise<T[]> => {
  if (!db) {
    console.warn('Firebase não configurado. Retornando array vazio.');
    return [];
  }

  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error(`Erro ao buscar documentos de ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Busca um documento específico por ID
 */
export const getDocumentById = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  if (!db) {
    console.warn('Firebase não configurado. Retornando null.');
    return null;
  }

  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Erro ao buscar documento ${docId} de ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Atualiza um documento
 */
export const updateDocument = async <T>(
  collectionName: string, 
  docId: string, 
  updates: Partial<T>
) => {
  if (!db) {
    console.warn('Firebase não configurado. Operação simulada.');
    return { id: docId, ...updates };
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    } as any);
    return { id: docId, ...updates };
  } catch (error) {
    console.error(`Erro ao atualizar documento ${docId} de ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Deleta um documento
 */
export const deleteDocument = async (collectionName: string, docId: string) => {
  if (!db) {
    console.warn('Firebase não configurado. Operação simulada.');
    return;
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Erro ao deletar documento ${docId} de ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Busca documentos com filtros
 */
export const queryDocuments = async <T>(
  collectionName: string,
  filters: Array<{ field: string; operator: WhereFilterOp; value: any }>,
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc',
  limitCount?: number
): Promise<T[]> => {
  if (!db) {
    console.warn('Firebase não configurado. Retornando array vazio.');
    return [];
  }

  try {
    let q = query(collection(db, collectionName));

    // Aplicar filtros
    filters.forEach(filter => {
      q = query(q, where(filter.field, filter.operator, filter.value));
    });

    // Aplicar ordenação
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    // Aplicar limite
    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error(`Erro ao buscar documentos filtrados de ${collectionName}:`, error);
    throw error;
  }
};

// ===== FUNÇÕES ESPECÍFICAS PARA ORDERS =====

export const orderService = {
  // Criar ordem
  create: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => 
    addDocument<Order>('orders', orderData),

  // Buscar todas as ordens
  getAll: () => getAllDocuments<Order>('orders'),

  // Buscar ordem por ID
  getById: (orderId: string) => getDocumentById<Order>('orders', orderId),

  // Atualizar ordem
  update: (orderId: string, updates: Partial<Order>) => 
    updateDocument<Order>('orders', orderId, updates),

  // Deletar ordem
  delete: (orderId: string) => deleteDocument('orders', orderId),

  // Buscar ordens críticas
  getCritical: () => queryDocuments<Order>(
    'orders',
    [{ field: 'status', operator: '==', value: 'crítico' }]
  ),

  // Buscar ordens urgentes
  getUrgent: () => queryDocuments<Order>(
    'orders',
    [{ field: 'status', operator: '==', value: 'urgente' }]
  ),

  // Buscar ordens por status
  getByStatus: (status: Order['status']) => queryDocuments<Order>(
    'orders',
    [{ field: 'status', operator: '==', value: status }],
    'createdAt',
    'desc'
  ),

  // Buscar ordens recentes (últimas 10)
  getRecent: () => queryDocuments<Order>(
    'orders',
    [],
    'createdAt',
    'desc',
    10
  )
};

// ===== FUNÇÕES ESPECÍFICAS PARA USERS =====

export const userService = {
  // Criar usuário
  create: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => 
    addDocument<User>('users', userData),

  // Buscar todos os usuários
  getAll: () => getAllDocuments<User>('users'),

  // Buscar usuário por ID
  getById: (userId: string) => getDocumentById<User>('users', userId),

  // Atualizar usuário
  update: (userId: string, updates: Partial<User>) => 
    updateDocument<User>('users', userId, updates),

  // Deletar usuário
  delete: (userId: string) => deleteDocument('users', userId),

  // Atualizar último login
  updateLastLogin: (userId: string) => 
    updateDocument<User>('users', userId, { lastLogin: serverTimestamp() } as any)
};

// ===== FUNÇÕES ESPECÍFICAS PARA FORECASTS =====

export const forecastService = {
  // Criar previsão
  create: (forecastData: Omit<Forecast, 'id' | 'createdAt' | 'updatedAt'>) => 
    addDocument<Forecast>('forecasts', forecastData),

  // Buscar todas as previsões
  getAll: () => getAllDocuments<Forecast>('forecasts'),

  // Buscar previsão por ID
  getById: (forecastId: string) => getDocumentById<Forecast>('forecasts', forecastId),

  // Atualizar previsão
  update: (forecastId: string, updates: Partial<Forecast>) => 
    updateDocument<Forecast>('forecasts', forecastId, updates),

  // Deletar previsão
  delete: (forecastId: string) => deleteDocument('forecasts', forecastId),

  // Buscar previsões por criador
  getByCreator: (creatorId: string) => queryDocuments<Forecast>(
    'forecasts',
    [{ field: 'createdBy', operator: '==', value: creatorId }],
    'createdAt',
    'desc'
  )
};

export default {
  orders: orderService,
  users: userService,
  forecasts: forecastService,
  
  // Funções genéricas também disponíveis
  addDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  queryDocuments
};
