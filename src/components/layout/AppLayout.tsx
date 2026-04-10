import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
    overflow: 'hidden',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  },
});

export type PageType = 'skills' | 'timeline' | 'achievements' | 'analysis' | 'settings';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {/* 左侧边栏 */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* 主内容区 */}
      <div className={styles.mainArea}>
        {/* 顶部标题栏 */}
        <Header currentPage={currentPage} />

        {/* 页面内容 */}
        <main className={styles.content}>{children}</main>
      </div>

      {/* 命令面板 */}
      <CommandPalette onNavigate={onNavigate} />
    </div>
  );
}

export default AppLayout;
