/**
 * EduTest Script - Logic for Login, Dashboard, and Course pages
 * Designed with clear IDs and states for automation testing.
 */

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('login.html') || path === '/' || path.endsWith('/')) {
        initLoginPage();
    } else if (path.includes('register.html')) {
        initRegisterPage();
    } else if (path.includes('dashboard.html')) {
        initDashboardPage();
    } else if (path.includes('course.html')) {
        initCoursePage();
    }
});

// --- Login Page Logic ---
function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const togglePassword = document.getElementById('toggle-password');
    const rememberMe = document.getElementById('remember-me');
    const errorMsg = document.getElementById('login-error');
    const themeToggle = document.getElementById('theme-toggle');

    if (!loginForm) return;

    // Password Visibility Toggle
    togglePassword?.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Simulated Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Simple validation for testing
        if (username === '' || password === '') {
            showError('Please fill in all fields');
            return;
        }

        if (username.length < 5) {
            showError('Username must be at least 5 characters');
            return;
        }

        // Mock success
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userFound = registeredUsers.find(u => 
            (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) 
            && u.password === password
        );

        if ((username.toLowerCase() === 'admin' && password === 'password123') || userFound) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            
            setTimeout(() => {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', userFound ? userFound.username : username);
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showError('Invalid username or password');
        }
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
        setTimeout(() => errorMsg.classList.add('hidden'), 3000);
    }

    // Theme Toggle
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Check saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
}

// --- Register Page Logic ---
function initRegisterPage() {
    const registerForm = document.getElementById('register-form');
    const usernameInput = document.getElementById('reg-username');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const registerBtn = document.getElementById('register-btn');
    const errorMsg = document.getElementById('register-error');
    const successMsg = document.getElementById('register-success');
    const themeToggle = document.getElementById('theme-toggle');

    if (!registerForm) return;

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        // Mock registration
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating account...';
        
        setTimeout(() => {
            // Save user to localStorage for simulated persistence
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            registeredUsers.push({ username, email, password });
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

            successMsg.classList.remove('hidden');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }, 1000);
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
        setTimeout(() => errorMsg.classList.add('hidden'), 3000);
    }

    // Theme Toggle
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
}

// --- Dashboard Page Logic ---
function initDashboardPage() {
    const searchInput = document.getElementById('course-search');
    const filterSelect = document.getElementById('category-filter');
    const courseGrid = document.getElementById('course-grid');
    const welcomeMsg = document.getElementById('welcome-user');
    const logoutBtn = document.getElementById('logout-btn');
    const notificationBtn = document.getElementById('notification-btn');

    if (!courseGrid) return;

    // Check Auth
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    const user = localStorage.getItem('user') || 'Student';
    if (welcomeMsg) welcomeMsg.textContent = `Welcome back, ${user}!`;

    // Logout
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    });

    // Stats Simulation
    const enrolledCount = localStorage.getItem('enrolledCount') || '0';
    const enrolledStat = document.querySelector('#stat-enrolled p.text-4xl');
    if (enrolledStat) enrolledStat.textContent = enrolledCount;

    // Search & Filter Simulation
    const courses = [
        { id: 1, title: 'Introduction to Python', category: 'Programming', level: 'Beginner', price: '$49' },
        { id: 2, title: 'Advanced Web Development', category: 'Web', level: 'Advanced', price: '$99' },
        { id: 3, title: 'Data Science Fundamentals', category: 'Data', level: 'Intermediate', price: '$79' },
        { id: 4, title: 'UI/UX Design Masterclass', category: 'Design', level: 'Beginner', price: '$59' },
        { id: 5, title: 'Machine Learning with R', category: 'Data', level: 'Advanced', price: '$129' },
        { id: 6, title: 'React.js for Beginners', category: 'Web', level: 'Beginner', price: '$69' },
    ];

    function renderCourses(filtered) {
        courseGrid.innerHTML = '';
        filtered.forEach(course => {
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer course-card';
            card.id = `course-${course.id}`;
            card.innerHTML = `
                <img src="https://picsum.photos/seed/${course.id}/400/200" class="rounded-lg mb-3 w-full h-32 object-cover" alt="${course.title}">
                <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">${course.category}</span>
                <h3 class="font-bold text-lg mt-1">${course.title}</h3>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-slate-500 text-sm">${course.level}</span>
                    <span class="font-bold text-indigo-600">${course.price}</span>
                </div>
                <button class="w-full mt-4 test-button py-2 view-details-btn" data-id="${course.id}">View Details</button>
            `;
            courseGrid.appendChild(card);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                window.location.href = `course.html?id=${id}`;
            });
        });
    }

    renderCourses(courses);

    searchInput?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = courses.filter(c => c.title.toLowerCase().includes(term));
        renderCourses(filtered);
    });

    filterSelect?.addEventListener('change', (e) => {
        const cat = e.target.value;
        const filtered = cat === 'All' ? courses : courses.filter(c => c.category === cat);
        renderCourses(filtered);
    });

    notificationBtn?.addEventListener('click', () => {
        alert('You have 3 new notifications!');
    });
}

// --- Course Page Logic ---
function initCoursePage() {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');
    const enrollBtn = document.getElementById('enroll-btn');
    const couponInput = document.getElementById('coupon-code');
    const applyCouponBtn = document.getElementById('apply-coupon');
    const totalPrice = document.getElementById('total-price');
    const enrollmentForm = document.getElementById('enrollment-form');
    const successModal = document.getElementById('success-modal');

    if (!enrollmentForm) return;

    // Mock course data fetch
    const courseData = {
        '1': { title: 'Introduction to Python', price: 49 },
        '2': { title: 'Advanced Web Development', price: 99 },
        '3': { title: 'Data Science Fundamentals', price: 79 },
        '4': { title: 'UI/UX Design Masterclass', price: 59 },
        '5': { title: 'Machine Learning with R', price: 129 },
        '6': { title: 'React.js for Beginners', price: 69 },
    };

    const course = courseData[courseId] || courseData['1'];
    document.getElementById('course-title').textContent = course.title;
    totalPrice.textContent = `$${course.price}`;

    // Coupon logic
    applyCouponBtn?.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (code === 'SAVE20') {
            const discounted = (course.price * 0.8).toFixed(2);
            totalPrice.textContent = `$${discounted}`;
            alert('Coupon applied! 20% off.');
        } else {
            alert('Invalid coupon code');
        }
    });

    // Enrollment Form
    enrollmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const terms = document.getElementById('terms-check').checked;

        if (!terms) {
            alert('Please accept the terms and conditions');
            return;
        }

        enrollBtn.disabled = true;
        enrollBtn.textContent = 'Processing...';

        setTimeout(() => {
            // Increment enrollment count
            const currentCount = parseInt(localStorage.getItem('enrolledCount') || '0');
            localStorage.setItem('enrolledCount', (currentCount + 1).toString());

            successModal.classList.remove('hidden');
            successModal.classList.add('flex');
        }, 1500);
    });

    document.getElementById('close-modal')?.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
}
