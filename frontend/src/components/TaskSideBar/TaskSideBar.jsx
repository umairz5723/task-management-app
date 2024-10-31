import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../../firebase/auth';
import axios from 'axios';
import styles from './TaskSideBar.module.css';

export default function TaskSideBar({ setUrgencyFilter, setProgressFilter, resetFiltersTrigger, setTasks }) {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedUrgency, setSelectedUrgency] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        if (resetFiltersTrigger) {
            resetFilters();
        }
    }, [resetFiltersTrigger]);

    const resetFilters = () => {
        setSelectedCategory(null);
        setSelectedUrgency(null);
        setProgressFilter('');
        setUrgencyFilter('');
    };

    const handleProgressSelect = (progress) => {
        setSelectedCategory(progress);
        setProgressFilter(progress);
    };

    const handleUrgencySelect = (urgency) => {
        setSelectedUrgency(urgency);
        setUrgencyFilter(urgency);
    };

    const searchTasks = async () => {
        try {
            // Check if the search input is empty
            if (searchInput.trim() === '') {
                // Fetch all tasks (resetting the search)
                const response = await axios.get('http://localhost:3000/api/tasks');
                setTasks(response.data); // Set all tasks
                return; // Exit the function
            }

            const response = await axios.get('http://localhost:3000/api/searchtask', {
                params: { taskName: searchInput }
            });
            // Update tasks with the response data
            setTasks(response.data);
        } catch (error) {
            console.log("Error searching tasks", error);
            if (error.response && error.response.status === 404) {
                // If task not found, set tasks to empty
                setTasks([]);
            }
        }
    };

    const handleSignOut = async () => {
        try {
            await doSignOut();
            navigate('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <ul className={styles['tasks-sidebar-list']}>
            <li>
                <button onClick={handleSignOut} className={styles['signout-button']}>
                    Sign Out
                </button>
            </li>
            <li><h3>Filter By:</h3></li>

            <li className={styles['sidebar-list-title']}>Progress:</li>
            <li
                className={`${styles['sidebar-list-item']} ${selectedCategory === 'All' ? styles['sidebar-list-item-selected'] : ''}`}
                onClick={() => handleProgressSelect('All')}
            >
                All
            </li>
            <li
                className={`${styles['sidebar-list-item']} ${selectedCategory === 'In Progress' ? styles['sidebar-list-item-selected'] : ''}`}
                onClick={() => handleProgressSelect('In Progress')}
            >
                In Progress
            </li>
            <li
                className={`${styles['sidebar-list-item']} ${selectedCategory === 'Completed' ? styles['sidebar-list-item-selected'] : ''}`}
                onClick={() => handleProgressSelect('Completed')}
            >
                Completed
            </li>

            <li className={styles['sidebar-list-title']}>Urgency Level:</li>
            <li
                className={`${styles['sidebar-list-item']} ${selectedUrgency === 'All Levels' ? styles['sidebar-list-item-selected'] : ''}`}
                onClick={() => handleUrgencySelect('All Levels')}
            >
                All Levels
            </li>
            <li
                className={`${styles['sidebar-list-item']} ${selectedUrgency === 'Low' ? styles['sidebar-list-item-selected'] : ''}`}
                onClick={() => handleUrgencySelect('Low')}
            >
                Low
            </li>
            <li
                className={`${styles['sidebar-list-item']} ${selectedUrgency === 'Medium' ? styles['sidebar-list-item-selected'] : ''}`}
                onClick={() => handleUrgencySelect('Medium')}
            >
                Medium
            </li>
            <li
                className={`${styles['sidebar-list-item']} ${selectedUrgency === 'High' ? styles['sidebar-list-item-selected'] : ''}`}
                onClick={() => handleUrgencySelect('High')}
            >
                High
            </li>

            <li className={styles['sidebar-list-title']}>Search by name:</li>
            <input
                className={styles['search-input']}
                placeholder='Enter Task Name Here'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)} 
            />
            <button className={styles['search-button']} onClick={searchTasks}>Search</button>
        </ul>
    );
}
