'use client';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getAuthFromCookie } from '@/lib/data';
import {
  getProjectsForUser,
  getUsers,
  addProject,
  getProducts,
  addProduct,
  addSale,
  getSales,
  getExpenses,
  addExpense,
  getIncomeExpenseSummary,
  getProjects,
  formatCurrency,
  formatDate,
  type Project,
  type Product,
  type Sale,
  type Expense,
} from '@/lib/data';
import { useState, useMemo, useCallback, useRef } from 'react';

type TabId = 'projects' | 'income' | 'expense' | 'reports' | 'admin';

export function Dashboard() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') as TabId) || 'projects';
  const t = useTranslations('dashboard');
  const tNav = useTranslations('nav');
  const tProj = useTranslations('projects');
  const tIncome = useTranslations('income');
  const tExp = useTranslations('expense');
  const tRep = useTranslations('reports');
  const tAdmin = useTranslations('admin');
  const tCommon = useTranslations('common');

  const auth = getAuthFromCookie();
  const [refresh, setRefresh] = useState(0);

  const projects = useMemo(() => {
    if (!auth) return [];
    return getProjectsForUser(auth.userId, auth.role);
  }, [auth, refresh]);

  const allProjects = useMemo(() => getProjects(), [refresh]);
  const users = useMemo(() => getUsers(), []);

  const from30d = useMemo(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), []);
  const toToday = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const overview = useMemo(
    () => getIncomeExpenseSummary(undefined, from30d, toToday),
    [from30d, toToday, refresh]
  );
  const profitOrLoss = overview.income - overview.expense;

  const content = useMemo(() => {
    if (tab === 'projects') return <ProjectsSection projects={projects} users={users} onAdd={() => setRefresh((r) => r + 1)} tProj={tProj} tCommon={tCommon} />;
    if (tab === 'income') return <IncomeSection projects={projects} onAdd={() => setRefresh((r) => r + 1)} tIncome={tIncome} tCommon={tCommon} />;
    if (tab === 'expense') return <ExpenseSection projects={projects} onAdd={() => setRefresh((r) => r + 1)} tExp={tExp} tCommon={tCommon} />;
    if (tab === 'reports') return <ReportsSection projects={projects} tRep={tRep} tCommon={tCommon} />;
    if (tab === 'admin' && auth?.role === 'admin') return <AdminSection allProjects={allProjects} tAdmin={tAdmin} tCommon={tCommon} />;
    return <p className="muted">{tAdmin('access_denied')}</p>;
  }, [tab, projects, allProjects, users, auth?.role, refresh, tProj, tIncome, tExp, tRep, tAdmin, tCommon]);

  return (
    <div className="dashboard">
      <div className="dashboard-overview">
        <div className="card summary-cards-inline">
          <div className="summary-card stat">
            <div className="label">{tNav('projects')}</div>
            <div className="value">{projects.length}</div>
          </div>
          <div className="summary-card income">
            <div className="label">{t('income')} (30d)</div>
            <div className="value">{formatCurrency(overview.income)}</div>
          </div>
          <div className="summary-card expense">
            <div className="label">{t('expense')} (30d)</div>
            <div className="value">{formatCurrency(overview.expense)}</div>
          </div>
          <div className={`summary-card ${profitOrLoss >= 0 ? 'profit' : 'loss'}`}>
            <div className="label">{tRep('profit_loss')}</div>
            <div className="value">{formatCurrency(profitOrLoss)}</div>
          </div>
        </div>
      </div>
      <div className="tab-content">{content}</div>
    </div>
  );
}

