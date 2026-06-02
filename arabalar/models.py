from django.db import models


KATEGORI_SECENEKLERI = [
    ('Süper Spor', 'Süper Spor'),
    ('Spor Arabalar', 'Spor Arabalar'),
    ('Lüks Sedanlar', 'Lüks Sedanlar'),
    ('SUV', 'SUV'),
    ('Klasikler', 'Klasikler'),
    ('Hot Hatch', 'Hot Hatch'),
    ('Elektrikli', 'Elektrikli'),
]

KATEGORI_SLUG = {
    'Süper Spor': 'superspor',
    'Spor Arabalar': 'spor-arabalar',
    'Lüks Sedanlar': 'luks-sedanlar',
    'SUV': 'suv',
    'Klasikler': 'klasikler',
    'Hot Hatch': 'hot-hatch',
    'Elektrikli': 'elektrikli',
}

SLUG_KATEGORI = {v: k for k, v in KATEGORI_SLUG.items()}


class Araba(models.Model):
    kategori = models.CharField(max_length=50, choices=KATEGORI_SECENEKLERI)
    marka_model = models.CharField(max_length=100)
    aciklama = models.TextField()
    resim_on = models.CharField(max_length=200)
    resim_arka = models.CharField(max_length=200)
    resim_ic = models.CharField(max_length=200)
    motor = models.CharField(max_length=100)
    guc = models.CharField(max_length=50)
    sifir_yuz = models.CharField(max_length=20, verbose_name='0-100 km/s')
    max_hiz = models.CharField(max_length=30, verbose_name='Maksimum Hız')
    agirlik = models.CharField(max_length=30)
    cekis = models.CharField(max_length=50)
    ses = models.CharField(max_length=200, blank=True, default='')

    class Meta:
        verbose_name = 'Araba'
        verbose_name_plural = 'Arabalar'
        ordering = ['id']

    def __str__(self):
        return self.marka_model

    @property
    def kategori_slug(self):
        return KATEGORI_SLUG.get(self.kategori, '')

    def resimler_static(self, static_prefix='/static/'):
        return [
            f'{static_prefix}{self.resim_on}',
            f'{static_prefix}{self.resim_arka}',
            f'{static_prefix}{self.resim_ic}',
        ]

    def to_js_dict(self, static_prefix='/static/'):
        ses_yolu = f'{static_prefix}{self.ses}' if self.ses else ''
        return {
            'id': self.pk,
            'kategori': self.kategori,
            'markaModel': self.marka_model,
            'aciklama': self.aciklama,
            'detaySayfasi': f'/detay/?id={self.pk}',
            'resimler': self.resimler_static(static_prefix),
            'ozellikler': {
                'Motor': self.motor,
                'Güç': self.guc,
                '0-100 km/s': self.sifir_yuz,
                'Maksimum Hız': self.max_hiz,
                'Ağırlık': self.agirlik,
                'Çekiş': self.cekis,
            },
            'ses': ses_yolu,
        }
