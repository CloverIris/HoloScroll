import React, { useEffect, useRef, useCallback, useState, useMemo, useImperativeHandle } from 'react';
import * as d3 from 'd3';
import {
  Button,
  Card,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Badge,
  ProgressBar,
  Text,
  Title1,
  Title2,
  Subtitle1,
  Caption1,
  Dropdown,
  Option,
  Tooltip,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  makeStyles,
  tokens,
  mergeClasses,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  Add20Filled,
  Filter20Regular,
  ZoomIn20Regular,
  ZoomOut20Regular,
  FullScreenMaximize20Regular,
  FullScreenMinimize20Regular,
  Dismiss20Regular,
  ChevronUp20Filled,
  Edit20Regular,
  Delete20Regular,
  Target20Regular,
} from '@fluentui/react-icons';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { colors, spacing, shadows, transitions } from '../styles/design-system';

import '../styles/acrylic.css';

// ============================================
// 类型定义
// ============================================

interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  level: number;
  maxLevel: number;
  prerequisites: string[];
  unlockedAt: string | null;
}

type SkillCategory = 'technical' | 'creative' | 'academic' | 'social' | 'physical' | 'mindset' | 'all';

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  category: SkillCategory;
  skill: Skill;
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum;
  target: string | NodeDatum;
}

// ============================================
// 常量定义
// ============================================

const CATEGORY_CONFIG: Record<SkillCategory, { label: string; color: string; appearance: 'brand' | 'success' | 'warning' | 'danger' | 'important' | 'informative' }> = {
  all: { label: '全部', color: '#ffffff', appearance: 'brand' },
  technical: { label: '技术', color: colors.skill.technical, appearance: 'brand' },
  creative: { label: '创意', color: colors.skill.creative, appearance: 'warning' },
  academic: { label: '学术', color: colors.skill.academic, appearance: 'success' },
  social: { label: '社交', color: colors.skill.social, appearance: 'informative' },
  physical: { label: '身体', color: colors.skill.physical, appearance: 'danger' },
  mindset: { label: '思维', color: colors.skill.mindset, appearance: 'important' },
};

const SAMPLE_SKILLS: Skill[] = [
  { id: '1', name: '编程基础', description: '掌握基本编程概念，包括变量、循环、条件语句等核心知识', category: 'technical', level: 3, maxLevel: 5, prerequisites: [], unlockedAt: '2024-01-15' },
  { id: '2', name: '数据结构', description: '理解数组、链表、树等基础数据结构及其应用场景', category: 'technical', level: 2, maxLevel: 5, prerequisites: ['1'], unlockedAt: '2024-02-01' },
  { id: '3', name: '算法设计', description: '掌握常用算法，能够分析和优化代码性能', category: 'technical', level: 1, maxLevel: 5, prerequisites: ['2'], unlockedAt: null },
  { id: '4', name: '创意思维', description: '培养创新能力，学会跳出常规思维模式', category: 'creative', level: 4, maxLevel: 5, prerequisites: [], unlockedAt: '2024-01-20' },
  { id: '5', name: '设计基础', description: '理解色彩理论、排版原则和视觉层次', category: 'creative', level: 2, maxLevel: 5, prerequisites: ['4'], unlockedAt: '2024-03-01' },
  { id: '6', name: '数学分析', description: '掌握微积分和数学分析基础', category: 'academic', level: 3, maxLevel: 5, prerequisites: [], unlockedAt: '2024-01-10' },
  { id: '7', name: '线性代数', description: '理解向量空间和矩阵运算', category: 'academic', level: 2, maxLevel: 5, prerequisites: ['6'], unlockedAt: '2024-02-15' },
  { id: '8', name: '有效沟通', description: '学会清晰表达想法和倾听他人', category: 'social', level: 3, maxLevel: 5, prerequisites: [], unlockedAt: '2024-01-25' },
  { id: '9', name: '团队协作', description: '掌握在团队中有效协作的技巧', category: 'social', level: 2, maxLevel: 5, prerequisites: ['8'], unlockedAt: '2024-02-20' },
  { id: '10', name: '有氧运动', description: '建立规律的有氧运动习惯', category: 'physical', level: 4, maxLevel: 5, prerequisites: [], unlockedAt: '2024-01-05' },
  { id: '11', name: '力量训练', description: '掌握基础力量训练方法', category: 'physical', level: 2, maxLevel: 5, prerequisites: ['10'], unlockedAt: '2024-03-10' },
  { id: '12', name: '批判性思维', description: '学会分析问题和评估论据', category: 'mindset', level: 3, maxLevel: 5, prerequisites: [], unlockedAt: '2024-01-30' },
  { id: '13', name: '时间管理', description: '掌握高效的时间管理技巧', category: 'mindset', level: 2, maxLevel: 5, prerequisites: ['12'], unlockedAt: '2024-02-25' },
];

