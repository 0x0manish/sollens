import { Search, Shield, BarChart3, Users, AlertTriangle, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Search className="h-5 w-5 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold">Sollens</h1>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
          <Link href="/login">Launch App</Link>
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Verify Any <span className="text-emerald-400">Solana Token</span> With Confidence
          </h1>
          <p className="text-lg text-slate-300 mb-8">
            Sollens provides comprehensive analysis and verification for Solana tokens. Check authenticity, review
            metrics, and make informed decisions in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg" asChild>
              <Link href="/login">Analyze Token</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-0.5 bg-emerald-500/30 rounded-2xl blur-xl"></div>
            <div className="relative bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Search className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <div className="h-10 bg-slate-700 rounded-lg px-4 flex items-center">
                    <input
                      type="text"
                      placeholder="Enter token address..."
                      className="bg-transparent w-full outline-none text-white"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg flex items-center gap-3">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  <div>
                    <h3 className="font-medium">Security Score</h3>
                    <div className="w-full bg-slate-600 h-2 rounded-full mt-1">
                      <div className="bg-emerald-500 h-2 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                  <span className="ml-auto font-bold">85/100</span>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                  <div>
                    <h3 className="font-medium">Liquidity</h3>
                    <p className="text-sm text-slate-300">$2.4M (Verified)</p>
                  </div>
                  <Check className="ml-auto h-5 w-5 text-emerald-500" />
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg flex items-center gap-3">
                  <Users className="h-5 w-5 text-emerald-500" />
                  <div>
                    <h3 className="font-medium">Holder Distribution</h3>
                    <p className="text-sm text-slate-300">Top 10 hold 42%</p>
                  </div>
                  <AlertTriangle className="ml-auto h-5 w-5 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-800/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Token Analysis</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Sollens provides in-depth analysis of any Solana token, helping you make informed decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-6 w-6 text-emerald-500" />,
                title: "DEX Verification",
                description: "Instantly verify if tokens are listed on trusted DEXs and spot potential red flags before trading.",
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-emerald-500" />,
                title: "Liquidity Analysis",
                description: "Verify liquidity depth and distribution across different exchanges.",
              },
              {
                icon: <Users className="h-6 w-6 text-emerald-500" />,
                title: "Holder Distribution",
                description: "Examine token distribution to identify concentration risks.",
              },
              {
                icon: <AlertTriangle className="h-6 w-6 text-emerald-500" />,
                title: "Scam Detection",
                description: "Identify common scam patterns and suspicious token behaviors.",
              },
              {
                icon: <ExternalLink className="h-6 w-6 text-emerald-500" />,
                title: "On-Chain Activity",
                description: "Track real-time transactions and trading patterns.",
              },
              {
                icon: <Check className="h-6 w-6 text-emerald-500" />,
                title: "Team Verification",
                description: "Verify team identities and previous project history.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="bg-slate-700/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Sollens Works</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Our advanced analysis engine provides real-time insights in just a few seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Enter Token Address",
                description: "Paste any Solana token address or search by name.",
              },
              {
                step: "02",
                title: "Instant Analysis",
                description: "Our engine analyzes on-chain data, contract code, and market metrics.",
              },
              {
                step: "03",
                title: "Review Results",
                description: "Get a comprehensive report with actionable insights and risk assessment.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-full">
                  <div className="text-5xl font-bold text-emerald-500/20 mb-4">{step.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-slate-300">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M1 7H13M13 7L7 1M13 7L7 13"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">Everything you need to know about Sollens.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does Sollens verify token authenticity?",
                answer:
                  "Sollens uses a combination of on-chain data analysis, contract code review, and market metrics to verify token authenticity. We check for common scam patterns, analyze liquidity depth, and verify team information.",
              },
              {
                question: "Is Sollens free to use?",
                answer:
                  "Sollens offers both free and premium tiers. Basic token analysis is available for free, while advanced features like real-time alerts and detailed reports require a premium subscription.",
              },
              {
                question: "How accurate is the security score?",
                answer:
                  "Our security score is based on multiple factors including contract code, liquidity metrics, holder distribution, and trading patterns. While highly accurate, we recommend using it as one of several tools in your research process.",
              },
              {
                question: "Can I analyze tokens on other blockchains?",
                answer:
                  "Currently, Sollens focuses exclusively on Solana tokens to provide the most accurate and in-depth analysis. Support for additional blockchains is on our roadmap.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-medium">{faq.question}</h3>
                    <span className="ml-6 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-slate-300">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Search className="h-5 w-5 text-slate-900" />
              </div>
              <h1 className="text-xl font-bold">Sollens</h1>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
              <Link href="#features" className="hover:text-emerald-400 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                How It Works
              </Link>
              <Link href="#faq" className="hover:text-emerald-400 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} Sollens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
