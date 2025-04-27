import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
    const [goals, setGoals] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
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
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setGoals(data); // Set the fetched goals
                setLoading(false);
            };

            fetchGoals();
        }
    }, [router]);

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Dashboard</h1>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            <ul className="space-y-4">
                {goals.map((goal: any) => (
                    <li key={goal.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <p className="text-lg font-semibold text-gray-800">{goal.description}</p>
                        <p className="text-sm text-gray-600">Category: {goal.category}</p>
                        <p className={`text-sm mt-2 font-medium ${goal.isPrivate ? 'text-red-500' : 'text-green-500'}`}>
                            Status: {goal.isPrivate ? 'Private' : 'Public'}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
