/**
 * Aye-Bay: types, auth, storage, formatters — single source for data layer.
 * Uses localStorage for MVP; swap for Firebase/API later.
 */

// ——— Types ———
export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  role: Role;
  pin: string; // MVP: plain PIN; hash in production
}

export interface Project {
  id: string;
  name: string;
  responsibleUserId: string;
  createdAt: string; // ISO
}

export interface Product {
  id: string;
  projectId: string;
  name: string;
  quantity: number;
  pricePerPiece: number;
}

export interface Sale {
  id: string;
  projectId: string;
  productId: string;
  productName: string;
  quantitySold: number;
  pricePerPiece: number;
  total: number;
  discount: number;
  murajja: number;
  date: string; // ISO
}

export interface Expense {
  id: string;
  projectId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalExpense: number;
  date: string;
}

const STORAGE_KEYS = {
  users: 'ayebay_users',
  projects: 'ayebay_projects',
  products: 'ayebay_products',
  sales: 'ayebay_sales',
  expenses: 'ayebay_expenses',
  auth: 'ayebay_auth',
} as const;

// ——— Auth (client-safe; no cookie for MVP) ———
export interface AuthState {
  userId: string;
  role: Role;
  name: string;
}

export function getAuthFromCookie(): AuthState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.auth);
    if (!raw) return null;
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

export function setAuth(user: User): void {
  const state: AuthState = {
    userId: user.id,
    role: user.role,
    name: user.name,
  };
  localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(state));
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEYS.auth);
}

export function login(userId: string, pin: string): User | null {
  const users = getUsers();
  const user = users.find((u) => u.id === userId && u.pin === pin);
  if (user) setAuth(user);
  return user ?? null;
}

// ——— Seed & storage helpers ———
function getJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setJson(key: string, data: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ——— Users ———
export function getUsers(): User[] {
  let users = getJson<User[]>(STORAGE_KEYS.users, []);
  if (users.length === 0) {
    users = [
      { id: 'admin', name: 'Admin', role: 'admin', pin: '1234' },
      { id: 'user1', name: 'Project User', role: 'user', pin: '1111' },
    ];
    setJson(STORAGE_KEYS.users, users);
  }
  return users;
}

// ——— Projects ———
const SEED_PROJECT_IDS = { farm: 'proj_seed_1', shop: 'proj_seed_2' } as const;

export function getProjects(): Project[] {
  let list = getJson<Project[]>(STORAGE_KEYS.projects, []);
  if (list.length === 0) {
    const now = new Date().toISOString();
    list = [
      { id: SEED_PROJECT_IDS.farm, name: 'Farm', responsibleUserId: 'user1', createdAt: now },
      { id: SEED_PROJECT_IDS.shop, name: 'Shop', responsibleUserId: 'admin', createdAt: now },
    ];
    setJson(STORAGE_KEYS.projects, list);
  }
  return list;
}

export function getProjectsForUser(userId: string, role: Role): Project[] {
  const all = getProjects();
  if (role === 'admin') return all;
  return all.filter((p) => p.responsibleUserId === userId);
}

export function addProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
  const projects = getProjects();
  const newOne: Project = {
    id: nextId('proj'),
    ...project,
    createdAt: new Date().toISOString(),
  };
  projects.push(newOne);
  setJson(STORAGE_KEYS.projects, projects);
  return newOne;
}

export function updateProject(id: string, patch: Partial<Project>): void {
  const projects = getProjects().map((p) =>
    p.id === id ? { ...p, ...patch } : p
  );
  setJson(STORAGE_KEYS.projects, projects);
}

// ——— Products (inventory) ———
const SEED_PROD_IDS = { rice: 'prod_seed_1', flour: 'prod_seed_2', oil: 'prod_seed_3', lentils: 'prod_seed_4' } as const;

export function getProducts(projectId?: string): Product[] {
  let list = getJson<Product[]>(STORAGE_KEYS.products, []);
  if (list.length === 0) {
    const projects = getProjects();
    if (projects.length >= 2) {
      const p1 = projects[0].id;
      const p2 = projects[1].id;
      list = [
        { id: SEED_PROD_IDS.rice, projectId: p1, name: 'Rice', quantity: 50, pricePerPiece: 80 },
        { id: SEED_PROD_IDS.flour, projectId: p1, name: 'Flour', quantity: 30, pricePerPiece: 55 },
        { id: SEED_PROD_IDS.oil, projectId: p2, name: 'Oil', quantity: 20, pricePerPiece: 180 },
        { id: SEED_PROD_IDS.lentils, projectId: p2, name: 'Lentils', quantity: 40, pricePerPiece: 120 },
      ];
      setJson(STORAGE_KEYS.products, list);
    }
  }
  return projectId ? list.filter((p) => p.projectId === projectId) : list;
}

