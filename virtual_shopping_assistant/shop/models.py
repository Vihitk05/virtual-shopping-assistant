from django.db import models
from django.contrib.auth.models import AbstractUser,Group,Permission

class User(AbstractUser):
    pass

class Category(models.Model):
    name = models.CharField(max_length=100,null=True,blank=True)

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    stock =  models.IntegerField()
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True)
    image_url = models.URLField(max_length=200, blank= True)

    def __str__(self) -> str:
        return self.name
    
class Order(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    products = models.ManyToManyField(Product,through='OrderProduct')
    total_price = models.DecimalField(max_digits=10,decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Order {self.id} by {self.user.username}"

class OrderProduct(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self) -> str:
        return f"{self.product.name} in order {self.order.id}"