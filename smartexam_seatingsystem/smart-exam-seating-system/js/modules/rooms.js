/**
 * Smart Exam Seating System - Room Management Module
 * 
 * Keywords: exam-seating, seating-allocation, offline, standalone
 * Responsibility: Room CRUD operations and room data management
 */

// ============================================
// Room Management
// ============================================

/**
 * Update total benches display based on rows and columns
 */
function updateTotalBenches() {
    const rows = parseInt(document.getElementById('roomRows').value) || 0;
    const cols = parseInt(document.getElementById('roomCols').value) || 0;
    document.getElementById('totalBenches').textContent = rows * cols;
}

/**
 * Add new room to the system
 */
function addRoom() {
    const name = document.getElementById('roomName').value.trim();
    const blockName = document.getElementById('roomBlock').value.trim();
    const rows = parseInt(document.getElementById('roomRows').value) || 0;
    const cols = parseInt(document.getElementById('roomCols').value) || 0;
    const benchCapacity = parseInt(document.getElementById('benchCapacity').value) || 1;

    if (!name || !blockName) {
        showAlert('roomAlert', 'Please fill in all fields', 'error');
        return;
    }

    const room = {
        id: generateId(),
        name,
        blockName,
        rows,
        cols,
        benchCapacity,
        totalBenches: rows * cols,
        capacity: rows * cols * benchCapacity
    };

    AppData.rooms.push(room);
    renderRooms();
    clearRoomInputs();
    showAlert('roomAlert', 'Room added successfully', 'success');
    updateDashboard();
}

/**
 * Delete room by ID
 * @param {string} id - Room ID to delete
 */
function deleteRoom(id) {
    AppData.rooms = AppData.rooms.filter(r => r.id !== id);
    renderRooms();
    updateDashboard();
}

/**
 * Clear all rooms
 */
function clearAllRooms() {
    AppData.rooms = [];
    renderRooms();
    updateDashboard();
}

/**
 * Render rooms table
 */
function renderRooms() {
    const tbody = document.getElementById('roomsTableBody');
    const existingRows = tbody.querySelectorAll('tr:not(.input-row)');
    existingRows.forEach(r => r.remove());

    AppData.rooms.forEach(room => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-primary font-semibold">${room.blockName}</td>
            <td>${room.name}</td>
            <td class="text-secondary">${room.rows}</td>
            <td class="text-secondary">${room.cols}</td>
            <td class="text-primary font-semibold">${room.totalBenches}</td>
            <td class="text-secondary">${room.benchCapacity}</td>
            <td>
                <button onclick="deleteRoom('${room.id}')" class="text-disabled hover:text-danger transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (AppData.rooms.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7" class="text-center text-secondary py-12">No rooms added yet</td>`;
        tbody.appendChild(tr);
    }
}

/**
 * Clear room input fields
 */
function clearRoomInputs() {
    document.getElementById('roomName').value = '';
    document.getElementById('roomBlock').value = '';
    document.getElementById('roomRows').value = '5';
    document.getElementById('roomCols').value = '4';
    document.getElementById('benchCapacity').value = '1';
    updateTotalBenches();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        updateTotalBenches, 
        addRoom, 
        deleteRoom, 
        clearAllRooms, 
        renderRooms, 
        clearRoomInputs 
    };
}
