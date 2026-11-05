/**
 * Smart Exam Seating System - Configuration
 * 
 * Keywords: exam-seating, offline, standalone
 * Responsibility: App constants, colors, and configuration settings
 */

// Application Data Store
const AppData = {
    rooms: [],
    ranges: [],
    exams: [],
    seatingData: null,
    isAdmin: false,
    pendingPage: null
};

// Branch Colors for Seating Plan
const BranchColors = {
    'CSE': { bg: '#FF0000', text: '#ffffff' },      // Red
    'ECE': { bg: '#FFA500', text: '#000000' },      // Orange
    'EEE': { bg: '#FFFF00', text: '#000000' },      // Yellow
    'MECH': { bg: '#008000', text: '#ffffff' },     // Green
    'CIVIL': { bg: '#0000FF', text: '#ffffff' },    // Blue
    'IT': { bg: '#4B0082', text: '#ffffff' },       // Indigo
    'AIDS': { bg: '#8F00FF', text: '#ffffff' },     // Violet
    'CIC': { bg: '#FFC0CB', text: '#000000' },      // Pink
    'DEFAULT': { bg: '#6B7280', text: '#ffffff' }   // Gray
};

// Admin Configuration
const ADMIN_CONFIG = {
    password: 'varun',
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppData, BranchColors, ADMIN_CONFIG };
}
