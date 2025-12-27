import axios from "axios";

export async function login(payload) {
  const response = await axios.post(
    "http://localhost:5000/api/auth/login", // change later
    payload,
    { withCredentials: true }
  );
  return response.data;
}
