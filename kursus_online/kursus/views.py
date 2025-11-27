from django.shortcuts import render

# Create your views here.
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


from .models import Instruktur, Kelas, Materi
from .serializers import InstrukturSerializer, KelasSerializer, MateriSerializer
from .forms import InstrukturForm, KelasForm, MateriForm


# HTML VIEWS

# Instruktur CRUD HTML
class InstrukturListView(ListView):
    model = Instruktur

class InstrukturDetailView(DetailView):
    model = Instruktur

class InstrukturCreateView(CreateView):
    model = Instruktur
    form_class = InstrukturForm
    success_url = reverse_lazy('instruktur-list')

class InstrukturUpdateView(UpdateView):
    model = Instruktur
    form_class = InstrukturForm
    success_url = reverse_lazy('instruktur-list')

class InstrukturDeleteView(DeleteView):
    model = Instruktur
    success_url = reverse_lazy('instruktur-list')


# Kelas CRUD HTML
class KelasListView(ListView):
    model = Kelas

class KelasDetailView(DetailView):
    model = Kelas

class KelasCreateView(CreateView):
    model = Kelas
    form_class = KelasForm
    success_url = reverse_lazy('kelas-list')

class KelasUpdateView(UpdateView):
    model = Kelas
    form_class = KelasForm
    success_url = reverse_lazy('kelas-list')

class KelasDeleteView(DeleteView):
    model = Kelas
    success_url = reverse_lazy('kelas-list')


# Materi CRUD HTML
class MateriListView(ListView):
    model = Materi
    serializer_class = MateriSerializer

class MateriDetailView(DetailView):
    model = Materi


class MateriCreateView(CreateView):
    model = Materi
    form_class = MateriForm
    success_url = reverse_lazy('materi-list')


class MateriUpdateView(UpdateView):
    model = Materi
    form_class = MateriForm
    success_url = reverse_lazy('materi-list')


class MateriDeleteView(DeleteView):
    model = Materi
    success_url = reverse_lazy('materi-list')

# ----------------------------
# API VIEWSETS
# ----------------------------
class InstrukturViewSet(viewsets.ModelViewSet):
    queryset = Instruktur.objects.all()
    serializer_class = InstrukturSerializer

    @action(detail=False, methods=['post'])
    def bulk(self, request):
        serializer = InstrukturSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Bulk insert berhasil", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class KelasViewSet(viewsets.ModelViewSet):
    queryset = Kelas.objects.all()
    serializer_class = KelasSerializer

    @action(detail=False, methods=['post'])
    def bulk(self, request):
        serializer = KelasSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Bulk insert berhasil", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MateriViewSet(viewsets.ModelViewSet):
    queryset = Materi.objects.all()
    serializer_class = MateriSerializer

    @action(detail=False, methods=['post'])
    def bulk(self, request):
        serializer = MateriSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Bulk insert berhasil", "data": serializer.data},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def dashboard(request):
    data = {
        "total_instruktur": Instruktur.objects.count(),
        "total_kelas": Kelas.objects.count(),
        "total_materi": Materi.objects.count(),
        "kelas_terbaru": Kelas.objects.order_by('-tanggal_mulai')[:3]
    }
    return render(request, "kursus/dashboard.html", data)