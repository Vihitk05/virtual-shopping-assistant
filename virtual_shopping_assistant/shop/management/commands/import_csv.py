import csv 
from django.core.management.base import BaseCommand, CommandParser
from shop.models import Product,Category

class Command(BaseCommand):
    help = 'Import Data from CSV file into Product model'

    def add_arguments(self, parser):
        parser.add_argument('csv_file',type=str,help='The path to the CSV file')
    
    def handle(self,*args,**kwargs):
        csv_file = kwargs['csv_file']
        with open(csv_file,newline='',encoding='latin-1') as file:
            reader = csv.DictReader(file)
            items = []
            for row in reader:
                category_name = row['category']
                category,created = Category.objects.get_or_create(name=category_name)
                item = Product(
                    name=row['name'],
                    price=row['price'].replace(',',''),
                    category=category,
                    description=row['description'],
                    stock=row['stock'],
                    image_url=row['image_url']
                )
                items.append(item)
            Product.objects.bulk_create(items)
            self.stdout.write(self.style.SUCCESS('Data Imported Sucessfully'))