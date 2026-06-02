from django.core.management.base import BaseCommand

from arabalar.models import Araba

ARABA_VERILERI = [
    {
        'kategori': 'Süper Spor', 'marka_model': 'Porsche 911 GT3',
        'aciklama': 'Safkan bir yarışçı ruhu...',
        'resim_on': 'images/porsche-911-gt3_on.jpg', 'resim_arka': 'images/porsche-911-gt3_arka.jpg', 'resim_ic': 'images/porsche-911-gt3_ic.jpg',
        'motor': '4.0L Atmosferik Boxer', 'guc': '510 HP', 'sifir_yuz': '3.4s', 'max_hiz': '318 km/s', 'agirlik': '1,435 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/porsche-911-gt3.mp3',
    },
    {
        'kategori': 'Süper Spor', 'marka_model': 'Ferrari 488 Pista',
        'aciklama': 'İtalyan zarafeti...',
        'resim_on': 'images/ferrari-488-pista_on.jpg', 'resim_arka': 'images/ferrari-488-pista_arka.jpg', 'resim_ic': 'images/ferrari-488-pista_ic.jpg',
        'motor': '3.9L Twin-Turbo V8', 'guc': '720 HP', 'sifir_yuz': '2.85s', 'max_hiz': '340 km/s', 'agirlik': '1,385 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/ferrari-488-pista.mp3',
    },
    {
        'kategori': 'Süper Spor', 'marka_model': 'Lamborghini Huracan',
        'aciklama': 'Kışkırtıcı tasarım...',
        'resim_on': 'images/lamborghini-huracan_on.jpg', 'resim_arka': 'images/lamborghini-huracan_arka.jpg', 'resim_ic': 'images/lamborghini-huracan_ic.jpg',
        'motor': '5.2L Atmosferik V10', 'guc': '640 HP', 'sifir_yuz': '2.9s', 'max_hiz': '325 km/s', 'agirlik': '1,422 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/lamborghini-huracan.mp3',
    },
    {
        'kategori': 'Süper Spor', 'marka_model': 'McLaren 720S',
        'aciklama': 'Aerodinamik mükemmellik...',
        'resim_on': 'images/mclaren-720s_on.jpg', 'resim_arka': 'images/mclaren-720s_arka.jpg', 'resim_ic': 'images/mclaren-720s_ic.jpg',
        'motor': '4.0L Twin-Turbo V8', 'guc': '710 HP', 'sifir_yuz': '2.9s', 'max_hiz': '341 km/s', 'agirlik': '1,419 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/mclaren-720s.mp3',
    },
    {
        'kategori': 'Süper Spor', 'marka_model': 'Bugatti Chiron',
        'aciklama': 'Mühendisliğin zirvesi...',
        'resim_on': 'images/bugatti-chiron_on.jpg', 'resim_arka': 'images/bugatti-chiron_arka.jpg', 'resim_ic': 'images/bugatti-chiron_ic.jpg',
        'motor': '8.0L Quad-Turbo W16', 'guc': '1500 HP', 'sifir_yuz': '2.4s', 'max_hiz': '420 km/s', 'agirlik': '1,996 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/bugatti-chiron.mp3',
    },
    {
        'kategori': 'Süper Spor', 'marka_model': 'Koenigsegg Jesko',
        'aciklama': 'İsveç harikası...',
        'resim_on': 'images/koenigsegg-jesko_on.jpg', 'resim_arka': 'images/koenigsegg-jesko_arka.jpg', 'resim_ic': 'images/koenigsegg-jesko_ic.jpg',
        'motor': '5.0L Twin-Turbo V8', 'guc': '1600 HP', 'sifir_yuz': '2.5s', 'max_hiz': '480+ km/s', 'agirlik': '1,420 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/koenigsegg-jesko.mp3',
    },
    {
        'kategori': 'Spor Arabalar', 'marka_model': 'Ford Mustang GT',
        'aciklama': 'Amerikan rüyası...',
        'resim_on': 'images/ford-mustang-gt_on.jpg', 'resim_arka': 'images/ford-mustang-gt_arka.jpg', 'resim_ic': 'images/ford-mustang-gt_ic.jpg',
        'motor': '5.0L Coyote V8', 'guc': '450 HP', 'sifir_yuz': '4.3s', 'max_hiz': '250 km/s', 'agirlik': '1,743 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/ford-mustang-gt.mp3',
    },
    {
        'kategori': 'Spor Arabalar', 'marka_model': 'Chevrolet Corvette C8',
        'aciklama': 'Ortadan motorlu devrim...',
        'resim_on': 'images/chevrolet-corvette-c8_on.jpg', 'resim_arka': 'images/chevrolet-corvette-c8_arka.jpg', 'resim_ic': 'images/chevrolet-corvette-c8_ic.jpg',
        'motor': '6.2L Atmosferik V8', 'guc': '495 HP', 'sifir_yuz': '2.9s', 'max_hiz': '312 km/s', 'agirlik': '1,530 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/chevrolet-corvette-c8.mp3',
    },
    {
        'kategori': 'Spor Arabalar', 'marka_model': 'BMW M4 Competition',
        'aciklama': 'Alman mühendisliği...',
        'resim_on': 'images/bmw-m4-competition_on.jpg', 'resim_arka': 'images/bmw-m4-competition_arka.jpg', 'resim_ic': 'images/bmw-m4-competition_ic.jpg',
        'motor': '3.0L Twin-Turbo I6', 'guc': '510 HP', 'sifir_yuz': '3.9s', 'max_hiz': '290 km/s', 'agirlik': '1,725 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/bmw-m4-competition.mp3',
    },
    {
        'kategori': 'Spor Arabalar', 'marka_model': 'Toyota Supra',
        'aciklama': 'Japon efsanesi...',
        'resim_on': 'images/toyota-supra_on.jpg', 'resim_arka': 'images/toyota-supra_arka.jpg', 'resim_ic': 'images/toyota-supra_ic.jpg',
        'motor': '3.0L Turbo I6', 'guc': '382 HP', 'sifir_yuz': '4.1s', 'max_hiz': '250 km/s', 'agirlik': '1,540 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/toyota-supra.mp3',
    },
    {
        'kategori': 'Spor Arabalar', 'marka_model': 'Nissan GT-R',
        'aciklama': 'Godzilla lakaplı...',
        'resim_on': 'images/nissan-gt-r_on.jpg', 'resim_arka': 'images/nissan-gt-r_arka.jpg', 'resim_ic': 'images/nissan-gt-r_ic.jpg',
        'motor': '3.8L Twin-Turbo V6', 'guc': '565 HP', 'sifir_yuz': '2.9s', 'max_hiz': '315 km/s', 'agirlik': '1,752 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/nissan-gt-r.mp3',
    },
    {
        'kategori': 'Spor Arabalar', 'marka_model': 'Audi R8 V10',
        'aciklama': 'Günlük kullanıma uygun...',
        'resim_on': 'images/audi-r8-v10_on.jpg', 'resim_arka': 'images/audi-r8-v10_arka.jpg', 'resim_ic': 'images/audi-r8-v10_ic.jpg',
        'motor': '5.2L Atmosferik V10', 'guc': '602 HP', 'sifir_yuz': '3.2s', 'max_hiz': '330 km/s', 'agirlik': '1,595 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/audi-r8-v10.mp3',
    },
    {
        'kategori': 'Lüks Sedanlar', 'marka_model': 'Mercedes-AMG GT63s',
        'aciklama': 'Dört kapılı...',
        'resim_on': 'images/mercedes-amg-gt63s_on.jpg', 'resim_arka': 'images/mercedes-amg-gt63s_arka.jpg', 'resim_ic': 'images/mercedes-amg-gt63s_ic.jpg',
        'motor': '4.0L Twin-Turbo V8', 'guc': '630 HP', 'sifir_yuz': '3.2s', 'max_hiz': '315 km/s', 'agirlik': '2,120 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/mercedes-amg-gt63s.mp3',
    },
    {
        'kategori': 'Lüks Sedanlar', 'marka_model': 'BMW M5 CS',
        'aciklama': 'Konfor ve performans...',
        'resim_on': 'images/bmw-m5-cs_on.jpg', 'resim_arka': 'images/bmw-m5-cs_arka.jpg', 'resim_ic': 'images/bmw-m5-cs_ic.jpg',
        'motor': '4.4L Twin-Turbo V8', 'guc': '635 HP', 'sifir_yuz': '3.0s', 'max_hiz': '305 km/s', 'agirlik': '1,825 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/bmw-m5-cs.mp3',
    },
    {
        'kategori': 'Lüks Sedanlar', 'marka_model': 'Audi RS7',
        'aciklama': 'Agresif tasarım...',
        'resim_on': 'images/audi-rs7_on.jpg', 'resim_arka': 'images/audi-rs7_arka.jpg', 'resim_ic': 'images/audi-rs7_ic.jpg',
        'motor': '4.0L Twin-Turbo V8', 'guc': '591 HP', 'sifir_yuz': '3.6s', 'max_hiz': '305 km/s', 'agirlik': '2,065 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/audi-rs7.mp3',
    },
    {
        'kategori': 'Elektrikli', 'marka_model': 'Porsche Taycan Turbo S',
        'aciklama': 'Elektrikli gelecek...',
        'resim_on': 'images/porsche-taycan-turbo-s_on.jpg', 'resim_arka': 'images/porsche-taycan-turbo-s_arka.jpg', 'resim_ic': 'images/porsche-taycan-turbo-s_ic.jpg',
        'motor': 'Çift Elektrik Motoru', 'guc': '750 HP', 'sifir_yuz': '2.8s', 'max_hiz': '260 km/s', 'agirlik': '2,295 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/porsche-taycan.mp3',
    },
    {
        'kategori': 'Lüks Sedanlar', 'marka_model': 'Rolls-Royce Ghost',
        'aciklama': 'Lüksün zirvesi...',
        'resim_on': 'images/rolls-royce-ghost_on.jpg', 'resim_arka': 'images/rolls-royce-ghost_arka.jpg', 'resim_ic': 'images/rolls-royce-ghost_ic.jpg',
        'motor': '6.75L Twin-Turbo V12', 'guc': '563 HP', 'sifir_yuz': '4.8s', 'max_hiz': '250 km/s', 'agirlik': '2,490 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/rolls-royce-ghost.mp3',
    },
    {
        'kategori': 'Lüks Sedanlar', 'marka_model': 'Bentley Flying Spur',
        'aciklama': 'El işçiliği...',
        'resim_on': 'images/bentley-flying-spur_on.jpg', 'resim_arka': 'images/bentley-flying-spur_arka.jpg', 'resim_ic': 'images/bentley-flying-spur_ic.jpg',
        'motor': '6.0L Twin-Turbo W12', 'guc': '626 HP', 'sifir_yuz': '3.8s', 'max_hiz': '333 km/s', 'agirlik': '2,437 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/bentley-flying-spur.mp3',
    },
    {
        'kategori': 'SUV', 'marka_model': 'Lamborghini Urus',
        'aciklama': 'Süper spor SUV...',
        'resim_on': 'images/lamborghini-urus_on.jpg', 'resim_arka': 'images/lamborghini-urus_arka.jpg', 'resim_ic': 'images/lamborghini-urus_ic.jpg',
        'motor': '4.0L Twin-Turbo V8', 'guc': '641 HP', 'sifir_yuz': '3.6s', 'max_hiz': '305 km/s', 'agirlik': '2,200 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/lamborghini-urus.mp3',
    },
    {
        'kategori': 'SUV', 'marka_model': 'Mercedes-AMG G63',
        'aciklama': 'İkonik tasarım...',
        'resim_on': 'images/mercedes-amg-g63_on.jpg', 'resim_arka': 'images/mercedes-amg-g63_arka.jpg', 'resim_ic': 'images/mercedes-amg-g63_ic.jpg',
        'motor': '4.0L Twin-Turbo V8', 'guc': '577 HP', 'sifir_yuz': '4.5s', 'max_hiz': '240 km/s', 'agirlik': '2,560 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/mercedes-amg-g63.mp3',
    },
    {
        'kategori': 'SUV', 'marka_model': 'Range Rover SV',
        'aciklama': 'Lüks ve arazi...',
        'resim_on': 'images/range-rover-sv_on.jpg', 'resim_arka': 'images/range-rover-sv_arka.jpg', 'resim_ic': 'images/range-rover-sv_ic.jpg',
        'motor': '4.4L Twin-Turbo V8', 'guc': '523 HP', 'sifir_yuz': '4.6s', 'max_hiz': '260 km/s', 'agirlik': '2,585 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/range-rover-sv.mp3',
    },
    {
        'kategori': 'SUV', 'marka_model': 'Porsche Cayenne Turbo GT',
        'aciklama': 'Pist performansı SUV...',
        'resim_on': 'images/porsche-cayenne-turbo-gt_on.jpg', 'resim_arka': 'images/porsche-cayenne-turbo-gt_arka.jpg', 'resim_ic': 'images/porsche-cayenne-turbo-gt_ic.jpg',
        'motor': '4.0L Twin-Turbo V8', 'guc': '631 HP', 'sifir_yuz': '3.3s', 'max_hiz': '300 km/s', 'agirlik': '2,220 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/porsche-cayenne-turbo-gt.mp3',
    },
    {
        'kategori': 'Klasikler', 'marka_model': 'Ferrari F40',
        'aciklama': 'Saf sürüş makinesi...',
        'resim_on': 'images/ferrari-f40_on.jpg', 'resim_arka': 'images/ferrari-f40_arka.jpg', 'resim_ic': 'images/ferrari-f40_ic.jpg',
        'motor': '2.9L Twin-Turbo V8', 'guc': '471 HP', 'sifir_yuz': '4.1s', 'max_hiz': '324 km/s', 'agirlik': '1,100 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/ferrari-f40.mp3',
    },
    {
        'kategori': 'Klasikler', 'marka_model': 'Lancia Delta Integrale',
        'aciklama': 'Ralli efsanesi...',
        'resim_on': 'images/lancia-delta-integrale_on.jpg', 'resim_arka': 'images/lancia-delta-integrale_arka.jpg', 'resim_ic': 'images/lancia-delta-integrale_ic.jpg',
        'motor': '2.0L Turbo I4', 'guc': '215 HP', 'sifir_yuz': '5.7s', 'max_hiz': '220 km/s', 'agirlik': '1,340 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/lancia-delta-integrale.mp3',
    },
    {
        'kategori': 'Klasikler', 'marka_model': 'BMW E30 M3',
        'aciklama': 'Sürüş keyfi ikonu...',
        'resim_on': 'images/bmw-e30-m3_on.jpg', 'resim_arka': 'images/bmw-e30-m3_arka.jpg', 'resim_ic': 'images/bmw-e30-m3_ic.jpg',
        'motor': '2.3L Atmosferik I4', 'guc': '192 HP', 'sifir_yuz': '6.9s', 'max_hiz': '235 km/s', 'agirlik': '1,200 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/bmw-e30-m3.mp3',
    },
    {
        'kategori': 'Klasikler', 'marka_model': 'Shelby Cobra 427',
        'aciklama': 'Ham güç...',
        'resim_on': 'images/shelby-cobra-427_on.jpg', 'resim_arka': 'images/shelby-cobra-427_arka.jpg', 'resim_ic': 'images/shelby-cobra-427_ic.jpg',
        'motor': '7.0L Atmosferik V8', 'guc': '425 HP', 'sifir_yuz': '4.2s', 'max_hiz': '262 km/s', 'agirlik': '1,070 kg', 'cekis': 'Arkadan İtiş',
        'ses': 'sesler/shelby-cobra-427.mp3',
    },
    {
        'kategori': 'Hot Hatch', 'marka_model': 'Honda Civic Type R',
        'aciklama': 'Önden çeker kralı...',
        'resim_on': 'images/honda-civic-type-r_on.jpg', 'resim_arka': 'images/honda-civic-type-r_arka.jpg', 'resim_ic': 'images/honda-civic-type-r_ic.jpg',
        'motor': '2.0L Turbo I4', 'guc': '315 HP', 'sifir_yuz': '5.4s', 'max_hiz': '275 km/s', 'agirlik': '1,429 kg', 'cekis': 'Önden Çekiş',
        'ses': 'sesler/honda-civic-type-r.mp3',
    },
    {
        'kategori': 'Hot Hatch', 'marka_model': 'VW Golf R',
        'aciklama': 'Pratik ve hızlı...',
        'resim_on': 'images/vw-golf-r_on.jpg', 'resim_arka': 'images/vw-golf-r_arka.jpg', 'resim_ic': 'images/vw-golf-r_ic.jpg',
        'motor': '2.0L Turbo I4', 'guc': '315 HP', 'sifir_yuz': '4.7s', 'max_hiz': '270 km/s', 'agirlik': '1,551 kg', 'cekis': 'Dört Çeker (AWD)',
        'ses': 'sesler/vw-golf-r.mp3',
    },
    {
        'kategori': 'Hot Hatch', 'marka_model': 'Renault Megane R.S.',
        'aciklama': 'Viraj ustası...',
        'resim_on': 'images/renault-megane-rs_on.jpg', 'resim_arka': 'images/renault-megane-rs_arka.jpg', 'resim_ic': 'images/renault-megane-rs_ic.jpg',
        'motor': '1.8L Turbo I4', 'guc': '296 HP', 'sifir_yuz': '5.7s', 'max_hiz': '260 km/s', 'agirlik': '1,419 kg', 'cekis': 'Önden Çekiş',
        'ses': 'sesler/renault-megane-rs.mp3',
    },
    {
        'kategori': 'Hot Hatch', 'marka_model': 'Hyundai i30 N',
        'aciklama': 'Eğlence paketi...',
        'resim_on': 'images/hyundai-i30-n_on.jpg', 'resim_arka': 'images/hyundai-i30-n_arka.jpg', 'resim_ic': 'images/hyundai-i30-n_ic.jpg',
        'motor': '2.0L Turbo I4', 'guc': '276 HP', 'sifir_yuz': '5.9s', 'max_hiz': '250 km/s', 'agirlik': '1,429 kg', 'cekis': 'Önden Çekiş',
        'ses': 'sesler/hyundai-i30-n.mp3',
    },
]


class Command(BaseCommand):
    help = 'Orijinal data.js verilerini veritabanına yükler'

    def handle(self, *args, **options):
        if Araba.objects.exists():
            self.stdout.write('Veritabanında zaten araç var, atlanıyor.')
            return

        for veri in ARABA_VERILERI:
            Araba.objects.create(**veri)

        self.stdout.write(self.style.SUCCESS(f'{len(ARABA_VERILERI)} araç başarıyla yüklendi.'))
