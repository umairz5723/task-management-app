import { useState, useEffect } from 'react';
import styles from "./Quote.module.css";
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Quote() {
    const [quote, setQuote] = useState('');
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const quoteAPI = 'https://api.adviceslip.com/advice';

    const fetchQuote = () => {
        setIsRefreshing(true);
        fetch(quoteAPI)
            .then(response => response.json())
            .then(data => {
                setQuote(data.slip.advice);
                setError(null);
            })
            .catch(error => {
                setError("Unable to retrieve/load quote");
                console.log(error);
            })
            .finally(() => {
                setIsRefreshing(false);
            });
    }

    useEffect(() => {
        fetchQuote();
    }, []);  

    return (
        <div className={styles.quoteContainer}>
            {error ? (
                <p className={styles.errorMessage}>{error}</p>
            ) : (
                <div className={styles.quoteWrapper}>
                    <div className={styles.quoteContent}>
                        <span className={styles.quoteMark}>"</span>
                        <p className={styles.quoteText}>{quote}</p>
                        <span className={styles.quoteMark}>"</span>
                    </div>
                    <button 
                        onClick={fetchQuote} 
                        className={`${styles.refreshButton} ${isRefreshing ? styles.spinning : ''}`}
                        disabled={isRefreshing}
                    >
                        <RefreshIcon />
                    </button>
                </div>
            )}
        </div>
    );
}