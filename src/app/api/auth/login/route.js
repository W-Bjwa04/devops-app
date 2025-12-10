import { NextResponse } from 'next/server';

// Predefined user - ONLY this user can login
const ALLOWED_USER = {
    email: 'waleed@selenium.testing.org',
    password: 'waleedSeleniumTesting'
};

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

        // Check if user matches the predefined user
        if (email === ALLOWED_USER.email && password === ALLOWED_USER.password) {
            return NextResponse.json({
                success: true,
                user: { email: email },
                message: 'Login successful'
            });
        }

        // For all other users (including registered ones)
        return NextResponse.json(
            { success: false, error: 'Sorry! You are not allowed to login. Site is in progress.' },
            { status: 403 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        );
    }
}
