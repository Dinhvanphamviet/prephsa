
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { full_name, phone, address, date_of_birth } = data;

        // Basic validation could go here

        await query(
            `UPDATE users 
             SET full_name = $1, phone = $2, address = $3, date_of_birth = $4
             WHERE id = $5`,
            [full_name, phone, address, date_of_birth, session.user.id]
        );

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
