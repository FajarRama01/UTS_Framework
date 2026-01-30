const API_BASE = 'http://127.0.0.1:8000/api';

// 1. FUNGSI LOGIN
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const alertBox = document.getElementById('alertMessage');

    try {
        const response = await fetch(`${API_BASE}/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Simpan Token di LocalStorage (Browser Memory)
            localStorage.setItem('lms_token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alertBox.innerHTML = `<div class="alert alert-danger">Login Gagal: Username/Password salah</div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        alertBox.innerHTML = `<div class="alert alert-danger">Gagal koneksi ke server Backend</div>`;
    }
}

// 2. FUNGSI LOGOUT
function logout() {
    localStorage.removeItem('lms_token');
    window.location.href = 'login.html';
}

// 3. CEK AUTH (Proteksi Halaman)
function checkAuth() {
    const token = localStorage.getItem('lms_token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// 4. LOAD DATA KELAS (GET API)
async function loadKelas(query = '') {
    const token = localStorage.getItem('lms_token');
    const container = document.getElementById('kelasContainer');
    const loading = document.getElementById('loading');
    
    // URL support search (P10)
    let url = `${API_BASE}/kelas/?ordering=-tanggal_mulai`;
    if (query) {
        url += `&search=${query}`;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`, // Header wajib (P9)
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        // Bersihkan loading & container
        loading.style.display = 'none';
        container.innerHTML = '';

        if (data.results.length === 0) {
            container.innerHTML = `<div class="col-12 text-center text-muted"><h5>Tidak ada kelas ditemukan</h5></div>`;
            return;
        }

        // Render Card (Manipulasi DOM P11)
        data.results.forEach(kelas => {
            // Tentukan warna badge berdasarkan tingkat
            let badgeColor = 'bg-secondary';
            if(kelas.tingkat === 'beginner') badgeColor = 'bg-success';
            if(kelas.tingkat === 'intermediate') badgeColor = 'bg-warning text-dark';
            if(kelas.tingkat === 'advanced') badgeColor = 'bg-danger';

            const cardHTML = `
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm border-0 hover-effect">
                        <div class="card-header bg-white border-bottom-0 pt-3">
                            <span class="badge ${badgeColor} rounded-pill text-uppercase">${kelas.tingkat}</span>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-dark">${kelas.judul}</h5>
                            <p class="card-text text-muted small">${kelas.deskripsi.substring(0, 80)}...</p>
                            
                            <div class="d-flex align-items-center mt-3">
                                <div class="flex-shrink-0">
                                    <div class="bg-light rounded-circle p-2 text-primary">
                                        <i class="bi bi-person-fill"></i>
                                    </div>
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <span class="fw-semibold small d-block">${kelas.nama_instruktur || 'Instruktur'}</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-white border-top-0 pb-4">
                            <a href="detail.html?id=${kelas.id}" class="btn btn-outline-primary w-100 fw-bold">
                                Lihat Materi & Daftar <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;

            // const cardHTML = `
            //     <div class="col-md-4">
            //         <div class="card h-100 shadow-sm border-0">
            //             <div class="card-header bg-white border-bottom-0 pt-3">
            //                 <span class="badge ${badgeColor} rounded-pill text-uppercase">${kelas.tingkat}</span>
            //             </div>
            //             <div class="card-body">
            //                 <h5 class="card-title fw-bold">${kelas.judul}</h5>
            //                 <p class="card-text text-muted small">${kelas.deskripsi.substring(0, 80)}...</p>
            //                 <div class="d-flex align-items-center mt-3">
            //                     <div class="flex-shrink-0">
            //                         <div class="bg-light rounded-circle p-2 text-primary">
            //                             <i class="bi bi-person-fill"></i>
            //                         </div>
            //                     </div>
            //                     <div class="flex-grow-1 ms-3">
            //                         <small class="text-muted d-block">Instruktur</small>
            //                         <span class="fw-semibold small">${kelas.nama_instruktur || 'Instruktur Tamu'}</span>
            //                     </div>
            //                 </div>
            //             </div>
            //             <div class="card-footer bg-white border-top-0 pb-3">
            //                  <small class="text-muted"><i class="bi bi-calendar"></i> ${kelas.tanggal_mulai}</small>
            //             </div>
            //         </div>
            //     </div>
            // `;
            container.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error(error);
        loading.innerHTML = '<p class="text-danger">Gagal memuat data API.</p>';
    }
}

// 5. FUNGSI SEARCH (Debounce sederhana)
let searchTimeout;
function searchKelas() {
    const query = document.getElementById('searchInput').value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        document.getElementById('kelasContainer').innerHTML = '';
        document.getElementById('loading').style.display = 'block';
        loadKelas(query);
    }, 500); // Tunggu 0.5 detik setelah ketik
}

