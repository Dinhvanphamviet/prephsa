
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Pencil } from "lucide-react"

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const profileSchema = z.object({
    full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    phone: z.string().optional(),
    address: z.string().optional(),
    date_of_birth: z.date().optional(),
})

interface EditProfileDialogProps {
    user: {
        full_name: string
        phone?: string | null
        address?: string | null
        date_of_birth?: string | Date | null
    }
}

export function EditProfileDialog({ user }: EditProfileDialogProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: user.full_name || "",
            phone: user.phone || "",
            address: user.address || "",
            date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : undefined,
        },
    })

    const isSubmitting = form.formState.isSubmitting

    async function onSubmit(data: z.infer<typeof profileSchema>) {
        try {
            const response = await fetch("/api/user/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to update profile")
            }

            toast.success("Cập nhật hồ sơ thành công")
            setOpen(false)
            router.refresh()
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật hồ sơ")
            console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit Profile</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-game text-2xl">Chỉnh Sửa Hồ Sơ</DialogTitle>
                    <DialogDescription className="font-game text-lg">
                        Cập nhật thông tin cá nhân của bạn tại đây.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-game text-lg">Họ và Tên</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="font-game text-xl h-12" />
                                    </FormControl>
                                    <FormMessage className="font-game text-base" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-game text-lg">Số Điện Thoại</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="font-game text-xl h-12" />
                                    </FormControl>
                                    <FormMessage className="font-game text-base" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date_of_birth"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="font-game text-lg">Ngày Sinh</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal font-game text-sm h-12",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "dd/MM/yyyy")
                                                    ) : (
                                                        <span>Chọn ngày sinh</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                                className="font-game"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage className="font-game text-base" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-game text-lg">Địa Chỉ</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="font-game text-lg" />
                                    </FormControl>
                                    <FormMessage className="font-game" />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="font-game text-lg">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Lưu Thay Đổi
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
