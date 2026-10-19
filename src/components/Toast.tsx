import { toast } from "sonner";
export type status = "success" | "warning" | "error" | "loading";
const Toast = (message: string, status: status) => {
  if (status === "success") {
    toast.success(message, {});
  } else if (status === "error") {
    toast.error(message);
  } else if (status === "loading") {
    toast.loading(message);
  } else if (status === "warning") {
    toast.warning(message);
  }
};

export default Toast;
