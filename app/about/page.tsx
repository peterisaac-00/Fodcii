"use client"

import { Navigation } from "@/components/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedButton } from "@/components/animated-button"
import { Code2, Target, Users, Zap, ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "Interactive Code Editor",
    description:
      "Practice with our built-in code editor supporting Python, C++, and JavaScript with syntax highlighting.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Structured Learning Path",
    description: "Progress through carefully designed levels from beginner to advanced with curated problem sets.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community & Competition",
    description: "Join a community of learners, compete on leaderboards, and track your progress with others.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Feedback",
    description: "Get immediate feedback on your solutions with detailed explanations and optimization tips.",
  },
]

const stats = [
  { label: "Problems Available", value: "110+" },
  { label: "Programming Languages", value: "3" },
  { label: "Difficulty Levels", value: "3" },
  { label: "Active Users", value: "2,800+" },
]

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative">
          <PageContainer className="py-20 text-center">
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                  Empowering the next generation of{" "}
                  <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    problem solvers
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                  Fodci is a modern coding platform designed to make learning programming concepts engaging,
                  interactive, and accessible to everyone. Whether you're just starting out or looking to sharpen your
                  skills, we provide the tools and community to help you succeed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AnimatedButton
                  size="lg"
                  onClick={() => router.push("/problems")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
                >
                  Start Solving
                  <ArrowRight className="ml-2 h-5 w-5" />
                </AnimatedButton>
                <AnimatedButton
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/signup")}
                  className="px-8 py-3 text-lg"
                >
                  Join Community
                </AnimatedButton>
              </div>
            </div>
          </PageContainer>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <PageContainer>
          <div className="space-y-16">
            {/* Stats */}
            <div className="grid gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-border/50">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Fodci?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We've built a comprehensive platform that combines the best of interactive learning with competitive
                  programming.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {features.map((feature, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                          <div className="text-primary">{feature.icon}</div>
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mission */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                    <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                      We believe that everyone should have access to high-quality programming education. Our mission is
                      to democratize coding education by providing an engaging, interactive platform that adapts to your
                      learning pace and style. We're committed to building a supportive community where learners can
                      grow together and achieve their programming goals.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-8 pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Free to use
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Open source
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Community driven
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      </section>
    </div>
  )
}
