// // ... (Kode sebelumnya tetap ada) ...

// // 10. ADMIN: LOAD TABLE KELAS
// async function loadTableKelas() {
//     const token = localStorage.getItem('lms_token');
//     const tbody = document.getElementById('tableBody');

//     try {
//         const response = await fetch(`${API_BASE}/kelas/?ordering=-id`, {
//             headers: { 'Authorization': `Token ${token}` }
//         });
//         const data = await response.json();

//         tbody.innerHTML = '';
//         data.results.forEach(kelas => {
//             tbody.innerHTML += `
//                 <tr>
//                     <td>#${kelas.id}</td>
//                     <td class="fw-bold">${kelas.judul}</td>
//                     <td><span class="badge bg-secondary">${kelas.tingkat}</span></td>
//                     <td>${kelas.tanggal_mulai}</td>
//                     <td>${kelas.nama_instruktur || '-'}</td>
//                     <td class="text-end">
//                         <button class="btn btn-sm btn-warning me-1" onclick="alert('Fitur Edit coba dibuat sendiri ya!')">
//                             <i class="bi bi-pencil"></i>
//                         </button>
//                         <button class="btn btn-sm btn-danger" onclick="hapusKelas(${kelas.id})">
//                             <i class="bi bi-trash"></i>
//                         </button>
//                     </td>
//                 </tr>
//             `;
//         });
//     } catch (error) {
//         tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Gagal memuat data (Pastikan Anda Login sebagai Admin/Staff)</td></tr>`;
//     }
// }

// // 11. ADMIN: HAPUS KELAS (DELETE API)
// async function hapusKelas(id) {
//     if(!confirm("Yakin ingin menghapus kelas ini? Data materi di dalamnya juga akan hilang!")) return;
    
//     const token = localStorage.getItem('lms_token');
//     try {
//         const response = await fetch(`${API_BASE}/kelas/${id}/`, {
//             method: 'DELETE',
//             headers: { 'Authorization': `Token ${token}` }
//         });

//         if(response.ok) {
//             loadTableKelas(); // Reload tabel
//             showAlert('Data berhasil dihapus', 'success');
//         } else {
//             showAlert('Gagal menghapus. Anda mungkin tidak punya izin.', 'danger');
//         }
//     } catch (error) {
//         showAlert('Error koneksi', 'danger');
//     }
// }

// // 12. ADMIN: TAMBAH KELAS (POST API)
// async function simpanKelas() {
//     const token = localStorage.getItem('lms_token');
    
//     // Ambil data form
//     const data = {
//         judul: document.getElementById('judul').value,
//         deskripsi: document.getElementById('deskripsi').value,
//         tingkat: document.getElementById('tingkat').value,
//         tanggal_mulai: document.getElementById('tanggal_mulai').value,
//         instruktur: 1 // HARCODED: Untuk demo UTS, kita anggap instruktur ID 1
//     };

//     try {
//         const response = await fetch(`${API_BASE}/kelas/`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Token ${token}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });

//         if(response.ok) {
//             // Tutup Modal (Bootstrap logic)
//             const modalEl = document.getElementById('modalTambah');
//             const modal = bootstrap.Modal.getInstance(modalEl);
//             modal.hide();
            
//             // Reset Form & Reload Table
//             document.getElementById('formKelas').reset();
//             loadTableKelas();
//             showAlert('Kelas baru berhasil ditambahkan!', 'success');
//         } else {
//             showAlert('Gagal menyimpan. Cek kelengkapan data.', 'danger');
//         }
//     } catch (error) {
//         console.error(error);
//         showAlert('Error koneksi backend', 'danger');
//     }
// }

// // Helper: Tampilkan Alert
// function showAlert(msg, type) {
//     const div = document.getElementById('adminAlert');
//     div.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show">${msg}<button class="btn-close" data-bs-dismiss="alert"></button></div>`;
// }