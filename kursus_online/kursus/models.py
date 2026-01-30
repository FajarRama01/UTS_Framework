from django.db import models
from django.contrib.auth.models import User
# from django.db import models


class Instruktur(models.Model):
    nama = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    keahlian = models.CharField(max_length=200)
    tanggal_bergabung = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nama

class Kelas(models.Model):
    LEVEL_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )

    judul = models.CharField(max_length=200)
    deskripsi = models.TextField()
    instruktur = models.ForeignKey(Instruktur, on_delete=models.CASCADE, related_name="kelas_set")
    tingkat = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    tanggal_mulai = models.DateField()

    def __str__(self):
        return self.judul

class Materi(models.Model):
    kelas = models.ForeignKey(Kelas, on_delete=models.CASCADE, related_name="materi")
    judul = models.CharField(max_length=200)
    isi = models.TextField()
    urutan = models.PositiveIntegerField()
    tanggal_upload = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.kelas.judul} - {self.judul}"

class Pendaftaran(models.Model):
    siswa = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pendaftaran')
    kelas = models.ForeignKey(Kelas, on_delete=models.CASCADE, related_name='pendaftar')
    tanggal_daftar = models.DateTimeField(auto_now_add=True)
    
    # Opsional: Status kelulusan simpel
    selesai = models.BooleanField(default=False)

    class Meta:
        unique_together = ('siswa', 'kelas') # Mencegah siswa daftar kelas yang sama 2x
        ordering = ['-tanggal_daftar']

    def __str__(self):
        return f"{self.siswa.username} - {self.kelas.judul}"
# Create your models here.
