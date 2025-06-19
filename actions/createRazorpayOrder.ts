"use server";

import baseUrl from "@/lib/baseUrl";

export async function createRazorpayOrder(courseId: string, userId: string) {
  try {
    const response = await fetch(`${baseUrl}/api/razorpay/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId,
        userId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create order");
    }

    return result;
  } catch {
    // Log error without exposing sensitive details
    console.error("Failed to create Razorpay order");
    throw new Error("Failed to create Razorpay order");
  }
} 