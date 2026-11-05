/**
 * Smart Exam Seating System - Authentication Module
 * 
 * Keywords: exam-seating, offline, standalone
 * Responsibility: Admin login/logout and access control
 */

// ============================================
// Authentication
// ============================================

/**
 * Open login modal
 */
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    const passwordInput = document.getElementById('loginPassword');
    const errorMsg = document.getElementById('loginError');

    modal.classList.add('active');
    passwordInput.value = '';
    errorMsg.classList.add('hidden');
    passwordInput.classList.remove('border-danger');
    passwordInput.focus();
}

/**
 * Close login modal
 */
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');
    const passwordInput = document.getElementById('loginPassword');

    if (password === ADMIN_CONFIG.password) {
        AppData.isAdmin = true;
        closeLoginModal();
        
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.classList.remove('hidden');

        if (AppData.pendingPage) {
            showPage(AppData.pendingPage);
            AppData.pendingPage = null;
            // Return to dashboard after admin work
            setTimeout(() => {
                showPage('dashboard');
            }, 5000);
        }
    } else {
        errorMsg.classList.remove('hidden');
        passwordInput.classList.add('border-danger');
    }
}

/**
 * Logout admin user
 */
function logout() {
    AppData.isAdmin = false;
    document.getElementById('logoutBtn').classList.add('hidden');
    // Return to dashboard as main page after logout
    showPage('dashboard');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        openLoginModal, 
        closeLoginModal, 
        handleLogin, 
        logout 
    };
}
