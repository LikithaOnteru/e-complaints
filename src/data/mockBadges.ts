import { Badge } from '../types';

export const MOCK_BADGES: Badge[] = [
  {
    id: 'b1',
    title: 'First Step',
    description: 'Submitted your first grievance report',
    iconName: 'Award',
    unlocked: true,
    unlockedAt: '2026-06-15',
  },
  {
    id: 'b2',
    title: 'Active Citizen',
    description: 'Submitted 3 or more complaints to improve the village',
    iconName: 'ShieldCheck',
    unlocked: true,
    unlockedAt: '2026-07-02',
  },
  {
    id: 'b3',
    title: 'Community Helper',
    description: 'Helped resolve a public issue with photo evidence',
    iconName: 'Users',
    unlocked: true,
    unlockedAt: '2026-07-20',
  },
  {
    id: 'b4',
    title: 'Eco Guardian',
    description: 'Reported sanitation or garbage issues prompt resolution',
    iconName: 'Leaf',
    unlocked: true,
    unlockedAt: '2026-07-28',
  },
  {
    id: 'b5',
    title: '5-Star Reviewer',
    description: 'Provided constructive feedback after grievance resolution',
    iconName: 'Star',
    unlocked: false,
  },
  {
    id: 'b6',
    title: 'Village Sentinel',
    description: 'Submitted 10 complaints that achieved 100% resolution',
    iconName: 'Crown',
    unlocked: false,
  },
];