// ============================================
// 样式定义
// ============================================

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing.lg} ${spacing['2xl']}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 10,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xl,
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  filterDropdown: {
    minWidth: '140px',
  },
  toolbarDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: tokens.colorNeutralStroke2,
  },
  content: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing',
    },
  },
  floatingControls: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    zIndex: 20,
  },
  controlCard: {
    backgroundColor: 'rgba(28, 28, 28, 0.85)',
    backdropFilter: 'blur(20px) saturate(125%)',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    padding: spacing.md,
    boxShadow: shadows.lg,
  },
  floatingTooltip: {
    position: 'fixed',
    backgroundColor: 'rgba(28, 28, 28, 0.95)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: `${spacing.sm} ${spacing.md}`,
    maxWidth: '280px',
    zIndex: 1000,
    pointerEvents: 'none',
  },
  zoomControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  zoomButtonRow: {
    display: 'flex',
    gap: spacing.xs,
  },
  drawerBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  skillHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  colorIndicator: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: `0 0 10px rgba(0,0,0,0.3)`,
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightSemibold,
  },
  prereqList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  actionButtons: {
    display: 'flex',
    gap: spacing.sm,
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: spacing.xl,
    textAlign: 'center',
    padding: spacing['2xl'],
  },
  emptyStateIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: tokens.colorNeutralBackground3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
  },
  skillCount: {
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
});

// ============================================
// 辅助函数
// ============================================

const getCategoryColor = (category: SkillCategory): string => {
  return CATEGORY_CONFIG[category]?.color || colors.accent.DEFAULT;
};

const getCategoryAppearance = (category: SkillCategory) => {
  return CATEGORY_CONFIG[category]?.appearance || 'brand';
};

const getCategoryName = (category: SkillCategory): string => {
  return CATEGORY_CONFIG[category]?.label || category;
};

// ============================================
// 空状态组件
// ============================================

function EmptyState({ onCreate }: { onCreate: () => void }) {
  const styles = useStyles();
  
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>
        <Target20Regular style={{ fontSize: 40, color: tokens.colorNeutralForeground3 }} />
      </div>
      <div>
        <Title2>开始构建你的技能树</Title2>
        <Text style={{ color: tokens.colorNeutralForeground3, marginTop: spacing.sm, display: 'block' }}>
          还没有技能记录，创建第一个技能开启成长之旅
        </Text>
      </div>
      <Button appearance="primary" icon={<Add20Filled />} size="large" onClick={onCreate}>
        创建第一个技能
      </Button>
    </div>
  );
}

// ============================================
// 技能详情面板组件
// ============================================

interface SkillDetailPanelProps {
  skill: Skill | null;
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onEdit: () => void;
  onDelete: () => void;
  allSkills: Skill[];
}

