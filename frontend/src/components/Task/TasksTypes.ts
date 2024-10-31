// Define the types for the component's props
export interface TaskProps {
    title: string;
    description: string;
    urgency: 'High' | 'Medium' | 'Low';  // Enforcing only the three valid options
    date: string;  // Assuming date is coming as a string (ISO format)
    completed: boolean;
  }