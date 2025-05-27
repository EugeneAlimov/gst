# from django.core.management.base import BaseCommand
# from django.core.mail import send_mail
# from django.utils import timezone
# from django.conf import settings
# from main.models import Card
#
#
# class Command(BaseCommand):
#     help = 'Проверяет и отправляет напоминания'
#
#     def handle(self, *args, **options):
#         now = timezone.now()
#         self.stdout.write(f"Текущее время: {now}")
#
#         # Показать ВСЕ карточки с напоминаниями
#         all_reminders = Card.objects.filter(
#             reminder_calculated_time__isnull=False
#         ).values('id', 'name', 'reminder_calculated_time', 'is_completed', 'is_archived')
#
#         self.stdout.write(f"Все карточки с напоминаниями:")
#         for card in all_reminders:
#             self.stdout.write(
#                 f"  ID: {card['id']}, время: {card['reminder_calculated_time']}, выполнено: {card['is_completed']}")
#
#         # Найти карточки где время напоминания наступило
#         cards_to_remind = Card.objects.filter(
#             reminder_calculated_time__lte=now,
#             reminder_calculated_time__isnull=False,
#             is_completed=False,
#             is_archived=False
#         ).select_related('board').prefetch_related('assigned_users')
#
#         self.stdout.write(f"Найдено {cards_to_remind.count()} напоминаний для отправки")
#
#         test_card = Card.objects.get(id=4)
#         self.stdout.write(f"🧪 ТЕСТ: обрабатываем карточку {test_card.id}")
#         self.send_reminder(test_card)
#
#     def send_reminder(self, card):
#         try:
#             # Отправить email всем назначенным пользователям
#             for user in card.assigned_users.all():
#                 if user.email:
#                     send_mail(
#                         subject=f'Напоминание: {card.name or "Задача без названия"}',
#                         message=f'Время выполнения задачи "{card.name}" истекает в {card.date_time_finish}',
#                         from_email=settings.DEFAULT_FROM_EMAIL,
#                         recipient_list=[user.email],
#                     )
#                     self.stdout.write(f"Email отправлен {user.email}")
#
#             # Обнулить напоминание чтобы не отправлять повторно
#             card.reminder_calculated_time = None
#             card.reminder_offset_minutes = None
#             card.save()
#
#             self.stdout.write(f"Напоминание отправлено для карточки: {card.name}")
#
#         except Exception as e:
#             self.stdout.write(self.style.ERROR(f"Ошибка отправки: {e}"))

# trello/tasker/main/management/commands/send_reminders.py

from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings
from main.models import Card, ReminderLog
import logging

