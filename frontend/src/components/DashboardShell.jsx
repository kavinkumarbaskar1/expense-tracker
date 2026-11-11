const categories = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Other'];

export default function DashboardShell({
  apiBaseUrl,
  error,
  expenses,
  isLoading,
  selectedCategory,
  summary,
  onCategoryChange,
}) {
  const total = Number(summary?.total ?? 0);
  const categorySummary = summary?.categories ?? {};

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Dashboard navigation">
        <div>
          <p className="eyebrow">Internal MVP</p>
          <h1>Expense Tracker</h1>
        </div>
        <nav className="nav-stack" aria-label="Primary">
          <a aria-current="page" href="#dashboard">
            Dashboard
          </a>
        </nav>
      </aside>

      <section className="dashboard" id="dashboard">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">REST API</p>
            <h2>Daily Expenses</h2>
            <p className="subtle">Connected to {apiBaseUrl}</p>
          </div>
          <div className="toolbar" aria-label="Category filter">
            {categories.map((category) => (
              <button
                className={category === selectedCategory ? 'active' : ''}
                key={category}
                onClick={() => onCategoryChange(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        {error ? <p className="notice">{error}</p> : null}

        <section className="metrics" aria-label="Expense summary">
          <article>
            <span>Total spending</span>
            <strong>${total.toFixed(2)}</strong>
          </article>
          <article>
            <span>Displayed expenses</span>
            <strong>{expenses.length}</strong>
          </article>
        </section>

        <div className="content-grid">
          <section className="panel" aria-labelledby="expense-list-heading">
            <div className="panel-header">
              <h3 id="expense-list-heading">Expenses</h3>
              <span>{selectedCategory}</span>
            </div>

            {isLoading ? <p className="empty-state">Loading expenses...</p> : null}

            {!isLoading && expenses.length === 0 ? (
              <p className="empty-state">
                No expenses are available for this view yet.
              </p>
            ) : null}

            {!isLoading && expenses.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th className="amount">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id ?? expense.expenseId}>
                      <td>
                        <strong>{expense.title}</strong>
                        {expense.description ? (
                          <span>{expense.description}</span>
                        ) : null}
                      </td>
                      <td>{expense.category}</td>
                      <td>{expense.expenseDate ?? expense.expense_date}</td>
                      <td className="amount">
                        ${Number(expense.amount ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </section>

          <section className="panel" aria-labelledby="summary-heading">
            <div className="panel-header">
              <h3 id="summary-heading">Category Summary</h3>
            </div>
            <div className="summary-list">
              {categories.slice(1).map((category) => (
                <div key={category}>
                  <span>{category}</span>
                  <strong>
                    ${Number(categorySummary[category] ?? 0).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
