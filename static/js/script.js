// =============================================================================
// ARABA DÜNYASI - FİNAL SCRIPT (HAFIZALI BOT + YARIŞ SESİ + FULL SİSTEM)
// =============================================================================

// GLOBAL DEĞİŞKENLER
const SITE = window.SITE_URLS || {};
const STATIC = window.SITE_STATIC || '/static/';
const yarisSesi = new Audio(STATIC + 'sesler/yaris-sesi.mp3');
let botDurumu = null; // Botun hafızası (Soru sorduysa cevabı beklemek için)

// --- 1. OTO MODAL OLUŞTURUCU (GECE MODU VE TASARIM DÜZELTİLDİ) ---
function aracEkleModaliniOlustur() {
    // Çakışmayı önlemek için önce temizle
    const eskiModal = document.getElementById('arac-ekle-modal');
    if (eskiModal) eskiModal.remove();

    // 1. Dinamik CSS Ekle (Gece Modu İçin)
    const style = document.createElement('style');
    style.innerHTML = `
        /* Modal Genel Stil */
        #arac-ekle-modal .modal-icerik {
            background: #fff;
            color: #333;
            transition: all 0.3s ease;
        }
        #arac-ekle-modal input {
            background: #fff;
            color: #333;
            border: 1px solid #ccc;
        }
        #arac-ekle-modal .kapat-btn { color: #333; }
        .modal-arac-item { border-bottom: 1px solid #eee; }
        .modal-arac-item:hover { background-color: #f9f9f9; }

        /* GECE MODU AYARLARI */
        body.gece-modu #arac-ekle-modal .modal-icerik {
            background: #1e1e1e !important;
            color: #f0f0f0 !important;
            border: 1px solid #444;
        }
        body.gece-modu #arac-ekle-modal input {
            background: #333 !important;
            color: #fff !important;
            border: 1px solid #555 !important;
        }
        body.gece-modu #arac-ekle-modal .kapat-btn { color: #fff !important; }
        body.gece-modu .modal-arac-item { border-bottom: 1px solid #444 !important; }
        body.gece-modu .modal-arac-item:hover { background-color: #333 !important; }
    `;
    document.head.appendChild(style);
    
    // 2. HTML Yapısı
    const modalHTML = `
        <div id="arac-ekle-modal" class="modal-overlay" style="
            display:none; 
            position:fixed; 
            top:0; left:0; 
            width:100%; height:100%; 
            background:rgba(0,0,0,0.85); 
            z-index:99999; 
            justify-content:center; 
            align-items:center;
            backdrop-filter: blur(4px);
        ">
            <div class="modal-icerik" style="
                padding:25px; 
                border-radius:15px; 
                width:90%; 
                max-width:450px; 
                max-height: 75vh; 
                overflow-y: auto; 
                position:relative; 
                text-align:center; 
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
            ">
                <span class="kapat-btn" onclick="document.getElementById('arac-ekle-modal').style.display='none'" style="
                    position:absolute; 
                    right:20px; top:15px; 
                    cursor:pointer; 
                    font-size:28px; 
                    font-weight:bold;
                ">&times;</span>
                
                <h2 style="color:#e41d36; margin-bottom:20px; margin-top:5px; font-size:1.5rem;">Araç Seç</h2>
                
                <input type="text" id="modal-arama-cubugu" placeholder="Marka ara..." style="
                    width:100%; 
                    padding:12px; 
                    margin-bottom:20px; 
                    border-radius:8px; 
                    font-size:1rem;
                    box-sizing: border-box;
                    outline: none;
                ">
                
                <div id="modal-arac-listesi" style="
                    display:grid; 
                    grid-template-columns:1fr; 
                    gap:5px; 
                    text-align:left;
                    padding-bottom: 10px;
                "></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const searchInput = document.getElementById('modal-arama-cubugu');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => populateModalList(e.target.value));
    }
}

// Global Modal Açma Fonksiyonu
window.modalAc = function() {
    aracEkleModaliniOlustur(); 
    const modal = document.getElementById('arac-ekle-modal');
    if (modal) {
        modal.style.display = 'flex';
        if (typeof populateModalList === 'function') {
            populateModalList('');
        }
    }
};
// -------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. BAŞLANGIÇ AYARLARI ---
    aracEkleModaliniOlustur(); // Sayfa açılır açılmaz modalı hazırla
    oturumKontrol();
    geceModunuBaslat();
    setTimeout(sanalAsistaniBaslat, 1000); 

    // --- 2. DETAY SAYFASI KONTROLLERİ ---
    const detayKutusu = document.querySelector('.detay-konteyner');
    const detayId = document.body.getAttribute('data-detay-id');

    if (detayKutusu || detayId) {
        motorSesiButonuEkle(); 
        dragPistiHazirla();

        if (typeof arabalar !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const hedefId = detayId || urlParams.get('id');
            const araba = arabalar.find(a => a.id == hedefId);
            
            if(araba) {
                setTimeout(detaySliderBaslat, 100); 
                yakitHesaplamaModulunuBaslat(araba); 
                yorumSisteminiBaslat(hedefId);
            }
        } else {
            setTimeout(() => {
                if (typeof arabalar !== 'undefined') {
                    const urlParams = new URLSearchParams(window.location.search);
                    const hedefId = document.body.getAttribute('data-detay-id') || urlParams.get('id');
                    const araba = arabalar.find(a => a.id == hedefId);
                    if(araba) {
                        detaySliderBaslat();
                        yakitHesaplamaModulunuBaslat(araba);
                        yorumSisteminiBaslat(hedefId);
                    }
                }
            }, 500);
        }
    }

    // --- 3. HTML ELEMENTLERİ ---
    const el = {
        kategoriBari: document.getElementById('kategori-bari'),
        yanBarCentik: document.querySelector('.yan-bar-centik'),
        kartKonteyner: document.getElementById('kart-konteyner'),
        oneCikan: document.getElementById('one-cikan-kartlar'),
        sonGezilenler: document.getElementById('son-gezilenler-konteyner'),
        sonGezilenlerBolum: document.getElementById('son-gezilenler-bolumu'),
        karsilastirmaAlani: document.getElementById('karsilastirma-alani'),
        anaKarsilastirBtn: document.getElementById('ana-karsilastir-butonu'),
        aracTestFormu: document.getElementById('arac-test-formu'),
        headerUyeBtn: document.getElementById('uye-girisi-btn'),
        uyelikModal: document.getElementById('uyelik-modal'),
        modalOverlay: document.getElementById('arac-ekle-modal'),
        openModalBtn: document.getElementById('arac-ekle-modal-ac'),
        closeModalBtn: document.getElementById('modal-kapat'),
        modalSearch: document.getElementById('modal-arama-cubugu')
    };

    // --- 4. OLAY DİNLEYİCİLERİ ---
    if (el.kategoriBari) {
        el.kategoriBari.addEventListener('mouseenter', () => el.kategoriBari.classList.add('acik'));
        el.kategoriBari.addEventListener('mouseleave', () => el.kategoriBari.classList.remove('acik'));
        if (el.yanBarCentik) el.yanBarCentik.addEventListener('click', () => el.kategoriBari.classList.toggle('acik'));
    }

    if (el.anaKarsilastirBtn) {
        el.anaKarsilastirBtn.addEventListener('click', (e) => {
            const liste = JSON.parse(localStorage.getItem('karsilastirmaListesi') || '[]');
            if (liste.length < 2) {
                e.preventDefault();
                bildirimGoster("Karşılaştırma yapmak için en az 2 araç seçmelisiniz.", "hata");
            }
        });
    }

    if (el.aracTestFormu) {
        el.aracTestFormu.addEventListener('submit', handleTestSubmit);
    }

    // Üstteki Statik "Araç Ekle" Butonu için
    if (el.openModalBtn) {
        el.openModalBtn.addEventListener('click', () => { window.modalAc(); });
    }
    
    if (el.modalOverlay && el.closeModalBtn) {
        el.closeModalBtn.addEventListener('click', () => el.modalOverlay.classList.add('gizli'));
    }
    
    if (el.modalSearch) {
        el.modalSearch.addEventListener('input', (e) => populateModalList(e.target.value));
    }

    if (el.headerUyeBtn) {
        el.headerUyeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const u = JSON.parse(sessionStorage.getItem('aktifKullanici'));
            if (u) { 
                cikisYap(); 
            } 
            else { if(el.uyelikModal) el.uyelikModal.style.display = 'block'; }
        });
    }

    window.onclick = (e) => {
        if (el.uyelikModal && e.target == el.uyelikModal) el.uyelikModal.style.display = 'none';
        if (el.modalOverlay && e.target == el.modalOverlay) el.modalOverlay.classList.add('gizli');
    };
    document.querySelectorAll('.kapat-btn').forEach(b => b.addEventListener('click', function() {
        if(el.uyelikModal) el.uyelikModal.style.display = 'none';
        if(el.modalOverlay) el.modalOverlay.classList.add('gizli');
    }));

    // ==========================================
    // SANAL VERİ TABANI & GİRİŞ SİSTEMİ
    // ==========================================

    function veriTabaniniGetir() {
        let db = localStorage.getItem('kullaniciDB');
        if (!db) {
            const varsayilanlar = [
                { mail: "emirsevgili07@gmail.com", ad: "Emir Sevgili", sifre: "12345", garaj: [] },
                { mail: "hoca@okul.edu.tr",        ad: "Değerli Hocamız", sifre: "1234", garaj: [] },
                { mail: "admin@garaj.com",         ad: "Yönetici",        sifre: "admin", garaj: [] }
            ];
            localStorage.setItem('kullaniciDB', JSON.stringify(varsayilanlar));
            return varsayilanlar;
        }
        return JSON.parse(db);
    }

    // --- GİRİŞ YAPMA İŞLEMİ ---
    const formGiris = document.getElementById('form-giris');
    if(formGiris) formGiris.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('giris-email').value.trim();
        const sifre = document.getElementById('giris-sifre').value;
        
        const db = veriTabaniniGetir();
        const kullanici = db.find(k => k.mail === email);
        
        let girisIsmi = "";
        let kullaniciGaraji = [];

        if (kullanici) {
            girisIsmi = kullanici.ad;
            kullaniciGaraji = kullanici.garaj || []; 
        } else {
            let parca = email.split('@')[0];
            girisIsmi = parca.charAt(0).toUpperCase() + parca.slice(1);
        }

        sessionStorage.setItem('aktifKullanici', JSON.stringify({
            ad: girisIsmi, 
            email: email, 
            garaj: kullaniciGaraji 
        }));

        bildirimGoster(`Giriş Başarılı! Hoşgeldin ${girisIsmi}`, "basari");
        document.getElementById('uyelik-modal').style.display = 'none';
        setTimeout(() => window.location.reload(), 1500); 
    };

    // --- KAYIT OLMA İŞLEMİ ---
    const formKayit = document.getElementById('form-kayit');
    if(formKayit) formKayit.onsubmit = (e) => {
        e.preventDefault();
        const ad = document.getElementById('kayit-ad').value.trim();
        const soyad = document.getElementById('kayit-soyad').value.trim();
        const email = document.getElementById('kayit-email').value.trim();
        const sifre = document.getElementById('kayit-sifre').value;

        const db = veriTabaniniGetir();

        if (db.find(k => k.mail === email)) {
            bildirimGoster("Bu e-posta adresi zaten kayıtlı!", "hata");
            return;
        }

        const tamIsim = `${ad} ${soyad}`;
        db.push({ mail: email, ad: tamIsim, sifre: sifre, garaj: [] });
        localStorage.setItem('kullaniciDB', JSON.stringify(db));

        sessionStorage.setItem('aktifKullanici', JSON.stringify({
            ad: tamIsim, 
            email: email, 
            garaj:[]
        }));

        bildirimGoster(`Kayıt Başarılı! Aramıza hoşgeldin ${ad}.`, "basari");
        setTimeout(() => window.location.reload(), 1500);
    };

    const kayitLink = document.getElementById('kayit-linki');
    const girisLink = document.getElementById('giris-linki');
    if(kayitLink) kayitLink.onclick = (e) => { e.preventDefault(); document.getElementById('giris-kutusu').style.display='none'; document.getElementById('kayit-kutusu').style.display='block'; document.querySelector('.modal-icerik h2').textContent = "Kayıt Ol";};
    if(girisLink) girisLink.onclick = (e) => { e.preventDefault(); document.getElementById('kayit-kutusu').style.display='none'; document.getElementById('giris-kutusu').style.display='block'; document.querySelector('.modal-icerik h2').textContent = "Garaja Giriş";};


    // --- 5. LİSTELEME MANTIĞI ---
    if (typeof arabalar !== 'undefined') {
        if (el.kartKonteyner) {
            const kat = document.body.getAttribute('data-kategori-sayfasi');
            let liste = arabalar;
            if (kat === "Favoriler") {
                const u = JSON.parse(sessionStorage.getItem('aktifKullanici'));
                if (u && u.garaj && u.garaj.length > 0) {
                    liste = arabalar.filter(a => u.garaj.map(String).includes(String(a.id)));
                } else {
                    liste = []; 
                }
            } 
            else if (kat && kat !== "Tüm Modeller") {
                liste = arabalar.filter(a => a.kategori === kat);
            }
            arabaKartlariniGoster(el.kartKonteyner, liste);
        }

        if (el.oneCikan) arabaKartlariniGoster(el.oneCikan, [...arabalar].sort(() => 0.5 - Math.random()).slice(0, 3));
        
        if (el.sonGezilenler && el.sonGezilenlerBolum) {
            const list = JSON.parse(localStorage.getItem('sonGezilenler')) || [];
            if(list.length > 0) {
                el.sonGezilenlerBolum.style.display = 'block';
                arabaKartlariniGoster(el.sonGezilenler, list.map(id => arabalar.find(a => a.id == id)).filter(x => x));
            }
        }
        if (el.karsilastirmaAlani) karsilastirmaTablosuOlustur();
    }

    anaButonuGuncelle();
    seciliKartlariGuncelle();

}); // DOMContentLoaded SONU


// ==========================================
// YENİ: ÖZEL BİLDİRİM FONKSİYONU
// ==========================================
function bildirimGoster(mesaj, tur = 'bilgi') {
    let alan = document.getElementById('bildirim-alani');
    if (!alan) {
        alan = document.createElement('div');
        alan.id = 'bildirim-alani';
        document.body.appendChild(alan);
    }

    let ikon = '<i class="fa-solid fa-circle-info"></i>';
    if(tur === 'basari') ikon = '<i class="fa-solid fa-circle-check"></i>';
    if(tur === 'hata') ikon = '<i class="fa-solid fa-circle-exclamation"></i>';

    const kutu = document.createElement('div');
    kutu.className = `bildirim-kutusu ${tur}`;
    kutu.innerHTML = `${ikon} <span>${mesaj}</span>`;

    alan.appendChild(kutu);

    setTimeout(() => {
        kutu.remove();
    }, 4000);
}


// ==========================================
// YARDIMCI FONKSİYONLAR
// ==========================================

// 1. GECE MODU
function geceModunuBaslat() {
    if(document.getElementById('gece-modu-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'gece-modu-btn';
    btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    btn.title = "Gece Modu";
    
    const navUl = document.querySelector('.main-nav ul');
    if (navUl) {
        const li = document.createElement('li');
        li.appendChild(btn);
        navUl.appendChild(li);
    } else {
        btn.style.position = 'fixed'; btn.style.top = '20px'; btn.style.right = '20px'; btn.style.zIndex = '9999';
        document.body.appendChild(btn);
    }
    
    if (localStorage.getItem('geceModu') === 'aktif') {
        document.body.classList.add('gece-modu');
        btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    btn.addEventListener('click', () => {
        document.body.classList.toggle('gece-modu');
        if (document.body.classList.contains('gece-modu')) {
            localStorage.setItem('geceModu', 'aktif');
            btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            localStorage.setItem('geceModu', 'pasif');
            btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });
}

// 2. DETAY SAYFASI SLIDER
window.detaySliderBaslat = function() {
    const prevBtn = document.querySelector('.detay-slider-btn.prev');
    const nextBtn = document.querySelector('.detay-slider-btn.next');
    const resimler = document.querySelectorAll('.detay-resim-oge');
    
    if (!prevBtn || !nextBtn || resimler.length <= 1) {
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
        return;
    }

    prevBtn.style.display = 'block';
    nextBtn.style.display = 'block';

    let idx = 0;
    resimler.forEach((img, i) => { if(img.classList.contains('active')) idx = i; });

    prevBtn.onclick = function() {
        resimler[idx].classList.remove('active');
        idx = (idx - 1 + resimler.length) % resimler.length;
        resimler[idx].classList.add('active');
    };

    nextBtn.onclick = function() {
        resimler[idx].classList.remove('active');
        idx = (idx + 1) % resimler.length;
        resimler[idx].classList.add('active');
    };
};

// 3. KART GÖSTERME
function arabaKartlariniGoster(konteyner, liste) {
    if (liste.length === 0) {
        if(document.body.getAttribute('data-kategori-sayfasi') === "Favoriler") {
            konteyner.innerHTML = `<div style="text-align:center; width:100%;"><h3>Henüz favori aracınız yok.</h3><p>Araçları inceleyip <i class="fa-solid fa-heart"></i> ikonuna basarak ekleyebilirsiniz.</p><a href="${SITE.modeller || '/modeller/'}" class="kart-buton" style="display:inline-block; margin-top:20px;">Modellere Git</a></div>`;
        } else {
            konteyner.innerHTML = "<p style='width:100%; text-align:center;'>Araç bulunamadı.</p>";
        }
        return;
    }

    konteyner.innerHTML = liste.map(araba => {
        let resimHTML = "";
        if(araba.resimler && araba.resimler.length > 0) {
            araba.resimler.forEach((src, index) => {
                resimHTML += `<img src="${src}" class="kart-resim-oge ${index === 0 ? 'active' : ''}">`;
            });
        } else {
            resimHTML = `<img src="https://placehold.co/600x400" class="kart-resim-oge active">`;
        }

        let butonHTML = "";
        if(araba.resimler && araba.resimler.length > 1) {
            butonHTML = `
                <button class="slider-btn prev" onclick="kartSliderCevir(this, -1, event)">&#10094;</button>
                <button class="slider-btn next" onclick="kartSliderCevir(this, 1, event)">&#10095;</button>
            `;
        }

        const favClass = favoriMi(araba.id) ? 'aktif' : '';
        
        return `
            <div class="araba-karti">
                <div class="kart-slider">
                    ${resimHTML}
                    ${butonHTML}
                    <button class="favori-btn ${favClass}" onclick="favoriIslemi(${araba.id}, this)">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
                <div class="kart-icerik">
                    <h2 class="kart-baslik">${araba.markaModel}</h2>
                    <div class="ozellik-ozet">
                        <span><i class="fa-solid fa-gauge-high"></i> ${araba.ozellikler["Güç"] || '-'}</span>
                        <span><i class="fa-solid fa-stopwatch"></i> ${araba.ozellikler["0-100 km/s"] || '-'}</span>
                    </div>
                    <div class="butonlar">
                        <a href="${araba.detaySayfasi}" class="kart-buton" onclick="sonGezilenlereEkle(${araba.id})" style="flex:1; text-align:center;">İncele</a>
                        <button class="karsilastir-ekle" data-car-id="${araba.id}" onclick="karsilastirmaEkle(${araba.id}, this)">Karşılaştır +</button>
                    </div>
                </div>
            </div>`;
    }).join('');
    
    seciliKartlariGuncelle();
}

function kartSliderCevir(btn, yon, e) {
    e.preventDefault(); 
    const kart = btn.closest('.araba-karti');
    const resimler = kart.querySelectorAll('.kart-resim-oge');
    let aktifIndex = 0;

    resimler.forEach((img, i) => {
        if (img.classList.contains('active')) {
            aktifIndex = i;
            img.classList.remove('active');
        }
    });

    let yeniIndex = aktifIndex + yon;
    if (yeniIndex >= resimler.length) yeniIndex = 0;
    if (yeniIndex < 0) yeniIndex = resimler.length - 1;

    resimler[yeniIndex].classList.add('active');
}

// 4. YAKIT HESAPLAMA
function yakitHesaplamaModulunuBaslat(araba) {
    const alan = document.getElementById('yakit-hesaplama-alani');
    if (!alan || !araba) return;

    let tuketim = 8.5; 
    if (araba.kategori === "Süper Spor") tuketim = 16.0;
    else if (araba.kategori === "SUV") tuketim = 10.5;
    else if (araba.kategori === "Elektrikli") tuketim = 18.0; 
    else if (araba.kategori === "Lüks Sedanlar") tuketim = 9.5;

    const birim = araba.kategori === "Elektrikli" ? "kWh" : "Litre";
    const fiyat = araba.kategori === "Elektrikli" ? 10.99 : 53.66;

    alan.innerHTML = `
        <div class="hesaplama-kutusu">
            <h3><i class="fa-solid fa-gas-pump"></i> Yakıt ve Maliyet Hesapla</h3>
            <p style="margin-bottom:15px; color:#666;">Bu araç ortalama <strong>${tuketim} ${birim}</strong> / 100km tüketiyor.</p>
            <div class="hesap-satir">
                <div class="hesap-grup">
                    <label>Mesafe (km)</label>
                    <input type="number" id="h-km" placeholder="Örn: 500">
                </div>
                <div class="hesap-grup">
                    <label>Birim Fiyat (${birim})</label>
                    <input type="number" id="h-fiyat" value="${fiyat}">
                </div>
                <button class="btn-tam" onclick="hesapla(${tuketim}, '${birim}')">HESAPLA</button>
            </div>
            <div id="h-sonuc" class="hesap-sonuc" style="display:none;"></div>
        </div>
    `;
}

function hesapla(tuk, birim) {
    const km = parseFloat(document.getElementById('h-km').value);
    const fiyat = parseFloat(document.getElementById('h-fiyat').value);
    const sonucDiv = document.getElementById('h-sonuc');

    if (!km || km <= 0) { 
        bildirimGoster("Lütfen geçerli bir mesafe girin.", "hata");
        return; 
    }

    const toplamTuketim = (km / 100) * tuk;
    const maliyet = toplamTuketim * fiyat;

    sonucDiv.style.display = 'block';
    sonucDiv.innerHTML = `
        <h3 style="color:#27ae60;">Tahmini Maliyet: ${maliyet.toLocaleString('tr-TR', {maximumFractionDigits: 2})} TL</h3>
        <p>Toplam Tüketim: <strong>${toplamTuketim.toFixed(1)} ${birim}</strong></p>
    `;
}

// 5. YORUM SİSTEMİ
function yorumSisteminiBaslat(aracId) {
    const alan = document.getElementById('yorum-alani');
    if (!alan) return;

    const kayitliYorumlar = JSON.parse(localStorage.getItem('yorumlar_' + aracId)) || [];

    alan.innerHTML = `
        <div class="yorum-alani-kapsayici">
            <h2>Yorumlar (${kayitliYorumlar.length})</h2>
            <div class="yorum-yap-formu">
                <div class="yildizlar" id="yildiz-secimi" data-val="0">
                    <span onclick="puanVer(1)">★</span><span onclick="puanVer(2)">★</span><span onclick="puanVer(3)">★</span><span onclick="puanVer(4)">★</span><span onclick="puanVer(5)">★</span>
                </div>
                <textarea id="y-text" placeholder="Düşüncelerinizi yazın..."></textarea>
                <button class="btn-tam" onclick="yorumEkle(${aracId})">Yorumu Gönder</button>
            </div>
            <div id="y-list" class="yorum-listesi"></div>
        </div>
    `;
    listComments(kayitliYorumlar);
}

function puanVer(n) {
    const spans = document.querySelectorAll('#yildiz-secimi span');
    document.getElementById('yildiz-secimi').setAttribute('data-val', n);
    spans.forEach((s, i) => {
        if (i < n) s.classList.add('secili');
        else s.classList.remove('secili');
    });
}

function yorumEkle(id) {
    const txt = document.getElementById('y-text').value;
    const puan = document.getElementById('yildiz-secimi').getAttribute('data-val');
    const u = JSON.parse(sessionStorage.getItem('aktifKullanici'));

    if (!u) { 
        bildirimGoster("Yorum yapmak için önce giriş yapmalısınız.", "bilgi"); 
        return; 
    }
    if (!txt || puan == "0") { 
        bildirimGoster("Lütfen hem puan verin hem de yorum yazın.", "hata"); 
        return; 
    }

    const yeniYorum = {
        ad: u.ad,
        msg: txt,
        puan: puan,
        tarih: new Date().toLocaleDateString()
    };

    const yorumlar = JSON.parse(localStorage.getItem('yorumlar_' + id)) || [];
    yorumlar.unshift(yeniYorum);
    localStorage.setItem('yorumlar_' + id, JSON.stringify(yorumlar));

    document.getElementById('y-text').value = '';
    puanVer(0); 
    listComments(yorumlar);
    yorumSisteminiBaslat(id); 
    bildirimGoster("Yorumunuz başarıyla eklendi!", "basari");
}

function listComments(liste) {
    const el = document.getElementById('y-list');
    if (liste.length === 0) { el.innerHTML = "<p style='color:#777;'>Henüz yorum yok. İlk yorumu sen yap!</p>"; return; }

    el.innerHTML = liste.map(c => `
        <div class="tek-yorum">
            <div class="yorum-baslik">
                <strong>${c.ad}</strong>
                <span class="yorum-yildiz">${"★".repeat(c.puan)}</span>
            </div>
            <div class="yorum-metin">${c.msg}</div>
            <small style="color:#999">${c.tarih}</small>
        </div>
    `).join('');
}

// 6. KARŞILAŞTIRMA TABLOSU
function karsilastirmaTablosuOlustur() {
    const el = document.getElementById('karsilastirma-alani'); 
    if(!el) return;
    el.innerHTML = ''; 

    const listIDs = JSON.parse(localStorage.getItem('karsilastirmaListesi')) || [];

    if (listIDs.length === 0) {
        // DÜZELTME: onclick="window.modalAc()" eklendi
        el.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <p style="font-size:1.2rem; color:#777;">Listeniz boş.</p>
                <button onclick="window.modalAc()" class="btn-tam" style="max-width:200px;">Araç Ekle +</button>
            </div>`;
        return;
    }

    const secilenler = arabalar.filter(a => listIDs.includes(String(a.id)));
    let html = '<table class="karsilastirma-tablosu"><thead><tr><th>Özellik</th>';
    secilenler.forEach(a => html += `<th class="arac-baslik-hucre"><span class="arac-ismi">${a.markaModel}</span><button class="tablo-kaldir-btn" onclick="karsilastirmaCikar(${a.id})" title="Kaldır">&times;</button></th>`);
    html += '</tr></thead><tbody>';
    ["Motor", "Güç", "0-100 km/s", "Maksimum Hız", "Ağırlık", "Çekiş"].forEach(k => {
        html += `<tr><td><strong>${k}</strong></td>`; secilenler.forEach(a => html += `<td>${a.ozellikler[k] || '-'}</td>`); html += `</tr>`;
    });
    html += '</tbody></table>';

    if (listIDs.length < 4) {
        // DÜZELTME: onclick="window.modalAc()" eklendi
        html += `<div style="text-align:center; margin-top:20px;"><button onclick="window.modalAc()" class="btn-tam" style="max-width:200px; background-color:#28a745;">Araç Ekle +</button></div>`;
    }
    el.innerHTML = html;
}

