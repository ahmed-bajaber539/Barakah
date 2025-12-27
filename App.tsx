import React, { useState } from 'react';
import { AppProvider } from './context';
import { ViewState } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LearningView } from './components/LearningView';
import { SettingsView } from './components/SettingsView';
import { AllTasksView } from './components/AllTasksView';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'learning': return <LearningView />;
      case 'settings': return <SettingsView />;
      case 'all-tasks': return <AllTasksView />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
