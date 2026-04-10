import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  SearchBox,
  List,
  ListItem,
  Text,
  Badge,
  Divider,
  Caption1,
  Subtitle1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  BranchFork24Regular,
  Clock24Regular,
  Trophy24Regular,
  Search24Regular,
  Dismiss24Regular,
  ArrowRight24Regular,
} from '@fluentui/react-icons';
import { Acrylic } from './Acrylic';

// 样式定义
const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '720px',
    width: '90vw',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  dialogBody: {
    padding: 0,
    margin: 0,
  },
  container: {
    borderRadius: '16px',
    overflow: 'hidden',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
  },
  // 搜索头部
  searchHeader: {
    padding: '20px 24px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  searchBox: {
    width: '100%',
    '& input': {
      fontSize: '18px',
    },
  },
  shortcutHint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '12px',
    color: tokens.colorNeutralForeground3,
  },
  kbd: {
    padding: '2px 8px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
  },
  // 结果区域
  resultsContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '16px 0',
  },
  section: {
    marginBottom: '16px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 24px',
    color: tokens.colorNeutralForeground3,
  },
  sectionIcon: {
    fontSize: '20px',
  },
  // 列表项样式
  listItem: {
    padding: '12px 24px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  listItemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  itemIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  itemDescription: {
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  arrowIcon: {
    opacity: 0,
    transition: 'opacity 0.15s ease',
    selectors: {
      [`[class*="listItem"]:hover &`]: {
        opacity: 1,
      },
    },
  },
  // 空状态
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
    color: tokens.colorNeutralForeground3,
    gap: '16px',
  },
  // 底部提示
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '12px 24px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
});

// 搜索结果类型
interface SearchResult {
  id: string;
  type: 'skill' | 'timeline' | 'achievement';
  title: string;
  description: string;
  category?: string;
  timestamp?: string;
  color?: string;
  rarity?: string;
}

// 模拟数据 - 技能
const skillsData: SearchResult[] = [
  {
    id: 'skill-1',
    type: 'skill',
    title: '编程基础',
    description: '掌握基本编程概念和语法',
    category: '技术',
    color: '#60cdff',
  },
  {
    id: 'skill-2',
    type: 'skill',
    title: '数据结构',
    description: '理解数组、链表、树等数据结构',
    category: '技术',
    color: '#60cdff',
  },
  {
    id: 'skill-3',
    type: 'skill',
    title: '算法设计',
    description: '掌握排序、搜索等常用算法',
    category: '技术',
    color: '#60cdff',
  },
  {
    id: 'skill-4',
    type: 'skill',
    title: '创意思维',
    description: '培养创新能力和设计思维',
    category: '创意',
    color: '#ffaa44',
  },
  {
    id: 'skill-5',
    type: 'skill',
    title: '设计基础',
    description: '理解色彩、排版和视觉设计',
    category: '创意',
    color: '#ffaa44',
  },
];

// 模拟数据 - 时间轴事件
const timelineData: SearchResult[] = [
  {
    id: 'timeline-1',
    type: 'timeline',
    title: '开始学习编程',
    description: '今天开始了编程之旅，选择 Python 作为入门语言',
    category: '里程碑',
    timestamp: '2024-04-10',
    color: '#60cdff',
  },
  {
    id: 'timeline-2',
    type: 'timeline',
    title: '完成第一个项目',
    description: '成功完成了个人网站项目，使用 React 构建',
    category: '成就',
    timestamp: '2024-04-08',
    color: '#ffaa44',
  },
  {
    id: 'timeline-3',
    type: 'timeline',
    title: '学习 TypeScript',
    description: '开始系统学习 TypeScript 类型系统',
    category: '学习',
    timestamp: '2024-04-05',
    color: '#00d26a',
  },
  {
    id: 'timeline-4',
    type: 'timeline',
    title: '学习心得',
    description: '学习了 React Hooks，useState 和 useEffect 很强大',
    category: '笔记',
    timestamp: '2024-04-03',
    color: '#cc99ff',
  },
];

