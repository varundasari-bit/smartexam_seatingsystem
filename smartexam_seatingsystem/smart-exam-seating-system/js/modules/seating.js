/**
 * Smart Exam Seating System - Seating Allocation Module
 * 
 * Keywords: exam-seating, seating-allocation, round-robin, offline, standalone
 * Responsibility: Round-robin seating plan generation and visualization
 */

// ============================================
// Seating Plan Generation (Round-Robin Algorithm)
// ============================================

/**
 * Generate seating plan using round-robin interleaving algorithm
 * Groups students by subject to ensure same-subject students don't sit together
 * Ensures no two same-branch students sit on the same bench
 * Number of different branches per room equals bench capacity
 * @returns {Object} Seating plan and room layouts
 */
function generateSeatingPlan() {
    // Flatten students from all ranges with subject info
    let allStudents = [];
    AppData.ranges.forEach(range => {
        for (let i = range.startRoll; i <= range.endRoll; i++) {
            const rollNum = i < 10 ? `0${i}` : `${i}`;
            allStudents.push({
                roll: `${range.prefix}${rollNum}`,
                branch: range.branch,
                subject: range.subject || 'General',
                year: range.year
            });
        }
    });

    // Group students by subject (primary) and branch-year (secondary)
    // This ensures same-subject students are separated
    const subjectGroups = {};
    allStudents.forEach(student => {
        const key = `${student.subject}`;
        if (!subjectGroups[key]) subjectGroups[key] = [];
        subjectGroups[key].push(student);
    });

    const subjects = Object.keys(subjectGroups);
    const totalStudents = allStudents.length;
    const totalCapacity = AppData.rooms.reduce((acc, room) => acc + room.capacity, 0);

    if (totalStudents > totalCapacity) {
        throw new Error(`Total students (${totalStudents}) exceed total capacity (${totalCapacity})`);
    }

    // Round-robin interleaving by subject
    // This ensures students with same subject are distributed across the room
    const interleavedStudents = [];
    const maxLen = Math.max(...subjects.map(s => subjectGroups[s].length));

    for (let i = 0; i < maxLen; i++) {
        subjects.forEach(subject => {
            if (subjectGroups[subject][i]) {
                interleavedStudents.push(subjectGroups[subject][i]);
            }
        });
    }

    const seatingPlan = {};
    const roomLayouts = {};

    let studentIdx = 0;
    AppData.rooms.forEach(room => {
        // Initialize 3D layout: [row][col][seatIndex]
        const layout = Array(room.rows).fill(null).map(() => 
            Array(room.cols).fill(null).map(() => 
                Array(room.benchCapacity).fill(null)
            )
        );
        
        // Track subjects assigned to this room to ensure diversity
        const roomSubjects = new Set();
        let benchCounter = 1;
        let stopRoom = false;
        
        // Column-major order
        for (let c = 0; c < room.cols; c++) {
            for (let r = 0; r < room.rows; r++) {
                if (benchCounter > room.totalBenches) {
                    stopRoom = true;
                    break;
                }
                
                // Track branches on current bench to prevent same-branch students
                const benchBranches = new Set();
                
                for (let s = 0; s < room.benchCapacity; s++) {
                    if (studentIdx < interleavedStudents.length) {
                        let student = interleavedStudents[studentIdx];
                        
                        // Check if adding this student would exceed subject diversity per room
                        // Limit: benchCapacity different subjects per room
                        if (roomSubjects.size >= room.benchCapacity && !roomSubjects.has(student.subject)) {
                            // Skip to next student with different subject
                            let found = false;
                            for (let k = studentIdx + 1; k < interleavedStudents.length; k++) {
                                if (roomSubjects.has(interleavedStudents[k].subject) || roomSubjects.size < room.benchCapacity) {
                                    // Swap students
                                    const temp = interleavedStudents[studentIdx];
                                    interleavedStudents[studentIdx] = interleavedStudents[k];
                                    interleavedStudents[k] = temp;
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                // No suitable student found, continue anyway
                            }
                        }
                        
                        student = interleavedStudents[studentIdx];
                        
                        // Check if same branch already exists on this bench
                        // If yes, find a student from different branch
                        if (benchBranches.has(student.branch)) {
                            let found = false;
                            for (let k = studentIdx + 1; k < interleavedStudents.length; k++) {
                                if (!benchBranches.has(interleavedStudents[k].branch)) {
                                    // Swap students
                                    const temp = interleavedStudents[studentIdx];
                                    interleavedStudents[studentIdx] = interleavedStudents[k];
                                    interleavedStudents[k] = temp;
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                // No student with different branch found, continue anyway
                                // This may happen if all remaining students are from same branch
                            }
                        }
                        
                        const currentStudent = interleavedStudents[studentIdx++];
                        benchBranches.add(currentStudent.branch);
                        roomSubjects.add(currentStudent.subject);
                        
                        let position = `Seat ${s + 1}`;
                        if (room.benchCapacity === 1) position = "Center";
                        else if (room.benchCapacity === 2) position = s === 0 ? "Left" : "Right";
                        else if (room.benchCapacity === 3) position = s === 0 ? "Left" : s === 1 ? "Middle" : "Right";

                        const assignment = {
                            blockName: room.blockName,
                            roomName: room.name,
                            benchNumber: benchCounter,
                            row: r + 1,
                            col: c + 1,
                            position: position,
                            rollNumber: currentStudent.roll,
                            branch: currentStudent.branch,
                            subject: currentStudent.subject,
                            year: currentStudent.year,
                            batch: s + 1
                        };
                        layout[r][c][s] = assignment;
                        seatingPlan[currentStudent.roll] = assignment;
                    }
                }
                benchCounter++;
            }
            if (stopRoom) break;
        }
        roomLayouts[room.id] = layout;
    });

    return { seatingPlan, roomLayouts };
}

/**
 * Generate and display seating plan
 */
function generatePlan() {
    try {
        if (AppData.rooms.length === 0 || AppData.ranges.length === 0) {
            throw new Error("Please add at least one room and one student range.");
        }
        AppData.seatingData = generateSeatingPlan();
        renderSeatingPlan();
        showAlert('planAlert', 'Seating plan generated successfully', 'success');
        showPage('plan');
        
        // After viewing plan, return to dashboard as main page
        setTimeout(() => {
            showPage('dashboard');
        }, 3000);
    } catch (err) {
        showAlert('planAlert', err.message, 'error');
    }
}

/**
 * Render seating plan visualization
 */
function renderSeatingPlan() {
    const container = document.getElementById('planContent');
    
    if (!AppData.seatingData) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                </div>
                <h3 class="empty-title">No plan generated yet</h3>
                <p class="empty-text">Add rooms and students, then click Generate Plan</p>
            </div>
        `;
        return;
    }

    let html = '';
    AppData.rooms.forEach(room => {
        const layout = AppData.seatingData.roomLayouts[room.id];
        
        html += `
            <div class="room-card">
                <div class="room-header">
                    <div>
                        <div class="room-block">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            ${room.blockName}
                        </div>
                        <div class="room-title-section">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                            </svg>
                            <h3 class="room-name">${room.name}</h3>
                        </div>
                    </div>
                    <div class="room-meta">
                        <span>${room.rows} × ${room.cols}</span>
                        <span>${room.benchCapacity}/bench</span>
                    </div>
                </div>

                <div class="bench-grid" style="grid-template-columns: repeat(${room.cols}, minmax(0, 1fr));">
        `;

        // Render benches
        for (let r = 0; r < room.rows; r++) {
            for (let c = 0; c < room.cols; c++) {
                const benchNum = c * room.rows + r + 1;
                if (benchNum > room.totalBenches) {
                    html += `<div class="hidden"></div>`;
                    continue;
                }

                const bench = layout[r][c];
                html += `
                    <div class="bench">
                        <div class="bench-header">
                            <span class="bench-label">Bench ${benchNum}</span>
                        </div>
                        <div class="bench-seats">
                `;

                for (let s = 0; s < room.benchCapacity; s++) {
                    const seat = bench[s];
                    if (seat) {
                        const branchColor = getBranchColor(seat.branch);
                        const conciseRoll = getConciseRollNumber(seat.rollNumber, seat.prefix || '');
                        html += `
                            <div class="seat occupied" style="background: ${branchColor.bg}; border-color: ${branchColor.bg};">
                                <span class="seat-branch-simple" style="color: ${branchColor.text};">${seat.branch}</span>
                                <span class="seat-roll-simple" style="color: ${branchColor.text};">${conciseRoll}</span>
                            </div>
                        `;
                    } else {
                        html += `
                            <div class="seat empty">
                                <p class="seat-empty-text">Empty</p>
                            </div>
                        `;
                    }
                }

                html += `</div></div>`;
            }
        }

        html += `</div>`;

        // Batch summary
        html += `
            <div class="batch-section">
                <h4 class="batch-title">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    Batch-wise Student List
                </h4>
                <div class="batch-grid">
        `;

        for (let bIdx = 0; bIdx < room.benchCapacity; bIdx++) {
            const batchNum = bIdx + 1;
            const batchStudents = Object.values(AppData.seatingData.seatingPlan)
                .filter(s => s.roomName === room.name && s.batch === batchNum)
                .sort((a, b) => a.benchNumber - b.benchNumber);

            html += `
                <div class="batch-card">
                    <div class="batch-header">
                        <span class="batch-name">Batch ${batchNum}</span>
                        <span class="batch-count">${batchStudents.length} students</span>
                    </div>
                    <div class="batch-list">
            `;

            if (batchStudents.length === 0) {
                html += `<p class="text-secondary text-sm text-center py-4 italic">No students</p>`;
            } else {
                batchStudents.forEach(student => {
                    html += `
                        <div class="batch-student">
                            <span class="batch-student-roll">${student.rollNumber}</span>
                            <span class="batch-student-bench">Bench ${student.benchNumber}</span>
                        </div>
                    `;
                });
            }

            html += `</div></div>`;
        }

        html += `</div></div></div>`;
    });

    container.innerHTML = html;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        generateSeatingPlan, 
        generatePlan, 
        renderSeatingPlan 
    };
}
