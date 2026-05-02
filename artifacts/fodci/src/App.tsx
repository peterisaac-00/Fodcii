import { useEffect, useRef } from "react"
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react"
import { publishableKeyFromHost } from "@clerk/react/internal"
import { shadcn } from "@clerk/themes"
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter"
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Suspense } from "react"
import NotFound from "@/pages/not-found"
import HomePage from "@/pages/home"
import ProblemsPage from "@/pages/problems"
import ProblemDetailPage from "@/pages/problem-detail"
import LeaderboardPage from "@/pages/leaderboard"
import AboutPage from "@/pages/about"
import ProfilePage from "@/pages/profile"
import UserProfilePage from "@/pages/user-profile"
import WelcomePage from "@/pages/welcome"

const queryClient = new QueryClient()

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
)

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "")

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file")
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "oklch(0.5 0.15 140)",
    colorForeground: "oklch(0.2 0.05 140)",
    colorMutedForeground: "oklch(0.4 0.05 140)",
    colorDanger: "oklch(0.55 0.2 15)",
    colorBackground: "oklch(1 0 0)",
    colorInput: "oklch(0.95 0.01 140)",
    colorInputForeground: "oklch(0.2 0.05 140)",
    colorNeutral: "oklch(0.9 0.02 140)",
    fontFamily: "Poppins, Inter, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-lg border border-gray-100",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-gray-900 font-extrabold tracking-tight",
    headerSubtitle: "text-gray-500 font-medium",
    socialButtonsBlockButtonText: "text-gray-700 font-semibold",
    formFieldLabel: "text-gray-600 font-semibold text-xs uppercase tracking-wide",
    footerActionLink: "text-green-700 font-bold",
    footerActionText: "text-gray-500",
    dividerText: "text-gray-400 text-xs font-semibold uppercase tracking-wider",
    identityPreviewEditButton: "text-green-700 font-bold",
    formFieldSuccessText: "text-green-600",
    alertText: "text-red-700",
    logoBox: "flex justify-center py-2",
    logoImage: "h-8",
    socialButtonsBlockButton: "border border-gray-200 bg-white hover:bg-gray-50 rounded-xl",
    formButtonPrimary: "bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-md",
    formFieldInput: "bg-gray-50 border border-gray-200 rounded-xl text-gray-900",
    footerAction: "bg-gray-50 border-t border-gray-100",
    dividerLine: "bg-gray-200",
    alert: "rounded-xl border border-red-200 bg-red-50",
    otpCodeFieldInput: "border-gray-300 bg-gray-50 text-gray-900 rounded-lg",
    formFieldRow: "gap-3",
    main: "px-8 py-6",
  },
}

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  )
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  )
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk()
  const qc = useQueryClient()
  const prevUserIdRef = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear()
      }
      prevUserIdRef.current = userId
    })
    return unsubscribe
  }, [addListener, qc])

  return null
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/login">
        {() => <Redirect to="/sign-in" />}
      </Route>
      <Route path="/signup">
        {() => <Redirect to="/sign-up" />}
      </Route>
      <Route path="/problems" component={ProblemsPage} />
      <Route path="/problems/:id" component={ProblemDetailPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/users/:id" component={UserProfilePage} />
      <Route path="/welcome_page" component={WelcomePage} />
      <Route path="/welcome" component={WelcomePage} />
      <Route component={NotFound} />
    </Switch>
  )
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation()

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your Fodci account",
          },
        },
        signUp: {
          start: {
            title: "Create your account",
            subtitle: "Join Fodci and start building",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
            <Router />
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  )
}

export default App
