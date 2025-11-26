from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstrukturViewSet, KelasViewSet, MateriViewSet


router = DefaultRouter()
router.register('instruktur', InstrukturViewSet)
router.register('kelas', KelasViewSet)
router.register('materi', MateriViewSet)


urlpatterns = [
    path('', include(router.urls)),
]