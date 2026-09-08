from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(max_length=170, unique=True)
    email = models.EmailField(unique=True)
    def __str__(self):
        return self.username



class MoodEntry(models.Model):
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="moods")
    mood = models.CharField(max_length=50)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}, {self.mood}, {self.created_at}"

class TaskList(models.Model):
    Task = models.CharField(max_length=100)
    note = models.TextField(blank=True)
    is_done = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    created_at=models.DateField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.username},{self.Task}, {self.about}, {self.created_at}"