export function addProduct(p: Omit<Product, 'id'>): Product {
  const products = getProducts();
  const newOne: Product = { id: nextId('prod'), ...p };
  products.push(newOne);
  setJson(STORAGE_KEYS.products, products);
  return newOne;
}

export function updateProductQuantity(id: string, newQuantity: number): void {
  const products = getProducts().map((p) =>
    p.id === id ? { ...p, quantity: newQuantity } : p
  );
  setJson(STORAGE_KEYS.products, products);
}

// ——— Sales ———
export function getSales(projectId?: string): Sale[] {
  let list = getJson<Sale[]>(STORAGE_KEYS.sales, []);
  if (list.length === 0) {
    const products = getProducts();
    if (products.length >= 2) {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - 5);
      const d1 = baseDate.toISOString();
      baseDate.setDate(baseDate.getDate() + 2);
      const d2 = baseDate.toISOString();
      const p1 = products[0];
      const p2 = products[1];
      list = [
        { id: 'sale_seed_1', projectId: p1.projectId, productId: p1.id, productName: p1.name, quantitySold: 5, pricePerPiece: p1.pricePerPiece, total: 5 * p1.pricePerPiece, discount: 0, murajja: 0, date: d1 },
        { id: 'sale_seed_2', projectId: p2.projectId, productId: p2.id, productName: p2.name, quantitySold: 2, pricePerPiece: p2.pricePerPiece, total: 2 * p2.pricePerPiece, discount: 10, murajja: 0, date: d2 },
      ];
      setJson(STORAGE_KEYS.sales, list);
      updateProductQuantity(p1.id, p1.quantity - 5);
      updateProductQuantity(p2.id, p2.quantity - 2);
    }
  }
  return projectId ? list.filter((s) => s.projectId === projectId) : list;
}

export function addSale(sale: Omit<Sale, 'id'>): Sale {
  const sales = getSales();
  const newOne: Sale = { id: nextId('sale'), ...sale };
  sales.push(newOne);
  setJson(STORAGE_KEYS.sales, sales);
  const prod = getProducts().find((p) => p.id === sale.productId);
  if (prod) {
    updateProductQuantity(prod.id, Math.max(0, prod.quantity - sale.quantitySold));
  }
  return newOne;
}

// ——— Expenses ———
export function getExpenses(projectId?: string): Expense[] {
  let list = getJson<Expense[]>(STORAGE_KEYS.expenses, []);
  if (list.length === 0) {
    const projects = getProjects();
    if (projects.length >= 2) {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - 10);
      const d1 = baseDate.toISOString();
      baseDate.setDate(baseDate.getDate() + 3);
      const d2 = baseDate.toISOString();
      list = [
        { id: 'exp_seed_1', projectId: projects[0].id, productName: 'Seeds', quantity: 10, unitPrice: 50, totalExpense: 500, date: d1 },
        { id: 'exp_seed_2', projectId: projects[1].id, productName: 'Packaging', quantity: 100, unitPrice: 2, totalExpense: 200, date: d2 },
      ];
      setJson(STORAGE_KEYS.expenses, list);
    }
  }
  return projectId ? list.filter((e) => e.projectId === projectId) : list;
}

export function addExpense(exp: Omit<Expense, 'id'>): Expense {
  const expenses = getExpenses();
  const newOne: Expense = { id: nextId('exp'), ...exp };
  expenses.push(newOne);
  setJson(STORAGE_KEYS.expenses, expenses);
  return newOne;
}

// ——— Reports ———
export function getIncomeExpenseSummary(
  projectId: string | undefined,
  fromDate: string,
  toDate: string
): { income: number; expense: number } {
  const sales = (projectId ? getSales(projectId) : getSales()).filter(
    (s) => s.date >= fromDate && s.date <= toDate
  );
  const expenses = (projectId ? getExpenses(projectId) : getExpenses()).filter(
    (e) => e.date >= fromDate && e.date <= toDate
  );
  const income = sales.reduce(
    (sum, s) => sum + s.total - s.discount + s.murajja,
    0
  );
  const expense = expenses.reduce((sum, e) => sum + e.totalExpense, 0);
  return { income, expense };
}

// ——— Formatters ———
export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
