from django import forms
from .models import Instruktur, Kelas, Materi


class InstrukturForm(forms.ModelForm):
    class Meta:
        model = Instruktur
        fields = '__all__'


class KelasForm(forms.ModelForm):
    class Meta:
        model = Kelas
        fields = '__all__'


class MateriForm(forms.ModelForm):
    class Meta:
        model = Materi
        fields = '__all__'