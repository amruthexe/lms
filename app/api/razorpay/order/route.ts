import { NextRequest, NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";
import { v4 as uuid } from "uuid";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { courseId, userId } = await req.json();

    if (!courseId || !userId) {
      return NextResponse.json(
        { error: "Course ID and User ID are required" },
        { status: 400 }
      );
    }

    // 1. Query course details from Sanity
    const course = await getCourseById(courseId);
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    const { emailAddresses, firstName, lastName, imageUrl } = clerkUser;
    const email = emailAddresses[0]?.emailAddress;

    if (!emailAddresses || !email) {
      return NextResponse.json(
        { error: "User details not found" },
        { status: 400 }
      );
    }

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // 2. Create a user in sanity if it doesn't exist
    const user = await createStudentIfNotExists({
      clerkId: userId,
      email: email || "",
      firstName: firstName || email,
      lastName: lastName || "",
      imageUrl: imageUrl || "",
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // 3. Validate course data and prepare price for Razorpay
    if (!course.price && course.price !== 0) {
      return NextResponse.json(
        { error: "Course price is not set" },
        { status: 400 }
      );
    }

    const priceInPaise = Math.round(course.price * 100); // Convert to paise

    // if course is free, create enrollment and return success (BYPASS RAZORPAY)
    if (priceInPaise === 0) {
      await createEnrollment({
        studentId: user._id,
        courseId: course._id,
        paymentId: "free",
        amount: 0,
      });

      return NextResponse.json({
        success: true,
        isFree: true,
        redirectUrl: `/courses/${course.slug?.current}`,
      });
    }

    const { title, description } = course;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Course data is incomplete" },
        { status: 400 }
      );
    }

    // 4. Create Razorpay order
    const options = {
      amount: priceInPaise, // amount in paise
      currency: "INR",
      receipt: uuid(),
      notes: {
        courseId: course._id,
        userId: userId,
        courseName: title,
      },
    };

    const order = await razorpay.orders.create(options);

    // 5. Return order details for frontend
    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseTitle: title,
      courseDescription: description,
    });
  } catch (error) {
    // Log error without exposing sensitive details
    console.error("Error creating Razorpay order");
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
} 