import { useState, useMemo } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardPreview,
  Badge,
  ProgressBar,
  Text,
  Title1,
  TabList,
  Tab,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Tooltip,
  Caption1,
  Subtitle1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Share24Regular,
  Copy24Regular,
  Image24Regular,
  Link24Regular,
  CheckmarkCircle24Filled,
  LockClosed24Regular,
  Star24Filled,
  Trophy24Filled,
  Diamond24Filled,
  Crown24Filled,
  ArrowTrending24Regular,
  Target24Regular,
  Lightbulb24Regular,
} from '@fluentui/react-icons';
import { rarityColors } from '../styles/fluent-theme';

// ============================================
// 样式定义
// ============================================
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px 32px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    padding: '24px 32px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  statCard: {
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8,
    },
  },
  statCardContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
  },
  filterSection: {
    padding: '16px 32px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  tabList: {
    display: 'flex',
    gap: '8px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px 32px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  achievementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  achievementCard: {
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: tokens.shadow16,
    },
  },
  achievementCardLocked: {
    opacity: 0.7,
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
      pointerEvents: 'none',
    },
  },
  achievementIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '12px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  dialogIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  unlockConditions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '8px',
  },
  conditionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  relatedSkills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    color: tokens.colorNeutralForeground3,
    gap: '16px',
  },
});

// ============================================
// 类型定义
// ============================================
type RarityType = 'common' | 'rare' | 'epic' | 'legendary';
type FilterType = 'all' | 'recent' | 'locked' | 'rarity' | 'category';
type CategoryType = 'exploration' | 'skill' | 'persistence' | 'mastery';

interface Achievement {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  rarity: RarityType;
  category: CategoryType;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  unlockConditions: string[];
  relatedSkills: string[];
}

// ============================================
// 稀有度配置
// ============================================
const rarityConfig: Record<RarityType, { label: string; color: string; bg: string; icon: typeof Trophy24Filled }> = {
  common: { label: '普通', color: rarityColors.common, bg: 'rgba(156, 163, 175, 0.15)', icon: Star24Filled },
  rare: { label: '稀有', color: rarityColors.rare, bg: 'rgba(96, 205, 255, 0.15)', icon: Trophy24Filled },
  epic: { label: '史诗', color: rarityColors.epic, bg: 'rgba(204, 153, 255, 0.15)', icon: Diamond24Filled },
  legendary: { label: '传说', color: rarityColors.legendary, bg: 'rgba(255, 170, 68, 0.15)', icon: Crown24Filled },
};

// ============================================
// 类别配置
// ============================================
const categoryConfig: Record<CategoryType, { label: string; color: string }> = {
  exploration: { label: '探索', color: '#60cdff' },
  skill: { label: '技能', color: '#00d26a' },
  persistence: { label: '坚持', color: '#cc99ff' },
  mastery: { label: '精通', color: '#ffaa44' },
};

