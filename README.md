# Araba Dünyası

Türkçe arayüzlü, Django tabanlı bir otomobil katalog ve keşif uygulaması. Süper sporlardan klasiklere kadar onlarca modeli kategorilere göre inceleyebilir, teknik özellikleri karşılaştırabilir, favorilerinize ekleyebilir ve kısa bir testle size uygun aracı bulabilirsiniz.

**Canlı depo:** [github.com/Emirsvgl07/Araba_Dunyasi](https://github.com/Emirsvgl07/Araba_Dunyasi)

---

## Özellikler

| Özellik | Açıklama |
|--------|----------|
| **Kategori gezgini** | Süper Spor, Spor Arabalar, Lüks Sedanlar, SUV, Klasikler, Hot Hatch, Elektrikli |
| **Araç detayı** | Ön, arka ve iç mekân görselleri; motor, güç, 0–100, maksimum hız ve daha fazlası |
| **Motor sesi** | Seçili modellerde örnek egzoz / motor sesi |
| **Karşılaştırma** | İki aracı yan yana teknik özellik olarak kıyaslama |
| **Garajım (Favoriler)** | Beğenilen araçları tarayıcıda saklama |
| **Uygun araç testi** | Sorulara göre öneri sunan interaktif test sayfası |
| **Yönetim paneli** | Django Admin üzerinden araç ekleme ve düzenleme |

Veritabanında varsayılan olarak **30 araç** bulunur; `seed_arabalar` komutu ile yüklenir.

---

## Teknolojiler

- **Python** 3.12+
- **Django** 6.0
- **SQLite** (geliştirme ortamı)
- HTML şablonları, CSS ve vanilla JavaScript

---

## Proje yapısı

```
Araba_Dunyasi/
├── araba_dunyasi/      # Proje ayarları (settings, urls, wsgi)
├── arabalar/           # Ana uygulama (modeller, görünümler, şablonlar)
│   ├── management/commands/seed_arabalar.py
│   ├── migrations/
│   └── templates/arabalar/
├── static/             # CSS, JS, görseller ve ses dosyaları
├── manage.py
└── requirements.txt
```

---

## Kurulum

### Gereksinimler

- Python 3.12 veya üzeri ([python.org](https://www.python.org/downloads/))
- `git` (depoyu klonlamak için)

### 1. Depoyu indirin

```bash
git clone https://github.com/Emirsvgl07/Araba_Dunyasi.git
cd Araba_Dunyasi
```

### 2. Sanal ortam oluşturun ve etkinleştirin

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**

```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Bağımlılıkları yükleyin

```bash
pip install -r requirements.txt
```

### 4. Veritabanını hazırlayın

```bash
python manage.py migrate
python manage.py seed_arabalar
```

`seed_arabalar` yalnızca veritabanı boşken çalışır. Verileri sıfırdan yüklemek için `db.sqlite3` dosyasını silip migrate ve seed adımlarını tekrarlayın.

### 5. (İsteğe bağlı) Yönetici hesabı

Admin paneline (`/admin/`) girmek için:

```bash
python manage.py createsuperuser
```

### 6. Geliştirme sunucusunu başlatın

```bash
python manage.py runserver
```

Tarayıcıda açın: **http://127.0.0.1:8000/**

---

## Sayfa adresleri

| URL | Sayfa |
|-----|--------|
| `/` | Ana sayfa |
| `/modeller/` | Tüm modeller |
| `/kategori/superspor/` | Kategori (örnek: süper spor) |
| `/detay/?id=1` | Araç detayı |
| `/karsilastir/` | Karşılaştırma |
| `/favorilerim/` | Garajım (favoriler) |
| `/test/` | Uygun araç testi |
| `/admin/` | Django yönetim paneli |

Kategori slug değerleri: `superspor`, `spor-arabalar`, `luks-sedanlar`, `suv`, `klasikler`, `hot-hatch`, `elektrikli`.

---

## Yararlı komutlar

```bash
# Araç verilerini yükle (DB boşsa)
python manage.py seed_arabalar

# Yeni migration oluştur (model değişikliğinden sonra)
python manage.py makemigrations
python manage.py migrate

# Statik dosyaları topla (production için)
python manage.py collectstatic
```

---

## Geliştirme notları

- Araç listesi ön yüzde `/js/data.js` uç noktasından JavaScript olarak sunulur; veriler `Araba` modelinden üretilir.
- Favoriler tarayıcıda (yerel depolama) tutulur; sunucu tarafında kullanıcı hesabı zorunlu değildir.
- `DEBUG = True` ve varsayılan `SECRET_KEY` yalnızca yerel geliştirme içindir; canlıya almadan önce [Django deployment checklist](https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/) uygulanmalıdır.

---

## Lisans

Bu proje eğitim / kişisel kullanım amaçlıdır. Kullanım ve lisans koşulları depo sahibi tarafından belirlenir.
