/**
 * Decodelabs Project 4 - Advanced Validation & Client-Side Data Storage Engine
 * Optimized for seamless execution on live deployment environments (GitHub Pages)
 */
document.addEventListener('DOMContentLoaded', () => {
    const formElement = document.getElementById('registrationForm');
    const bannerElement = document.getElementById('formSummaryBanner');
    
    // Core Validation Configuration Schema
    const validationMap = {
        fullName: {
            dom: document.getElementById('fullName'),
            validate: (val) => val.trim().length >= 3,
            errorMsg: 'Full name must contain at least 3 characters.'
        },
        emailAddress: {
            dom: document.getElementById('emailAddress'),
            validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            errorMsg: 'Provide a structurally valid email address.'
        },
        accountPassword: {
            dom: document.getElementById('accountPassword'),
            validate: (val) => val.length >= 8,
            errorMsg: 'Password must be at least 8 characters long.'
        },
        confirmPassword: {
            dom: document.getElementById('confirmPassword'),
            validate: (val) => val === document.getElementById('accountPassword').value,
            errorMsg: 'Cross-field check failed: Passwords do not match.'
        }
    };

    // Attach real-time input validation listeners
    Object.keys(validationMap).forEach(key => {
        const inputObj = validationMap[key];
        inputObj.dom.addEventListener('input', () => {
            evaluateInputElement(inputObj);
        });
    });

    function evaluateInputElement(inputObj) {
        const value = inputObj.dom.value;
        const isValid = inputObj.validate(value);
        const feedbackContainer = inputObj.dom.nextElementSibling;

        if (isValid) {
            inputObj.dom.classList.remove('is-invalid');
            inputObj.dom.classList.add('is-valid');
            feedbackContainer.textContent = '';
            return true;
        } else {
            inputObj.dom.classList.remove('is-valid');
            inputObj.dom.classList.add('is-invalid');
            feedbackContainer.textContent = inputObj.errorMsg;
            return false;
        }
    }

    // Intercept Form Submission Pipeline
    formElement.addEventListener('submit', (event) => {
        event.preventDefault();
        bannerElement.classList.add('hidden');

        let isFormValid = true;
        Object.keys(validationMap).forEach(key => {
            const isValid = evaluateInputElement(validationMap[key]);
            if (!isValid) isFormValid = false;
        });

        // 1. INPUT STAGE EXCEPTION CONTROL
        if (!isFormValid) {
            bannerElement.className = "summary-banner error";
            bannerElement.textContent = "Submission rejected: Client-side validation checks failed.";
            bannerElement.classList.remove('hidden');
            return;
        }

        // 2. PROCESS STAGE: Bundle Data and Commit to Persistent Browser Storage Layer
        const newUserPayload = {
            id: 'USER_' + Date.now(),
            name: validationMap.fullName.dom.value.trim(),
            email: validationMap.emailAddress.dom.value.trim(),
            password: btoa(validationMap.accountPassword.dom.value), // Basic Base64 encoding for data obfuscation
            timestamp: new Date().toISOString()
        };

        try {
            // Retrieve existing data collection from pseudo-backend space
            const existingUsers = JSON.parse(localStorage.getItem('decodelabs_registered_users')) || [];
            
            // Duplicate verification check
            const isDuplicate = existingUsers.some(user => user.email === newUserPayload.email);
            if (isDuplicate) {
                bannerElement.className = "summary-banner error";
                bannerElement.textContent = "Backend Record Conflict: This email address is already registered.";
                bannerElement.classList.remove('hidden');
                return;
            }

            // Push payload to user store array
            existingUsers.push(newUserPayload);
            localStorage.setItem('decodelabs_registered_users', JSON.stringify(existingUsers));

            // Log output to developer console to verify back-end integrity structure
            console.log("=================================================");
            console.log("📂 DATA RETENTION SUCCESS: RECORD STORED IN BACKEND BUFFER");
            console.log("Current DB Commit Table Status:", existingUsers);
            console.log("=================================================");

            // 3. OUTPUT STAGE: Update UI to announce success
            bannerElement.className = "summary-banner success";
            bannerElement.textContent = "Success: Payload securely verified and committed to persistent data engine.";
            
            // Clean interface fields
            formElement.reset();
            Object.keys(validationMap).forEach(key => {
                validationMap[key].dom.classList.remove('is-valid');
            });

        } catch (error) {
            bannerElement.className = "summary-banner error";
            bannerElement.textContent = "Critical Exception: Failed to execute write operation on the storage pipeline.";
        }

        bannerElement.classList.remove('hidden');
    });
});
