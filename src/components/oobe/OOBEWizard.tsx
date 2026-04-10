import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Text,
  makeStyles,
  tokens,
  Input,
  Textarea,
  Dropdown,
  Option,
  Card,
  CardHeader,
} from '@fluentui/react-components';
import {
  ArrowRight24Regular,
  ArrowLeft24Regular,
  CheckmarkCircle24Filled,
  Sparkle24Filled,
  Target24Regular,
  Lightbulb24Regular,
  DataPie24Regular,
  Trophy24Regular,
} from '@fluentui/react-icons';
import { useSkillStore } from '../../stores/skillStore';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(20px)',
    zIndex: 10000,
  },
  dialogSurface: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '720px',
    maxWidth: '90vw',
    maxHeight: '85vh',
    zIndex: 10001,
    borderRadius: '24px',
    overflow: 'hidden',
  },
  container: {
    background: `linear-gradient(180deg, 
      rgba(22, 22, 28, 0.98) 0%, 
      rgba(16, 16, 20, 0.99) 100%)`,
    borderRadius: '24px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: `0 25px 80px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(255, 255, 255, 0.03) inset,
                0 0 120px rgba(96, 205, 255, 0.08)`,
  },
  header: {
    padding: '32px 40px 24px',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '20px',
  },
  stepDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    transition: 'all 0.3s ease',
  },
  stepDotActive: {
    backgroundColor: '#60cdff',
    boxShadow: '0 0 12px rgba(96, 205, 255, 0.5)',
    width: '32px',
    borderRadius: '5px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '32px 40px',
  },
  footer: {
    padding: '24px 40px 32px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: '36px',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #ffffff 0%, #60cdff 50%, #85d9ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground3,
    lineHeight: 1.6,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginTop: '28px',
  },
  featureCard: {
    padding: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(96, 205, 255, 0.05)',
      borderColor: 'rgba(96, 205, 255, 0.2)',
      transform: 'translateY(-2px)',
    },
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    backgroundColor: 'rgba(96, 205, 255, 0.1)',
    border: '1px solid rgba(96, 205, 255, 0.2)',
  },
  skillTemplateGrid: {
    display: 'grid',
    gap: '12px',
    marginTop: '24px',
  },
  templateCard: {
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    '&:hover': {
      backgroundColor: 'rgba(96, 205, 255, 0.05)',
      borderColor: 'rgba(96, 205, 255, 0.25)',
    },
  },
  templateSelected: {
    backgroundColor: 'rgba(96, 205, 255, 0.1)',
    borderColor: '#60cdff',
    boxShadow: '0 0 20px rgba(96, 205, 255, 0.15)',
  },
  inputSection: {
    marginTop: '24px',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    marginTop: '8px',
  },
  completeAnimation: {
    width: '120px',
    height: '120px',
    margin: '0 auto 24px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(96, 205, 255, 0.2) 0%, rgba(96, 205, 255, 0.05) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(96, 205, 255, 0.3)',
    boxShadow: '0 0 40px rgba(96, 205, 255, 0.3)',
  },
});

interface OOBEWizardProps {
  isOpen: boolean;
  onClose: () => void;
  isReopen?: boolean;
}

const SKILL_TEMPLATES = [
  {
    id: 'developer',
    title: '全栈开发者之路',
    description: '从编程基础到架构设计的完整技能树',
    skills: ['编程基础', '前端开发', '后端开发', '数据库', '系统设计'],
    color: '#60cdff',
  },
  {
    id: 'designer',
    title: 'UI/UX 设计师',
    description: '设计思维到专业工具的掌握',
    skills: ['设计基础', '色彩理论', 'Figma', '用户体验', '原型设计'],
    color: '#ffaa44',
  },
  {
    id: 'writer',
    title: '创作者之路',
    description: '写作、内容创作与个人品牌建设',
    skills: ['写作基础', '内容策划', 'SEO', '社群运营', '个人品牌'],
    color: '#00d26a',
  },
  {
    id: 'fitness',
    title: '健身达人',
    description: '从运动新手到健康生活专家',
    skills: ['基础体能', '力量训练', '有氧运动', '营养学', '恢复管理'],
    color: '#ff6b6b',
  },
];

function OOBEWizard({ isOpen, onClose, isReopen = false }: OOBEWizardProps) {
  const styles = useStyles();
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userGoal, setUserGoal] = useState('');
  const { addSkill } = useSkillStore();

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setSelectedTemplate(null);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = async () => {
    if (selectedTemplate) {
      const template = SKILL_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        for (const skillName of template.skills) {
          await addSkill({
            name: skillName,
            description: `${template.title} - ${skillName}`,
            category: 'technical',
            level: 1,
            maxLevel: 5,
            prerequisites: [],
            unlockedAt: new Date().toISOString().split('T')[0],
          });
        }
      }
    }
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div style={{ textAlign: 'center' }}>
            <div className={styles.welcomeTitle}>
              {isReopen ? '重新设定你的目标' : '欢迎来到 HoloScroll'}
            </div>
            <div className={styles.subtitle}>
              {isReopen 
                ? '选择一个新的成长路径，开启新的旅程'
                : '你的个人成长宇宙，从这里开始构建'}
            </div>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Target24Regular style={{ fontSize: 24, color: '#60cdff' }} />
                </div>
                <Text weight="semibold" size={400}>技能科技树</Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginTop: 4 }}>
                  可视化的技能发展路径
                </Text>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Lightbulb24Regular style={{ fontSize: 24, color: '#ffaa44' }} />
                </div>
                <Text weight="semibold" size={400}>AI 智能推荐</Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginTop: 4 }}>
                  个性化的成长建议
                </Text>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Chart24Regular style={{ fontSize: 24, color: '#00d26a' }} />
                </div>
                <Text weight="semibold" size={400}>成长时间轴</Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginTop: 4 }}>
                  记录每一步进步
                </Text>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Trophy24Regular style={{ fontSize: 24, color: '#c4a5f7' }} />
                </div>
                <Text weight="semibold" size={400}>成就系统</Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginTop: 4 }}>
                  游戏化的激励体验
                </Text>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div className={styles.welcomeTitle} style={{ fontSize: 28 }}>
                选择一个成长路径
              </div>
              <div className={styles.subtitle}>
                我们会为你创建一个初始的技能科技树
              </div>
            </div>
            <div className={styles.skillTemplateGrid}>
              {SKILL_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className={`${styles.templateCard} ${selectedTemplate === template.id ? styles.templateSelected : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div 
                    style={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 14, 
                      backgroundColor: `${template.color}15`,
                      border: `2px solid ${template.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{template.skills[0][0]}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text weight="semibold" size={400}>{template.title}</Text>
                    <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginTop: 2 }}>
                      {template.description}
                    </Text>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      {template.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i}
                          style={{ 
                            fontSize: 11, 
                            padding: '2px 8px', 
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            borderRadius: 4,
                            color: tokens.colorNeutralForeground3,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <CheckmarkCircle24Filled style={{ color: '#60cdff', fontSize: 24 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div className={styles.welcomeTitle} style={{ fontSize: 28 }}>
                定制你的档案
              </div>
              <div className={styles.subtitle}>
                帮助我们为你提供更个性化的建议
              </div>
            </div>
            <div className={styles.inputSection}>
              <Text weight="semibold">你的名字</Text>
              <Input
                placeholder="如何称呼你？"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={styles.input}
                style={{ marginTop: 8 }}
              />
            </div>
            <div className={styles.inputSection} style={{ marginTop: 20 }}>
              <Text weight="semibold">你的目标</Text>
              <Textarea
                placeholder="描述一下你想达成的目标..."
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                rows={4}
                style={{ 
                  marginTop: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                }}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ textAlign: 'center' }}>
            <div className={styles.completeAnimation}>
              <Sparkle24Filled style={{ fontSize: 48, color: '#60cdff' }} />
            </div>
            <div className={styles.welcomeTitle} style={{ fontSize: 28 }}>
              准备就绪！
            </div>
            <div className={styles.subtitle}>
              你的个人成长宇宙已经构建完成<br />
              开始探索你的技能科技树吧
            </div>
            <div 
              style={{ 
                marginTop: 32, 
                padding: 20, 
                backgroundColor: 'rgba(96, 205, 255, 0.05)',
                borderRadius: 16,
                border: '1px solid rgba(96, 205, 255, 0.15)',
              }}
            >
              <Text weight="semibold" style={{ color: '#60cdff' }}>
                💡 AI 小贴士
              </Text>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginTop: 8 }}>
                每天记录一个小进步，坚持 30 天就能看到显著的变化。<br />
                使用 Ctrl+K 快速访问所有功能。
              </Text>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.dialogSurface}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.stepIndicator}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${styles.stepDot} ${step === i ? styles.stepDotActive : ''}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.content}>
            {renderStep()}
          </div>

          <div className={styles.footer}>
            <Button
              appearance="subtle"
              onClick={step === 0 ? onClose : handleBack}
              disabled={step === 3}
            >
              {step === 0 ? '跳过' : '返回'}
            </Button>
            <Button
              appearance="primary"
              onClick={step === 3 ? handleComplete : handleNext}
              disabled={step === 1 && !selectedTemplate}
              icon={step < 3 ? <ArrowRight24Regular /> : undefined}
            >
              {step === 3 ? '开始探索' : '下一步'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export { OOBEWizard };
