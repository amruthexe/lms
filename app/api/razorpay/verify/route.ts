import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import razorpay from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId || !userId) {
      return NextResponse.json(
        { error: "Missing required payment verification data" },
        { status: 400 }
      );
    }

    // 1. Verify Razorpay signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.error("Payment verification failed: Invalid signature");
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // 2. Get payment details from Razorpay to get the amount
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (!payment || payment.status !== "captured") {
      return NextResponse.json(
        { error: "Payment not captured" },
        { status: 400 }
      );
    }

    // 3. Get student data
    const student = await getStudentByClerkId(userId);
    
    if (!student?.data?._id) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 400 }
      );
    }

    // 4. Create enrollment record
    await createEnrollment({
      studentId: student.data._id,
      courseId,
      paymentId: razorpay_payment_id,
      amount: payment.amount / 100, // Convert from paise to rupees
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and enrollment created successfully",
    });
  } catch (error) {
    // Log error without exposing sensitive details
    console.error("Payment verification failed");
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
} 