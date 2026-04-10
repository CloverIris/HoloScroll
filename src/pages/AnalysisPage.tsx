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
  Caption1,
  Subtitle1,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Tooltip,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  ArrowExport24Regular,
  ArrowClockwise24Regular,
  Target24Filled,
  ArrowTrending24Regular,
  Clock24Filled,
  Fire24Filled,
  Lightbulb24Filled,
  DocumentPdf24Regular,
  Image24Regular,
  Code24Regular,
  ArrowUp24Filled,
  ArrowDown24Filled,
  Brain24Regular,
} from '@fluentui/react-icons';
import {
  VerticalBarChart,
  LineChart,
  DonutChart,
} from '@fluentui/react-charting';
import { skillCategoryColors } from '../styles/fluent-theme';
import { exportToJSON, exportToImage, exportToPDF } from '../utils/export';
import { useSkillStore } from '../stores/skillStore';
import { useToast } from '../components/fluent/ToastProvider';

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
  headerActions: {
    display: 'flex',
    gap: '12px',
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
  trendIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px 32px',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '24px',
  },
  chartCard: {
    minHeight: '380px',
  },
  chartContainer: {
    height: '300px',
    padding: '16px',
  },
  chartTitle: {
    marginBottom: '8px',
  },
  chartSubtitle: {
    color: tokens.colorNeutralForeground3,
  },
  insightsCard: {
    background: `linear-gradient(135deg, rgba(96, 205, 255, 0.08) 0%, rgba(0, 147, 245, 0.08) 100%)`,
    border: `1px solid ${tokens.colorBrandStroke1}`,
  },
  insightsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  insightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  insightIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 170, 68, 0.15)',
    flexShrink: 0,
  },
  insightContent: {
    flex: 1,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: tokens.colorNeutralForeground3,
    gap: '16px',
  },
  radarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  bottomSection: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '24px',
  },
});

// ============================================
// 类型定义
// ============================================
interface StatData {
  label: string;
  value: string | number;
  icon: typeof Target24Filled;
  color: string;
  bgColor: string;
  trend: number;
  trendLabel: string;
  isLucide?: boolean;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'suggestion' | 'warning' | 'achievement';
}

// ============================================
// 示例数据
// ============================================

// 统计数据
const statsData: StatData[] = [
  {
    label: '总技能数',
    value: 15,
    icon: Target24Filled,
    color: '#60cdff',
    bgColor: 'rgba(96, 205, 255, 0.15)',
    trend: 20,
    trendLabel: '↑ 20%',
  },
  {
    label: '平均等级',
    value: '3.2级',
    icon: ArrowTrending24Regular,
    color: '#00d26a',
    bgColor: 'rgba(0, 210, 106, 0.15)',
    trend: 0.5,
    trendLabel: '↑ 0.5',
  },
  {
    label: '记录事件',
    value: 128,
    icon: Clock24Filled,
    color: '#cc99ff',
    bgColor: 'rgba(204, 153, 255, 0.15)',
    trend: 12,
    trendLabel: '↑ 12',
  },
  {
    label: '连续记录',
    value: '15天',
    icon: Fire24Filled,
    color: '#ffaa44',
    bgColor: 'rgba(255, 170, 68, 0.15)',
    trend: 0,
    trendLabel: '最佳',
  },
];

// 技能分布数据 (环形图)
const skillDistributionData = {
  chartTitle: '技能六维分布',
  chartData: [
    { legend: '技术', data: 4, color: skillCategoryColors.technical },
    { legend: '创意', data: 3, color: skillCategoryColors.creative },
    { legend: '学术', data: 2, color: skillCategoryColors.academic },
    { legend: '社交', data: 3, color: skillCategoryColors.social },
    { legend: '身体', data: 2, color: skillCategoryColors.physical },
    { legend: '思维', data: 4, color: skillCategoryColors.mindset },
  ],
};

// 成长趋势数据 (折线图)
const growthTrendData = {
  chartTitle: '成长趋势 (最近30天)',
  lineChartData: [
    {
      legend: '技能等级',
      data: [
        { x: new Date('2024-03-01'), y: 2.1 },
        { x: new Date('2024-03-05'), y: 2.3 },
        { x: new Date('2024-03-10'), y: 2.5 },
        { x: new Date('2024-03-15'), y: 2.8 },
        { x: new Date('2024-03-20'), y: 3.0 },
        { x: new Date('2024-03-25'), y: 3.1 },
        { x: new Date('2024-03-30'), y: 3.2 },
      ],
      color: '#60cdff',
    },
    {
      legend: '记录数',
      data: [
        { x: new Date('2024-03-01'), y: 20 },
        { x: new Date('2024-03-05'), y: 35 },
        { x: new Date('2024-03-10'), y: 55 },
        { x: new Date('2024-03-15'), y: 75 },
        { x: new Date('2024-03-20'), y: 95 },
        { x: new Date('2024-03-25'), y: 115 },
        { x: new Date('2024-03-30'), y: 128 },
      ],
      color: '#00d26a',
    },
  ],
};

