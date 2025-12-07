import { getTodosCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// GET all todos
export async function GET() {
    try {
        const collection = await getTodosCollection();
        const todos = await collection.find({}).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({
            success: true,
            data: todos
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch todos' },
            { status: 500 }
        );
    }
}

// POST create new todo
export async function POST(request) {
    try {
        const body = await request.json();
        const { title } = body;

        if (!title || title.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'Title is required' },
                { status: 400 }
            );
        }

        const collection = await getTodosCollection();
        const newTodo = {
            title: title.trim(),
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(newTodo);
        const insertedTodo = await collection.findOne({ _id: result.insertedId });

        return NextResponse.json(
            { success: true, data: insertedTodo },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating todo:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create todo' },
            { status: 500 }
        );
    }
}