// ... (Kode handleLogin, checkAuth, dll TETAP ADA di atas) ...

// 6. FUNGSI LOAD DETAIL KELAS & MATERI
async function loadDetailKelas(id) {
    const token = localStorage.getItem('lms_token');
    const contentDiv = document.getElementById('mainContent');

    try {
        // A. Ambil Info Kelas
        const resKelas = await fetch(`${API_BASE}/kelas/${id}/`, {
            headers: { 'Authorization': `Token ${token}` }
        });
        const kelas = await resKelas.json();

        // B. Ambil Daftar Materi (Filter by Kelas ID - Fitur P10)
        const resMateri = await fetch(`${API_BASE}/materi/?kelas=${id}`, {
            headers: { 'Authorization': `Token ${token}` }
        });
        const dataMateri = await resMateri.json();

        // C. Render HTML
        contentDiv.innerHTML = `
            <div class="col-md-4 mb-4">
                <div class="card shadow border-0">
                    <div class="card-body">
                        <span class="badge bg-primary mb-2 text-uppercase">${kelas.tingkat}</span>
                        <h2 class="fw-bold">${kelas.judul}</h2>
                        <p class="text-muted mt-3">${kelas.deskripsi}</p>
                        <hr>
                        <div class="d-flex align-items-center mb-3">
                            <i class="bi bi-person-circle fs-4 text-secondary me-2"></i>
                            <div>
                                <small class="text-muted">Instruktur</small>
                                <div class="fw-bold">${kelas.nama_instruktur || 'Tim Pengajar'}</div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mb-4">
                            <i class="bi bi-calendar-check fs-4 text-secondary me-2"></i>
                            <div>
                                <small class="text-muted">Mulai Kelas</small>
                                <div class="fw-bold">${kelas.tanggal_mulai}</div>
                            </div>
                        </div>
                        <button onclick="daftarKelas(${kelas.id})" class="btn btn-success w-100 py-2 fw-bold">
                            <i class="bi bi-check-circle-fill"></i> Daftar Kelas Ini
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <h4 class="fw-bold mb-3"><i class="bi bi-journal-text"></i> Silabus Materi</h4>
                <div class="list-group shadow-sm">
                    ${dataMateri.results.length === 0 ? 
                        '<div class="list-group-item p-4 text-center text-muted">Belum ada materi yang diupload.</div>' : 
                        dataMateri.results.map(materi => `
                            <div class="list-group-item list-group-item-action p-3 border-start border-4 border-primary">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1 fw-bold">#${materi.urutan} ${materi.judul}</h5>
                                    <small class="text-muted">${new Date(materi.tanggal_upload).toLocaleDateString()}</small>
                                </div>
                                <p class="mb-1 text-muted small">${materi.isi.substring(0, 100)}...</p>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        contentDiv.innerHTML = `<div class="alert alert-danger">Gagal memuat data.</div>`;
    }
}

