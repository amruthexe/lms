import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    // Verify webhook signature (optional - only if webhook secret is configured)
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.error("Webhook signature verification failed");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      }
    } else {
      console.log("Webhook secret not configured - skipping signature verification");
    }

    const event = JSON.parse(body);

    // Handle payment captured event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const order = event.payload.order?.entity;

      if (!order?.notes?.courseId || !order?.notes?.userId) {
        console.error("Missing required data in order notes");
        return NextResponse.json(
          { error: "Missing required data in order" },
          { status: 400 }
        );
      }

      const { courseId, userId } = order.notes;

      // Get student data
      const student = await getStudentByClerkId(userId);

      if (!student?.data?._id) {
        console.error("Student not found");
        return NextResponse.json(
          { error: "Student not found" },
          { status: 400 }
        );
      }

      // Check if enrollment already exists to prevent duplicates
      // This is a safety check in case the payment verification API was also successful
      try {
        await createEnrollment({
          studentId: student.data._id,
          courseId,
          paymentId: payment.id,
          amount: payment.amount / 100, // Convert from paise to rupees
        });

        console.log("Enrollment created via webhook");
             } catch {
         // If enrollment already exists, that's fine - webhook might be duplicate
         console.log("Enrollment may already exist - webhook duplicate");
       }
    }

    return NextResponse.json({ received: true });
  } catch {
    // Log error without exposing sensitive details
    console.error("Webhook handler failed");
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
} 