# Настройка логирования
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Проверяет и отправляет напоминания для карточек'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Показать что будет отправлено, но не отправлять на самом деле',
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Подробные логи',
        )

    def handle(self, *args, **options):
        """Основной метод команды"""
        self.dry_run = options.get('dry_run', False)
        self.verbose = options.get('verbose', False)

        now = timezone.now()

        if self.verbose:
            self.stdout.write(f"🕒 Текущее время: {now}")
            self.stdout.write(f"🔧 Режим dry-run: {self.dry_run}")

        # Показать статистику всех напоминаний
        self.show_reminders_stats()

        # Найти карточки где время напоминания наступило
        cards_to_remind = self.get_cards_to_remind(now)

        if not cards_to_remind:
            self.stdout.write(self.style.SUCCESS("✅ Нет напоминаний для отправки"))
            return

        # Обработать найденные карточки
        success_count = 0
        error_count = 0

        cards_list = list(cards_to_remind)
        self.stdout.write(f"📨 Обрабатываем {len(cards_list)} напоминаний")

        for card in cards_list:
            try:
                if self.send_reminder(card):
                    success_count += 1
                else:
                    error_count += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"❌ Критическая ошибка при обработке карточки {card.id}: {e}")
                )
                error_count += 1
                logger.error(f"Error processing card {card.id}: {e}", exc_info=True)

        # Финальная статистика
        self.stdout.write("\n" + "=" * 50)
        self.stdout.write(f"📊 Итоговая статистика:")
        self.stdout.write(f"   ✅ Успешно отправлено: {success_count}")
        self.stdout.write(f"   ❌ Ошибок: {error_count}")
        self.stdout.write(f"   📋 Всего обработано: {len(cards_list)}")

        if error_count == 0:
            self.stdout.write(self.style.SUCCESS("🎉 Все напоминания отправлены успешно!"))
        else:
            self.stdout.write(self.style.WARNING(f"⚠️  Завершено с {error_count} ошибками"))

    def show_reminders_stats(self):
        """Показать статистику всех напоминаний"""
        if not self.verbose:
            return

        all_reminders = Card.objects.filter(
            reminder_calculated_time__isnull=False
        ).values('id', 'name', 'reminder_calculated_time', 'is_completed', 'is_archived')

        self.stdout.write(f"\n📋 Все карточки с напоминаниями ({all_reminders.count()}):")

        if not all_reminders:
            self.stdout.write("   (нет карточек с напоминаниями)")
            return

        for card in all_reminders:
            status = "✅" if not card['is_completed'] else "✔️ выполнено"
            if card['is_archived']:
                status = "📦 архив"

            self.stdout.write(
                f"   ID: {card['id']}, "
                f"время: {card['reminder_calculated_time']}, "
                f"статус: {status}, "
                f"название: '{card['name'] or 'без названия'}'"
            )

    def get_cards_to_remind(self, now):
        """Получить карточки для отправки напоминаний"""
        cards_to_remind = Card.objects.filter(
            reminder_calculated_time__lte=now,
            reminder_calculated_time__isnull=False,
            is_completed=False,
            is_archived=False
        ).select_related('board').prefetch_related('assigned_users')

        count = cards_to_remind.count()
        self.stdout.write(f"🔍 Найдено {count} напоминаний для отправки")

        return cards_to_remind

    def send_reminder(self, card):
        """
        Отправить напоминание для конкретной карточки

        Returns:
            bool: True если успешно, False если были ошибки
        """
        self.stdout.write(f"\n🔄 Обрабатываем карточку ID: {card.id}")

        if self.verbose:
            self.stdout.write(f"   📝 Название: '{card.name or 'без названия'}'")
            self.stdout.write(f"   📅 Срок завершения: {card.date_time_finish}")
            self.stdout.write(f"   ⏰ Время напоминания: {card.reminder_calculated_time}")

        try:
            # Проверить есть ли назначенные пользователи
            users = card.assigned_users.all()

            if not users.exists():
                self.stdout.write(f"   ⚠️  Нет назначенных пользователей для карточки {card.id}")
                # Всё равно обнуляем напоминание
                self.clear_reminder(card)
                return True

            # Отправить email всем назначенным пользователям
            emails_sent = 0
            emails_failed = 0

            for user in users:
                if self.verbose:
                    self.stdout.write(f"   👤 Пользователь: {user.username}, email: {user.email or 'не указан'}")

                if user.email:
                    try:
                        if self.send_email_to_user(card, user):
                            emails_sent += 1
                        else:
                            emails_failed += 1
                    except Exception as e:
                        self.stdout.write(f"   ❌ Ошибка отправки email {user.email}: {e}")
                        emails_failed += 1
                        logger.error(f"Email sending error for user {user.id}: {e}")
                else:
                    self.stdout.write(f"   ⚠️  У пользователя {user.username} не указан email")

            # Статистика отправки
            self.stdout.write(f"   📊 Email отправлено: {emails_sent}, ошибок: {emails_failed}")

            # Обнулить напоминание чтобы не отправлять повторно
            if not self.dry_run:
                self.clear_reminder(card)
                self.stdout.write(f"   🧹 Напоминание обнулено")
            else:
                self.stdout.write(f"   🧹 Напоминание будет обнулено (dry-run режим)")

            self.stdout.write(f"   ✅ Карточка {card.id} обработана успешно")
            return True

        except Exception as e:
            self.stdout.write(f"   ❌ Ошибка обработки карточки {card.id}: {e}")
            logger.error(f"Error processing card {card.id}: {e}", exc_info=True)
            return False

    def send_email_to_user(self, card, user):
        """
        Отправить email конкретному пользователю

        Returns:
            bool: True если успешно отправлено
        """
        if self.dry_run:
            self.stdout.write(f"   📧 [DRY-RUN] Email был бы отправлен {user.email}")
            return True

        try:
            # Подготовить данные для email
            card_name = card.name or "Задача без названия"
            board_name = card.board.name if card.board else "Неизвестная доска"

            # Форматирование времени
            if card.date_time_finish:
                finish_time = card.date_time_finish.strftime("%d.%m.%Y в %H:%M")
            else:
                finish_time = "не указано"

            # Тема письма
            subject = f"⏰ Напоминание: {card_name}"

            # Текст письма
            message = f"""
Здравствуйте, {user.first_name or user.username}!

Это напоминание о задаче, которая требует вашего внимания:

📋 Задача: {card_name}
🏢 Доска: {board_name}
⏰ Срок выполнения: {finish_time}

Пожалуйста, проверьте статус выполнения задачи.

---
Система управления задачами
"""

            # HTML версия письма (опционально)
            html_message = f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #007bff;">⏰ Напоминание о задаче</h2>

    <p>Здравствуйте, <strong>{user.first_name or user.username}</strong>!</p>

    <p>Это напоминание о задаче, которая требует вашего внимания:</p>

    <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
        <p><strong>📋 Задача:</strong> {card_name}</p>
        <p><strong>🏢 Доска:</strong> {board_name}</p>
        <p><strong>⏰ Срок выполнения:</strong> {finish_time}</p>
    </div>

    <p>Пожалуйста, проверьте статус выполнения задачи.</p>

    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
    <p style="color: #666; font-size: 12px;">Система управления задачами</p>
</body>
</html>
"""

            # Отправить email
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@company.com'),
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )

            self.stdout.write(f"   📧 Email отправлен {user.email}")
            logger.info(f"Reminder email sent to {user.email} for card {card.id}")
            return True

        except Exception as e:
            self.stdout.write(f"   ❌ Ошибка отправки email {user.email}: {e}")
            logger.error(f"Failed to send email to {user.email}: {e}")
            return False

    def clear_reminder(self, card):
        """Обнулить напоминание у карточки"""
        try:
            card.reminder_calculated_time = None
            card.reminder_offset_minutes = None
            card.save()


            if self.verbose:
                self.stdout.write(f"   🧹 Напоминание для карточки {card.id} обнулено")

        except Exception as e:
            self.stdout.write(f"   ❌ Ошибка обнуления напоминания для карточки {card.id}: {e}")
            logger.error(f"Failed to clear reminder for card {card.id}: {e}")
            raise