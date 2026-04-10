import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, initSampleData } from './database';
import type { Achievement } from './database';

interface AchievementState {
  achievements: Achievement[];
  initialized: boolean;
  loadAchievements: () => Promise<void>;
  unlockAchievement: (id: string) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<void>;
  resetAchievements: () => Promise<void>;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: [],
      initialized: false,
      
      loadAchievements: async () => {
        await initSampleData();
        const achievements = await db.achievements.toArray();
        set({ achievements, initialized: true });
      },
      
      unlockAchievement: async (id) => {
        const achievement = get().achievements.find((a) => a.id === id);
        if (!achievement || achievement.unlockedAt) return;
        
        const updates = {
          unlockedAt: new Date().toISOString(),
          progress: achievement.maxProgress,
        };
        await db.achievements.update(id, updates);
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        }));
      },
      
      updateProgress: async (id, progress) => {
        const achievement = get().achievements.find((a) => a.id === id);
        if (!achievement) return;
        
        const newProgress = Math.min(progress, achievement.maxProgress);
        const updates: Partial<Achievement> = { progress: newProgress };
        
        if (newProgress >= achievement.maxProgress && !achievement.unlockedAt) {
          updates.unlockedAt = new Date().toISOString();
        }
        
        await db.achievements.update(id, updates);
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        }));
      },
      
      resetAchievements: async () => {
        await db.achievements.clear();
        set({ achievements: [] });
      },
    }),
    {
      name: 'achievement-store',
    }
  )
);
