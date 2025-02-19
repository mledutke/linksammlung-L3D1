// Encryption key (should be changed to a secure random key)
const ENCRYPTION_KEY = 'N&b6vv;6abG_zrpwjI[CQXLXh*)36}{5';
const CORRECT_PASSWORD_HASH = '5a5e23e355dc215ff86ac4e9ebf76253de684b1f3e6786e4ae5a8c27a5577f10';

// Encrypted credentials
const encryptedCredentials = {
    "zoom": {
        "login": "U2FsdGVkX1/K+K+4dVUuGE35HyiQZt9CptAE9RSuktrg7oLcYOpPQrqaKVsUAYTH",
        "password": "U2FsdGVkX1/I/sMe4FK0Xh24ClR20EbuyCNq/RUS2b8="
    },
    "calendly": {
        "login": "U2FsdGVkX1/rAy8IJhcBtWk0LBa3Ohj266i9ffiBm/lSYRxG4IzuCMkIXD9Sqm9m",
        "password": "U2FsdGVkX1+goXDPjai40a1sLnlnzeselH5yWX9/X/k="
    },
    "instagram": {
        "login": "U2FsdGVkX1+oujxZ8Y7SIhFTu7e8o7zCWURyFli3+fY=",
        "password": "U2FsdGVkX1/cvtfPydAumPT825USL0KeMfsEcHuuOko="
    },
    "flyeralarm": {
        "login": "U2FsdGVkX19VfuC59KiWK8ABem7F1Z2JB8yzqjkeNFNLg7nrrHK+Amc2+xe5Dx8m",
        "password": "U2FsdGVkX1/OhqICCZ0LnPtnnAC1c3v3t9oqfeGwb+I="
    },
    "kitalino": {
        "login": "U2FsdGVkX18TkHa7/RqvkHoQB9O+/1k1gfq3otSMNLkSQYz9qh+GfAiMPpUv3Ud3",
        "password": "U2FsdGVkX1/4NF6zZ1E86zbqGxl7mixcuQcnpwZI2l0="
    },
    "google": {
        "email": "U2FsdGVkX19HS7HqLkQPWYuFYHrY4lHqrcRE/PSS5+GbHocSdxhxEb5ZuNcm6BOd",
        "password": "U2FsdGVkX19n2bPKl+aIRe2Jo4qIWPmIEmP7wlnHHNA=",
        "recovery": "U2FsdGVkX1/kNWVGJHINVpcF+2h0EfIT/Uimem7D4iI="
    },
    "api_keys": {
        "google": "U2FsdGVkX1+sPXgwxUYDqQFJaKk/ixkpxGAZeQZR5Xt4Ij5BAJqRLHYPLHEEfGxhxcqHJFxSxLxEkAXXtEJQow==",
        "openai": "U2FsdGVkX1/4QR+5+kX9Y+tX8J9Z2X3Q+sPXgwxUYDqQFJaKk/ixkpxGAZeQZR5Xt4Ij5BAJqRLHYPLHEEfGxhxcqHJFxSxLxEkAXXtEJQow=="
    },
    "outlook": {
        "login": "U2FsdGVkX1+mXe/yNqhg8GG7t8nqFTB/DaZykNQku0tmh3KSUIThhhVIT2YUzsR8",
        "password": "U2FsdGVkX1/1ZTswX89XbfmUYyf2Pme3UrgmXY4l444="
    },
    "weglot": {
        "login": "U2FsdGVkX1+mcK9wZq+EX4Ze3CbP9HYXAxn8xFG/Tiqx2T19M2lsDmXPjW8IsMVd",
        "password": "U2FsdGVkX19rVeYMsQe/EFKHPo94IDjNglj89fqfb38="
    },
    "google_drive": {
        "login": "U2FsdGVkX1+yRQnZedsFEY31CsW4Q5vfUi6/Q8EfpDlqgYuuFAERWcGJU8gQV734",
        "password": "U2FsdGVkX1/hXZEvV4q9iR0t8ghRFQAYwaBQdFnYYLI="
    }
};

