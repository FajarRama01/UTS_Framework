from rest_framework import serializers
from .models import Instruktur, Kelas, Materi


class InstrukturSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instruktur
        fields = '__all__'

class KelasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kelas
        fields = '__all__'

class MateriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materi
        fields = '__all__'