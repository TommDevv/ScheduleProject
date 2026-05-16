import os
import sys
# Ensure project root is on PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()
from users.models import Usuarios

try:
    Usuarios.objects.create_user(nickname='testuser_ai', password='TestPass123', nombre='Test', documento=999999)
    print('User created')
except Exception as e:
    print('Error:', e)
    raise
