/**
 * Project 4 Client Pipeline Script Module
 * Implements client-side input validation workflows
 */
document.addEventListener('DOMContentLoaded', () => {
    const formElement = document.getElementById('registrationForm');
    const bannerElement = document.getElementById('formSummaryBanner');
    
    // Core Configuration Validation Assertions
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

    // Attach immediate interactive input event loops to form elements
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

    // Intercept form submission
    formElement.addEventListener('submit', async (event) => {
        event.preventDefault();
        bannerElement.classList.add('hidden');

        let isFormValid = true;
        Object.keys(validationMap).forEach(key => {
            const isValid = evaluateInputElement(validationMap[key]);
            if (!isValid) isFormValid = false;
        });

        if (!isFormValid) {
            bannerElement.className = "summary-banner error";
            bannerElement.textContent = "Submission rejected: Client-side validation failed.";
            bannerElement.classList.remove('hidden');
            return;
        }

        // Bundle data payload for transmission
        const formDataPayload = {
            name: validationMap.fullName.dom.value,
            email: validationMap.emailAddress.dom.value,
            password: validationMap.accountPassword.dom.value
        };

        try {
            // Post payload data directly to our backend server API endpoint
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDataPayload)
            });

            const result = await response.json();

            if (response.ok) {
                bannerElement.className = "summary-banner success";
                bannerElement.textContent = `Success: ${result.message}`;
                formElement.reset();
                Object.keys(validationMap).forEach(key => {
                    validationMap[key].dom.classList.remove('is-valid');
                });
            } else {
                bannerElement.className = "summary-banner error";
                bannerElement.textContent = `Server Error: ${result.error}`;
            }
        } catch (error) {
            bannerElement.className = "summary-banner error";
            bannerElement.textContent = "Critical System Error: Connection to validation server failed.";
        }
        
        bannerElement.classList.remove('hidden');
    });
});
