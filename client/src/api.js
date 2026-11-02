const DJANGO_API_URL =
  import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8000/api";

export { DJANGO_API_URL };
export default DJANGO_API_URL;