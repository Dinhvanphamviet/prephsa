
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, BookOpen, PenTool } from 'lucide-react';

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Banner Section */}
            <div className="relative overflow-hidden rounded-xl bg-[#2563eb] p-6 text-white md:p-10">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold font-game mb-2">Phòng Khảo Thí - TSA</h1>
                    <p className="text-blue-100 max-w-xl text-lg font-game">
                        Danh sách phòng thi Đánh Giá Tư Duy TSA. Tham gia thi thử để đánh giá năng lực hiện tại của bản thân.
                    </p>
                </div>
                {/* Decorative circles/elements if needed, for simplicity just color */}
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium font-game">
                            Tổng Học Viên
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-game">1,234</div>
                        <p className="text-sm text-muted-foreground font-game">
                            +12% so với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium font-game">
                            Bài Thi Đã Tạo
                        </CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-game">89</div>
                        <p className="text-sm text-muted-foreground font-game">
                            +5% so với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium font-game">
                            Bài Luyện Tập
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-game">456</div>
                        <p className="text-sm text-muted-foreground font-game">
                            +8% so với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium font-game">
                            Điểm Trung Bình
                        </CardTitle>
                        <PenTool className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-game">8.5</div>
                        <p className="text-sm text-muted-foreground font-game">
                            +2% so với tháng trước
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart/Activity Section Placeholder */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="font-game text-xl">Hoạt Động Hàng Tuần</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
                        Biểu đồ hoạt động
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="font-game text-xl">Kết Quả Thi Gần Đây</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
                        Biểu đồ kết quả
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
