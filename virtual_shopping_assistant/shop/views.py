import json
from django.shortcuts import get_object_or_404, render
from .serializers import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import *
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
import google.generativeai as genai

genai.configure(api_key="AIzaSyBI9k3_sXMrSKT98gDDJTW-PoRd6JXfBfM")


class UserUpdateOrCreateView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')

            # Update or create user
            user, created = User.objects.update_or_create(
                username=username,
                defaults={
                    'email': email,
                    'password': password,  # Password should be hashed
                    # Add any additional fields you want to update or set
                }
            )

            # If the user is created, set the password
            if created:
                user.set_password(password)
                user.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(TokenObtainPairView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


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

    def post(self, request):
        user = request.user
        cart_items = OrderProduct.objects.filter(order__user=user)
        total_price = sum(item.product.price *
                          item.quantity for item in cart_items)

        return Response({"message": "Checkout Successful", "total_price": total_price}, status=status.HTTP_200_OK)


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
        filters = self.request.data.get('filters', {})
        if filters:
            for key, value in filters.items():
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
        query = self.request.query_params.get('q', '')
        queryset = Product.objects.filter(name__icontains=query)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class RelatedProductsView(generics.RetrieveAPIView):
    def get(self, request, pk):
        product = Product.objects.get(id=pk)
        related_products = Product.objects.filter(
            category=product.category).exclude(id=pk)[:10]
        serializer = ProductSerializer(related_products, many=True)
        return Response(serializer.data)


class ChatbotView(APIView):
    def post(self, request):
        user_message = request.data.get('message')
        user = request.user

        # Generate response and recommendations using Gemini API
        response_text, recommendations = self.generate_response_and_recommendations(user_message)

        # Convert Decimal values in recommendations to floats
        for product in recommendations:
            product['price'] = float(product['price'])

        # Save chat history
        ChatHistory.objects.create(
            user=user, message=user_message, response=response_text, recommendations=json.dumps(recommendations))

        return Response({
            'response': response_text,
            'recommendations': json.dumps(recommendations)
        }, status=status.HTTP_200_OK)

    def generate_response_and_recommendations(self, message):
        # Fetch product data from your dataset
        products = Product.objects.all().values('id', 'name', 'category', 'description', 'price', 'stock','image_url')
        product_data = list(products)

        # Generate the prompt for Gemini API
        prompt = f"""
        You are a virtual shopping assistant for a clothing store. Based on the user's message, provide a helpful response based on the dataset below and recommend a maximum of 5 relevant products from the dataset not more than that. Make sure you start with "Recommended products:" for giving the products and give me the name of the product separated by commas. You can add your comments or tips before that.

        User's message: {message}

        Dataset:
        {product_data}

        Response:
        """

        # Send the prompt to the Gemini API
        response = genai.GenerativeModel('gemini-1.5-flash').generate_content(prompt)

        # Parse the response to extract recommendations
        response_text = response.text
        print(f"Response:{response_text}")
        # Here, you need to implement logic to parse the recommendations from the response text
        recommendations = self.parse_recommendations(response_text, product_data)

        return response_text, recommendations

    def parse_recommendations(self, response_text, product_data):
        # Implement your parsing logic here to extract product recommendations from the response text
        # For demonstration purposes, let's assume the response contains product names in a list
        recommended_product_names = response_text.split('Recommended products:')[1].strip().split(',')

        recommendations = [product for product in product_data if product['name'] in recommended_product_names]
        print(f"Reco:{recommendations}")
        return recommendations


class ChatHistoryView(APIView):
    def get(self, request):
        user = request.user  # Assuming user is authenticated
        chat_history = ChatHistory.objects.filter(user=user).order_by('timestamp')
        serializer = ChatHistorySerializer(chat_history, many=True)
        return Response(serializer.data)