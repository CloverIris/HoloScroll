import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  Badge,
  Divider,
  Text,
  Title1,
  Title2,
  Title3,
  Input,
  Textarea,
  Caption1,
  Caption2,
  Body1,
  Body2,
  Subtitle1,
  Subtitle2,
  Tooltip,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Dropdown,
  Option,
  Tag,
  TagGroup,

  makeStyles,
  tokens,
  mergeClasses,
  ToggleButton,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  CompoundButton,
} from '@fluentui/react-components';
import {
  Add24Regular,
  Search24Regular,
  Clock24Regular,
  Trophy24Regular,
  BookOpen24Regular,
  Brain24Regular,
  Edit24Regular,
  Delete24Regular,
  ChevronDown24Regular,
  ChevronRight24Regular,
  Send24Regular,
  Image24Regular,
  Link24Regular,
  Tag24Regular,
  Filter24Regular,
  Calendar24Regular,
  Dismiss24Regular,
  Sparkle24Regular,
  Target24Regular,
  Note24Regular,
  Lightbulb24Regular,
} from '@fluentui/react-icons';
import { colors, spacing, radius, shadows, transitions } from '../styles/design-system';
import { useTimelineStore } from '../stores/timelineStore';

// ============================================
// 字体系统 (局部定义)
// ============================================
const typography = {
  fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
  sizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// ============================================
// 类型定义
// ============================================
type EventCategory = 'milestone' | 'achievement' | 'learning' | 'note' | 'practice';
type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';

interface TimelineEvent {
  id: string;
  title: string;
  content: string;
  category: EventCategory;
  date: string;
  tags: string[];
  attachments?: { type: 'image' | 'link'; url: string; name?: string }[];
}

interface GroupedEvents {
  [year: string]: {
    [month: string]: TimelineEvent[];
  };
}

// ============================================
// 样式定义
// ============================================
const useStyles = makeStyles({
  // 容器
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colors.bg.secondary,
    position: 'relative',
  },
  
  // 头部
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: `${spacing.xl} ${spacing['2xl']}`,
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: colors.bg.primary,
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  headerStats: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  // 筛选工具栏
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
    padding: `${spacing.md} ${spacing['2xl']}`,
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: colors.bg.tertiary,
    flexWrap: 'wrap',
  },
  searchBox: {
    width: '240px',
    minWidth: '200px',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  clearButton: {
    marginLeft: 'auto',
  },
  
  // 内容区域
  content: {
    flex: 1,
    overflow: 'auto',
    padding: `${spacing.xl} ${spacing['2xl']}`,
    paddingBottom: '160px', // 为底部快捷输入栏预留空间
  },
  timelineContainer: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  
  // 树形时间线
  yearGroup: {
    marginBottom: spacing.xl,
  },
  yearHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} 0`,
    cursor: 'pointer',
    transition: transitions.normal,
    '&:hover': {
      opacity: 0.8,
    },
  },
  yearIcon: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.accent.DEFAULT,
  },
  yearTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  
  monthGroup: {
    marginLeft: spacing.xl,
    marginTop: spacing.sm,
    borderLeft: `2px solid ${colors.border.default}`,
    paddingLeft: spacing.lg,
  },
  monthHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.xs} 0`,
    cursor: 'pointer',
    transition: transitions.normal,
    '&:hover': {
      opacity: 0.8,
    },
  },
  monthTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
  },
  
  // 事件列表
  eventsList: {
    marginLeft: spacing.lg,
    marginTop: spacing.md,
  },
  eventItem: {
    display: 'flex',
    gap: spacing.lg,
    marginBottom: spacing.lg,
    position: 'relative',
    animation: 'fadeIn 0.3s ease-out',
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  },
  eventConnector: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '60px',
  },
  eventDot: {
    width: '12px',
    height: '12px',
    borderRadius: radius.full,
    backgroundColor: colors.accent.DEFAULT,
    border: `2px solid ${colors.bg.secondary}`,
    boxShadow: `0 0 0 2px ${colors.accent.DEFAULT}`,
    zIndex: 1,
  },
  eventLine: {
    width: '2px',
    flex: 1,
    backgroundColor: colors.border.default,
    marginTop: spacing.sm,
  },
  eventDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    whiteSpace: 'nowrap',
  },
  
  // 事件卡片
  eventCard: {
    flex: 1,
    backgroundColor: colors.bg.elevated,
    border: `1px solid ${colors.border.subtle}`,
    borderRadius: radius.lg,
    padding: spacing.lg,
    transition: transitions.normal,
    position: 'relative',
    '&:hover': {
      borderColor: colors.border.strong,
      boxShadow: shadows.md,
    },
  },
  glassCard: {
    backgroundColor: 'rgba(36, 36, 36, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardActions: {
    display: 'flex',
    gap: spacing.xs,
    opacity: 0,
    transition: transitions.normal,
    '.eventCard:hover &': {
      opacity: 1,
    },
  },
  cardContent: {
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 1.6,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagsContainer: {
    display: 'flex',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  attachmentsPreview: {
    display: 'flex',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  attachmentItem: {
    width: '60px',
    height: '60px',
    borderRadius: radius.md,
    backgroundColor: colors.bg.tertiary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: transitions.normal,
    '&:hover': {
      backgroundColor: colors.border.default,
    },
  },
  
  // 快捷输入栏
  quickInputBar: {
    position: 'fixed',
    bottom: 0,
    left: '240px', // 侧边栏宽度
    right: 0,
    padding: `${spacing.lg} ${spacing['2xl']}`,
    backgroundColor: colors.bg.primary,
    borderTop: `1px solid ${colors.border.default}`,
    display: 'flex',
    gap: spacing.lg,
    alignItems: 'flex-end',
    zIndex: 100,
  },
  quickInputArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  quickInputActions: {
    display: 'flex',
    gap: spacing.sm,
    alignItems: 'center',
  },
  categoryButtons: {
    display: 'flex',
    gap: spacing.xs,
  },
  
  // 空状态
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    color: colors.text.tertiary,
    gap: spacing.xl,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    opacity: 0.5,
    color: colors.accent.DEFAULT,
  },
  
  // Dialog 样式
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  formRow: {
    display: 'flex',
    gap: spacing.lg,
  },
  tagInput: {
    display: 'flex',
    gap: spacing.sm,
    alignItems: 'center',
  },
  uploadArea: {
    border: `2px dashed ${colors.border.default}`,
    borderRadius: radius.lg,
    padding: spacing.xl,
    textAlign: 'center',
    cursor: 'pointer',
    transition: transitions.normal,
    '&:hover': {
      borderColor: colors.accent.DEFAULT,
      backgroundColor: 'rgba(96, 205, 255, 0.05)',
    },
  },
});

