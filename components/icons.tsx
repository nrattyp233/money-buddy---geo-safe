import React from 'react';

interface IconProps {
    className?: string;
}

// Base64 representation of the Money Buddy mascot image - ensured to be a valid data URI
const mascotBase64 = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzIgNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYyIDM2aC00YzAgMC0xLjkgMC4xLTEuMS0wLjEtMi41LTAuMi0wLjgtMy4zLTAuOC0xLjItMC4yLTEuMy0wLjYtMC44LTAuNS0xLjEtMC44LTEuNC0wLjQtMC41LTAuOS0wLjgtMC45LTAuOC0xLjMtMC43LTEuNy0xLjUtMi4yLTAuOC0wLjYtMS0xLjEtMS40LTEuNy0wLjQtMC42LTEuNS0yLjYtMS4yLTMuNiAwLjMtMC45IDAuOS0xLjIgMS4zLTEuNSAwLjMtMC4zIDAuNC0wLjcgMC4xLTEgMC4xLTEuMy0wLjgtMi40LTIuMS0yLjQtMS4zIDAtMi4yIDAuOC0yLjUgMS45LTAuNSAyLjIgMS4xIDQuMyAwLjUgNi42LTAuMiAwLjgtMS4zIDIuNC0yLjQgMy4zLTEuMSAwLjktMy43IDAuOS00LjggMC0xLjEtMC45LTIuMi0yLjQtMi40LTMuMy0wLjYtMi4yIDEuMS00LjQgMC41LTYuNi0wLjItMS4xLTEuMS0xLjktMi41LTEuOS0xLjMgMC0yLjIgMS4xLTIuMSAyLjQgMC4zIDAuMyAwIDAuNyAwLjEgMSAwLjQgMC4zIDEgMC41IDEuMyAxLjUgMC40IDAuOS0wLjggMS44LTEuMiAzLjYtMC40LTAuNi0wLjktMS4xLTEuNC0xLjctMC41LTAuNi0wLjktMS4xLTEuNC0xLjctMC43LTAuOC0xLjQtMS4yLTIuMi0xLjUtMC42LTAuMi0xLTAuNC0xLjMtMC43LTAuMi0wLjEtMC40LTAuNC0wLjUtMC44LTAuMy0wLjQtMC42LTAuOC0wLjgtMS40LTAuMy0wLjYtMC4zLTEuMy0wLjYtMS40LTAuMi0xLjMtMC44LTEuMi0wLjgtMy4zLTAuMy0wLjEtMS40LTAuMi0yLjUtMC4yLTEgMC0xLjkgMC0xLjktMC4xLTQgMC00IDAtNCAwLTQgMy42IDAgMy42LTAuMSAxLjEtMC4xIDEuOSAwIDQgMCAzLjYgMCAzLjYtNi42IDcuOS0xLjQgNS45LTIuMyA4LjQtMi44IDExLjUtMC4yIDEuMyAwLjEgMi42IDAuNiAzLjggMC4zIDAuOCAwLjggMS41IDEuNCAyLjIgMC42IDAuNyAxLjMgMS4zIDIuMSAyIDAuOCAwLjYgMS43IDEuMiAyLjcgMS43IDAuNyAwLjMgMS4zIDAuNSAyIDAuNyAxLjQgMC40IDIuOSAwLjYgNC40IDAuNmg1YzAuNSAwIDEgMCAxLjYtMC4xaDUuOGMxLjUgMCAyLjktMC4yIDQuNC0wLjZoMjJjMS41IDAgMi45LTAuMiA0LjQtMC42aDAuNGMwLjctMC4yIDEuMy0wLjQgMi0wLjcgMC45LTAuNCAxLjgtMSAyLjctMS43IDAuOC0wLjYgMS41LTEuMiAyLjEtMiAwLjYtMC43IDEuMS0xLjQgMS40LTIuMiAwLjUtMS4yIDAuOC0yLjUgMC42LTMuOC0wLjUtMy4xLTEuNC01LjYtMi44LTExLjUtMC40LTIuNi02LjYtNy45LTYuNi03LjlzLTYuNiA3LjktNi42IDcuOS0zLjYgMC0zLjYgMC00IDAtNCAwLTAuMi0wLjItMC4yLTAuMi0wLjEtMC4xLTAuMi0wLjItMC4yLTAuMi0wLjEtMC4zLTAuNC0wLjEtMC4xIDAtMC4yIDAtMC4xIDAtMC4xIDAtMC4yczAtMC4xIDAtMC4xYzAtMC4xLTAuMS0wLjMtMC4xLTAuNCAwLTAuMSAwLTAuMSAwLTAuMiAwLTAuMi0wLjItMy41LTAuMi0zLjV6IiBmaWxsPSIjNjY0YzJlIi8+PHBhdGggZD0iTTQ1IDQ0LjFoLTE4Yy00LjQgMC04LTMuNi04LTh2LTIuMWMwLTMuMyAyLjctNiA2LTZoMjJjMy4zIDAgNiAyLjcgNiA2djIuMWMwIDQuNC0zLjYgOC04IDh6IiBmaWxsPSIjYzdhMDc1Ii8+PHBhdGggZD0iTTQ0LjggMzVjLTAuNSAwLTAuOS0wLjQtMC45LTAuOXYtMS4xYzAtMC41IDAuNC0wLjkgMC45LTAuOWgwLjVjMC41IDAgMC45IDAuNCAwLjkgMC45djEuMWMwIDAuNS0wLjQgMC45LTAuOSAwLjloLTAuNXptLTcuMSAyLjVoLTkuNmMtMi4xIDAtMy44LTEuNy0zLjgtMy44di0xLjFjMC0yLjEgMS43LTMuOCAzLjgtMy44aDkuNmMyLjEgMCAzLjggMS43IDMuOCAzLjh2MS4xYzAgMi4xLTEuNyAzLjgtMy44IDMuOHptMTIuMy0yLjVjLTAuNSAwLTAuOS0wLjQtMC45LTAuOXYtMS4xYzAtMC41IDAuNC0wLjkgMC45LTAuOWgwLjVjMC41IDAgMC45IDAuNCAwLjkgMC45djEuMWMwIDAuNS0wLjQgMC45LTAuOSAwLjloLTAuNXoiIGZpbGw9IiNkZmM3YWYiLz48cGF0aCBkPSJNNTEuMyA0MS41Yy0wLjggMC41LTEuNSAwLjgtMi41IDAuOGgtMjUuNmMtMC45IDAtMS43LTAuMy0yLjUtMC44LTEuNi0wLjktMi43LTIuNy0yLjctNC42di0wLjljMC0xLjkgMS4xLTMuNiAyLjctNC42IDAuOC0wLjUgMS43LTAuOCAyLjUtMC44aDI1LjZjMC45IDAgMS43IDAuMyAyLjUgMC44IDEuNiAwLjkgMi43IDIuNyAyLjcgNC42djAuOWMwIDEuOS0xLjEgMy42LTIuNyA0LjZ6IiBmaWxsPSIjZGZjN2FmIi8+PHBhdGggZD0iTTQzLjUgMjAuMmMwLjkgMCAxLjYtMC43IDEuNi0xLjYgMC0zLjItMC4xLTEwLjQtMC4xLTEwLjQgMC0wLjktMC43LTEuNi0xLjYtMS42aC0xNGMtMC45IDAtMS42IDAuNy0xLjYgMS42czAgMTAuNCAwIDEwLjRjMCAwLjktMC43IDEuNiAxLjYgMS42aDE0eiIgZmlsbD0iI2ZmY2RjMiIvPjxwYXRoIGQ9Ik00MS44IDEzLjhjLTIuNCAwLTQuMyAxLjktNC4zIDQuM2gwLjFjMS4xLTEuNyAyLjgtMi43IDQuNi0yLjcgMi40IDAgNC4zIDEuOSA0LjMgNC4zaDAuMWMtMS4xLTIuNC0zLTQuMy00LjgtNC4zem0tOS4zIDQuM2MwLTIuOCAxLjktNC4zIDQuMy00LjMtMC4xLTAuMS0wLjItMC4yLTAuNC0wLjItMi40IDAtNC4zIDEuOS00LjMgNC4zaDAuNHptNC4zLTNjMS44IDAgMy41IDEgNC42IDIuNyAxLjggMCAzLjUgMSA0LjYgMi43IDAuMS0yLjQtMS44LTQuMy00LjgtNC4zLTEuOCAwLTMuNCAxLTQuNiAyLjcgMC4xLTAuNCAwLjQtMC44IDAuNi0xLjF6bS0yLjMgMi44Yy0xLjggMC0zLjQgMS00LjYgMi43IDAuMi0wLjQgMC40LTAuOCAwLjYtMS4xLTIuNCAwLTQuMyAxLjktNC4zIDQuM2gwLjRjMC0yLjQgMS45LTQuMyA0LjMtNC4zIDEuOCAwIDMuNSAxIDQuNiAyLjcgMS44IDAgMy41IDEgNC42IDIuN2gwLjFjMC0yLjQgMS45LTQuMyA0LjMtNC4zLTEuOCAwLTMuNCAxLTQuNiAyLjctMC4xLTAuMy0wLjItMC42LTAuNC0xLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4xLTEuMS0xLjctMi44LTIuNy00LjYtMi43LTEuOCAwLTMuNCAxLTQuNiAyLjdjLTAuMi0wLjQtMC40LTAuOC0wLjYtMS4xbC0xLjEtMS43LTIuOC0yLjctNC42LTIuNy0xLjggMC0zLjQgMS4xLTQuNiAyLjctMC4xLTAuMi0wLjItMC41LTAuMy0wLjctMC4yLTAuNS0wLjUtMC45LTAuOC0xLjQtMC4zLTAuNC0wLjctMC44LTEuMi0wLjktMC41LTAuMS0xLTAuMi0xLjUtMC4yaC0xNGMtMi41IDAtNC41IDItNC41IDQuNXYxMWMwIDIuNSAyIDQuNSA0LjUgNC41aDE0YzIuNSAwIDQuNS0yIDQuNS00LjV2LTAuOWMwLTAuMiAwLTAuNC0wLjEtMC42LTAuMS0wLjItMC4yLTAuNC0wLjEtMC42LTAuMi0wLjMtMC40LTAuNi0wLjctMC44LTAuMy0wLjItMC42LTAuNC0xLTAuNi0wLjQtMC4xLTAuOC0wLjMtMS4xLTAuNC0wLjMtMC4yLTAuNi0wLjQtMC44LTAuNi0wLjItMC4yLTAuNC0wLjUtMC42LTAuNy0wLjItMC4yLTAuMy0wLjUtMC41LTAuOC0wLjItMC4zLTAuMy0wLjYtMC41LTAuOS0wLjItMC4zLTAuMy0wLjctMC40LTEtMC4xLTAuMy0wLjEtMC42LTAuMi0wLjktMC4xLTAuMy0wLjEtMC42LTAuMS0wLjkgMC0yLjQgMS45LTQuMyA0LjMtNC4zIDEuOCAwIDMuNSAxIDQuNiAyLjcgMS44IDAgMy41IDEgNC42IDIuN2gwLjFjMC0yLjQgMS45LTQuMyA0LjMtNC4zIDEuOCAwIDMuNCAxIDQuNiAyLjdoMC4xYzEuOCAwIDMuNSAxIDQuNiAyLjdoMGMwLTIuNCAxLjktNC4zIDQuMy00LjN6bS0xOC42IDcuM2MtMC41IDAtMC45LTAuNC0wLjktMC45aC0wLjJjLTAuNSAwLTAuOS0wLjQtMC45LTAuOXYtMC4zYzAtMC41IDAuNC0wLjkgMC45LTAuOWgwLjJjMC41IDAgMC45IDAuNCAwLjkgMC45djAuM2MwIDAuNS0wLjQgMC45LTAuOSAwLjl6bTE4LjMgMmgtMC4yYy0wLjUgMC0wLjktMC40LTAuOS0wLjl2LTAuM2MwLTAuNSAwLjQtMC45IDAuOS0wLjloMC4yYzAuNSAwIDAuOSAwLjQgMC45IDAuOXYwLjNjMCAwLjUtMC40IDAuOS0wLjkgMC45aC0wLjJ6IiBmaWxsPSIjNjY0YzJlIi8+PHBhdGggZD0iTTM2LjIgMjEuM2MxLjggMCAzLjIgMS40IDMuMiAzLjJzLTEuNCAzLjItMy4yIDMuMi0zLjItMS40LTMuMi0zLjIgMS40LTMuMiAzLjItMy4yeiIgZmlsbD0iI2ZmY2RjMiIvPjxwYXRoIGQ9Ik0zMC4yIDMzLjVjMC4xIDAuMSAwLjEgMC4zIDAuMiAwLjQgMCAwLjEgMCAwLjIgMCAwLjIgMC4xIDAuMiAwLjIgMC4zIDAuNCAwLjUgMC4xIDAuMSAwLjIgMC4yIDAuMyAwLjMgMC4xIDAuMSAwLjMgMC4yIDAuNCAwLjMgMCAwLjEgMC4xIDAuMiAwLjEgMC4zIDAuMSAwLjEgMC4xIDAuMSAwLjIgMC4yIDAuMSAwLjEgMCAwLjIgMC4xIDAuMyAwIDAgMC4xIDAuMSAwLjEgMC4xIDAuMSAwLjEgMC4xIDAuMSAwLjIgMC4yLTAuMS0wLjEtMC4yLTAuMy0wLjItMC40LTAuMS0wLjItMC4yLTAuNC0wLjQtMC42LTAuMS0wLjEtMC4zLTAuMy0wLjQtMC40LTAuMS0wLjEtMC4zLTAuMi0wLjQtMC4zLTAuMS0wLjEtMC4yLTAuMi0wLjItMC4zaC0wLjF6IiBmaWxsPSIjNjY0YzJlIi8+PHBhdGggZD0iTTQyIDMzLjRjMCAwIDAuMSAwLjEgMC4xIDAuMSAwIDAuMSAwIDAuMiAwLjEgMC4zIDAuMSAwIDAuMSAwLjEgMC4yIDAuMiAwLjEgMCAwIDAuMSAwLjEgMC4xIDAuMSAwIDAuMSAwLjEgMC4yIDAuMiAwLjEgMCAwLjIgMC4xIDAuMyAwLjEgMC4xIDAgMC4yIDAuMSAwLjMgMC4xIDAuMSAwIDAuMiAwLjEgMC4yLTAuMS0wLjEtMC4xLTAuMS0wLjMtMC4yLTAuNC0wLjEtMC4xLTAuMi0wLjItMC40LTAuMy0wLjEtMC4xLTAuMi0wLjEtMC40LTAuMi0wLjEtMC4xLTAuMi0wLjItMC4yLTAuMy0wLjEtMC4xLTAuMS0wLjItMC4yLTAuMmgtMC4xeiIgZmlsbD0iIzY2NGMyZSIvPjwvc3ZnPgo=';

