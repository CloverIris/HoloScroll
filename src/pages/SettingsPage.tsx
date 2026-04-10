import { useState, useCallback } from 'react';
import {
  Button,
  Card,
  CardHeader,
  Switch,
  Text,
  Title1,
  Title2,
  Subtitle1,
  Caption1,
  Divider,
  makeStyles,
  tokens,
  Tooltip,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions,
  DialogContent,
  Slider,
  Dropdown,
  Option,
  Badge,
} from '@fluentui/react-components';
import {
  Settings24Regular,
  ArrowReset24Regular,
  Database24Regular,
  PaintBrush24Regular,
  Alert24Regular,
  Shield24Regular,
  Info24Regular,
  ChevronRight24Regular,
  Warning24Regular,
  Delete24Regular,
  Add24Regular,
  Rocket24Regular,
} from '@fluentui/react-icons';
import { useSkillStore } from '../stores/skillStore';
import { useTimelineStore } from '../stores/timelineStore';
import { useAchievementStore } from '../stores/achievementStore';
import { OOBEWizard } from '../components/oobe/OOBEWizard';
import { colors, spacing, radius, shadows } from '../styles/design-system';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: `linear-gradient(180deg, ${colors.bg.secondary} 0%, ${colors.bg.primary} 100%)`,
    overflow: 'auto',
  },
  header: {
    padding: '32px 40px',
    borderBottom: `1px solid ${colors.border.subtle}`,
    background: colors.gradients.surface,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    padding: '32px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionIcon: {
    width: '40px',
    height: '40px',
    borderRadius: radius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(96, 205, 255, 0.1)',
    border: `1px solid rgba(96, 205, 255, 0.2)`,
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: colors.text.tertiary,
    marginLeft: '52px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: `1px solid ${colors.border.subtle}`,
    borderRadius: radius.xl,
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: colors.border.default,
    },
  },
  cardHeader: {
    padding: `${spacing.lg} ${spacing.xl}`,
  },
  cardContent: {
    padding: `0 ${spacing.xl} ${spacing.lg}`,
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.md} 0`,
    borderBottom: `1px solid ${colors.border.subtle}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  settingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  settingLabel: {
    fontSize: '15px',
    fontWeight: 500,
    color: colors.text.primary,
  },
  settingDescription: {
    fontSize: '13px',
    color: colors.text.tertiary,
  },
  dangerZone: {
    border: `1px solid rgba(255, 122, 122, 0.3)`,
    backgroundColor: 'rgba(255, 122, 122, 0.03)',
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  dangerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    color: '#ff7a7a',
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: spacing.sm,
  },
  oobeCard: {
    background: `linear-gradient(135deg, rgba(96, 205, 255, 0.08) 0%, rgba(96, 205, 255, 0.03) 100%)`,
    border: `1px solid rgba(96, 205, 255, 0.2)`,
    borderRadius: radius.xl,
    padding: spacing.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: 'rgba(96, 205, 255, 0.4)',
      boxShadow: '0 0 30px rgba(96, 205, 255, 0.1)',
    },
  },
  oobeContent: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.lg,
  },
  oobeIcon: {
    width: '56px',
    height: '56px',
    borderRadius: radius.xl,
    background: 'linear-gradient(135deg, rgba(96, 205, 255, 0.2) 0%, rgba(96, 205, 255, 0.1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(96, 205, 255, 0.3)',
  },
  oobeTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  oobeDescription: {
    fontSize: '14px',
    color: colors.text.secondary,
  },
  badge: {
    padding: '4px 12px',
    borderRadius: radius.full,
    fontSize: '12px',
    fontWeight: 500,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing.md,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    textAlign: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: colors.accent.DEFAULT,
  },
  statLabel: {
    fontSize: '13px',
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});

// 设置项组件
interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingItem({ label, description, children }: SettingItemProps) {
  const styles = useStyles();
  return (
    <div className={styles.settingItem}>
      <div className={styles.settingInfo}>
        <span className={styles.settingLabel}>{label}</span>
        {description && <span className={styles.settingDescription}>{description}</span>}
      </div>
      {children}
    </div>
  );
}

