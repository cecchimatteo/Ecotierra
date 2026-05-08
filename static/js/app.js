// Main application JavaScript file

// Global variables
let sidebarCollapsed = true; // Always start with sidebar collapsed

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupSidebar();
    setupNavigation();
    setupGlobalEventListeners();
    setupSidebarObserver();
}

// Watch for sidebar collapse state changes and enforce styles
function setupSidebarObserver() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (sidebar.classList.contains('collapsed')) {
                    // Sidebar was collapsed - enforce styles immediately
                    setTimeout(() => enforceCollapsedSidebarStyles(), 10);
                } else {
                    // Sidebar was expanded - enforce expanded styles
                    setTimeout(() => enforceExpandedSidebarStyles(), 10);
                }
            }
        });
    });
    
    observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class']
    });
}

function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const floatingToggle = document.getElementById('floatingToggle');
    
    console.log('Setting up sidebar...');
    console.log('Sidebar element:', sidebar);
    console.log('Main content element:', mainContent);
    console.log('Sidebar toggle element:', sidebarToggle);
    console.log('Floating toggle element:', floatingToggle);
    
    // Always start collapsed on page load/refresh
    sidebarCollapsed = true;
    localStorage.setItem('sidebarCollapsed', 'true');
    
    // Set up sidebar - always start collapsed
    if (sidebar) {
        // Lock height FIRST before anything else
        const h = Math.floor(window.innerHeight - 70);
        sidebar.style.setProperty('height', h + 'px', 'important');
        sidebar.style.setProperty('min-height', h + 'px', 'important');
        sidebar.style.setProperty('max-height', h + 'px', 'important');
        
        sidebar.classList.add('collapsed');
        sidebar.style.transform = 'translateX(0)';
        sidebar.style.width = '64px';
        sidebar.style.minWidth = '64px';
        sidebar.style.maxWidth = '64px';
        sidebar.style.backgroundColor = '#ffffff';
        sidebar.style.display = 'block';
        sidebar.style.visibility = 'visible';
        sidebar.style.opacity = '1';
        
        if (mainContent) {
            mainContent.classList.add('expanded');
        }
        
        // Lock all nav-group-header heights IMMEDIATELY before enforceCollapsedSidebarStyles
        const navGroupHeaders = sidebar.querySelectorAll('.nav-group-header');
        navGroupHeaders.forEach(header => {
            header.style.setProperty('height', '48px', 'important');
            header.style.setProperty('min-height', '48px', 'important');
            header.style.setProperty('max-height', '48px', 'important');
            header.style.setProperty('flex-shrink', '0', 'important');
        });
        
        // Update toggle icon to right chevron (collapsed state)
        const icon = sidebarToggle ? sidebarToggle.querySelector('i') : null;
        if (icon) {
            icon.classList.remove('bi-chevron-left');
            icon.classList.add('bi-chevron-right');
            icon.style.display = 'block';
            icon.style.visibility = 'visible';
            icon.style.opacity = '1';
        }
        
        // Update floating toggle icon
        const floatingIcon = floatingToggle ? floatingToggle.querySelector('i') : null;
        if (floatingIcon) {
            floatingIcon.classList.remove('bi-chevron-right');
            floatingIcon.classList.add('bi-chevron-left');
        }
        
        // Enforce collapsed styles immediately (no delay to prevent height jump)
        enforceCollapsedSidebarStyles();
        
        console.log('Sidebar setup: visible, collapsed = true');
        console.log('Sidebar classes:', sidebar.className);
    } else {
        console.error('Sidebar element not found!');
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
        console.log('Sidebar toggle setup complete');
    } else {
        console.error('Sidebar toggle element not found!');
    }
    
    if (floatingToggle) {
        floatingToggle.addEventListener('click', toggleSidebar);
        console.log('Floating toggle setup complete');
    } else {
        console.error('Floating toggle element not found!');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const floatingToggle = document.getElementById('floatingToggle');
    
    console.log('Toggling sidebar...');
    console.log('Sidebar element:', sidebar);
    console.log('Main content element:', mainContent);
    console.log('Sidebar toggle element:', sidebarToggle);
    console.log('Floating toggle element:', floatingToggle);
    
    if (!sidebar || !mainContent) {
        console.error('Required sidebar elements not found');
        return;
    }
    
    const icon = sidebarToggle ? sidebarToggle.querySelector('i') : null;
    const floatingIcon = floatingToggle ? floatingToggle.querySelector('i') : null;
    
    console.log('Current sidebar classes:', sidebar.className);
    console.log('Current main content classes:', mainContent.className);
    
    // Toggle the collapsed state
    const isCurrentlyCollapsed = sidebar.classList.contains('collapsed');
    
    if (isCurrentlyCollapsed) {
        // Expand the sidebar - remove collapsed class first
        sidebar.classList.remove('collapsed');
        
        // Clear any conflicting inline styles first
        sidebar.style.removeProperty('width');
        sidebar.style.removeProperty('min-width');
        sidebar.style.removeProperty('max-width');
        sidebar.style.removeProperty('transform');
        
        // Don't touch height - it's locked in CSS from head script
        sidebar.style.setProperty('width', '280px', 'important');
        sidebar.style.setProperty('min-width', '280px', 'important');
        sidebar.style.setProperty('max-width', '280px', 'important');
        sidebar.style.setProperty('transform', 'translateX(0)', 'important');
        sidebar.style.setProperty('background-color', '#ffffff', 'important');
        
        mainContent.classList.remove('expanded');
        
        // Update icons
        if (icon) {
            icon.classList.remove('bi-chevron-right');
            icon.classList.add('bi-chevron-left');
        }
        if (floatingIcon) {
            floatingIcon.classList.remove('bi-chevron-left');
            floatingIcon.classList.add('bi-chevron-right');
        }
        
        sidebarCollapsed = false;
        console.log('Sidebar expanded - collapsed class removed');
        
        // Enforce expanded styles immediately and in next frame
        enforceExpandedSidebarStyles();
        requestAnimationFrame(() => {
            if (!sidebar.classList.contains('collapsed')) {
                enforceExpandedSidebarStyles();
                console.log('Sidebar width forced to 280px (frame 2)');
                console.log('Sidebar computed width:', window.getComputedStyle(sidebar).width);
            }
        });
    } else {
        // Collapse the sidebar (narrow to icon-only mode)
        // Don't touch height - it's locked in CSS from head script
        sidebar.classList.add('collapsed');
        sidebar.style.transform = 'translateX(0)';
        sidebar.style.width = '64px';
        sidebar.style.minWidth = '64px';
        sidebar.style.maxWidth = '64px';
        sidebar.style.backgroundColor = '#ffffff';
        mainContent.classList.add('expanded');
        
        // Update icons
        if (icon) {
            icon.classList.remove('bi-chevron-left');
            icon.classList.add('bi-chevron-right');
            icon.style.display = 'block';
            icon.style.visibility = 'visible';
            icon.style.opacity = '1';
        }
        if (floatingIcon) {
            floatingIcon.classList.remove('bi-chevron-right');
            floatingIcon.classList.add('bi-chevron-left');
        }
        
        // Force visibility of collapsed elements
        setTimeout(() => enforceCollapsedSidebarStyles(), 10);
        
        sidebarCollapsed = true;
        console.log('Sidebar collapsed (narrow mode)');
    }
    
    console.log('After toggle - Sidebar classes:', sidebar.className);
    console.log('After toggle - Main content classes:', mainContent.className);
    
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    console.log('Sidebar state saved to localStorage:', sidebarCollapsed);
}

