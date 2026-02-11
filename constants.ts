
import { SkillStatus, SkillTreeTemplate } from './types';

export const INITIAL_TEMPLATES: SkillTreeTemplate[] = [
  {
    id: 'frontend-dev',
    name: 'Frontend Architect',
    description: 'Master the art of building modern web interfaces.',
    nodes: [
      {
        id: '1',
        type: 'skill',
        position: { x: 250, y: 0 },
        data: {
          label: 'HTML & CSS Foundations',
          description: 'The backbone of the web. Structure and Style.',
          status: SkillStatus.AVAILABLE,
          xpReward: 100,
          level: 1,
          resources: [
            { id: 'r1', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'article' },
            { id: 'r2', title: 'CSS Diner', url: 'https://flukeout.github.io', type: 'course' }
          ]
        },
      },
      {
        id: '2',
        type: 'skill',
        position: { x: 100, y: 150 },
        data: {
          label: 'JavaScript Basics',
          description: 'Programming logic and DOM manipulation.',
          status: SkillStatus.LOCKED,
          xpReward: 200,
          level: 2,
          resources: []
        },
      },
      {
        id: '3',
        type: 'skill',
        position: { x: 400, y: 150 },
        data: {
          label: 'Modern CSS (Tailwind)',
          description: 'Utility-first CSS frameworks for rapid UI development.',
          status: SkillStatus.LOCKED,
          xpReward: 150,
          level: 2,
          resources: []
        },
      },
      {
        id: '4',
        type: 'skill',
        position: { x: 250, y: 300 },
        data: {
          label: 'React Essentials',
          description: 'Components, Hooks, and State management.',
          status: SkillStatus.LOCKED,
          xpReward: 500,
          level: 3,
          resources: []
        },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e1-3', source: '1', target: '3', animated: true },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-4', source: '3', target: '4' },
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Science Path',
    description: 'From raw data to actionable insights and ML models.',
    nodes: [
      {
        id: 'd1',
        type: 'skill',
        position: { x: 250, y: 0 },
        data: {
          label: 'Python Foundations',
          description: 'The primary language for data analysis.',
          status: SkillStatus.AVAILABLE,
          xpReward: 150,
          level: 1,
          resources: []
        },
      },
      {
        id: 'd2',
        type: 'skill',
        position: { x: 250, y: 150 },
        data: {
          label: 'Statistics & Math',
          description: 'Probability, linear algebra, and calculus.',
          status: SkillStatus.LOCKED,
          xpReward: 300,
          level: 2,
          resources: []
        },
      },
    ],
    edges: [
      { id: 'ed1-2', source: 'd1', target: 'd2' },
    ]
  }
];

export const XP_PER_LEVEL = 1000;
