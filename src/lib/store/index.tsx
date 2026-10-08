'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  Quest, QuestStep, UserProfile, FocusSession, XPEvent,
  DailyActivity, ProcrastinationEvent, Project, ProofOfWork
} from '@/lib/types';

interface AppState {
  user: UserProfile | null;
  quests: Quest[];
  focusSessions: FocusSession[];
  xpEvents: XPEvent[];
  dailyActivity: DailyActivity[];
  procrastinationEvents: ProcrastinationEvent[];
  projects: Project[];
  proofs: ProofOfWork[];
  isLoaded: boolean;
}

type Action =
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'SET_USER'; payload: UserProfile | null }
  | { type: 'UPDATE_USER'; payload: Partial<UserProfile> }
  | { type: 'SET_QUESTS'; payload: Quest[] }
  | { type: 'ADD_QUEST'; payload: Quest }
  | { type: 'UPDATE_QUEST'; payload: { id: string; updates: Partial<Quest> } }
  | { type: 'DELETE_QUEST'; payload: string }
  | { type: 'ADD_QUEST_STEP'; payload: { questId: string; step: QuestStep } }
  | { type: 'UPDATE_QUEST_STEP'; payload: { questId: string; stepId: string; updates: Partial<QuestStep> } }
  | { type: 'SET_QUEST_STEPS'; payload: { questId: string; steps: QuestStep[] } }
  | { type: 'ADD_FOCUS_SESSION'; payload: FocusSession }
  | { type: 'UPDATE_FOCUS_SESSION'; payload: { id: string; updates: Partial<FocusSession> } }
  | { type: 'ADD_XP_EVENT'; payload: XPEvent }
  | { type: 'ADD_DAILY_ACTIVITY'; payload: DailyActivity }
  | { type: 'UPDATE_DAILY_ACTIVITY'; payload: { date: string; updates: Partial<DailyActivity> } }
  | { type: 'ADD_PROCRASTINATION_EVENT'; payload: ProcrastinationEvent }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'ADD_PROOF'; payload: ProofOfWork }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  quests: [],
  focusSessions: [],
  xpEvents: [],
  dailyActivity: [],
  procrastinationEvents: [],
  projects: [],
  proofs: [],
  isLoaded: false,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload, isLoaded: true };

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'UPDATE_USER':
      if (!state.user) return state;
      return { ...state, user: { ...state.user, ...action.payload } };

    case 'SET_QUESTS':
      return { ...state, quests: action.payload };

    case 'ADD_QUEST':
      return { ...state, quests: [...state.quests, action.payload] };

    case 'UPDATE_QUEST':
      return {
        ...state,
        quests: state.quests.map(q =>
          q.id === action.payload.id ? { ...q, ...action.payload.updates } : q
        ),
      };

    case 'DELETE_QUEST':
      return { ...state, quests: state.quests.filter(q => q.id !== action.payload) };

    case 'ADD_QUEST_STEP': {
      return {
        ...state,
        quests: state.quests.map(q =>
          q.id === action.payload.questId
            ? { ...q, steps: [...q.steps, action.payload.step] }
            : q
        ),
      };
    }

    case 'UPDATE_QUEST_STEP': {
      return {
        ...state,
        quests: state.quests.map(q =>
          q.id === action.payload.questId
            ? {
                ...q,
                steps: q.steps.map(s =>
                  s.id === action.payload.stepId ? { ...s, ...action.payload.updates } : s
                ),
              }
            : q
        ),
      };
    }

    case 'SET_QUEST_STEPS': {
      return {
        ...state,
        quests: state.quests.map(q =>
          q.id === action.payload.questId
            ? { ...q, steps: action.payload.steps }
            : q
        ),
      };
    }

    case 'ADD_FOCUS_SESSION':
      return { ...state, focusSessions: [...state.focusSessions, action.payload] };

    case 'UPDATE_FOCUS_SESSION':
      return {
        ...state,
        focusSessions: state.focusSessions.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
        ),
      };

    case 'ADD_XP_EVENT':
      return { ...state, xpEvents: [...state.xpEvents, action.payload] };

    case 'ADD_DAILY_ACTIVITY':
      return { ...state, dailyActivity: [...state.dailyActivity, action.payload] };

    case 'UPDATE_DAILY_ACTIVITY':
      return {
        ...state,
        dailyActivity: state.dailyActivity.map(d =>
          d.date === action.payload.date ? { ...d, ...action.payload.updates } : d
        ),
      };

    case 'ADD_PROCRASTINATION_EVENT':
      return {
        ...state,
        procrastinationEvents: [...state.procrastinationEvents, action.payload],
      };

    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };

    case 'ADD_PROOF':
      return { ...state, proofs: [...state.proofs, action.payload] };

    case 'LOGOUT':
      return { ...initialState, isLoaded: true };

    default:
      return state;
  }
}

const STORAGE_KEY = 'mainquest_state';

function saveToStorage(state: AppState) {
  try {
    const { isLoaded, ...data } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable
  }
}

function loadFromStorage(): Partial<AppState> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      dispatch({ type: 'LOAD_STATE', payload: stored });
    } else {
      dispatch({ type: 'LOAD_STATE', payload: {} });
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (state.isLoaded) {
      saveToStorage(state);
    }
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useAppStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within StoreProvider');
  }
  return context;
}

export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
