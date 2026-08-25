// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#ffffff', marginTop: '80px', padding: '50px 24px 30px 24px', borderTop: '1px solid #1e3a8a' }}>
      <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Desa Tugu Selatan</h4>
          <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6 }}>
            Kecamatan Cisarua / Megamendung, Kabupaten Bogor. Pusat pariwisata alam dan budaya berbasis masyarakat.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#f8fafc' }}>Tautan Cepat</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
            <li><a href="#profil" style={{ color: 'inherit', textDecoration: 'none' }}>Profil & BPH</a></li>
            <li><a href="#destinasi" style={{ color: 'inherit', textDecoration: 'none' }}>Daftar Wisata</a></li>
            <li><a href="#ticketing" style={{ color: 'inherit', textDecoration: 'none' }}>Pesan Tiket Online</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#f8fafc' }}>Kontak Pengelola</h4>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Badan Pengurus Harian (BPH)</p>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Email: info@desatuguselatan.id</p>
        </div>
      </div>
      <div className="container-wide" style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
        &copy; {new Date().getFullYear()} Desa Tugu Selatan. All rights reserved.
      </div>
    </footer>
  );
}