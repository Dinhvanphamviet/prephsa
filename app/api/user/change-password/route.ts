
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { currentPassword, newPassword } = data;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        // Fetch current user password hash
        const result = await query('SELECT password FROM users WHERE id = $1', [session.user.id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const user = result.rows[0];

        // Check if user has a password (OAuth users might not)
        if (!user.password) {
            return NextResponse.json({ message: 'OAuth users cannot change password this way.' }, { status: 400 });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);

        if (!isValid) {
            return NextResponse.json({ message: 'Mật khẩu hiện tại không đúng.' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, session.user.id]);

        return NextResponse.json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
