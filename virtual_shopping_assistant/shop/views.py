from django.shortcuts import get_object_or_404, render
from .serializers import *
from rest_framework import status
from rest_framework.permissions import *
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class=UserSerializer
    permission_classes = [AllowAny]

class UserLoginView(TokenObtainPairView):
    serializer_class=UserLoginSerializer

    def post(self,request,*args,**kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data,status=status.HTTP_200_OK)
    

class AddToCartView(generics.CreateAPIView):
    serializer_class = AddToCartSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class DeleteFromCartView(generics.GenericAPIView):
    serializer_class = DeleteFromCartSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.delete(serializer.validated_data)
        return Response(status=status.HTTP_204_NO_CONTENT)

class GetCartView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        order = Order.objects.filter(user=user).first()
        return OrderProduct.objects.filter(order=order) if order else []


class CheckOutForPaymentView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        user = request.user
        cart_items = OrderProduct.objects.filter(order__user=user)
        total_price = sum(item.product.price * item.quantity for item in cart_items)

        return Response({"message":"Checkout Successful","total_price":total_price},status=status.HTTP_200_OK)

class UpdateUserInformationView(generics.UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class ViewUserInformationView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class ProductsOnHomePageView(generics.ListAPIView):
    queryset = Product.objects.all()[:10]
    serializer_class = ProductSerializer

class DisplayProductsView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        filters = self.request.data.get('filters',{})
        if filters:
            for key,value in filters.items():
                if key == 'name':
                    queryset = queryset.filter(name__icontains=value)
                
                if key == 'price_min':
                    queryset = queryset.filter(price__gte=value)
                
                if key == 'price_max':
                    queryset = queryset.filter(price__lte=value)
                
                if key == 'category':
                    queryset = queryset.filter(category__name=value)
        return queryset

class SearchProductView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        query = self.request.query_params.get('q','')
        queryset = Product.objects.filter(name__icontains=query)
        return queryset
    
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class RelatedProductsView(generics.RetrieveAPIView):
    def get(self, request, pk):
        product = Product.objects.get(id=pk)
        related_products = Product.objects.filter(category=product.category).exclude(id=pk)[:10]
        serializer = ProductSerializer(related_products, many=True)
        return Response(serializer.data)