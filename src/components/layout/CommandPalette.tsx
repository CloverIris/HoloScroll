import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Flash24Regular,
  Home24Regular,
  Settings24Regular,
  ChartPerson24Regular,
} from '@fluentui/react-icons';
import { Acrylic } from '../fluent/Acrylic';
import type { PageType } from './AppLayout';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    zIndex: 9998,
  },
  dialogSurface: {
    position: 'fixed',
    top: '15vh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '800px',
    maxWidth: '90vw',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    zIndex: 9999,
    borderRadius: '20px',
  },
  dialogBody: {
    padding: 0,
    margin: 0,
  },
  container: {
    background: `linear-gradient(180deg, 
      rgba(28, 28, 32, 0.98) 0%, 
      rgba(20, 20, 24, 0.99) 100%)`,
    borderRadius: '20px',
    overflow: 'hidden',
    maxHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(255, 255, 255, 0.03) inset,
                0 0 100px rgba(96, 205, 255, 0.05)`,
  },
  searchHeader: {
    padding: '24px 28px',
    borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  searchBox: {
    width: '100%',
    '& input': {
      fontSize: '18px',
      backgroundColor: 'transparent !important',
      '::placeholder': {
        color: tokens.colorNeutralForeground3,
      },
    },
  },
  shortcutHint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '16px',
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
  },
  kbd: {
    padding: '4px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: 'monospace',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  resultsContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '20px 0',
  },
  section: {
    marginBottom: '24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 28px',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sectionIcon: {
    fontSize: '18px',
  },
  sectionCount: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  listItem: {
    padding: '14px 28px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    borderLeft: '3px solid transparent',
    '&:hover': {
      backgroundColor: 'rgba(96, 205, 255, 0.05)',
      borderLeftColor: '#60cdff',
    },
  },
  listItemSelected: {
    backgroundColor: 'rgba(96, 205, 255, 0.08)',
    borderLeftColor: '#60cdff',
  },
  listItemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  itemIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
    fontSize: '15px',
    fontWeight: 500,
  },
  itemDescription: {
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '13px',
  },
  arrowIcon: {
    opacity: 0,
    transition: 'opacity 0.15s ease',
    color: '#60cdff',
  },
  arrowIconVisible: {
    opacity: 1,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 28px',
    color: tokens.colorNeutralForeground3,
    gap: '20px',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '32px',
    padding: '16px 28px',
    borderTop: `1px solid rgba(255, 255, 255, 0.06)`,
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  commandItem: {
    padding: '12px 28px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeft: '3px solid transparent',
    '&:hover': {
      backgroundColor: 'rgba(96, 205, 255, 0.05)',
      borderLeftColor: '#60cdff',
    },
  },
  commandLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  commandKey: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  categoryBadge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});

// 搜索结果类型
interface SearchResult {
  id: string;
  type: 'skill' | 'timeline' | 'achievement' | 'command' | 'nav';
  title: string;
  description: string;
  category?: string;
  timestamp?: string;
  color?: string;
  rarity?: string;
  action?: () => void;
  shortcut?: string;
  icon?: typeof BranchFork24Regular;
}

// 模拟数据 - 技能
const skillsData: SearchResult[] = [
  { id: 'skill-1', type: 'skill', title: '编程基础', description: '掌握基本编程概念和语法', category: '技术', color: '#60cdff' },
  { id: 'skill-2', type: 'skill', title: '数据结构', description: '理解数组、链表、树等数据结构', category: '技术', color: '#60cdff' },
  { id: 'skill-3', type: 'skill', title: '算法设计', description: '掌握排序、搜索等常用算法', category: '技术', color: '#60cdff' },
  { id: 'skill-4', type: 'skill', title: '创意思维', description: '培养创新能力和设计思维', category: '创意', color: '#ffaa44' },
];

// 模拟数据 - 时间轴事件
const timelineData: SearchResult[] = [
  { id: 'timeline-1', type: 'timeline', title: '开始学习编程', description: '今天开始了编程之旅，选择 Python 作为入门语言', timestamp: '2024-01-15', color: '#00d26a' },
  { id: 'timeline-2', type: 'timeline', title: '完成第一个项目', description: '成功完成了个人网站项目，使用 React 构建', timestamp: '2024-02-20', color: '#00d26a' },
];

// 快捷命令
const commandsData: SearchResult[] = [
  { id: 'cmd-1', type: 'command', title: '前往技能树', description: '打开技能树页面', shortcut: 'Ctrl + 1', icon: BranchFork24Regular, action: () => navigateTo('skills') },
  { id: 'cmd-2', type: 'command', title: '前往时间轴', description: '打开时间轴页面', shortcut: 'Ctrl + 2', icon: Clock24Regular, action: () => navigateTo('timeline') },
  { id: 'cmd-3', type: 'command', title: '前往成就', description: '打开成就页面', shortcut: 'Ctrl + 3', icon: Trophy24Regular, action: () => navigateTo('achievements') },
  { id: 'cmd-4', type: 'command', title: '前往分析', description: '打开分析页面', shortcut: 'Ctrl + 4', icon: ChartPerson24Regular, action: () => navigateTo('analysis') },
  { id: 'cmd-5', type: 'command', title: '添加新技能', description: '快速创建一个新技能', shortcut: 'Ctrl + N', icon: Flash24Regular },
  { id: 'cmd-6', type: 'command', title: '打开设置', description: '进入应用设置', shortcut: 'Ctrl + ,', icon: Settings24Regular, action: () => navigateTo('settings') },
];

let navigateTo: (page: PageType) => void = () => {};

interface CommandPaletteProps {
  onNavigate?: (page: PageType) => void;
}

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  navigateTo = useCallback((page: PageType) => {
    onNavigate?.(page);
    setIsOpen(false);
  }, [onNavigate]);

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 聚焦搜索框
  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // 搜索结果
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        commands: commandsData,
        skills: skillsData.slice(0, 3),
        timeline: timelineData.slice(0, 2),
      };
    }
    const query = searchQuery.toLowerCase();
    return {
      commands: commandsData.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      ),
      skills: skillsData.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      ),
      timeline: timelineData.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      ),
    };
  }, [searchQuery]);

  // 所有结果扁平化
  const allResults = useMemo(() => {
    return [
      ...filteredResults.commands.map(r => ({ ...r, type: 'command' as const })),
      ...filteredResults.skills.map(r => ({ ...r, type: 'skill' as const })),
      ...filteredResults.timeline.map(r => ({ ...r, type: 'timeline' as const })),
    ];
  }, [filteredResults]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allResults.length) % allResults.length);
      } else if (e.key === 'Enter' && allResults[selectedIndex]) {
        e.preventDefault();
        allResults[selectedIndex].action?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allResults, selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      
      {/* 对话框 */}
      <div className={styles.dialogSurface}>
        <div className={styles.container}>
          {/* 搜索头部 */}
          <div className={styles.searchHeader}>
            <SearchBox
              ref={searchRef}
              placeholder="搜索命令、技能、事件..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchBox}
              appearance="underline"
            />
            <div className={styles.shortcutHint}>
              <span>按</span>
              <kbd className={styles.kbd}>↑</kbd>
              <kbd className={styles.kbd}>↓</kbd>
              <span>选择，</span>
              <kbd className={styles.kbd}>Enter</kbd>
              <span>确认，</span>
              <kbd className={styles.kbd}>Esc</kbd>
              <span>关闭</span>
            </div>
          </div>

          {/* 搜索结果 */}
          <div className={styles.resultsContainer}>
            {/* 快捷命令 */}
            {filteredResults.commands.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Flash24Regular className={styles.sectionIcon} />
                  <span>快捷命令</span>
                  <span className={styles.sectionCount}>{filteredResults.commands.length}</span>
                </div>
                {filteredResults.commands.map((item, index) => (
                  <div
                    key={item.id}
                    className={`${styles.commandItem} ${selectedIndex === index ? styles.listItemSelected : ''}`}
                    onClick={() => item.action?.()}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={styles.commandLabel}>
                      <div className={styles.itemIcon}>
                        {item.icon && <item.icon style={{ color: '#60cdff' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: '2px' }}>{item.title}</div>
                        <div className={styles.itemDescription}>{item.description}</div>
                      </div>
                    </div>
                    <div className={styles.commandKey}>
                      {item.shortcut?.split(' + ').map((key, i) => (
                        <span key={i}>
                          <kbd className={styles.kbd}>{key}</kbd>
                          {i < item.shortcut!.split(' + ').length - 1 && <span style={{ margin: '0 2px' }}>+</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 技能 */}
            {filteredResults.skills.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <BranchFork24Regular className={styles.sectionIcon} />
                  <span>技能</span>
                  <span className={styles.sectionCount}>{filteredResults.skills.length}</span>
                </div>
                {filteredResults.skills.map((skill, index) => (
                  <div
                    key={skill.id}
                    className={`${styles.listItem} ${selectedIndex === index + filteredResults.commands.length ? styles.listItemSelected : ''}`}
                    onMouseEnter={() => setSelectedIndex(index + filteredResults.commands.length)}
                  >
                    <div className={styles.listItemContent}>
                      <div className={styles.itemIcon} style={{ backgroundColor: `${skill.color}15`, borderColor: `${skill.color}30` }}>
                        <BranchFork24Regular style={{ color: skill.color }} />
                      </div>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemTitle}>
                          <span>{skill.title}</span>
                          <span className={styles.categoryBadge} style={{ color: skill.color }}>{skill.category}</span>
                        </div>
                        <div className={styles.itemDescription}>{skill.description}</div>
                      </div>
                    </div>
                    <ArrowRight24Regular 
                      className={`${styles.arrowIcon} ${selectedIndex === index + filteredResults.commands.length ? styles.arrowIconVisible : ''}`} 
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 时间轴事件 */}
            {filteredResults.timeline.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Clock24Regular className={styles.sectionIcon} />
                  <span>时间轴</span>
                  <span className={styles.sectionCount}>{filteredResults.timeline.length}</span>
                </div>
                {filteredResults.timeline.map((event, index) => (
                  <div
                    key={event.id}
                    className={`${styles.listItem} ${selectedIndex === index + filteredResults.commands.length + filteredResults.skills.length ? styles.listItemSelected : ''}`}
                    onMouseEnter={() => setSelectedIndex(index + filteredResults.commands.length + filteredResults.skills.length)}
                  >
                    <div className={styles.listItemContent}>
                      <div className={styles.itemIcon} style={{ backgroundColor: `${event.color}15`, borderColor: `${event.color}30` }}>
                        <Clock24Regular style={{ color: event.color }} />
                      </div>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemTitle}>{event.title}</div>
                        <div className={styles.itemDescription}>{event.description}</div>
                      </div>
                    </div>
                    <ArrowRight24Regular 
                      className={`${styles.arrowIcon} ${selectedIndex === index + filteredResults.commands.length + filteredResults.skills.length ? styles.arrowIconVisible : ''}`} 
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 空状态 */}
            {allResults.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Search24Regular style={{ fontSize: 28, color: tokens.colorNeutralForeground3 }} />
                </div>
                <div>
                  <Text weight="semibold" size={400}>未找到结果</Text>
                  <div style={{ marginTop: '8px', color: tokens.colorNeutralForeground3 }}>
                    尝试其他关键词或查看快捷命令
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 底部提示 */}
          <div className={styles.footer}>
            <div className={styles.footerItem}>
              <kbd className={styles.kbd}>↑</kbd>
              <kbd className={styles.kbd}>↓</kbd>
              <span>导航</span>
            </div>
            <div className={styles.footerItem}>
              <kbd className={styles.kbd}>Enter</kbd>
              <span>选择</span>
            </div>
            <div className={styles.footerItem}>
              <kbd className={styles.kbd}>Esc</kbd>
              <span>关闭</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommandPalette;
