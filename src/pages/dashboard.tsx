import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
    const [goals, setGoals] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login'); // Redirect to login if no token
        } else {
            // Fetch protected goals data
            const fetchGoals = async () => {
                const response = await fetch('/api/goals', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Send token in header
                    },
                });

                if (!response.ok) {
                    setError('Failed to fetch goals');
                    return;
                }

                const data = await response.json();
                setGoals(data); // Set the fetched goals
            };

            fetchGoals();
        }
    }, [router]);

    return (
        <div>
            <h1>Dashboard</h1>
            {error && <p>{error}</p>}
            <ul>
                {goals.map((goal: any) => (
                    <li key={goal.id}>
                        <p>{goal.description}</p>
                        <p>Category: {goal.category}</p>
                        <p>Status: {goal.isPrivate ? 'Private' : 'Public'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
