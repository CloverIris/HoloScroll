import { useState, useCallback } from 'react';
import {
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  Card,
  CardHeader,
  Button,
  Textarea,
  Avatar,
  Badge,
  Divider,
  Spinner,
  Text,
  Title3,
  Caption1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Sparkle24Filled,
  Sparkle24Regular,
  Dismiss24Regular,
  Send24Regular,
  Lightbulb24Regular,
  Target24Regular,
  Fire24Regular,
} from '@fluentui/react-icons';
import { Acrylic } from './Acrylic';

// 样式定义
const useStyles = makeStyles({
  // 浮动按钮
  fabButton: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #60cdff 0%, #0093f5 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(96, 205, 255, 0.4)',
    transition: 'all 0.2s ease',
    zIndex: 1000,
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(96, 205, 255, 0.5)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
  // Drawer 覆盖层样式
  drawerOverlay: {
    '& .fui-Drawer__surface': {
      width: '380px',
      maxWidth: '90vw',
      backgroundColor: 'transparent',
    },
  },
  // Drawer 内容容器
  drawerContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  // 头部样式
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  // 内容区域
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '20px 24px',
  },
  // 建议卡片
  suggestionCard: {
    marginBottom: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      transform: 'translateX(4px)',
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
  },
  iconContainer: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
  },
  // 底部输入区域
  inputArea: {
    padding: '16px 24px 24px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  inputContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    '& textarea': {
      minHeight: '44px',
      maxHeight: '120px',
    },
  },
  sendButton: {
    flexShrink: 0,
  },
  // 欢迎区域
  welcomeSection: {
    marginBottom: '24px',
  },
  suggestionsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground2,
  },
});

// 建议数据接口
interface Suggestion {
  id: string;
  type: 'progress' | 'reminder' | 'streak';
  content: string;
  icon: typeof Lightbulb24Regular;
  iconColor: string;
  iconBgColor: string;
}

// 静态建议数据
const suggestions: Suggestion[] = [
  {
    id: '1',
    type: 'progress',
    content: '你的技术技能进度良好，建议继续深入学习算法',
    icon: Lightbulb24Regular,
    iconColor: '#60cdff',
    iconBgColor: 'rgba(96, 205, 255, 0.15)',
  },
  {
    id: '2',
    type: 'reminder',
    content: '过去一周没有记录创意类活动，可以尝试新的设计项目',
    icon: Target24Regular,
    iconColor: '#ffaa44',
    iconBgColor: 'rgba(255, 170, 68, 0.15)',
  },
  {
    id: '3',
    type: 'streak',
    content: '保持每日记录的习惯，已连续记录 5 天',
    icon: Fire24Regular,
    iconColor: '#ff6b6b',
    iconBgColor: 'rgba(255, 107, 107, 0.15)',
  },
];

export function AIAssistant() {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 打开/关闭 Drawer
  const toggleDrawer = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 发送消息
  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    // 模拟 AI 响应延迟
    setTimeout(() => {
      setIsLoading(false);
      setInputValue('');
    }, 1500);
  }, [inputValue]);

  // 处理输入框回车
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <>
      {/* 浮动按钮 */}
      <button
        className={styles.fabButton}
        onClick={toggleDrawer}
        aria-label="打开 AI 助手"
      >
        <Sparkle24Filled style={{ color: 'white', fontSize: 24 }} />
      </button>

      {/* Drawer 面板 */}
      <Drawer
        open={isOpen}
        onOpenChange={(_, data) => setIsOpen(data.open)}
        position="end"
        size="medium"
        className={styles.drawerOverlay}
      >
        <Acrylic intensity="heavy" dark className={styles.drawerContent}>
          {/* 头部 */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Avatar
                size={40}
                style={{
                  background: 'linear-gradient(135deg, #60cdff 0%, #0093f5 100%)',
                }}
                icon={<Sparkle24Regular style={{ color: 'white' }} />}
              />
              <div>
                <Title3>AI 助手</Title3>
                <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                  你的成长伙伴
                </Caption1>
              </div>
            </div>
            <Button
              appearance="subtle"
              icon={<Dismiss24Regular />}
              onClick={closeDrawer}
              aria-label="关闭"
            />
          </div>

          {/* 内容区域 */}
          <div className={styles.content}>
            {/* 欢迎区域 */}
            <div className={styles.welcomeSection}>
              <Text style={{ color: tokens.colorNeutralForeground2 }}>
                你好！我是你的 AI 成长助手。我可以为你提供个性化的建议，帮助你更好地规划和记录成长之路。
              </Text>
            </div>

            <Divider />

            {/* 建议列表标题 */}
            <div className={styles.suggestionsTitle}>
              <Lightbulb24Regular style={{ fontSize: 20 }} />
              <Text weight="semibold">为你推荐</Text>
            </div>

            {/* 建议卡片列表 */}
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <Card key={suggestion.id} className={styles.suggestionCard}>
                  <div className={styles.cardHeader}>
                    <div
                      className={styles.iconContainer}
                      style={{
                        backgroundColor: suggestion.iconBgColor,
                      }}
                    >
                      <Icon
                        style={{
                          color: suggestion.iconColor,
                          fontSize: 20,
                        }}
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <Text>{suggestion.content}</Text>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* 加载状态演示 */}
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: 'rgba(96, 205, 255, 0.1)',
                  borderRadius: '12px',
                }}
              >
                <Spinner size="tiny" />
                <Text size={200}>AI 正在思考...</Text>
              </div>
            )}
          </div>

          {/* 底部输入区域 */}
          <div className={styles.inputArea}>
            <div className={styles.inputContainer}>
              <Textarea
                className={styles.textarea}
                placeholder="输入你的问题..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                resize="vertical"
              />
              <Button
                className={styles.sendButton}
                appearance="primary"
                icon={isLoading ? <Spinner size="tiny" /> : <Send24Regular />}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                size="large"
              />
            </div>
            <Caption1
              style={{
                color: tokens.colorNeutralForeground3,
                marginTop: '8px',
                display: 'block',
              }}
            >
              按 Enter 发送，Shift + Enter 换行
            </Caption1>
          </div>
        </Acrylic>
      </Drawer>
    </>
  );
}

export default AIAssistant;
