import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Activity, AlertTriangle, CheckCircle2, Clock, TrendingUp, Stethoscope, DollarSign, Users, Settings, BarChart3, Bot, Zap } from 'lucide-react';
import { AutomationDetailsPage } from './AutomationDetailsPage';
type AutoBotDashboardProps = Record<string, never>;
type FunctionalArea = {
  id: string;
  title: string;
  botsActive: number;
  status: 'healthy' | 'warning' | 'error';
  lastIssue: string;
  icon: React.ReactNode;
  successRate: number;
};
const mockData: FunctionalArea[] = [{
  id: '1',
  title: 'Order Processing',
  botsActive: 5,
  status: 'healthy',
  lastIssue: '1 day ago',
  icon: <Box className="w-6 h-6" />,
  successRate: 94
}, {
  id: '2',
  title: 'Veterinary Pathology',
  botsActive: 3,
  status: 'warning',
  lastIssue: '3 hrs ago',
  icon: <Stethoscope className="w-6 h-6" />,
  successRate: 87
}, {
  id: '3',
  title: 'Customer Self-Service',
  botsActive: 4,
  status: 'healthy',
  lastIssue: 'N/A',
  icon: <Users className="w-6 h-6" />,
  successRate: 100
}, {
  id: '4',
  title: 'Finance Reconciliations',
  botsActive: 2,
  status: 'warning',
  lastIssue: '45 mins ago',
  icon: <DollarSign className="w-6 h-6" />,
  successRate: 75
}];
const navItems = [{
  id: 'automations',
  label: 'Automations',
  icon: <Bot className="w-5 h-5" />
}, {
  id: 'issues',
  label: 'Issues',
  icon: <AlertTriangle className="w-5 h-5" />
}, {
  id: 'insights',
  label: 'Insights',
  icon: <BarChart3 className="w-5 h-5" />
}, {
  id: 'settings',
  label: 'Settings',
  icon: <Settings className="w-5 h-5" />
}];

// @component: AutoBotDashboard
export const AutoBotDashboard = (props: AutoBotDashboardProps) => {
  const [activeNav, setActiveNav] = useState('automations');
  const [selectedAutomation, setSelectedAutomation] = useState<FunctionalArea | null>(null);

  // @return
  return <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <header className="bg-[#b7282e] text-white shadow-lg">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="bg-white/10 p-3 rounded-full">
                <Zap className="w-8 h-8 text-[#f7d117]" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">AutoBot</h1>
                <p className="text-white/80 text-sm">Automation Control Center</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
              <Activity className="w-5 h-5 text-[#f7d117]" />
              <div className="text-right">
                <p className="text-xs text-white/70">System Status</p>
                <p className="font-semibold">All Systems Active</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="bg-[#005587] px-8">
          <div className="flex gap-1">
            {navItems.map(item => <button key={item.id} onClick={() => {
            setActiveNav(item.id);
            setSelectedAutomation(null);
          }} className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${activeNav === item.id ? 'bg-[#f5f5f5] text-[#333333] rounded-t-lg' : 'text-white hover:bg-white/10'}`}>
                {item.icon}
                {item.label}
              </button>)}
          </div>
        </nav>
      </header>

      {selectedAutomation ? <AutomationDetailsPage automationId={selectedAutomation.id} automationTitle={selectedAutomation.title} automationIcon={selectedAutomation.icon} onBack={() => setSelectedAutomation(null)} /> : <div className="flex flex-1">
          <aside className="w-64 bg-white border-r border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-[#333333] mb-4 uppercase tracking-wide">
              Functional Areas
            </h2>
            <div className="space-y-2">
              {mockData.map(area => <button key={area.id} onClick={() => setSelectedAutomation(area)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="text-[#b7282e]">{area.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#333333] truncate">{area.title}</p>
                    <p className="text-xs text-gray-500">{area.botsActive} bots</p>
                  </div>
                </button>)}
            </div>
          </aside>

          <main className="flex-1 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-2">Automation Overview</h2>
              <p className="text-gray-600">Monitor and manage all automation processes across Mars</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {mockData.map((area, index) => <motion.div key={area.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#b7282e]/10 rounded-lg text-[#b7282e]">
                          {area.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-[#333333]">{area.title}</h3>
                          <p className="text-sm text-gray-500">{area.botsActive} bots active</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${area.status === 'healthy' ? 'bg-green-100 text-green-700' : area.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {area.status === 'healthy' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {area.status === 'healthy' ? 'Healthy' : 'Warning'}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Success Rate</span>
                        <span className="text-sm font-semibold text-[#333333]">
                          {area.successRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <motion.div initial={{
                    width: 0
                  }} animate={{
                    width: `${area.successRate}%`
                  }} transition={{
                    duration: 1,
                    delay: index * 0.1 + 0.3
                  }} className={`h-full rounded-full ${area.successRate >= 90 ? 'bg-green-500' : area.successRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                        <Clock className="w-4 h-4" />
                        <span>Last issue: {area.lastIssue}</span>
                      </div>

                      <button onClick={() => setSelectedAutomation(area)} className="w-full mt-4 bg-[#005587] hover:bg-[#004570] text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>)}
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#333333]">AI Assistant</h3>
                  <p className="text-sm text-gray-500">Your automation co-pilot (Coming Soon)</p>
                </div>
                <div className="flex items-center gap-2 bg-[#f7d117]/20 text-[#333333] px-4 py-2 rounded-lg">
                  <Bot className="w-5 h-5" />
                  <span className="font-medium">Mars Rover AI</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <motion.div animate={{
              y: [0, -10, 0]
            }} transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }} className="inline-block mb-4">
                  <Bot className="w-16 h-16 text-[#b7282e]" />
                </motion.div>
                <p className="text-gray-600">
                  AI-powered diagnostics and automated issue resolution will appear here
                </p>
              </div>
            </div>
          </main>
        </div>}
    </div>;
};