// ============================================
// 示例成就数据
// ============================================
const sampleAchievements: Achievement[] = [
  {
    id: '1',
    title: '初次探索',
    description: '开始你的成长之旅',
    fullDescription: '勇敢地迈出了第一步，开启了属于你的成长探索之旅。每一次开始都是一个新的可能。',
    rarity: 'common',
    category: 'exploration',
    icon: 'explore',
    unlockedAt: '2024-04-01',
    progress: 1,
    maxProgress: 1,
    unlockConditions: ['创建账号并登录'],
    relatedSkills: ['基础认知'],
  },
  {
    id: '2',
    title: '技能入门',
    description: '解锁第一个技能节点',
    fullDescription: '成功解锁了你的第一个技能节点，这是成为大师的必经之路。',
    rarity: 'common',
    category: 'skill',
    icon: 'skill',
    unlockedAt: '2024-04-05',
    progress: 1,
    maxProgress: 1,
    unlockConditions: ['在技能树中解锁任意技能'],
    relatedSkills: ['基础认知', '学习方法'],
  },
  {
    id: '3',
    title: '持续学习',
    description: '连续7天记录成长',
    fullDescription: '坚持了一周的连续记录，良好的习惯正在养成。',
    rarity: 'rare',
    category: 'persistence',
    icon: 'persist',
    unlockedAt: '2024-04-12',
    progress: 1,
    maxProgress: 1,
    unlockConditions: ['连续7天添加时间轴事件'],
    relatedSkills: ['时间管理', '自律'],
  },
  {
    id: '4',
    title: '技能大师',
    description: '将一个技能提升至满级',
    fullDescription: '通过不懈努力，你将一项技能修炼到了极致。',
    rarity: 'epic',
    category: 'mastery',
    icon: 'mastery',
    unlockedAt: '2024-04-15',
    progress: 1,
    maxProgress: 1,
    unlockConditions: ['任意技能达到5级'],
    relatedSkills: ['专业技能', '深度学习'],
  },
  {
    id: '5',
    title: '知识收藏家',
    description: '解锁10个技能节点',
    fullDescription: '你的知识版图正在快速扩张，已解锁10个技能节点。',
    rarity: 'rare',
    category: 'skill',
    icon: 'collect',
    unlockedAt: '2024-04-18',
    progress: 1,
    maxProgress: 1,
    unlockConditions: ['累计解锁10个技能'],
    relatedSkills: ['知识管理', '学习规划'],
  },
  {
    id: '6',
    title: '坚持不懈',
    description: '连续30天记录成长',
    fullDescription: '一个月的持续记录，你已经养成了优秀的成长习惯。',
    rarity: 'epic',
    category: 'persistence',
    icon: 'persist2',
    unlockedAt: '2024-04-25',
    progress: 1,
    maxProgress: 1,
    unlockConditions: ['连续30天添加时间轴事件'],
    relatedSkills: ['时间管理', '自律', '习惯养成'],
  },
  {
    id: '7',
    title: '全能大师',
    description: '将所有类别的技能都提升到3级以上',
    fullDescription: '你是一个全面发展的学习者，在各个领域都有不错的造诣。',
    rarity: 'legendary',
    category: 'mastery',
    icon: 'master',
    unlockedAt: '2024-05-01',
    progress: 1,
    maxProgress: 1,
    unlockConditions: ['6个类别技能均达到3级'],
    relatedSkills: ['跨领域学习', '知识整合'],
  },
  {
    id: '8',
    title: '社交达人',
    description: '分享你的成就给他人',
    fullDescription: '成长的路上不孤单，你已经学会了与他人分享进步。',
    rarity: 'common',
    category: 'exploration',
    icon: 'social',
    unlockedAt: '2024-05-05',
    progress: 1,
    maxProgress: 1,
    unlockConditions: ['使用分享功能'],
    relatedSkills: ['社交技能', '沟通表达'],
  },
  {
    id: '9',
    title: '百日记录者',
    description: '累计记录100条时间轴事件',
    fullDescription: '百日积累，见证成长。你已经记录了100个珍贵的瞬间。',
    rarity: 'epic',
    category: 'persistence',
    icon: 'record',
    progress: 75,
    maxProgress: 100,
    unlockConditions: ['累计添加100条时间轴事件'],
    relatedSkills: ['记录习惯', '反思总结'],
  },
  {
    id: '10',
    title: '传奇成就',
    description: '解锁所有其他成就',
    fullDescription: '你是真正的传奇，已经解锁了所有成就！',
    rarity: 'legendary',
    category: 'mastery',
    icon: 'legend',
    progress: 8,
    maxProgress: 12,
    unlockConditions: ['解锁除本成就外的所有成就'],
    relatedSkills: ['全面精通'],
  },
  {
    id: '11',
    title: '早期探索者',
    description: '在项目早期就加入探索',
    fullDescription: '感谢你的早期支持，你是 HoloScroll 的先锋用户。',
    rarity: 'rare',
    category: 'exploration',
    icon: 'early',
    unlockedAt: '2024-03-20',
    progress: 1,
    maxProgress: 1,
    unlockConditions: ['在2024年4月前注册'],
    relatedSkills: ['探索精神'],
  },
  {
    id: '12',
    title: '数据分析师',
    description: '查看成长分析报告',
    fullDescription: '你关注数据，善于通过分析来优化自己的成长路径。',
    rarity: 'common',
    category: 'skill',
    icon: 'analysis',
    unlockedAt: '2024-04-08',
    progress: 1,
    maxProgress: 1,
    unlockConditions: ['访问分析页面'],
    relatedSkills: ['数据分析', '自我认知'],
  },
];

