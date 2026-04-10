import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, Skill, initSampleData } from './database';

interface SkillState {
  skills: Skill[];
  initialized: boolean;
  // Actions
  loadSkills: () => Promise<void>;
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  upgradeSkill: (id: string) => Promise<void>;
}

export const useSkillStore = create<SkillState>()(
  persist(
    (set, get) => ({
      skills: [],
      initialized: false,
      
      loadSkills: async () => {
        await initSampleData();
        const skills = await db.skills.toArray();
        set({ skills, initialized: true });
      },
      
      addSkill: async (skillData) => {
        const now = Date.now();
        const skill: Skill = {
          ...skillData,
          id: Date.now().toString(),
          createdAt: now,
          updatedAt: now,
        };
        await db.skills.add(skill);
        set((state) => ({ skills: [...state.skills, skill] }));
      },
      
      updateSkill: async (id, updates) => {
        const updated = { ...updates, updatedAt: Date.now() };
        await db.skills.update(id, updated);
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? { ...s, ...updated } : s)),
        }));
      },
      
      deleteSkill: async (id) => {
        await db.skills.delete(id);
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        }));
      },
      
      upgradeSkill: async (id) => {
        const skill = get().skills.find((s) => s.id === id);
        if (!skill || skill.level >= skill.maxLevel) return;
        const updated = {
          level: skill.level + 1,
          updatedAt: Date.now(),
        };
        await db.skills.update(id, updated);
        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === id ? { ...s, ...updated } : s
          ),
        }));
      },
    }),
    {
      name: 'skill-store',
    }
  )
);
