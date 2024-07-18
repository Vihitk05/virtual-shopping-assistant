from django.urls import path
from .views import *

urlpatterns = [
    path('register/',UserRegistrationView.as_view(),name='register'),
    path('login/',UserLoginView.as_view(),name='login'),
    path('products/home/', ProductsOnHomePageView.as_view(), name='products_home'),
    path('products/', DisplayProductsView.as_view(), name='display_products'),
    path('products/search', SearchProductView.as_view(), name='search_product'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='get_product'),
    path('products/<int:pk>/related', RelatedProductsView.as_view(), name='get_related_products'),
    path('cart/add/', AddToCartView.as_view(), name='add_to_cart'),
    path('cart/', GetCartView.as_view(), name='get-cart'),
    path('cart/delete/', DeleteFromCartView.as_view(), name='delete_from_cart'),
    path('cart/checkout/', CheckOutForPaymentView.as_view(), name='checkout_payment'),
    path('user/update/', UpdateUserInformationView.as_view(), name='update_user_info'),
    path('user/view/', ViewUserInformationView.as_view(), name='view_user_info'),
]