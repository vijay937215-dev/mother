import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// IMPORTANT: Replace these with your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://snungifjhykwpqnqcvoe.supabase.co';
const supabaseKey = 'sb_publishable_lNSCJ1wO7920mQvMLmnfhg_3t9qqLkd';

let supabase;

try {
    supabase = createClient(supabaseUrl, supabaseKey);
} catch (e) {
    console.error("Supabase client initialization failed. Please check your credentials.", e);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorMsg = document.getElementById('errorMsg');
    const successState = document.getElementById('successState');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset state
        errorMsg.classList.add('hidden');
        errorMsg.textContent = '';
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const year = document.getElementById('year').value;
        const department = document.getElementById('department').value.trim();
        
        // Validation
        if (!name || !phone || !email || !year || !department) {
            showError("Please fill in all required fields.");
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError("Please enter a valid email address.");
            return;
        }
        
        // Phone validation (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            showError("Please enter a valid 10-digit phone number.");
            return;
        }

        // Disable button, show loading
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Registering...</span>';
        
        try {
            // First check if email or phone already exists
            const { data: existingRegistrations, error: checkError } = await supabase
                .from('registrations')
                .select('id')
                .or(`email.eq.${email},phone.eq.${phone}`)
                .limit(1);
                
            if (checkError) throw checkError;
            
            if (existingRegistrations && existingRegistrations.length > 0) {
                throw new Error("A registration with this email or phone number already exists.");
            }

            // Insert new registration - common for both events
            const { error: insertError } = await supabase
                .from('registrations')
                .insert([
                    {
                        name: name,
                        phone: phone,
                        email: email,
                        year: year,
                        department: department,
                        status: 'registered',
                        created_at: new Date().toISOString()
                    }
                ]);

            if (insertError) throw insertError;
            
            // Show success state
            form.style.display = 'none';
            successState.classList.remove('hidden');
            
        } catch (error) {
            console.error('Registration error:', error);
            // Fallback for demo without real Supabase credentials
            if (supabaseUrl === 'YOUR_SUPABASE_URL') {
                console.log("Demo mode: Showing success state since Supabase credentials are not set.");
                form.style.display = 'none';
                successState.classList.remove('hidden');
            } else {
                showError(error.message || "An error occurred during registration. Please try again.");
            }
        } finally {
            // Restore button if error (if success, form is hidden anyway)
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
    
    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
    }
});
