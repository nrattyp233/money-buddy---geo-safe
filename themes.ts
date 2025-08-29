import { Theme } from './types';

export const themes: Theme[] = [
    {
        id: 'default',
        name: 'Default',
        gradient: 'linear-gradient(120deg, #5b21b6, #1d4ed8, #059669, #84cc16)',
        colors: {
            primaryActionBg: '#a3e635', // lime-400
            primaryActionText: '#3f3177', // custom
            highlight: '#a3e635', // lime-400
            highlightSecondary: '#ecfccb',// lime-50
            modalBg: '#1f2937', // gray-800
            modalTitle: '#d9f99d', // lime-200
            tabActiveBg: '#a3e635', // lime-500
            tabActiveText: '#4f46e5', // indigo-600
        },
        panels: {
            balance: { bg: 'rgba(79, 70, 229, 0.4)', border: 'rgba(129, 140, 248, 0.3)', heading: '#c7d2fe' },
            send: { bg: 'rgba(6, 78, 59, 0.4)', border: 'rgba(16, 185, 129, 0.3)', heading: '#6ee7b7' },
            lock: { bg: 'rgba(88, 28, 135, 0.4)', border: 'rgba(168, 85, 247, 0.3)', heading: '#e9d5ff' },
            history: { bg: 'rgba(51, 65, 85, 0.4)', border: 'rgba(100, 116, 139, 0.5)', heading: '#e2e8f0' },
            security: { bg: 'rgba(30, 64, 175, 0.5)', border: 'rgba(96, 165, 250, 0.3)', heading: '#bfdbfe' },
        }
    },
    {
        id: 'sunset',
        name: 'Sunset Glow',
        gradient: 'linear-gradient(120deg, #833ab4, #fd1d1d, #fcb045)',
        colors: {
            primaryActionBg: '#f59e0b', // amber-500
            primaryActionText: '#fee2e2', // red-50
            highlight: '#f59e0b', // amber-500
            highlightSecondary: '#fef3c7', // amber-100
            modalBg: '#262626', // neutral-800
            modalTitle: '#fca5a5', // red-400
            tabActiveBg: '#ef4444', // red-500
            tabActiveText: '#ffffff',
        },
        panels: {
            balance: { bg: 'rgba(107, 33, 168, 0.4)', border: 'rgba(192, 132, 252, 0.3)', heading: '#f3e8ff' },
            send: { bg: 'rgba(190, 18, 60, 0.4)', border: 'rgba(251, 113, 133, 0.3)', heading: '#fecdd3' },
            lock: { bg: 'rgba(180, 83, 9, 0.4)', border: 'rgba(245, 158, 11, 0.3)', heading: '#fef3c7' },
            history: { bg: 'rgba(64, 64, 64, 0.4)', border: 'rgba(115, 115, 115, 0.5)', heading: '#e5e5e5' },
            security: { bg: 'rgba(124, 58, 237, 0.4)', border: 'rgba(167, 139, 250, 0.3)', heading: '#ddd6fe' },
        }
    }
];
