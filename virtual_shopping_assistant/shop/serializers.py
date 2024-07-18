from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('id','username','email','password')
        extra_kwargs = {'password':{'write_only':True}}

    def create(self,validated_data):
        user = User.objects.create_user(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            password=validated_data.get('password')
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username,password=password)
        if user and user.is_active:
            refresh = RefreshToken.for_user(user=user)
            return {'username':user.username,'refresh':str(refresh),'access':str(refresh.access_token)}
        raise serializers.ValidationError("Invalid Credentials")

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'

# serializers.py

class OrderProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2)
    product_image_url = serializers.URLField(source='product.image_url')

    class Meta:
        model = OrderProduct
        fields = ['id', 'product_name', 'product_price', 'product_image_url', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderProduct
        fields = ['id', 'product', 'quantity']



class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField()

    def create(self, validated_data):
        user = self.context['request'].user
        product_id = validated_data.get('product_id')
        quantity = validated_data.get('quantity')
        product = Product.objects.get(id=product_id)
        
        order, created = Order.objects.get_or_create(user=user, total_price=0)
        
        # Check if the product is already in the cart
        order_product, order_created = OrderProduct.objects.get_or_create(order=order, product=product)
        if not order_created:
            # If the product is already in the cart, update the quantity
            order_product.quantity += quantity
            order_product.save()
        else:
            # If the product is new to the cart, set the quantity
            order_product.quantity = quantity
            order_product.save()
        
        # Update the total price of the order
        order.total_price = sum(item.product.price * item.quantity for item in order.orderproduct_set.all())
        order.save()
        
        return order_product

class DeleteFromCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()

    def delete(self, validated_data):
        user = self.context['request'].user
        product_id = validated_data.get('product_id')
        product = Product.objects.get(id=product_id)
        
        order = Order.objects.filter(user=user).first()
        if order:
            order_product = OrderProduct.objects.filter(order=order, product=product).first()
            if order_product:
                order_product.delete()
                # Update the total price of the order
                order.total_price = sum(item.product.price * item.quantity for item in order.orderproduct_set.all())
                order.save()


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ('id','username','email')
