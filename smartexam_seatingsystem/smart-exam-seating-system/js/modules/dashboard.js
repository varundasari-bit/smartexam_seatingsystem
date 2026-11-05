/**
 * Smart Exam Seating System - Dashboard Module
 * 
 * Keywords: exam-seating, offline, standalone
 * Responsibility: Dashboard statistics and overview display
 */

// ============================================
// Dashboard
// ============================================

/**
 * Update dashboard statistics and displays
 */
function updateDashboard() {
    const totalStudents = calculateTotalStudents();
    const totalCapacity = calculateTotalCapacity();
    const uniqueBlocks = getUniqueBlocks();

    document.getElementById('totalRooms').textContent = AppData.rooms.length;
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('totalCapacity').textContent = totalCapacity;

    const blockList = document.getElementById('blockList');
    if (blockList) {
        if (uniqueBlocks.length > 0) {
            blockList.innerHTML = uniqueBlocks.map(block => 
                `<span class="block-tag">${block}</span>`
            ).join('');
        } else {
            blockList.innerHTML = '<span class="text-secondary text-sm">No blocks defined yet.</span>';
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateDashboard };
}
