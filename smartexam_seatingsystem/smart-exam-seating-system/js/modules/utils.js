/**
 * Smart Exam Seating System - Utilities
 * 
 * Keywords: exam-seating, offline, standalone
 * Responsibility: Helper functions and utilities used across the application
 */

/**
 * Generate unique ID
 * @returns {string} Random ID string
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**s
 * Get branch color configuration
 * @param {string} branch - Branch name
 * @returns {Object} Color configuration {bg, text}
 */
function getBranchColor(branch) {
    const upperBranch = branch.toUpperCase();
    return BranchColors[upperBranch] || BranchColors['DEFAULT'];
}

/**
 * Get concise roll number (remove prefix)
 * @param {string} rollNumber - Full roll number
 * @param {string} prefix - Roll number prefix
 * @returns {string} Concise roll number
 */
function getConciseRollNumber(rollNumber, prefix) {
    if (rollNumber.startsWith(prefix)) {
        return rollNumber.substring(prefix.length);
    }
    return rollNumber;
}

/**
 * Show alert message
 * @param {string} containerId - Container element ID
 * @param {string} message - Alert message
 * @param {string} type - Alert type: success, error, warning
 */
function showAlert(containerId, message, type) {
    const container = document.getElementById(containerId);
    const alertClass = {
        success: 'alert-success',
        error: 'alert-error',
        warning: 'alert-warning'
    }[type];

    const iconSvg = {
        success: '<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        error: '<svg class="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        warning: '<svg class="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    }[type];

    container.innerHTML = `
        <div class="alert ${alertClass}">
            ${iconSvg}
            <p class="font-medium text-sm">${message}</p>
        </div>
    `;

    if (type === 'success') {
        setTimeout(() => container.innerHTML = '', 4000);
    }
}

/**
 * Format number with leading zero
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Calculate total students from ranges
 * @returns {number} Total student count
 */
function calculateTotalStudents() {
    return AppData.ranges.reduce((acc, r) => 
        acc + (r.endRoll - r.startRoll + 1), 0
    );
}

/**
 * Calculate total capacity from rooms
 * @returns {number} Total room capacity
 */
function calculateTotalCapacity() {
    return AppData.rooms.reduce((acc, r) => acc + r.capacity, 0);
}

/**
 * Get unique blocks from rooms
 * @returns {Array} Array of unique block names
 */
function getUniqueBlocks() {
    return [...new Set(AppData.rooms.map(r => r.blockName))];
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        generateId, 
        getBranchColor, 
        getConciseRollNumber, 
        showAlert,
        formatNumber,
        calculateTotalStudents,
        calculateTotalCapacity,
        getUniqueBlocks
    };
}
