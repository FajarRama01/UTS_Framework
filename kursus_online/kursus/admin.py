# from django.contrib import admin
from django.contrib import admin
from .models import Instruktur, Kelas, Materi


# --------------------------
# Inline Materi dalam Menu Kelas
# --------------------------
class MateriInline(admin.TabularInline):
    model = Materi
    extra = 1
    fields = ('urutan', 'judul')
    ordering = ('urutan',)


# --------------------------
# Admin Instruktur
# --------------------------
@admin.register(Instruktur)
class InstrukturAdmin(admin.ModelAdmin):
    list_display = ('nama', 'email', 'keahlian', 'tanggal_bergabung')
    search_fields = ('nama', 'email', 'keahlian')
    list_filter = ('tanggal_bergabung',)
    ordering = ('nama',)


# --------------------------
# Admin Kelas
# --------------------------
@admin.register(Kelas)
class KelasAdmin(admin.ModelAdmin):
    list_display = ('judul', 'instruktur', 'tingkat', 'tanggal_mulai')
    search_fields = ('judul', 'instruktur__nama')
    list_filter = ('tingkat', 'tanggal_mulai')
    list_select_related = ('instruktur',)
    ordering = ('judul',)

    inlines = [MateriInline]   # Tampilkan materi langsung dalam kelas


# --------------------------
# Admin Materi
# --------------------------
@admin.register(Materi)
class MateriAdmin(admin.ModelAdmin):
    list_display = ('judul', 'kelas', 'urutan', 'tanggal_upload')
    search_fields = ('judul', 'kelas__judul')
    list_filter = ('kelas',)
    ordering = ('kelas', 'urutan')


# Register your models here.
