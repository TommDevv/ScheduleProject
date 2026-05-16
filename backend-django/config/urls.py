"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('register/', views.registerUser, name='register'),
    path('detalleUsuario/', views.detalleUsuario, name='detalleUsuario'),
    path('login/', views.login, name='login'),
    path('updatePassword/', views.updatePassword, name='updatePassword'),
    path('deleteUser/', views.deleteUser, name='deleteUser'),
    path('listarUsuarios/', views.listar_usuarios, name='listarUsuarios'),
    path('whoami/', views.whoami, name='whoami'),
    path('listarRegistros/', views.listarRegistros, name='listarRegistros'),
    path('crearRegistro/', views.crearRegistro, name='crearRegistro'),
    path('horarios/', views.horarios, name='horarios'),
]