// ============================================
// 类别配置
// ============================================
const categoryConfig: Record<EventCategory, { label: string; icon: any; color: string }> = {
  milestone: {
    label: '里程碑',
    icon: Target24Regular,
    color: '#60cdff',
  },
  achievement: {
    label: '成就',
    icon: Trophy24Regular,
    color: '#ffaa44',
  },
  learning: {
    label: '学习',
    icon: BookOpen24Regular,
    color: '#00d26a',
  },
  note: {
    label: '笔记',
    icon: Note24Regular,
    color: '#cc99ff',
  },
  practice: {
    label: '练习',
    icon: Lightbulb24Regular,
    color: '#ff6b6b',
  },
};

// ============================================
// 示例数据
// ============================================
const sampleEvents: TimelineEvent[] = [
  {
    id: '1',
    title: '开始学习编程',
    content: '今天开始了编程之旅，选择 Python 作为入门语言。对编程世界充满好奇，准备从基础语法开始学习。',
    category: 'milestone',
    date: '2024-04-10',
    tags: ['编程', 'Python', '入门'],
  },
  {
    id: '2',
    title: '完成第一个项目',
    content: '成功完成了个人网站项目，使用 React 和 Tailwind CSS 构建。这个项目让我对前端开发有了更深入的理解。',
    category: 'achievement',
    date: '2024-04-08',
    tags: ['项目', 'React', '前端'],
    attachments: [{ type: 'image', url: '/project1.png', name: '项目截图' }],
  },
  {
    id: '3',
    title: '学习 TypeScript',
    content: '开始系统学习 TypeScript，掌握类型系统的核心概念。类型安全让代码更加健壮。',
    category: 'learning',
    date: '2024-04-05',
    tags: ['TypeScript', '学习'],
  },
  {
    id: '4',
    title: 'React Hooks 学习笔记',
    content: '今天学习了 React Hooks 的使用，useState 和 useEffect 真的很强大，让函数组件也能拥有状态。',
    category: 'note',
    date: '2024-04-03',
    tags: ['React', 'Hooks', '笔记'],
  },
  {
    id: '5',
    title: '算法练习 - 二叉树遍历',
    content: '完成了二叉树的前序、中序、后序遍历练习，递归思想需要多加练习。',
    category: 'practice',
    date: '2024-03-28',
    tags: ['算法', '数据结构'],
  },
  {
    id: '6',
    title: '年终总结',
    content: '回顾 2023 年的成长历程，收获满满。从编程小白到能独立完成项目，感谢坚持的自己。',
    category: 'milestone',
    date: '2023-12-31',
    tags: ['总结', '2023'],
  },
  {
    id: '7',
    title: '学习 React',
    content: '开始学习 React，组件化思想真的很棒。',
    category: 'learning',
    date: '2023-11-15',
    tags: ['React', '前端'],
  },
];

