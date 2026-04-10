import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'creative' | 'academic' | 'social' | 'physical' | 'mindset';
  level: number;
  maxLevel: number;
  prerequisites: string[];
  unlockedAt: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  content: string;
  category: 'milestone' | 'achievement' | 'learning' | 'note' | 'practice';
  date: string;
  tags: string[];
  attachments?: { type: 'image' | 'link'; url: string; name?: string }[];
  createdAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string | null;
  progress: number;
  maxProgress: number;
  icon?: string;
}

export class HoloScrollDB extends Dexie {
  skills!: Table<Skill>;
  timelineEvents!: Table<TimelineEvent>;
  achievements!: Table<Achievement>;

  constructor() {
    super('HoloScrollDB');
    this.version(1).stores({
      skills: 'id, name, category, level, updatedAt',
      timelineEvents: 'id, date, category, createdAt',
      achievements: 'id, rarity, unlockedAt, progress',
    });
  }
}

export const db = new HoloScrollDB();

// 示例技能数据
export const sampleSkills: Skill[] = [
  { id: '1', name: '编程基础', description: '掌握基本编程概念，包括变量、循环、条件语句等核心知识', category: 'technical', level: 3, maxLevel: 5, prerequisites: [], unlockedAt: '2024-01-15', createdAt: Date.now() - 10000000, updatedAt: Date.now() },
  { id: '2', name: 'React 开发', description: '熟练使用 React 进行前端开发，掌握 Hooks、组件设计等', category: 'technical', level: 2, maxLevel: 5, prerequisites: ['1'], unlockedAt: '2024-02-20', createdAt: Date.now() - 9000000, updatedAt: Date.now() },
  { id: '3', name: 'TypeScript', description: '使用 TypeScript 进行类型安全的代码编写', category: 'technical', level: 2, maxLevel: 4, prerequisites: ['1'], unlockedAt: '2024-03-01', createdAt: Date.now() - 8000000, updatedAt: Date.now() },
  { id: '4', name: 'UI/UX 设计', description: '理解用户界面和用户体验设计原则', category: 'creative', level: 1, maxLevel: 5, prerequisites: [], unlockedAt: null, createdAt: Date.now() - 7000000, updatedAt: Date.now() },
  { id: '5', name: '数据分析', description: '使用数据分析工具和方法提取洞察', category: 'academic', level: 2, maxLevel: 5, prerequisites: [], unlockedAt: '2024-02-01', createdAt: Date.now() - 6000000, updatedAt: Date.now() },
  { id: '6', name: '公开演讲', description: '在公众面前自信地表达和演讲', category: 'social', level: 1, maxLevel: 4, prerequisites: [], unlockedAt: null, createdAt: Date.now() - 5000000, updatedAt: Date.now() },
  { id: '7', name: '跑步', description: '保持规律的跑步习惯，提升体能', category: 'physical', level: 3, maxLevel: 5, prerequisites: [], unlockedAt: '2024-01-01', createdAt: Date.now() - 4000000, updatedAt: Date.now() },
  { id: '8', name: '冥想', description: '通过冥想练习提升专注力和心理健康', category: 'mindset', level: 2, maxLevel: 5, prerequisites: [], unlockedAt: '2024-03-15', createdAt: Date.now() - 3000000, updatedAt: Date.now() },
];

// 示例时间线数据
export const sampleTimelineEvents: TimelineEvent[] = [
  { id: '1', title: '开始学习 React', content: '今天开始了 React 的学习之旅，感觉组件化的思想很强大', category: 'learning', date: '2024-01-10', tags: ['React', '前端'], createdAt: Date.now() - 9000000 },
  { id: '2', title: '完成第一个项目', content: '完成了我的第一个 React 项目，虽然简单但是很有成就感', category: 'milestone', date: '2024-02-15', tags: ['项目', 'React'], createdAt: Date.now() - 8000000 },
  { id: '3', title: '跑步 5 公里', content: '今天第一次跑完 5 公里，体能有所提升', category: 'practice', date: '2024-03-01', tags: ['跑步', '运动'], createdAt: Date.now() - 7000000 },
  { id: '4', title: '获得前端认证', content: '通过了前端开发认证考试', category: 'achievement', date: '2024-03-20', tags: ['认证', '前端'], createdAt: Date.now() - 6000000 },
  { id: '5', title: '学习心得', content: '持续学习比单次高强度学习更有效', category: 'note', date: '2024-04-01', tags: ['学习', '心得'], createdAt: Date.now() - 5000000 },
];

// 示例成就数据
export const sampleAchievements = [
  { id: '1', title: '初次启程', description: '创建第一个技能', rarity: 'common' as const, unlockedAt: '2024-01-15', progress: 1, maxProgress: 1 },
  { id: '2', title: '技能大师', description: '将一个技能升级到满级', rarity: 'rare' as const, unlockedAt: null, progress: 0, maxProgress: 1 },
  { id: '3', title: '博学多才', description: '解锁所有类别的技能', rarity: 'epic' as const, unlockedAt: null, progress: 4, maxProgress: 6 },
  { id: '4', title: '传奇之路', description: '解锁所有技能', rarity: 'legendary' as const, unlockedAt: null, progress: 6, maxProgress: 20 },
  { id: '5', title: '记录者', description: '添加 10 条时间线记录', rarity: 'common' as const, unlockedAt: '2024-03-20', progress: 10, maxProgress: 10 },
];

// 初始化示例数据
export async function initSampleData() {
  const skillCount = await db.skills.count();
  if (skillCount === 0) {
    await db.skills.bulkAdd(sampleSkills);
  }
  
  const eventCount = await db.timelineEvents.count();
  if (eventCount === 0) {
    await db.timelineEvents.bulkAdd(sampleTimelineEvents);
  }
  
  const achievementCount = await db.achievements.count();
  if (achievementCount === 0) {
    await db.achievements.bulkAdd(sampleAchievements);
  }
}
