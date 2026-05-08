// Navigation component JavaScript

// Handle navigation item clicks
document.addEventListener('DOMContentLoaded', function() {
    setupNavigationHandlers();
    setupCollapsibleGroups();
});

function setupNavigationHandlers() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active class from all items
            navItems.forEach(ni => ni.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Store the active page in localStorage
            const page = this.getAttribute('data-page');
            if (page) {
                localStorage.setItem('activePage', page);
            }
        });
    });
    
    // Restore active page from localStorage
    const activePage = localStorage.getItem('activePage');
    if (activePage) {
        const activeItem = document.querySelector(`[data-page="${activePage}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }
}

// Handle mobile navigation
function setupMobileNavigation() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 998;
        display: none;
    `;
    
    document.body.appendChild(overlay);
    
    // Show sidebar on mobile
    function showMobileSidebar() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('show');
            overlay.style.display = 'block';
        }
    }
    
    // Hide sidebar on mobile
    function hideMobileSidebar() {
        sidebar.classList.remove('show');
        overlay.style.display = 'none';
    }
    
    // Close sidebar when clicking overlay
    overlay.addEventListener('click', hideMobileSidebar);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hideMobileSidebar();
        }
    });
    
    // Add mobile menu button if needed
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'btn btn-primary d-md-none';
    mobileMenuBtn.innerHTML = '<i class="bi bi-list"></i>';
    mobileMenuBtn.style.cssText = `
        position: fixed;
        top: 80px;
        left: 10px;
        z-index: 999;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: none;
    `;
    
    mobileMenuBtn.addEventListener('click', showMobileSidebar);
    document.body.appendChild(mobileMenuBtn);
    
    // Show/hide mobile menu button based on screen size
    function updateMobileMenuVisibility() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
        } else {
            mobileMenuBtn.style.display = 'none';
        }
    }
    
    updateMobileMenuVisibility();
    window.addEventListener('resize', updateMobileMenuVisibility);
}

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', function() {
    setupMobileNavigation();
});

// Setup collapsible navigation groups
function setupCollapsibleGroups() {
    const groupHeaders = document.querySelectorAll('.nav-group-header');
    const sidebar = document.getElementById('sidebar');
    
    groupHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link inside the header
            if (e.target.tagName === 'A') {
                return;
            }
            
            const groupName = this.getAttribute('data-group');
            const groupItems = document.querySelector(`.nav-group-items[data-group="${groupName}"]`);
            const toggleIcon = this.querySelector('.group-toggle');
            const isSidebarCollapsed = sidebar && sidebar.classList.contains('collapsed');
            
            if (groupItems) {
                // Toggle collapsed state
                const isCollapsed = groupItems.classList.contains('collapsed');
                
                if (isCollapsed) {
                    // Expand
                    groupItems.classList.remove('collapsed');
                    this.classList.remove('collapsed');
                    if (isSidebarCollapsed) {
                        this.classList.add('expanded');
                    }
                    if (toggleIcon) {
                    toggleIcon.style.transform = 'rotate(0deg)';
                    }
                } else {
                    // Collapse
                    groupItems.classList.add('collapsed');
                    this.classList.add('collapsed');
                    if (isSidebarCollapsed) {
                        this.classList.remove('expanded');
                    }
                    if (toggleIcon) {
                    toggleIcon.style.transform = 'rotate(-90deg)';
                    }
                }
                
                // Store state in localStorage
                localStorage.setItem(`nav-group-${groupName}`, !isCollapsed);
                
                // Force a reflow to ensure CSS updates
                void groupItems.offsetHeight;
            }
        });
    });
    
    // Groups are already collapsed in HTML - don't modify them to prevent layout shifts
    // Just ensure toggle icons are rotated if not already
    groupHeaders.forEach(header => {
        const toggleIcon = header.querySelector('.group-toggle');
        if (toggleIcon && !toggleIcon.style.transform) {
            toggleIcon.style.transform = 'rotate(-90deg)';
        }
    });
    
    // Update expanded state when sidebar is toggled
    if (sidebar) {
        const observer = new MutationObserver(() => {
            const isCollapsed = sidebar.classList.contains('collapsed');
            groupHeaders.forEach(header => {
                const groupName = header.getAttribute('data-group');
                const groupItems = document.querySelector(`.nav-group-items[data-group="${groupName}"]`);
                const isGroupCollapsed = groupItems && groupItems.classList.contains('collapsed');
                
                if (isCollapsed) {
                    // When sidebar collapses, use 'expanded' class to show items
                    if (!isGroupCollapsed) {
                        header.classList.add('expanded');
                    } else {
                        header.classList.remove('expanded');
                    }
                } else {
                    // When sidebar expands, remove 'expanded' class (normal behavior)
                    header.classList.remove('expanded');
                }
            });
        });
        
        observer.observe(sidebar, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

// Export navigation functions
window.Navigation = {
    setupNavigationHandlers,
    setupMobileNavigation,
    setupCollapsibleGroups
}; 