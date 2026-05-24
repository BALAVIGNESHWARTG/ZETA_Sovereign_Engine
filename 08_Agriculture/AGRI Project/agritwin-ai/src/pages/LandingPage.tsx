import React from 'react';
import { 
  Sprout, 
  Satellite, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Zap, 
  Globe, 
  Smartphone, 
  Database,
  Cpu,
  Leaf,
  Droplets,
  Bug,
  CloudSun,
  BarChart3,
  Lock,
  Users,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-stone-900">AgriTwin AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-stone-600 hover:text-emerald-600 transition-colors">Features</a>
              <a href="#impact" className="text-stone-600 hover:text-emerald-600 transition-colors">Impact</a>
              <a href="#architecture" className="text-stone-600 hover:text-emerald-600 transition-colors">Technology</a>
              <Link 
                to="/dashboard" 
                className="bg-stone-900 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                Launch App <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-stone-100/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Team Godzilla Presents
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-stone-900 mb-6 leading-[1.1]">
                When Agriculture is Under Threat, <span className="text-emerald-600">Godzilla Rises.</span>
              </h1>
              <p className="text-xl text-stone-600 mb-8 leading-relaxed max-w-lg">
                A blockchain-integrated, explainable AI system creating a digital twin for every farm. 
                Satellite monitoring, IoT sensors, and farmer intelligence in one transparent platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/dashboard" 
                  className="inline-flex justify-center items-center px-8 py-4 text-lg font-semibold rounded-2xl bg-stone-900 text-white hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                  Enter Dashboard
                </Link>
                <a 
                  href="#features" 
                  className="inline-flex justify-center items-center px-8 py-4 text-lg font-semibold rounded-2xl bg-white text-stone-900 border border-stone-200 hover:bg-stone-50 transition-all"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-white aspect-[4/3]">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900/5 to-emerald-900/5"></div>
                {/* Abstract visualization of a digital twin */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-3/4">
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                      <Satellite className="h-8 w-8 text-emerald-600 mb-3" />
                      <div className="h-2 w-16 bg-emerald-200 rounded mb-2"></div>
                      <div className="h-2 w-24 bg-emerald-100 rounded"></div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                      <Activity className="h-8 w-8 text-blue-600 mb-3" />
                      <div className="h-2 w-16 bg-blue-200 rounded mb-2"></div>
                      <div className="h-2 w-24 bg-blue-100 rounded"></div>
                    </div>
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                      <ShieldCheck className="h-8 w-8 text-amber-600 mb-3" />
                      <div className="h-2 w-16 bg-amber-200 rounded mb-2"></div>
                      <div className="h-2 w-24 bg-amber-100 rounded"></div>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                      <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
                      <div className="h-2 w-16 bg-purple-200 rounded mb-2"></div>
                      <div className="h-2 w-24 bg-purple-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">28%</div>
              <div className="text-stone-400 text-sm uppercase tracking-wider">Avg Yield Increase</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">17%</div>
              <div className="text-stone-400 text-sm uppercase tracking-wider">Cost Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">98%</div>
              <div className="text-stone-400 text-sm uppercase tracking-wider">Disease Detection</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">3 Days</div>
              <div className="text-stone-400 text-sm uppercase tracking-wider">Claim Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Empowering Farmers with Precision</h2>
            <p className="text-lg text-stone-600">
              AgriTwin AI brings a suite of advanced capabilities designed to transform traditional farming into a data-driven enterprise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Satellite className="h-6 w-6" />}
              title="Digital Farm Twin"
              description="Satellite NDVI + IoT sensors + farmer inputs create real-time farm intelligence."
              color="bg-blue-50 text-blue-700"
            />
            <FeatureCard 
              icon={<Bug className="h-6 w-6" />}
              title="Disease Detection"
              description="TensorFlow Lite on-device models detect crop diseases with 98% accuracy."
              color="bg-red-50 text-red-700"
            />
            <FeatureCard 
              icon={<CloudSun className="h-6 w-6" />}
              title="Hyper-Local Weather"
              description="Machine Learning Ensembles (XGBoost) provide precise micro-climate predictions."
              color="bg-amber-50 text-amber-700"
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Blockchain Verification"
              description="Parametric insurance and carbon credits with tamper-proof transparency on Polygon."
              color="bg-purple-50 text-purple-700"
            />
            <FeatureCard 
              icon={<TrendingUp className="h-6 w-6" />}
              title="Market Forecasting"
              description="Price forecasting connecting farmers directly to buyers for maximum profit."
              color="bg-emerald-50 text-emerald-700"
            />
            <FeatureCard 
              icon={<Leaf className="h-6 w-6" />}
              title="Carbon Tracking"
              description="Life Cycle Assessment models and satellite biomass estimation for carbon credits."
              color="bg-lime-50 text-lime-700"
            />
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-6">Built for Scale, Designed for Reality</h2>
              <p className="text-lg text-stone-600 mb-8">
                Our stack combines enterprise-grade AI with offline-first architecture, ensuring every farmer benefits — even in low-connectivity zones.
              </p>
              
              <div className="space-y-6">
                <TechItem 
                  icon={<Smartphone className="h-5 w-5" />}
                  title="Mobile-First & Offline"
                  description="Python + Flutter with TensorFlow Lite models under 10MB."
                />
                <TechItem 
                  icon={<Globe className="h-5 w-5" />}
                  title="Satellite Analytics"
                  description="Google Earth Engine for NDVI-based vegetation health monitoring."
                />
                <TechItem 
                  icon={<Lock className="h-5 w-5" />}
                  title="Blockchain Layer"
                  description="Polygon/Ethereum smart contracts for transparent transactions."
                />
                <TechItem 
                  icon={<Cpu className="h-5 w-5" />}
                  title="Explainable AI"
                  description="XGBoost + SHAP for transparent predictions farmers can trust."
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-200">
              <h3 className="font-bold text-xl mb-6 border-b pb-4">System Architecture</h3>
              <div className="space-y-4">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="font-semibold text-sm text-stone-500 uppercase mb-2">Data Ingestion</div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-white border rounded text-xs font-mono">Satellite (GEE)</span>
                    <span className="px-2 py-1 bg-white border rounded text-xs font-mono">IoT (MQTT)</span>
                    <span className="px-2 py-1 bg-white border rounded text-xs font-mono">User Input</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="rotate-90 text-stone-300" />
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="font-semibold text-sm text-emerald-600 uppercase mb-2">Intelligence Core</div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-white border rounded text-xs font-mono">XGBoost + SHAP</span>
                    <span className="px-2 py-1 bg-white border rounded text-xs font-mono">TensorFlow Lite</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="rotate-90 text-stone-300" />
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="font-semibold text-sm text-purple-600 uppercase mb-2">Trust Layer</div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-white border rounded text-xs font-mono">Polygon Smart Contracts</span>
                    <span className="px-2 py-1 bg-white border rounded text-xs font-mono">IPFS Storage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-f8196812c850?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Why 'Godzilla'?</h2>
          <p className="text-xl text-stone-300 mb-10 leading-relaxed">
            Because agriculture doesn't need another app. It needs a protector.
            Godzilla represents strength, resilience, and unstoppable force.
            Just like Indian farmers.
          </p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
          >
            Launch AgriTwin Platform <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-stone-800 p-1.5 rounded-lg">
              <Sprout className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="font-bold text-lg text-stone-200">AgriTwin AI</span>
          </div>
          <div className="text-sm">
            © 2026 Team Godzilla. Hack O Hertz | Agriculture Track.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:shadow-lg transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TechItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-700">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-stone-900">{title}</h4>
        <p className="text-stone-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
