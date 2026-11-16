import Toast from "../components/Toast";
export const handleCopy = async (content: string, message?: string) => {
  await navigator.clipboard.writeText(content);
  Toast(message || "Copied Successfully", "success");
};
