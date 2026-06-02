from django.contrib import admin

from .models import Araba

admin.site.site_header = 'Araba Dünyası Admin Panel'
admin.site.site_title = 'Araba Dünyası Admin Panel'
admin.site.index_title = 'Site Yönetimi'


@admin.register(Araba)
class ArabaAdmin(admin.ModelAdmin):
    list_display = ('id', 'marka_model', 'kategori', 'guc')
    list_filter = ('kategori',)
    search_fields = ('marka_model', 'kategori')
