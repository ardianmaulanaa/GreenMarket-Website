 const registerForm = document.querySelector('form');
    
    registerForm.addEventListener('submit', async (e) => {
      
        e.preventDefault();
        
        
        const inputs = document.querySelectorAll('input');
        const nama_lengkap = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const agreement = inputs[3].checked; 


        if (!agreement) {
            alert("Anda harus menyetujui Syarat & Ketentuan!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama_lengkap, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                
                alert("Registrasi Berhasil! Silakan masuk.");
                window.location.href = "login.html";
            } else {
              
                alert(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal terhubung ke server. Pastikan backend (server.js) sudah nyala!");
        }
    });