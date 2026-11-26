(function () {
      const SUPABASE_URL = 'https://rfebdkrrhacszynsjsjn.supabase.co';
      const SUPABASE_KEY = 'sb_publishable_e9CPC-fdfJQpLFO3ZKvE7w_Idr7eWu_';
      const STORAGE_KEY = 'bunta_proposal_perbup1_2026_v1';
      const MY_IDS_KEY = 'bunta_my_proposal_ids_v1';
      const ADMIN_SESSION_KEY = 'bunta_admin_session_v1';

      // Akun bawaan Admin Kecamatan (bisa diganti/ditambah lewat tabel admin_accounts di Supabase)
      const DEFAULT_ADMIN_USER = 'adminbunta';
      const DEFAULT_ADMIN_PASS = 'Bunta2026!';

      let sb = null;
      let dbConnected = false;
      let isAdmin = false;
      let myProposalIds = [];

      if (window.supabase && typeof window.supabase.createClient === 'function') {
        try {
          sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        } catch (e) {
          sb = null;
        }
      }

      const PERBUP_URUSAN = [
        {
          no: 1,
          nama: 'Urusan Pendidikan',
          items: [
            'Melaksanakan Seleksi O2SN, FLS2N, dan Olimpiade Sains Nasional',
            'Melaksanakan Lomba 9 K Tingkat Kecamatan',
            'Pendataan anak putus sekolah dan dewasa tidak bersekolah',
            'Kegiatan Monev evaluasi pelaksanaan pendidikan di sekolah',
            'Dukungan agenda kebudayaan (festival/lomba, eksibisi, 10 objek Pemajuan Kebudayaan)',
            'Dukungan perwakilan kecamatan pada Festival Budaya Lipu Celebes & Festival Tunas Bahasa Ibu',
            'Dukungan festival budaya tahunan serta upacara ritual adat dan keagamaan',
            'Fasilitasi Kegiatan PAUD Tingkat Desa dan Kecamatan',
            'Dukungan Seragam Pendidikan'
          ]
        },
        {
          no: 2,
          nama: 'Urusan Kesehatan',
          items: [
            'Pembangunan Posyandu di Wilayah Kecamatan',
            'Rehabilitasi Posyandu di Wilayah Kecamatan',
            'Pemantauan Fogging Lokus, Pengadaan Mesin BHP/Fogging, Operasional Petugas Fogging',
            'Operasional Kader Posyandu Kelurahan pada Wilayah Kecamatan',
            'Pendataan kesehatan keluarga & masyarakat miskin usulan JKN/KIS oleh kader Dasawisma',
            'Sosialisasi dan deteksi dini penyakit berpotensi wabah lintas sektor',
            'Pelayanan Posyandu untuk peningkatan kualitas layanan masyarakat',
            'Kegiatan Posyandu Kecamatan',
            'Dukungan Sarana dan Prasarana Puskesmas Pembantu dan Puskesmas',
            'Dukungan terhadap Kegiatan Stunting'
          ]
        },
        {
          no: 3,
          nama: 'Urusan Pekerjaan Umum dan Penataan Ruang',
          items: [
            'Pembangunan tangki septik individual plus bilik sesuai prototipe Dinas PUPR',
            'Pembangunan jaringan air bersih pedesaan (perluasan jaringan & sambungan rumah)',
            'Pemeliharaan atau penggantian pipa jaringan air bersih eksisting',
            'Pembangunan drainase lingkungan atau pedesaan untuk jaringan tersier',
            'Rehabilitasi ringan/pembangunan sebagian drainase lingkungan/pedesaan/perkotaan',
            'Pemeliharaan/pembersihan galian endapan drainase lingkungan',
            'Pembangunan dan/atau Pemeliharaan jalan lingkungan/setapak',
            'Rehabilitasi ringan bangunan kantor kecamatan dan kelurahan skala kecil',
            'Pemeliharaan rutin jalan berupa pemarasan damija',
            'Pembangunan tanggul/talud pengaman jalan skala kecil',
            'Pengawasan bangunan/kawasan yang tidak sesuai pemanfaatan ruang'
          ]
        },
        {
          no: 4,
          nama: 'Urusan Perumahan Rakyat, Kawasan Permukiman dan Pertanahan',
          items: [
            'Penimbunan jalan setapak/lingkungan di kawasan kumuh',
            'Pembangunan/rehabilitasi/peningkatan jalan setapak/lingkungan & plat duiker kawasan kumuh',
            'Pembangunan jamban/MCK di kawasan kumuh sesuai prototipe',
            'Pengadaan PJU di kawasan kumuh',
            'Pembangunan/rehabilitasi drainase tersier di kawasan kumuh',
            'Penimbunan jalan setapak/lingkungan di perumahan/permukiman',
            'Pembangunan jamban/MCK di perumahan/permukiman sesuai prototipe',
            'Pengadaan PJU di kawasan perumahan/permukiman',
            'Pembangunan/rehabilitasi drainase tersier di perumahan/permukiman',
            'Inventarisasi, pengawasan, penertiban & pelaporan tanah kosong di kecamatan',
            'Jalan Lingkungan/Setapak (penimbunan, peningkatan, plat duiker)',
            'Drainase/Riol dan Plat Duiker type 50/40/50',
            'MCK/Jamban sesuai prototipe perangkat daerah',
            'Pengadaan/pemasangan Lampu Penerangan Jalan Umum Tenaga Surya (PJU-TS)',
            'Fasilitasi mediasi sengketa tanah tingkat kecamatan & pengawasan tanah kosong'
          ]
        },
        {
          no: 5,
          nama: 'Urusan Sosial',
          items: [
            'Melakukan Pendataan Data Tunggal Sosial dan Ekonomi Nasional (DTSEN) Tingkat Kecamatan',
            'Bantuan Stimulan Pemberdayaan Masyarakat (Kelompok Usaha Bersama / KUBE)',
            'Dukungan Penyediaan Bahan Bangunan Rumah Layak Huni'
          ]
        },
        {
          no: 6,
          nama: 'Urusan PPPA, Pengendalian Penduduk dan KB',
          items: [
            'Fasilitasi Peringatan Hari Ibu Nasional Tingkat Kecamatan',
            'Pemberdayaan Kelompok Akseptor (Peserta KB) di Kecamatan',
            'Fasilitasi Pemilihan Putra Putri Generasi Berencana (Genre) Tingkat Kecamatan',
            'Peningkatan Kapasitas Tim Pendamping Keluarga (TPK) Tingkat Kecamatan',
            'Peningkatan Kapasitas Tim Percepatan Penurunan Stunting Tingkat Kecamatan',
            'Dukungan Kegiatan Tim Percepatan Penurunan Stunting Tingkat Kecamatan',
            'Dukungan Program Pengendalian Penduduk',
            'Dukungan Program Ketahanan dan Kesejahteraan Keluarga',
            'Dukungan Program Pembinaan Keluarga Berencana',
            'Dukungan Program Pengarusutamaan Gender dan Pemberdayaan Perempuan',
            'Dukungan Program Pemenuhan Hak Anak',
            'Dukungan Program Perlindungan Perempuan dan Perlindungan Khusus Anak'
          ]
        },
        {
          no: 7,
          nama: 'Urusan Tanaman Pangan, Hortikultura dan Perkebunan',
          items: [
            'Pemberdayaan masyarakat penganekaragaman konsumsi pangan melalui Bantuan Opal (Obor Pangan Lestari)',
            'Peningkatan Ketahanan Pangan Keluarga melalui Pemberian Bantuan',
            'Pengadaan Benih/Bibit Tanaman Pangan, Hortikultura dan Perkebunan',
            'Pengadaan Sarana Produksi Pertanian',
            'Pembangunan/Rehabilitasi Jaringan Irigasi Tersier',
            'Pembangunan/Rehabilitasi Jalan Pertanian mendukung tanaman pangan, hortikultura & perkebunan',
            'Pembangunan/Rehabilitasi Dam Parit',
            'Pembangunan/Rehabilitasi Embung',
            'Pembangunan/Rehabilitasi Irigasi Perpipaan (Tata Air Mikro)',
            'Peningkatan Kapasitas Kelembagaan Petani di Kecamatan'
          ]
        },
        {
          no: 8,
          nama: 'Urusan Kependudukan dan Pencatatan Sipil',
          items: [
            'Sosialisasi Administrasi Kependudukan & Pencatatan Sipil serta pengadaan alat peraga',
            'Dukungan kegiatan pendataan Administrasi Kependudukan dan Pencatatan Sipil di Desa/Kelurahan'
          ]
        },
        {
          no: 9,
          nama: 'Urusan Lingkungan Hidup',
          items: [
            'Penanganan Sampah melalui Pengangkutan yang didukung Sarana dan Prasarana',
            'Penanganan Sampah melalui Pengoperasian dan Pemeliharaan Sarana Prasarana',
            'Penanganan Sampah melalui Pengumpulan Sampah',
            'Dukungan Terkait Kegiatan Persampahan',
            'Operasional Petugas Penanganan Sampah Tingkat Kecamatan'
          ]
        },
        {
          no: 10,
          nama: 'Urusan Pemberdayaan Masyarakat dan Desa',
          items: [
            'Dukungan Evaluasi Rancangan APBDesa (R-APBDesa)',
            'Monitoring dan Evaluasi Penyerapan Anggaran Keuangan Desa dan Kelurahan per triwulan',
            'Fasilitasi Penyusunan Peraturan Desa dan Peraturan Kepala Desa',
            'Fasilitasi dan Pembinaan Pelaksanaan Tugas Kades/Perangkat Desa & Lurah/Perangkat Kelurahan',
            'Fasilitasi Pelaksanaan Pemilihan Kepala Desa',
            'Rekomendasi Pengangkatan dan Pemberhentian Perangkat Desa',
            'Fasilitasi Sinkronisasi Perencanaan Pembangunan Daerah dengan Desa/Kelurahan',
            'Fasilitasi pelaksanaan tugas, fungsi, dan kewajiban lembaga kemasyarakatan',
            'Fasilitasi penyusunan program dan pelaksanaan pemberdayaan masyarakat Desa',
            'Koordinasi pendampingan Desa dan/atau Kelurahan di wilayahnya',
            'Koordinasi pelaksanaan pembangunan kawasan perdesaan',
            'Dukungan Penetapan dan Penegasan Batas Desa Tingkat Kecamatan',
            'Dukungan Lomba Desa Tingkat Kecamatan',
            'Fasilitasi Sarana & Prasarana Kelembagaan Lembaga Kemasyarakatan Desa/Kelurahan',
            'Peningkatan Kapasitas Kelembagaan Kemasyarakatan Desa/Kelurahan',
            'Evaluasi APBDes',
            'Klarifikasi Peraturan Desa Kewenangan Desa',
            'Evaluasi Rancangan Peraturan Desa APBDes & SOTK',
            'Izin Cuti Kepala Desa & Pengangkatan Pelaksana Harian Kepala Desa',
            'Pelatihan Kewirausahaan & Manajemen Usaha Lembaga Ekonomi Desa/Kelurahan (Bumdes/Bumdesma/Koperasi Merah Putih)',
            'Penyertaan Modal Usaha pada Lembaga Ekonomi Desa dan Kelurahan',
            'Dukungan Dana Peningkatan SDM Aparat Desa/Kelurahan dan BPD'
          ]
        },
        {
          no: 11,
          nama: 'Urusan Perhubungan',
          items: [
            'Pengadaan Penerangan Jalan Umum (PJU) LED 100 s/d 200 Watt di wilayah Kecamatan'
          ]
        },
        {
          no: 12,
          nama: 'Urusan Komunikasi, Informatika, Statistik dan Persandian',
          items: [
            'Penyediaan data Informasi Publik ke dalam Website PPID',
            'Pembuatan Dokumen PPID Pembantu Tahunan & Rapat Evaluasi Tahunan PPID',
            'Pemberdayaan Komunitas Informasi Masyarakat (KIM) melalui sosialisasi & pembinaan',
            'Pembentukan & Rapat Evaluasi Komunitas Informasi Masyarakat di desa/kelurahan',
            'Pembentukan Pejabat Pengelola Informasi dan Dokumentasi (PPID) pelaksana kecamatan',
            'Penyusunan Laporan PPID Pelaksana Tahunan'
          ]
        },
        {
          no: 13,
          nama: 'Urusan Koperasi, Usaha Kecil dan Menengah',
          items: [
            'Pembangunan Lapak Pelaku Usaha Mikro',
            'Peningkatan Kapasitas Pelaku Usaha Kecil, Menengah dan Koperasi'
          ]
        },
        {
          no: 14,
          nama: 'Urusan Kepemudaan dan Olahraga',
          items: [
            'Pelaksanaan Penyuluhan/Sosialisasi Bahaya Narkoba kepada pelajar dan Pemuda',
            'Pelaksanaan Kompetisi Olahraga Tingkat Kecamatan',
            'Fasilitasi pengadaan peralatan olahraga',
            'Dukungan keikutsertaan kontingen Kecamatan dalam Pekan dan Kejuaraan Olahraga',
            'Dukungan terhadap Pembinaan Anggota Kwarran (Pramuka)',
            'Dukungan terhadap Perkemahan Ranting & Kepramukaan Kwarcab'
          ]
        },
        {
          no: 15,
          nama: 'Urusan Perpustakaan dan Kearsipan',
          items: [
            'Dukungan Pembangunan Gedung Perpustakaan Kecamatan, Desa dan Kelurahan',
            'Fasilitasi Perpustakaan Digital di Kecamatan',
            'Sosialisasi Pengembangan & Pengolahan Perpustakaan Tingkat Kecamatan',
            'Dukungan Sosialisasi Budaya Baca & Lomba Perpustakaan Desa/Kelurahan',
            'Dukungan Transformasi Perpustakaan Berbasis Inklusi Sosial & Bimbingan Teknis'
          ]
        },
        {
          no: 16,
          nama: 'Urusan Kelautan dan Perikanan',
          items: [
            'Pemberdayaan Nelayan Kecil (Pengadaan Katinting, Alat Pancing, dan Gill Net)',
            'Pengelolaan Pembudidayaan Ikan (Benih & pakan ikan air tawar/payau/udang, cetak kolam)',
            'Fasilitas Pelaku Usaha Perikanan Skala Mikro dan Kecil (Pengadaan Cool Box dan Freezer)',
            'Dukungan fasilitas bagi Pelaku Usaha Perikanan Skala Mikro dan Kecil'
          ]
        },
        {
          no: 17,
          nama: 'Urusan Pariwisata',
          items: [
            'Fasilitasi Kegiatan Festival Pariwisata tingkat Kecamatan dan Kabupaten',
            'Pembangunan Sarana dan Prasarana Pariwisata',
            'Pengadaan/Pemeliharaan/Rehabilitasi Sarana Prasarana Daya Tarik Wisata & Desa Wisata',
            'Fasilitasi Pemasaran Pariwisata sesuai karakter masing-masing Kecamatan',
            'Dukungan Kegiatan Budaya dan Pariwisata (Pengadaan Baju Adat)',
            'Dukungan Kegiatan Festival Budaya tingkat Kabupaten'
          ]
        },
        {
          no: 18,
          nama: 'Urusan Pertanian (Perkebunan & Peternakan)',
          items: [
            'Dukungan Benih/Bibit Pertanian dan Perkebunan',
            'Dukungan Pupuk dan Pestisida untuk Pertanian',
            'Dukungan Sarana Pendukung Pertanian dan Perkebunan',
            'Pembangunan/Rehabilitasi Jaringan Irigasi Tersier & Jalan Usaha Tani',
            'Peningkatan Kapasitas Petani & Dukungan Sarana Pertanian di Kecamatan',
            'Peternakan: Dukungan Vaksin, Pakan dan Bibit Ternak',
            'Peternakan: Dukungan Sarana Peternakan'
          ]
        },
        {
          no: 19,
          nama: 'Urusan Perdagangan dan Perindustrian',
          items: [
            'Dukungan Peningkatan Kapasitas Pelaku Usaha Industri Mikro, Kecil dan Menengah (IKM/UMKM)',
            'Dukungan Peningkatan Kapasitas Calon Pelaku Usaha Mikro, Kecil dan Menengah berbasis SDA lokal'
          ]
        },
        {
          no: 20,
          nama: 'Urusan Tenaga Kerja dan Transmigrasi',
          items: [
            'Dukungan Peningkatan Keterampilan bagi Pencari Kerja berdasarkan Klaster Kompetensi',
            'Dukungan Perluasan Kesempatan Kerja',
            'Fasilitasi Daerah Pesisir Wilayah Transmigrasi Tingkat Kecamatan',
            'Fasilitasi Bantuan Barang di Wilayah Kawasan Transmigrasi Tingkat Kecamatan'
          ]
        },
        {
          no: 21,
          nama: 'Urusan Ketentraman, Ketertiban Umum dan Perlindungan Masyarakat',
          items: [
            'Satpol PP: Dukungan Jasa Tenaga Satuan Perlindungan Masyarakat (Satlinmas)',
            'Satpol PP: Peningkatan Kapasitas SDM Satlinmas & Kegiatan Trantibumlinmas',
            'Damkar: Peningkatan Kapasitas Aparatur & Masyarakat dalam Penanggulangan Kebakaran',
            'Damkar: Pengadaan APAR Kantor Pemerintah, Alat Pemadam Skala Kecil & Pos Damkar Kecamatan',
            'Kesbangpol: Dukungan Forum Pembauran Kebangsaan, Paskibraka, FKDM, Forkopimcam & FKUB',
            'Bencana: Fasilitasi Pembentukan Desa/Kecamatan Tangguh Bencana & Rambu Kebencanaan'
          ]
        },
        {
          no: 22,
          nama: 'Unsur Pendukung Urusan Pemerintahan (Sekretariat Daerah)',
          items: [
            'Bagian Kesra: Dukungan Bantuan Barang/Jasa kepada Organisasi Keagamaan',
            'Bagian Kesra: Dukungan Pelatihan Penyelenggaraan Kegiatan Keagamaan',
            'Bagian Kesra: Dukungan Pelaksanaan Hari-Hari Besar Keagamaan Tingkat Kecamatan & Kabupaten',
            'Bagian SDA: Pengawasan dan Pengendalian BBM dan LPG Bersubsidi di Kecamatan',
            'Bagian SDA: Penyelesaian Permasalahan Sumber Daya Alam di Kecamatan'
          ]
        }
      ];

      const KRITERIA_PASAL = [
        'Kegiatan berskala kecil (Pasal 17 ayat 2 huruf a)',
        'Tidak memerlukan kajian teknis yang tinggi (Pasal 17 ayat 2 huruf b)',
        'Tidak memerlukan teknologi tinggi (Pasal 17 ayat 2 huruf c)',
        'Memaksimalkan penggunaan sumber daya lokal (Pasal 17 ayat 2 huruf e)',
        'Tidak tumpang tindih dengan kegiatan Perangkat Daerah teknis (Pasal 17 ayat 2 huruf f)',
        'Kelompok beralamat dan beroperasi di Desa/Kelurahan Kec. Bunta (Pasal 18 ayat 3-4)'
      ];

      const INITIAL_SAMPLES = [
        {
          id: 'kp4',
          nomorSurat: '014/KN-BAHARI/XI/2026',
          tanggal: '2026-11-12',
          jenisPengusul: 'Kelompok Tani / Nelayan / UMKM',
          namaPengusul: 'Kelompok Nelayan Bahari Jaya',
          wilayah: 'Desa Pongian, Kec. Bunta',
          tujuanCamat: 'Camat Bunta (Kabupaten Banggai)',
          ketua: 'Ahmad Fadli',
          kontak: '0852-4110-2290',
          urusanNo: 16,
          urusanNama: 'Urusan Kelautan dan Perikanan',
          subKegiatan: 'Fasilitas Pelaku Usaha Perikanan Skala Mikro dan Kecil (Pengadaan Cool Box dan Freezer)',
          judul: 'Proposal Pengadaan Cool Box & Freezer Penyimpanan Ikan untuk Nelayan Kecil Desa Pongian',
          mekanisme: 'Pengadaan Bantuan Barang/Peralatan Melalui Pihak Ke 3 (Penyedia)',
          seksiTujuan: 'Seksi Pemberdayaan Masyarakat Desa (PMD)',
          kriteria: [
            'Kegiatan berskala kecil (Pasal 17 ayat 2 huruf a)',
            'Memaksimalkan penggunaan sumber daya lokal (Pasal 17 ayat 2 huruf e)',
            'Kelompok beralamat dan beroperasi di Desa/Kelurahan Kec. Bunta (Pasal 18 ayat 3-4)'
          ],
          urgensi: 'Hasil tangkapan nelayan skala mikro di Desa Pongian sering mengalami penurunan mutu akibat keterbatasan sarana rantai dingin. Bantuan Cool Box dan Freezer akan menjaga kesegaran ikan sebelum dipasarkan.',
          anggota: 20,
          anggaran: 22500000,
          lokasi: 'Sekretariat Kelompok Nelayan Bahari Jaya, Pesisir Dusun I Desa Pongian.',
          swadaya: 'Kelompok menyediakan bangunan gudang penampungan sementara dan biaya listrik operasional.',
          lampiran: { suratPermohonan: true, naskahProposal: true, legalitas: true, rab: true, dokumentasi: false, beritaAcaraMusdes: true },
          status: 'Disposisi Seksi',
          catatanVerifikator: 'Disposisi Camat ke Seksi PMD & Tenaga Pendamping Kecamatan untuk verifikasi lapangan.',
          updatedAt: '2026-11-18T09:30:00Z'
        },
        {
          id: 'bt7',
          nomorSurat: '008/PHBI-BUNTA/XI/2026',
          tanggal: '2026-11-15',
          jenisPengusul: 'Lembaga Keagamaan / Pendidikan / Lainnya',
          namaPengusul: 'Panitia Hari Besar Keagamaan Kec. Bunta',
          wilayah: 'Kelurahan Bunta I, Kec. Bunta',
          tujuanCamat: 'Camat Bunta (Kabupaten Banggai)',
          ketua: 'H. Mansyur',
          kontak: '0813-5521-8840',
          urusanNo: 22,
          urusanNama: 'Unsur Pendukung Urusan Pemerintahan (Sekretariat Daerah)',
          subKegiatan: 'Bagian Kesra: Dukungan Pelaksanaan Hari-Hari Besar Keagamaan Tingkat Kecamatan & Kabupaten',
          judul: 'Proposal Dukungan Pelaksanaan Peringatan Hari Besar Keagamaan Tingkat Kecamatan Bunta',
          mekanisme: 'Bantuan Fasilitasi Kegiatan, Pelayanan/Rekomendasi Kecamatan',
          seksiTujuan: 'Seksi Pelayanan Informasi dan Pengaduan (PIP)',
          kriteria: [
            'Kegiatan berskala kecil (Pasal 17 ayat 2 huruf a)',
            'Memaksimalkan penggunaan sumber daya lokal (Pasal 17 ayat 2 huruf e)',
            'Kelompok beralamat dan beroperasi di Desa/Kelurahan Kec. Bunta (Pasal 18 ayat 3-4)'
          ],
          urgensi: 'Memperkuat syiar keagamaan dan kerukunan antarumat beragama di tingkat Kecamatan Bunta dengan melibatkan seluruh desa dan kelurahan.',
          anggota: 150,
          anggaran: 15000000,
          lokasi: 'Lapangan Kecamatan / Masjid Agung Kecamatan Bunta.',
          swadaya: 'Swadaya panitia dan masyarakat untuk konsumsi dan kepanitiaan lapangan.',
          lampiran: { suratPermohonan: true, naskahProposal: true, legalitas: true, rab: true, dokumentasi: true, beritaAcaraMusdes: true },
          status: 'Disetujui',
          catatanVerifikator: 'Disetujui Camat dan masuk agenda prioritas Seksi Kesos.',
          updatedAt: '2026-11-20T14:15:00Z'
        },
        {
          id: 'bh2',
          nomorSurat: '021/POKTAN-SM/XI/2026',
          tanggal: '2026-11-21',
          jenisPengusul: 'Kelompok Tani / Nelayan / UMKM',
          namaPengusul: 'Kelompok Tani Sumber Makmur',
          wilayah: 'Desa Bohotokong, Kec. Bunta',
          tujuanCamat: 'Camat Bunta (Kabupaten Banggai)',
          ketua: 'Suherman',
          kontak: '0821-9904-1172',
          urusanNo: 7,
          urusanNama: 'Urusan Tanaman Pangan, Hortikultura dan Perkebunan',
          subKegiatan: 'Pembangunan/Rehabilitasi Jalan Pertanian mendukung tanaman pangan, hortikultura & perkebunan',
          judul: 'Usulan Swakelola Rehabilitasi Jalan Pertanian Akses Lahan Perkebunan Desa Bohotokong',
          mekanisme: 'Swakelola POKMAS',
          seksiTujuan: 'Seksi Pembangunan',
          kriteria: [
            'Kegiatan berskala kecil (Pasal 17 ayat 2 huruf a)',
            'Tidak memerlukan kajian teknis yang tinggi (Pasal 17 ayat 2 huruf b)',
            'Tidak memerlukan teknologi tinggi (Pasal 17 ayat 2 huruf c)',
            'Kelompok beralamat dan beroperasi di Desa/Kelurahan Kec. Bunta (Pasal 18 ayat 3-4)'
          ],
          urgensi: 'Jalan produksi sepanjang ±450 meter rusak saat musim hujan sehingga menyulitkan pengangkutan hasil panen jagung dan kelapa.',
          anggota: 32,
          anggaran: 28000000,
          lokasi: 'Jalur Perkebunan Dusun II Desa Bohotokong, Kec. Bunta.',
          swadaya: 'Kelompok siap melaksanakan pekerjaan secara swakelola dengan tenaga petani setempat.',
          lampiran: { suratPermohonan: true, naskahProposal: true, legalitas: false, rab: true, dokumentasi: false, beritaAcaraMusdes: false },
          status: 'Perlu Perbaikan',
          catatanVerifikator: 'Mohon lengkapi SK Pengukuhan Poktan dan foto titik 0% jalan pertanian.',
          updatedAt: '2026-11-22T10:00:00Z'
        }
      ];

      let proposals = [];
      let statusChart = null;
      let kategoriChart = null;
      let pendingDeleteId = null;
      let groupByMode = 'desa-urusan';
      let hpNoticeShown = false;

      function getNomorUsulan(p) {
        return String(p?.id || '');
      }

      function getNomorUsulanDisplay(p) {
        return String(p?.id || '');
      }

      function generateRandomTrackingId() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const digits = '0123456789';
        const existing = new Set(proposals.map(p => String(p.id || '').toLowerCase()));
        for (let attempt = 0; attempt < 500; attempt++) {
          const code =
            letters[Math.floor(Math.random() * letters.length)] +
            letters[Math.floor(Math.random() * letters.length)] +
            digits[Math.floor(Math.random() * digits.length)];
          if (!existing.has(code)) return code;
        }
        return (
          letters[Math.floor(Math.random() * letters.length)] +
          letters[Math.floor(Math.random() * letters.length)] +
          digits[Math.floor(Math.random() * digits.length)]
        );
      }

      function loadMyIds() {
        try {
          const raw = localStorage.getItem(MY_IDS_KEY);
          const arr = raw ? JSON.parse(raw) : [];
          return Array.isArray(arr) ? arr : [];
        } catch (e) {
          return [];
        }
      }

      function registerMyId(id) {
        if (!id) return;
        if (!myProposalIds.includes(id)) {
          myProposalIds.unshift(id);
          try {
            localStorage.setItem(MY_IDS_KEY, JSON.stringify(myProposalIds));
          } catch (e) {
            // Ignore
          }
        }
      }

      function loadAdminSession() {
        try {
          return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
        } catch (e) {
          return false;
        }
      }

      function saveAdminSession(val) {
        isAdmin = Boolean(val);
        try {
          localStorage.setItem(ADMIN_SESSION_KEY, isAdmin ? 'true' : 'false');
        } catch (e) {
          // Ignore
        }
        applyRoleUI();
      }

      function applyRoleUI() {
        const navDash = document.getElementById('nav-dashboard');
        const navTracker = document.getElementById('nav-tracker');
        const roleBadge = document.getElementById('role-badge');
        const authBtn = document.getElementById('btn-auth-action');
        const authLabel = document.getElementById('auth-btn-label');

        if (isAdmin) {
          navDash.classList.remove('hidden');
          navTracker.classList.add('hidden');
          roleBadge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/20 text-amber-200 border border-amber-400/30';
          roleBadge.textContent = 'Admin Kecamatan';
          authBtn.className = 'px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap bg-rose-500 hover:bg-rose-600 text-white ml-1';
          authLabel.textContent = 'Logout Admin';
        } else {
          navDash.classList.add('hidden');
          navTracker.classList.remove('hidden');
          roleBadge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30';
          roleBadge.textContent = 'Mode Pengusul';
          authBtn.className = 'px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap bg-amber-500 hover:bg-amber-600 text-slate-950 ml-1';
          authLabel.textContent = 'Login Admin';
        }
      }

      function setDbBadge(connected, labelText) {
        dbConnected = connected;
        const badge = document.getElementById('db-status-badge');
        if (!badge) return;
        if (connected) {
          badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-200 border border-emerald-400/30';
          badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>${escapeHtml(labelText || 'Supabase Terhubung')}`;
        } else {
          badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/20 text-amber-200 border border-amber-400/30';
          badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>${escapeHtml(labelText || 'Mode Lokal')}`;
        }
      }

      function toDbRow(p) {
        return {
          id: p.id,
          nomor_surat: p.nomorSurat,
          tanggal: p.tanggal,
          jenis_pengusul: p.jenisPengusul,
          nama_pengusul: p.namaPengusul,
          wilayah: p.wilayah,
          tujuan_camat: p.tujuanCamat,
          ketua: p.ketua,
          kontak: p.kontak || '',
          urusan_no: Number(p.urusanNo) || 1,
          urusan_nama: p.urusanNama || '',
          sub_kegiatan: p.subKegiatan || '',
          judul: p.judul,
          mekanisme: p.mekanisme || '',
          seksi_tujuan: p.seksiTujuan || '',
          kriteria: Array.isArray(p.kriteria) ? p.kriteria : [],
          urgensi: p.urgensi || '',
          anggota: Number(p.anggota) || 0,
          anggaran: Number(p.anggaran) || 0,
          lokasi: p.lokasi || '',
          swadaya: p.swadaya || '',
          lampiran: p.lampiran || {},
          status: p.status || 'Diajukan',
          catatan_verifikator: p.catatanVerifikator || '',
          updated_at: p.updatedAt || new Date().toISOString()
        };
      }

      function fromDbRow(r) {
        return {
          id: r.id,
          nomorSurat: r.nomor_surat,
          tanggal: r.tanggal,
          jenisPengusul: r.jenis_pengusul,
          namaPengusul: r.nama_pengusul,
          wilayah: r.wilayah,
          tujuanCamat: r.tujuan_camat,
          ketua: r.ketua,
          kontak: r.kontak || '',
          urusanNo: r.urusan_no,
          urusanNama: r.urusan_nama,
          subKegiatan: r.sub_kegiatan,
          judul: r.judul,
          mekanisme: r.mekanisme,
          seksiTujuan: r.seksi_tujuan,
          kriteria: Array.isArray(r.kriteria) ? r.kriteria : [],
          urgensi: r.urgensi || '',
          anggota: Number(r.anggota) || 0,
          anggaran: Number(r.anggaran) || 0,
          lokasi: r.lokasi || '',
          swadaya: r.swadaya || '',
          lampiran: r.lampiran || {},
          status: r.status || 'Diajukan',
          catatanVerifikator: r.catatan_verifikator || '',
          updatedAt: r.updated_at
        };
      }

      function saveLocalCache() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
        } catch (e) {
          // Ignore
        }
      }

      function loadLocalCache() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
          }
        } catch (e) {
          // Ignore
        }
        return JSON.parse(JSON.stringify(INITIAL_SAMPLES));
      }

      async function syncFromSupabase(silent = true) {
        if (!sb) {
          setDbBadge(false, 'Mode Lokal');
          return;
        }
        try {
          const { data, error } = await sb
            .from('proposals')
            .select('*')
            .order('updated_at', { ascending: false });

          if (error) throw error;

          setDbBadge(true, 'Supabase Terhubung');
          proposals = (data || []).map(fromDbRow);
          saveLocalCache();
          renderMyProposals();
          if (isAdmin) renderDashboard();
          if (!silent) showToast('Data berhasil disinkronkan dari Supabase.');
        } catch (err) {
          setDbBadge(false, 'Mode Lokal (Offline)');
          if (!silent) showToast('Gagal terhubung ke Supabase, menampilkan data lokal.', 'info');
        }
      }

      async function seedSamplesToDb() {
        if (!isAdmin) return;
        const samples = JSON.parse(JSON.stringify(INITIAL_SAMPLES));
        proposals = samples;
        saveLocalCache();
        if (sb && dbConnected) {
          try {
            const { error } = await sb.from('proposals').upsert(samples.map(toDbRow));
            if (error) throw error;
            showToast('3 contoh proposal berhasil disimpan ke database Supabase.');
          } catch (e) {
            showToast('Contoh dimuat secara lokal (gagal menulis ke Supabase).', 'error');
          }
        } else {
          showToast('3 contoh proposal dimuat secara lokal.');
        }
        renderDashboard();
      }

      function formatRupiah(num) {
        const val = Number(num) || 0;
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0
        }).format(val);
      }

      function formatTanggal(isoDate) {
        if (!isoDate) return '-';
        const d = new Date(isoDate + 'T00:00:00');
        if (isNaN(d.getTime())) return isoDate;
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      }

      function escapeHtml(str) {
        return String(str ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        const colors = {
          success: 'bg-emerald-700 text-white',
          error: 'bg-red-600 text-white',
          info: 'bg-navy-800 text-white'
        };
        toast.className = `${colors[type] || colors.info} px-4 py-2.5 rounded-lg shadow-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition-opacity duration-300`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => toast.remove(), 300);
        }, 3200);
      }

      function switchTab(tabName) {
        if (tabName === 'dashboard' && !isAdmin) {
          openLoginModal();
          return;
        }
        document.querySelectorAll('.nav-tab').forEach(btn => {
          const active = btn.dataset.tab === tabName;
          btn.classList.toggle('bg-white/15', active);
          btn.classList.toggle('text-white', active);
          btn.classList.toggle('text-slate-200', !active);
        });
        ['tracker', 'dashboard', 'form', 'regulasi'].forEach(name => {
          const el = document.getElementById(`tab-${name}`);
          if (el) el.classList.toggle('hidden', name !== tabName);
        });
        if (tabName === 'tracker') renderMyProposals();
        if (tabName === 'dashboard') renderDashboard();
        if (tabName === 'regulasi') renderCatalog();
      }

      function getStatusBadge(status) {
        const map = {
          'Draft': 'bg-slate-100 text-slate-700 border-slate-200',
          'Diajukan': 'bg-blue-50 text-blue-700 border-blue-200',
          'Disposisi Seksi': 'bg-amber-50 text-amber-700 border-amber-200',
          'Perlu Perbaikan': 'bg-rose-50 text-rose-700 border-rose-200',
          'Disetujui': 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
        const cls = map[status] || map['Draft'];
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}">${escapeHtml(status)}</span>`;
      }

      function countLampiran(lampiran) {
        if (!lampiran) return 0;
        return Object.values(lampiran).filter(Boolean).length;
      }

      function renderTrackingCard(p) {
        const stages = ['Diajukan', 'Disposisi Seksi', 'Disetujui'];
        let stepIdx = 0;
        if (p.status === 'Draft') stepIdx = -1;
        else if (p.status === 'Diajukan') stepIdx = 0;
        else if (p.status === 'Disposisi Seksi' || p.status === 'Perlu Perbaikan') stepIdx = 1;
        else if (p.status === 'Disetujui') stepIdx = 2;

        return `
          <div class="p-4 sm:p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded bg-navy-700 text-white text-xs font-bold">${escapeHtml(getNomorUsulanDisplay(p))}</span>
                  <span class="text-xs text-slate-500">No. Surat: <strong>${escapeHtml(p.nomorSurat)}</strong></span>
                  <span class="text-xs text-slate-500">• ${formatTanggal(p.tanggal)}</span>
                </div>
                <h4 class="text-sm sm:text-base font-bold text-slate-900">${escapeHtml(p.judul)}</h4>
                <p class="text-xs text-slate-600">${escapeHtml(p.namaPengusul)} (${escapeHtml(p.wilayah)}) • ${p.urusanNo ? `${p.urusanNo}. ` : ''}${escapeHtml(p.urusanNama)}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                ${getStatusBadge(p.status)}
                <button type="button" data-tracker-preview="${escapeHtml(p.id)}" class="px-3 py-1.5 rounded-lg bg-navy-50 hover:bg-navy-100 text-navy-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors">
                  <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                  Cetak Surat
                </button>
              </div>
            </div>

            <!-- Progress Jejak -->
            <div class="grid grid-cols-3 gap-2 pt-1">
              ${stages.map((st, i) => {
                const done = i <= stepIdx;
                const isIssue = p.status === 'Perlu Perbaikan' && i === 1;
                const barCls = isIssue ? 'bg-rose-500' : (done ? 'bg-emerald-500' : 'bg-slate-200');
                const txtCls = isIssue ? 'text-rose-700 font-semibold' : (done ? 'text-emerald-700 font-semibold' : 'text-slate-400');
                return `
                  <div>
                    <div class="h-1.5 rounded-full ${barCls}"></div>
                    <p class="text-[11px] mt-1 ${txtCls}">${isIssue ? 'Perlu Perbaikan' : st}</p>
                  </div>
                `;
              }).join('')}
            </div>

            ${p.catatanVerifikator ? `
              <div class="bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5 text-xs text-amber-900">
                <strong class="block text-amber-950 mb-0.5">Catatan Disposisi / Verifikasi Kecamatan:</strong>
                ${escapeHtml(p.catatanVerifikator)}
              </div>
            ` : ''}
          </div>
        `;
      }

      function renderMyProposals() {
        const listEl = document.getElementById('my-proposals-list');
        const countEl = document.getElementById('my-proposals-count');
        const mine = proposals.filter(p => myProposalIds.includes(p.id));
        countEl.textContent = `${mine.length} Usulan`;

        if (mine.length === 0) {
          listEl.innerHTML = `
            <div class="p-8 text-center text-xs sm:text-sm text-slate-500">
              Belum ada usulan yang dikirim dari perangkat ini. Gunakan kotak pencarian di atas dengan memasukkan persis <strong>Nomor Usulan / ID</strong> yang Anda terima setelah mengirim usulan.
            </div>
          `;
          return;
        }

        listEl.innerHTML = mine.map(renderTrackingCard).join('');
        if (window.lucide) lucide.createIcons();
      }

      function handleTrackerSearch(e) {
        e.preventDefault();
        const idRaw = (document.getElementById('tracker-id-input').value || '').trim();
        const idQ = idRaw.toLowerCase().replace(/\s+/g, ' ');
        const resultBox = document.getElementById('tracker-search-result');

        if (!idQ) {
          resultBox.classList.add('hidden');
          showToast('Masukkan Nomor Usulan / ID Anda terlebih dahulu.', 'error');
          return;
        }

        const matches = proposals.filter(p => {
          const fullId = (p.id || '').toLowerCase().trim();
          return fullId === idQ;
        });

        resultBox.classList.remove('hidden');
        if (matches.length === 0) {
          resultBox.innerHTML = `
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Tidak ditemukan proposal dengan Nomor Usulan / ID <strong>"${escapeHtml(idRaw)}"</strong>. Pastikan Anda memasukkan ID persis seperti yang diberikan setelah pengajuan.
            </div>
          `;
          return;
        }

        resultBox.innerHTML = `
          <div class="rounded-xl border border-navy-200 bg-navy-50/30 divide-y divide-slate-200">
            ${matches.map(renderTrackingCard).join('')}
          </div>
        `;
        if (window.lucide) lucide.createIcons();
      }

      function populateAdminFilters() {
        const desaSel = document.getElementById('filter-desa');
        const urusanSel = document.getElementById('filter-urusan');
        if (!desaSel || !urusanSel) return;

        const prevDesa = desaSel.value;
        const prevUrusan = urusanSel.value;

        const desaMap = new Map();
        proposals.forEach(p => {
          const raw = (p.wilayah || '').trim();
          if (raw) {
            const key = raw.toLowerCase();
            if (!desaMap.has(key)) desaMap.set(key, raw);
          }
        });
        const sortedDesas = Array.from(desaMap.values()).sort((a, b) => a.localeCompare(b, 'id'));
        desaSel.innerHTML = '<option value="">Semua Desa/Kelurahan</option>' +
          sortedDesas.map(d => `<option value="${escapeHtml(d.toLowerCase())}">${escapeHtml(d)}</option>`).join('');
        if (prevDesa) desaSel.value = prevDesa;

        const urusanMap = new Map();
        proposals.forEach(p => {
          if (p.urusanNo || p.urusanNama) {
            const key = String(p.urusanNo || p.urusanNama);
            if (!urusanMap.has(key)) {
              urusanMap.set(key, {
                no: Number(p.urusanNo) || 999,
                label: p.urusanNo ? `${p.urusanNo}. ${p.urusanNama}` : p.urusanNama
              });
            }
          }
        });
        const sortedUrusan = Array.from(urusanMap.entries()).sort((a, b) => a[1].no - b[1].no);
        urusanSel.innerHTML = '<option value="">Semua Urusan</option>' +
          sortedUrusan.map(([k, v]) => `<option value="${escapeHtml(k)}">${escapeHtml(v.label)}</option>`).join('');
        if (prevUrusan) urusanSel.value = prevUrusan;
      }

      function getFilteredProposals() {
        const q = (document.getElementById('search-input').value || '').trim().toLowerCase();
        const st = document.getElementById('filter-status').value;
        const kat = document.getElementById('filter-kategori').value;
        const desa = (document.getElementById('filter-desa')?.value || '').toLowerCase();
        const urusan = document.getElementById('filter-urusan')?.value || '';

        return proposals.filter(p => {
          const matchQ = !q ||
            getNomorUsulan(p).toLowerCase().includes(q) ||
            (p.id || '').toLowerCase().includes(q) ||
            (p.namaPengusul || '').toLowerCase().includes(q) ||
            (p.wilayah || '').toLowerCase().includes(q) ||
            (p.judul || '').toLowerCase().includes(q) ||
            (p.urusanNama || '').toLowerCase().includes(q) ||
            (p.subKegiatan || '').toLowerCase().includes(q) ||
            (p.nomorSurat || '').toLowerCase().includes(q);
          const matchSt = !st || p.status === st;
          const matchKat = !kat || p.jenisPengusul === kat;
          const matchDesa = !desa || (p.wilayah || '').trim().toLowerCase() === desa;
          const matchUrusan = !urusan || String(p.urusanNo || p.urusanNama) === urusan;
          return matchQ && matchSt && matchKat && matchDesa && matchUrusan;
        });
      }

      function renderKPIs() {
        const total = proposals.length;
        const proses = proposals.filter(p => p.status === 'Diajukan' || p.status === 'Disposisi Seksi').length;
        const disetujui = proposals.filter(p => p.status === 'Disetujui').length;
        const totalAnggaran = proposals.reduce((acc, p) => acc + (Number(p.anggaran) || 0), 0);

        document.getElementById('kpi-total').textContent = total;
        document.getElementById('kpi-proses').textContent = proses;
        document.getElementById('kpi-disetujui').textContent = disetujui;
        document.getElementById('kpi-anggaran').textContent = formatRupiah(totalAnggaran);
      }

      function renderCharts() {
        if (typeof Chart === 'undefined') return;

        const statusLabels = ['Draft', 'Diajukan', 'Disposisi Seksi', 'Perlu Perbaikan', 'Disetujui'];
        const statusCounts = statusLabels.map(lbl => proposals.filter(p => p.status === lbl).length);

        const ctxStatus = document.getElementById('chart-status').getContext('2d');
        if (statusChart) statusChart.destroy();
        statusChart = new Chart(ctxStatus, {
          type: 'bar',
          data: {
            labels: statusLabels,
            datasets: [{
              label: 'Jumlah Proposal',
              data: statusCounts,
              backgroundColor: ['#94a3b8', '#3b82f6', '#f59e0b', '#f43f5e', '#10b981'],
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
              x: { ticks: { font: { size: 11 } } }
            }
          }
        });

        const katLabels = [
          'Kelompok Masyarakat',
          'Kelompok Tani / Nelayan / UMKM',
          'Ormas / Pemuda',
          'Desa / Kelurahan',
          'Lembaga Keagamaan / Pendidikan / Lainnya'
        ];
        const katShortLabels = ['Pokmas', 'Poktan/Nelayan/UMKM', 'Ormas/Pemuda', 'Desa/Kelurahan', 'Lembaga Lainnya'];
        const katCounts = katLabels.map(lbl => proposals.filter(p => p.jenisPengusul === lbl).length);

        const ctxKat = document.getElementById('chart-kategori').getContext('2d');
        if (kategoriChart) kategoriChart.destroy();
        kategoriChart = new Chart(ctxKat, {
          type: 'doughnut',
          data: {
            labels: katShortLabels,
            datasets: [{
              data: katCounts,
              backgroundColor: ['#1e3a5f', '#0d9488', '#d97706', '#6366f1', '#64748b'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } }
            }
          }
        });
      }

      function renderProposalRow(p) {
        const lampCount = countLampiran(p.lampiran);
        const noUsulan = getNomorUsulan(p);
        return `
          <tr class="hover:bg-slate-50/80 transition-colors">
            <td class="py-3.5 px-4 align-top whitespace-nowrap">
              <div class="inline-block px-2 py-0.5 rounded bg-navy-700 text-white text-[11px] font-bold">${escapeHtml(getNomorUsulanDisplay(p))}</div>
              <div class="font-semibold text-slate-900 text-xs mt-1">${escapeHtml(p.nomorSurat)}</div>
              <div class="text-xs text-slate-500 mt-0.5">${formatTanggal(p.tanggal)}</div>
            </td>
            <td class="py-3.5 px-4 align-top">
              <div class="font-semibold text-slate-900">${escapeHtml(p.namaPengusul)}</div>
              <span class="inline-block mt-0.5 px-2 py-0.5 rounded bg-navy-50 text-navy-700 text-[11px] font-medium">${escapeHtml(p.jenisPengusul)}</span>
              <div class="text-xs text-slate-500 mt-1">${escapeHtml(p.wilayah)}</div>
            </td>
            <td class="py-3.5 px-4 align-top max-w-xs">
              <div class="font-semibold text-slate-900 leading-snug">${escapeHtml(p.judul)}</div>
              <div class="text-xs text-navy-700 font-medium mt-1">${p.urusanNo ? `${p.urusanNo}. ` : ''}${escapeHtml(p.urusanNama)}</div>
              <div class="text-[11px] text-slate-500 mt-0.5">${escapeHtml(p.seksiTujuan)} • ${escapeHtml(p.mekanisme)}</div>
              ${p.catatanVerifikator ? `<div class="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1.5">${escapeHtml(p.catatanVerifikator)}</div>` : ''}
            </td>
            <td class="py-3.5 px-4 align-top whitespace-nowrap">
              <div class="text-xs font-semibold text-slate-800">${formatRupiah(p.anggaran)}</div>
              <div class="text-xs text-slate-500 mt-0.5">Penerima: ${Number(p.anggota) || 0} org • Berkas: ${lampCount}/6</div>
            </td>
            <td class="py-3.5 px-4 align-top whitespace-nowrap">
              ${getStatusBadge(p.status)}
            </td>
            <td class="py-3.5 px-4 align-top text-right whitespace-nowrap">
              <div class="inline-flex items-center gap-1">
                <button type="button" data-action="preview" data-id="${escapeHtml(p.id)}" title="Pratinjau & Cetak" class="p-1.5 rounded-lg text-navy-700 hover:bg-navy-50 transition-colors">
                  <i data-lucide="printer" class="w-4 h-4"></i>
                </button>
                <button type="button" data-action="status" data-id="${escapeHtml(p.id)}" title="Disposisi & Status" class="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors">
                  <i data-lucide="check-square" class="w-4 h-4"></i>
                </button>
                <button type="button" data-action="edit" data-id="${escapeHtml(p.id)}" title="Edit Proposal" class="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                  <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button type="button" data-action="delete" data-id="${escapeHtml(p.id)}" title="Hapus" class="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }

      function renderTable() {
        const tbody = document.getElementById('proposal-table-body');
        const empty = document.getElementById('empty-state');
        const rows = getFilteredProposals();

        if (rows.length === 0) {
          tbody.innerHTML = '';
          empty.classList.remove('hidden');
          return;
        }
        empty.classList.add('hidden');

        if (groupByMode === 'none') {
          tbody.innerHTML = rows.map(renderProposalRow).join('');
        } else if (groupByMode === 'desa') {
          const groups = new Map();
          rows.forEach(p => {
            const label = (p.wilayah || 'Desa/Kelurahan Lainnya').trim();
            const key = label.toLowerCase();
            if (!groups.has(key)) groups.set(key, { label, items: [] });
            groups.get(key).items.push(p);
          });
          const sorted = Array.from(groups.values()).sort((a, b) => a.label.localeCompare(b.label, 'id'));
          tbody.innerHTML = sorted.map(g => {
            const totalRab = g.items.reduce((acc, x) => acc + (Number(x.anggaran) || 0), 0);
            const hdr = `
              <tr class="bg-navy-50/90 border-y border-navy-200">
                <td colspan="6" class="py-2.5 px-4">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-navy-900">
                      <i data-lucide="map-pin" class="w-4 h-4 text-navy-700 shrink-0"></i>
                      <span>${escapeHtml(g.label)}</span>
                      <span class="px-2 py-0.5 rounded-full bg-navy-700 text-white text-[11px] font-semibold">${g.items.length} Usulan</span>
                    </div>
                    <span class="text-xs font-bold text-navy-800">Total RAB: ${formatRupiah(totalRab)}</span>
                  </div>
                </td>
              </tr>
            `;
            return hdr + g.items.map(renderProposalRow).join('');
          }).join('');
        } else if (groupByMode === 'urusan') {
          const groups = new Map();
          rows.forEach(p => {
            const uNo = Number(p.urusanNo) || 999;
            const uLabel = p.urusanNo ? `${p.urusanNo}. ${p.urusanNama}` : (p.urusanNama || 'Urusan Lainnya');
            const key = `${uNo}-${uLabel}`;
            if (!groups.has(key)) groups.set(key, { no: uNo, label: uLabel, items: [] });
            groups.get(key).items.push(p);
          });
          const sorted = Array.from(groups.values()).sort((a, b) => a.no - b.no);
          tbody.innerHTML = sorted.map(g => {
            const totalRab = g.items.reduce((acc, x) => acc + (Number(x.anggaran) || 0), 0);
            const hdr = `
              <tr class="bg-navy-50/90 border-y border-navy-200">
                <td colspan="6" class="py-2.5 px-4">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-navy-900">
                      <i data-lucide="folder-kanban" class="w-4 h-4 text-navy-700 shrink-0"></i>
                      <span>${escapeHtml(g.label)}</span>
                      <span class="px-2 py-0.5 rounded-full bg-navy-700 text-white text-[11px] font-semibold">${g.items.length} Usulan</span>
                    </div>
                    <span class="text-xs font-bold text-navy-800">Total RAB: ${formatRupiah(totalRab)}</span>
                  </div>
                </td>
              </tr>
            `;
            return hdr + g.items.map(renderProposalRow).join('');
          }).join('');
        } else {
          // Default: 'desa-urusan' (Kelompokkan by Desa dan Urusan)
          const desaGroups = new Map();
          rows.forEach(p => {
            const desaLabel = (p.wilayah || 'Desa/Kelurahan Lainnya').trim();
            const desaKey = desaLabel.toLowerCase();
            if (!desaGroups.has(desaKey)) desaGroups.set(desaKey, { label: desaLabel, items: [] });
            desaGroups.get(desaKey).items.push(p);
          });
          const sortedDesas = Array.from(desaGroups.values()).sort((a, b) => a.label.localeCompare(b.label, 'id'));
          tbody.innerHTML = sortedDesas.map(dg => {
            const desaRab = dg.items.reduce((acc, x) => acc + (Number(x.anggaran) || 0), 0);
            const desaHdr = `
              <tr class="bg-navy-50/95 border-y border-navy-200">
                <td colspan="6" class="py-2.5 px-4">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-navy-900">
                      <i data-lucide="map-pin" class="w-4 h-4 text-navy-700 shrink-0"></i>
                      <span>${escapeHtml(dg.label)}</span>
                      <span class="px-2 py-0.5 rounded-full bg-navy-700 text-white text-[11px] font-semibold">${dg.items.length} Usulan</span>
                    </div>
                    <span class="text-xs font-bold text-navy-800">Total RAB Desa: ${formatRupiah(desaRab)}</span>
                  </div>
                </td>
              </tr>
            `;

            const urusanGroups = new Map();
            dg.items.forEach(p => {
              const uNo = Number(p.urusanNo) || 999;
              const uLabel = p.urusanNo ? `${p.urusanNo}. ${p.urusanNama}` : (p.urusanNama || 'Urusan Lainnya');
              const uKey = `${uNo}-${uLabel}`;
              if (!urusanGroups.has(uKey)) urusanGroups.set(uKey, { no: uNo, label: uLabel, items: [] });
              urusanGroups.get(uKey).items.push(p);
            });
            const sortedUrusan = Array.from(urusanGroups.values()).sort((a, b) => a.no - b.no);

            const urusanHtml = sortedUrusan.map(ug => {
              const uRab = ug.items.reduce((acc, x) => acc + (Number(x.anggaran) || 0), 0);
              const uHdr = `
                <tr class="bg-slate-100/80 border-b border-slate-200">
                  <td colspan="6" class="py-2 px-4 pl-7">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <i data-lucide="corner-down-right" class="w-3.5 h-3.5 text-amber-600 shrink-0"></i>
                        <span>${escapeHtml(ug.label)}</span>
                        <span class="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">${ug.items.length}</span>
                      </div>
                      <span class="text-[11px] font-semibold text-slate-600">Subtotal RAB: ${formatRupiah(uRab)}</span>
                    </div>
                  </td>
                </tr>
              `;
              return uHdr + ug.items.map(renderProposalRow).join('');
            }).join('');

            return desaHdr + urusanHtml;
          }).join('');
        }

        if (window.lucide) lucide.createIcons();
      }

      function renderDashboard() {
        populateAdminFilters();
        if (!isAdmin) return;
        renderKPIs();
        renderCharts();
        renderTable();
      }

      function populateUrusanDropdown(selectedNo = 1) {
        const sel = document.getElementById('field-urusan');
        sel.innerHTML = PERBUP_URUSAN.map(u => `
          <option value="${u.no}" ${Number(selectedNo) === u.no ? 'selected' : ''}>${u.no}. ${escapeHtml(u.nama)}</option>
        `).join('');
        populateSubkegiatanDropdown(selectedNo);
      }

      function populateSubkegiatanDropdown(urusanNo, selectedSub = '') {
        const urusan = PERBUP_URUSAN.find(u => u.no === Number(urusanNo)) || PERBUP_URUSAN[0];
        const sel = document.getElementById('field-subkegiatan');
        sel.innerHTML = urusan.items.map(item => `
          <option value="${escapeHtml(item)}" ${item === selectedSub ? 'selected' : ''}>${escapeHtml(item)}</option>
        `).join('');
      }

      function renderKriteriaCheckboxes(selected = []) {
        const container = document.getElementById('kriteria-container');
        container.innerHTML = KRITERIA_PASAL.map(item => {
          const checked = selected.includes(item) ? 'checked' : '';
          return `
            <label class="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-white">
              <input type="checkbox" name="kriteria" value="${escapeHtml(item)}" ${checked} class="mt-0.5 rounded text-navy-700 focus:ring-navy-600" />
              <span>${escapeHtml(item)}</span>
            </label>
          `;
        }).join('');
      }

      function updateLampiranBadge() {
        const checkedCount = document.querySelectorAll('.lampiran-chk:checked').length;
        const badge = document.getElementById('lampiran-badge');
        badge.textContent = `${checkedCount}/6 Dokumen`;
        badge.className = checkedCount === 6
          ? 'px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800'
          : 'px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800';
      }

      function resetForm() {
        hpNoticeShown = false;
        document.getElementById('proposal-form').reset();
        document.getElementById('field-id').value = '';
        document.getElementById('field-tujuan-camat').value = 'Camat Bunta (Kabupaten Banggai)';
        document.getElementById('field-tanggal').value = new Date().toISOString().slice(0, 10);
        document.getElementById('field-anggota').value = 25;
        document.getElementById('field-anggaran').value = 15000000;
        document.getElementById('form-heading').textContent = 'Formulir Pengajuan Proposal ke Camat Bunta';
        document.getElementById('form-tab-label').textContent = 'Ajukan Proposal';
        populateUrusanDropdown(1);
        renderKriteriaCheckboxes([]);
        updateLampiranBadge();
      }

      function loadProposalToForm(id) {
        if (!isAdmin) return;
        const p = proposals.find(item => item.id === id);
        if (!p) return;
        hpNoticeShown = false;
        document.getElementById('field-id').value = p.id;
        document.getElementById('field-jenis-pengusul').value = p.jenisPengusul || 'Kelompok Masyarakat';
        document.getElementById('field-nama-pengusul').value = p.namaPengusul || '';
        document.getElementById('field-wilayah').value = p.wilayah || '';
        document.getElementById('field-tujuan-camat').value = p.tujuanCamat || 'Camat Bunta (Kabupaten Banggai)';
        document.getElementById('field-nomor').value = p.nomorSurat || '';
        document.getElementById('field-tanggal').value = p.tanggal || '';
        document.getElementById('field-ketua').value = p.ketua || '';
        document.getElementById('field-kontak').value = p.kontak || '';

        const uNo = p.urusanNo || 1;
        populateUrusanDropdown(uNo);
        populateSubkegiatanDropdown(uNo, p.subKegiatan || '');

        document.getElementById('field-judul').value = p.judul || '';
        document.getElementById('field-mekanisme').value = p.mekanisme || 'Swakelola POKMAS';
        document.getElementById('field-seksi').value = p.seksiTujuan || 'Seksi Pemerintahan';
        renderKriteriaCheckboxes(p.kriteria || []);
        document.getElementById('field-urgensi').value = p.urgensi || '';
        document.getElementById('field-anggota').value = p.anggota ?? 0;
        document.getElementById('field-anggaran').value = p.anggaran ?? 0;
        document.getElementById('field-lokasi').value = p.lokasi || '';
        document.getElementById('field-swadaya').value = p.swadaya || '';

        const lamp = p.lampiran || {};
        ['suratPermohonan', 'naskahProposal', 'legalitas', 'rab', 'dokumentasi', 'beritaAcaraMusdes'].forEach(k => {
          const el = document.getElementById(`lamp-${k}`);
          if (el) el.checked = Boolean(lamp[k]);
        });
        updateLampiranBadge();

        document.getElementById('form-heading').textContent = `Edit Proposal: ${p.namaPengusul}`;
        document.getElementById('form-tab-label').textContent = 'Edit Proposal';
        switchTab('form');
      }

      async function saveProposalFromForm(targetStatus) {
        const namaPengusul = document.getElementById('field-nama-pengusul').value.trim();
        const wilayah = document.getElementById('field-wilayah').value.trim();
        const tujuanCamat = document.getElementById('field-tujuan-camat').value.trim();
        const nomor = document.getElementById('field-nomor').value.trim();
        const tanggal = document.getElementById('field-tanggal').value;
        const ketua = document.getElementById('field-ketua').value.trim();
        const judul = document.getElementById('field-judul').value.trim();
        const urgensi = document.getElementById('field-urgensi').value.trim();

        if (!namaPengusul || !wilayah || !tujuanCamat || !nomor || !tanggal || !ketua || !judul || !urgensi) {
          showToast('Mohon lengkapi seluruh kolom bertanda bintang (*).', 'error');
          return;
        }

        const urusanNo = Number(document.getElementById('field-urusan').value);
        const urusanObj = PERBUP_URUSAN.find(u => u.no === urusanNo) || PERBUP_URUSAN[0];
        const existingId = document.getElementById('field-id').value;
        const kriteria = Array.from(document.querySelectorAll('input[name="kriteria"]:checked')).map(el => el.value);
        const lampiran = {
          suratPermohonan: document.getElementById('lamp-suratPermohonan').checked,
          naskahProposal: document.getElementById('lamp-naskahProposal').checked,
          legalitas: document.getElementById('lamp-legalitas').checked,
          rab: document.getElementById('lamp-rab').checked,
          dokumentasi: document.getElementById('lamp-dokumentasi').checked,
          beritaAcaraMusdes: document.getElementById('lamp-beritaAcaraMusdes').checked
        };

        const generatedId = existingId || generateRandomTrackingId();
        const payload = {
          id: generatedId,
          nomorSurat: nomor,
          tanggal,
          jenisPengusul: document.getElementById('field-jenis-pengusul').value,
          namaPengusul,
          wilayah,
          tujuanCamat,
          ketua,
          kontak: document.getElementById('field-kontak').value.trim(),
          urusanNo: urusanObj.no,
          urusanNama: urusanObj.nama,
          subKegiatan: document.getElementById('field-subkegiatan').value,
          judul,
          mekanisme: document.getElementById('field-mekanisme').value,
          seksiTujuan: document.getElementById('field-seksi').value,
          kriteria,
          urgensi,
          anggota: Number(document.getElementById('field-anggota').value) || 0,
          anggaran: Number(document.getElementById('field-anggaran').value) || 0,
          lokasi: document.getElementById('field-lokasi').value.trim(),
          swadaya: document.getElementById('field-swadaya').value.trim(),
          lampiran,
          status: targetStatus,
          catatanVerifikator: existingId ? (proposals.find(x => x.id === existingId)?.catatanVerifikator || '') : '',
          updatedAt: new Date().toISOString()
        };

        if (existingId) {
          const idx = proposals.findIndex(x => x.id === existingId);
          if (idx >= 0) proposals[idx] = payload;
        } else {
          proposals.unshift(payload);
        }
        registerMyId(payload.id);
        saveLocalCache();

        if (sb) {
          try {
            const { error } = await sb.from('proposals').upsert(toDbRow(payload));
            if (error) throw error;
            setDbBadge(true, 'Supabase Terhubung');
            showToast(`Tersimpan di database! Nomor Usulan: ${getNomorUsulan(payload)}`);
          } catch (e) {
            showToast(`Tersimpan lokal. Nomor Usulan: ${getNomorUsulan(payload)}`, 'info');
          }
        } else {
          showToast(`Proposal disimpan! Nomor Usulan: ${getNomorUsulan(payload)}`);
        }

        const noUsulanDisplay = getNomorUsulanDisplay(payload);
        document.getElementById('success-modal-title').textContent = targetStatus === 'Draft' ? 'Draft Usulan Disimpan' : 'Usulan Berhasil Diajukan!';
        document.getElementById('success-nama-pengusul').textContent = payload.namaPengusul;
        document.getElementById('success-nomor-usulan').textContent = noUsulanDisplay;
        document.getElementById('success-kode-tracking').textContent = payload.id;
        document.getElementById('modal-submit-success').classList.remove('hidden');

        resetForm();
        switchTab(isAdmin ? 'dashboard' : 'tracker');
      }

      function renderCatalog() {
        const q = (document.getElementById('catalog-search').value || '').trim().toLowerCase();
        const container = document.getElementById('catalog-list');
        const filtered = PERBUP_URUSAN.filter(u => {
          if (!q) return true;
          return u.nama.toLowerCase().includes(q) || u.items.some(i => i.toLowerCase().includes(q));
        });

        if (filtered.length === 0) {
          container.innerHTML = `<div class="p-8 text-center text-sm text-slate-500">Tidak ada urusan atau kegiatan yang cocok dengan "${escapeHtml(q)}".</div>`;
          return;
        }

        container.innerHTML = filtered.map(u => `
          <div class="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg bg-navy-700 text-white text-xs font-bold flex items-center justify-center shrink-0">${u.no}</span>
                <h3 class="text-sm font-bold text-slate-900">${escapeHtml(u.nama)}</h3>
              </div>
              <button type="button" data-use-urusan="${u.no}" class="px-3 py-1.5 rounded-lg bg-navy-50 hover:bg-navy-100 text-navy-700 text-xs font-semibold transition-colors inline-flex items-center gap-1">
                <i data-lucide="file-plus-2" class="w-3.5 h-3.5"></i>
                Ajukan Kegiatan Ini
              </button>
            </div>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-700 pl-9 list-disc">
              ${u.items.map(it => `<li>${escapeHtml(it)}</li>`).join('')}
            </ul>
          </div>
        `).join('');

        if (window.lucide) lucide.createIcons();
      }

      function openPreviewModal(id) {
        const p = proposals.find(item => item.id === id);
        if (!p) return;

        const lampLabels = [
          ['suratPermohonan', 'Surat Permohonan Resmi ke Camat'],
          ['naskahProposal', 'Naskah Proposal Lengkap'],
          ['legalitas', 'SK / Legalitas Kelompok & Daftar Anggota'],
          ['rab', 'Rincian Anggaran Biaya (RAB)'],
          ['dokumentasi', 'Dokumentasi Kondisi Eksisting / Titik Lokasi'],
          ['beritaAcaraMusdes', 'Berita Acara Musdes/Musrembang Desa/Kelurahan yang memuat usulan tersebut']
        ];

        const printArea = document.getElementById('print-area');
        printArea.innerHTML = `
          <div class="border-b-4 border-double border-slate-900 pb-3 text-center">
            <p class="text-xs font-bold uppercase tracking-widest">${escapeHtml(p.jenisPengusul)}</p>
            <h2 class="text-lg font-bold uppercase tracking-wide mt-0.5">${escapeHtml(p.namaPengusul)}</h2>
            <p class="text-xs text-slate-600">Wilayah / Alamat: ${escapeHtml(p.wilayah)} ${p.kontak ? '• Telp/WA: ' + escapeHtml(p.kontak) : ''}</p>
          </div>

          <div class="flex flex-col sm:flex-row justify-between gap-4 text-xs pt-1">
            <table class="border-collapse">
              <tr><td class="pr-3 py-0.5 font-semibold">Kode Tracking</td><td>: ${escapeHtml(p.id)}</td></tr>
              <tr><td class="pr-3 py-0.5 font-semibold">Nomor Surat</td><td>: ${escapeHtml(p.nomorSurat)}</td></tr>
              <tr><td class="pr-3 py-0.5 font-semibold">Lampiran</td><td>: ${countLampiran(p.lampiran)} Berkas</td></tr>
              <tr><td class="pr-3 py-0.5 font-semibold">Perihal</td><td class="font-semibold">: Usulan Kegiatan Pelimpahan Kewenangan (Perbup No. 1/2026)</td></tr>
            </table>
            <div class="sm:text-right">
              <p>${escapeHtml(p.wilayah)}, ${formatTanggal(p.tanggal)}</p>
              <p class="mt-2 font-semibold">Kepada Yth.</p>
              <p class="font-bold">Bapak/Ibu ${escapeHtml(p.tujuanCamat)}</p>
              <p>di - Tempat</p>
            </div>
          </div>

          <div class="space-y-2 pt-2">
            <h3 class="font-bold text-sm uppercase border-b border-slate-300 pb-1">I. Judul & Rujukan Perbup Banggai No. 1 Tahun 2026</h3>
            <p class="font-semibold text-slate-900">${escapeHtml(p.judul)}</p>
            <p class="text-xs text-slate-700">
              Mengacu pada Peraturan Bupati Banggai Nomor 1 Tahun 2026 tentang Pelimpahan Sebagian Kewenangan Bupati kepada Camat (Bab III Pasal 14–15 dan Bab IV Pasal 17–18).
            </p>
          </div>

          <div class="space-y-2">
            <h3 class="font-bold text-sm uppercase border-b border-slate-300 pb-1">II. Rincian Bidang Urusan & Mekanisme</h3>
            <table class="w-full text-xs border border-slate-300 border-collapse">
              <tbody>
                <tr class="border-b border-slate-300"><td class="p-2 font-semibold bg-slate-50 w-1/3">Bidang Urusan (Lampiran)</td><td class="p-2">${p.urusanNo ? `${p.urusanNo}. ` : ''}${escapeHtml(p.urusanNama)}</td></tr>
                <tr class="border-b border-slate-300"><td class="p-2 font-semibold bg-slate-50">Rincian Kegiatan Perbup</td><td class="p-2">${escapeHtml(p.subKegiatan)}</td></tr>
                <tr class="border-b border-slate-300"><td class="p-2 font-semibold bg-slate-50">Mekanisme Pelaksanaan</td><td class="p-2">${escapeHtml(p.mekanisme)}</td></tr>
                <tr class="border-b border-slate-300"><td class="p-2 font-semibold bg-slate-50">Seksi Penelaah Tujuan</td><td class="p-2">${escapeHtml(p.seksiTujuan)}</td></tr>
                <tr><td class="p-2 font-semibold bg-slate-50 align-top">Kesesuaian Kriteria Pasal 17–18</td><td class="p-2">
                  ${(p.kriteria && p.kriteria.length) ? `<ul class="list-disc pl-4 space-y-0.5">${p.kriteria.map(k => `<li>${escapeHtml(k)}</li>`).join('')}</ul>` : '-'}
                </td></tr>
              </tbody>
            </table>
          </div>

          <div class="space-y-1.5">
            <h3 class="font-bold text-sm uppercase border-b border-slate-300 pb-1">III. Latar Belakang, Tujuan & Manfaat</h3>
            <p class="text-xs text-slate-800 whitespace-pre-line">${escapeHtml(p.urgensi)}</p>
          </div>

          <div class="space-y-2">
            <h3 class="font-bold text-sm uppercase border-b border-slate-300 pb-1">IV. Sasaran, Lokasi & Rencana Anggaran (RAB)</h3>
            <table class="w-full text-xs border border-slate-300 border-collapse">
              <tbody>
                <tr class="border-b border-slate-300"><td class="p-2 font-semibold bg-slate-50 w-1/3">Jumlah Anggota / Penerima Manfaat</td><td class="p-2">${Number(p.anggota) || 0} Orang</td></tr>
                <tr class="border-b border-slate-300"><td class="p-2 font-semibold bg-slate-50">Lokasi Pelaksanaan</td><td class="p-2">${escapeHtml(p.lokasi || '-')}</td></tr>
                <tr class="border-b border-slate-300"><td class="p-2 font-semibold bg-slate-50">Estimasi Nilai Usulan (RAB)</td><td class="p-2 font-semibold">${formatRupiah(p.anggaran)}</td></tr>
                <tr><td class="p-2 font-semibold bg-slate-50">Swadaya & Rencana Pemeliharaan</td><td class="p-2">${escapeHtml(p.swadaya || '-')}</td></tr>
              </tbody>
            </table>
          </div>

          <div class="space-y-1.5">
            <h3 class="font-bold text-sm uppercase border-b border-slate-300 pb-1">V. Kelengkapan Berkas Terlampir</h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
              ${lampLabels.map(([k, label]) => `
                <li>${p.lampiran && p.lampiran[k] ? '☑' : '☐'} ${escapeHtml(label)}</li>
              `).join('')}
            </ul>
          </div>

          <div class="pt-6 flex justify-between items-end text-xs">
            <div class="text-center w-56">
              <p class="font-semibold">Mengetahui,</p>
              <p>Kepala Desa / Lurah Setempat</p>
              <div class="h-16"></div>
              <p class="border-t border-slate-400 pt-1 text-slate-600">( ........................................ )</p>
            </div>
            <div class="text-center w-56">
              <p>${escapeHtml(p.wilayah)}, ${formatTanggal(p.tanggal)}</p>
              <p class="font-semibold mt-0.5">Ketua / Penanggung Jawab,</p>
              <div class="h-16"></div>
              <p class="font-bold underline">${escapeHtml(p.ketua)}</p>
              <p class="text-[11px] text-slate-600">${escapeHtml(p.namaPengusul)}</p>
            </div>
          </div>
        `;

        document.getElementById('modal-preview').classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
      }

      function openLoginModal() {
        document.getElementById('login-form').reset();
        document.getElementById('login-error').classList.add('hidden');
        document.getElementById('modal-login').classList.remove('hidden');
        setTimeout(() => document.getElementById('login-username').focus(), 50);
      }

      async function handleLoginSubmit(e) {
        e.preventDefault();
        const u = document.getElementById('login-username').value.trim();
        const p = document.getElementById('login-password').value;
        const errBox = document.getElementById('login-error');

        let matched = (u === DEFAULT_ADMIN_USER && p === DEFAULT_ADMIN_PASS);

        if (!matched && sb) {
          try {
            const { data, error } = await sb
              .from('admin_accounts')
              .select('username, password')
              .eq('username', u)
              .limit(1);
            if (!error && data && data.length > 0 && data[0].password === p) {
              matched = true;
            }
          } catch (err) {
            // Fallback to default credential check
          }
        }

        if (!matched) {
          errBox.classList.remove('hidden');
          return;
        }

        errBox.classList.add('hidden');
        document.getElementById('modal-login').classList.add('hidden');
        saveAdminSession(true);
        switchTab('dashboard');
        showToast('Berhasil login sebagai Admin Kecamatan Bunta.');
      }

      function openStatusModal(id) {
        if (!isAdmin) return;
        const p = proposals.find(item => item.id === id);
        if (!p) return;
        document.getElementById('status-proposal-id').value = p.id;
        document.getElementById('status-proposal-title').textContent = `${p.namaPengusul} — ${p.judul}`;
        document.getElementById('status-select').value = p.status;
        document.getElementById('status-catatan').value = p.catatanVerifikator || '';
        document.getElementById('modal-status').classList.remove('hidden');
      }

      function openDeleteModal(id) {
        if (!isAdmin) return;
        const p = proposals.find(item => item.id === id);
        if (!p) return;
        pendingDeleteId = id;
        document.getElementById('delete-proposal-desc').textContent = `Proposal "${p.judul}" dari ${p.namaPengusul} akan dihapus dari database secara permanen.`;
        document.getElementById('modal-delete').classList.remove('hidden');
      }

      function exportCSV() {
        const headers = ['ID', 'Nomor Surat', 'Tanggal', 'Jenis Pengusul', 'Nama Pengusul', 'Wilayah', 'No Urusan', 'Bidang Urusan', 'Sub Kegiatan Perbup', 'Judul Proposal', 'Mekanisme', 'Seksi Penelaah', 'Penerima Manfaat', 'Estimasi RAB', 'Status'];
        const escapeCsv = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const lines = [headers.map(escapeCsv).join(',')];
        proposals.forEach(p => {
          lines.push([
            p.id, p.nomorSurat, p.tanggal, p.jenisPengusul, p.namaPengusul, p.wilayah,
            p.urusanNo, p.urusanNama, p.subKegiatan, p.judul, p.mekanisme, p.seksiTujuan,
            p.anggota, p.anggaran, p.status
          ].map(escapeCsv).join(','));
        });
        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rekap-proposal-perbup-1-2026-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Rekap CSV berhasil diunduh.');
      }

      function exportJSON() {
        const blob = new Blob([JSON.stringify(proposals, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-proposal-perbup-1-2026-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Cadangan JSON berhasil diunduh.');
      }

      function bindEvents() {
        document.querySelectorAll('.nav-tab').forEach(btn => {
          btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        document.getElementById('btn-auth-action').addEventListener('click', () => {
          if (isAdmin) {
            saveAdminSession(false);
            switchTab('tracker');
            showToast('Anda telah keluar dari mode Admin.', 'info');
          } else {
            openLoginModal();
          }
        });

        document.getElementById('btn-close-login').addEventListener('click', () => {
          document.getElementById('modal-login').classList.add('hidden');
        });
        document.getElementById('btn-cancel-login').addEventListener('click', () => {
          document.getElementById('modal-login').classList.add('hidden');
        });
        document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);

        document.getElementById('btn-pengusul-ajukan').addEventListener('click', () => {
          resetForm();
          switchTab('form');
        });
        document.getElementById('btn-pengusul-katalog').addEventListener('click', () => switchTab('regulasi'));
        document.getElementById('btn-sync-tracker').addEventListener('click', () => syncFromSupabase(false));
        document.getElementById('tracker-search-form').addEventListener('submit', handleTrackerSearch);

        document.getElementById('tab-tracker').addEventListener('click', (e) => {
          const btn = e.target.closest('button[data-tracker-preview]');
          if (btn) openPreviewModal(btn.dataset.trackerPreview);
        });

        document.getElementById('btn-new-shortcut').addEventListener('click', () => {
          resetForm();
          switchTab('form');
        });

        document.getElementById('btn-sync-db').addEventListener('click', () => syncFromSupabase(false));
        document.getElementById('btn-seed-samples').addEventListener('click', seedSamplesToDb);

        document.getElementById('search-input').addEventListener('input', renderTable);
        document.getElementById('filter-status').addEventListener('change', renderTable);
        document.getElementById('filter-kategori').addEventListener('change', renderTable);
        document.getElementById('filter-desa').addEventListener('change', renderTable);
        document.getElementById('filter-urusan').addEventListener('change', renderTable);
        document.getElementById('groupby-controls').addEventListener('click', (e) => {
          const btn = e.target.closest('button[data-groupby]');
          if (!btn) return;
          groupByMode = btn.dataset.groupby;
          document.querySelectorAll('.groupby-btn').forEach(b => {
            const active = b.dataset.groupby === groupByMode;
            b.className = active
              ? 'groupby-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-700 text-white transition-colors'
              : 'groupby-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors';
          });
          renderTable();
        });
        document.getElementById('catalog-search').addEventListener('input', renderCatalog);

        document.getElementById('catalog-list').addEventListener('click', (e) => {
          const btn = e.target.closest('button[data-use-urusan]');
          if (!btn) return;
          const no = Number(btn.dataset.useUrusan);
          resetForm();
          populateUrusanDropdown(no);
          switchTab('form');
          showToast(`Urusan No. ${no} dipilih pada formulir.`);
        });

        document.getElementById('field-urusan').addEventListener('change', (e) => {
          populateSubkegiatanDropdown(e.target.value);
        });

        document.getElementById('proposal-table-body').addEventListener('click', (e) => {
          const btn = e.target.closest('button[data-action]');
          if (!btn) return;
          const { action, id } = btn.dataset;
          if (action === 'preview') openPreviewModal(id);
          else if (action === 'status') openStatusModal(id);
          else if (action === 'edit') loadProposalToForm(id);
          else if (action === 'delete') openDeleteModal(id);
        });

        document.querySelectorAll('.lampiran-chk').forEach(chk => {
          chk.addEventListener('change', updateLampiranBadge);
        });

        document.getElementById('field-kontak').addEventListener('focus', () => {
          if (!hpNoticeShown) {
            hpNoticeShown = true;
            document.getElementById('modal-hp-notice').classList.remove('hidden');
          }
        });
        document.getElementById('btn-close-hp-notice').addEventListener('click', () => {
          document.getElementById('modal-hp-notice').classList.add('hidden');
          document.getElementById('field-kontak').focus();
        });

        document.getElementById('btn-close-success').addEventListener('click', () => {
          document.getElementById('modal-submit-success').classList.add('hidden');
        });
        document.getElementById('btn-done-success').addEventListener('click', () => {
          document.getElementById('modal-submit-success').classList.add('hidden');
        });
        document.getElementById('btn-copy-usulan').addEventListener('click', () => {
          const nama = document.getElementById('success-nama-pengusul').textContent;
          const no = document.getElementById('success-nomor-usulan').textContent;
          const text = `Nama Pengusul: ${nama} | Nomor Usulan: ${no}`;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
              showToast('Nama Pengusul & Nomor Usulan disalin!');
            }).catch(() => {
              showToast('Silakan catat Nomor Usulan: ' + no, 'info');
            });
          } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); showToast('Nama Pengusul & Nomor Usulan disalin!'); }
            catch (err) { showToast('Silakan catat Nomor Usulan: ' + no, 'info'); }
            document.body.removeChild(ta);
          }
        });

        document.getElementById('btn-reset-form').addEventListener('click', resetForm);
        document.getElementById('btn-save-draft').addEventListener('click', () => saveProposalFromForm('Draft'));
        document.getElementById('proposal-form').addEventListener('submit', (e) => {
          e.preventDefault();
          saveProposalFromForm('Diajukan');
        });

        document.getElementById('btn-close-preview').addEventListener('click', () => {
          document.getElementById('modal-preview').classList.add('hidden');
        });
        document.getElementById('btn-print-proposal').addEventListener('click', () => window.print());

        document.getElementById('btn-close-status').addEventListener('click', () => {
          document.getElementById('modal-status').classList.add('hidden');
        });
        document.getElementById('btn-cancel-status').addEventListener('click', () => {
          document.getElementById('modal-status').classList.add('hidden');
        });
        document.getElementById('status-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          if (!isAdmin) return;
          const id = document.getElementById('status-proposal-id').value;
          const p = proposals.find(item => item.id === id);
          if (p) {
            p.status = document.getElementById('status-select').value;
            p.catatanVerifikator = document.getElementById('status-catatan').value.trim();
            p.updatedAt = new Date().toISOString();
            saveLocalCache();
            if (sb) {
              try {
                const { error } = await sb
                  .from('proposals')
                  .update({
                    status: p.status,
                    catatan_verifikator: p.catatanVerifikator,
                    updated_at: p.updatedAt
                  })
                  .eq('id', id);
                if (error) throw error;
              } catch (err) {
                showToast('Status diubah lokal (gagal sinkron ke Supabase).', 'info');
              }
            }
            renderDashboard();
            showToast('Status & disposisi diperbarui.');
          }
          document.getElementById('modal-status').classList.add('hidden');
        });

        document.getElementById('btn-cancel-delete').addEventListener('click', () => {
          pendingDeleteId = null;
          document.getElementById('modal-delete').classList.add('hidden');
        });
        document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
          if (!isAdmin) return;
          if (pendingDeleteId) {
            const targetId = pendingDeleteId;
            proposals = proposals.filter(item => item.id !== targetId);
            saveLocalCache();
            if (sb) {
              try {
                const { error } = await sb.from('proposals').delete().eq('id', targetId);
                if (error) throw error;
              } catch (err) {
                showToast('Dihapus lokal (gagal hapus di Supabase).', 'info');
              }
            }
            renderDashboard();
            showToast('Proposal berhasil dihapus.', 'info');
          }
          pendingDeleteId = null;
          document.getElementById('modal-delete').classList.add('hidden');
        });

        document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
        document.getElementById('btn-export-json').addEventListener('click', exportJSON);
        document.getElementById('input-import-json').addEventListener('change', async (e) => {
          if (!isAdmin) return;
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const data = JSON.parse(reader.result);
              if (!Array.isArray(data)) throw new Error('Format tidak valid');
              proposals = data;
              saveLocalCache();
              if (sb && data.length > 0) {
                await sb.from('proposals').upsert(data.map(toDbRow));
              }
              renderDashboard();
              showToast(`Berhasil mengimpor ${data.length} proposal.`);
            } catch (err) {
              showToast('File JSON tidak valid.', 'error');
            }
            e.target.value = '';
          };
          reader.readAsText(file);
        });
      }

      document.addEventListener('DOMContentLoaded', () => {
        proposals = loadLocalCache();
        myProposalIds = loadMyIds();
        isAdmin = loadAdminSession();
        applyRoleUI();
        resetForm();
        bindEvents();
        renderCatalog();
        switchTab(isAdmin ? 'dashboard' : 'tracker');
        if (window.lucide) lucide.createIcons();
        syncFromSupabase(true);
      });
    })();
