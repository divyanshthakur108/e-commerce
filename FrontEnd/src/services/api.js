/**
 * Safe API Helper Module
 * Ensures request logging, base URL resolution, and safe non-crashing JSON response parsing.
 */

const getEnvApiUrl = () => {
  let url = "https://e-commerce-ubih.onrender.com";
  try {
    if (
      typeof import.meta !== "undefined" &&
      import.meta &&
      import.meta.env &&
      import.meta.env.VITE_API_URL
    ) {
      url = import.meta.env.VITE_API_URL;
    }
  } catch (err) {
    console.warn("[API Client] Failed to read import.meta.env:", err.message);
  }
  return url.replace(/\/+$/, "");
};

export const API_BASE_URL = getEnvApiUrl();

/**
 * Parses response safely checking JSON structure and Content-Type header.
 * Prevents "Unexpected token '<', '<!DOCTYPE '... is not valid JSON" crashes.
 */
export const safeParseJSON = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();
  const trimmed = (rawText || "").trim();

  console.log(
    `[API Client] Response [HTTP ${response.status}] [Content-Type: ${contentType}]`
  );

  // Attempt JSON parsing if text starts with JSON brackets or Content-Type is json
  if (
    trimmed.startsWith("{") ||
    trimmed.startsWith("[") ||
    contentType.includes("application/json")
  ) {
    try {
      const data = JSON.parse(trimmed);
      return data;
    } catch (parseErr) {
      console.error("[API Client] JSON parse error:", parseErr.message);
    }
  }

  // Non-JSON HTML response (e.g. 404/500 proxy page)
  console.error(
    `[API Client] Non-JSON Response (Status ${response.status}):`,
    trimmed.substring(0, 200)
  );

  let extractedMessage = `Server returned non-JSON response (HTTP ${response.status}).`;
  if (trimmed.includes("<title>")) {
    const titleMatch = trimmed.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      extractedMessage += ` Title: ${titleMatch[1]}`;
    }
  } else if (trimmed.includes("<pre>")) {
    const preMatch = trimmed.match(/<pre>(.*?)<\/pre>/i);
    if (preMatch && preMatch[1]) {
      extractedMessage += ` Error: ${preMatch[1]}`;
    }
  }

  throw new Error(extractedMessage);
};

/**
 * Wrapper around fetch with logging, base URL resolution, and safe JSON parsing.
 */
export const safeFetch = async (endpoint, options = {}) => {
  const fullUrl = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  console.log(`[API Client] Executing Request: [${options.method || "GET"}] ${fullUrl}`);

  try {
    const response = await fetch(fullUrl, options);
    const data = await safeParseJSON(response);

    if (!response.ok) {
      const errorMessage =
        data.message || `Request failed with HTTP status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`[API Client] Error during [${options.method || "GET"}] ${fullUrl}:`, error);
    throw error;
  }
};
