/**
 * Safe API Helper Module
 * Ensures request logging, base URL resolution, and safe non-crashing JSON response parsing.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://e-commerce-ubih.onrender.com";

/**
 * Parses response safely checking Content-Type header.
 * Prevents "Unexpected token '<', '<!DOCTYPE '... is not valid JSON" crashes.
 */
export const safeParseJSON = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  console.log(
    `[API Client] Response [HTTP ${response.status}] [Content-Type: ${contentType}]`
  );

  if (contentType.includes("application/json")) {
    try {
      const data = JSON.parse(rawText);
      console.log("[API Client] Parsed JSON data:", data);
      return data;
    } catch (parseErr) {
      console.error("[API Client] JSON parse failure on text:", rawText);
      throw new Error(`Failed to parse response JSON: ${parseErr.message}`);
    }
  }

  // Non-JSON response (e.g. HTML 404/500 error page from server or proxy fallback)
  console.error(
    `[API Client] Received Non-JSON Response (Status ${response.status}):`,
    rawText.substring(0, 200)
  );

  // Extract <title> or <pre> text from HTML if available
  let extractedMessage = `Server returned non-JSON HTML (HTTP ${response.status}).`;
  if (rawText.includes("<title>")) {
    const titleMatch = rawText.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      extractedMessage += ` Title: ${titleMatch[1]}`;
    }
  } else if (rawText.includes("<pre>")) {
    const preMatch = rawText.match(/<pre>(.*?)<\/pre>/i);
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
