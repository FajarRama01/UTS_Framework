from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstrukturViewSet, KelasViewSet, MateriViewSet, PendaftaranViewSet, RegisterView


router = DefaultRouter()
router.register('instruktur', InstrukturViewSet)
router.register('kelas', KelasViewSet)
router.register('materi', MateriViewSet)
# router.register('pendaftaran', PendaftaranViewSet)
router.register('pendaftaran', PendaftaranViewSet, basename='pendaftaran')



urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
]