// 类别对比数据 (柱状图)
const categoryComparisonData = {
  chartTitle: '各类别技能数量',
  chartData: [
    { x: '技术', y: 4, color: skillCategoryColors.technical },
    { x: '创意', y: 3, color: skillCategoryColors.creative },
    { x: '学术', y: 2, color: skillCategoryColors.academic },
    { x: '社交', y: 3, color: skillCategoryColors.social },
    { x: '身体', y: 2, color: skillCategoryColors.physical },
    { x: '思维', y: 1, color: skillCategoryColors.mindset },
  ],
};

// AI 洞察数据
const aiInsights: Insight[] = [
  {
    id: '1',
    title: '技术类技能表现突出',
    description: '你的技术类技能平均等级最高，建议继续保持并尝试挑战更高级别的项目。',
    type: 'achievement',
  },
  {
    id: '2',
    title: '建议增加身体类活动',
    description: '身体类技能目前发展较慢，建议每周安排至少3次运动锻炼，保持身心健康。',
    type: 'suggestion',
  },
  {
    id: '3',
    title: '学习习惯优秀',
    description: '连续15天的记录显示了出色的自律性，这种习惯将带来长期收益。',
    type: 'achievement',
  },
  {
    id: '4',
    title: '平衡发展提醒',
    description: '各领域技能发展较为均衡，但学术类还有提升空间，建议投入更多学习时间。',
    type: 'warning',
  },
];

// ============================================
// 统计卡片组件
// ============================================
interface StatCardProps {
  stat: StatData;
}

function StatCard({ stat }: StatCardProps) {
  const styles = useStyles();
  const Icon = stat.icon;
  const isPositive = stat.trend >= 0;

  return (
    <Card className={styles.statCard}>
      <CardPreview>
        <div className={styles.statCardContent}>
          <div className={styles.statIcon} style={{ backgroundColor: stat.bgColor }}>
            <Icon style={{ fontSize: 24, color: stat.color }} />
          </div>
          <div className={styles.statInfo}>
            <Text className={styles.statValue}>{stat.value}</Text>
            <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>{stat.label}</Caption1>
            <div
              className={styles.trendIndicator}
              style={{ color: isPositive ? '#00d26a' : '#ff6b6b' }}
            >
              {isPositive ? (
                <ArrowUp24Filled style={{ fontSize: 12 }} />
              ) : (
                <ArrowDown24Filled style={{ fontSize: 12 }} />
              )}
              <Caption1>{stat.trendLabel}</Caption1>
            </div>
          </div>
        </div>
      </CardPreview>
    </Card>
  );
}

// ============================================
// 洞察卡片组件
// ============================================
interface InsightCardProps {
  insight: Insight;
}

function InsightCard({ insight }: InsightCardProps) {
  const styles = useStyles();

  const typeConfig = {
    suggestion: { color: '#60cdff', bgColor: 'rgba(96, 205, 255, 0.15)', label: '建议' },
    warning: { color: '#ffaa44', bgColor: 'rgba(255, 170, 68, 0.15)', label: '提醒' },
    achievement: { color: '#00d26a', bgColor: 'rgba(0, 210, 106, 0.15)', label: '成就' },
  };

  const config = typeConfig[insight.type];

  return (
    <div className={styles.insightItem}>
      <div className={styles.insightIcon} style={{ backgroundColor: config.bgColor }}>
        <Lightbulb24Filled style={{ fontSize: 18, color: config.color }} />
      </div>
      <div className={styles.insightContent}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Text weight="semibold" size={200}>
            {insight.title}
          </Text>
          <Badge
            appearance="filled"
            size="small"
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
            }}
          >
            {config.label}
          </Badge>
        </div>
        <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>{insight.description}</Caption1>
      </div>
    </div>
  );
}

