
import { NextResponse } from 'next/server';
import { RegisterSchema } from '@/lib/definitions';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsedData = RegisterSchema.safeParse(body);

        if (!parsedData.success) {
            return NextResponse.json(
                { message: 'Dữ liệu không hợp lệ', errors: parsedData.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { username, password, full_name, email, phone, address, date_of_birth, role } = parsedData.data;

        // Check if username exists
        const existingUser = await query('SELECT id FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return NextResponse.json({ message: 'Tên đăng nhập đã tồn tại' }, { status: 409 });
        }

        // Check if email exists
        const existingEmail = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingEmail.rows.length > 0) {
            return NextResponse.json({ message: 'Email đã tồn tại' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Force role to 'student'
        const finalRole = 'student';
        const safeDateOfBirth = date_of_birth === '' ? null : date_of_birth;

        await query(
            `INSERT INTO users (username, password, role, full_name, email, phone, address, date_of_birth)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [username, hashedPassword, finalRole, full_name, email, phone, address, safeDateOfBirth]
        );

        // Generate Verification Token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 3600 * 1000); // 24 hours

        // Store token
        await query(
            'INSERT INTO verification_tokens (identifier, token, expires_at) VALUES ($1, $2, $3)',
            [email, token, expiresAt]
        );

        // Send Email
        await sendVerificationEmail(email, token);

        return NextResponse.json({
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.',
            requireVerification: true
        }, { status: 201 });

    } catch (error) {
        // Detailed error logging
        console.error('====================================');
        console.error('REGISTRATION ERROR:', error);
        if (error instanceof Error) {
            console.error('Stack:', error.stack);
        }
        console.error('====================================');

        return NextResponse.json({
            message: 'Lỗi máy chủ nội bộ',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
