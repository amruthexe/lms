import Hero from "@/components/Hero";
import { CourseCard } from "@/components/CourseCard";
import { getCourses } from "@/sanity/lib/courses/getCourses";
import { HeroScrollDemo } from "@/components/HeroScrollDemo";
import { HeroSectionOne } from "@/components/HeroSectionOne";
import { BentoGridThirdDemo } from "@/components/BentoGridThirdDemo";
import { TestimonialSection } from "@/components/testimonial";
import { WobbleCardDemo } from "@/components/WobbleCardDemo";
import { ClientToastWrapper } from "@/components/ClientToastWrapper"; // 👈 Add this line

export const dynamic = "force-static";
export const revalidate = 3600; // revalidate at most every hour

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-background">
      <ClientToastWrapper /> {/* 👈 Include client toast wrapper */}
      
      {/* <Hero />
      <HeroScrollDemo/> */}
      <HeroSectionOne />
      
      {/* Courses Grid */}
      <div className="container mx-auto px-20">
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
          <span id="course" className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Featured Courses
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        </div>

        <div className="grid grid-cols-1 px-10 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {courses.map((course: any) => (
            <CourseCard
              key={course._id}
              course={course}
              href={`/courses/${course.slug}`}
            />
          ))}
        </div>

        <WobbleCardDemo />
        <TestimonialSection />
        <BentoGridThirdDemo />
      </div>
    </div>
  );
}