// ============================================
// 主页面组件
// ============================================
export function AnalysisPage() {
  const styles = useStyles();
  const { toast } = useToast();
  const { skills } = useSkillStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExport = async (type: string) => {
    try {
      const exportData = {
        skills,
        exportTime: new Date().toISOString(),
        version: '1.0',
      };
      
      switch (type) {
        case 'json':
          exportToJSON(exportData, `holoscroll-data-${Date.now()}.json`);
          toast({ title: '导出成功', content: 'JSON 文件已下载', intent: 'success' });
          break;
        case 'image':
          await exportToImage('analysis-content', `holoscroll-analysis-${Date.now()}.png`);
          toast({ title: '导出成功', content: '图片已下载', intent: 'success' });
          break;
        case 'pdf':
          await exportToPDF('analysis-content', `holoscroll-report-${Date.now()}.pdf`);
          toast({ title: '导出成功', content: 'PDF 报告已下载', intent: 'success' });
          break;
      }
    } catch (error) {
      toast({
        title: '导出失败',
        content: error instanceof Error ? error.message : '未知错误',
        intent: 'error',
      });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // 雷达图数据转换
  const radarData = useMemo(
    () => ({
      chartTitle: '技能六维分布',
      chartData: skillDistributionData.chartData?.map((item) => ({
        x: item.x as string,
        y: item.y as number,
      })),
    }),
    []
  );

  return (
    <div id="analysis-content" className={styles.root}>
      {/* 头部 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Title1>智能分析</Title1>
          <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>洞察你的成长轨迹</Caption1>
        </div>

        <div className={styles.headerActions}>
          {/* 刷新按钮 */}
          <Tooltip content="刷新数据" relationship="label">
            <Button
              appearance="subtle"
              icon={<ArrowClockwise24Regular className={isRefreshing ? 'animate-spin' : ''} />}
              onClick={handleRefresh}
            />
          </Tooltip>

          {/* 导出菜单 */}
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button appearance="secondary" icon={<ArrowExport24Regular />}>
                导出
              </Button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem icon={<DocumentPdf24Regular />} onClick={() => handleExport('pdf')}>
                  导出 PDF 报告
                </MenuItem>
                <MenuItem icon={<Image24Regular />} onClick={() => handleExport('image')}>
                  导出图片
                </MenuItem>
                <MenuItem icon={<Code24Regular />} onClick={() => handleExport('json')}>
                  导出 JSON 数据
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>

      {/* 关键指标 */}
      <div className={styles.statsSection}>
        {statsData.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* 内容区 */}
      <div className={styles.content}>
        {/* 图表区域 */}
        <div className={styles.chartsGrid}>
          {/* 雷达图 - 技能分布 */}
          <Card className={styles.chartCard}>
            <CardHeader
              header={<Subtitle1 className={styles.chartTitle}>技能六维分布</Subtitle1>}
              description={
                <Caption1 className={styles.chartSubtitle}>各领域技能等级概览</Caption1>
              }
            />
            <div className={styles.chartContainer}>
              <div className={styles.radarContainer}>
                <DonutChart
                  data={skillDistributionData.chartData}
                  chartTitle="技能分布"
                  width={400}
                  height={300}
                  innerRadius={60}
                />
              </div>
            </div>
          </Card>

          {/* 折线图 - 成长趋势 */}
          <Card className={styles.chartCard}>
            <CardHeader
              header={<Subtitle1 className={styles.chartTitle}>成长趋势</Subtitle1>}
              description={
                <Caption1 className={styles.chartSubtitle}>最近30天技能与记录变化</Caption1>
              }
            />
            <div className={styles.chartContainer}>
              <LineChart
                data={growthTrendData}
                chartTitle="成长趋势"
                width={450}
                height={280}
                yAxisTickCount={5}
                allowMultipleShapesForPoints={false}
                hideLegend={false}
              />
            </div>
          </Card>
        </div>

        {/* 底部区域：柱状图 + AI 洞察 */}
        <div className={styles.bottomSection}>
          {/* 柱状图 - 类别对比 */}
          <Card>
            <CardHeader
              header={<Subtitle1 className={styles.chartTitle}>各类别技能数量对比</Subtitle1>}
              description={
                <Caption1 className={styles.chartSubtitle}>不同领域技能发展情况</Caption1>
              }
            />
            <div className={styles.chartContainer}>
              <VerticalBarChart
                data={categoryComparisonData}
                chartTitle="类别对比"
                width={600}
                height={280}
                yAxisTickCount={5}
                hideLegend={true}
              />
            </div>
          </Card>

          {/* AI 洞察面板 */}
          <Card className={styles.insightsCard}>
            <div style={{ padding: '16px' }}>
              <div className={styles.insightsHeader}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 170, 68, 0.2)',
                  }}
                >
                  <Brain24Regular style={{ fontSize: 20, color: '#ffaa44' }} />
                </div>
                <Subtitle1>AI 智能洞察</Subtitle1>
                <Badge appearance="outline" size="small">
                  Beta
                </Badge>
              </div>

              <div className={styles.insightsList}>
                {aiInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;
