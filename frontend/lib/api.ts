import axios, { AxiosError } from "axios"

const prodbase = ""
const localbase = process.env.NEXT_PUBLIC_BACKEND_API
const baseURL = process.env.NODE_ENV === "production" ? prodbase : localbase

const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token")
      if (!window.location.pathname.startsWith("/auth/login")) {
        window.location.href = "/auth/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api
