import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/CheckIn.module.css';

export default function CheckIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    questionsCompleted: '',
    questionsReviewed: '',
    takeaway: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'questionsCompleted' || name === 'questionsReviewed' 
        ? value === '' ? '' : parseInt(value, 10) 
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simple validation
    if (!formData.name) {
      setError('Please enter your name');
      setIsSubmitting(false);
      return;
    }

    if (formData.questionsCompleted === '' || isNaN(formData.questionsCompleted)) {
      setError('Please enter a valid number of questions completed');
      setIsSubmitting(false);
      return;
    }

    if (formData.questionsReviewed === '' || isNaN(formData.questionsReviewed)) {
      setError('Please enter a valid number of questions reviewed');
      setIsSubmitting(false);
      return;
    }

    if (!formData.takeaway || formData.takeaway.length < 10) {
      setError('Please enter a takeaway (at least 10 characters)');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit check-in');
      }

      setSuccess(true);
      setFormData({
        name: '',
        questionsCompleted: '',
        questionsReviewed: '',
        takeaway: '',
      });

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Daily Check-In | MCAT Accountability Tracker</title>
        <meta name="description" content="Submit your daily MCAT study progress" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Daily Check-In</h1>
          <Link href="/" className={styles.backLink}>
            Back to Home
          </Link>
        </div>

        {success ? (
          <div className={styles.successMessage}>
            <p className={styles.bold}>Check-in submitted successfully!</p>
            <p>Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className={styles.card}>
            {error && (
              <div className={styles.errorMessage}>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Your name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="questionsCompleted" className={styles.label}>
                  Questions Completed
                </label>
                <input
                  type="number"
                  id="questionsCompleted"
                  name="questionsCompleted"
                  value={formData.questionsCompleted}
                  onChange={handleChange}
                  min="0"
                  className={styles.input}
                  placeholder="Number of questions"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="questionsReviewed" className={styles.label}>
                  Questions Reviewed
                </label>
                <input
                  type="number"
                  id="questionsReviewed"
                  name="questionsReviewed"
                  value={formData.questionsReviewed}
                  onChange={handleChange}
                  min="0"
                  className={styles.input}
                  placeholder="Number of questions"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="takeaway" className={styles.label}>
                  Key Takeaway
                </label>
                <textarea
                  id="takeaway"
                  name="takeaway"
                  value={formData.takeaway}
                  onChange={handleChange}
                  rows="4"
                  className={styles.textarea}
                  placeholder="What did you learn today? What was challenging?"
                ></textarea>
                <p className={styles.helpText}>
                  Minimum 10 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.button}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Check-In'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
} 