import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../../firebase/auth';
import axios from 'axios';
import styles from './TaskSideBar.module.css';

export default function TaskSideBar({ 
    setUrgencyFilter, 
    setProgressFilter, 
    resetFiltersTrigger, 
    setTasks 
}) {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedUrgency, setSelectedUrgency] = useState('All Levels');
    const [searchInput, setSearchInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    useEffect(() => {
        if (resetFiltersTrigger) {
            resetFilters();
        }
    }, [resetFiltersTrigger]);

    const resetFilters = () => {
        setSelectedCategory('All');
        setSelectedUrgency('All Levels');
        setProgressFilter('All');
        setUrgencyFilter('All Levels');
        setSearchInput('');
        // Reset to all tasks
        fetchAllTasks();
    };

    const fetchAllTasks = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/tasks');
            setTasks(response.data);
            setSearchError('');
        } catch (error) {
            console.error("Error fetching all tasks:", error);
            setSearchError('Error fetching tasks');
        }
    };

    const handleProgressSelect = (progress) => {
        setSelectedCategory(progress);
        setProgressFilter(progress);
        // Clear search when changing filters
        setSearchInput('');
    };

    const handleUrgencySelect = (urgency) => {
        setSelectedUrgency(urgency);
        setUrgencyFilter(urgency);
        // Clear search when changing filters
        setSearchInput('');
    };

    const searchTasks = async (e) => {
        e?.preventDefault(); // Handle form submission if called from form
        setIsSearching(true);
        setSearchError('');

        try {
            if (!searchInput.trim()) {
                await fetchAllTasks();
                return;
            }

            const response = await axios.get(`http://localhost:3000/api/searchtask`, {
                params: { taskName: searchInput.trim() }
            });

            setTasks(response.data);
            
            // Reset filters when searching
            setSelectedCategory('All');
            setSelectedUrgency('All Levels');
            setProgressFilter('All');
            setUrgencyFilter('All Levels');

        } catch (error) {
            console.error("Error searching tasks:", error);
            if (error.response?.status === 404) {
                setTasks([]);
                setSearchError('No tasks found');
            } else {
                setSearchError('Error searching tasks');
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
        if (e.target.value === '') {
            // If search input is cleared, reset to all tasks
            fetchAllTasks();
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
            <form onSubmit={searchTasks} className={styles['search-form']}>
                <input
                    className={styles['search-input']}
                    placeholder='Enter Task Name Here'
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    disabled={isSearching}
                />
                <button 
                    type="submit" 
                    className={`${styles['search-button']} ${isSearching ? styles['searching'] : ''}`}
                    disabled={isSearching}
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </form>
            {searchError && <li className={styles['search-error']}>{searchError}</li>}
        </ul>
    );
}