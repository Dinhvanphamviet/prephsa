
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ message: 'Token là bắt buộc' }, { status: 400 });
        }

        // Verify token
        const result = await query(
            'SELECT * FROM verification_tokens WHERE token = $1 AND expires_at > NOW()',
            [token]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Token không hợp lệ hoặc đã hết hạn' }, { status: 400 });
        }

        const record = result.rows[0];
        const email = record.identifier;

        // Update user email_verified
        await query('UPDATE users SET email_verified = NOW() WHERE email = $1', [email]);

        // Delete token
        await query('DELETE FROM verification_tokens WHERE token = $1', [token]);

        return NextResponse.json({ message: 'Xác thực thành công' });

    } catch (error) {
        console.error('Verify email error:', error);
        return NextResponse.json({ message: 'Lỗi hệ thống' }, { status: 500 });
    }
}
