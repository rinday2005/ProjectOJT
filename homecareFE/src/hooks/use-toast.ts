export const useToast = () => {
  const toast = ({ title, description }: { title: string; description: string }) => {
    console.log(`[Toast] ${title}: ${description}`);
    alert(`${title}\n${description}`);
  };
  return { toast };
};

export default useToast;
