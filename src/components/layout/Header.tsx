import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  SearchBox,
  Badge,
  Avatar,
  makeStyles,
  tokens,
  Tooltip,
} from '@fluentui/react-components';
import {
  Search24Regular,
  Alert24Regular,
  Settings24Regular,
  MoreHorizontal24Regular,
  BranchFork24Regular,
  Clock24Regular,
  Trophy24Regular,
  ChartPerson24Regular,
} from '@fluentui/react-icons';
import type { PageType } from './AppLayout';

const useStyles = makeStyles({
  header: {
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  searchButton: {
    minWidth: '200px',
    justifyContent: 'flex-start',
  },
  shortcutHint: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginLeft: '8px',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
  },
  kbd: {
    padding: '2px 6px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '11px',
  },
  iconButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
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
    // 触发命令面板打开 - 通过键盘事件
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <header className={styles.header}>
      {/* 左侧：面包屑和页面标题 */}
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

      {/* 右侧：搜索、快捷操作、通知、用户 */}
      <div className={styles.rightSection}>
        {/* 搜索按钮 */}
        <Button
          appearance="subtle"
          icon={<Search24Regular />}
          onClick={handleSearchClick}
          className={styles.searchButton}
        >
          <span>搜索...</span>
          <span className={styles.shortcutHint}>
            <kbd className={styles.kbd}>Ctrl</kbd>
            <span>+</span>
            <kbd className={styles.kbd}>K</kbd>
          </span>
        </Button>

        {/* 快捷操作 */}
        <Tooltip content="更多操作" relationship="label">
          <Button appearance="subtle" icon={<MoreHorizontal24Regular />} />
        </Tooltip>

        {/* 通知 */}
        <Tooltip content="通知" relationship="label">
          <Button
            appearance="subtle"
            icon={<Alert24Regular />}
            className={styles.iconButton}
          >
            <Badge
              size="small"
              appearance="filled"
              color="danger"
              className={styles.notificationBadge}
            />
          </Button>
        </Tooltip>

        {/* 用户头像 */}
        <Tooltip content="用户设置" relationship="label">
          <Avatar
            name="User"
            size={32}
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
      </div>
    </header>
  );
}

export default Header;