function SkillDetailPanel({ skill, open, onClose, onUpgrade, onEdit, onDelete, allSkills }: SkillDetailPanelProps) {
  const styles = useStyles();

  if (!skill) return null;

  const canUpgrade = skill.level < skill.maxLevel;
  const progressValue = (skill.level / skill.maxLevel) * 100;
  const categoryColor = getCategoryColor(skill.category);

  // 查找前置技能
  const prereqSkills = skill.prerequisites
    .map(id => allSkills.find(s => s.id === id))
    .filter(Boolean) as Skill[];

  // 查找后续技能
  const nextSkills = allSkills.filter(s => s.prerequisites.includes(skill.id));

  return (
    <Drawer
      type="overlay"
      position="end"
      separator
      open={open}
      onOpenChange={(_, { open }) => !open && onClose()}
      size="medium"
      style={{ animation: 'slideInRight 0.3s ease' }}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="关闭"
              icon={<Dismiss20Regular />}
              onClick={onClose}
            />
          }
        >
          <div className={styles.skillHeader}>
            <div
              className={styles.colorIndicator}
              style={{ backgroundColor: categoryColor, boxShadow: `0 0 15px ${categoryColor}40` }}
            />
            <div>
              <Title2>{skill.name}</Title2>
              <div style={{ marginTop: spacing.xs }}>
                <Badge appearance={getCategoryAppearance(skill.category)}>
                  {getCategoryName(skill.category)}
                </Badge>
              </div>
            </div>
          </div>
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody>
        <div className={styles.drawerBody}>
          {/* 描述 */}
          <div className={styles.section}>
            <Caption1 className={styles.sectionTitle}>描述</Caption1>
            <Text>{skill.description}</Text>
          </div>

          {/* 等级进度 */}
          <div className={mergeClasses(styles.section, styles.progressSection)}>
            <Caption1 className={styles.sectionTitle}>等级进度</Caption1>
            <div className={styles.progressHeader}>
              <Text weight="semibold">等级 {skill.level} / {skill.maxLevel}</Text>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                {Math.round(progressValue)}%
              </Text>
            </div>
            <ProgressBar value={progressValue} thickness="large" color="brand" />
          </div>

          {/* 解锁时间 */}
          {skill.unlockedAt && (
            <div className={styles.section}>
              <Caption1 className={styles.sectionTitle}>解锁时间</Caption1>
              <Text>{skill.unlockedAt}</Text>
            </div>
          )}

          {/* 前置技能 */}
          {prereqSkills.length > 0 && (
            <div className={styles.section}>
              <Caption1 className={styles.sectionTitle}>前置技能</Caption1>
              <div className={styles.prereqList}>
                {prereqSkills.map((preSkill) => (
                  <Badge
                    key={preSkill.id}
                    appearance="outline"
                    style={{
                      borderColor: getCategoryColor(preSkill.category),
                      color: getCategoryColor(preSkill.category),
                    }}
                  >
                    {preSkill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 后续技能 */}
          {nextSkills.length > 0 && (
            <div className={styles.section}>
              <Caption1 className={styles.sectionTitle}>解锁技能</Caption1>
              <div className={styles.prereqList}>
                {nextSkills.map((nextSkill) => (
                  <Badge
                    key={nextSkill.id}
                    appearance="outline"
                    style={{
                      borderColor: getCategoryColor(nextSkill.category),
                      color: getCategoryColor(nextSkill.category),
                    }}
                  >
                    {nextSkill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className={styles.actionButtons}>
            <Button
              appearance="primary"
              icon={<ChevronUp20Filled />}
              disabled={!canUpgrade}
              onClick={onUpgrade}
              style={{ flex: 1 }}
            >
              {canUpgrade ? '升级技能' : '已满级'}
            </Button>
            <Button appearance="secondary" icon={<Edit20Regular />} onClick={onEdit}>
              编辑
            </Button>
            <Button appearance="secondary" icon={<Delete20Regular />} onClick={onDelete}>
              删除
            </Button>
          </div>
        </div>
      </DrawerBody>
    </Drawer>
  );
}

// ============================================
// D3 技能树可视化组件
// ============================================

interface SkillTreeVisualizationProps {
  skills: Skill[];
  onSkillClick: (skill: Skill) => void;
}

export interface SkillTreeVisualizationRef {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
}

const SkillTreeVisualization = React.forwardRef<SkillTreeVisualizationRef, SkillTreeVisualizationProps>(
  ({ skills, onSkillClick }, ref) => {
  const styles = useStyles();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const simulationRef = useRef<d3.Simulation<NodeDatum, LinkDatum> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; skill: Skill | null }>({
    visible: false,
    x: 0,
    y: 0,
    skill: null,
  });

  const nodesRef = useRef<NodeDatum[]>([]);
  const linksRef = useRef<LinkDatum[]>([]);

  const containerWidth = containerRef.current?.clientWidth || 800;
  const containerHeight = containerRef.current?.clientHeight || 600;

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    handleZoomIn: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy as any, 1.3);
      }
    },
    handleZoomOut: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy as any, 0.7);
      }
    },
    handleResetZoom: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(750)
          .call(zoomRef.current.transform as any, d3.zoomIdentity);
      }
    },
  }));

  // 初始化 D3 图表
  const initChart = useCallback(() => {
    try {
      if (!svgRef.current || !containerRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      svg.attr('width', width).attr('height', height);

      // 创建主组
      const g = svg.append('g');
      gRef.current = g;

      // 设置缩放行为
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform.toString());
          setTransform(event.transform);
        });

      zoomRef.current = zoom;
      svg.call(zoom as any);

      // 准备节点数据
      const nodes: NodeDatum[] = skills.map((s) => ({
        id: s.id,
        name: s.name,
        level: s.level,
        maxLevel: s.maxLevel,
        category: s.category,
        skill: s,
      }));
      nodesRef.current = nodes;

      // 准备链接数据
      const links: LinkDatum[] = [];
      skills.forEach((skill) => {
        skill.prerequisites.forEach((preId) => {
          links.push({ source: preId, target: skill.id });
        });
      });
      linksRef.current = links;

      // 创建力导向模拟
      const simulation = d3
        .forceSimulation<NodeDatum>(nodes)
        .force(
          'link',
          d3
            .forceLink<NodeDatum, LinkDatum>(links)
            .id((d) => d.id)
            .distance(150)
        )
        .force('charge', d3.forceManyBody().strength(-600))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(60));

      simulationRef.current = simulation;

      // 绘制连线
      const link = g
        .append('g')
        .attr('stroke', tokens.colorNeutralStroke1)
        .attr('stroke-opacity', 0.5)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', 2);

      // 绘制节点组
      const node = g
        .append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('cursor', 'pointer')
        .call(
          d3
            .drag<SVGGElement, NodeDatum>()
            .on('start', (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on('end', (event, d) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        );

      // 外圈光晕
      node
        .append('circle')
        .attr('r', (d) => 35 + d.level * 3)
        .attr('fill', 'none')
        .attr('stroke', (d) => getCategoryColor(d.category))
        .attr('stroke-width', 1)
        .attr('opacity', 0.3)
        .attr('class', 'glow-ring');

      // 主圆背景
      node
        .append('circle')
        .attr('r', (d) => 28 + d.level * 2)
        .attr('fill', tokens.colorNeutralBackground2)
        .attr('stroke', (d) => getCategoryColor(d.category))
        .attr('stroke-width', 2);

      // 进度环
      node
        .append('circle')
        .attr('r', (d) => 28 + d.level * 2)
        .attr('fill', 'none')
        .attr('stroke', (d) => getCategoryColor(d.category))
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', (d) => {
          const r = 28 + d.level * 2;
          const circumference = 2 * Math.PI * r;
          return `${circumference * (d.level / d.maxLevel)} ${circumference}`;
        })
        .attr('stroke-linecap', 'round')
        .style('transform', 'rotate(-90deg)')
        .style('transform-origin', '0px 0px');

      // 技能名称
      node
        .append('text')
        .text((d) => d.name)
        .attr('text-anchor', 'middle')
        .attr('dy', 50)
        .attr('fill', tokens.colorNeutralForeground1)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('font-family', tokens.fontFamilyBase)
        .style('pointer-events', 'none');

      // 等级数字
      node
        .append('text')
        .text((d) => `${d.level}`)
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('fill', tokens.colorNeutralForeground1)
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .attr('font-family', tokens.fontFamilyBase)
        .style('pointer-events', 'none');

      // 事件处理
      node
        .on('click', (event, d) => {
          event.stopPropagation();
          onSkillClick(d.skill);
        })
        .on('mouseenter', (event, d) => {
          d3.select(event.currentTarget)
            .select('.glow-ring')
            .transition()
            .duration(200)
            .attr('opacity', 0.6)
            .attr('r', 40 + d.level * 3);

          setTooltip({
            visible: true,
            x: event.clientX + 10,
            y: event.clientY - 10,
            skill: d.skill,
          });
        })
        .on('mousemove', (event) => {
          setTooltip(prev => ({
            ...prev,
            x: event.clientX + 10,
            y: event.clientY - 10,
          }));
        })
        .on('mouseleave', function () {
          d3.select(this)
            .select('.glow-ring')
            .transition()
            .duration(200)
            .attr('opacity', 0.3)
            .attr('r', (d: any) => 35 + d.level * 3);

          setTooltip(prev => ({ ...prev, visible: false }));
        });

      // 模拟更新
      simulation.on('tick', () => {
        link
          .attr('x1', (d) => (d.source as NodeDatum).x!)
          .attr('y1', (d) => (d.source as NodeDatum).y!)
          .attr('x2', (d) => (d.target as NodeDatum).x!)
          .attr('y2', (d) => (d.target as NodeDatum).y!);

        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });
    } catch (e: any) {
      setError(e.message);
      console.error('D3 rendering error:', e);
    }
  }, [skills, onSkillClick]);

  // 重新渲染当技能数据变化
  useEffect(() => {
    initChart();

    const handleResize = () => {
      initChart();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initChart]);

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: spacing.lg }}>
        <Text size={400} weight="semibold" style={{ color: tokens.colorPaletteRedForeground1 }}>
          渲染错误
        </Text>
        <Text>{error}</Text>
        <Button appearance="primary" onClick={() => window.location.reload()}>
          重新加载
        </Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg ref={svgRef} className={styles.svgContainer} />
      
      {/* 悬浮提示 */}
      {tooltip.visible && tooltip.skill && (
        <div
          className={styles.floatingTooltip}
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: getCategoryColor(tooltip.skill.category),
              }}
            />
            <Text weight="semibold">{tooltip.skill.name}</Text>
          </div>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
            {tooltip.skill.description.slice(0, 60)}...
          </Text>
          <div style={{ marginTop: spacing.xs }}>
            <Badge appearance="outline" size="small">
              等级 {tooltip.skill.level}/{tooltip.skill.maxLevel}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
});

