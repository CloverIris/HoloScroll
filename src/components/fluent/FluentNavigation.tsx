import { useState } from 'react';
import {
  Nav,
  NavItem,
  NavCategory,
  NavCategoryItem,
  NavSubItem,
  NavSubItemGroup,
  Tooltip,
  Button,
  Divider,
} from '@fluentui/react-components';
import {
  BranchFork24Regular,
  Clock24Regular,
  Trophy24Regular,
  ChartPerson24Regular,
  Settings24Regular,
  Navigation24Regular,
  Sparkle24Filled,
} from '@fluentui/react-icons';
import type { NavItemValue } from '@fluentui/react-components';

type PageType = 'skills' | 'timeline' | 'achievements' | 'analysis' | 'settings';

interface FluentNavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { value: 'skills', label: '技能树', icon: BranchFork24Regular },
  { value: 'timeline', label: '时间轴', icon: Clock24Regular },
  { value: 'achievements', label: '成就', icon: Trophy24Regular },
  { value: 'analysis', label: '分析', icon: ChartPerson24Regular },
];

export function FluentNavigation({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
}: FluentNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div
      className="acrylic-dark"
      style={{
        width: collapsed ? 68 : 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--colorNeutralStroke2)',
        transition: 'width 0.25s cubic-bezier(0.0, 0.0, 0.2, 1)',
        backgroundColor: 'rgba(12, 12, 12, 0.9)',
        backdropFilter: 'blur(60px) saturate(150%)',
      }}
    >
      {/* Logo 区域 */}
      <div
        style={{
          padding: '20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid var(--colorNeutralStroke2)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #60cdff 0%, #0093f5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(96, 205, 255, 0.3)',
          }}
        >
          <Sparkle24Filled style={{ color: 'white', fontSize: 20 }} />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--colorNeutralForeground1)',
                whiteSpace: 'nowrap',
                fontFamily: "'Segoe UI Variable', system-ui",
              }}
            >
              HoloScroll
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--colorNeutralForeground3)',
                whiteSpace: 'nowrap',
              }}
            >
              全息卷轴
            </div>
          </div>
        )}
      </div>

      {/* 导航菜单 */}
      <Nav
        selectedValue={currentPage}
        onSelectedValueChange={(_, data) => onNavigate(data.value as PageType)}
        style={{ flex: 1, padding: '8px' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.value;

          return collapsed ? (
            <Tooltip
              key={item.value}
              content={item.label}
              positioning="after"
              relationship="label"
            >
              <Button
                appearance={isActive ? 'primary' : 'subtle'}
                icon={<Icon />}
                onClick={() => onNavigate(item.value as PageType)}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: 4,
                }}
              />
            </Tooltip>
          ) : (
            <NavItem
              key={item.value}
              value={item.value}
              icon={<Icon />}
              style={{
                marginBottom: 4,
                borderRadius: '8px',
              }}
            >
              {item.label}
            </NavItem>
          );
        })}
      </Nav>

      <Divider style={{ margin: '8px 16px' }} />

      {/* 底部操作 */}
      <div style={{ padding: '8px 16px 16px' }}>
        <Tooltip
          content={collapsed ? '展开菜单' : '收起菜单'}
          positioning="after"
          relationship="label"
        >
          <Button
            appearance="subtle"
            icon={<Navigation24Regular />}
            onClick={onToggleCollapse}
            style={{ width: '100%' }}
          >
            {!collapsed && '收起菜单'}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
