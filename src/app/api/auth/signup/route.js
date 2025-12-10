import { NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const usersCollection = await getUsersCollection();
        
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Create new user
        const newUser = {
            name: name.trim(),
            email: email.toLowerCase(),
            password: password, // In a real app, hash this!
            createdAt: new Date()
        };

        await usersCollection.insertOne(newUser);

        return NextResponse.json(
            { 
                success: true, 
                user: { name: newUser.name, email: newUser.email },
                message: 'Account created successfully! You can now login.'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { success: false, error: 'Signup failed' },
            { status: 500 }
        );
    }
}
