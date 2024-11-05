// DeleteConfirmationModal.jsx
import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "../AddTaskModal/ModalStyles.module.css";

export default function DeleteConfirmationModal({ onClose, refreshTasks, task }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setIsDeleting(true);
        setError("");

        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete task');
            }

            await refreshTasks('All Levels', 'All');
            onClose();
        } catch (error) {
            console.error('Error deleting task:', error);
            setError(error.message || 'Failed to delete task');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    ✖
                </button>

                <div className={`${styles.addTaskForm} ${styles.deleteConfirmation}`}>
                    <h2>Confirm Delete</h2>
                    <p>Are you sure you want to delete the task "{task.title}"?</p>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    <div className={styles.buttonGroup}>
                        <button 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={styles.deleteButton}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Task'}
                        </button>
                        <button 
                            onClick={onClose}
                            disabled={isDeleting}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}