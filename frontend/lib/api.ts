import axios, { AxiosError } from "axios"

const prodbase = ""
const localbase = process.env.NEXT_PUBLIC_BACKEND_API
const baseURL = process.env.NODE_ENV === "production" ? prodbase : localbase

const api = axios.create({
  baseURL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
