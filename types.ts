
export enum SkillStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'book';
}

export interface SkillNodeData {
  label: string;
  description: string;
  status: SkillStatus;
  xpReward: number;
  resources: Resource[];
  level: number;
  icon?: string;
}

export interface SkillTreeTemplate {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
}

export interface UserStats {
  totalXp: number;
  level: number;
  completedSkills: number;
  currentStreak: number;
  skillsInProgress: number;
}
