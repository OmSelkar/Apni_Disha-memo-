"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const slides = [
  { id: 0, title: "Hello! 👋", subtitle: "I'm so excited to meet you!", message: "Let's create your awesome profile together. I want to know everything about you!", type: "intro" },
  { id: 1, title: "What's your name?", subtitle: "Let's start with the basics", message: "Tell me your full name!", type: "input", field: "name", placeholder: "Enter your full name" },
  { id: 2, title: "What's your email?", subtitle: "I promise to keep it safe!", message: "This helps us stay connected.", type: "input", field: "email", placeholder: "your@email.com" },
  { id: 3, title: "Which class are you in?", subtitle: "Ninth? Tenth? Eleventh? Twelfth?", message: "Let me know what class you're studying in.", type: "input", field: "class", placeholder: "9, 10, 11, 12" },
  { id: 4, title: "What grade are you aiming for?", subtitle: "Your current or target grade", message: "A+, A, B, C?", type: "input", field: "grade", placeholder: "A+, A, B, C" },
  { id: 5, title: "School / College?", subtitle: "Where do you study?", message: "What's the name of your school or college?", type: "input", field: "school", placeholder: "School Name" },
  { id: 6, title: "Hobbies 🎨", subtitle: "What do you love doing?", message: "Drawing? Gaming? Reading?", type: "input", field: "hobbies", placeholder: "Drawing, Gaming" },
  { id: 7, title: "Activities 🎭", subtitle: "Clubs? Teams?", message: "Tell me about your extracurriculars.", type: "input", field: "extracurriculars", placeholder: "Debate, Football" },
  { id: 8, title: "Interests ⭐", subtitle: "What makes you curious?", message: "Science? Art? Technology?", type: "input", field: "interests", placeholder: "Science, Technology" },
  { id: 9, title: "Sports ⚽", subtitle: "What do you play?", message: "Cricket? Badminton?", type: "input", field: "sports", placeholder: "Cricket, Badminton" },
  { id: 10, title: "You're all set! 🎉", subtitle: "Your profile is ready!", message: "Let's get started!", type: "success" },
];

export default function ProfileFormPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const [currentSlide, setCurrentSlide] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    class: "",
    grade: "",
    school: "",
    hobbies: "",
    extracurriculars: "",
    interests: "",
    sports: "",
  });

  const slide = slides[currentSlide];

  // -------------------------------------------------------------------
  // ✔ CHECK IF STUDENT PROFILE ALREADY EXISTS → SKIP FORM
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkProfile = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8080/api/students/check/${user.id}`);
        const data = await res.json();

        console.log("🔍 Backend check profile:", data);

        if (data.exists) {
          console.log("➡️ Profile exists → redirect home");
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error("❌ Profile check error:", err);
      }
    };

    checkProfile();
  }, [user, isLoaded, navigate]);

  // -------------------------------------------------------------------
  // FORM INPUT HANDLING
  // -------------------------------------------------------------------
  const handleInputChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const isInputValid = () => {
    if (slide.type !== "input") return true;
    return formData[slide.field]?.trim() !== "";
  };

  // -------------------------------------------------------------------
  // ✔ SUBMIT PROFILE (Backend + LocalStorage)
  // -------------------------------------------------------------------
  const handleNext = async () => {
    // next slide
    if (currentSlide < slides.length - 1) {
      return setCurrentSlide((prev) => prev + 1);
    }

    // last slide → save
    try {
      const payload = {
        user_id: user.id,
        ...formData,
      };

      console.log("📤 Sending to backend:", payload);

      const res = await fetch("http://127.0.0.1:8080/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Backend response:", data);

      // ---------------------------------------
      // ✔ SAVE PROFILE TO LOCALSTORAGE
      // ---------------------------------------
      localStorage.setItem("apnidisha_student_profile", JSON.stringify(payload));
      console.log("💾 Saved to localStorage!");

      navigate("/", { replace: true });
    } catch (err) {
      console.error("❌ Profile submit error:", err);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
  };

  const progress = Math.round(((currentSlide + 1) / slides.length) * 100);

  // -------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFE5F0] via-[#F0E8FF] to-[#E0F7FF] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm font-semibold">
            <p>Step {currentSlide + 1} of {slides.length}</p>
            <p>{progress}%</p>
          </div>

          <div className="w-full bg-white rounded-full h-3 shadow">
            <div
              className="h-full bg-gradient-to-r from-[#FF6B9D] via-[#7B68EE] to-[#00CED1] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">

          {/* INTRO */}
          {slide.type === "intro" && (
            <div className="text-center space-y-6 py-12">
              <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-[#FF6B9D] to-[#7B68EE] bg-clip-text">
                {slide.title}
              </h1>
              <p className="text-lg text-gray-600">{slide.subtitle}</p>
              <p className="text-md text-gray-500">{slide.message}</p>
            </div>
          )}

          {/* INPUT SLIDE */}
          {slide.type === "input" && (
            <div className="space-y-6 py-8">
              <h2 className="text-3xl font-bold">{slide.title}</h2>
              <p className="text-lg text-gray-600">{slide.subtitle}</p>

              <Input
                type={slide.field === "email" ? "email" : "text"}
                name={slide.field}
                placeholder={slide.placeholder}
                value={formData[slide.field]}
                onChange={handleInputChange}
                className="h-14 rounded-xl text-lg border-2"
              />
            </div>
          )}

          {/* SUCCESS */}
          {slide.type === "success" && (
            <div className="text-center py-12 space-y-6">
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto" />
              <h1 className="text-5xl font-bold">{slide.title}</h1>
              <p className="text-lg text-gray-600">{slide.subtitle}</p>
              <p className="text-md text-gray-500">{slide.message}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            <Button onClick={handlePrev} disabled={currentSlide === 0} variant="outline">
              <ChevronLeft /> Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isInputValid()}
              className="px-8 py-6"
            >
              {currentSlide === slides.length - 1 ? "Finish" : (
                <>Next <ChevronRight /></>
              )}
            </Button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-3 rounded-full transition-all ${
                i === currentSlide
                  ? "bg-gradient-to-r from-[#FF6B9D] to-[#FF1493] w-8"
                  : "bg-white w-3"
              }`}
            />
          ))}
        </div>

      </div>
    </main>
  );
}
