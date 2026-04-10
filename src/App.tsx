import { useState, useEffect } from 'react';
import {
  FluentProvider,
  webDarkTheme,
} from '@fluentui/react-components';
import { AppLayout } from './components/layout/AppLayout';
import { SkillTreePage } from './pages/SkillTreePage';
import { TimelinePage } from './pages/TimelinePage';
import { AchievementPage } from './pages/AchievementPage';
import { AnalysisPage } from './pages/AnalysisPage';
import './styles/acrylic.css';

type PageType = 'skills' | 'timeline' | 'achievements' | 'analysis';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('skills');

  // 监听 hash 变化
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as PageType;
      if (hash && ['skills', 'timeline', 'achievements', 'analysis'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'skills':
        return <SkillTreePage />;
      case 'timeline':
        return <TimelinePage />;
      case 'achievements':
        return <AchievementPage />;
      case 'analysis':
        return <AnalysisPage />;
      default:
        return <SkillTreePage />;
    }
  };

  return (
    <FluentProvider theme={webDarkTheme}>
      <AppLayout 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
      >
        {renderPage()}
      </AppLayout>
    </FluentProvider>
  );
}

export default App;
