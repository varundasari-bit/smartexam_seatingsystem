/**
 * Smart Exam Seating System - Main Application Entry Point
 * 
 * Keywords: exam-seating, seating-allocation, round-robin, offline, standalone
 * Responsibility: Application initialization and module coordination
 */

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadSidebarState();
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    updateDashboard();
    renderRooms();
    renderRanges();
    renderExams();
    setupNavigationListeners();
    setupEventListeners();
    // Ensure dashboard is shown on load
    showPage('dashboard');
}

/**
 * Setup additional event listeners
 */
function setupEventListeners() {
    // Range strength auto-update
    document.getElementById('rangeStart')?.addEventListener('input', updateRangeStrength);
    document.getElementById('rangeEnd')?.addEventListener('input', updateRangeStrength);
}
