"use client";

import { createRazorpayOrder } from "@/actions/createRazorpayOrder";
import { useUser } from "@clerk/nextjs";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Script from "next/script";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

function EnrollButton({
  courseId,
  isEnrolled,
}: {
  courseId: string;
  isEnrolled: boolean;
}) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleEnroll = async (courseId: string) => {
    startTransition(async () => {
      try {
        const userId = user?.id;
        if (!userId) return;

        const orderResult = await createRazorpayOrder(courseId, userId);
        
        // Handle free course
        if (orderResult.isFree) {
          router.push(orderResult.redirectUrl);
          return;
        }

        // Configure Razorpay options
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderResult.amount,
          currency: orderResult.currency,
          name: "Talent Trek",
          description: `Purchase: ${orderResult.courseTitle}`,
          order_id: orderResult.orderId,
          handler: async function (response: RazorpayResponse) {
            try {
              // Verify payment
              const verifyResponse = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  courseId,
                  userId,
                }),
              });

              const verifyResult = await verifyResponse.json();

              if (verifyResponse.ok && verifyResult.success) {
                // Payment successful, redirect to course
                router.push(`/dashboard/courses/${courseId}`);
                router.refresh();
              } else {
                throw new Error(verifyResult.error || "Payment verification failed");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: `${user?.firstName} ${user?.lastName}`,
            email: user?.emailAddresses[0]?.emailAddress,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function() {
              console.log("Payment modal closed");
            }
          }
        };

        // Open Razorpay checkout
        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          throw new Error("Razorpay SDK not loaded");
        }
      } catch (error) {
        console.error("Error in handleEnroll:", error);
        alert("Failed to initiate payment. Please try again.");
      }
    });
  };

  // Show loading state while checking user is loading
  if (!isUserLoaded || isPending) {
    return (
      <div className="w-full h-12 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Show enrolled state with link to course
  if (isEnrolled) {
    return (
      <Link
        prefetch={false}
        href={`/dashboard/courses/${courseId}`}
        className="w-full rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 h-12 flex items-center justify-center gap-2 group"
      >
        <span>Access Course</span>
        <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </Link>
    );
  }

  // Show enroll button only when we're sure user is not enrolled
  return (
    <>
      {/* Load Razorpay script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      
      <button
        className={`w-full rounded-lg px-6 py-3 font-medium transition-all duration-300 ease-in-out relative h-12
          ${
            isPending || !user?.id
              ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:scale-100"
              : "bg-white text-black hover:scale-105 hover:shadow-lg hover:shadow-black/10"
          }
        `}
        disabled={!user?.id || isPending}
        onClick={() => handleEnroll(courseId)}
      >
        {!user?.id ? (
          <span className={`${isPending ? "opacity-0" : "opacity-100"}`}>
            Sign in to Enroll
          </span>
        ) : (
          <span className={`${isPending ? "opacity-0" : "opacity-100"}`}>
            Enroll Now
          </span>
        )}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
      </button>
    </>
  );
}

export default EnrollButton;
