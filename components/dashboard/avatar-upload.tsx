"use client"

import { CldUploadWidget } from 'next-cloudinary';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface AvatarUploadProps {
    currentImage: string | null | undefined;
    alt: string;
    fallback: string;
}

export function AvatarUpload({ currentImage, alt, fallback }: AvatarUploadProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();
    const { update } = useSession();

    const handleUpload = async (result: any) => {
        const url = result?.info?.secure_url;
        if (!url) return;

        setIsUpdating(true);
        try {
            const res = await fetch('/api/user/update-avatar', {
                method: 'POST',
                body: JSON.stringify({ avatarUrl: url }),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Cập nhật ảnh đại diện thành công!");

            try {
                await update({ user: { image: url } });
                router.refresh();
            } catch (e) {
                // If update() fails (e.g. JSON error), force reload to update UI
                window.location.reload();
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật ảnh.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative group">
            <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2 ring-offset-background cursor-pointer">
                <AvatarImage src={currentImage || ''} alt={alt} className={isUpdating ? 'opacity-50' : ''} />
                <AvatarFallback className="text-2xl font-game">{fallback}</AvatarFallback>
            </Avatar>

            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                    maxFiles: 1,
                    resourceType: "image",
                    clientAllowedFormats: ["image"],
                    maxFileSize: 5000000, // 5MB
                    styles: {
                        palette: {
                            window: "#1e293b",
                            windowBorder: "#334155", // Slate-700
                            tabIcon: "#f8fafc", // Slate-50
                            menuIcons: "#f8fafc",
                            textDark: "#020617",
                            textLight: "#f8fafc",
                            link: "#60a5fa", // Blue-400
                            action: "#60a5fa",
                            inactiveTabIcon: "#94a3b8",
                            error: "#f87171",
                            inProgress: "#60a5fa",
                            complete: "#22c55e",
                            sourceBg: "#0f172a" // Slate-900 
                        },
                        fonts: {
                            "'Jersey 10', sans-serif": "https://fonts.googleapis.com/css2?family=Jersey+10&display=swap",
                        }
                    }
                }}
                onSuccess={handleUpload}
            >
                {({ open }) => (
                    <div
                        onClick={() => !isUpdating && open()}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                    >
                        {isUpdating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                    </div>
                )}
            </CldUploadWidget>
        </div>
    );
}
