// pages/goals/create.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

const CreateGoalPage = () => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [coupleId, setCoupleId] = useState<number | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const res = await fetch('/api/goals/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Get the token from localStorage or wherever you store it
            },
            body: JSON.stringify({ description, category, isPrivate, coupleId }),
        });

        if (res.ok) {
            await router.push('/goals'); // Redirect to the goals list page after successful creation
        } else {
            console.error('Failed to create goal');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create Goal</h1>
            <input
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                type="text"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
            />
            <label>
                Private
                <input
                    type="checkbox"
                    name="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                />
            </label>
            <input
                type="number"
                name="coupleId"
                value={coupleId ?? ''}
                onChange={(e) => setCoupleId(Number(e.target.value))}
                placeholder="Couple ID (optional)"
            />
            <button type="submit">Create Goal</button>
        </form>
    );
};

export default CreateGoalPage;