// ——— Projects section ———
function ProjectsSection({
  projects,
  users,
  onAdd,
  tProj,
  tCommon,
}: {
  projects: Project[];
  users: { id: string; name: string; role: string }[];
  onAdd: () => void;
  tProj: ReturnType<typeof useTranslations<'projects'>>;
  tCommon: ReturnType<typeof useTranslations<'common'>>;
}) {
  const [name, setName] = useState('');
  const [responsible, setResponsible] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !responsible) return;
    addProject({ name: name.trim(), responsibleUserId: responsible });
    setName('');
    setResponsible('');
    setShowForm(false);
    onAdd();
  };

  return (
    <section>
      <div className="section-head">
        <div>
          <h2>{tProj('title')}</h2>
          <p className="section-desc">{projects.length === 0 ? tProj('create_first') : `${projects.length} ${tProj('title').toLowerCase()}.`}</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {tProj('add_project')}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="card form-card">
          <label>
            <span>{tProj('project_name')}</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            <span>{tProj('responsible')}</span>
            <select value={responsible} onChange={(e) => setResponsible(e.target.value)} required>
              <option value="">—</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{tCommon('save')}</button>
            <button type="button" className="btn" onClick={() => setShowForm(false)}>{tCommon('cancel')}</button>
          </div>
        </form>
      )}
      {projects.length === 0 ? (
        <div className="empty-state">
          <p>{tProj('no_projects')} {tProj('create_first')}</p>
          <button type="button" className="btn btn-primary empty-state-cta" onClick={() => setShowForm(true)}>
            {tProj('add_project')}
          </button>
        </div>
      ) : (
        <ul className="list card-list">
          {projects.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong>
              <span className="muted">{users.find((u) => u.id === p.responsibleUserId)?.name ?? p.responsibleUserId}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ——— Income section (inventory + sales) ———
function IncomeSection({
  projects,
  onAdd,
  tIncome,
  tCommon,
}: {
  projects: Project[];
  onAdd: () => void;
  tIncome: ReturnType<typeof useTranslations<'income'>>;
  tCommon: ReturnType<typeof useTranslations<'common'>>;
}) {
  const [subTab, setSubTab] = useState<'inventory' | 'sales'>('inventory');
  const products = getProducts();
  const sales = getSales();

  interface InventoryRow {
    id: string;
    productName: string;
    quantity: string;
    pricePerPiece: string;
  }
  const [projId, setProjId] = useState('');
  const [inventoryRows, setInventoryRows] = useState<InventoryRow[]>([
    { id: '1', productName: '', quantity: '', pricePerPiece: '' },
  ]);
  const [productId, setProductId] = useState('');
  const [quantitySold, setQuantitySold] = useState('');
  const [discount, setDiscount] = useState('0');
  const [murajja, setMurajja] = useState('0');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterProjectId, setFilterProjectId] = useState('');
  const [filterFrom, setFilterFrom] = useState(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [filterTo, setFilterTo] = useState(() => new Date().toISOString().slice(0, 10));
  const addProductSectionRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    if (!filterProjectId) return products;
    return products.filter((p) => p.projectId === filterProjectId);
  }, [products, filterProjectId]);
  const filteredSales = useMemo(() => {
    let list = sales;
    if (filterProjectId) list = list.filter((s) => s.projectId === filterProjectId);
    list = list.filter((s) => s.date.slice(0, 10) >= filterFrom && s.date.slice(0, 10) <= filterTo);
    return list.slice(-50).reverse();
  }, [sales, filterProjectId, filterFrom, filterTo]);

  function addInventoryRow() {
    setInventoryRows((r) => [...r, { id: String(Date.now()), productName: '', quantity: '', pricePerPiece: '' }]);
  }
  function deleteInventoryRow(id: string) {
    setInventoryRows((r) => (r.length <= 1 ? r : r.filter((x) => x.id !== id)));
  }
  function updateInventoryRow(id: string, field: keyof InventoryRow, value: string) {
    setInventoryRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  }
  function inventoryRowTotal(row: InventoryRow): number {
    return (Number(row.quantity) || 0) * (Number(row.pricePerPiece) || 0);
  }
  const inventoryGrandTotal = inventoryRows.reduce((sum, row) => sum + inventoryRowTotal(row), 0);
  const validInventoryCount = inventoryRows.filter(
    (r) => r.productName.trim() && (Number(r.quantity) || 0) >= 0 && (Number(r.pricePerPiece) || 0) >= 0
  ).length;

  const addProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projId) return;
    inventoryRows.forEach((row) => {
      if (!row.productName.trim()) return;
      const q = Number(row.quantity) || 0;
      const p = Number(row.pricePerPiece) || 0;
      if (q < 0 || p < 0) return;
      addProduct({
        projectId: projId,
        name: row.productName.trim(),
        quantity: q,
        pricePerPiece: p,
      });
    });
    setInventoryRows([{ id: String(Date.now()), productName: '', quantity: '', pricePerPiece: '' }]);
    onAdd();
  };

  const addSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = getProducts().find((p) => p.id === productId);
    if (!prod || !quantitySold || !saleDate) return;
    const q = Number(quantitySold);
    const price = prod.pricePerPiece;
    const total = q * price;
    addSale({
      projectId: prod.projectId,
      productId: prod.id,
      productName: prod.name,
      quantitySold: q,
      pricePerPiece: price,
      total,
      discount: Number(discount) || 0,
      murajja: Number(murajja) || 0,
      date: new Date(saleDate).toISOString(),
    });
    setQuantitySold('');
    setDiscount('0');
    setMurajja('0');
    onAdd();
  };

  return (
    <section>
      <div className="section-head">
        <div>
          <h2>{tIncome('title')}</h2>
          <p className="section-desc">{tIncome('inventory')} &amp; {tIncome('sales_history')}</p>
        </div>
        <div className="sub-tabs">
          <button type="button" className={subTab === 'inventory' ? 'active' : ''} onClick={() => setSubTab('inventory')}>{tIncome('inventory')}</button>
          <button type="button" className={subTab === 'sales' ? 'active' : ''} onClick={() => setSubTab('sales')}>{tIncome('sales_history')}</button>
        </div>
      </div>
      {subTab === 'inventory' && (
        <>
          <div ref={addProductSectionRef} className="card new-entry-section">
            <h2 className="new-entry-heading">{tIncome('add_product')}</h2>
            <form onSubmit={addProductSubmit} className="new-entry-form">
              <div className="filter-bar" style={{ marginBottom: '1rem' }}>
                <label>
                  <span>{tCommon('project')}</span>
                  <select value={projId} onChange={(e) => setProjId(e.target.value)} required>
                    <option value="">—</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="card-title" style={{ marginTop: 0 }}>Items</div>
              <div className="excel-table-wrap">
                <table className="table excel-table">
                  <thead>
                    <tr>
                      <th>{tIncome('product_name')}</th>
                      <th>{tIncome('quantity')}</th>
                      <th>{tIncome('price_per_piece')}</th>
                      <th>{tCommon('total')}</th>
                      <th style={{ width: '1%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryRows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <input
                            type="text"
                            value={row.productName}
                            onChange={(e) => updateInventoryRow(row.id, 'productName', e.target.value)}
                            placeholder="..."
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={row.quantity}
                            onChange={(e) => updateInventoryRow(row.id, 'quantity', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={row.pricePerPiece}
                            onChange={(e) => updateInventoryRow(row.id, 'pricePerPiece', e.target.value)}
                          />
                        </td>
                        <td className="calc-cell">{formatCurrency(inventoryRowTotal(row))}</td>
                        <td className="row-actions">
                          <button type="button" className="delete-row-btn" onClick={() => deleteInventoryRow(row.id)} title={tCommon('delete')}>
                            <i className="fas fa-times" aria-hidden />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ margin: '0.5rem 0' }}>
                <button type="button" className="btn btn-secondary add-row-btn" onClick={addInventoryRow}>
                  <i className="fas fa-plus" aria-hidden /> {tCommon('add_row')}
                </button>
              </p>
              <p className="entry-summary-line">
                <strong>{tCommon('total')}:</strong> <span className="entry-summary-total">{formatCurrency(inventoryGrandTotal)}</span>
                {' · '}
                <strong>Items:</strong> <span className="entry-summary-total">{validInventoryCount}</span>
              </p>
              <button type="submit" className="btn btn-primary save-entry-btn">
                <i className="fas fa-check" aria-hidden /> {tCommon('save_entry')}
              </button>
            </form>
          </div>
          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>{tIncome('inventory')}</span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addProductSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                <i className="fas fa-plus" aria-hidden /> {tIncome('add_product')}
              </button>
            </div>
            <div className="filter-bar" style={{ marginBottom: '1rem' }}>
              <label>
                <span>{tCommon('project')}</span>
                <select value={filterProjectId} onChange={(e) => setFilterProjectId(e.target.value)}>
                  <option value="">All</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </label>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="empty-state">{tIncome('no_products')}</div>
            ) : (
              <>
                <div className="excel-table-wrap">
                  <table className="table excel-table">
                    <thead>
                      <tr>
                        <th>{tIncome('product_name')}</th>
                        <th className="num">{tIncome('quantity')}</th>
                        <th className="num">{tIncome('price_per_piece')}</th>
                        <th className="num">{tCommon('total')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td>{p.name}</td>
                          <td className="num">{p.quantity}</td>
                          <td className="num">{formatCurrency(p.pricePerPiece)}</td>
                          <td className="num calc-cell">{formatCurrency(p.quantity * p.pricePerPiece)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="entry-summary-line">
                  <strong>{tIncome('inventory')}:</strong>{' '}
                  <span className="entry-summary-total">{filteredProducts.length}</span> entries
                  {' · '}
                  <strong>{tCommon('total')}:</strong>{' '}
                  <span className="entry-summary-total">
                    {formatCurrency(filteredProducts.reduce((sum, p) => sum + p.quantity * p.pricePerPiece, 0))}
                  </span>
                </p>
              </>
            )}
          </div>
        </>
      )}
      {subTab === 'sales' && (
        <>
          <div className="card new-entry-section">
            <h2 className="new-entry-heading">{tIncome('add_sale')}</h2>
            <form onSubmit={addSaleSubmit} className="new-entry-form">
              <div className="filter-bar" style={{ marginBottom: '1rem' }}>
                <label>
                  <span>{tIncome('product_name')} ({tIncome('from_inventory')})</span>
                  <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
                    <option value="">—</option>
                    {products.filter((p) => p.quantity > 0).map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.quantity} in stock</option>
                    ))}
                  </select>
                  {products.filter((p) => p.quantity > 0).length === 0 && products.length > 0 && (
                    <span className="muted" style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>{tIncome('no_stock_add_inventory')}</span>
                  )}
                  {products.length === 0 && (
                    <span className="muted" style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>{tIncome('no_products')}</span>
                  )}
                </label>
                <label>
                  <span>{tIncome('quantity')}</span>
                  <input type="number" min="1" value={quantitySold} onChange={(e) => setQuantitySold(e.target.value)} required />
                </label>
                <label>
                  <span>{tIncome('discount')}</span>
                  <input type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                </label>
                <label>
                  <span>{tIncome('murajja')}</span>
                  <input type="number" min="0" value={murajja} onChange={(e) => setMurajja(e.target.value)} />
                </label>
                <label>
                  <span>{tCommon('date')}</span>
                  <input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} required />
                </label>
              </div>
              <p className="entry-summary-line">
                <strong>{tCommon('total')}:</strong>{' '}
                <span className="entry-summary-total">
                  {formatCurrency(
                    (() => {
                      const prod = products.find((p) => p.id === productId);
                      if (!prod || !quantitySold) return 0;
                      return prod.pricePerPiece * (Number(quantitySold) || 0) - (Number(discount) || 0) + (Number(murajja) || 0);
                    })()
                  )}
                </span>
              </p>
              <button type="submit" className="btn btn-primary save-entry-btn">
                <i className="fas fa-check" aria-hidden /> {tCommon('save')}
              </button>
            </form>
          </div>
          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-title">{tIncome('sales_history')}</div>
            <div className="filter-bar" style={{ marginBottom: '1rem' }}>
              <label>
                <span>{tCommon('project')}</span>
                <select value={filterProjectId} onChange={(e) => setFilterProjectId(e.target.value)}>
                  <option value="">All</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>{tCommon('from')}</span>
                <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
              </label>
              <label>
                <span>{tCommon('to')}</span>
                <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
              </label>
            </div>
            {filteredSales.length === 0 ? (
              <div className="empty-state">{tIncome('no_sales')}</div>
            ) : (
              <>
                <div className="excel-table-wrap">
                  <table className="table excel-table">
                    <thead>
                      <tr>
                        <th>{tCommon('date')}</th>
                        <th>{tIncome('product_name')}</th>
                        <th className="num">{tIncome('quantity')}</th>
                        <th className="num">{tCommon('total')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.map((s) => (
                        <tr key={s.id}>
                          <td>{formatDate(s.date)}</td>
                          <td>{s.productName}</td>
                          <td className="num">{s.quantitySold}</td>
                          <td className="num calc-cell">{formatCurrency(s.total - s.discount + s.murajja)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="entry-summary-line">
                  <strong>{tIncome('sales_history')}:</strong>{' '}
                  <span className="entry-summary-total">{filteredSales.length}</span> entries
                  {' · '}
                  <strong>{tCommon('total')}:</strong>{' '}
                  <span className="entry-summary-total">
                    {formatCurrency(filteredSales.reduce((sum, s) => sum + (s.total - s.discount + s.murajja), 0))}
                  </span>
                </p>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}

// ——— Expense section (expense-tracker style: excel table + add row) ———
const DEFAULT_UNITS = ['kg', 'pcs', 'L', 'g', 'dozen'];

interface ExpenseRow {
  id: string;
  productName: string;
  quantity: string;
  unit: string;
  unitPrice: string;
}

function ExpenseSection({
  projects,
  onAdd,
  tExp,
  tCommon,
}: {
  projects: Project[];
  onAdd: () => void;
  tExp: ReturnType<typeof useTranslations<'expense'>>;
  tCommon: ReturnType<typeof useTranslations<'common'>>;
}) {
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [comment, setComment] = useState('');
  const [rows, setRows] = useState<ExpenseRow[]>([
    { id: '1', productName: '', quantity: '', unit: 'kg', unitPrice: '' },
  ]);
  const [filterProjectId, setFilterProjectId] = useState('');
  const [filterFrom, setFilterFrom] = useState(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [filterTo, setFilterTo] = useState(() => new Date().toISOString().slice(0, 10));
  const expenses = getExpenses();
  const filteredExpenses = useMemo(() => {
    let list = expenses;
    if (filterProjectId) list = list.filter((e) => e.projectId === filterProjectId);
    list = list.filter((e) => e.date.slice(0, 10) >= filterFrom && e.date.slice(0, 10) <= filterTo);
    return list.slice(-50).reverse();
  }, [expenses, filterProjectId, filterFrom, filterTo]);

  function addNewRow() {
    setRows((r) => [...r, { id: String(Date.now()), productName: '', quantity: '', unit: 'kg', unitPrice: '' }]);
  }
  function deleteRow(id: string) {
    setRows((r) => (r.length <= 1 ? r : r.filter((x) => x.id !== id)));
  }
  function updateRow(id: string, field: keyof ExpenseRow, value: string) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  }
  function rowTotal(row: ExpenseRow): number {
    const q = Number(row.quantity) || 0;
    const p = Number(row.unitPrice) || 0;
    return q * p;
  }
  const grandTotal = rows.reduce((sum, row) => sum + rowTotal(row), 0);
  const validRowCount = rows.filter((r) => r.productName.trim() && (Number(r.quantity) || 0) >= 0 && (Number(r.unitPrice) || 0) >= 0).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !date) return;
    const dateIso = new Date(date).toISOString();
    rows.forEach((row) => {
      const q = Number(row.quantity) || 0;
      const up = Number(row.unitPrice) || 0;
      if (!row.productName.trim()) return;
      addExpense({
        projectId,
        productName: row.productName.trim(),
        quantity: q,
        unitPrice: up,
        totalExpense: q * up,
        date: dateIso,
      });
    });
    setRows([{ id: String(Date.now()), productName: '', quantity: '', unit: 'kg', unitPrice: '' }]);
    setComment('');
    onAdd();
  };

  return (
    <section>
      <div className="section-head">
        <h2>{tExp('title')}</h2>
        <p className="section-desc">{tExp('add_expense')} · {tExp('recent_expenses')}</p>
      </div>
      <div className="card new-entry-section">
        <h2 className="new-entry-heading">{tExp('add_expense')}</h2>
        <form onSubmit={handleSubmit} className="new-entry-form">
          <div className="filter-bar" style={{ marginBottom: '1rem' }}>
            <label>
              <span>{tCommon('project')}</span>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
                <option value="">—</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{tCommon('date')}</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
          </div>
          <div className="card-title" style={{ marginTop: 0 }}>Items</div>
          <div className="excel-table-wrap">
            <table className="table excel-table">
              <thead>
                <tr>
                  <th>{tExp('product_name')}</th>
                  <th>{tExp('quantity')}</th>
                  <th>Unit</th>
                  <th>{tExp('unit_price')}</th>
                  <th>{tCommon('total')}</th>
                  <th style={{ width: '1%' }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="text"
                        value={row.productName}
                        onChange={(e) => updateRow(row.id, 'productName', e.target.value)}
                        placeholder="..."
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.quantity}
                        onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td>
                      <select value={row.unit} onChange={(e) => updateRow(row.id, 'unit', e.target.value)}>
                        {DEFAULT_UNITS.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.unitPrice}
                        onChange={(e) => updateRow(row.id, 'unitPrice', e.target.value)}
                      />
                    </td>
                    <td className="calc-cell">{formatCurrency(rowTotal(row))}</td>
                    <td className="row-actions">
                      <button type="button" className="delete-row-btn" onClick={() => deleteRow(row.id)} title={tCommon('delete')}>
                        <i className="fas fa-times" aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ margin: '0.5rem 0' }}>
            <button type="button" className="btn btn-secondary add-row-btn" onClick={addNewRow}>
              <i className="fas fa-plus" aria-hidden /> {tExp('add_row')}
            </button>
          </p>
          <div className="form-group">
            <label>Comment (optional)</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder="e.g. Monthly groceries" />
          </div>
          <p className="entry-summary-line">
            <strong>Total:</strong> <span className="entry-summary-total">{formatCurrency(grandTotal)}</span>
            {' · '}
            <strong>Items:</strong> <span className="entry-summary-total">{validRowCount}</span>
          </p>
          <button type="submit" className="btn btn-primary save-entry-btn">
            <i className="fas fa-check" aria-hidden /> {tExp('save_entry')}
          </button>
        </form>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="card-title">{tExp('recent_expenses')}</div>
        <div className="filter-bar" style={{ marginBottom: '1rem' }}>
          <label>
            <span>{tCommon('project')}</span>
            <select value={filterProjectId} onChange={(e) => setFilterProjectId(e.target.value)}>
              <option value="">All</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{tCommon('from')}</span>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
          </label>
          <label>
            <span>{tCommon('to')}</span>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
          </label>
        </div>
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">{tExp('no_expenses')}</div>
        ) : (
          <>
            <div className="excel-table-wrap">
              <table className="table excel-table">
                <thead>
                  <tr>
                    <th>{tCommon('date')}</th>
                    <th>{tExp('product_name')}</th>
                    <th className="num">{tExp('quantity')}</th>
                    <th className="num">{tExp('total_expense')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((e) => (
                    <tr key={e.id}>
                      <td>{formatDate(e.date)}</td>
                      <td>{e.productName}</td>
                      <td className="num">{e.quantity}</td>
                      <td className="num calc-cell">{formatCurrency(e.totalExpense)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="entry-summary-line">
              <strong>{tExp('recent_expenses')}:</strong>{' '}
              <span className="entry-summary-total">{filteredExpenses.length}</span> entries
              {' · '}
              <strong>{tCommon('total')}:</strong>{' '}
              <span className="entry-summary-total">
                {formatCurrency(filteredExpenses.reduce((sum, e) => sum + e.totalExpense, 0))}
              </span>
            </p>
          </>
        )}
      </div>
    </section>
  );
}

// ——— Reports section ———
function ReportsSection({
  projects,
  tRep,
  tCommon,
}: {
  projects: Project[];
  tRep: ReturnType<typeof useTranslations<'reports'>>;
  tCommon: ReturnType<typeof useTranslations<'common'>>;
}) {
  const [projectId, setProjectId] = useState<string>('');
  const [fromDate, setFromDate] = useState(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));

  const summary = useMemo(
    () => getIncomeExpenseSummary(projectId || undefined, fromDate, toDate),
    [projectId, fromDate, toDate]
  );
  const profitOrLoss = summary.income - summary.expense;

  return (
    <section>
      <div className="section-head">
        <h2>{tRep('title')}</h2>
        <p className="section-desc">{tRep('summary')} · {tRep('date_range')}</p>
      </div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-title">{tRep('summary')}</div>
        <div className="summary-cards">
          <div className="summary-card income">
            <div className="label">{tRep('income_total')}</div>
            <div className="value">{formatCurrency(summary.income)}</div>
          </div>
          <div className="summary-card expense">
            <div className="label">{tRep('expense_total')}</div>
            <div className="value">{formatCurrency(summary.expense)}</div>
          </div>
          <div className={`summary-card ${profitOrLoss >= 0 ? 'profit' : 'loss'}`}>
            <div className="label">{tRep('profit_loss')}</div>
            <div className="value">{formatCurrency(profitOrLoss)}</div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">{tRep('date_range')} &amp; {tCommon('project')}</div>
        <div className="filter-bar">
          <label>
            <span>{tCommon('project')}</span>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">All</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{tCommon('from')}</span>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <label>
            <span>{tCommon('to')}</span>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
        </div>
      </div>
    </section>
  );
}

// ——— Admin section ———
function AdminSection({
  allProjects,
  tAdmin,
  tCommon,
}: {
  allProjects: Project[];
  tAdmin: ReturnType<typeof useTranslations<'admin'>>;
  tCommon: ReturnType<typeof useTranslations<'common'>>;
}) {
  const users = useMemo(() => getUsers(), []);
  return (
    <section>
      <div className="section-head">
        <h2>{tAdmin('title')}</h2>
        <p className="section-desc">{tAdmin('all_projects')}. Overview numbers above are for all projects.</p>
      </div>
      <div className="card">
        <div className="card-title">{tAdmin('all_projects')}</div>
        {allProjects.length === 0 ? (
          <div className="empty-state">{tAdmin('no_projects')}</div>
        ) : (
          <ul className="list card-list">
            {allProjects.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong>
                <span className="muted">{users.find((u) => u.id === p.responsibleUserId)?.name ?? p.responsibleUserId}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
