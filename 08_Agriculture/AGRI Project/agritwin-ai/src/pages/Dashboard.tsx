import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  TrendingUp, 
  AlertTriangle, 
  MessageSquare, 
  Mic, 
  Send,
  Menu,
  X,
  Sprout,
  Leaf,
  DollarSign,
  Activity,
  Calendar,
  ChevronRight,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// --- Mock Data ---

const marketData = [
  { month: 'Jan', price: 1800, forecast: 1820 },
  { month: 'Feb', price: 1850, forecast: 1840 },
  { month: 'Mar', price: 1900, forecast: 1950 },
  { month: 'Apr', price: 1880, forecast: 1980 },
  { month: 'May', price: 2000, forecast: 2100 },
  { month: 'Jun', price: 2100, forecast: 2150 },
  { month: 'Jul', price: null, forecast: 2200 },
  { month: 'Aug', price: null, forecast: 2250 },
];

const soilData = [
  { name: 'Nitrogen', value: 80, full: 100 },
  { name: 'Phosphorus', value: 45, full: 100 },
  { name: 'Potassium', value: 60, full: 100 },
  { name: 'Moisture', value: 30, full: 100 },
];

const yieldData = [
  { year: '2022', traditional: 4000, agritwin: 4200 },
  { year: '2023', traditional: 3800, agritwin: 4800 },
  { year: '2024', traditional: 4100, agritwin: 5500 },
  { year: '2025', traditional: 3900, agritwin: 6100 },
];

// --- Components ---

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => (
  <>
    <div 
      className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
      onClick={() => setIsOpen(false)}
    />
    <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-stone-900 text-stone-300 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 flex items-center gap-3 border-b border-stone-800">
        <div className="bg-emerald-600 p-1.5 rounded-lg">
          <Sprout className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-white text-lg">AgriTwin AI</span>
      </div>
      
      <nav className="p-4 space-y-2">
        <NavItem icon={<Activity />} label="Overview" active />
        <NavItem icon={<Map />} label="Digital Twin" />
        <NavItem icon={<CloudRain />} label="Weather & Soil" />
        <NavItem icon={<TrendingUp />} label="Market Forecast" />
        <NavItem icon={<Leaf />} label="Carbon Credits" />
        <NavItem icon={<ShieldCheck />} label="Insurance" />
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-800">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-stone-800/50">
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
            BG
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">Balavigneshwar</div>
            <div className="text-xs text-stone-500 truncate">Team Godzilla</div>
          </div>
        </div>
      </div>
    </aside>
  </>
);

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20' : 'hover:bg-stone-800 hover:text-white'}`}>
    {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    <span className="font-medium">{label}</span>
  </button>
);

import { ShieldCheck } from 'lucide-react';

const StatCard = ({ title, value, sub, icon, trend }: { title: string, value: string, sub: string, icon: React.ReactNode, trend?: 'up' | 'down' }) => (
  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-stone-500 text-sm font-medium uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-bold text-stone-900 mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
        {icon}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
      <p className="text-sm text-stone-500">{sub}</p>
    </div>
  </div>
);

const ChatInterface = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Hello! I'm your AgriTwin Assistant. I can help you with crop health, market prices, or insurance claims. How can I help today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-lite-latest",
        systemInstruction: "You are an expert agricultural AI assistant for Indian farmers named AgriTwin. You provide helpful, concise advice on farming, crops, weather, and market prices. You are explainable and transparent."
      });
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userMsg }] }]
      });
      
      const response = result.response.text();
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the satellite network. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-stone-200 bg-emerald-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h3 className="font-bold text-stone-800">AgriTwin Assistant</h3>
        </div>
        <span className="text-xs px-2 py-1 bg-white border border-stone-200 rounded text-stone-500">Powered by Gemini</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-sm'
            }`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-stone-200">
        <div className="flex gap-2">
          <button className="p-2 text-stone-400 hover:text-emerald-600 transition-colors">
            <Mic className="h-5 w-5" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your crops..."
            className="flex-1 bg-stone-100 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ThreatMonitor = () => (
  <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-lg border border-stone-800 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10">
      <ShieldCheck className="w-32 h-32" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Godzilla Shield Active</h3>
          <p className="text-stone-400 text-xs uppercase tracking-wider">Real-time Protection</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-stone-800/50 rounded-xl border border-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium">Pest Monitoring</span>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Secure</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-stone-800/50 rounded-xl border border-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-sm font-medium">Weather Risk</span>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">Moderate</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-stone-800/50 rounded-xl border border-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium">Market Volatility</span>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Stable</span>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-100 font-sans">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-stone-900">Farm Overview</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Satellite Live
              </div>
              <Link to="/" className="text-sm font-medium text-stone-500 hover:text-stone-900">Exit</Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Crop Health (NDVI)" 
                value="0.85" 
                sub="Healthy Growth" 
                icon={<Leaf className="h-5 w-5 text-emerald-600" />}
                trend="up"
              />
              <StatCard 
                title="Soil Moisture" 
                value="32%" 
                sub="Optimal Range" 
                icon={<Droplets className="h-5 w-5 text-blue-600" />}
              />
              <StatCard 
                title="Market Price (Rice)" 
                value="₹2,100/q" 
                sub="+5% Forecast" 
                icon={<DollarSign className="h-5 w-5 text-amber-600" />}
                trend="up"
              />
              <StatCard 
                title="Next Rain" 
                value="2 Days" 
                sub="Light Showers" 
                icon={<CloudRain className="h-5 w-5 text-stone-600" />}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Chart Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Market Forecast Chart */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">Market Price Forecast</h3>
                      <p className="text-sm text-stone-500">Rice (Basmati) - Mandi Prices</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-xs text-stone-500">
                        <span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Actual
                      </span>
                      <span className="flex items-center gap-1 text-xs text-stone-500">
                        <span className="w-3 h-3 bg-emerald-200 rounded-full"></span> Forecast
                      </span>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={marketData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e4" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="forecast" stroke="#a7f3d0" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                        <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Digital Twin Map Placeholder */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-stone-900">Digital Farm Twin</h3>
                    <button className="text-sm text-emerald-600 font-medium hover:underline">View Full Map</button>
                  </div>
                  <div className="relative aspect-video bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
                    {/* Simulated Map UI */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-80"></div>
                    <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply"></div>
                    
                    {/* Overlay Elements */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                        <span>Healthy (0.8+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                        <span>Moderate (0.5-0.8)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        <span>Stressed (&lt;0.5)</span>
                      </div>
                    </div>

                    {/* Interactive Points */}
                    <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative group cursor-pointer">
                        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping absolute"></div>
                        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white relative z-10"></div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-white p-2 rounded-lg shadow-xl text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="font-bold text-red-600">Pest Alert</div>
                          <div>Stem Borer detected</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar / Assistant Area */}
              <div className="space-y-6">
                <ThreatMonitor />
                <ChatInterface />
                
                {/* Soil Health */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <h3 className="text-lg font-bold text-stone-900 mb-4">Soil Health Status</h3>
                  <div className="space-y-4">
                    {soilData.map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-stone-600">{item.name}</span>
                          <span className="font-medium text-stone-900">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.value < 40 ? 'bg-red-500' : item.value < 70 ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`} 
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
