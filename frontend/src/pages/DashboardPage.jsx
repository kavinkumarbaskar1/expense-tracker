import { useEffect, useState } from 'react';
import DashboardShell from '../components/DashboardShell.jsx';
import { apiBaseUrl, expenseApi } from '../services/apiClient.js';

const emptySummary = {
  total: 0,
  categories: {},
};

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadDashboardData() {
      setIsLoading(true);
      setError('');

      try {
        const [expenseList, expenseSummary] = await Promise.all([
          expenseApi.listExpenses(selectedCategory),
          expenseApi.getSummary(selectedCategory),
        ]);

        if (!isCurrent) {
          return;
        }

        setExpenses(Array.isArray(expenseList) ? expenseList : []);
        setSummary(expenseSummary ?? emptySummary);
      } catch (apiError) {
        if (!isCurrent) {
          return;
        }

        setExpenses([]);
        setSummary(emptySummary);
        setError(
          apiError.message ||
            'Expense data is unavailable. Start the FastAPI service and try again.',
        );
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isCurrent = false;
    };
  }, [selectedCategory]);

  return (
    <DashboardShell
      apiBaseUrl={apiBaseUrl}
      error={error}
      expenses={expenses}
      isLoading={isLoading}
      onCategoryChange={setSelectedCategory}
      selectedCategory={selectedCategory}
      summary={summary}
    />
  );
}
