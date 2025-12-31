import { Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CoursesPage() {
    return (
        <div className="flex flex-1 items-center justify-center p-4 min-h-[80vh]">
            <Card className="w-full max-w-md bg-transparent border-0 shadow-none">
                <CardContent className="flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        <div className="relative bg-background p-6 rounded-full border-2 border-primary/20 shadow-xl">
                            <Rocket className="w-16 h-16 text-primary animate-bounce-slow" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-game tracking-wider">
                            SẮP RA MẮT
                        </h2>
                        <p className="text-muted-foreground text-lg font-game">
                            Tính năng <span className="text-foreground font-semibold">Khóa Học</span> đang được phát triển và sẽ sớm được cập nhật trong thời gian tới!
                        </p>
                    </div>

                    {/* Optional: Notify Button */}
                    {/* <Button variant="outline" className="font-game mt-4">
                        Thông báo cho tôi khi ra mắt
                    </Button> */}
                </CardContent>
            </Card>
        </div>
    );
}
