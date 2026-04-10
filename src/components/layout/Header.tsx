import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Avatar,
  makeStyles,
  tokens,
  Tooltip,
} from '@fluentui/react-components';
import {
  Search24Regular,
  Alert24Regular,
  Settings24Regular,
  BranchFork24Regular,
  Clock24Regular,
  Trophy24Regular,
  ChartPerson24Regular,
  Sparkle24Filled,
} from '@fluentui/react-icons';
import type { PageType } from './AppLayout';

const useStyles = makeStyles({
  header: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
    background: `linear-gradient(180deg, rgba(18, 18, 22, 0.95) 0%, rgba(12, 12, 16, 0.98) 100%)`,
    backdropFilter: 'blur(20px)',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
  },
  centerSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    flex: 1,
  },
  searchButton: {
    minWidth: '320px',
    maxWidth: '480px',
    width: '100%',
    height: '40px',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'rgba(255, 255, 255, 0.12)',
    },
  },
  searchContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: tokens.colorNeutralForeground3,
  },
  searchIcon: {
    fontSize: '18px',
    color: tokens.colorNeutralForeground3,
  },
  searchText: {
    fontSize: '14px',
  },
  shortcutHint: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
  },
  kbd: {
    padding: '3px 8px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '11px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  iconButton: {
    position: 'relative',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
  },
  notificationBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#ff5f57',
    boxShadow: '0 0 8px rgba(255, 95, 87, 0.5)',
  },
  aiIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: 'rgba(96, 205, 255, 0.08)',
    borderRadius: '20px',
    border: '1px solid rgba(96, 205, 255, 0.15)',
  },
  aiText: {
    fontSize: '12px',
    color: '#60cdff',
    fontWeight: 500,
  },
  divider: {
    width: '1px',
    height: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    margin: '0 4px',
  },
});

const pageTitles: Record<PageType, { title: string; icon: typeof BranchFork24Regular }> = {
  skills: { title: '技能树', icon: BranchFork24Regular },
  timeline: { title: '时间轴', icon: Clock24Regular },
  achievements: { title: '成就', icon: Trophy24Regular },
  analysis: { title: '分析', icon: ChartPerson24Regular },
  settings: { title: '设置', icon: Settings24Regular },
};

interface HeaderProps {
  currentPage: PageType;
}

export function Header({ currentPage }: HeaderProps) {
  const styles = useStyles();
  const pageInfo = pageTitles[currentPage];

  const handleSearchClick = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <header className={styles.header}>
      {/* 左侧：面包屑 */}
      <div className={styles.leftSection}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbButton>HoloScroll</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton icon={<pageInfo.icon />}>{pageInfo.title}</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* 中间：搜索按钮 */}
      <div className={styles.centerSection}>
        <Button
          appearance="subtle"
          onClick={handleSearchClick}
          className={styles.searchButton}
        >
          <div className={styles.searchContent}>
            <Search24Regular className={styles.searchIcon} />
            <span className={styles.searchText}>搜索命令、技能、事件...</span>
          </div>
          <span className={styles.shortcutHint}>
            <kbd className={styles.kbd}>Ctrl</kbd>
            <span>+</span>
            <kbd className={styles.kbd}>K</kbd>
          </span>
        </Button>
      </div>

      {/* 右侧：操作按钮 */}
      <div className={styles.rightSection}>
        {/* AI 指示器 */}
        <div className={styles.aiIndicator}>
          <Sparkle24Filled style={{ fontSize: 14, color: '#60cdff' }} />
          <span className={styles.aiText}>AI 就绪</span>
        </div>

        <div className={styles.divider} />

        {/* 通知 */}
        <Tooltip content="通知" relationship="label">
          <Button
            appearance="subtle"
            icon={<Alert24Regular />}
            className={styles.iconButton}
          >
            <span className={styles.notificationBadge} />
          </Button>
        </Tooltip>

        {/* 用户头像 */}
        <Tooltip content="用户设置" relationship="label">
          <Avatar
            name="User"
            size={32}
            style={{ 
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          />
        </Tooltip>
      </div>
    </header>
  );
}

export default Header;