// --- DÜZELTME: modalAc Global Fonksiyonu Eklendi ---
window.modalAc = function() {
    // Önce modal var mı kontrol et, yoksa oluştur
    aracEkleModaliniOlustur();
    
    const modal = document.getElementById('arac-ekle-modal');
    if(modal) {
        modal.classList.remove('gizli');
        modal.style.display = 'flex'; // Flex ile ortalama garantisi
        if(typeof populateModalList === 'function') {
            populateModalList('');
        }
    }
};

function karsilastirmaCikar(id) {
    let list = JSON.parse(localStorage.getItem('karsilastirmaListesi')) || [];
    list = list.filter(x => x !== String(id));
    localStorage.setItem('karsilastirmaListesi', JSON.stringify(list));
    karsilastirmaTablosuOlustur(); anaButonuGuncelle();
    bildirimGoster("Araç listeden çıkarıldı.", "bilgi");
}

function karsilastirmaEkle(id, btn) {
    let list = JSON.parse(localStorage.getItem('karsilastirmaListesi')) || [];
    const strId = String(id);
    if (list.includes(strId)) {
        list = list.filter(x => x !== strId);
        bildirimGoster("Karşılaştırma listesinden çıkarıldı.", "bilgi");
    } else { 
        if (list.length >= 4) { 
            bildirimGoster("En fazla 4 araç karşılaştırabilirsiniz!", "hata"); 
            return; 
        } 
        list.push(strId); 
        bildirimGoster("Karşılaştırma listesine eklendi!", "basari");
    }
    localStorage.setItem('karsilastirmaListesi', JSON.stringify(list));
    anaButonuGuncelle(); seciliKartlariGuncelle();
    if(document.getElementById('karsilastirma-alani')) karsilastirmaTablosuOlustur();
}

