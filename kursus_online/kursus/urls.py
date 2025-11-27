from django.urls import path
from django.views.generic import TemplateView
from .views import (
InstrukturListView, InstrukturDetailView, InstrukturCreateView,
InstrukturUpdateView, InstrukturDeleteView,
KelasListView, KelasDetailView, KelasCreateView,
KelasUpdateView, KelasDeleteView,
MateriListView, MateriDetailView, MateriCreateView,
MateriUpdateView, MateriDeleteView, dashboard
)


urlpatterns = [
path('', dashboard, name="dashboard"),
path('', TemplateView.as_view(template_name='kursus/dashboard.html'), name='kursus-dashboard'),
# Instruktur
path('instruktur/', InstrukturListView.as_view(), name='instruktur-list'),
path('instruktur/tambah/', InstrukturCreateView.as_view(), name='instruktur-create'),
path('instruktur/<int:pk>/', InstrukturDetailView.as_view(), name='instruktur-detail'),
path('instruktur/<int:pk>/edit/', InstrukturUpdateView.as_view(), name='instruktur-update'),
path('instruktur/<int:pk>/hapus/', InstrukturDeleteView.as_view(), name='instruktur-delete'),


# Kelas
path('kelas/', KelasListView.as_view(), name='kelas-list'),
path('kelas/tambah/', KelasCreateView.as_view(), name='kelas-create'),
path('kelas/<int:pk>/', KelasDetailView.as_view(), name='kelas-detail'),
path('kelas/<int:pk>/edit/', KelasUpdateView.as_view(), name='kelas-update'),
path('kelas/<int:pk>/hapus/', KelasDeleteView.as_view(), name='kelas-delete'),


# Materi
path('materi/', MateriListView.as_view(), name='materi-list'),
path('materi/tambah/', MateriCreateView.as_view(), name='materi-create'),
path('materi/<int:pk>/', MateriDetailView.as_view(), name='materi-detail'),
path('materi/<int:pk>/edit/', MateriUpdateView.as_view(), name='materi-update'),
path('materi/<int:pk>/hapus/', MateriDeleteView.as_view(), name='materi-delete'),
]