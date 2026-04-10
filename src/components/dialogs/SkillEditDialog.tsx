import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions,
  Button,
  Input,
  Textarea,
  Dropdown,
  Option,
  Label,
  Slider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Dismiss20Regular } from '@fluentui/react-icons';
import { colors, spacing } from '../../styles/design-system';
import type { Skill } from '../../stores/database';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  row: {
    display: 'flex',
    gap: spacing.md,
  },
  prereqList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});

interface SkillEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: Skill | null;
  allSkills: Skill[];
  onSave: (skill: Partial<Skill>) => void;
}

const CATEGORIES = [
  { value: 'technical', label: '技术', color: colors.skill.technical },
  { value: 'creative', label: '创意', color: colors.skill.creative },
  { value: 'academic', label: '学术', color: colors.skill.academic },
  { value: 'social', label: '社交', color: colors.skill.social },
  { value: 'physical', label: '身体', color: colors.skill.physical },
  { value: 'mindset', label: '思维', color: colors.skill.mindset },
];

export function SkillEditDialog({
  open,
  onOpenChange,
  skill,
  allSkills,
  onSave,
}: SkillEditDialogProps) {
  const styles = useStyles();
  const isEditing = !!skill;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'technical' as Skill['category'],
    level: 1,
    maxLevel: 5,
    prerequisites: [] as string[],
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        description: skill.description,
        category: skill.category,
        level: skill.level,
        maxLevel: skill.maxLevel,
        prerequisites: skill.prerequisites || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'technical',
        level: 1,
        maxLevel: 5,
        prerequisites: [],
      });
    }
  }, [skill, open]);

  const handleSave = () => {
    onSave({
      ...formData,
      unlockedAt: skill?.unlockedAt || new Date().toISOString().split('T')[0],
    });
    onOpenChange(false);
  };

  const togglePrerequisite = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.includes(skillId)
        ? prev.prerequisites.filter((id) => id !== skillId)
        : [...prev.prerequisites, skillId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{isEditing ? '编辑技能' : '新建技能'}</DialogTitle>
          
          <div className={styles.form}>
            <div className={styles.field}>
              <Label>技能名称</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入技能名称"
              />
            </div>

            <div className={styles.field}>
              <Label>描述</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="描述这个技能..."
                rows={3}
              />
            </div>

            <div className={styles.field}>
              <Label>分类</Label>
              <Dropdown
                value={formData.category}
                onOptionSelect={(_, data) =>
                  setFormData({ ...formData, category: data.optionValue as Skill['category'] })
                }
              >
                {CATEGORIES.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    <span style={{ color: cat.color }}>●</span> {cat.label}
                  </Option>
                ))}
              </Dropdown>
            </div>

            <div className={styles.row}>
              <div className={styles.field} style={{ flex: 1 }}>
                <Label>当前等级: {formData.level}</Label>
                <Slider
                  min={1}
                  max={formData.maxLevel}
                  value={formData.level}
                  onChange={(_, data) => setFormData({ ...formData, level: data.value })}
                />
              </div>
              <div className={styles.field} style={{ flex: 1 }}>
                <Label>最大等级: {formData.maxLevel}</Label>
                <Slider
                  min={1}
                  max={10}
                  value={formData.maxLevel}
                  onChange={(_, data) => setFormData({ ...formData, maxLevel: data.value })}
                />
              </div>
            </div>

            <div className={styles.field}>
              <Label>前置技能</Label>
              <div className={styles.prereqList}>
                {allSkills
                  .filter((s) => s.id !== skill?.id)
                  .map((s) => (
                    <Button
                      key={s.id}
                      size="small"
                      appearance={formData.prerequisites.includes(s.id) ? 'primary' : 'outline'}
                      onClick={() => togglePrerequisite(s.id)}
                    >
                      {s.name}
                    </Button>
                  ))}
              </div>
            </div>
          </div>

          <DialogActions>
            <Button appearance="secondary" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button appearance="primary" onClick={handleSave} disabled={!formData.name}>
              保存
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
