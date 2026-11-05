/**
 * Smart Exam Seating System - Navigation Module
 * 
 * Keywords: exam-seating, offline, standalone
 * Responsibility: Page navigation, sidebar toggle, and view management
 */

// ============================================
// Page Navigation
// ============================================

/**
 * Show specific page and hide others
 * @param {string} pageId - Page ID to show
 */
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Deactivate all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Activate nav button
    const navBtn = document.querySelector(`[data-nav="${pageId}"]`);
    if (navBtn) {
        navBtn.classList.add('active');
    }

    // Update dashboard stats
    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
}

/**
 * Check admin access before showing protected page
 * @param {string} page - Page ID to access
 */
function checkAdminAccess(page) {
    if (!AppData.isAdmin) {
        AppData.pendingPage = page;
        openLoginModal();
    } else {
        showPage(page);
    }
}

// ============================================
// Sidebar Toggle
// ============================================

/**
 * Toggle sidebar collapsed state
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    
    // Save preference to localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

/**
 * Load sidebar state from localStorage
 */
function loadSidebarState() {
    const sidebar = document.getElementById('sidebar');
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }
}

// ============================================
// Event Listeners Setup
// ============================================

/**
 * Setup navigation event listeners
 */
function setupNavigationListeners() {
    // Close modal on outside click
    document.getElementById('loginModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLoginModal();
        }
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        showPage, 
        checkAdminAccess, 
        toggleSidebar, 
        loadSidebarState,
        setupNavigationListeners
    };
}
