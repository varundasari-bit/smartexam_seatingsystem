/**
 * Smart Exam Seating System - Search Module
 * 
 * Keywords: exam-seating, seating-allocation, offline, standalone
 * Responsibility: Seat lookup by roll number and search functionality
 */

// ============================================
// Search
// ============================================

/**
 * Search for student seat by roll number
 */
function searchSeat() {
    const query = document.getElementById('searchInput').value.trim().toUpperCase();
    const resultDiv = document.getElementById('searchResult');
    const warningDiv = document.getElementById('searchWarning');

    if (!AppData.seatingData) {
        warningDiv.classList.remove('hidden');
        resultDiv.innerHTML = '';
        return;
    }

    warningDiv.classList.add('hidden');

    if (!query) {
        resultDiv.innerHTML = '';
        return;
    }

    const result = AppData.seatingData.seatingPlan[query];

    if (result) {
        resultDiv.innerHTML = `
            <div class="search-result">
                <div class="search-result-grid">
                    <div class="search-result-item">
                        <span class="search-result-label">Roll Number</span>
                        <span class="search-result-value">${result.rollNumber}</span>
                    </div>
                    <div class="search-result-item">
                        <span class="search-result-label">Branch-Year</span>
                        <span class="search-result-value">${result.branch} - ${result.year}</span>
                    </div>
                    <div class="search-result-item">
                        <span class="search-result-label">Block & Room</span>
                        <span class="search-result-value">${result.blockName} / ${result.roomName}</span>
                    </div>
                    <div class="search-result-item">
                        <span class="search-result-label">Bench & Position</span>
                        <span class="search-result-value">Bench ${result.benchNumber} (${result.position})</span>
                    </div>
                    <div class="search-result-item">
                        <span class="search-result-label">Collection Batch</span>
                        <span class="search-result-value">Batch ${result.batch}</span>
                    </div>
                </div>
                <svg class="search-result-bg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `<p class="search-empty">No student found with roll number "${query}"</p>`;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { searchSeat };
}
