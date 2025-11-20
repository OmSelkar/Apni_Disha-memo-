"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

const slides = [
  {
    id: 0,
    title: "Hello! 👋",
    subtitle: "I'm so excited to meet you!",
    message: "Let's create your awesome profile together. I want to know everything about you!",
    type: "intro",
  },
  {
    id: 1,
    title: "What's your name?",
    subtitle: "Let's start with the basics",
    message: "Tell me your full name so I can call you by the right name!",
    type: "input",
    field: "name",
    placeholder: "Enter your full name",
  },
  {
    id: 2,
    title: "What's your email?",
    subtitle: "I promise to keep it safe!",
    message: "This helps us stay connected with you.",
    type: "input",
    field: "email",
    placeholder: "your@email.com",
  },
  {
    id: 3,
    title: "Which class are you in?",
    subtitle: "Ninth? Tenth? Eleventh? Twelfth?",
    message: "Let me know what class you're studying in.",
    type: "input",
    field: "class",
    placeholder: "e.g., 9, 10, 11, 12",
  },
  {
    id: 4,
    title: "What grade are you aiming for?",
    subtitle: "Tell us your current grade or target grade!",
    message: "Are you working towards an A, B, or just doing your best?",
    type: "input",
    field: "grade",
    placeholder: "e.g., A+, A, B, C",
  },
  {
    id: 5,
    title: "What's your school or college?",
    subtitle: "Where do you study?",
    message: "Tell me the name of your school or college.",
    type: "input",
    field: "school",
    placeholder: "School/College name",
  },
  {
    id: 6,
    title: "What are your hobbies? 🎨",
    subtitle: "What do you love doing in your free time?",
    message: "Like drawing, gaming, reading, music? Tell us!",
    type: "input",
    field: "hobbies",
    placeholder: "e.g., Drawing, Gaming, Reading",
  },
  {
    id: 7,
    title: "What activities are you into? 🎭",
    subtitle: "Clubs, teams, groups?",
    message: "Are you part of any clubs, sports teams, or other groups at school?",
    type: "input",
    field: "extracurriculars",
    placeholder: "e.g., Debate Club, Basketball Team",
  },
  {
    id: 8,
    title: "What are your interests? ⭐",
    subtitle: "What makes you curious?",
    message: "Science? Math? Art? Technology? History? Let us know!",
    type: "input",
    field: "interests",
    placeholder: "e.g., Science, Technology, Art",
  },
  {
    id: 9,
    title: "Do you play any sports? ⚽",
    subtitle: "Football, cricket, badminton, tennis?",
    message: "Tell us about the sports you enjoy!",
    type: "input",
    field: "sports",
    placeholder: "e.g., Cricket, Badminton, Swimming",
  },
  {
    id: 10,
    title: "You're all set! 🎉",
    subtitle: "Your profile is ready to go!",
    message: "Great job! Your awesome profile has been created. Let's get started!",
    type: "success",
  },
]

export default function ProfileFormPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
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
  })
  const navigate = useNavigate()

  const slide = slides[currentSlide]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      // Form submission - send data to API
      try {
        const response = await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()
        console.log("[v0] Form submission response:", data)

        if (response.ok) {
          navigate("/quiz")
        }
      } catch (error) {
        console.error("[v0] Form submission error:", error)
      }
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const isInputValid = () => {
    if (slide.type === "input" && slide.field) {
      const value = formData[slide.field]
      return value.trim() !== ""
    }
    return true
  }

  const progress = Math.round(((currentSlide + 1) / slides.length) * 100)

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFE5F0] via-[#F0E8FF] to-[#E0F7FF] flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#FF6B9D] to-[#FF1493] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#7B68EE] to-[#4169E1] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#00CED1] to-[#00BFFF] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Step {currentSlide + 1} of {slides.length}
            </p>
            <p className="text-sm font-semibold text-gray-700">{progress}%</p>
          </div>

          <div className="w-full bg-white rounded-full h-3 shadow-sm overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF6B9D] via-[#7B68EE] to-[#00CED1] transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Intro Slide */}
          {slide.type === "intro" && (
            <div className="text-center space-y-6 py-12">
              <div className="text-6xl mb-4">👋</div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#7B68EE] bg-clip-text text-transparent">
                {slide.title}
              </h1>
              <p className="text-xl text-gray-600">{slide.subtitle}</p>
              <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed">{slide.message}</p>
            </div>
          )}

          {/* Input Slide */}
          {slide.type === "input" && (
            <div className="space-y-6 py-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">{slide.title}</h2>
                <p className="text-lg text-gray-600">{slide.subtitle}</p>
              </div>

              <div className="bg-gradient-to-r from-[#FFE5F0] to-[#E0F7FF] rounded-2xl p-6 mb-8">
                <p className="text-gray-700 text-lg">{slide.message}</p>
              </div>

              <Input
                type={slide.field === "email" ? "email" : "text"}
                name={slide.field}
                value={formData[slide.field]}
                onChange={handleInputChange}
                placeholder={slide.placeholder}
                className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-[#FF6B9D] focus:shadow-lg placeholder:text-gray-400"
                autoFocus
              />
            </div>
          )}

          {/* Success Slide */}
          {slide.type === "success" && (
            <div className="text-center space-y-6 py-12">
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
              <h1 className="text-5xl font-bold text-gray-800">{slide.title}</h1>
              <p className="text-xl text-gray-600">{slide.subtitle}</p>
              <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed">{slide.message}</p>

              <div className="pt-6">
                <div className="bg-gradient-to-r from-[#FFE5F0] to-[#F0E8FF] rounded-2xl p-6 text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#FF6B9D]" />
                    <span className="text-gray-700">
                      <strong>Name:</strong> {formData.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#7B68EE]" />
                    <span className="text-gray-700">
                      <strong>Class:</strong> {formData.class}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#00CED1]" />
                    <span className="text-gray-700">
                      <strong>School:</strong> {formData.school}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-10 gap-4">
            <Button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              variant="outline"
              className="px-6 py-6 rounded-xl border-2 border-gray-300 hover:border-[#FF6B9D] hover:bg-[#FFE5F0] disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold bg-transparent"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={slide.type === "input" && !isInputValid()}
              className="px-8 py-6 rounded-xl bg-gradient-to-r from-[#FF6B9D] to-[#FF1493] hover:shadow-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {currentSlide === slides.length - 1 ? (
                <>Done!</>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {slide.type === "input" && (
            <p className="text-center mt-6 text-sm text-gray-500">
              💡 Tip: All your answers will be saved automatically!
            </p>
          )}
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-gradient-to-r from-[#FF6B9D] to-[#FF1493] w-8"
                  : "bg-white hover:bg-gray-300 w-3"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
