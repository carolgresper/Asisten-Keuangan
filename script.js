// Pastikan laporan diambil dengan benar dari localStorage
let laporan = JSON.parse(localStorage.getItem('laporan')) || [];
let saldo = 0;
let pemasukanBulanan = new Array(12).fill(0);
let pengeluaranBulanan = new Array(12).fill(0);

function tambahPemasukan() {
    const jumlah = parseInt(document.getElementById('jumlahPemasukan').value);
    const deskripsi = document.getElementById('deskripsiPemasukan').value;
    const tanggal = document.getElementById('tanggalPemasukan').value;
    const waktu = document.getElementById('waktuPemasukan').value;

    if (!jumlah || !deskripsi || !tanggal || !waktu) {
        alert("Harap isi semua kolom!");
        return;
    }

    laporan.push({ type: 'pemasukan', jumlah, deskripsi, tanggal, waktu });
    updateLaporan();
    updateSaldo();
    resetInputPemasukan();
    saveData();
    updateAnalisisKeuangan();
}

function tambahPengeluaran() {
    const jumlah = parseInt(document.getElementById('jumlahPengeluaran').value);
    const deskripsi = document.getElementById('deskripsiPengeluaran').value;
    const tanggal = document.getElementById('tanggalPengeluaran').value;
    const waktu = document.getElementById('waktuPengeluaran').value;

    if (!jumlah || !deskripsi || !tanggal || !waktu) {
        alert("Harap isi semua kolom!");
        return;
    }

    laporan.push({ type: 'pengeluaran', jumlah, deskripsi, tanggal, waktu });
    updateLaporan();
    updateSaldo();
    resetInputPengeluaran();
    saveData();
    updateAnalisisKeuangan();
}

function updateLaporan() {
    const laporanBody = document.getElementById('laporanBody');
    laporanBody.innerHTML = '';

    let saldoTemp = saldo;

    laporan.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = item.type === 'pemasukan' ? 'tr-pemasukan' : 'tr-pengeluaran';

        if (item.type === 'pemasukan') {
            saldoTemp += item.jumlah;
        } else {
            saldoTemp -= item.jumlah;
        }

        row.innerHTML = `
            <td>${item.deskripsi} (${item.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'})</td>
            <td>Rp${item.jumlah.toLocaleString('id-ID')}</td>
            <td>${item.tanggal}</td>
            <td>${item.waktu}</td>
            <td>Rp${saldoTemp.toLocaleString('id-ID')}</td>
            <td><button onclick="hapusItem(${index})">Hapus</button></td>
        `;
        laporanBody.appendChild(row);
    });
}

function hapusItem(index) {
    laporan.splice(index, 1);
    updateLaporan();
    updateSaldo();
    saveData();
    updateAnalisisKeuangan();
}

function updateSaldo() {
    saldo = laporan.reduce((acc, item) => {
        return item.type === 'pemasukan' ? acc + item.jumlah : acc - item.jumlah;
    }, 0);
    document.getElementById('saldo').innerText = `Saldo: Rp${saldo.toLocaleString('id-ID')}`;
}

function resetInputPemasukan() {
    document.getElementById('jumlahPemasukan').value = '';
    document.getElementById('deskripsiPemasukan').value = '';
    document.getElementById('tanggalPemasukan').value = '';
    document.getElementById('waktuPemasukan').value = '';
}

function resetInputPengeluaran() {
    document.getElementById('jumlahPengeluaran').value = '';
    document.getElementById('deskripsiPengeluaran').value = '';
    document.getElementById('tanggalPengeluaran').value = '';
    document.getElementById('waktuPengeluaran').value = '';
}

function saveData() {
    localStorage.setItem('laporan', JSON.stringify(laporan));
}

function resetData() {
    const confirmation = confirm("Anda yakin ingin mereset semua data?");
    if (confirmation) {
        laporan = [];
        saldo = 0;
        pemasukanBulanan = new Array(12).fill(0);  // Reset data bulanan
        pengeluaranBulanan = new Array(12).fill(0); // Reset data bulanan
        updateLaporan();
        updateSaldo();
        saveData();
        updateAnalisisKeuangan(); // Reset chart
    }
}

// Fungsi untuk memperbarui chart untuk analisis keuangan bulanan
function updateAnalisisKeuangan() {
    // Hitung pemasukan dan pengeluaran per bulan
    pemasukanBulanan = new Array(12).fill(0);
    pengeluaranBulanan = new Array(12).fill(0);
    
    laporan.forEach(item => {
        const bulan = new Date(item.tanggal).getMonth(); // Mengambil bulan dari tanggal
        if (!isNaN(bulan)) { // Cek apakah bulan valid
            if (item.type === 'pemasukan') {
                pemasukanBulanan[bulan] += item.jumlah;
            } else {
                pengeluaranBulanan[bulan] += item.jumlah;
            }
        }
    });

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
            datasets: [
                {
                    label: 'Pemasukan',
                    data: pemasukanBulanan,
                    borderColor: 'green',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Pengeluaran',
                    data: pengeluaranBulanan,
                    borderColor: 'red',
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Analisis Keuangan Bulanan'
                }
            }
        }
    });
}

// Inisialisasi data dan update grafik saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    laporan = JSON.parse(localStorage.getItem('laporan')) || [];
    updateLaporan();
    updateSaldo();
    updateAnalisisKeuangan(); // Tampilkan chart saat halaman di-load
});
