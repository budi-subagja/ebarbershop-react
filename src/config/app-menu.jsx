// app-menu.jsx
const Menu = [
  // Home: Muncul untuk semua
  { path: '/', icon: 'pulse-outline', title: 'Home', roles: ['ADMIN', 'OWNER', 'CAPSTER'] },
  
  // Kasir: Muncul untuk ADMIN dan OWNER
  { path: '/pos/customer-order', icon: 'calculator-sharp', title: 'Kasir', roles: ['ADMIN', 'OWNER'] },
  
  // Transaksi & Laporan: Hanya OWNER (atau ADMIN jika diizinkan)
  { 
    path: '/transaksi', icon: 'podium-outline', title: 'Transaksi', roles: ['OWNER'],
    children: [
      { path: '/transaksi/pemasukan', title: 'Pemasukan' },
      { path: '/transaksi/pengeluaran', title: 'Pengeluaran' },
    ]
  },
  
  // Management & Karyawan: Hanya OWNER
  { path: '/karyawan', icon: 'people-sharp', title: 'Karyawan', roles: ['OWNER'] },
  { 
    path: '/management', icon: 'podium-outline', title: 'Management', roles: ['OWNER'],
    children: [
      { path: '/management/pegawai', title: 'Pegawai' },
      { path: '/management/produk', title: 'Produk' },
      { path: '/management/layanan', title: 'Layanan' },
    ]
  }
]

export default Menu;
