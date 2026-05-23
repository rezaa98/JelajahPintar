import { Location, Restaurant } from './types';

// Geo-boundaries of Yogyakarta Provinces/Regencies
export const YOGYAKARTA_REGENCIES = [
  { name: 'Sleman', bounds: { minLat: -7.69, maxLat: -7.53, minLng: 110.28, maxLng: 110.55 } },
  { name: 'Bantul', bounds: { minLat: -8.04, maxLat: -7.83, minLng: 110.18, maxLng: 110.48 } },
  { name: 'Gunung Kidul', bounds: { minLat: -8.19, maxLat: -7.88, minLng: 110.42, maxLng: 110.84 } },
  { name: 'Kulon Progo', bounds: { minLat: -8.01, maxLat: -7.67, minLng: 110.02, maxLng: 110.26 } },
  { name: 'Kota Yogyakarta', bounds: { minLat: -7.83, maxLat: -7.76, minLng: 110.34, maxLng: 110.39 } }
];

export const isWithinYogyakarta = (lat: number, lng: number): boolean => {
  // Broad box containing DIY provinces: ~ -8.25 to -7.50 South lat, 110.00 to 110.85 East lng
  return lat >= -8.25 && lat <= -7.50 && lng >= 110.00 && lng <= 110.85;
};

export const PRESET_LANDMARKS: Location[] = [
  {
    id: 'stasiun-tugu',
    name: 'Stasiun Yogyakarta (Tugu) / Malioboro',
    regency: 'Kota Yogyakarta',
    lat: -7.7891,
    lng: 110.3635,
    description: 'Pusat kota Yogyakarta, titik awal traveler dan kawasan belanja ikonik Jalan Malioboro.'
  },
  {
    id: 'candi-prambanan',
    name: 'Candi Prambanan',
    regency: 'Sleman',
    lat: -7.7520,
    lng: 110.4914,
    description: 'Candi Hindu termegah di Asia Tenggara, terletak di perbatasan Sleman.'
  },
  {
    id: 'pantai-indrayanti',
    name: 'Pantai Indrayanti (Tepus)',
    regency: 'Gunung Kidul',
    lat: -8.1503,
    lng: 110.6121,
    description: 'Pantai pasir putih eksotis dengan tebing karang megah di Gunung Kidul.'
  },
  {
    id: 'kaliurang',
    name: 'Kaliurang Peak (Lereng Gunung Merapi)',
    regency: 'Sleman',
    lat: -7.5956,
    lng: 110.4287,
    description: 'Kawasan sejuk lereng selatan Gunung Merapi, terkenal dengan keindahan alam dan jeep wisata.'
  },
  {
    id: 'pantai-parangtritis',
    name: 'Pantai Parangtritis',
    regency: 'Bantul',
    lat: -8.0253,
    lng: 110.3297,
    description: 'Pantai pantai legendaris laut selatan berpasir hitam mistis dengan bukit paralayang.'
  },
  {
    id: 'hutan-pinus-mangunan',
    name: 'Hutan Pinus Mangunan',
    regency: 'Bantul',
    lat: -7.9338,
    lng: 110.4284,
    description: 'Hutan pinus asri berkabut dengan deck pemandangan perbukitan Bantul nan hijau.'
  },
  {
    id: 'tebing-breksi',
    name: 'Tebing Breksi (Prambanan)',
    regency: 'Sleman',
    lat: -7.7816,
    lng: 110.4842,
    description: 'Taman wisata bekas tambang batu breksi berukir ornamen naga berlatar pemandangan kota.'
  },
  {
    id: 'goa-pindul',
    name: 'Wisata Tubing Goa Pindul',
    regency: 'Gunung Kidul',
    lat: -7.9338,
    lng: 110.6483,
    description: 'Kawasan susur sungai bawah tanah menggunakan ban pelampung di dalam goa karst purba.'
  },
  {
    id: 'waduk-sermo',
    name: 'Waduk Sermo Kokap',
    regency: 'Kulon Progo',
    lat: -7.8340,
    lng: 110.1241,
    description: 'Waduk tenang di tengah perbukitan Menoreh Kulon Progo, populer untuk berkemah.'
  },
  {
    id: 'kraton-jogja',
    name: 'Kraton Ngayogyakarta Hadiningrat',
    regency: 'Kota Yogyakarta',
    lat: -7.8052,
    lng: 110.3642,
    description: 'Istana resmi Kesultanan Yogyakarta yang kental dengan warisan adat Jawa.'
  },
  {
    id: 'candi-borobudur',
    name: 'Candi Borobudur',
    regency: 'Sleman',
    lat: -7.6079,
    lng: 110.1216,
    description: 'Candi Buddha terbesar di dunia, ikon mahakarya bersejarah peninggalan Dinasti Syailendra.'
  },
  {
    id: 'candi-ratu-boko',
    name: 'Situs Wisata Candi Ratu Boko',
    regency: 'Sleman',
    lat: -7.7705,
    lng: 110.4894,
    description: 'Reruntuhan istana megah abad ke-8 di puncak bukit, sangat indah kala senja tiba.'
  },
  {
    id: 'candi-sambisari',
    name: 'Candi Sambisari',
    regency: 'Sleman',
    lat: -7.7624,
    lng: 110.4473,
    description: 'Candi Hindu eksotis yang terkubur lahar Gunung Merapi, terletak 6,5 meter di bawah permukaan tanah.'
  },
  {
    id: 'candi-ijo',
    name: 'Candi Ijo',
    regency: 'Sleman',
    lat: -7.7838,
    lng: 110.5126,
    description: 'Candi tertinggi di Yogyakarta dengan pemandangan sunset menakjubkan menghadap landasan udara Adisutjipto.'
  },
  {
    id: 'candi-plaosan',
    name: 'Candi Plaosan (Candi Kembar Lor & Kidul)',
    regency: 'Sleman',
    lat: -7.7405,
    lng: 110.5042,
    description: 'Candi Buddha kembar romantis saksi cinta beda keyakinan antara Raja Hindu Rakai Pikatan & Pramodawardhani.'
  }
];