export function SettingsPage() {
  const styles = useStyles();
  const { skills } = useSkillStore();
  const { events } = useTimelineStore();
  const { achievements } = useAchievementStore();
  
  // 状态
  const [showOOBE, setShowOOBE] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  // 设置状态
  const [settings, setSettings] = useState({
    autoSave: true,
    darkMode: true,
    notifications: true,
    soundEffects: false,
    aiSuggestions: true,
    compactMode: false,
    language: 'zh-CN',
    dataSync: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetData = () => {
    // 重置所有数据
    localStorage.clear();
    indexedDB.deleteDatabase('HoloScrollDB');
    window.location.reload();
  };

  const stats = {
    totalSkills: skills.length,
    totalEvents: events.length,
    totalAchievements: achievements.length,
    storageUsed: '12.5 MB',
  };

  return (
    <div className={styles.root}>
      {/* 头部 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Title1>设置</Title1>
            <Subtitle1 style={{ color: colors.text.tertiary, marginTop: spacing.xs }}>
              管理你的应用偏好和数据
            </Subtitle1>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className={styles.content}>
        {/* OOBE 重新引导 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Rocket24Regular style={{ color: colors.accent.DEFAULT }} />
            </div>
            <span className={styles.sectionTitle}>入门引导</span>
          </div>
          <div className={styles.sectionSubtitle}>
            重新运行引导向导，探索新的成长路径
          </div>
          
          <div className={styles.oobeCard} onClick={() => setShowOOBE(true)}>
            <div className={styles.oobeContent}>
              <div className={styles.oobeIcon}>
                <Rocket24Regular style={{ fontSize: 28, color: colors.accent.DEFAULT }} />
              </div>
              <div>
                <div className={styles.oobeTitle}>重新运行引导向导</div>
                <div className={styles.oobeDescription}>
                  选择新的技能模板，重置你的成长路径
                </div>
              </div>
            </div>
            <ChevronRight24Regular style={{ color: colors.text.tertiary }} />
          </div>
        </div>

        {/* 数据统计 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Database24Regular style={{ color: colors.accent.DEFAULT }} />
            </div>
            <span className={styles.sectionTitle}>数据概览</span>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.totalSkills}</div>
              <div className={styles.statLabel}>技能</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.totalEvents}</div>
              <div className={styles.statLabel}>事件</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.totalAchievements}</div>
              <div className={styles.statLabel}>成就</div>
            </div>
          </div>
        </div>

        {/* 外观设置 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <PaintBrush24Regular style={{ color: colors.accent.DEFAULT }} />
            </div>
            <span className={styles.sectionTitle}>外观</span>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <SettingItem 
                label="深色模式" 
                description="使用深色主题保护眼睛"
              >
                <Switch 
                  checked={settings.darkMode} 
                  onChange={() => handleToggle('darkMode')} 
                />
              </SettingItem>
              
              <SettingItem 
                label="紧凑模式" 
                description="减小间距，显示更多内容"
              >
                <Switch 
                  checked={settings.compactMode} 
                  onChange={() => handleToggle('compactMode')} 
                />
              </SettingItem>
              
              <SettingItem 
                label="音效" 
                description="启用操作音效反馈"
              >
                <Switch 
                  checked={settings.soundEffects} 
                  onChange={() => handleToggle('soundEffects')} 
                />
              </SettingItem>
            </div>
          </div>
        </div>

        {/* 通知设置 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Bell24Regular style={{ color: colors.accent.DEFAULT }} />
            </div>
            <span className={styles.sectionTitle}>通知</span>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <SettingItem 
                label="启用通知" 
                description="接收成就解锁和提醒通知"
              >
                <Switch 
                  checked={settings.notifications} 
                  onChange={() => handleToggle('notifications')} 
                />
              </SettingItem>
              
              <SettingItem 
                label="AI 建议" 
                description="接收 AI 智能成长建议"
              >
                <Switch 
                  checked={settings.aiSuggestions} 
                  onChange={() => handleToggle('aiSuggestions')} 
                />
              </SettingItem>
            </div>
          </div>
        </div>

        {/* 数据管理 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Database24Regular style={{ color: colors.accent.DEFAULT }} />
            </div>
            <span className={styles.sectionTitle}>数据管理</span>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <SettingItem 
                label="自动保存" 
                description="自动保存数据到本地"
              >
                <Switch 
                  checked={settings.autoSave} 
                  onChange={() => handleToggle('autoSave')} 
                />
              </SettingItem>
              
              <SettingItem 
                label="云同步" 
                description="同步数据到云端（即将推出）"
              >
                <Switch 
                  checked={settings.dataSync} 
                  onChange={() => handleToggle('dataSync')}
                  disabled
                />
              </SettingItem>
              
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <span className={styles.settingLabel}>导出数据</span>
                  <span className={styles.settingDescription}>将所有数据导出为 JSON 文件</span>
                </div>
                <Button appearance="secondary" size="small">
                  导出
                </Button>
              </div>
              
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <span className={styles.settingLabel}>导入数据</span>
                  <span className={styles.settingDescription}>从 JSON 文件恢复数据</span>
                </div>
                <Button appearance="secondary" size="small">
                  导入
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 危险区域 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ backgroundColor: 'rgba(255, 122, 122, 0.1)', borderColor: 'rgba(255, 122, 122, 0.2)' }}>
              <Warning24Regular style={{ color: '#ff7a7a' }} />
            </div>
            <span className={styles.sectionTitle} style={{ color: '#ff7a7a' }}>危险区域</span>
          </div>
          
          <div className={styles.dangerZone}>
            <div className={styles.dangerTitle}>
              <Warning24Regular />
              不可逆操作
            </div>
            <Text size={200} style={{ color: colors.text.tertiary, marginBottom: spacing.lg }}>
              以下操作将永久删除你的数据，请谨慎操作
            </Text>
            
            <div style={{ display: 'flex', gap: spacing.md }}>
              <Button 
                appearance="secondary"
                icon={<Delete24Regular />}
                onClick={() => setShowClearDialog(true)}
              >
                清空所有数据
              </Button>
              <Button 
                appearance="secondary"
                icon={<ArrowReset24Regular />}
                onClick={() => setShowResetDialog(true)}
              >
                恢复默认设置
              </Button>
            </div>
          </div>
        </div>

        {/* 关于 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Info24Regular style={{ color: colors.accent.DEFAULT }} />
            </div>
            <span className={styles.sectionTitle}>关于</span>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <span className={styles.settingLabel}>版本</span>
                  <span className={styles.settingDescription}>HoloScroll v1.0.0</span>
                </div>
                <Badge appearance="outline" color="brand">最新</Badge>
              </div>
              
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <span className={styles.settingLabel}>存储使用</span>
                  <span className={styles.settingDescription}>{stats.storageUsed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OOBE 向导 */}
      <OOBEWizard 
        isOpen={showOOBE} 
        onClose={() => setShowOOBE(false)} 
        isReopen={true}
      />

      {/* 重置确认对话框 */}
      <Dialog open={showResetDialog} onOpenChange={(e, data) => setShowResetDialog(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>恢复默认设置？</DialogTitle>
            <DialogContent>
              这将重置所有设置到默认值，但不会删除你的技能、事件和成就数据。
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setShowResetDialog(false)}>
                取消
              </Button>
              <Button appearance="primary" onClick={() => { setShowResetDialog(false); }}>
                确认重置
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* 清空数据确认对话框 */}
      <Dialog open={showClearDialog} onOpenChange={(e, data) => setShowClearDialog(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle style={{ color: '#ff7a7a' }}>⚠️ 清空所有数据？</DialogTitle>
            <DialogContent>
              <p>此操作将永久删除以下内容：</p>
              <ul style={{ marginTop: '12px', paddingLeft: '20px', color: colors.text.secondary }}>
                <li>所有技能记录</li>
                <li>所有时间轴事件</li>
                <li>所有成就进度</li>
                <li>所有设置</li>
              </ul>
              <p style={{ marginTop: '16px', color: '#ff7a7a' }}>
                此操作不可逆，请确保已备份重要数据。
              </p>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setShowClearDialog(false)}>
                取消
              </Button>
              <Button 
                appearance="primary" 
                style={{ backgroundColor: '#ff7a7a' }}
                onClick={handleResetData}
              >
                确认删除
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}

export default SettingsPage;
