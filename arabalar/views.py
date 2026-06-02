import json

from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render

from .models import SLUG_KATEGORI, Araba


def ana_sayfa(request):
    return render(request, 'arabalar/ana_sayfa.html', {
        'sayfa_basligi': 'Araba Dünyası - Ana Sayfa',
        'giris_butonu': True,
    })


def modeller(request):
    return render(request, 'arabalar/modeller.html', {
        'sayfa_basligi': 'Tüm Modeller - Araba Dünyası',
        'kategori_adi': 'Tüm Modeller',
    })


def kategori(request, slug):
    kategori_adi = SLUG_KATEGORI.get(slug)
    if not kategori_adi:
        return render(request, 'arabalar/404_araba.html', status=404)
    return render(request, 'arabalar/kategori.html', {
        'sayfa_basligi': f'{kategori_adi} - Araba Dünyası',
        'kategori_adi': kategori_adi,
        'kategori_slug': slug,
    })


def detay(request):
    arac_id = request.GET.get('id')
    if not arac_id:
        return render(request, 'arabalar/detay.html', {
            'sayfa_basligi': 'Araç Detayı - Araba Dünyası',
            'giris_butonu': True,
            'araba': None,
        })
    araba = get_object_or_404(Araba, pk=arac_id)
    return render(request, 'arabalar/detay.html', {
        'sayfa_basligi': f'{araba.marka_model} - İnceleme',
        'giris_butonu': True,
        'araba': araba,
    })


def karsilastir(request):
    return render(request, 'arabalar/karsilastir.html', {
        'sayfa_basligi': 'Araç Karşılaştırma',
    })


def favoriler(request):
    return render(request, 'arabalar/favoriler.html', {
        'sayfa_basligi': 'Garajım (Favoriler)',
        'kategori_adi': 'Favoriler',
        'giris_butonu': True,
    })


def test_sayfasi(request):
    return render(request, 'arabalar/test.html', {
        'sayfa_basligi': 'Sana Uygun Aracı Bul - Test',
    })


def data_js(request):
    static_prefix = request.build_absolute_uri('/static/').replace('/static/', '/static/')
    if not static_prefix.endswith('/'):
        static_prefix += '/'
    prefix = '/static/'
    arabalar = [a.to_js_dict(prefix) for a in Araba.objects.all()]
    content = f'const arabalar = {json.dumps(arabalar, ensure_ascii=False)};'
    return HttpResponse(content, content_type='application/javascript; charset=utf-8')
