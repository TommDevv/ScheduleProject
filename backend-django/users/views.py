from django.shortcuts import render
from rest_framework import status
from rest_framework import response
from rest_framework.decorators import api_view, permission_classes
from .models import Usuarios, Registros, Horario
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import (
    UsuariosRegistrerSerializer,
    UsuariosDetalleSeralizer,
    RegistrosSeralizer,
    RegistrosDetalleSeralizer,
    HorarioSerializer,
    HorarioDetalleSerializer,
)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    nickname = request.data.get('nickname')
    password = request.data.get('password')

    if not nickname or not password:
        return response.Response({"error": "Nombre y contraseña son requeridos."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=nickname, password=password)
    if not user:
        return response.Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)
    
    refresh = RefreshToken.for_user(user)

    return response.Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }, status=status.HTTP_200_OK)


#Poner en URLS
@api_view(['PUT'])
def updatePassword(request):
    documento = int(request.data.get('documento'))
    new_password = request.data.get('new_password')
    print(documento, new_password)

    try:
        user = Usuarios.objects.get(documento=documento)
    except Usuarios.DoesNotExist:
        return response.Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)


    user.set_password(new_password)
    user.save()
    
    return response.Response({"message": "Contraseña actualizada correctamente."}, status=status.HTTP_200_OK)

#poner en urls
@api_view(['DELETE'])
def deleteUser(request):
    userId = request.data.get('id_user')
    try:
        user = Usuarios.object.get(id_user=userId)
    except Usuarios.DoesNotExist:
        return response.Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    Usuarios.delete(user)
    return response.Response({"message": "Usuario eliminado correctamente."}, status=status.HTTP_200_OK)

#Poner en URLS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_usuarios(request):
    users = Usuarios.objects.all().order_by('id_user')
    serializer = UsuariosDetalleSeralizer(users, many=True)
    return response.Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def registerUser(request):
    print("Register user called")
    serializer = UsuariosRegistrerSerializer(data=request.data)

    print(serializer.is_valid())
    print(request.data)

    if serializer.is_valid():
        user = serializer.save()
        return response.Response({
            "message": "usuario creado correctamente."}, 
            status=status.HTTP_201_CREATED)
    return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def whoami(request):
    print(request.user)
    return response.Response({
        "nickname": request.user.nickname,
        "nombre": request.user.nombre,
        "documento": request.user.documento
    }, status=status.HTTP_200_OK)

    return

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def listarRegistros(request):
    registros = Registros.objects.all()
    serializer = RegistrosDetalleSeralizer(registros, many=True)
    res = response.Response(serializer.data, status=status.HTTP_200_OK)
    return res

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def crearRegistro(request):
    serializer = RegistrosSeralizer(data=request.data)
    print(request.data)
    print(serializer.is_valid())

    if serializer.is_valid():
        registro = serializer.save()
        res = response.Response({"message": "Registro creado correctamente"}, status = status.HTTP_201_CREATED)
        return res
    return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def detalleUsuario(request):
    print("Detalle usuario called")
    print(request.data)
    nickname=request.query_params.get('nickname')
    try:
        user = Usuarios.objects.get(nickname=nickname)
    except Usuarios.DoesNotExist:
        return response.Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UsuariosDetalleSeralizer(user)
    return response.Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def horarios(request):
    if request.method == 'GET':
        horarios_usuario = Horario.objects.filter(usuario=request.user).order_by('dia', 'hora_inicio')
        serializer = HorarioDetalleSerializer(horarios_usuario, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        horario_id = request.data.get('id_horario') or request.query_params.get('id_horario')

        if not horario_id:
            return response.Response({'detail': 'Se requiere id_horario.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            horario = Horario.objects.get(id_horario=horario_id, usuario=request.user)
        except Horario.DoesNotExist:
            return response.Response({'detail': 'Horario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        horario.delete()
        return response.Response(status=status.HTTP_204_NO_CONTENT)

    serializer = HorarioSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        horario = serializer.save()
        return response.Response(HorarioDetalleSerializer(horario).data, status=status.HTTP_201_CREATED)

    return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)