// 7. FUNGSI DAFTAR KELAS (POST API)
async function daftarKelas(kelasId) {
    const token = localStorage.getItem('lms_token');
    const alertArea = document.getElementById('alertArea');

    if(!confirm("Yakin ingin mendaftar kelas ini?")) return;

    try {
        const response = await fetch(`${API_BASE}/pendaftaran/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            // Kita hanya kirim ID Kelas. ID Siswa otomatis diambil Backend dari Token.
            body: JSON.stringify({ kelas: kelasId })
        });

        if (response.ok) {
            alertArea.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Berhasil!</strong> Anda telah terdaftar di kelas ini.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        } else {
            // Biasanya error karena sudah terdaftar (Unique Together di Models)
            alertArea.innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Ups!</strong> Anda mungkin sudah terdaftar di kelas ini sebelumnya.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        }
    } catch (error) {
        alert("Terjadi kesalahan koneksi.");
    }
}

// 8. FUNGSI LOAD KELAS SAYA (GET API /pendaftaran/)
async function loadKelasSaya() {
    const token = localStorage.getItem('lms_token');
    const container = document.getElementById('myCoursesContainer');
    const loading = document.getElementById('loading');

    try {
        const response = await fetch(`${API_BASE}/pendaftaran/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        loading.style.display = 'none';
        container.innerHTML = '';

        if (data.results.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" width="100" class="mb-3 opacity-50">
                    <h5 class="text-muted">Anda belum mendaftar kelas apapun.</h5>
                    <a href="dashboard.html" class="btn btn-primary mt-2">Cari Kelas Sekarang</a>
                </div>
            `;
            return;
        }

        // Render Card Pendaftaran
        data.results.forEach(item => {
            // item.judul_kelas & item.kelas (ID) berasal dari PendaftaranSerializer yang kita buat di Tahap 1
            const cardHTML = `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm border-0 border-start border-5 border-success">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${item.judul_kelas}</h5>
                            <p class="text-muted small mb-3">
                                <i class="bi bi-calendar-check"></i> Terdaftar sejak: ${new Date(item.tanggal_daftar).toLocaleDateString()}
                            </p>
                            
                            <div class="progress mb-3" style="height: 8px;">
                                <div class="progress-bar bg-success" role="progressbar" style="width: ${item.selesai ? '100%' : '10%'}" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <small class="text-muted d-block mb-3">${item.selesai ? 'Selesai' : 'Sedang Berjalan (10%)'}</small>

                            <a href="belajar.html?kelas=${item.kelas}" class="btn btn-primary w-100 fw-bold">
                                <i class="bi bi-book-half"></i> Mulai Belajar
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error(error);
        loading.innerHTML = '<p class="text-danger">Gagal memuat data kelas saya.</p>';
    }
}

// ... (Kode sebelumnya tetap ada) ...

// 9. FUNGSI HALAMAN BELAJAR (Logic Paling Kompleks)
async function loadHalamanBelajar(kelasId) {
    const token = localStorage.getItem('lms_token');
    
    // Ambil ID materi yang sedang aktif dari URL (jika ada)
    const urlParams = new URLSearchParams(window.location.search);
    let activeMateriId = urlParams.get('materi'); // Bisa null jika baru buka

    try {
        // A. Ambil Data Kelas (Untuk Judul di Navbar)
        const resKelas = await fetch(`${API_BASE}/kelas/${kelasId}/`, {
            headers: { 'Authorization': `Token ${token}` }
        });
        const dataKelas = await resKelas.json();
        document.getElementById('judulKelasTop').innerText = dataKelas.judul;

        // B. Ambil Semua Materi di Kelas ini (Diurutkan)
        const resMateri = await fetch(`${API_BASE}/materi/?kelas=${kelasId}&ordering=urutan`, {
            headers: { 'Authorization': `Token ${token}` }
        });
        const data = await resMateri.json();
        const listMateri = data.results;

        // Jika tidak ada materi
        if (listMateri.length === 0) {
            document.getElementById('kontenArea').innerHTML = "<h5>Belum ada materi di kelas ini.</h5>";
            return;
        }

        // Jika tidak ada materi aktif di URL, pilih materi pertama (urutan 1)
        if (!activeMateriId) {
            activeMateriId = listMateri[0].id;
        } else {
            activeMateriId = parseInt(activeMateriId);
        }

        // C. Render Sidebar & Cari Index Materi Aktif
        const sidebar = document.getElementById('sidebarList');
        sidebar.innerHTML = '';
        
        let currentIndex = -1;

        listMateri.forEach((materi, index) => {
            // Cek apakah ini materi yang sedang aktif
            const isActive = (materi.id === activeMateriId);
            if (isActive) currentIndex = index;

            // Render List Item
            sidebar.innerHTML += `
                <a href="belajar.html?kelas=${kelasId}&materi=${materi.id}" 
                   class="list-group-item list-group-item-action py-3 ${isActive ? 'materi-active' : ''}">
                    <small class="text-muted">Materi #${materi.urutan}</small>
                    <div class="fw-semibold">${materi.judul}</div>
                </a>
            `;
        });

        // D. Tampilkan Konten Materi Aktif
        if (currentIndex !== -1) {
            const currentMateri = listMateri[currentIndex];
            const kontenDiv = document.getElementById('kontenArea');
            
            // Format tanggal
            const tgl = new Date(currentMateri.tanggal_upload).toLocaleDateString('id-ID', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            });

            kontenDiv.innerHTML = `
                <span class="badge bg-primary mb-3">Materi #${currentMateri.urutan}</span>
                <h1 class="fw-bold mb-2">${currentMateri.judul}</h1>
                <p class="text-muted border-bottom pb-3 mb-4">
                    <i class="bi bi-clock"></i> Diupload pada: ${tgl}
                </p>
                
                <div class="fs-5 lh-lg text-dark" style="text-align: justify;">
                    ${currentMateri.isi.replace(/\n/g, '<br>')}
                </div>
            `;

            // E. Logic Tombol Next / Prev
            const btnPrev = document.getElementById('btnPrev');
            const btnNext = document.getElementById('btnNext');

            // Handle Tombol Previous
            if (currentIndex > 0) {
                const prevId = listMateri[currentIndex - 1].id;
                btnPrev.disabled = false;
                btnPrev.onclick = () => window.location.href = `belajar.html?kelas=${kelasId}&materi=${prevId}`;
            } else {
                btnPrev.disabled = true;
            }

            // Handle Tombol Next
            if (currentIndex < listMateri.length - 1) {
                const nextId = listMateri[currentIndex + 1].id;
                btnNext.onclick = () => window.location.href = `belajar.html?kelas=${kelasId}&materi=${nextId}`;
                btnNext.innerHTML = `Selanjutnya <i class="bi bi-arrow-right"></i>`;
            } else {
                // Jika materi terakhir
                btnNext.className = "btn btn-success px-4";
                btnNext.innerHTML = `<i class="bi bi-check-circle"></i> Selesai Belajar`;
                btnNext.onclick = () => window.location.href = 'kelas_saya.html';
            }
        }

    } catch (error) {
        console.error(error);
        alert("Gagal memuat materi.");
    }
}

// ==========================================
// FITUR ADMIN DASHBOARD (VERSI LENGKAP & FINAL)
// ==========================================

// 10. NAVIGASI MENU (SPA Sederhana)
function switchMenu(menu) {
    // Reset Active Class
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('[id^="section-"]').forEach(el => el.classList.add('d-none'));

    // Activate Selected
    if (menu === 'kelas') {
        document.getElementById('menuKelas').classList.add('active');
        document.getElementById('section-kelas').classList.remove('d-none');
        loadTableKelas();
    } else if (menu === 'instruktur') {
        document.getElementById('menuInstruktur').classList.add('active');
        document.getElementById('section-instruktur').classList.remove('d-none');
        loadTableInstruktur();
    }
}

// 11. LOAD TABEL KELAS
async function loadTableKelas() {
    const token = localStorage.getItem('lms_token');
    const tbody = document.getElementById('tableBodyKelas');

    // Cek apakah elemen ada (mencegah error di halaman siswa)
    if (!tbody) return;

    try {
        const response = await fetch(`${API_BASE}/kelas/?ordering=-id`, {
            headers: { 'Authorization': `Token ${token}` }
        });
        const data = await response.json();

        tbody.innerHTML = '';
        data.results.forEach(kelas => {
            tbody.innerHTML += `
                <tr>
                    <td class="ps-4 fw-bold">${kelas.judul}</td>
                    <td><span class="badge bg-secondary">${kelas.tingkat}</span></td>
                    <td>${kelas.tanggal_mulai}</td>
                    <td>${kelas.nama_instruktur || '<span class="text-danger">Belum ada</span>'}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditKelas(${kelas.id})">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="hapusKelas(${kelas.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) { console.error(error); }
}

// 12. LOAD TABEL INSTRUKTUR
async function loadTableInstruktur() {
    const token = localStorage.getItem('lms_token');
    const tbody = document.getElementById('tableBodyInstruktur');

    try {
        const response = await fetch(`${API_BASE}/instruktur/?ordering=-id`, {
            headers: { 'Authorization': `Token ${token}` }
        });
        const data = await response.json();

        tbody.innerHTML = '';
        data.results.forEach(ins => {
            tbody.innerHTML += `
                <tr>
                    <td class="ps-4 fw-bold">${ins.nama}</td>
                    <td>${ins.email}</td>
                    <td>${ins.keahlian}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-danger" onclick="hapusInstruktur(${ins.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) { console.error(error); }
}

// 13. MODAL KELAS: BUKA & ISI DROPDOWN
async function openModalKelas() {
    // Reset Form
    document.getElementById('formKelas').reset();
    document.getElementById('kelasId').value = ''; // Kosongkan ID (Tanda mode Create)
    document.getElementById('modalKelasTitle').innerText = "Buat Kelas Baru";
    
    // Load Dropdown Instruktur dari API
    await loadInstrukturOptions();

    // Show Modal
    const modal = new bootstrap.Modal(document.getElementById('modalKelas'));
    modal.show();
}

async function loadInstrukturOptions(selectedId = null) {
    const token = localStorage.getItem('lms_token');
    const select = document.getElementById('instrukturSelect');
    
    try {
        const response = await fetch(`${API_BASE}/instruktur/`, {
            headers: { 'Authorization': `Token ${token}` }
        });
        const data = await response.json();
        
        select.innerHTML = '<option value="">-- Pilih Instruktur --</option>';
        data.results.forEach(ins => {
            // Konversi ke string agar perbandingan aman
            const isSelected = (String(ins.id) === String(selectedId)) ? 'selected' : '';
            select.innerHTML += `<option value="${ins.id}" ${isSelected}>${ins.nama} - ${ins.keahlian}</option>`;
        });
    } catch (error) { console.error("Gagal load instruktur"); }
}

// 14. LOGIC SIMPAN KELAS (CREATE & UPDATE)
async function simpanKelas() {
    const token = localStorage.getItem('lms_token');
    const id = document.getElementById('kelasId').value; // Cek ada ID atau tidak
    
    const data = {
        judul: document.getElementById('judul').value,
        deskripsi: document.getElementById('deskripsi').value,
        tingkat: document.getElementById('tingkat').value,
        tanggal_mulai: document.getElementById('tanggal_mulai').value,
        instruktur: document.getElementById('instrukturSelect').value
    };

    // Tentukan Method & URL (Create vs Update)
    let url = `${API_BASE}/kelas/`;
    let method = 'POST';

    if (id) {
        url = `${API_BASE}/kelas/${id}/`;
        method = 'PUT'; // API Update DRF
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(response.ok) {
            // Tutup Modal & Refresh
            const modalEl = document.getElementById('modalKelas');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            loadTableKelas();
            showAlert(`Kelas berhasil ${id ? 'diupdate' : 'dibuat'}!`, 'success');
        } else {
            showAlert('Gagal menyimpan. Pastikan semua data terisi.', 'danger');
        }
    } catch (error) { showAlert('Error koneksi', 'danger'); }
}

// 15. FITUR EDIT: AMBIL DATA LALU ISI FORM
async function openEditKelas(id) {
    const token = localStorage.getItem('lms_token');
    
    try {
        // Ambil detail kelas
        const response = await fetch(`${API_BASE}/kelas/${id}/`, {
            headers: { 'Authorization': `Token ${token}` }
        });
        const kelas = await response.json();

        // Isi Form
        document.getElementById('kelasId').value = kelas.id;
        document.getElementById('judul').value = kelas.judul;
        document.getElementById('deskripsi').value = kelas.deskripsi;
        document.getElementById('tingkat').value = kelas.tingkat;
        document.getElementById('tanggal_mulai').value = kelas.tanggal_mulai;
        document.getElementById('modalKelasTitle').innerText = "Edit Kelas";

        // Load instruktur dropdown & pilih yang sesuai (ambil ID instruktur dari object/API)
        // Note: Jika API 'instruktur' mengembalikan Object, ambil .id nya. Jika angka, langsung pakai.
        const idInstruktur = (typeof kelas.instruktur === 'object') ? kelas.instruktur.id : kelas.instruktur;
        await loadInstrukturOptions(idInstruktur);

        // Show Modal
        const modal = new bootstrap.Modal(document.getElementById('modalKelas'));
        modal.show();

    } catch (error) { 
        console.error(error);
        showAlert('Gagal mengambil data kelas', 'danger'); 
    }
}

// 16. TAMBAH INSTRUKTUR
async function simpanInstruktur() {
    const token = localStorage.getItem('lms_token');
    const data = {
        nama: document.getElementById('namaInstruktur').value,
        email: document.getElementById('emailInstruktur').value,
        keahlian: document.getElementById('keahlianInstruktur').value
    };

    try {
        const response = await fetch(`${API_BASE}/instruktur/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(response.ok) {
            const modalEl = document.getElementById('modalInstruktur');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            document.getElementById('formInstruktur').reset();
            loadTableInstruktur();
            showAlert('Instruktur berhasil ditambahkan', 'success');
        } else {
            showAlert('Gagal menambah instruktur', 'danger');
        }
    } catch (error) { showAlert('Error koneksi', 'danger'); }
}

// Helper: Hapus Data
async function hapusKelas(id) {
    if(!confirm("Hapus kelas ini?")) return;
    await fetchDelete(`${API_BASE}/kelas/${id}/`, loadTableKelas);
}

async function hapusInstruktur(id) {
    if(!confirm("Hapus instruktur ini?")) return;
    await fetchDelete(`${API_BASE}/instruktur/${id}/`, loadTableInstruktur);
}

async function fetchDelete(url, callback) {
    const token = localStorage.getItem('lms_token');
    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': `Token ${token}` }
        });
        if(res.ok) {
            callback();
            showAlert('Data dihapus', 'success');
        } else {
            showAlert('Gagal menghapus', 'danger');
        }
    } catch (e) { showAlert('Error', 'danger'); }
}

// Helper: Show Alert
function showAlert(msg, type) {
    const div = document.getElementById('adminAlert');
    if(div) {
        div.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show">${msg}<button class="btn-close" data-bs-dismiss="alert"></button></div>`;
    } else {
        alert(msg);
    }
}

// ... (Kode sebelumnya tetap ada) ...

// 13. FUNGSI REGISTER USER
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPass = document.getElementById('regConfirmPassword').value;
    const alertBox = document.getElementById('alertRegister');

    // Validasi sederhana di frontend
    if (password !== confirmPass) {
        alertBox.innerHTML = `<div class="alert alert-warning">Password tidak sama!</div>`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alertBox.innerHTML = `<div class="alert alert-success">Berhasil mendaftar! Mengalihkan ke login...</div>`;
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            // Tampilkan error dari backend (misal: username sudah ada)
            let errorMsg = 'Gagal mendaftar.';
            if(data.username) errorMsg = `Username: ${data.username[0]}`;
            alertBox.innerHTML = `<div class="alert alert-danger">${errorMsg}</div>`;
        }
    } catch (error) {
        alertBox.innerHTML = `<div class="alert alert-danger">Error koneksi server</div>`;
    }
}

// ... (Kode sebelumnya tetap ada) ...

// 14. KHUSUS ADMIN: LOGIN FUNCTION
async function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const alertBox = document.getElementById('alertMessage');

    try {
        const response = await fetch(`${API_BASE}/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('lms_token', data.token);
            // BEDANYA DISINI: Redirect ke Admin Dashboard
            window.location.href = 'admin_dashboard.html'; 
        } else {
            alertBox.innerHTML = `<div class="alert alert-danger">Login Gagal: Cek Username/Password</div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        alertBox.innerHTML = `<div class="alert alert-danger">Gagal koneksi server</div>`;
    }
}

// 15. KHUSUS ADMIN: CEK AUTH (Agar kalau belum login, dilempar ke admin_login.html)
function checkAdminAuth() {
    const token = localStorage.getItem('lms_token');
    if (!token) {
        window.location.href = 'admin_login.html';
    }
}

// 16. KHUSUS ADMIN: LOGOUT FUNCTION
function logoutAdmin() {
    // Hapus token dari memori
    localStorage.removeItem('lms_token');
    // Redirect ke Pintu Masuk Admin
    window.location.href = 'admin_login.html';
}