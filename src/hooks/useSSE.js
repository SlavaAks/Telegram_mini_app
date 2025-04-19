import { useEffect } from "react";

const useSSE = (onUpdate) => {
  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/sse`);

    eventSource.onmessage = (event) => {
      if (event.data === "update") {
        onUpdate(); // Запускаем обновление данных
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [onUpdate]);
};

export default useSSE;