// Enforce expanded sidebar styles via JavaScript
function enforceExpandedSidebarStyles() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || sidebar.classList.contains('collapsed')) {
        return;
    }
    
    // Don't touch height - it's locked in CSS from head script
    sidebar.style.setProperty('background-color', '#ffffff', 'important');
    sidebar.style.setProperty('width', '280px', 'important');
    sidebar.style.setProperty('min-width', '280px', 'important');
    sidebar.style.setProperty('max-width', '280px', 'important');
    sidebar.style.setProperty('transform', 'translateX(0)', 'important');
    
    // Force visibility of all text elements - clear any collapsed styles first
    const textElements = sidebar.querySelectorAll('.nav-item span, .nav-group-header > div > span, .nav-group-header .group-toggle');
    textElements.forEach(el => {
        // Clear any conflicting styles from collapsed state
        el.style.removeProperty('max-width');
        el.style.removeProperty('max-height');
        el.style.removeProperty('width');
        el.style.removeProperty('height');
        el.style.removeProperty('display');
        el.style.removeProperty('visibility');
        el.style.removeProperty('opacity');
    });
    
    // Clear any inline styles from nav items to let CSS take over
    const navItems = sidebar.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.style.removeProperty('justify-content');
        item.style.removeProperty('padding');
        item.style.removeProperty('width');
        item.style.removeProperty('min-height');
        item.style.removeProperty('height');
        item.style.removeProperty('margin-top');
        item.style.removeProperty('margin-bottom');
        
        // Clear icon styles to reset from collapsed state
        const icon = item.querySelector('i');
        if (icon) {
            icon.style.removeProperty('font-size');
            icon.style.removeProperty('margin-right');
            icon.style.removeProperty('margin-left');
            icon.style.removeProperty('width');
            icon.style.removeProperty('min-width');
        }
    });
    
    // Clear any inline styles from nav group headers to let CSS take over - BUT PRESERVE HEIGHT
    const groupHeaders = sidebar.querySelectorAll('.nav-group-header');
    groupHeaders.forEach(header => {
        // Store height values before clearing
        const height = header.style.height || '48px';
        const minHeight = header.style.minHeight || '48px';
        const maxHeight = header.style.maxHeight || '48px';
        
        header.style.removeProperty('justify-content');
        header.style.removeProperty('padding');
        header.style.removeProperty('width');
        header.style.removeProperty('margin-left');
        header.style.removeProperty('margin-right');
        
        // RESTORE HEIGHT - these MUST stay fixed at 48px
        header.style.setProperty('height', '48px', 'important');
        header.style.setProperty('min-height', '48px', 'important');
        header.style.setProperty('max-height', '48px', 'important');
        header.style.setProperty('flex-shrink', '0', 'important');
        header.style.removeProperty('margin-top');
        header.style.removeProperty('margin-bottom');
        
        // Clear styles from the first div inside header
        const firstDiv = header.querySelector('div:first-child');
        if (firstDiv) {
            firstDiv.style.removeProperty('justify-content');
            firstDiv.style.removeProperty('width');
            
            // Clear icon styles to reset from collapsed state
            const icon = firstDiv.querySelector('i');
            if (icon) {
                icon.style.removeProperty('font-size');
                icon.style.removeProperty('margin-right');
                icon.style.removeProperty('margin-left');
                icon.style.removeProperty('width');
                icon.style.removeProperty('min-width');
            }
        }
        
        // Ensure group-toggle (chevron) is visible when expanded
        const groupToggle = header.querySelector('.group-toggle');
        if (groupToggle) {
            groupToggle.style.removeProperty('display');
            groupToggle.style.removeProperty('visibility');
            groupToggle.style.removeProperty('opacity');
            groupToggle.style.removeProperty('width');
            groupToggle.style.removeProperty('height');
        }
    });
    
    // Clear styles from sidebar-top-actions
    const topActions = sidebar.querySelector('.sidebar-top-actions');
    if (topActions) {
        topActions.style.removeProperty('padding');
        topActions.style.removeProperty('gap');
        topActions.style.removeProperty('flex-direction');
    }
    
    // Clear styles from sidebar-icon-btn
    const iconBtns = sidebar.querySelectorAll('.sidebar-icon-btn');
    iconBtns.forEach(btn => {
        btn.style.removeProperty('width');
        btn.style.removeProperty('height');
        btn.style.removeProperty('flex');
    });
    
    // Clear inline styles from nav-group-items to let CSS take over
    const groupItems = sidebar.querySelectorAll('.nav-group-items');
    groupItems.forEach(items => {
        items.style.removeProperty('display');
        items.style.removeProperty('visibility');
        items.style.removeProperty('opacity');
        items.style.removeProperty('max-height');
        items.style.removeProperty('height');
    });
    
    // Clear inline styles from nav-items container to let CSS take over
    const navItemsContainer = sidebar.querySelector('.nav-items');
    if (navItemsContainer) {
        navItemsContainer.style.removeProperty('display');
        navItemsContainer.style.removeProperty('visibility');
        navItemsContainer.style.removeProperty('opacity');
        navItemsContainer.style.removeProperty('padding');
        navItemsContainer.style.removeProperty('width');
    }
}

