from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Instruktur, Kelas, Materi, Pendaftaran



class InstrukturSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instruktur
        fields = '__all__'

class KelasSerializer(serializers.ModelSerializer):
    nama_instruktur = serializers.StringRelatedField(source='instruktur', read_only=True)
    jumlah_materi = serializers.IntegerField(source='materi.count', read_only=True)
    class Meta:
        model = Kelas
        # fields = '__all__'
        fields = ['id', 'judul', 'deskripsi', 'instruktur', 'nama_instruktur', 'tingkat', 'tanggal_mulai', 'jumlah_materi']

class MateriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materi
        fields = '__all__'

class PendaftaranSerializer(serializers.ModelSerializer):
    # Menampilkan detail kelas dan siswa saat GET (Read)
    nama_siswa = serializers.CharField(source='siswa.username', read_only=True)
    judul_kelas = serializers.CharField(source='kelas.judul', read_only=True)

    class Meta:
        model = Pendaftaran
        fields = ['id', 'siswa', 'nama_siswa', 'kelas', 'judul_kelas', 'tanggal_daftar', 'selesai']
        # 'siswa' akan diisi otomatis lewat views nanti (CurrentUser), jadi set read_only
        read_only_fields = ['siswa']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Penting: Gunakan create_user agar password di-hash (dienkripsi)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user