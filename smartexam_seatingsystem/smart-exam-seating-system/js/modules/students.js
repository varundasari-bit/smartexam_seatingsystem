/**
 * Smart Exam Seating System - Student Management Module
 * 
 * Keywords: exam-seating, seating-allocation, offline, standalone
 * Responsibility: Student range CRUD operations and student data management
 */

// ============================================
// Student Range Management
// ============================================

/**
 * Update range strength display
 */
function updateRangeStrength() {
    const start = parseInt(document.getElementById('rangeStart').value) || 0;
    const end = parseInt(document.getElementById('rangeEnd').value) || 0;
    document.getElementById('rangeStrength').textContent = Math.max(0, end - start + 1);
}

/**
 * Add new student range
 */
function addRange() {
    const branch = document.getElementById('rangeBranch').value.trim();
    const subject = document.getElementById('rangeSubject').value.trim();
    const year = document.getElementById('rangeYear').value.trim();
    const prefix = document.getElementById('rangePrefix').value.trim();
    const startRoll = parseInt(document.getElementById('rangeStart').value) || 0;
    const endRoll = parseInt(document.getElementById('rangeEnd').value) || 0;

    if (!branch || !year || !prefix) {
        showAlert('studentAlert', 'Please fill in all fields', 'error');
        return;
    }

    const range = {
        id: generateId(),
        branch,
        subject: subject || 'General',
        year,
        prefix,
        startRoll,
        endRoll
    };

    AppData.ranges.push(range);
    renderRanges();
    clearRangeInputs();
    showAlert('studentAlert', 'Student range added successfully', 'success');
    updateDashboard();
}

/**
 * Delete student range by ID
 * @param {string} id - Range ID to delete
 */
function deleteRange(id) {
    AppData.ranges = AppData.ranges.filter(r => r.id !== id);
    renderRanges();
    updateDashboard();
}

/**
 * Clear all student ranges
 */
function clearAllRanges() {
    AppData.ranges = [];
    renderRanges();
    updateDashboard();
}

/**
 * Render student ranges table
 */
function renderRanges() {
    const tbody = document.getElementById('studentsTableBody');
    const existingRows = tbody.querySelectorAll('tr:not(.input-row)');
    existingRows.forEach(r => r.remove());

    AppData.ranges.forEach(range => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-medium">${range.branch}</td>
            <td class="text-secondary">${range.subject || '-'}</td>
            <td class="text-secondary">${range.year}</td>
            <td class="text-secondary">${range.prefix}</td>
            <td class="text-secondary">${range.startRoll}</td>
            <td class="text-secondary">${range.endRoll}</td>
            <td class="text-primary font-semibold">${range.endRoll - range.startRoll + 1}</td>
            <td>
                <button onclick="deleteRange('${range.id}')" class="text-disabled hover:text-danger transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (AppData.ranges.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="8" class="text-center text-secondary py-12">No student ranges added yet</td>`;
        tbody.appendChild(tr);
    }
}

/**
 * Clear range input fields
 */
function clearRangeInputs() {
    document.getElementById('rangeBranch').value = '';
    document.getElementById('rangeSubject').value = '';
    document.getElementById('rangeYear').value = '';
    document.getElementById('rangePrefix').value = '';
    document.getElementById('rangeStart').value = '01';
    document.getElementById('rangeEnd').value = '60';
    document.getElementById('rangeStrength').textContent = '60';
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        updateRangeStrength, 
        addRange, 
        deleteRange, 
        clearAllRanges, 
        renderRanges, 
        clearRangeInputs 
    };
}
