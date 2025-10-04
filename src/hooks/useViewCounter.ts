import { useEffect } from "react";
import { incrementPostView } from "@/lib/postsApi"; // ajusta el path si tu postsApi está en otro lugar

export function useViewCounter(
  postId?: number | string,
  onViewsUpdate?: (v: number) => void
) {
  useEffect(() => {
    if (!postId) return;

    const key = `viewed_post_${postId}`;
    if (sessionStorage.getItem(key)) return; // ya contado en esta sesión
    sessionStorage.setItem(key, "1");

    incrementPostView(postId)
      .then((views) => {
        if (typeof views === "number" && onViewsUpdate) onViewsUpdate(views);
      })
      .catch(() => {});
  }, [postId, onViewsUpdate]);
}