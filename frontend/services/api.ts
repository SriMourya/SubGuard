// const BASE_URL = "http://localhost:8080";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Get current user
export const getUser = async () => {

  try {

    const token =
      sessionStorage.getItem("token");

    const userId =
      sessionStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("User not logged in");
    }

    const res = await fetch(
      `${BASE_URL}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await res.json();

    console.log("USER DATA:", data);

    return data;

  } catch (err) {

    console.error(
      "USER FETCH ERROR:",
      err
    );

    return null;
  }
};

export const getSubscriptions = async (userId: number) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login.");
  }

  const res = await fetch(`${BASE_URL}/subscriptions/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  return res.json();
};

export const detectSubscriptions = async (userId: number) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please login.");
    }

    const res = await fetch(`${BASE_URL}/transactions/detect/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Detection failed");
    }

    console.log("DETECT RESPONSE:", res);
    return await res.text();
  } catch (err) {
    console.error("ERROR:", err);
  }
};

export const deleteSubscription = async (id: number) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login.");
  }
  await fetch(`${BASE_URL}/subscriptions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