// 模拟数据 - 成就
const achievementsData: SearchResult[] = [
  {
    id: 'achievement-1',
    type: 'achievement',
    title: '初次探索',
    description: '开始你的成长之旅，记录第一个技能',
    rarity: 'common',
    color: '#9ca3af',
  },
  {
    id: 'achievement-2',
    type: 'achievement',
    title: '技能入门',
    description: '解锁第一个技能节点',
    rarity: 'common',
    color: '#9ca3af',
  },
  {
    id: 'achievement-3',
    type: 'achievement',
    title: '持续学习',
    description: '连续7天记录学习进度',
    rarity: 'rare',
    color: '#60cdff',
  },
  {
    id: 'achievement-4',
    type: 'achievement',
    title: '技能大师',
    description: '将一个技能提升到满级',
    rarity: 'epic',
    color: '#cc99ff',
  },
];

// 类别颜色映射
const categoryColors: Record<string, string> = {
  '技术': 'brand',
  '创意': 'warning',
  '学术': 'success',
  '社交': 'informative',
  '身体': 'danger',
  '思维': 'important',
  '里程碑': 'brand',
  '成就': 'warning',
  '学习': 'success',
  '笔记': 'informative',
};

// 稀有度颜色映射
const rarityColors: Record<string, string> = {
  common: '#9ca3af',
  rare: '#60cdff',
  epic: '#cc99ff',
  legendary: '#ffaa44',
};

