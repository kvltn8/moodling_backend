from djoser.serializers import UserCreateSerializer as BaseSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import MoodEntry, TaskList

class UserCreateSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        fields=("id","username","email","password")

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields=("id","username","email")

class MoodEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry
        fields = ["id", "mood", "created_at", "user","description"]
        extra_kwargs = {
            "user": {"read_only":True}
        }
class TaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskList
        fields=("id", "Task","note","is_done","user","created_at")
        extra_kwargs = {
            "user": {"read_only":True}
        }