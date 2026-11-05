/**
 * Smart Exam Seating System - Exam Management Module
 * 
 * Keywords: exam-seating, seating-allocation, offline, standalone
 * Responsibility: Exam CRUD operations and exam data management
 */

// ============================================
// Exam Management
// ============================================

/**
 * Add new exam to the system
 */
function addExam() {
    const name = document.getElementById('examName').value.trim();
    const code = document.getElementById('examCode').value.trim();
    const date = document.getElementById('examDate').value;
    const time = document.getElementById('examTime').value;
    const duration = document.getElementById('examDuration').value.trim();

    if (!name || !code) {
        showAlert('examAlert', 'Please fill in exam name and subject code', 'error');
        return;
    }

    const exam = {
        id: generateId(),
        name,
        code,
        date,
        time,
        duration
    };

    AppData.exams.push(exam);
    renderExams();
    clearExamInputs();
    showAlert('examAlert', 'Exam added successfully', 'success');
}

/**
 * Delete exam by ID
 * @param {string} id - Exam ID to delete
 */
function deleteExam(id) {
    AppData.exams = AppData.exams.filter(e => e.id !== id);
    renderExams();
}

/**
 * Clear all exams
 */
function clearAllExams() {
    AppData.exams = [];
    renderExams();
}

/**
 * Render exams table
 */
function renderExams() {
    const tbody = document.getElementById('examsTableBody');
    const existingRows = tbody.querySelectorAll('tr:not(.input-row)');
    existingRows.forEach(r => r.remove());

    AppData.exams.forEach(exam => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-medium">${exam.name}</td>
            <td class="text-secondary">${exam.code}</td>
            <td class="text-secondary">${exam.date || '-'}</td>
            <td class="text-secondary">${exam.time || '-'}</td>
            <td class="text-secondary">${exam.duration || '-'}</td>
            <td>
                <button onclick="deleteExam('${exam.id}')" class="text-disabled hover:text-danger transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (AppData.exams.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="6" class="text-center text-secondary py-12">No exams added yet</td>`;
        tbody.appendChild(tr);
    }
}

/**
 * Clear exam input fields
 */
function clearExamInputs() {
    document.getElementById('examName').value = '';
    document.getElementById('examCode').value = '';
    document.getElementById('examDate').value = '';
    document.getElementById('examTime').value = '';
    document.getElementById('examDuration').value = '';
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        addExam, 
        deleteExam, 
        clearAllExams, 
        renderExams, 
        clearExamInputs 
    };
}
