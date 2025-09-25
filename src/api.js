export const API_BASE = "https://quizzes-2.onrender.com"; // Your Render URL

export const signupUser = async (userData) => {
  try {
    console.log("Signup request:", { url: `${API_BASE}/api/user/signup`, data: userData });
    const response = await fetch(`${API_BASE}/api/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Signup response:", data);
    return data; // { message: "User registered successfully", token?, user? }
  } catch (err) {
    console.error("Signup error:", err.message);
    throw err;
  }
};

export const loginUser = async (credentials) => {
  try {
    console.log("Login request:", { url: `${API_BASE}/api/user/signin`, data: credentials });
    const response = await fetch(`${API_BASE}/api/user/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Login response:", data);
    return data; // { token: "...", user: { name, email, role } }
  } catch (err) {
    console.error("Login error:", err.message);
    throw err;
  }
};