// 稀有度标签
const rarityLabels: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export function GlobalSearch() {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 监听键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K 或 Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // ESC 关闭
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 搜索过滤
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        skills: skillsData,
        timeline: timelineData,
        achievements: achievementsData,
      };
    }

    const query = searchQuery.toLowerCase();
    return {
      skills: skillsData.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      ),
      timeline: timelineData.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      ),
      achievements: achievementsData.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      ),
    };
  }, [searchQuery]);

  // 点击结果
  const handleResultClick = useCallback((result: SearchResult) => {
    console.log('Navigate to:', result);
    // 这里可以实现页面跳转逻辑
    // 例如: window.location.hash = result.type + '/' + result.id;
    setIsOpen(false);
  }, []);

  // 是否有结果
  const hasResults =
    filteredResults.skills.length > 0 ||
    filteredResults.timeline.length > 0 ||
    filteredResults.achievements.length > 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(_, data) => setIsOpen(data.open)}
      surfacePosition="center"
    >
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody className={styles.dialogBody}>
          <Acrylic intensity="heavy" dark className={styles.container}>
            {/* 搜索头部 */}
            <div className={styles.searchHeader}>
              <SearchBox
                className={styles.searchBox}
                placeholder="搜索技能、时间轴、成就..."
                value={searchQuery}
                onChange={(_, data) => setSearchQuery(data.value)}
                contentBefore={<Search24Regular />}
                autoFocus
                size="large"
              />
              <div className={styles.shortcutHint}>
                <span>按</span>
                <kbd className={styles.kbd}>ESC</kbd>
                <span>关闭</span>
              </div>
            </div>

            {/* 搜索结果 */}
            <div className={styles.resultsContainer}>
              {hasResults ? (
                <>
                  {/* 技能部分 */}
                  {filteredResults.skills.length > 0 && (
                    <div className={styles.section}>
                      <div className={styles.sectionHeader}>
                        <BranchFork24Regular className={styles.sectionIcon} />
                        <Caption1 weight="semibold">技能</Caption1>
                        <Badge size="small" appearance="filled">
                          {filteredResults.skills.length}
                        </Badge>
                      </div>
                      <List>
                        {filteredResults.skills.map((item) => (
                          <ListItem
                            key={item.id}
                            className={styles.listItem}
                            onClick={() => handleResultClick(item)}
                          >
                            <div className={styles.listItemContent}>
                              <div
                                className={styles.itemIcon}
                                style={{
                                  backgroundColor: `${item.color}20`,
                                  border: `1px solid ${item.color}40`,
                                }}
                              >
                                <BranchFork24Regular
                                  style={{ color: item.color }}
                                />
                              </div>
                              <div className={styles.itemInfo}>
                                <div className={styles.itemTitle}>
                                  <Subtitle1>{item.title}</Subtitle1>
                                  {item.category && (
                                    <Badge
                                      appearance={
                                        (categoryColors[item.category] as any) ||
                                        'brand'
                                      }
                                      size="small"
                                    >
                                      {item.category}
                                    </Badge>
                                  )}
                                </div>
                                <Caption1 className={styles.itemDescription}>
                                  {item.description}
                                </Caption1>
                              </div>
                              <ArrowRight24Regular
                                className={styles.arrowIcon}
                                style={{ color: tokens.colorNeutralForeground3 }}
                              />
                            </div>
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  )}

                  {/* 时间轴部分 */}
                  {filteredResults.timeline.length > 0 && (
                    <div className={styles.section}>
                      <div className={styles.sectionHeader}>
                        <Clock24Regular className={styles.sectionIcon} />
                        <Caption1 weight="semibold">时间轴</Caption1>
                        <Badge size="small" appearance="filled">
                          {filteredResults.timeline.length}
                        </Badge>
                      </div>
                      <List>
                        {filteredResults.timeline.map((item) => (
                          <ListItem
                            key={item.id}
                            className={styles.listItem}
                            onClick={() => handleResultClick(item)}
                          >
                            <div className={styles.listItemContent}>
                              <div
                                className={styles.itemIcon}
                                style={{
                                  backgroundColor: `${item.color}20`,
                                  border: `1px solid ${item.color}40`,
                                }}
                              >
                                <Clock24Regular style={{ color: item.color }} />
                              </div>
                              <div className={styles.itemInfo}>
                                <div className={styles.itemTitle}>
                                  <Subtitle1>{item.title}</Subtitle1>
                                  {item.category && (
                                    <Badge
                                      appearance={
                                        (categoryColors[item.category] as any) ||
                                        'brand'
                                      }
                                      size="small"
                                    >
                                      {item.category}
                                    </Badge>
                                  )}
                                </div>
                                <Caption1 className={styles.itemDescription}>
                                  {item.description}
                                </Caption1>
                              </div>
                              <ArrowRight24Regular
                                className={styles.arrowIcon}
                                style={{ color: tokens.colorNeutralForeground3 }}
                              />
                            </div>
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  )}

                  {/* 成就部分 */}
                  {filteredResults.achievements.length > 0 && (
                    <div className={styles.section}>
                      <div className={styles.sectionHeader}>
                        <Trophy24Regular className={styles.sectionIcon} />
                        <Caption1 weight="semibold">成就</Caption1>
                        <Badge size="small" appearance="filled">
                          {filteredResults.achievements.length}
                        </Badge>
                      </div>
                      <List>
                        {filteredResults.achievements.map((item) => (
                          <ListItem
                            key={item.id}
                            className={styles.listItem}
                            onClick={() => handleResultClick(item)}
                          >
                            <div className={styles.listItemContent}>
                              <div
                                className={styles.itemIcon}
                                style={{
                                  backgroundColor: `${item.color}20`,
                                  border: `1px solid ${item.color}40`,
                                }}
                              >
                                <Trophy24Regular style={{ color: item.color }} />
                              </div>
                              <div className={styles.itemInfo}>
                                <div className={styles.itemTitle}>
                                  <Subtitle1>{item.title}</Subtitle1>
                                  {item.rarity && (
                                    <Badge
                                      appearance="outline"
                                      style={{
                                        borderColor: rarityColors[item.rarity],
                                        color: rarityColors[item.rarity],
                                      }}
                                      size="small"
                                    >
                                      {rarityLabels[item.rarity]}
                                    </Badge>
                                  )}
                                </div>
                                <Caption1 className={styles.itemDescription}>
                                  {item.description}
                                </Caption1>
                              </div>
                              <ArrowRight24Regular
                                className={styles.arrowIcon}
                                style={{ color: tokens.colorNeutralForeground3 }}
                              />
                            </div>
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.emptyState}>
                  <Search24Regular style={{ fontSize: 48, opacity: 0.5 }} />
                  <Text>没有找到匹配的结果</Text>
                  <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                    尝试使用其他关键词搜索
                  </Text>
                </div>
              )}
            </div>

            {/* 底部提示 */}
            <div className={styles.footer}>
              <div className={styles.footerItem}>
                <ArrowRight24Regular style={{ fontSize: 16 }} />
                <span>选择</span>
              </div>
              <div className={styles.footerItem}>
                <Dismiss24Regular style={{ fontSize: 16 }} />
                <span>关闭</span>
              </div>
            </div>
          </Acrylic>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export default GlobalSearch;
