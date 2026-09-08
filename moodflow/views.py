from rest_framework.permissions import IsAuthenticated
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MoodEntry, User,TaskList
from .serializers import MoodEntrySerializer, TaskListSerializer

@api_view(['GET'])
def server(request):
    return Response({"message": "Server is running"}, status=status.HTTP_200_OK)


class MoodEntryViewSet(viewsets.ModelViewSet):
    serializer_class = MoodEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskListViewSet(viewsets.ModelViewSet):
    serializer_class = TaskListSerializer
    Permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return TaskList.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