function populateModalList(t) {
    const el = document.getElementById('modal-arac-listesi');
    if(!el) return;
    const res = arabalar.filter(a=>a.markaModel.toLowerCase().includes(t.toLowerCase()));
    el.innerHTML = res.length ? res.map(a=>`
        <div class="modal-arac-item" onclick="karsilastirmaEkle(${a.id},null); document.getElementById('arac-ekle-modal').classList.add('gizli'); document.getElementById('arac-ekle-modal').style.display='none'; location.reload();" style="display:flex; align-items:center; padding:10px; border-bottom:1px solid #eee; cursor:pointer;">
            <img src="${a.resimler[0]}" style="width:50px; height:auto; margin-right:10px; border-radius:5px;">
            <span>${a.markaModel}</span>
        </div>`).join('') : '<p style="padding:10px; text-align:center">Sonuç bulunamadı.</p>';
}

// 7. FAVORİ SİSTEMİ (KALICI HAFIZA GÜNCELLEMELİ)
function favoriIslemi(id, btn) {
    // 1. Oturumdaki Kullanıcıyı Al
    let u = JSON.parse(sessionStorage.getItem('aktifKullanici'));
    
    if (!u) { 
        bildirimGoster("Favorilere eklemek için lütfen giriş yapın.", "bilgi"); 
        const m = document.getElementById('uyelik-modal'); 
        if(m) m.style.display='block'; 
        return; 
    }

    if (!u.garaj) u.garaj = [];
    const sid = String(id);

    // 2. Favori Ekleme/Çıkarma İşlemi
    if (u.garaj.map(String).includes(sid)) {
        // Çıkar
        u.garaj = u.garaj.filter(x => String(x) !== sid);
        if(btn) { 
            btn.classList.remove('aktif'); 
            if(btn.id==='detay-favori-btn') btn.innerHTML='<i class="fa-regular fa-heart"></i> Favorilere Ekle'; 
        }
        if(document.body.getAttribute('data-kategori-sayfasi')==="Favoriler" && btn) btn.closest('.araba-karti').remove();
        bildirimGoster("Favorilerden çıkarıldı.", "bilgi");
    } else {
        // Ekle
        u.garaj.push(id);
        if(btn) { 
            btn.classList.add('aktif'); 
            if(btn.id==='detay-favori-btn') btn.innerHTML='<i class="fa-solid fa-heart"></i> Favorilerden Çıkar'; 
        }
        bildirimGoster("Favorilere eklendi!", "basari");
    }

    // 3. Session'ı Güncelle (Anlık Durum)
    sessionStorage.setItem('aktifKullanici', JSON.stringify(u));

    // 4. Veri Tabanını (localStorage) Güncelle (KALICI HAFIZA)
    // Kullanıcının veri tabanındaki kaydını bul ve garajını güncelle
    const db = JSON.parse(localStorage.getItem('kullaniciDB'));
    if (db) {
        const dbUserIndex = db.findIndex(user => user.mail === u.email);
        if (dbUserIndex > -1) {
            db[dbUserIndex].garaj = u.garaj; // Garajı eşitle
            localStorage.setItem('kullaniciDB', JSON.stringify(db)); // Kaydet
        }
    }
}