export const LEGENDARY_RESTAURANTS: Restaurant[] = [
  {
    id: 'gudeg-yu-djum',
    name: 'Gudeg Yu Djum Wijilan 167',
    rating: 4.5,
    userRatingCount: 18450,
    formattedAddress: 'Jl. Wijilan No. 167, Panembahan, Kraton, Kota Yogyakarta',
    lat: -7.8041,
    lng: 110.3644,
    photoUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: 'Pelopor gudeg kering legendaris Jogja dimasak tradisional memakai kayu bakar nangka.',
    cuisine: 'Tradisional Jawa',
    specialty: 'Gudeg Kering Ayam Kampung & Krecek Pedas',
    openNow: true
  },
  {
    id: 'kopi-klotok',
    name: 'Warung Kopi Klotok Pakem',
    rating: 4.6,
    userRatingCount: 22100,
    formattedAddress: 'Jl. Kaliurang KM 16, Pakembinangun, Pakem, Kab. Sleman',
    lat: -7.6791,
    lng: 110.4184,
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    description: 'Warung kopi berkonsep saung pedesaan dengan pemandangan sawah Merapi yang tenar se-Indonesia.',
    cuisine: 'Rumahan Jawa / Perdesaan',
    specialty: 'Kopi Klotok Tubruk & Pisang Goreng Kepok Hangat',
    openNow: true
  },
  {
    id: 'sate-klatak-pak-pong',
    name: 'Sate Klatak Pak Pong Bantul',
    rating: 4.5,
    userRatingCount: 19500,
    formattedAddress: 'Jl. Stadion Imogiri Timur No.5, Wonokromo, Pleret, Kab. Bantul',
    lat: -7.8821,
    lng: 110.3804,
    photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Sate kambing legendaris Bantul, ditusuk menggunakan ruji sepeda agar matang merata di bagian dalam.',
    cuisine: 'Olahan Daging / Kambing',
    specialty: 'Sate Klatak (Bumbu Garam Gurih) & Gulai Tengkleng',
    openNow: true
  },
  {
    id: 'jejamuran',
    name: 'Restoran Jejamuran Sleman',
    rating: 4.6,
    userRatingCount: 14200,
    formattedAddress: 'Jl. Pendowoharjo RT 01/RW 20, Niron, Pandowoharjo, Kab. Sleman',
    lat: -7.7088,
    lng: 110.3621,
    photoUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    description: 'Restoran keluarga kreatif yang menyulap berbagai jenis jamur menjadi sate, rendang, dan tongseng jamur gurih.',
    cuisine: 'Kreatif Jamur / Vegetarian Friendly',
    specialty: 'Sate Jamur Merang & Jamur Tiram Goreng Crispy',
    openNow: true
  },
  {
    id: 'house-of-raminten',
    name: 'The House of Raminten Kotabaru',
    rating: 4.4,
    userRatingCount: 17200,
    formattedAddress: 'Jl. Faridan M Noto No.7, Kotabaru, Gondokusuman, Kota Yogyakarta',
    lat: -7.7844,
    lng: 110.3742,
    photoUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    description: 'Tempat makan unik bergaya etnik keraton dengan pelayan berbusana kemben, aroma dupa wangi, dan wadah saji unik.',
    cuisine: 'Angkringan Modern / Jawa Tradisional',
    specialty: 'Sega Kucing Double, Ayam Koteka, & Wedang Sereh jumbo',
    openNow: true
  },
  {
    id: 'bale-raos',
    name: 'Bale Raos - The Sultan\'s Feast',
    rating: 4.5,
    userRatingCount: 5120,
    formattedAddress: 'Jl. Magangan Kulon No.1, Kraton, Panembahan, Kota Yogyakarta',
    lat: -7.8094,
    lng: 110.3627,
    photoUrl: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=600&q=80',
    description: 'Restoran bernuansa bangsawan menyajikan hidangan keluarga raja-raja keraton Jogja turun-temurun.',
    cuisine: 'Royal Javanese Fine Dining',
    specialty: 'Bebek Suwar-suwir (Bebek Bumbu Saus Mangga) & Beer Jawa',
    openNow: true
  },
  {
    id: 'kopi-selasar',
    name: 'Loko Cafe / Kopi Selasar Malioboro',
    rating: 4.3,
    userRatingCount: 6800,
    formattedAddress: 'Selasar Malioboro (Depan Stasiun Tugu), Gedongtengen, Kota Yogyakarta',
    lat: -7.7891,
    lng: 110.3639,
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    description: 'Kafe modern di teras Stasiun Kereta Tugu dengan suasana hangat melihat kereta api melintas pelan.',
    cuisine: 'Modern Cafe & Nusantara',
    specialty: 'Es Kopi Susu Selasar, Nasi Goreng Loko, & Singkong Goreng Keju',
    openNow: true
  },
  {
    id: 'soto-kadipiro',
    name: 'Soto Kadipiro Asli (Sejak 1921)',
    rating: 4.4,
    userRatingCount: 7900,
    formattedAddress: 'Jl. Wates No.33, Kadipiro, Ngestiharjo, Kasihan, Kab. Bantul',
    lat: -7.8012,
    lng: 110.3421,
    photoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Kuliner soto ayam legendaris Jogja berkuah kaldu ayam kampung bening kuning gurih segar dengan lenthok selera lama.',
    cuisine: 'Soto / Sup Jawa',
    specialty: 'Soto Ayam Kampung Campur Lenthok & Tempe Tempe Goreng Garing',
    openNow: true
  },
  {
    id: 'kopi-merapi',
    name: 'Warung Kopi Merapi Cangkringan',
    rating: 4.5,
    userRatingCount: 9200,
    formattedAddress: 'Petung, Kepuharjo, Cangkringan, Sleman Regency',
    lat: -7.6189,
    lng: 110.4510,
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    description: 'Menikmati kopi robusta/arabika Merapi langsung di zona bekas aliran lahar dingin Gunung Merapi berudara sejuk.',
    cuisine: 'Kopi Tradisional & Camilan',
    specialty: 'Kopi Arabika Merapi bakar & Mendoan Hangat',
    openNow: true
  },
  {
    id: 'warung-boto-mulyo',
    name: 'Warung Boto Mulyo (Selasar Imogiri)',
    rating: 4.4,
    userRatingCount: 1200,
    formattedAddress: 'Jl. Imogiri Timur KM 11, Jetis, Bantul',
    lat: -7.8992,
    lng: 110.3895,
    photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Spesialis ingkung ayam kampung utuh khas Bantul bercita rasa santan gurih kental yang memanjakan lidah.',
    cuisine: 'Rumahan Ingkung Jawa',
    specialty: 'Ingkung Ayam Kampung Gurih & Sambal Bawang Goreng',
    openNow: true
  },
  {
    id: 'gudeg-mangan-sek',
    name: 'Gudeg Sagan',
    rating: 4.5,
    userRatingCount: 9100,
    formattedAddress: 'Jl. Profesor Dr. Herman Yohanes No.53, Samirono, Caturtunggal, Depok, Kab. Sleman',
    lat: -7.7794,
    lng: 110.3792,
    photoUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: 'Melayani gudeg basah istimewa dengan kuah areh kelapa gurih melimpah dipadukan bubur/nasi hangat.',
    cuisine: 'Tradisional Gudeg Basah',
    specialty: 'Gudeg Bubur Ayam Kampung & Es Beras Kencur',
    openNow: true
  },
  {
    id: 'mangut-lele-mbah-marto',
    name: 'Mangut Lele Mbah Marto Nglaren',
    rating: 4.6,
    userRatingCount: 11200,
    formattedAddress: 'Jl. Parangtritis KM 6.5, Sewon, Kab. Bantul',
    lat: -7.8546,
    lng: 110.3625,
    photoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Menikmati lele asap pedas legendaris langsung masuk ke pawon (dapur tanah liat tradisional) Mbah Marto di Sewon.',
    cuisine: 'Pedasan Jawa / Tradisional Pawon',
    specialty: 'Mangut Lele Asap Kuah Pedas & Gudeg Manggar',
    openNow: true
  },
  {
    id: 'bakmi-mbah-gito',
    name: 'Bakmi Jawa Mbah Gito Rejowinangun',
    rating: 4.6,
    userRatingCount: 15200,
    formattedAddress: 'Jl. Agrowisata No.17, Rejowinangun, Kotagede, Kota Yogyakarta',
    lat: -7.8188,
    lng: 110.3891,
    photoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Bakmi Jawa paling ikonik dengan interior bangunan kayu antik yang megah, disajikan panas dari tungku tanah liat.',
    cuisine: 'Bakmi Tradisional Jawa',
    specialty: 'Bakmi Jawa Godhog Special Telur Bebek & Wedang Bajigur',
    openNow: true
  },
  {
    id: 'sate-klatak-pak-bari',
    name: 'Sate Klatak Pak Bari Wonokromo',
    rating: 4.5,
    userRatingCount: 8900,
    formattedAddress: 'Pasar Wonokromo, Jl. Imogiri Timur No.5, Pleret, Kab. Bantul',
    lat: -7.8856,
    lng: 110.3892,
    photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Kedai sate legendaris yang bertempat di pasar tradisional, terkenal di kancah nasional lewat film AADC 2.',
    cuisine: 'Olahan Daging / Kambing',
    specialty: 'Sate Klatak Kambing Sederhana & Kicik Kepala Sapi',
    openNow: true
  },
  {
    id: 'soto-bathok-mbah-katro',
    name: 'Soto Bathok Mbah Katro Sambisari',
    rating: 4.6,
    userRatingCount: 11500,
    formattedAddress: 'Sambisari, Purwomartani, Kalasan, Kab. Sleman',
    lat: -7.7825,
    lng: 110.4905,
    photoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Menikmati soto daging sapi gurih beralas mangkok batok kelapa di gubuk bambu syahdu tepi sawah Candi Sambisari.',
    cuisine: 'Soto / Sup Tradisional Kuning',
    specialty: 'Soto Sapi Campur Bathok, Sate Puyuh Mandi Kecap, & Tempe Garit',
    openNow: true
  },
  {
    id: 'sego-abang-mbah-jirak',
    name: 'Sego Abang Lombok Ijo Mbah Jirak Semanu',
    rating: 4.5,
    userRatingCount: 3400,
    formattedAddress: 'Jl. Semanu-Wonosari, Semanu, Kab. Gunung Kidul',
    lat: -7.9621,
    lng: 110.6012,
    photoUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: 'Kuliner tradisional khas perbukitan karst berupa nasi merah pulen, sayur tempe kuah santan cabai hijau gurih pedas.',
    cuisine: 'Rumahan Khas Gunung Kidul',
    specialty: 'Sego Abang Komplit, Sayur Lombok Ijo, & Ayam Kampung Goreng',
    openNow: true
  },
  {
    id: 'thiwul-ayu-gambar',
    name: 'Thiwul Ayu Gambar Mangunan',
    rating: 4.6,
    userRatingCount: 2100,
    formattedAddress: 'Jl. Dlingo-Imogiri, Mangunan, Dlingo, Kab. Bantul',
    lat: -7.9312,
    lng: 110.4222,
    photoUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    description: 'Sentra thiwul manis berkualitas tinggi khas pegunungan kidul, bertekstur empuk harum kelapa parut dan gula jawa.',
    cuisine: 'Jajanan / Oleh-oleh Jawa',
    specialty: 'Thiwul Ayu Gula Jawa Pandan Kupas & Gatot Kenyal',
    openNow: true
  },
  {
    id: 'mie-lethek-mbah-mendes',
    name: 'Mie Lethek Mbah Mendes Sewon',
    rating: 4.4,
    userRatingCount: 4200,
    formattedAddress: 'Jl. Ringroad Selatan, Sewon, Kab. Bantul',
    lat: -7.9142,
    lng: 110.4011,
    photoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Mi legendaris Bantul diproduksi tradisional non-kimiawi menggunakan adukan roda batu berpasangan tenaga sapi.',
    cuisine: 'Olahan Mie Sehat',
    specialty: 'Mie Lethek Goreng Khas Bantul & Rica-rica Balungan Ayam',
    openNow: true
  },
  {
    id: 'gudeg-bromo-tekluk',
    name: 'Gudeg Bromo Bu Tekluk Gejayan',
    rating: 4.5,
    userRatingCount: 6800,
    formattedAddress: 'Jl. Affandi No.2-A, Caturtunggal, Depok, Kab. Sleman',
    lat: -7.7820,
    lng: 110.3725,
    photoUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: 'Gudeg basah kaki lima malam hari legendaris yang digemari kawula muda dan wisatawan lapar tengah malam.',
    cuisine: 'Tradisional Gudeg Basah Malam',
    specialty: 'Gudeg Ayam Suwir Areh Kental & Kepala Ayam Bacem Empuk',
    openNow: true
  },
  {
    id: 'yamie-pathuk',
    name: 'Yamie Pathuk Kembang Jaya Kleringan',
    rating: 4.5,
    userRatingCount: 3100,
    formattedAddress: 'Jl. Kleringan, Gowongan, Jetis, Kota Yogyakarta',
    lat: -7.7985,
    lng: 110.3611,
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    description: 'Yamie asin/manis buatan rumah dengan mi tipis kenyal disempurnakan taburan bawang goreng dan pangsit basah gurih.',
    cuisine: 'Yamie / Mi Tionghoa-Jogja',
    specialty: 'Yamie Ayam Asin Pangsit Basah Jumbo & Bakso Goreng Udang',
    openNow: true
  },
  {
    id: 'sgpc-bu-wiryo',
    name: 'SGPC Bu Wiryo 1959 Bulaksumur',
    rating: 4.5,
    userRatingCount: 9400,
    formattedAddress: 'Jl. Agro No.10, Kocoran, Caturtunggal, Depok, Kab. Sleman',
    lat: -7.7735,
    lng: 110.3762,
    photoUrl: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=600&q=80',
    description: 'Warung Nasi Pecel legendaris ikon nostalgia lintas generasi sivitas akademika Universitas Gadjah Mada.',
    cuisine: 'Pecel / Sarapan Jawa',
    specialty: 'Nasi Pecel Siram Sambal Kacang Kental, Sate Endog Puyuh, & Sop Sapi',
    openNow: true
  },
  {
    id: 'lupis-mbah-satinem',
    name: 'Lupis Mbah Satinem Bumijo',
    rating: 4.7,
    userRatingCount: 4500,
    formattedAddress: 'Jl. Pangeran Diponegoro No.22, Gowongan, Jetis, Kota Yogyakarta',
    lat: -7.7865,
    lng: 110.3622,
    photoUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    description: 'Legenda kuliner jajanan tradisional ketan kelapa parut dilumuri saus gula merah kental favorit Presiden Ke-2 RI.',
    cuisine: 'Jajanan Pasar Tradisional',
    specialty: 'Lapis Segitiga Gental Manis, Cenil Merah, & Gatot-Gethuk Legenda',
    openNow: true
  },
  {
    id: 'lobster-pak-sis',
    name: 'Warung Lobster Pak Sis Pantai Drini',
    rating: 4.7,
    userRatingCount: 2200,
    formattedAddress: 'Pantai Drini, Banjarejo, Tanjungsari, Kab. Gunung Kidul',
    lat: -8.1368,
    lng: 110.5945,
    photoUrl: 'https://images.unsplash.com/photo-1559742811-82410b510ca0?auto=format&fit=crop&w=600&q=80',
    description: 'Sajian hidangan laut segar berkelas dunia, terkenal dengan tangkapan lobster karang selatan yang dimasak bumbu lada hitam atau asam manis pedas nikmat tepat di pinggir pantai pasir putih.',
    cuisine: 'Seafood Pantai Segar',
    specialty: 'Lobster Karang Saus Padang & Cumi Bakar Madu Sereh',
    openNow: true
  },
  {
    id: 'seafood-depok-salsabila',
    name: 'Seafood Depok Salsabila (Pantai Depok)',
    rating: 4.6,
    userRatingCount: 5300,
    formattedAddress: 'Kawasan Pantai Depok, Kretek, Kab. Bantul',
    lat: -8.0125,
    lng: 110.3155,
    photoUrl: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=600&q=80',
    description: 'Lokasi kuliner laut paling populer selepas berwisata di Pantai Parangtritis. Pilih ikan langsung dari pelelangan lokal dan bumbu bakar tradisional khas jogja selatan.',
    cuisine: 'Seafood Bakar Tradisional',
    specialty: 'Kakap Merah Bakar Jimbaran & Cumi Goreng Tepung Gurih',
    openNow: true
  },
  {
    id: 'resto-bukit-indah',
    name: 'Resto Bukit Indah (Bukit Bintang Pathuk)',
    rating: 4.4,
    userRatingCount: 6400,
    formattedAddress: 'Jl. Jogja - Wonosari KM.15, Pathuk, Kab. Gunung Kidul',
    lat: -7.8485,
    lng: 110.4792,
    photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Restoran ikonik di kawasan Bukit Bintang, tempat beristirahat melepas lelah dalam rute perjalanan pantai sembari menatap panorama gemerlap lampu malam kota Yogyakarta.',
    cuisine: 'Rumahan Indonesia & Nusantara',
    specialty: 'Sop Buntut Gurih, Ayam Goreng Madu, & Wedang Jahe Susu Selasar',
    openNow: true
  },
  {
    id: 'kopi-panggang-gunungkidul',
    name: 'Warung Kopi Panggang Gunungkidul',
    rating: 4.5,
    userRatingCount: 3900,
    formattedAddress: 'Jl. Panggang - Wonosari, Girisuko, Panggang, Kab. Gunung Kidul',
    lat: -8.0055,
    lng: 110.4582,
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    description: 'Rest Area bernuansa limasan jati asri legendaris di rute selatan menuju pantai Parangtritis dan Baron. Sangat cocok menyantap masakan rumahan ndeso.',
    cuisine: 'Kuliner Ndeso Jati / Kopi',
    specialty: 'Kopi Panggang Tubruk Es & Sayur Lombok Ijo Ndeso Mandi Gurih',
    openNow: true
  },
  {
    id: 'pawon-purba',
    name: 'Pawon Purba Cafe & Resto Nglanggeran',
    rating: 4.6,
    userRatingCount: 3100,
    formattedAddress: 'Kawasan Gunung Api Purba, Nglanggeran, Patuk, Kab. Gunung Kidul',
    lat: -7.8765,
    lng: 110.5414,
    photoUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: 'Restoran khas kaki gunung dengan masakan tradisional prasmanan yang digodog menggunakan kayu bakar kuno.',
    cuisine: 'Prasmanan Jawa Pawon',
    specialty: 'Sego Tiwul Anget, Jangan Ndolo, & Tempe Garit Sambal Korek',
    openNow: true
  },
  {
    id: 'warung-simbok-wonosari',
    name: 'Warung Kampoeng Simbok Wonosari',
    rating: 4.5,
    userRatingCount: 5600,
    formattedAddress: 'Jl. Jogja - Wonosari KM.36, Logandeng, Playen, Kab. Gunung Kidul',
    lat: -7.9545,
    lng: 110.5798,
    photoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Tempat persinggahan keluarga paling ramai yang menyajikan masakan tradisional ayam kampung goreng yang empuk dan renyah dengan sambal limau menyegarkan.',
    cuisine: 'Rumahan Ayam Goreng',
    specialty: 'Ayam Kampung Goreng Kremes Sereh & Sayur Lodeh Labu Siam',
    openNow: true
  },
  {
    id: 'heha-ocean-resto',
    name: 'HeHa Ocean View Cliffside Restaurant',
    rating: 4.4,
    userRatingCount: 19200,
    formattedAddress: 'Sawah, Girikarto, Panggang, Kab. Gunung Kidul',
    lat: -8.1189,
    lng: 110.4855,
    photoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    description: 'Restoran modern bertaraf internasional di puncak tebing karang pantai selatan, menyajikan petualangan kuliner sembari menikmati ombak laut lepas dan sunset Samudra Hindia.',
    cuisine: 'Modern Cliffside Grills & Western',
    specialty: 'Heha Premium Grilled Ribs & Ocean Breezy Mocktails',
    openNow: true
  }
];

