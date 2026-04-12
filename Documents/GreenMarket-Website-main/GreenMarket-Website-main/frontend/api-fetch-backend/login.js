    const loginForm = document.querySelector('form');
    
    loginForm.addEventListener('submit', async (e) => {
       
        e.preventDefault();
        
       
        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        try {
            
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

           if (response.ok) {
            alert("Selamat datang, " + data.user.nama_lengkap + "!");
            

            localStorage.setItem('userName', data.user.nama_lengkap);
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userId', data.user.id);
       
            if (data.user.role === 'admin') {
                
                window.location.href = "adminPanel.html";
            } else {
                
                window.location.href = "katalog.html";
            }
        } else {
            alert(data.message);
        }
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal terhubung ke server. Pastikan Backend sudah nyala!");
        }
    });
