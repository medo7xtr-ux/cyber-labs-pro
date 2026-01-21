# labs/management/commands/create_sample_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from labs.models import Lab, Challenge
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'إنشاء بيانات تجريبية للمعامل والتحديات'

    def handle(self, *args, **kwargs):
        # إنشاء مستخدم تجريبي إذا لم يكن موجوداً
        user, created = User.objects.get_or_create(
            username='trainee',
            defaults={
                'email': 'trainee@cyberlabs.com',
                'first_name': 'متدرب',
                'last_name': 'أمن سيبراني'
            }
        )
        if created:
            user.set_password('password123')
            user.save()
            self.stdout.write(self.style.SUCCESS('✅ تم إنشاء المستخدم التجريبي'))

        # بيانات المعامل
        labs_data = [
            {
                'title': 'معمل أمن تطبيقات الويب',
                'description': 'تعلم كيفية اكتشاف وحماية تطبيقات الويب من الهجمات الشائعة مثل SQL Injection و XSS',
                'overview': 'سيتعلم المتدرب في هذا المعمل أساسيات أمن تطبيقات الويب والتقنيات المستخدمة لحمايتها',
                'category': 'web_security',
                'difficulty': 'beginner',
                'points': 100,
                'estimated_time': 60,
                'is_premium': False,
                'is_active': True,
            },
            {
                'title': 'تحليل البرمجيات الخبيثة',
                'description': 'تعلم تحليل البرمجيات الضارة وفهم سلوكها وآليات انتشارها',
                'overview': 'تحليل عملي للبرمجيات الخبيثة باستخدام أدوات التحليل الثابت والديناميكي',
                'category': 'malware_analysis',
                'difficulty': 'intermediate',
                'points': 200,
                'estimated_time': 90,
                'is_premium': False,
                'is_active': True,
            },
            {
                'title': 'تشفير البيانات',
                'description': 'فهم أساسيات التشفير والخوارزميات المستخدمة في حماية البيانات',
                'overview': 'تطبيق عملي لخوارزميات التشفير المتماثل وغير المتماثل',
                'category': 'cryptography',
                'difficulty': 'advanced',
                'points': 300,
                'estimated_time': 120,
                'is_premium': True,
                'is_active': True,
            },
            {
                'title': 'أمن الشبكات',
                'description': 'تعلم أساسيات أمن الشبكات وتقنيات الحماية من الهجمات الشبكية',
                'overview': 'تحليل حركة الشبكة واكتشاف الثغرات الأمنية',
                'category': 'network_security',
                'difficulty': 'intermediate',
                'points': 250,
                'estimated_time': 80,
                'is_premium': False,
                'is_active': True,
            },
        ]

        created_labs = []
        for i, lab_data in enumerate(labs_data):
            # إنشاء slug فريد
            slug = f"lab-{i+1}-{lab_data['title'].replace(' ', '-').lower()}"
            
            lab, created = Lab.objects.update_or_create(
                title=lab_data['title'],
                defaults={
                    **lab_data,
                    'slug': slug,
                    'views': random.randint(50, 500),
                    'completions': random.randint(10, 100),
                    'average_score': random.uniform(60, 95),
                }
            )
            if created:
                created_labs.append(lab)
                self.stdout.write(self.style.SUCCESS(f'✅ تم إنشاء معمل: {lab.title}'))

        # إنشاء تحديات لكل معمل
        challenge_templates = [
            {
                'title': 'التحدي الأول: الاكتشاف',
                'description': 'اكتشف الثغرة الأساسية في النظام',
                'challenge_type': 'multiple_choice',
                'answer_type': 'text',
                'level': 'easy',
                'points': 30,
                'order': 1,
                'correct_answer': 'الجواب الصحيح الأول',
            },
            {
                'title': 'التحدي الثاني: التحليل',
                'description': 'حلل الشيفرة المصدرية واكتشف نقطة الضعف',
                'challenge_type': 'code',
                'answer_type': 'code',
                'level': 'medium',
                'points': 50,
                'order': 2,
                'correct_answer': 'print("Hello World")',
            },
            {
                'title': 'التحدي الثالث: الاستغلال',
                'description': 'استغل الثغرة للوصول إلى النظام',
                'challenge_type': 'practical',
                'answer_type': 'text',
                'level': 'hard',
                'points': 70,
                'order': 3,
                'correct_answer': 'استغلال ناجح',
            },
        ]

        for lab in created_labs:
            for i, template in enumerate(challenge_templates):
                Challenge.objects.update_or_create(
                    lab=lab,
                    title=f"{template['title']} - {lab.title}",
                    defaults={
                        **template,
                        'order': template['order'],
                        'hint': 'تلميح: اقرأ التعليمات بعناية',
                        'solution_hint': 'تلميح الحل: حاول استخدام الأداة المناسبة',
                        'attempts': random.randint(20, 200),
                        'success_rate': random.uniform(40, 90),
                    }
                )
            self.stdout.write(self.style.SUCCESS(f'✅ تم إنشاء تحديات لمعمل: {lab.title}'))

        self.stdout.write(self.style.SUCCESS(f'🎉 تم إنشاء {len(created_labs)} معمل بنجاح!'))