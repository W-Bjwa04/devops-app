import { NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const usersCollection = await getUsersCollection();
        const user = await usersCollection.findOne({ email: email.toLowerCase() });

        if (user && user.password === password) {
            return NextResponse.json({
                success: true,
                user: { name: user.name, email: user.email },
                message: 'Login successful'
            });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        );
    }
}
