import { useState } from "react";
import styles from "./AddTaskModal.module.css"; // Make sure to import your CSS

export default function AddTaskModal({ onClose, refreshTasks }) {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [urgency, setUrgency] = useState('Low');

    const handleSubmit = async (e) => {
        e.preventDefault();

         // Validate title length (1-50 characters) and description length (1-100 characters)
        if (taskTitle.length < 1 || taskTitle.length > 50) {
            alert("Task title must be between 1 and 50 characters.");
            return;
        }

        if (taskDescription.length < 1 || taskDescription.length > 100) {
            alert("Task description must be between 1 and 100 characters.");
            return;
        }
        
        // Send the info to be backend 
        if(taskTitle && taskDescription && urgency){
            try {
                const response = await fetch('http://localhost:3000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: taskTitle,
                        description: taskDescription,
                        urgency
                    }),
                });
                if(response.ok){
                    // Reset the user input fields
                    setTaskTitle('');
                    setTaskDescription('');
                    setUrgency('Low');
                    onClose(); 
                    // Refresh tasks with default filters (to see newly added task)
                    refreshTasks('All Levels', 'All');
                }
        }catch (error) {
            console.log(error);
        }
    };
};


    return (
        <div className={styles['add-task-modal-container']}> {/* Use the correct class here */}
            <button className={styles['close-button']} onClick={onClose}>
                ✖ 
            </button>
    
            <form className={styles['add-task-form']} onSubmit={handleSubmit}>
                <label>Task Title:
                    <small>(Max 50 characters)</small>
                    <input 
                        type="text" 
                        placeholder="What's your task?"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                    />
                </label>
    
                <label>Task Description:
                    <small>(Max 150 characters)</small>
                    <input 
                        type="text" 
                        placeholder="What's this task about?"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                </label>
    
                <label>Urgency Level:
                    <select 
                        value={urgency} 
                        onChange={(e) => setUrgency(e.target.value)}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>
    
                <button type="submit" id="add-task-submit-btn" >Add this task!</button>
            </form>
        </div>
    );
};