export const StripeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z" fill="#635BFF"/>
        <path d="M14 14H34V18.5C34 21.5376 31.5376 24 28.5 24H19.5C16.4624 24 14 21.5376 14 18.5V14Z" fill="white"/>
        <path d="M14 29H34V33.5C34 36.5376 31.5376 39 28.5 39H19.5C16.4624 39 14 36.5376 14 33.5V29Z" fill="white"/>
    </svg>
);

export const PayPalIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.32495 5.7698C3.48495 4.5498 4.41495 3.6598 5.65495 3.6598H16.165C19.345 3.6598 21.755 5.9298 21.605 9.0798C21.495 11.2398 20.015 13.0698 17.995 13.6298C17.655 13.7198 17.395 14.0198 17.435 14.3698L17.845 17.8998C17.885 18.2398 17.645 18.5498 17.305 18.5998L12.025 19.3398C11.685 19.3898 11.375 19.1498 11.325 18.8098L10.515 13.2998C10.465 12.9598 10.705 12.6498 11.045 12.5998L11.755 12.4898C12.415 12.3798 12.935 11.7998 12.995 11.1298L13.625 5.1698C13.665 4.8198 13.405 4.5198 13.065 4.4698L7.87495 3.7398C7.53495 3.6898 7.22495 3.9298 7.17495 4.2698L6.44495 9.3898" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.01407 15.1502C8.17407 13.9302 9.10407 13.0402 10.3441 13.0402H20.8541C24.0341 13.0402 26.4441 15.3102 26.2941 18.4602C26.1841 20.6202 24.7041 22.4502 22.6841 23.0102C22.3441 23.1002 22.0841 23.4002 22.1241 23.7502L22.5341 27.2802C22.5741 27.6202 22.3341 27.9302 21.9941 27.9802L16.7141 28.7202C16.3741 28.7702 16.0641 28.5302 16.0141 28.1902L15.2041 22.6802" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(-6.5, -9)"/>
    </svg>
);