SkillTreeVisualization.displayName = 'SkillTreeVisualization';

// ============================================
// 删除确认对话框
// ============================================

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  skillName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  skillName: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>确认删除</DialogTitle>
          <DialogContent>
            确定要删除技能 "{skillName}" 吗？此操作无法撤销。
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">取消</Button>
            </DialogTrigger>
            <Button appearance="primary" style={{ backgroundColor: tokens.colorPaletteRedBackground1 }} onClick={onConfirm}>
              删除
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// ============================================
// 主页面组件
// ============================================

export function SkillTreePage() {
  const styles = useStyles();
  const [skills, setSkills] = useState<Skill[]>(SAMPLE_SKILLS);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<SkillTreeVisualizationRef | null>(null);

  // 筛选后的技能
  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') return skills;
    return skills.filter(s => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  // 统计
  const stats = useMemo(() => ({
    total: skills.length,
    unlocked: skills.filter(s => s.unlockedAt).length,
    maxLevel: skills.filter(s => s.level === s.maxLevel).length,
  }), [skills]);

  // 处理添加技能
  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '新技能',
      description: '点击编辑描述',
      category: 'technical',
      level: 1,
      maxLevel: 5,
      prerequisites: [],
      unlockedAt: new Date().toISOString().split('T')[0],
    };
    setSkills(prev => [...prev, newSkill]);
  };

  // 处理技能点击
  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setDrawerOpen(true);
  };

  // 处理技能升级
  const handleUpgrade = () => {
    if (!selectedSkill) return;
    setSkills(prev =>
      prev.map(s =>
        s.id === selectedSkill.id ? { ...s, level: Math.min(s.level + 1, s.maxLevel) } : s
      )
    );
    setSelectedSkill(prev => prev ? { ...prev, level: Math.min(prev.level + 1, prev.maxLevel) } : null);
  };

  // 处理技能编辑
  const handleEdit = () => {
    console.log('Edit skill:', selectedSkill?.id);
  };

  // 处理技能删除
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedSkill) return;
    setSkills(prev => prev.filter(s => s.id !== selectedSkill.id));
    setDeleteDialogOpen(false);
    setDrawerOpen(false);
    setSelectedSkill(null);
  };

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      contentRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 空状态检查
  const isEmpty = skills.length === 0;

  return (
    <ErrorBoundary>
      <div className={styles.root}>
        {/* 头部工具栏 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerTitle}>
              <Title1>技能科技树</Title1>
              <Subtitle1 style={{ color: tokens.colorNeutralForeground3 }}>
                探索你的成长路径，解锁新技能
              </Subtitle1>
            </div>
            <div className={styles.statsBadge}>
              <Text>总计</Text>
              <span className={styles.skillCount}>{stats.total}</span>
              <span style={{ color: tokens.colorNeutralStroke2 }}>|</span>
              <Text>已解锁</Text>
              <span className={styles.skillCount}>{stats.unlocked}</span>
              <span style={{ color: tokens.colorNeutralStroke2 }}>|</span>
              <Text>满级</Text>
              <span className={styles.skillCount}>{stats.maxLevel}</span>
            </div>
          </div>

          <div className={styles.headerActions}>
            {/* 分类筛选 */}
            <Dropdown
              className={styles.filterDropdown}
              value={getCategoryName(selectedCategory)}
              selectedOptions={[selectedCategory]}
              onOptionSelect={(_, data) => {
                setSelectedCategory((data.optionValue as SkillCategory) || 'all');
              }}
              expandIcon={<Filter20Regular />}
            >
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <Option key={key} value={key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: config.color,
                      }}
                    />
                    {config.label}
                  </div>
                </Option>
              ))}
            </Dropdown>

            <div className={styles.toolbarDivider} />

            {/* 视图控制 */}
            <Tooltip content="放大" relationship="label">
              <Button appearance="subtle" icon={<ZoomIn20Regular />} />
            </Tooltip>
            <Tooltip content="缩小" relationship="label">
              <Button appearance="subtle" icon={<ZoomOut20Regular />} />
            </Tooltip>
            <Tooltip content={isFullscreen ? '退出全屏' : '全屏'} relationship="label">
              <Button
                appearance="subtle"
                icon={isFullscreen ? <FullScreenMinimize20Regular /> : <FullScreenMaximize20Regular />}
                onClick={toggleFullscreen}
              />
            </Tooltip>

            <div className={styles.toolbarDivider} />

            {/* 添加按钮 */}
            <Button appearance="primary" icon={<Add20Filled />} size="medium" onClick={handleAddSkill}>
              添加技能
            </Button>
          </div>
        </div>

        {/* 内容区域 */}
        <div ref={contentRef} className={styles.content}>
          {isEmpty ? (
            <EmptyState onCreate={handleAddSkill} />
          ) : (
            <>
              <SkillTreeVisualization 
                skills={filteredSkills} 
                onSkillClick={handleSkillClick}
                ref={svgContainerRef}
              />

              {/* 悬浮控制面板 */}
              <div className={styles.floatingControls}>
                {/* 缩放控制 */}
                <div className={mergeClasses(styles.controlCard, styles.zoomControls)}>
                  <div className={styles.zoomButtonRow}>
                    <Tooltip content="放大" relationship="label">
                      <Button 
                        appearance="subtle" 
                        icon={<ZoomIn20Regular />} 
                        size="small" 
                        onClick={() => svgContainerRef.current?.handleZoomIn()}
                      />
                    </Tooltip>
                    <Tooltip content="缩小" relationship="label">
                      <Button 
                        appearance="subtle" 
                        icon={<ZoomOut20Regular />} 
                        size="small" 
                        onClick={() => svgContainerRef.current?.handleZoomOut()}
                      />
                    </Tooltip>
                  </div>
                  <Button 
                    appearance="secondary" 
                    size="small" 
                    style={{ fontSize: '12px' }}
                    onClick={() => svgContainerRef.current?.handleResetZoom()}
                  >
                    重置视图
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 技能详情面板 */}
        <SkillDetailPanel
          skill={selectedSkill}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onUpgrade={handleUpgrade}
          onEdit={handleEdit}
          onDelete={handleDelete}
          allSkills={skills}
        />

        {/* 删除确认对话框 */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          skillName={selectedSkill?.name || ''}
        />
      </div>
    </ErrorBoundary>
  );
}

export default SkillTreePage;