export const PRESET_ROUTES = [
  {
    id: 'city-to-beach',
    name: 'Rute Malioboro ➔ Pantai Indrayanti',
    origin: PRESET_LANDMARKS[0], // Tugu
    destination: PRESET_LANDMARKS[2], // Indrayanti
    routeType: 'Sleman-Bantul-Gunungkidul',
    description: 'Perjalanan kota ke pantai pasir putih eksotis Gunungkidul melintasi jalur perbukitan karst Pathuk.'
  },
  {
    id: 'mountain-to-temple',
    name: 'Rute Kaliurang (Merapi) ➔ Candi Prambanan',
    origin: PRESET_LANDMARKS[3], // Kaliurang
    destination: PRESET_LANDMARKS[1], // Prambanan
    routeType: 'Sleman-Peak',
    description: 'Turun dari hawa dingin merapi menyusuri Sleman timur menuju cagar cagar budaya kompleks candi agung.'
  },
  {
    id: 'culture-to-forest',
    name: 'Rute Kraton ➔ Pinus Mangunan Bantul',
    origin: PRESET_LANDMARKS[9], // Kraton
    destination: PRESET_LANDMARKS[5], // Mangunan
    routeType: 'City-Bantul',
    description: 'Perjalanan budaya dari pusat kesultanan menuju wisata asri puncak pinus selatan Bantul.'
  },
  {
    id: 'candi-sambisari-to-candi-ijo',
    name: 'Rute Candi Sambisari ➔ Candi Ijo',
    origin: PRESET_LANDMARKS[12], // Sambisari
    destination: PRESET_LANDMARKS[13], // Ijo
    routeType: 'Candi-Tour',
    description: 'Penjelajahan candi bawah tanah Sambisari yang sejuk hingga bukit tertinggi candi Ijo untuk berburu sunset.'
  },
  {
    id: 'borobudur-to-prambanan',
    name: 'Rute Grand Candi (Borobudur ➔ Prambanan)',
    origin: PRESET_LANDMARKS[10], // Borobudur
    destination: PRESET_LANDMARKS[1], // Prambanan
    routeType: 'Grand-Heritage',
    description: 'Menyambungkan rute spiritual teragung penghubung Candi Buddha terbesar di dunia dan Candi Hindu terindah.'
  }
];
