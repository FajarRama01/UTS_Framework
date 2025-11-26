from django.db import models
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
    instruktur = models.ForeignKey(Instruktur, on_delete=models.CASCADE, related_name="kelas")
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
# Create your models here.
