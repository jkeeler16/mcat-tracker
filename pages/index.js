import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>MCAT Accountability Tracker</title>
        <meta name="description" content="Track MCAT study progress" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          MCAT Accountability Tracker
        </h1>
        
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <p className={styles.description}>
              Track your daily MCAT study progress and share your achievements with family.
            </p>
            
            <div className={styles.buttonContainer}>
              <Link href="/check-in" className={styles.primaryButton}>
                Submit Daily Check-in
              </Link>
              
              <Link href="/dashboard" className={styles.secondaryButton}>
                View Progress Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 