import { ArrowRight, CheckCircle, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
    onEnter: () => void
}

export default function LandingPage({ onEnter }: LandingPageProps) {
    
    const scrollToFeatures = () => {
        const featuresSection = document.getElementById('features')
        featuresSection?.scrollIntoView({ behavior: 'smooth' })
    }

    const features = [
        {
            icon: Zap,
            title: "Instant Status Tracking",
            description: "Move customers from 'Open' to 'Paid' instantly. Track live changes to rates and balances without refreshing."
        },
        {
            icon: Shield,
            title: "Precision Data Integrity",
            description: "Eliminate errors with strict validation for every input. Ensure deposits and rates are always recorded accurately."
        },
        {
            icon: CheckCircle,
            title: "Cash Flow Visibility",
            description: "See exactly who owes you what. Filter by 'Due' or 'Inactive' to prioritize follow-ups and secure your revenue."
        }
    ]

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        CustPay
                    </div>
                    <Button variant="ghost" onClick={onEnter} className="font-medium text-gray-600 hover:text-blue-600">
                        Log In
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                        Manage Payments <br />
                        <span className="text-blue-600">Like a Pro</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Streamline your payment workflows, track transactions in real-time, and gain actionable insights with our powerful dashboard.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <Button 
                            onClick={onEnter}
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 group"
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button 
                            onClick={scrollToFeatures}
                            variant="outline" 
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full border-2 hover:bg-gray-50 transition-colors"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50/50 scroll-mt-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose CustPay?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need to manage your business payments efficiently and accurately.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                            >
                                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        CustPay
                    </div>
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} CustPay Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}