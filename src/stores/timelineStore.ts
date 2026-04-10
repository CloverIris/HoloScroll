import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, initSampleData } from './database';
import type { TimelineEvent } from './database';

interface TimelineState {
  events: TimelineEvent[];
  initialized: boolean;
  loadEvents: () => Promise<void>;
  addEvent: (event: Omit<TimelineEvent, 'id' | 'createdAt'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<TimelineEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      events: [],
      initialized: false,
      
      loadEvents: async () => {
        await initSampleData();
        const events = await db.timelineEvents.toArray();
        set({ events, initialized: true });
      },
      
      addEvent: async (eventData) => {
        const event: TimelineEvent = {
          ...eventData,
          id: Date.now().toString(),
          createdAt: Date.now(),
        };
        await db.timelineEvents.add(event);
        set((state) => ({ events: [...state.events, event] }));
      },
      
      updateEvent: async (id, updates) => {
        await db.timelineEvents.update(id, updates);
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },
      
      deleteEvent: async (id) => {
        await db.timelineEvents.delete(id);
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },
    }),
    {
      name: 'timeline-store',
    }
  )
);
