
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
})

export function ChangePasswordDialog() {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const isSubmitting = form.formState.isSubmitting

    async function onSubmit(data: z.infer<typeof passwordSchema>) {
        try {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Failed to change password")
            }

            toast.success("Đổi mật khẩu thành công")
            setOpen(false)
            form.reset()
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="font-game text-lg" variant="outline">
                    Thay đổi mật khẩu
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-game text-2xl">Đổi Mật Khẩu</DialogTitle>
                    <DialogDescription className="font-game text-lg">
                        Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-game text-lg">Mật Khẩu Hiện Tại</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} className="font-game text-xl md:text-xl h-12" />
                                    </FormControl>
                                    <FormMessage className="font-game text-base" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-game text-lg">Mật Khẩu Mới</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} className="font-game text-xl md:text-xl h-12" />
                                    </FormControl>
                                    <FormMessage className="font-game text-base" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-game text-lg">Xác Nhận Mật Khẩu Mới</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} className="font-game text-xl md:text-xl h-12" />
                                    </FormControl>
                                    <FormMessage className="font-game text-base" />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="font-game text-lg">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Xác Nhận Đổi
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
