import { API_URL, clearToken } from "@/lib/session";

type RequestOptions = {
  token: string;
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.token}`
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      clearToken();
      window.location.href = "/login";
      throw new Error("Sesion expirada.");
    }

    let detail = "Error en la solicitud.";
    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) {
        detail = data.detail;
      }
    } catch {
      // Keep default message if body is not JSON.
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}
