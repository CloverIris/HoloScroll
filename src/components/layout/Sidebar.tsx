import { useState } from 'react';
import {
  Nav,
  NavItem,
  Tooltip,
  Button,
  Divider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  BranchFork24Regular,
  Clock24Regular,
  Trophy24Regular,
  ChartPerson24Regular,
  Settings24Regular,
  Navigation24Regular,
  Sparkle24Filled,
  History24Regular,
} from '@fluentui/react-icons';
import type { PageType } from './AppLayout';

const useStyles = makeStyles({
  sidebar: {
    width: '280px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    transition: 'width 0.25s cubic-bezier(0.0, 0.0, 0.2, 1)',
  },
  sidebarCollapsed: {
    width: '68px',
  },
  logoArea: {
    padding: '20px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #60cdff 0%, #0093f5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(96, 205, 255, 0.3)',
  },
  logoText: {
    overflow: 'hidden',
  },
  logoTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
  },
  logoSubtitle: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
  },
  nav: {
    flex: 1,
    padding: '8px',
  },
  navItem: {
    marginBottom: '4px',
    borderRadius: '8px',
  },
  recentSection: {
    padding: '8px 16px',
  },
  recentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    color: tokens.colorNeutralForeground3,
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  recentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    color: tokens.colorNeutralForeground2,
    fontSize: '13px',
    transition: 'all 0.15s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
      color: tokens.colorNeutralForeground1,
    },
  },
  bottomSection: {
    padding: '8px 16px 16px',
  },
  toggleButton: {
    width: '100%',
  },
});

const navItems = [
  { value: 'skills', label: '技能树', icon: BranchFork24Regular },
  { value: 'timeline', label: '时间轴', icon: Clock24Regular },
  { value: 'achievements', label: '成就', icon: Trophy24Regular },
  { value: 'analysis', label: '分析', icon: ChartPerson24Regular },
];

const recentItems = [
  { id: '1', label: '编程基础', type: 'skill' },
  { id: '2', label: '学习 TypeScript', type: 'timeline' },
  { id: '3', label: '初次探索', type: 'achievement' },
];

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const styles = useStyles();

  const sidebarClasses = [styles.sidebar];
  if (collapsed) {
    sidebarClasses.push(styles.sidebarCollapsed);
  }

  return (
    <div className={sidebarClasses.join(' ')}>
      {/* Logo 区域 */}
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>
          <Sparkle24Filled style={{ color: 'white', fontSize: 20 }} />
        </div>
        {!collapsed && (
          <div className={styles.logoText}>
            <div className={styles.logoTitle}>HoloScroll</div>
            <div className={styles.logoSubtitle}>全息卷轴</div>
          </div>
        )}
      </div>

      {/* 导航菜单 */}
      <Nav
        selectedValue={currentPage}
        onSelectedValueChange={(_, data) => onNavigate(data.value as PageType)}
        className={styles.nav}
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return collapsed ? (
            <Tooltip
              key={item.value}
              content={item.label}
              positioning="after"
              relationship="label"
            >
              <Button
                appearance={currentPage === item.value ? 'primary' : 'subtle'}
                icon={<Icon />}
                onClick={() => onNavigate(item.value as PageType)}
                style={{ width: '100%', justifyContent: 'center', marginBottom: 4 }}
              />
            </Tooltip>
          ) : (
            <NavItem
              key={item.value}
              value={item.value}
              icon={<Icon />}
              className={styles.navItem}
            >
              {item.label}
            </NavItem>
          );
        })}
      </Nav>

      {/* 最近访问 */}
      {!collapsed && (
        <>
          <Divider style={{ margin: '8px 16px' }} />
          <div className={styles.recentSection}>
            <div className={styles.recentHeader}>
              <History24Regular fontSize={14} />
              <span>最近访问</span>
            </div>
            {recentItems.map((item) => (
              <div key={item.id} className={styles.recentItem}>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <Divider style={{ margin: '8px 16px' }} />

      {/* 底部操作 */}
      <div className={styles.bottomSection}>
        {!collapsed && (
          <Button
            appearance="subtle"
            icon={<Settings24Regular />}
            onClick={() => onNavigate('settings')}
            style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 8 }}
          >
            设置
          </Button>
        )}
        <Tooltip
          content={collapsed ? '展开菜单' : '收起菜单'}
          positioning="after"
          relationship="label"
        >
          <Button
            appearance="subtle"
            icon={<Navigation24Regular />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.toggleButton}
          >
            {!collapsed && '收起菜单'}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Sidebar;
