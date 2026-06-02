import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SidebarLayout from './layout/SidebarLayout';
import { IntelligenceProvider } from './context/IntelligenceContext';

import OperationsCenter from './pages/OperationsCenter';
import LiveMonitoring from './pages/LiveMonitoring';
import RulesEngine from './pages/RulesEngine';
import AnalyticsHub from './pages/AnalyticsHub';
import Configuration from './pages/Configuration';

export default function App() {
  return (
    <IntelligenceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SidebarLayout />}>
            <Route index element={<OperationsCenter />} />
            <Route path="monitoring" element={<LiveMonitoring />} />
            <Route path="rules" element={<RulesEngine />} />
            <Route path="analytics" element={<AnalyticsHub />} />
            <Route path="settings" element={<Configuration />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </IntelligenceProvider>
  );
}