// ============================================
// 辅助函数
// ============================================
const groupEventsByDate = (events: TimelineEvent[]): GroupedEvents => {
  return events.reduce((acc, event) => {
    const [year, month] = event.date.split('-');
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(event);
    return acc;
  }, {} as GroupedEvents);
};

const getMonthName = (month: string): string => {
  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  return months[parseInt(month) - 1];
};

const isToday = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isThisWeek = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date >= weekAgo && date <= today;
};

const isThisMonth = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

const isThisYear = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  return date.getFullYear() === today.getFullYear();
};

// ============================================
// 主组件
// ============================================
export function TimelinePage() {
  const styles = useStyles();
  
  // Store
  const { events, loadEvents, addEvent, updateEvent, deleteEvent } = useTimelineStore();
  
  // 加载数据
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  
  // 状态
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set(['2024']));
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set(['2024-04']));
  const [quickInput, setQuickInput] = useState('');
  const [quickCategory, setQuickCategory] = useState<EventCategory>('note');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  
  // 表单状态
  const [formData, setFormData] = useState<Partial<TimelineEvent>>({
    title: '',
    content: '',
    category: 'milestone',
    date: new Date().toISOString().split('T')[0],
    tags: [],
  });
  const [newTag, setNewTag] = useState('');

  // 筛选逻辑
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 类别筛选
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      
      // 搜索筛选
      const matchesSearch =
        searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 时间筛选
      let matchesTime = true;
      if (timeFilter === 'today') matchesTime = isToday(event.date);
      else if (timeFilter === 'week') matchesTime = isThisWeek(event.date);
      else if (timeFilter === 'month') matchesTime = isThisMonth(event.date);
      else if (timeFilter === 'year') matchesTime = isThisYear(event.date);
      
      // 标签筛选
      const matchesTags = tagFilter.length === 0 || tagFilter.some(tag => event.tags.includes(tag));
      
      return matchesCategory && matchesSearch && matchesTime && matchesTags;
    });
  }, [events, categoryFilter, searchQuery, timeFilter, tagFilter]);

  // 分组数据
  const groupedEvents = useMemo(() => groupEventsByDate(filteredEvents), [filteredEvents]);
  
  // 获取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    events.forEach(e => e.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [events]);

  // 切换年/月展开状态
  const toggleYear = (year: string) => {
    setExpandedYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => {
      const next = new Set(prev);
      if (next.has(monthKey)) next.delete(monthKey);
      else next.add(monthKey);
      return next;
    });
  };

  // 清除筛选
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setTimeFilter('all');
    setTagFilter([]);
  };

  // 添加快捷事件
  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;
    
    addEvent({
      title: quickInput.slice(0, 30) + (quickInput.length > 30 ? '...' : ''),
      content: quickInput,
      category: quickCategory,
      date: new Date().toISOString().split('T')[0],
      tags: [],
    });
    
    setQuickInput('');
  };

  // 打开新建弹窗
  const handleNewEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      content: '',
      category: 'milestone',
      date: new Date().toISOString().split('T')[0],
      tags: [],
    });
    setIsDialogOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({ ...event });
    setIsDialogOpen(true);
  };

  // 保存事件
  const handleSave = () => {
    if (!formData.title || !formData.content) return;
    
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent({
        title: formData.title!,
        content: formData.content!,
        category: formData.category as EventCategory,
        date: formData.date!,
        tags: formData.tags || [],
      });
    }
    setIsDialogOpen(false);
  };

  // 删除事件
  const handleDelete = (id: string) => {
    deleteEvent(id);
  };

  // 添加标签到表单
  const addTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
      setNewTag('');
    }
  };

  // 移除标签
  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) || [] }));
  };

  // 渲染事件卡片
  const renderEventCard = (event: TimelineEvent) => {
    const config = categoryConfig[event.category];
    const Icon = config.icon;
    const day = event.date.split('-')[2];

    return (
      <div key={event.id} className={styles.eventItem}>
        <div className={styles.eventConnector}>
          <div 
            className={styles.eventDot} 
            style={{ backgroundColor: config.color, boxShadow: `0 0 0 2px ${config.color}` }}
          />
          <div className={styles.eventLine} />
          <Caption2 className={styles.eventDate}>{day}日</Caption2>
        </div>
        
        <Card className={mergeClasses(styles.eventCard, styles.glassCard)}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Icon style={{ color: config.color, fontSize: '20px' }} />
              <Subtitle1 style={{ fontWeight: 600 }}>{event.title}</Subtitle1>
              <Badge 
                appearance="filled" 
                style={{ 
                  backgroundColor: `${config.color}20`, 
                  color: config.color,
                  fontSize: '11px',
                }}
              >
                {config.label}
              </Badge>
            </div>
            <div className={styles.cardActions}>
              <Tooltip content="编辑" relationship="label">
                <Button
                  appearance="subtle"
                  icon={<Edit24Regular style={{ fontSize: '16px' }} />}
                  size="small"
                  onClick={() => handleEdit(event)}
                />
              </Tooltip>
              <Tooltip content="删除" relationship="label">
                <Button
                  appearance="subtle"
                  icon={<Delete24Regular style={{ fontSize: '16px', color: colors.rarity.physical }} />}
                  size="small"
                  onClick={() => handleDelete(event.id)}
                />
              </Tooltip>
            </div>
          </div>
          
          <Body2 className={styles.cardContent}>{event.content}</Body2>
          
          {event.attachments && event.attachments.length > 0 && (
            <div className={styles.attachmentsPreview}>
              {event.attachments.map((att, idx) => (
                <div key={idx} className={styles.attachmentItem}>
                  {att.type === 'image' ? <Image24Regular /> : <Link24Regular />}
                </div>
              ))}
            </div>
          )}
          
          <div className={styles.cardFooter}>
            <div className={styles.tagsContainer}>
              {event.tags.map(tag => (
                <Tag 
                  key={tag} 
                  size="small"
                  style={{ backgroundColor: colors.bg.tertiary }}
                >
                  #{tag}
                </Tag>
              ))}
            </div>
            <Caption2 style={{ color: colors.text.tertiary }}>
              {event.date}
            </Caption2>
          </div>
        </Card>
      </div>
    );
  };

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || timeFilter !== 'all' || tagFilter.length > 0;

  return (
    <div className={styles.container}>
      {/* 头部区域 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Title1>成长时间轴</Title1>
          <Caption1 style={{ color: colors.text.secondary }}>
            记录每一个值得铭记的瞬间
          </Caption1>
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <Sparkle24Regular style={{ color: colors.accent.DEFAULT }} />
              <Caption1>
                <strong>{events.length}</strong> 个事件
              </Caption1>
            </div>
            <div className={styles.statItem}>
              <Tag24Regular style={{ color: colors.skill.creative }} />
              <Caption1>
                <strong>{allTags.length}</strong> 个标签
              </Caption1>
            </div>
          </div>
        </div>
        <Button 
          appearance="primary" 
          icon={<Add24Regular />}
          onClick={handleNewEvent}
        >
          记录事件
        </Button>
      </div>

      {/* 筛选工具栏 */}
      <div className={styles.toolbar}>
        <Input
          className={styles.searchBox}
          placeholder="搜索事件..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          contentBefore={<Search24Regular />}
          size="medium"
        />
        
        <div className={styles.filterGroup}>
          <Caption2 style={{ color: colors.text.tertiary }}>类别</Caption2>
          <Dropdown
            size="small"
            value={categoryFilter === 'all' ? '全部' : categoryConfig[categoryFilter as EventCategory]?.label}
            selectedOptions={[categoryFilter]}
            onOptionSelect={(_, data) => setCategoryFilter((data.optionValue as EventCategory) || 'all')}
          >
            <Option value="all">全部</Option>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <Option key={key} value={key}>{config.label}</Option>
            ))}
          </Dropdown>
        </div>
        
        <div className={styles.filterGroup}>
          <Caption2 style={{ color: colors.text.tertiary }}>时间</Caption2>
          <Dropdown
            size="small"
            value={{
              all: '全部',
              today: '今天',
              week: '本周',
              month: '本月',
              year: '今年',
            }[timeFilter]}
            selectedOptions={[timeFilter]}
            onOptionSelect={(_, data) => setTimeFilter((data.optionValue as TimeFilter) || 'all')}
          >
            <Option value="all">全部</Option>
            <Option value="today">今天</Option>
            <Option value="week">本周</Option>
            <Option value="month">本月</Option>
            <Option value="year">今年</Option>
          </Dropdown>
        </div>
        
        {allTags.length > 0 && (
          <div className={styles.filterGroup}>
            <Caption2 style={{ color: colors.text.tertiary }}>标签</Caption2>
            <Dropdown
              size="small"
              multiselect
              value={tagFilter.length > 0 ? `已选 ${tagFilter.length} 个` : '选择标签'}
              selectedOptions={tagFilter}
              onOptionSelect={(_, data) => {
                setTagFilter(data.selectedOptions as string[]);
              }}
            >
              {allTags.map(tag => (
                <Option key={tag} value={tag}>#{tag}</Option>
              ))}
            </Dropdown>
          </div>
        )}
        
        {hasActiveFilters && (
          <Button
            className={styles.clearButton}
            appearance="subtle"
            icon={<Dismiss24Regular />}
            size="small"
            onClick={clearFilters}
          >
            清除筛选
          </Button>
        )}
      </div>

      {/* 时间轴内容 */}
      <div className={styles.content}>
        <div className={styles.timelineContainer}>
          {filteredEvents.length > 0 ? (
            Object.entries(groupedEvents)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([year, months]) => (
                <div key={year} className={styles.yearGroup}>
                  {/* 年份标题 */}
                  <div 
                    className={styles.yearHeader}
                    onClick={() => toggleYear(year)}
                  >
                    <div className={styles.yearIcon}>
                      {expandedYears.has(year) ? <ChevronDown24Regular /> : <ChevronRight24Regular />}
                    </div>
                    <span className={styles.yearTitle}>{year}年</span>
                    <Badge appearance="outline" size="small">
                      {Object.values(months).flat().length} 个事件
                    </Badge>
                  </div>
                  
                  {/* 月份分组 */}
                  {expandedYears.has(year) && (
                    <div className={styles.monthGroup}>
                      {Object.entries(months)
                        .sort(([a], [b]) => parseInt(b) - parseInt(a))
                        .map(([month, monthEvents]) => {
                          const monthKey = `${year}-${month}`;
                          return (
                            <div key={month}>
                              {/* 月份标题 */}
                              <div 
                                className={styles.monthHeader}
                                onClick={() => toggleMonth(monthKey)}
                              >
                                <div style={{ color: colors.text.tertiary }}>
                                  {expandedMonths.has(monthKey) ? <ChevronDown24Regular /> : <ChevronRight24Regular />}
                                </div>
                                <span className={styles.monthTitle}>{getMonthName(month)}</span>
                                <Caption2 style={{ color: colors.text.tertiary }}>
                                  {monthEvents.length} 个事件
                                </Caption2>
                              </div>
                              
                              {/* 事件列表 */}
                              {expandedMonths.has(monthKey) && (
                                <div className={styles.eventsList}>
                                  {monthEvents.map(renderEventCard)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Clock24Regular style={{ fontSize: '64px' }} />
              </div>
              <div>
                <Subtitle1 style={{ display: 'block', marginBottom: spacing.sm }}>
                  {hasActiveFilters ? '没有找到匹配的事件' : '还没有记录任何事件'}
                </Subtitle1>
                <Body2 style={{ color: colors.text.tertiary }}>
                  {hasActiveFilters 
                    ? '尝试调整筛选条件' 
                    : '开始记录你的第一个成长瞬间吧'}
                </Body2>
              </div>
              {!hasActiveFilters && (
                <Button 
                  appearance="primary" 
                  icon={<Add24Regular />}
                  onClick={handleNewEvent}
                >
                  记录你的第一个成长瞬间
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 快捷输入栏 */}
      <div className={styles.quickInputBar}>
        <div className={styles.quickInputArea}>
          <Textarea
            placeholder="快速记录你的想法..."
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            rows={2}
            resize="vertical"
          />
          <div className={styles.quickInputActions}>
            <div className={styles.categoryButtons}>
              {(Object.keys(categoryConfig) as EventCategory[]).map((cat) => {
                const config = categoryConfig[cat];
                const Icon = config.icon;
                return (
                  <ToggleButton
                    key={cat}
                    size="small"
                    checked={quickCategory === cat}
                    onClick={() => setQuickCategory(cat)}
                    icon={<Icon style={{ color: config.color, fontSize: '16px' }} />}
                  >
                    {config.label}
                  </ToggleButton>
                );
              })}
            </div>
            <Button
              appearance="subtle"
              icon={<Image24Regular />}
              size="small"
            />
            <Button
              appearance="subtle"
              icon={<Link24Regular />}
              size="small"
            />
          </div>
        </div>
        <Button
          appearance="primary"
          icon={<Send24Regular />}
          disabled={!quickInput.trim()}
          onClick={handleQuickAdd}
        >
          发送
        </Button>
      </div>

      {/* 新建/编辑事件弹窗 */}
      <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{editingEvent ? '编辑事件' : '新建事件'}</DialogTitle>
            <DialogContent>
              <div className={styles.dialogContent}>
                <div className={styles.formGroup}>
                  <Caption2>标题</Caption2>
                  <Input
                    placeholder="输入事件标题..."
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <Caption2>类别</Caption2>
                    <Dropdown
                      value={categoryConfig[formData.category as EventCategory]?.label}
                      selectedOptions={[formData.category || 'milestone']}
                      onOptionSelect={(_, data) => 
                        setFormData(prev => ({ ...prev, category: data.optionValue as EventCategory }))
                      }
                    >
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <Option key={key} value={key}>{config.label}</Option>
                      ))}
                    </Dropdown>
                  </div>
                  
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <Caption2>日期</Caption2>
                    <Input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <Caption2>内容</Caption2>
                  <Textarea
                    placeholder="描述这个事件..."
                    value={formData.content || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={5}
                    resize="vertical"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <Caption2>标签</Caption2>
                  <div className={styles.tagInput}>
                    <Input
                      placeholder="添加标签..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag}>添加</Button>
                  </div>
                  <div className={styles.tagsContainer} style={{ marginTop: spacing.sm }}>
                    {formData.tags?.map(tag => (
                      <Tag
                        key={tag}
                        dismissible
                        onDismiss={() => removeTag(tag)}
                        size="small"
                      >
                        #{tag}
                      </Tag>
                    ))}
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <Caption2>附件</Caption2>
                  <div className={styles.uploadArea}>
                    <Image24Regular style={{ fontSize: '32px', color: colors.text.tertiary }} />
                    <Body2 style={{ color: colors.text.tertiary, marginTop: spacing.sm }}>
                      拖拽图片到此处，或点击上传
                    </Body2>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button 
                appearance="primary" 
                onClick={handleSave}
                disabled={!formData.title || !formData.content}
              >
                保存
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}

export default TimelinePage;