function favoriMi(id) {
    const u = JSON.parse(sessionStorage.getItem('aktifKullanici'));
    return u && u.garaj && u.garaj.map(String).includes(String(id));
}

// 8. TEST SONUCU
function handleTestSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.getElementById('arac-test-formu'));
    const scores = { performans: 0, konfor: 0, pratiklik: 0, stil: 0 };
    const map = { performans: "Süper Spor", konfor: "Lüks Sedanlar", pratiklik: "SUV", stil: "Klasikler" };

    for (let v of formData.values()) {
        if (scores[v] !== undefined) scores[v]++;
    }
    
    let best = 'performans', max = 0;
    for (let k in scores) {
        if (scores[k] > max) { max = scores[k]; best = k; }
    }
    
    const cat = map[best];
    const cars = arabalar.filter(a => a.kategori === cat);
    const resDiv = document.getElementById('sonuc-alani');
    
    if (resDiv) {
        resDiv.style.display = 'block';
        if (cars.length > 0) {
            const car = cars[Math.floor(Math.random() * cars.length)];
            const img = car.resimler && car.resimler[0] ? car.resimler[0] : '';
            
            resDiv.innerHTML = `
                <h2 style="color:#e41d36; margin-bottom: 20px;">Sana En Uygun Kategori: ${cat}</h2>
                <div class="sonuc-karti">
                    <img src="${img}" alt="${car.markaModel}">
                    <h3>${car.markaModel}</h3>
                    <a href="${car.detaySayfasi}" class="btn-tam">İncele</a>
                </div>`;
        } else {
            resDiv.innerHTML = `<h2>Sonuç: ${cat}</h2><p style="color:var(--renk-yazi-orta)">Bu kategoride henüz araç eklenmemiş.</p>`;
        }
        resDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// 9. DİĞER YARDIMCILAR
function sonGezilenlereEkle(id) {
    let l = JSON.parse(localStorage.getItem('sonGezilenler')) || [];
    l = l.filter(x => x!=id); l.unshift(id); if(l.length>4) l.pop();
    localStorage.setItem('sonGezilenler', JSON.stringify(l));
}
function seciliKartlariGuncelle() {
    const l = JSON.parse(localStorage.getItem('karsilastirmaListesi')) || [];
    document.querySelectorAll('.karsilastir-ekle').forEach(b => {
        if(l.includes(String(b.getAttribute('data-car-id')))) { b.classList.add('aktif'); b.innerText='Eklendi ✔'; b.style.background='#27ae60'; } 
        else { b.classList.remove('aktif'); b.innerText='Karşılaştır +'; b.style.background=''; }
    });
}
function anaButonuGuncelle() {
    const b = document.getElementById('ana-karsilastir-butonu');
    const l = JSON.parse(localStorage.getItem('karsilastirmaListesi')) || [];
    if(b) { if(l.length>0) { b.classList.remove('gizli'); b.innerHTML=`Karşılaştır <span>(${l.length})</span>`; } else b.classList.add('gizli'); }
}
function oturumKontrol() {
    const btn = document.getElementById('uye-girisi-btn');
    const u = JSON.parse(sessionStorage.getItem('aktifKullanici'));
    if(btn && u) { 
        btn.innerHTML = `<i class="fa-solid fa-user"></i> ${u.ad} (Çıkış)`; 
        btn.style.color = "#e41d36"; 
        if(!document.getElementById('garaj-link')) {
            const li = document.createElement('li'); li.id='garaj-link';
            li.innerHTML = `<a href="${SITE.favoriler || '/favorilerim/'}" style="color:#e63946;"><i class="fa-solid fa-warehouse"></i> Garajım</a>`;
            document.querySelector('.main-nav ul').insertBefore(li, document.querySelector('.main-nav ul').lastElementChild);
        }
    } else {
        const gl = document.getElementById('garaj-link'); if(gl) gl.remove();
    }
}
function cikisYap() { 
    sessionStorage.removeItem('aktifKullanici'); 
    bildirimGoster("Çıkış yapıldı. Görüşmek üzere! 👋", "bilgi"); 
    setTimeout(() => window.location.reload(), 1500);
}

// 10. ULTRA GELİŞMİŞ SANAL ASİSTAN (HAFIZALI + KALICI SOHBET)
function sanalAsistaniBaslat() {
    if (document.getElementById('chat-kutusu')) return;
    
    // HTML Yapısı (Temizle butonu eklendi)
    const html = `
        <div class="asistan-btn" onclick="toggleChat()">
            <i class="fa-solid fa-robot"></i>
            <span class="bildirim-nokta" id="asistan-bildirim" style="display:none">1</span>
        </div>
        <div class="chat-kutusu" id="chat-kutusu" style="display:none;">
            <div class="chat-header">
                <span><i class="fa-solid fa-microchip"></i> Garaj AI</span>
                <span onclick="toggleChat()" style="cursor:pointer; font-size:1.2rem;">&times;</span>
                <span onclick="sohbetiTemizle()" style="cursor:pointer; font-size:0.8rem; margin-left:auto; margin-right:10px;" title="Sohbeti Sil">🗑️</span>
            </div>
            <div class="chat-icerik" id="chat-icerik">
                <div class="chat-mesaj mesaj-bot">
                    Selam! Ben Garaj Asistanı. 🤖<br>Sana nasıl yardımcı olabilirim?
                </div>
            </div>
            <div class="chat-input-alani">
                <input id="chat-input" placeholder="Bir şey yaz..." onkeypress="if(event.key==='Enter') sendMsg()">
                <button class="chat-gonder-btn" onclick="sendMsg()"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    // Kayıtlı sohbet varsa yükle
    sohbetiYukle();
}

function toggleChat() { 
    const k = document.getElementById('chat-kutusu'); 
    const bildirim = document.getElementById('asistan-bildirim');
    
    if (k.style.display === 'none') {
        k.style.display = 'flex';
        if(bildirim) bildirim.style.display = 'none';
        setTimeout(() => document.getElementById('chat-input').focus(), 100);
        // Sohbeti en aşağı kaydır
        const icerik = document.getElementById('chat-icerik');
        icerik.scrollTop = icerik.scrollHeight;
    } else {
        k.style.display = 'none';
    }
}

function sendMsg() {
    const input = document.getElementById('chat-input');
    const kutu = document.getElementById('chat-icerik');
    const soru = input.value.trim();
    
    if (!soru) return;
    
    // Mesajı Ekle
    kutu.innerHTML += `<div class="chat-mesaj mesaj-user">${soru}</div>`;
    input.value = '';
    kutu.scrollTop = kutu.scrollHeight;
    sohbetiKaydet(); // Kullanıcı mesajını kaydet

    // Yazıyor efekti
    const loadingId = 'loading-' + Date.now();
    kutu.innerHTML += `<div class="chat-mesaj mesaj-bot" id="${loadingId}"><i class="fa-solid fa-ellipsis fa-beat"></i></div>`;
    kutu.scrollTop = kutu.scrollHeight;

    setTimeout(() => {
        const cevap = botBeyni(soru);
        const l = document.getElementById(loadingId);
        if(l) l.remove();
        
        kutu.innerHTML += `<div class="chat-mesaj mesaj-bot">${cevap}</div>`;
        kutu.scrollTop = kutu.scrollHeight;
        sohbetiKaydet(); // Bot cevabını kaydet
    }, 600);
}

// --- BOTUN BEYNİ (HAFIZA SİSTEMİ EKLENDİ) ---
function botBeyni(soru) {
    const hamSoru = soru;
    soru = soru.toLowerCase();

    // 1. HAFIZA KONTROLÜ (BOT BİR CEVAP BEKLİYOR MU?)
    if (botDurumu === 'oneri_bekliyor') {
        if (soru.match(/(evet|olur|tamam|yolla|gönder|isterim|he|aynen)/)) {
            botDurumu = null; // Beklemeyi bitir
            const rastgele = arabalar[Math.floor(Math.random() * arabalar.length)];
            return `Harika! 🎉 İşte sana özel hız canavarı: <strong>${rastgele.markaModel}</strong>.<br>Güç: ${rastgele.ozellikler["Güç"]}<br><a href="${rastgele.detaySayfasi}" class="chat-link-btn">Hemen İncele 👉</a>`;
        } else if (soru.match(/(hayır|yok|kalsın|istemem)/)) {
            botDurumu = null;
            return "Peki, sen bilirsin. Başka bir sorun olursa buradayım! 🤖";
        }
    }

    // 2. TEKNİK SÖZLÜK (GERİ EKLENDİ - ÖNCELİKLİ)
    if (soru.includes("nedir") || soru.includes("ne demek") || soru.includes("ne işe yarar")) {
        if (soru.includes("tork")) return "⚙️ <strong>Tork Nedir?</strong><br>Motorun tekerleklere ilettiği dönme kuvvetidir. Tork ne kadar yüksekse, araba koltuğa o kadar yapıştırır ve yokuşları o kadar rahat çıkar.";
        if (soru.includes("beygir") || soru.includes("hp")) return "🐎 <strong>Beygir Gücü (HP) Nedir?</strong><br>Arabanın ne kadar hızlı gidebileceğini ve ne kadar iş yapabileceğini belirleyen güç birimidir. Son hızı genelde beygir belirler.";
        if (soru.includes("0-100")) return "⏱️ <strong>0-100 Nedir?</strong><br>Aracın durur halden (0 km/s) 100 km/s hıza kaç saniyede ulaştığını gösterir. Süre ne kadar kısaysa araba o kadar 'seri' demektir.";
        if (soru.includes("awd") || soru.includes("4 çeker") || soru.includes("dört çeker")) return "🐾 <strong>AWD (Dört Çeker) Nedir?</strong><br>Motor gücünün 4 tekerleğe birden iletilmesidir. Bu sayede araba virajlarda ve kaygan yollarda yola daha iyi tutunur.";
        if (soru.includes("turbo")) return "💨 <strong>Turbo Nedir?</strong><br>Egzoz gazını kullanarak motora daha fazla hava basan ve bu sayede küçük motordan büyük güç alınmasını sağlayan parçadır.";
        if (soru.includes("hibrit") || soru.includes("hybrid")) return "🔋 <strong>Hibrit Nedir?</strong><br>Hem benzinli hem elektrikli motoru olan, yakıt tasarrufu sağlayan çevreci araçlardır.";
    }

    // 3. SOHBET & DUYGU ANALİZİ
    if (soru.match(/(iyiyim|süperim|harikayım|bomba|iyi)/)) {
        botDurumu = 'oneri_bekliyor'; // Hafızayı aç, cevap bekle
        return "Bunu duyduğuma çok sevindim! 😊 Enerjin yüksekken sana hızlı bir araba önerelim mi? (Evet/Hayır)";
    }
    
    if (soru.match(/(kötüyüm|moralim bozuk|canım sıkkın)/)) 
        return "Üzüldüm... 😔 Bazen güzel bir motor sesi her şeye iyi gelir. İstersen bir 'Ferrari' detayına gidip motoru çalıştır.";
    
    if (soru.match(/(nasılsın|naber|ne haber)/)) 
        return "Veri akışım mükemmel, işlemcim serin çalışıyor. Sen nasılsın?";

    if (soru.match(/(merhaba|selam|sa |slm)/)) 
        return "Selamlar! Garajıma hoş geldin. Bugün sana nasıl yardımcı olayım?";

    // 3. EN'LER VE ANALİZLER
    if (soru.includes("en hızlı")) {
        let sonuc = arabalar.reduce((p, c) => parseInt(p.ozellikler["Maksimum Hız"]) > parseInt(c.ozellikler["Maksimum Hız"]) ? p : c);
        return `🏎️ Hız Kralı: <strong>${sonuc.markaModel}</strong>! Tam <strong>${sonuc.ozellikler["Maksimum Hız"]}</strong>.<br><a href="${sonuc.detaySayfasi}" class="chat-link-btn">İncele 👉</a>`;
    }
    if (soru.includes("en yavaş")) {
        let sonuc = arabalar.reduce((p, c) => parseInt(p.ozellikler["Maksimum Hız"]) < parseInt(c.ozellikler["Maksimum Hız"]) ? p : c);
        return `🐢 En sakin araç: <strong>${sonuc.markaModel}</strong> (${sonuc.ozellikler["Maksimum Hız"]}).<br><a href="${sonuc.detaySayfasi}" class="chat-link-btn">İncele 👉</a>`;
    }
    if (soru.includes("en pahalı")) {
        let sonuc = arabalar.reduce((p, c) => (p.fiyat || 0) > (c.fiyat || 0) ? p : c);
        return `💎 En değerli parça: <strong>${sonuc.markaModel}</strong>.<br>Fiyat: ${sonuc.fiyat.toLocaleString()} TL.<br><a href="${sonuc.detaySayfasi}" class="chat-link-btn">İncele 👉</a>`;
    }
    if (soru.includes("en ucuz")) {
        let sonuc = arabalar.reduce((p, c) => (p.fiyat || 999999999) < (c.fiyat || 999999999) ? p : c);
        return `💰 Fiyat/Performans: <strong>${sonuc.markaModel}</strong>.<br>Fiyat: ${sonuc.fiyat.toLocaleString()} TL.<br><a href="${sonuc.detaySayfasi}" class="chat-link-btn">İncele 👉</a>`;
    }

    // 4. KIYASLAMA
    if (soru.includes("mi") || soru.includes("vs")) {
        const bulunanlar = arabalar.filter(a => soru.includes(a.markaModel.toLowerCase()) || soru.includes(a.markaModel.split(' ')[0].toLowerCase()));
        if (bulunanlar.length >= 2) {
            const a1 = bulunanlar[0];
            const a2 = bulunanlar[1];
            if (soru.includes("hız")) {
                const k = parseInt(a1.ozellikler["Maksimum Hız"]) > parseInt(a2.ozellikler["Maksimum Hız"]) ? a1 : a2;
                return `🏎️ <strong>Hız Testi:</strong><br>${a1.markaModel}: ${a1.ozellikler["Maksimum Hız"]}<br>${a2.markaModel}: ${a2.ozellikler["Maksimum Hız"]}<br>🏆 Kazanan: <strong>${k.markaModel}</strong>`;
            }
            if (soru.includes("güç") || soru.includes("beygir")) {
                const p1 = parseInt(a1.ozellikler["Güç"]);
                const p2 = parseInt(a2.ozellikler["Güç"]);
                const k = p1 > p2 ? a1 : a2;
                return `💪 <strong>Güç Testi:</strong><br>${a1.markaModel}: ${p1} HP<br>${a2.markaModel}: ${p2} HP<br>🏆 Kazanan: <strong>${k.markaModel}</strong>`;
            }
            return `🆚 ${a1.markaModel} ve ${a2.markaModel} harika araçlar. Hızlarını kıyaslamak için 'hangisi daha hızlı?' diyebilirsin.`;
        }
    }

    // 5. ÖZEL ARAÇ SORGULAMA
    let bulunanArac = arabalar.find(a => soru.includes(a.markaModel.toLowerCase()) || soru.includes(a.markaModel.split(' ')[0].toLowerCase()));
    if (bulunanArac) {
        if (soru.includes("fiyat")) return `💸 <strong>${bulunanArac.markaModel}</strong>: ${bulunanArac.fiyat ? bulunanArac.fiyat.toLocaleString() + ' TL' : 'Bilinmiyor'}.`;
        if (soru.includes("hız")) return `🚀 Maksimum Hız: <strong>${bulunanArac.ozellikler["Maksimum Hız"]}</strong>.`;
        return `📄 <strong>${bulunanArac.markaModel}</strong> (${bulunanArac.kategori}).<br><a href="${bulunanArac.detaySayfasi}" class="chat-link-btn">Aracı İncele 👉</a>`;
    }

    // 6. ÖNERİLER
    if (soru.includes("öner")) {
        const r = arabalar[Math.floor(Math.random() * arabalar.length)];
        return `🎲 Sana önerim: <strong>${r.markaModel}</strong>.<br><a href="${r.detaySayfasi}" class="chat-link-btn">İncele 👉</a>`;
    }

    // ANLAMADIYSA
    return "Bunu tam anlayamadım. 🤔 'En hızlı araba', 'Ferrari fiyatı', 'Bana öneri yap' veya 'Tork nedir?' diyebilirsin.";
}

function sohbetiKaydet() {
    const icerik = document.getElementById('chat-icerik').innerHTML;
    localStorage.setItem('garajChatGecmisi', icerik);
    localStorage.setItem('botDurumu', botDurumu || "");
}

function sohbetiYukle() {
    const kayitliSohbet = localStorage.getItem('garajChatGecmisi');
    const kayitliDurum = localStorage.getItem('botDurumu');
    
    if (kayitliSohbet) {
        document.getElementById('chat-icerik').innerHTML = kayitliSohbet;
        const k = document.getElementById('chat-icerik');
        k.scrollTop = k.scrollHeight;
    }
    if (kayitliDurum) {
        botDurumu = kayitliDurum;
    }
}

function sohbetiTemizle() {
    if(confirm("Sohbet geçmişi silinsin mi?")) {
        localStorage.removeItem('garajChatGecmisi');
        localStorage.removeItem('botDurumu');
        document.getElementById('chat-icerik').innerHTML = '<div class="chat-mesaj mesaj-bot">Sohbet temizlendi. Tertemiz bir sayfa! ✨</div>';
        botDurumu = null;
    }
}

// 11. DRAG & BROŞÜR & MOTOR
// --- MOTOR SESİ BUTONU (GARANTİLİ) ---
function motorSesiButonuEkle() {
    if(document.querySelector('.motor-sesi-btn')) return;
    const b = document.createElement('div'); 
    b.className = 'motor-sesi-btn'; 
    b.innerHTML = '<i class="fa-solid fa-power-off"></i>'; 
    document.body.appendChild(b);
    
    // Varsayılan ses
    let sesDosyasi = 'https://www.soundjay.com/transportation/car-start-1.mp3';
    
    // Aktif aracı bul ve sesini al
    let detayId = document.body.getAttribute('data-detay-id');
    if (!detayId) {
        const params = new URLSearchParams(window.location.search);
        detayId = params.get('id');
    }
    if (typeof arabalar !== 'undefined' && detayId) {
        const aktifAraba = arabalar.find(a => a.id == detayId);
        if (aktifAraba && aktifAraba.ses) {
            sesDosyasi = aktifAraba.ses;
        }
    }

    const audio = new Audio(sesDosyasi);

    b.onclick = () => { 
        if (!audio.paused) return;

        audio.volume = 1.0;
        audio.currentTime = 0;
        
        audio.play().catch(e => console.log("Ses hatası:", e)); 
        b.classList.add('motor-calisiyor'); 
        b.innerHTML = '<i class="fa-solid fa-gauge-high"></i>'; 
        b.style.borderColor = '#00ff00';

        // 3 saniye sonra sesi yavaşça kıs
        setTimeout(() => {
            let sesKisIclemi = setInterval(() => {
                if (audio.volume > 0.1) {
                    audio.volume -= 0.1;
                } else {
                    clearInterval(sesKisIclemi);
                    audio.pause();
                    audio.currentTime = 0;
                    b.classList.remove('motor-calisiyor'); 
                    b.innerHTML = '<i class="fa-solid fa-power-off"></i>';
                    b.style.borderColor = ''; 
                }
            }, 100);
        }, 3000);
    };
}

// --- DRAG PİSTİ OLUŞTURMA (GÜNCELLENDİ: RAKİP SEÇİMİ EKLENDİ) ---
function dragPistiHazirla() {
    if(document.getElementById('drag-modal')) return;
    
    const h = `
        <div id="drag-modal" class="drag-modal" style="display:none">
            <span class="kapat-drag" onclick="document.getElementById('drag-modal').style.display='none'">x</span>
            <div class="trafik-isigi">
                <div class="isik kirmizi"></div>
                <div class="isik sari"></div>
                <div class="isik yesil"></div>
            </div>
            <div class="drag-pist">
                <div class="bitis-cizgisi"></div>
                <div id="arac-1" class="yaris-araci"><span id="lbl-1">Ben</span></div>
                <div id="arac-2" class="yaris-araci">
                    <select id="rakip-secimi" onchange="rakipDegistir(this.value)"></select>
                </div>
            </div>
            <div id="drag-sonuc" class="sonuc-panosu"></div>
            <button class="drag-btn" onclick="yarisiBaslat()">YARIŞI BAŞLAT!</button>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', h);
}

// --- DRAG MODUNU AÇMA (GÜNCELLENDİ: SESİ SIFIRLA VE RAKİP LİSTESİ) ---
function dragModunuAc() {
    if (!document.getElementById('drag-modal')) { dragPistiHazirla(); }
    const m = document.getElementById('drag-modal');
    if (!m) return; 

    m.style.display = 'flex';
    document.getElementById('arac-1').style.left = '10px';
    document.getElementById('arac-2').style.left = '10px';
    document.getElementById('drag-sonuc').innerText = 'Hazır Ol...';
    document.querySelectorAll('.isik').forEach(i => i.classList.remove('aktif'));
    yarisSesi.pause(); yarisSesi.currentTime = 0;
    
    let id = document.body.getAttribute('data-detay-id');
    if (!id) id = new URLSearchParams(window.location.search).get('id');
    if (typeof arabalar === 'undefined') return alert("Veri yüklenemedi.");
    const my = arabalar.find(a => a.id == id);
    if (!my) { alert("Araç bilgisi bulunamadı!"); m.style.display='none'; return; }

    if (my.resimler && my.resimler.length > 0) document.getElementById('arac-1').style.backgroundImage = `url(${my.resimler[0]})`;
    document.getElementById('lbl-1').innerText = my.markaModel;
    window.yarisArac1 = my;

    // Rakip Listesi
    const select = document.getElementById('rakip-secimi');
    select.innerHTML = ""; 
    
    arabalar.forEach(araba => {
        if(araba.id != my.id) {
            const option = document.createElement('option');
            option.value = araba.id;
            option.text = araba.markaModel;
            select.appendChild(option);
        }
    });

    if(select.options.length > 0) {
        const ilkRakipId = select.options[0].value;
        rakipDegistir(ilkRakipId);
    }
}

// YENİ FONKSİYON: RAKİP DEĞİŞTİRME
window.rakipDegistir = function(id) {
    const rival = arabalar.find(a => a.id == id);
    if(rival) {
        window.yarisArac2 = rival;
        if (rival.resimler && rival.resimler.length > 0) {
            document.getElementById('arac-2').style.backgroundImage = `url(${rival.resimler[0]})`;
        }
    }
};

// --- YARIŞI BAŞLATMA (SES EFEKTLİ VE FADE-IN) ---
function yarisiBaslat() {
    const l1 = document.querySelector('.isik.kirmizi');
    const l2 = document.querySelector('.isik.sari');
    const l3 = document.querySelector('.isik.yesil');
    
    const bipSesi = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
    
    l1.classList.add('aktif');
    bipSesi.play();

    setTimeout(() => { 
        l1.classList.remove('aktif'); 
        l2.classList.add('aktif'); 
        bipSesi.play(); 
        bipSesi.currentTime = 0; 
    }, 1000);

    setTimeout(() => { 
        l2.classList.remove('aktif'); 
        l3.classList.add('aktif'); 
        
        // --- DÜZELTME: YEŞİL IŞIK BİP SESİ GERİ GELDİ ---
        bipSesi.currentTime = 0;
        bipSesi.play();
        // ------------------------------------------------
        
        // Yarış Sesi Başlat (Fade-in)
        yarisSesi.currentTime = 0;
        yarisSesi.volume = 0;
        yarisSesi.play();

        let sesAcma = setInterval(() => {
            if(yarisSesi.volume < 0.9) {
                yarisSesi.volume += 0.1;
            } else {
                yarisSesi.volume = 1;
                clearInterval(sesAcma);
            }
        }, 200);

        hareketBasla(); 
    }, 2000);
}

// --- HAREKET VE SONUÇ (SESİ SON ARAÇTA FADE-OUT YAP) ---
function hareketBasla() {
    const a1 = document.getElementById('arac-1');
    const a2 = document.getElementById('arac-2');
    
    const s1 = parseFloat(window.yarisArac1.ozellikler["0-100 km/s"]) || 5.0;
    const s2 = parseFloat(window.yarisArac2.ozellikler["0-100 km/s"]) || 5.0;
    
    a1.style.transition = `left ${s1}s ease-in`;
    a2.style.transition = `left ${s2}s ease-in`;
    
    setTimeout(() => { a1.style.left = '85%'; a2.style.left = '85%'; }, 50);
    
    const yarisSuresi = Math.max(s1, s2) * 1000;

    // --- SES KISMA İŞLEMİ ---
    const sesKisamaZamani = yarisSuresi > 1500 ? yarisSuresi - 1500 : 0;

    setTimeout(() => {
        let sesKisma = setInterval(() => {
            if (yarisSesi.volume > 0.1) {
                yarisSesi.volume -= 0.1; 
            } else {
                yarisSesi.volume = 0; 
                clearInterval(sesKisma); 
            }
        }, 150); 
    }, sesKisamaZamani);

    // --- YARIŞ BİTİŞİ VE SONUÇ ---
    setTimeout(() => {
        const kazanan = s1 < s2 ? window.yarisArac1.markaModel : window.yarisArac2.markaModel;
        const msg = s1 === s2 ? "Beraberlik!" : `Kazanan: ${kazanan}! 🏆`;
        document.getElementById('drag-sonuc').innerText = msg;
        document.querySelector('.isik.yesil').classList.remove('aktif');
        
        yarisSesi.pause();
        yarisSesi.currentTime = 0;

    }, yarisSuresi);
}

function brosurModunuAc() {
    document.body.classList.add('brosur-aktif'); const b=document.createElement('button'); b.className='brosur-kapat-btn'; b.innerText='Çıkış';
    b.onclick=()=>{document.body.classList.remove('brosur-aktif'); b.remove();};
    document.body.appendChild(b); setTimeout(()=>window.print(),500);
}

// 6. KARŞILAŞTIRMA TABLOSU
function karsilastirmaTablosuOlustur() {
    const el = document.getElementById('karsilastirma-alani'); 
    if(!el) return;
    el.innerHTML = ''; 

    const listIDs = JSON.parse(localStorage.getItem('karsilastirmaListesi')) || [];

    if (listIDs.length === 0) {
        // DÜZELTME: onclick="window.modalAc()" eklendi
        el.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <p style="font-size:1.2rem; color:#777;">Listeniz boş.</p>
                <button onclick="window.modalAc()" class="btn-tam" style="max-width:200px;">Araç Ekle +</button>
            </div>`;
        return;
    }

    const secilenler = arabalar.filter(a => listIDs.includes(String(a.id)));
    let html = '<table class="karsilastirma-tablosu"><thead><tr><th>Özellik</th>';
    secilenler.forEach(a => html += `<th class="arac-baslik-hucre"><span class="arac-ismi">${a.markaModel}</span><button class="tablo-kaldir-btn" onclick="karsilastirmaCikar(${a.id})" title="Kaldır">&times;</button></th>`);
    html += '</tr></thead><tbody>';
    ["Motor", "Güç", "0-100 km/s", "Maksimum Hız", "Ağırlık", "Çekiş"].forEach(k => {
        html += `<tr><td><strong>${k}</strong></td>`; secilenler.forEach(a => html += `<td>${a.ozellikler[k] || '-'}</td>`); html += `</tr>`;
    });
    html += '</tbody></table>';

    if (listIDs.length < 4) {
        // DÜZELTME: onclick="window.modalAc()" eklendi
        html += `<div style="text-align:center; margin-top:20px;"><button onclick="window.modalAc()" class="btn-tam" style="max-width:200px; background-color:#28a745;">Araç Ekle +</button></div>`;
    }
    el.innerHTML = html;
}

// GLOBAL ATAMALAR
window.favoriIslemi=favoriIslemi; window.karsilastirmaEkle=karsilastirmaEkle; window.karsilastirmaCikar=karsilastirmaCikar;
window.arabaKartlariniGoster=arabaKartlariniGoster; window.sonGezilenlereEkle=sonGezilenlereEkle;
window.yakitHesaplamaModulunuBaslat=yakitHesaplamaModulunuBaslat; window.hesapla=hesapla;
window.yorumSisteminiBaslat=yorumSisteminiBaslat; window.yorumEkle=yorumEkle; window.puanVer=puanVer;
window.motorSesiButonuEkle=motorSesiButonuEkle; window.dragPistiHazirla=dragPistiHazirla; window.dragModunuAc=dragModunuAc;
window.yarisiBaslat=yarisiBaslat; window.brosurModunuAc=brosurModunuAc;
window.toggleChat=toggleChat; window.sendMsg=sendMsg; window.sanalAsistaniBaslat=sanalAsistaniBaslat; 
window.handleTestSubmit=handleTestSubmit; window.kartSliderCevir=kartSliderCevir; window.geceModunuBaslat=geceModunuBaslat;
window.detaySliderBaslat = detaySliderBaslat;
window.bildirimGoster = bildirimGoster; window.sohbetiTemizle = sohbetiTemizle;