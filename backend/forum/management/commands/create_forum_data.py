from django.core.management.base import BaseCommand
from forum.models import ForumCategory, Thread, Reply
from users.models import User
import random
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'إنشاء بيانات تجريبية للمنتدى'
    
    def handle(self, *args, **kwargs):
        # 1. التأكد من وجود مستخدمين كافيين أولاً
        self.ensure_minimum_users(3)
        users = list(User.objects.all())
        
        # 2. إنشاء فئات المنتدى
        categories = self.create_forum_categories()
        
        # 3. إنشاء المواضيع والردود
        self.create_threads_and_replies(users, categories)
    
    def ensure_minimum_users(self, min_users=3):
        """التأكد من وجود عدد كافٍ من المستخدمين"""
        current_count = User.objects.count()
        
        if current_count < min_users:
            self.stdout.write(f'إنشاء {min_users - current_count} مستخدمين إضافيين...')
            
            # أسماء مستخدمين افتراضية
            default_users = [
                {'username': 'ahmed', 'email': 'ahmed@example.com'},
                {'username': 'sara', 'email': 'sara@example.com'},
                {'username': 'ali', 'email': 'ali@example.com'},
                {'username': 'mohammed', 'email': 'mohammed@example.com'},
                {'username': 'fatima', 'email': 'fatima@example.com'},
            ]
            
            for i in range(min_users - current_count):
                user_data = default_users[i % len(default_users)]
                # تجنب تكرار أسماء المستخدمين
                username = f"{user_data['username']}{i if i > 0 else ''}"
                email = f"{i+1}_{user_data['email']}" if i > 0 else user_data['email']
                
                User.objects.get_or_create(
                    username=username,
                    defaults={'email': email, 'password': 'test1234'}
                )
            
            self.stdout.write(self.style.SUCCESS(f'الآن يوجد {User.objects.count()} مستخدمين'))
    
    def create_forum_categories(self):
        """إنشاء فئات المنتدى"""
        categories_data = [
            {'name': 'عام', 'description': 'مناقشات عامة حول الأمن السيبراني', 'icon': '🌐'},
            {'name': 'المعامل', 'description': 'مناقشات حول المعامل التفاعلية', 'icon': '💻'},
            {'name': 'الأسئلة', 'description': 'اطرح أسئلتك واحصل على إجابات', 'icon': '❓'},
            {'name': 'المشاريع', 'description': 'شارك مشاريعك وحصل على تعليقات', 'icon': '🚀'},
            {'name': 'الأدوات', 'description': 'مناقشات حول أدوات الأمن السيبراني', 'icon': '🛠️'},
        ]
        
        categories = []
        for i, cat_data in enumerate(categories_data):
            category, created = ForumCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'description': cat_data['description'],
                    'icon': cat_data['icon'],
                    'order': i
                }
            )
            categories.append(category)
        
        self.stdout.write(self.style.SUCCESS(f'تم إنشاء/التحقق من {len(categories)} فئة للمنتدى'))
        return categories
    
    def create_threads_and_replies(self, users, categories):
        """إنشاء المواضيع والردود"""
        thread_data = [
            {'title': 'كيف أبدأ في تعلم الأمن السيبراني؟', 'content': 'أريد نصائح للمبتدئين في مجال الأمن السيبراني، من أين أبدأ وما هي الخطوات؟'},
            {'title': 'أفضل دورات الأمن السيبراني للمبتدئين', 'content': 'ما هي أفضل الدورات والمواقع لتعلم الأمن السيبراني بشكل عملي؟'},
            {'title': 'مشكلة في معمل SQL Injection', 'content': 'واجهت مشكلة في الخطوة الثالثة من معمل SQL Injection، هل يمكن مساعدتي؟'},
            {'title': 'ما هي أفضل أدوات اختبار الاختراق؟', 'content': 'ما هي الأدوات التي تنصحون بها لاختبار اختراق المواقع والتطبيقات؟'},
            {'title': 'كيف أحمي موقعي من هجمات XSS؟', 'content': 'لدي موقع إلكتروني وأريد حمايته من هجمات XSS، ما هي أفضل الممارسات؟'},
        ]
        
        threads_created = 0
        replies_created = 0
        
        for i, data in enumerate(thread_data):
            category = random.choice(categories)
            author = random.choice(users)
            
            # إنشاء الموضوع
            thread = Thread.objects.create(
                title=data['title'],
                content=data['content'],
                category=category,
                author=author,
                views=random.randint(50, 500),
                likes=random.randint(10, 100),
                is_sticky=(i < 2),  # أول موضوعين يكونان مثبتين
                created_at=datetime.now() - timedelta(days=random.randint(1, 30))
            )
            threads_created += 1
            
            # إنشاء ردود للموضوع
            num_replies = random.randint(2, 6)
            for j in range(num_replies):
                # اختيار مؤلف مختلف للرد إن أمكن
                other_users = [u for u in users if u != author]
                reply_author = random.choice(other_users) if other_users else author
                
                reply_content = self.generate_reply_content(j+1, data['title'])
                
                Reply.objects.create(
                    thread=thread,
                    author=reply_author,
                    content=reply_content,
                    likes=random.randint(0, 30),
                    is_solution=(j == 0 and random.choice([True, False])),
                    created_at=thread.created_at + timedelta(hours=random.randint(1, 72))
                )
                replies_created += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'✅ تم إنشاء {threads_created} موضوع و {replies_created} رد'
        ))
    
    def generate_reply_content(self, reply_num, thread_title):
        """إنشاء محتوى عشوائي للرد"""
        replies_templates = [
            f"رد #{reply_num} على موضوع '{thread_title}'\n\nهذه إجابة مفيدة تحتوي على نصائح عملية.",
            f"أهلاً، فيما يلي مساعدتي بخصوص '{thread_title}':\n\n• خطوة 1: قم بكذا\n• خطوة 2: ثم كذا\n• خطوة 3: أخيراً كذا",
            f"رد #{reply_num}\n\nلقد واجهت نفس المشكلة سابقاً. الحل هو التركيز على الأساسيات أولاً.",
        ]
        return random.choice(replies_templates)