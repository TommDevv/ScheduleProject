from rest_framework import serializers
from .models import Usuarios, Registros
from .models import Horario

class UsuariosRegistrerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['nickname', 'password', 'nombre', 'documento']

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        
        password = validated_data.pop('password')

        user= Usuarios(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class UsuariosDetalleSeralizer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id_user', 'nickname', 'nombre', 'documento']

class RegistrosSeralizer(serializers.ModelSerializer):
    class Meta:
        model = Registros
        fields= ['nombre', 'descripcion']

    
    def create(self, validated_data):
        registro= Registros(**validated_data)
        registro.save()
        return registro

class RegistrosDetalleSeralizer(serializers.ModelSerializer):
    class Meta:
        model = Registros
        fields= ['nombre', 'descripcion']


class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = ['id_horario', 'dia', 'titulo', 'hora_inicio', 'hora_fin', 'descripcion']
        read_only_fields = ['id_horario']

    def validate(self, attrs):
        if attrs['hora_fin'] <= attrs['hora_inicio']:
            raise serializers.ValidationError({'hora_fin': 'La hora final debe ser mayor que la hora de inicio.'})

        request = self.context.get('request')
        user = getattr(request, 'user', None)

        if user and user.is_authenticated:
            overlapping = Horario.objects.filter(
                usuario=user,
                dia=attrs['dia'],
                hora_inicio__lt=attrs['hora_fin'],
                hora_fin__gt=attrs['hora_inicio'],
            )

            if self.instance is not None:
                overlapping = overlapping.exclude(pk=self.instance.pk)

            if overlapping.exists():
                raise serializers.ValidationError({'detail': 'Ese horario ya tiene una tarea asignada y no puede solaparse.'})

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['usuario'] = request.user
        return super().create(validated_data)


class HorarioDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = ['id_horario', 'dia', 'titulo', 'hora_inicio', 'hora_fin', 'descripcion']