// ============================================
// 统计卡片组件
// ============================================
interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: string;
  bgColor: string;
}

function StatCard({ icon, value, label, color, bgColor }: StatCardProps) {
  const styles = useStyles();
  return (
    <Card className={styles.statCard}>
      <CardPreview>
        <div className={styles.statCardContent}>
          <div className={styles.statIcon} style={{ backgroundColor: bgColor }}>
            {icon}
          </div>
          <div className={styles.statInfo}>
            <Text className={styles.statValue} style={{ color }}>
              {value}
            </Text>
            <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>{label}</Caption1>
          </div>
        </div>
      </CardPreview>
    </Card>
  );
}

// ============================================
// 成就详情弹窗组件
// ============================================
interface AchievementDetailDialogProps {
  achievement: Achievement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AchievementDetailDialog({ achievement, open, onOpenChange }: AchievementDetailDialogProps) {
  const styles = useStyles();

  if (!achievement) return null;

  const rarity = rarityConfig[achievement.rarity];
  const isUnlocked = achievement.progress >= achievement.maxProgress;
  const Icon = rarity.icon;

  return (
    <Dialog open={open} onOpenChange={(e, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>成就详情</DialogTitle>
          <DialogContent>
            <div className={styles.dialogContent}>
              {/* 头部信息 */}
              <div className={styles.dialogHeader}>
                <div
                  className={styles.dialogIcon}
                  style={{
                    backgroundColor: rarity.bg,
                    border: `2px solid ${rarity.color}40`,
                  }}
                >
                  <Icon style={{ fontSize: 40, color: rarity.color }} />
                </div>
                <div className={styles.dialogInfo}>
                  <Subtitle1>{achievement.title}</Subtitle1>
                  <Badge
                    appearance="filled"
                    style={{
                      backgroundColor: rarity.bg,
                      color: rarity.color,
                    }}
                  >
                    {rarity.label}
                  </Badge>
                  <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                    {achievement.category && categoryConfig[achievement.category]?.label}
                  </Caption1>
                </div>
              </div>

              {/* 描述 */}
              <div>
                <Caption1 style={{ color: tokens.colorNeutralForeground3, display: 'block', marginBottom: '8px' }}>
                  成就描述
                </Caption1>
                <Text>{achievement.fullDescription}</Text>
              </div>

              {/* 进度 */}
              <div>
                <Caption1 style={{ color: tokens.colorNeutralForeground3, display: 'block', marginBottom: '8px' }}>
                  进度
                </Caption1>
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <Text size={200}>
                      {achievement.progress} / {achievement.maxProgress}
                    </Text>
                    <Text size={200} style={{ color: rarity.color }}>
                      {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                    </Text>
                  </div>
                  <ProgressBar
                    value={(achievement.progress / achievement.maxProgress) * 100}
                    thickness="large"
                    style={{ '--progressBarColor': rarity.color } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* 解锁条件 */}
              <div>
                <Caption1 style={{ color: tokens.colorNeutralForeground3, display: 'block', marginBottom: '12px' }}>
                  解锁条件
                </Caption1>
                <div className={styles.unlockConditions}>
                  {achievement.unlockConditions.map((condition, index) => (
                    <div key={index} className={styles.conditionItem}>
                      <CheckmarkCircle24Filled
                        style={{
                          color: isUnlocked ? tokens.colorPaletteGreenForeground1 : tokens.colorNeutralForeground3,
                          fontSize: 20,
                        }}
                      />
                      <Text size={200}>{condition}</Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* 解锁时间 */}
              {achievement.unlockedAt && (
                <div>
                  <Caption1 style={{ color: tokens.colorNeutralForeground3, display: 'block', marginBottom: '8px' }}>
                    解锁时间
                  </Caption1>
                  <Text size={200}>{achievement.unlockedAt}</Text>
                </div>
              )}

              {/* 相关技能 */}
              {achievement.relatedSkills.length > 0 && (
                <div>
                  <Caption1 style={{ color: tokens.colorNeutralForeground3, display: 'block', marginBottom: '12px' }}>
                    相关技能
                  </Caption1>
                  <div className={styles.relatedSkills}>
                    {achievement.relatedSkills.map((skill, index) => (
                      <Badge key={index} appearance="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">关闭</Button>
            </DialogTrigger>
            {!isUnlocked && (
              <Button appearance="primary" disabled>
                继续努力
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// ============================================
// 成就卡片组件
// ============================================
interface AchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
}

function AchievementCard({ achievement, onClick }: AchievementCardProps) {
  const styles = useStyles();
  const rarity = rarityConfig[achievement.rarity];
  const isUnlocked = achievement.progress >= achievement.maxProgress;
  const Icon = rarity.icon;

  return (
    <Card
      className={`${styles.achievementCard} ${!isUnlocked ? styles.achievementCardLocked : ''}`}
      onClick={onClick}
    >
      <CardHeader
        image={
          <div
            className={styles.achievementIcon}
            style={{
              backgroundColor: rarity.bg,
              border: `2px solid ${rarity.color}40`,
            }}
          >
            {isUnlocked ? (
              <Icon style={{ fontSize: 32, color: rarity.color }} />
            ) : (
              <LockClosed24Regular style={{ fontSize: 28, color: tokens.colorNeutralForeground3 }} />
            )}
          </div>
        }
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text weight="semibold">{achievement.title}</Text>
          </div>
        }
        description={
          <Badge
            appearance="outline"
            style={{
              color: rarity.color,
              borderColor: rarity.color,
            }}
          >
            {rarity.label}
          </Badge>
        }
      />
      <div style={{ padding: '0 16px 16px' }}>
        <Text size={200} style={{ color: tokens.colorNeutralForeground2, display: 'block', marginBottom: '12px' }}>
          {achievement.description}
        </Text>

        {/* 进度条 */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {isUnlocked ? '已解锁' : '进行中'}
            </Text>
            <Text size={200} style={{ color: isUnlocked ? rarity.color : tokens.colorNeutralForeground3 }}>
              {achievement.progress} / {achievement.maxProgress}
            </Text>
          </div>
          <ProgressBar
            value={(achievement.progress / achievement.maxProgress) * 100}
            thickness="medium"
            style={{ '--progressBarColor': isUnlocked ? rarity.color : tokens.colorNeutralForeground3 } as React.CSSProperties}
          />
        </div>

        {/* 解锁日期 */}
        {achievement.unlockedAt && (
          <Caption1 style={{ color: tokens.colorNeutralForeground3, marginTop: '12px', display: 'block' }}>
            解锁于 {achievement.unlockedAt}
          </Caption1>
        )}
      </div>
    </Card>
  );
}

// ============================================
// 主页面组件
// ============================================
export function AchievementPage() {
  const styles = useStyles();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // 统计数据
  const stats = useMemo(() => {
    const unlocked = sampleAchievements.filter((a) => a.progress >= a.maxProgress);
    return {
      total: unlocked.length,
      rare: unlocked.filter((a) => a.rarity === 'rare').length,
      epic: unlocked.filter((a) => a.rarity === 'epic').length,
      legendary: unlocked.filter((a) => a.rarity === 'legendary').length,
    };
  }, []);

  // 筛选成就
  const filteredAchievements = useMemo(() => {
    switch (activeFilter) {
      case 'recent':
        return sampleAchievements
          .filter((a) => a.unlockedAt)
          .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime());
      case 'locked':
        return sampleAchievements.filter((a) => a.progress < a.maxProgress);
      case 'rarity':
        return [...sampleAchievements].sort(
          (a, b) =>
            ['legendary', 'epic', 'rare', 'common'].indexOf(a.rarity) -
            ['legendary', 'epic', 'rare', 'common'].indexOf(b.rarity)
        );
      case 'category':
        return [...sampleAchievements].sort((a, b) => a.category.localeCompare(b.category));
      default:
        return sampleAchievements;
    }
  }, [activeFilter]);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setDetailOpen(true);
  };

  const handleShare = (type: string) => {
    console.log(`分享成就: ${type}`);
    // 实际实现分享逻辑
  };

  return (
    <div className={styles.root}>
      {/* 头部 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Title1>成就殿堂</Title1>
          <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>每一步都值得被铭记</Caption1>
        </div>

        {/* 分享菜单 */}
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="secondary" icon={<Share24Regular />}>
              分享
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem icon={<Image24Regular />} onClick={() => handleShare('image')}>
                生成分享图
              </MenuItem>
              <MenuItem icon={<Link24Regular />} onClick={() => handleShare('link')}>
                复制链接
              </MenuItem>
              <MenuItem icon={<Copy24Regular />} onClick={() => handleShare('copy')}>
                复制文本
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>

      {/* 统计概览 */}
      <div className={styles.statsSection}>
        <StatCard
          icon={<Trophy24Filled style={{ fontSize: 24, color: rarityColors.common }} />}
          value={stats.total}
          label="已获得"
          color={rarityColors.common}
          bgColor={rarityConfig.common.bg}
        />
        <StatCard
          icon={<Star24Filled style={{ fontSize: 24, color: rarityColors.rare }} />}
          value={stats.rare}
          label="稀有"
          color={rarityColors.rare}
          bgColor={rarityConfig.rare.bg}
        />
        <StatCard
          icon={<Diamond24Filled style={{ fontSize: 24, color: rarityColors.epic }} />}
          value={stats.epic}
          label="史诗"
          color={rarityColors.epic}
          bgColor={rarityConfig.epic.bg}
        />
        <StatCard
          icon={<Crown24Filled style={{ fontSize: 24, color: rarityColors.legendary }} />}
          value={stats.legendary}
          label="传说"
          color={rarityColors.legendary}
          bgColor={rarityConfig.legendary.bg}
        />
      </div>

      {/* 筛选标签 */}
      <div className={styles.filterSection}>
        <TabList
          className={styles.tabList}
          selectedValue={activeFilter}
          onTabSelect={(_, data) => setActiveFilter(data.value as FilterType)}
        >
          <Tab value="all">全部</Tab>
          <Tab value="recent">最近解锁</Tab>
          <Tab value="locked">未解锁</Tab>
          <Tab value="rarity">按稀有度</Tab>
          <Tab value="category">按类别</Tab>
        </TabList>
      </div>

      {/* 成就网格 */}
      <div className={styles.content}>
        {filteredAchievements.length > 0 ? (
          <div className={styles.achievementGrid}>
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onClick={() => handleAchievementClick(achievement)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Target24Regular style={{ fontSize: '48px', opacity: 0.5 }} />
            <Text>没有找到符合条件的成就</Text>
            <Button
              appearance="subtle"
              onClick={() => setActiveFilter('all')}
            >
              清除筛选
            </Button>
          </div>
        )}
      </div>

      {/* 成就详情弹窗 */}
      <AchievementDetailDialog
        achievement={selectedAchievement}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

export default AchievementPage;
