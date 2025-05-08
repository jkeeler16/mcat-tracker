import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard({ initialCheckIns }) {
  const [checkIns, setCheckIns] = useState(initialCheckIns || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCheckIns = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch('/api/check-ins');
        
        if (!response.ok) {
          throw new Error('Failed to fetch check-ins');
        }
        
        const data = await response.json();
        setCheckIns(data);
      } catch (error) {
        console.error('Error fetching check-ins:', error);
        setError('Failed to load check-ins');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCheckIns();
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Prepare data for the chart
  const chartData = checkIns
    .slice(0, 7) // Last 7 days
    .map(checkIn => ({
      date: formatDate(checkIn.date),
      completed: checkIn.questionsCompleted,
      reviewed: checkIn.questionsReviewed
    }))
    .reverse(); // So chart shows oldest to newest

  return (
    <div className={styles.container}>
      <Head>
        <title>Progress Dashboard | MCAT Accountability Tracker</title>
        <meta name="description" content="View MCAT study progress" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Progress Dashboard</h1>
          <div className={styles.linkContainer}>
            <Link href="/check-in" className={styles.link}>
              Submit Check-In
            </Link>
            <Link href="/" className={styles.link}>
              Back to Home
            </Link>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
            <div className={styles.loader}></div>
          </div>
        ) : (
          <>
            {checkIns.length > 0 ? (
              <>
                <div className={styles.chartCard}>
                  <h2 className={styles.chartTitle}>Last 7 Days Activity</h2>
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" name="Questions Completed" fill="#3b82f6" />
                        <Bar dataKey="reviewed" name="Questions Reviewed" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={styles.tableCard}>
                  <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Check-In History</h2>
                  </div>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th className={styles.tableHeaderCell}>
                            Date
                          </th>
                          <th className={styles.tableHeaderCell}>
                            Name
                          </th>
                          <th className={styles.tableHeaderCell}>
                            Questions Completed
                          </th>
                          <th className={styles.tableHeaderCell}>
                            Questions Reviewed
                          </th>
                          <th className={styles.tableHeaderCell}>
                            Key Takeaway
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {checkIns.map((checkIn) => (
                          <tr key={checkIn.id}>
                            <td className={styles.tableCell}>
                              {formatDate(checkIn.date)}
                            </td>
                            <td className={styles.tableCell}>
                              {checkIn.name}
                            </td>
                            <td className={styles.tableCell}>
                              {checkIn.questionsCompleted}
                            </td>
                            <td className={styles.tableCell}>
                              {checkIn.questionsReviewed}
                            </td>
                            <td className={`${styles.tableCell} ${styles.tableCellWrap}`}>
                              {checkIn.takeaway}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyStateText}>No check-ins found. Submit your first check-in to get started!</p>
                <Link href="/check-in" className={styles.button}>
                  Submit Check-In
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  // In a real application, you would fetch this from your API
  // For now, we're returning an empty array since we'll fetch client-side
  return {
    props: {
      initialCheckIns: [],
    },
  };
} 