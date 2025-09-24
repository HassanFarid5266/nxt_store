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
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}
