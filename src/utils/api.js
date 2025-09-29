// API utility functions
export function url(name, params = null) {
  let query = "";

  if (params) {
    query = Object.keys(params)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
      )
      .join("&");

    query = "?" + decodeURIComponent(query);
  } else {
    query = "";
  }
  return `${window.location.origin}/api/method/nextash_store.${name}` + query;
}

export function csrf_token() {
  return document?.querySelector("#csrf_token")?.value || "";
}

export function ApiUrl(name) {
  return `${window.location.origin}/api/method/${name}`;
}

export function searchParams(params) {
  let query = Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    )
    .join("&");
  query = decodeURIComponent(query);
  return query;
}

export function hasProperty(obj, property, other) {
  return obj.hasOwnProperty(property) ? obj[property] : other;
}

// API request helper
export async function apiRequest(url, options = {}) {
  // Validate URL
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided to apiRequest');
  }

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'X-Frappe-CSRF-Token': csrf_token(),
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);

    // Handle response based on content type
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      // Try to parse JSON
      try {
        data = await response.json();
      } catch (jsonError) {
        // Fallback to text if JSON parsing fails
        const text = await response.text();
        data = { message: text || 'Empty response' };
      }
    } else {
      // Non-JSON response
      const text = await response.text();
      data = { message: text || 'Empty response' };
    }

    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Better error logging
    console.error('API request failed:', {
      url,
      error: error.message,
      options: finalOptions
    });
    throw error;
  }
}
