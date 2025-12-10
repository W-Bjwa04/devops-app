'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }

        try {
            setUser(JSON.parse(userData));
            setLoading(false);
        } catch (e) {
            localStorage.removeItem('user');
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <header className="app-header">
                <div className="header-content">
                    <div>
                        <h1 className="app-title">DevOps App</h1>
                    </div>
                    <div className="user-section">
                        <span className="user-email">{user?.name || user?.email}</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="status-card">
                    <div className="status-icon">🚧</div>
                    <h2>Site is in Progress</h2>
                    <p>Welcome to your dashboard, {user?.name}. We are currently working on building the features for this application.</p>
                    <p>Please check back later!</p>
                </div>
            </main>

            <style jsx>{`
                .dashboard-content {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 60vh;
                    padding: 2rem;
                }
                .status-card {
                    background: white;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }
                .status-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                h2 {
                    color: #333;
                    margin-bottom: 1rem;
                    font-size: 1.8rem;
                }
                p {
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
}
