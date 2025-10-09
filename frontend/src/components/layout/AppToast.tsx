import { toast } from "sonner"

export const AppToast = {
  success: (message: string) =>
    toast.success(message, {
      closeButton: true,
    }),

  error: (message: string) =>
    toast.error(message, {
      closeButton: true,
    }),

  info: (message: string) =>
    toast(message, {
      closeButton: true,
    }),
}