// Enforce collapsed sidebar styles via JavaScript
function enforceCollapsedSidebarStyles() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || !sidebar.classList.contains('collapsed')) {
        return;
    }
    
    // Don't touch height - it's locked in CSS from head script
    sidebar.style.setProperty('background-color', '#ffffff', 'important');
    sidebar.style.setProperty('width', '64px', 'important');
    sidebar.style.setProperty('min-width', '64px', 'important');
    sidebar.style.setProperty('max-width', '64px', 'important');
    
    // Force visibility of toggle button
    const toggle = document.getElementById('sidebarToggle');
    if (toggle) {
        toggle.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 1000 !important;';
        const toggleIcon = toggle.querySelector('i');
        if (toggleIcon) {
            toggleIcon.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; font-size: 18px !important; width: auto !important; height: auto !important;';
        }
    }
    
    // Force visibility of top action buttons
    const topActions = sidebar.querySelector('.sidebar-top-actions');
    if (topActions) {
        topActions.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important; flex-direction: column !important; padding: 12px 8px !important; gap: 8px !important;';
    }
    
    // Force visibility of ALL icons in top action buttons
    const topActionIcons = sidebar.querySelectorAll('.sidebar-top-actions i');
    topActionIcons.forEach(icon => {
        icon.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; font-size: 18px !important;';
    });
    
    // Force visibility of icon buttons
    const iconButtons = sidebar.querySelectorAll('.sidebar-icon-btn');
    iconButtons.forEach(btn => {
        btn.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important; width: 48px !important; height: 48px !important; flex: none !important;';
        const btnIcon = btn.querySelector('i');
        if (btnIcon) {
            btnIcon.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; font-size: 18px !important;';
        }
    });
    
    // Force visibility of nav group header icons - PRESERVE HEIGHT
    const navGroupHeaders = sidebar.querySelectorAll('.nav-group-header');
    navGroupHeaders.forEach(header => {
        header.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important; background-color: #ffffff !important; justify-content: center !important; padding: 12px 0 !important; margin-top: 4px !important; margin-bottom: 4px !important; height: 48px !important; min-height: 48px !important; max-height: 48px !important; align-items: center !important; width: 100% !important; flex-shrink: 0 !important;';
        
        const firstDiv = header.querySelector('div:first-child');
        if (firstDiv) {
            firstDiv.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important; justify-content: center !important; width: 100% !important; align-items: center !important;';
            
            // Find ALL icons in the first div (there should be one main icon)
            const icons = firstDiv.querySelectorAll('i');
            icons.forEach(icon => {
                // Skip the group-toggle icon
                if (!icon.classList.contains('group-toggle')) {
                    icon.style.cssText = 'display: inline-block !important; visibility: visible !important; opacity: 1 !important; font-size: 20px !important; color: #6c757d !important; margin-right: 0 !important; margin-left: 0 !important; width: auto !important; height: auto !important; line-height: 1 !important; flex-shrink: 0 !important;';
                }
            });
        }
        
        // Hide text and toggle
        const span = header.querySelector('span');
        if (span) {
            span.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
        }
        const groupToggle = header.querySelector('.group-toggle');
        if (groupToggle) {
            groupToggle.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
        }
    });
    
    // Force visibility of nav item icons - PRESERVE HEIGHT
    const navItems = sidebar.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important; justify-content: center !important; padding: 12px 0 !important; width: 100% !important; height: 48px !important; min-height: 48px !important; max-height: 48px !important; flex-shrink: 0 !important;';
        
        const icon = item.querySelector('i');
        if (icon) {
            icon.style.cssText = 'display: inline-block !important; visibility: visible !important; opacity: 1 !important; font-size: 20px !important; margin-right: 0 !important; margin-left: 0 !important; width: auto !important; height: auto !important;';
        }
        
        const span = item.querySelector('span');
        if (span) {
            span.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
        }
    });
    
    console.log('Collapsed sidebar styles enforced');
}