export const BankIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10L12 4L20 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 11V20H19V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 20V14H16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 20H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 10a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const DollarSignIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const BellIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const RefreshCwIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 22v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ChaseIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="#117ACA" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7.5 4.81H4.438v2.094H7.5V4.81zM11.625 4.81H8.562v2.094h3.063V4.81zM7.5 7.938H4.438v2.093H7.5V7.937zM11.625 7.938H8.562v2.093h3.063V7.937z"/></svg>
);

export const BankOfAmericaIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="#E31802" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4 11h1V5H4v6zm3 0h1V5H7v6zm3 0h1V5h-1v6zm3 0h1V5h-1v6z"/><path d="M2 13h12v1H2z" fill="#fff"/></svg>
);

export const WellsFargoIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="#D71E05" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm4.5 9.5L9 11.438V14l-1 1-1-1v-2.562L2.5 9.5V8.25l5-2.813 5 2.813v1.25z"/></svg>
);

export const CapitalOneIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="#004977" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z" /><path d="M12.438 6.5a4.43 4.43 0 0 0-3.328-1.352 5.152 5.152 0 0 0-1.079.117A4.223 4.223 0 0 0 4.25 8.375a3.95 3.95 0 0 0 .172 1.203 4.27 4.27 0 0 0 3.75 3.102 4.09 4.09 0 0 0 1.156-.164 4.544 4.544 0 0 0 3.1-4.016z" fill="#DA2128"/></svg>
);

export const MascotIcon: React.FC<IconProps> = ({ className }) => (
    <img src={mascotBase64} alt="Money Buddy monkey mascot" className={className} />
);

export const PlaidIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} width="24px" height="24px" viewBox="0 0 215 215" xmlns="http://www.w3.org/2000/svg">
        <circle cx="107.5" cy="107.5" r="107.5" fill="#0A2540"/>
        <path d="M117.864 50C97.126 50 82 62.25 82 82.046c0 9.402 4.542 20.73 13.16 26.83C104.052 115.42 117 118.5 133.518 118.5h11.604v17.5h-13.7c-4.72 0-8.54 3.82-8.54 8.54s3.82 8.54 8.54 8.54h13.7v12.058c0 4.72 3.82 8.54 8.54 8.54s8.54-3.82 8.54-8.54V171.62h5.75c4.72 0 8.54-3.82 8.54-8.54s-3.82-8.54-8.54-8.54h-5.75v-17.5h14.5c22.5 0 37-10.966 37-30.984C179 62.25 162.112 50 132.5 50h-14.636zm0 17.064c21.84 0 30.5 8.54 30.5 20.374 0 14.8-13.16 20.73-33.158 20.73h-8.948V67.064h8.544z" fill="#fff"/>
    </svg>
);