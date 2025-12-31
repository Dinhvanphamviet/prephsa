import { auth } from '@/auth';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';
import { AvatarUpload } from '@/components/dashboard/avatar-upload';
import { Button } from '@/components/ui/button';
import { EditProfileDialog } from '@/components/dashboard/edit-profile-dialog';
import { ChangePasswordDialog } from '@/components/dashboard/change-password-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, MapPin, Phone, User, Shield } from 'lucide-react';
import { format } from 'date-fns';




async function getUserProfile(userId: string) {
    try {
        const result = await query(
            'SELECT username, full_name, email, phone, address, date_of_birth, role, created_at, image FROM users WHERE id = $1',
            [userId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const user = await getUserProfile(session.user.id);

    if (!user) {
        return <div>Không tìm thấy thông tin người dùng.</div>;
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-game">Hồ Sơ Của Tôi</h1>
                <EditProfileDialog user={user} />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Identify Card */}
                <Card className="md:col-span-1">
                    <CardHeader className="flex flex-col items-center text-center">
                        <AvatarUpload
                            currentImage={user.image || session.user.image}
                            alt={user.full_name}
                            fallback={user.full_name?.[0]?.toUpperCase() || 'U'}
                        />
                        <CardTitle className="text-xl font-game mt-4">{user.full_name}</CardTitle>
                        <CardDescription className="font-game text-lg">@{user.username}</CardDescription>
                        <div className="mt-4">
                            <Badge variant="secondary" className="font-game px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20">
                                {user.role === 'admin' ? 'Quản trị viên' : user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span className="font-game text-base">Tham gia: {format(new Date(user.created_at), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4" />
                            <span className="font-game text-base">Trạng thái: <span className="text-green-500 font-medium font-game">Đã xác thực</span></span>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Details */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-game text-2xl">Thông Tin Cá Nhân</CardTitle>
                        <CardDescription className="font-game text-base">Chi tiết thông tin liên hệ và cá nhân của bạn.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 font-game text-xl text-muted-foreground">
                                    <Mail className="h-4 w-4" /> Email
                                </label>
                                <div className="p-3 rounded-md bg-muted/50 font-medium border border-border/50 font-game text-xl">
                                    {user.email}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 font-game text-xl text-muted-foreground">
                                    <Phone className="h-4 w-4" /> Số điện thoại
                                </label>
                                <div className="p-3 rounded-md bg-muted/50 font-medium border border-border/50 font-game text-xl">
                                    {user.phone || 'Chưa cập nhật'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 font-game text-xl text-muted-foreground">
                                    <User className="h-4 w-4" /> Ngày sinh
                                </label>
                                <div className="p-3 rounded-md bg-muted/50 font-medium border border-border/50 font-game text-xl">
                                    {user.date_of_birth ? format(new Date(user.date_of_birth), 'dd/MM/yyyy') : 'Chưa cập nhật'}
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 font-game text-xl text-muted-foreground">
                                    <MapPin className="h-4 w-4" /> Địa chỉ
                                </label>
                                <div className="p-3 rounded-md bg-muted/50 font-medium border border-border/50 font-game text-xl">
                                    {user.address || 'Chưa cập nhật'}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <ChangePasswordDialog />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