function setupNavigation() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-item[href]').forEach((item) => {
        const href = item.getAttribute('href');
        item.classList.remove('active');
        if (!href || href === '#') return;
        let linkPath;
        try {
            linkPath = new URL(href, window.location.origin).pathname;
        } catch (e) {
            linkPath = null;
        }
        if (!linkPath) return;
        if (
            linkPath === currentPath ||
            (currentPath.startsWith(linkPath + '/') && linkPath !== '/')
        ) {
            item.classList.add('active');
        }
    });
}

function setupGlobalEventListeners() {
    // Add any global event listeners here
    document.addEventListener('click', function(e) {
        // Handle global click events if needed
    });
    
    // Setup sidebar search
    setupSidebarSearch();
}

function setupSidebarSearch() {
    const searchBtn = document.getElementById('sidebarSearchBtn');
    const searchModal = document.getElementById('sidebarSearchModal');
    const searchInput = document.getElementById('sidebarSearchInput');
    const searchSubmit = document.getElementById('sidebarSearchSubmit');
    const searchResults = document.getElementById('sidebarSearchResults');
    
    if (!searchBtn || !searchModal) return;
    
    // Open search modal
    searchBtn.addEventListener('click', function() {
        // Remove any existing modal backdrop
        const existingBackdrop = document.querySelector('.modal-backdrop');
        if (existingBackdrop) {
            existingBackdrop.remove();
        }
        
        const modal = new bootstrap.Modal(searchModal, {
            backdrop: 'static',
            keyboard: true
        });
        modal.show();
        
        // Ensure backdrop is visible but not blocking
        setTimeout(() => {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                backdrop.style.zIndex = '1040';
            }
            searchInput.focus();
        }, 100);
    });
    
    // Search function
    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            searchResults.innerHTML = '<p class="text-muted text-center p-3">Enter a search term to find pages...</p>';
            return;
        }
        
        // Get all navigation items
        const navItems = document.querySelectorAll('.nav-item[href], .nav-item[data-page]');
        const results = [];
        
        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const href = item.getAttribute('href') || '#';
            const page = item.getAttribute('data-page') || '';
            
            if (text.includes(query) || page.toLowerCase().includes(query)) {
                const icon = item.querySelector('i');
                const iconClass = icon ? icon.className : 'bi bi-file';
                results.push({
                    text: item.textContent.trim(),
                    href: href,
                    icon: iconClass
                });
            }
        });
        
        // Display results
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="text-muted text-center p-3">No pages found matching your search.</p>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <a href="${result.href}" class="list-group-item list-group-item-action" onclick="bootstrap.Modal.getInstance(document.getElementById('sidebarSearchModal')).hide();">
                    <i class="${result.icon} me-2"></i>
                    ${result.text}
                </a>
            `).join('');
        }
    };
    
    // Search on input
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
    
    // Search on button click
    if (searchSubmit) {
        searchSubmit.addEventListener('click', performSearch);
    }
    
    // Clear results when modal is hidden
    searchModal.addEventListener('hidden.bs.modal', function() {
        searchInput.value = '';
        searchResults.innerHTML = '<p class="text-muted text-center p-3">Enter a search term to find pages...</p>';
    });
}

// Utility functions
function showLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'flex';
    }
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

function showAlert(message, type = 'info') {
    // Create a simple alert system
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the main content
    const mainContent = document.querySelector('.main-content .content-wrapper');
    if (mainContent) {
        mainContent.insertBefore(alertDiv, mainContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Export functions for use in other modules
window.AppUtils = {
    showLoading,
    hideLoading,
    showAlert,
    toggleSidebar
}; 