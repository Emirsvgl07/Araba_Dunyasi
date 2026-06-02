from django.urls import path

from . import views

urlpatterns = [
    path('', views.ana_sayfa, name='ana_sayfa'),
    path('modeller/', views.modeller, name='modeller'),
    path('kategori/<slug:slug>/', views.kategori, name='kategori'),
    path('detay/', views.detay, name='detay'),
    path('karsilastir/', views.karsilastir, name='karsilastir'),
    path('favorilerim/', views.favoriler, name='favoriler'),
    path('test/', views.test_sayfasi, name='test'),
    path('js/data.js', views.data_js, name='data_js'),
]
