import { getUsersCollection } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

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

        const collection = await getUsersCollection();
        
        // Check if user already exists
        const existingUser = await collection.findOne({ email: email.toLowerCase() });
        
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User already exists with this email' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newUser);
        const insertedUser = await collection.findOne({ _id: result.insertedId });

        // Don't send password to client
        const { password: _, ...userWithoutPassword } = insertedUser;

        return NextResponse.json(
            { 
                success: true, 
                user: userWithoutPassword,
                message: 'Account created successfully'
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