// Encryption/Decryption functions using AES
function encrypt(text) {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

function decrypt(ciphertext) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
}

// Hash function for password
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check if user is already logged in and setup theme
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showLinksSection();
    }
    setupCredentialHandlers();
    setupThemeToggle();
    loadDecryptedCredentials();
});

// Theme handling
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on user preference or stored theme
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
        updateThemeIcon(storedTheme === 'dark');
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    }

    // Theme toggle button click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme === 'dark');
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(e.matches);
        }
    });
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('#theme-toggle i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Load and decrypt credentials
function loadDecryptedCredentials() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') return;

    try {
        // Decrypt and populate credentials
        document.querySelectorAll('.credential-value').forEach(element => {
            const serviceType = element.getAttribute('data-service');
            const credentialType = element.getAttribute('data-type');
            
            if (serviceType && credentialType && encryptedCredentials[serviceType]) {
                try {
                    const encryptedValue = encryptedCredentials[serviceType][credentialType];
                    if (!encryptedValue) {
                        console.warn(`No encrypted value found for ${serviceType}.${credentialType}`);
                        return;
                    }

                    const decryptedValue = decrypt(encryptedValue);
                    
                    if (element.classList.contains('password')) {
                        const hiddenText = element.querySelector('.hidden-text');
                        const dots = element.querySelector('.dots');
                        if (hiddenText && dots) {
                            hiddenText.textContent = decryptedValue;
                            dots.textContent = '•'.repeat(decryptedValue.length);
                        }
                    } else {
                        element.textContent = decryptedValue;
                    }
                    
                    // Update copy button value
                    const copyBtn = element.parentElement.querySelector('.copy-btn');
                    if (copyBtn) {
                        copyBtn.setAttribute('data-value', decryptedValue);
                    }
                } catch (decryptError) {
                    console.error(`Failed to decrypt ${serviceType}.${credentialType}:`, decryptError);
                }
            }
        });
    } catch (error) {
        console.error('Error in loadDecryptedCredentials:', error);
        logout(); // Force logout if decryption fails
    }
}

async function checkPassword() {
    const passwordInput = document.getElementById('password');
    const stayLoggedIn = document.getElementById('stayLoggedIn');
    const errorMessage = document.getElementById('error-message');
    
    try {
        const hashedInput = await hashPassword(passwordInput.value);
        
        if (hashedInput === CORRECT_PASSWORD_HASH) {
            if (stayLoggedIn.checked) {
                localStorage.setItem('isLoggedIn', 'true');
            } else {
                sessionStorage.setItem('isLoggedIn', 'true');
            }
            showLinksSection();
            loadDecryptedCredentials();
            errorMessage.textContent = '';
            passwordInput.value = '';
        } else {
            errorMessage.textContent = 'Falsches Passwort. Bitte versuchen Sie es erneut.';
            passwordInput.value = '';
        }
    } catch (error) {
        errorMessage.textContent = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
        passwordInput.value = '';
    }
}

function showLinksSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('links-section').classList.remove('hidden');
}

function logout() {
    sessionStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isLoggedIn');
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('links-section').classList.add('hidden');
}

// Add enter key support for password input
document.getElementById('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Setup handlers for credentials
function setupCredentialHandlers() {
    // Setup copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const value = btn.dataset.value;
            try {
                await navigator.clipboard.writeText(value);
                showToast('Kopiert!');
                btn.classList.add('copied');
                setTimeout(() => btn.classList.remove('copied'), 2000);
            } catch (err) {
                showToast('Kopieren fehlgeschlagen');
            }
        });
    });

    // Setup password toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const passwordElement = btn.parentElement.querySelector('.password');
            const icon = btn.querySelector('i');
            
            if (passwordElement.classList.contains('show')) {
                passwordElement.classList.remove('show');
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordElement.classList.add('show');
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });
}

// Toast notification
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
} 