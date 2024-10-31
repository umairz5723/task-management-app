import { useState, useEffect } from 'react';
import styles from "./Quote.module.css";
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Quote() {

    const [quote, setQuote] = useState('');
    const [error, setError] = useState(null);

    const quoteAPI = 'https://api.adviceslip.com/advice';

    const fetchQuote = () => {
        fetch(quoteAPI)
            .then(response => response.json())
            .then(data => {
                setQuote(data.slip.advice);
            })
            .catch(error => {
                setError("Unable to retrieve/load quote");
                console.log(error);
            });
    }

    // Fetch the quote when the component mounts
    useEffect(() => {
        fetchQuote();
    }, []);  

    return (
        <div className={styles['quote-area-container']}>
            {error ? (
                <p>{error}</p>
            ) : (
                <blockquote>
                    <p>{quote}</p>
                    <button onClick={fetchQuote}> <RefreshIcon /></button>
                </blockquote>
            )}
        </div>
    );
}
