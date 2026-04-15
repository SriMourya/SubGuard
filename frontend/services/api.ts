const BASE_URL = "http://localhost:8080";

// Get current user (simulate logged-in user)
export const getUser = async () => {
   try {
     const res = await fetch(`${BASE_URL}/users/1`);

     if (!res.ok) {
       throw new Error("Failed to fetch user");
     }

     const data = await res.json();
     console.log("USER DATA:", data); // debug
     return data;
   } catch (err) {
     console.error("USER FETCH ERROR:", err);
     return null;
   }
 };
export const getSubscriptions = async (userId: number) => {
  const res = await fetch(`${BASE_URL}/subscriptions/${userId}`);
  return res.json();
};

export const detectSubscriptions = async (userId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/transactions/detect/${userId}`, {
      method: "POST",
    });
    console.log("DETECT RESPONSE:", res);

    return await res.text();
  } catch (err) {
    console.error("ERROR:", err);
  }
};

export const deleteSubscription = async (id: number) => {
  await fetch(`http://localhost:8080/subscriptions/${id}`, {
    method: "DELETE",
  });
};