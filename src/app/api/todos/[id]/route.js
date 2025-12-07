import { getTodosCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// PUT update todo
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid todo ID' },
                { status: 400 }
            );
        }

        const collection = await getTodosCollection();
        const updateData = {
            updatedAt: new Date(),
        };

        if (body.title !== undefined) {
            if (body.title.trim() === '') {
                return NextResponse.json(
                    { success: false, error: 'Title cannot be empty' },
                    { status: 400 }
                );
            }
            updateData.title = body.title.trim();
        }

        if (body.completed !== undefined) {
            updateData.completed = Boolean(body.completed);
        }

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Todo not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update todo' },
            { status: 500 }
        );
    }
}

// DELETE todo
export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid todo ID' },
                { status: 400 }
            );
        }

        const collection = await getTodosCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Todo not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Todo deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting todo:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete todo' },
            { status: 500 }
        );
    }
}
