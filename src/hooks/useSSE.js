import { useEffect, useRef } from "react";
import request from '../utils/api.ts';

const useSSE = (onUpdate) => {
  const eventSourceRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      if (eventSourceRef.current) {

        eventSourceRef.current.close();
      }
      const es = new EventSource(`${import.meta.env.VITE_API_URL}/sse/`);
      eventSourceRef.current = es;

      es.onopen = async () => {
        console.log("[SSE] Connected");
	try {
        const res = await request('last-updated');
        const { last_updated } = res.data

        const localUpdated = localStorage.getItem('last_updated');
        const isOutdated = !localUpdated || new Date(last_updated) > new Date(localUpdated);

        if (isOutdated) {
          console.log("🔄 Обновляем данные по SSE");
          await onUpdate();
	  localStorage.setItem('last_updated', new Date(last_updated).toISOString());
        } else {
          console.log("✅ Данные локально актуальны");
        }
      } catch (e) {
        console.warn("⚠️ Ошибка при проверке обновлений через SSE:", e);
      }
    };

      es.onmessage = (event) => {
        if (event.data === "update") {
          console.log("[SSE] Received update");
          onUpdate();
	  localStorage.setItem('last_updated', new Date().toISOString());
        } else {
          console.log("[SSE] Keep-alive/ping received");
        }
      };

      es.onerror = (err) => {
        console.error("[SSE] Error occurred:", err);
        es.close();

        retryTimeoutRef.current = setTimeout(() => {
          console.log("[SSE] Attempting to reconnect...");
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [onUpdate]);
};

export default useSSE;
