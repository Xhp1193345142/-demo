from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="external_customer_id",
        ),
        migrations.RemoveField(
            model_name="user",
            name="membership_expires_at",
        ),
        migrations.RemoveField(
            model_name="user",
            name="membership_tier",
        ),
        migrations.RemoveField(
            model_name="user",
            name="role",
        ),
        migrations.RunSQL(
            sql="""
            DROP TABLE IF EXISTS billing_paymentrecord CASCADE;
            DROP TABLE IF EXISTS billing_subscription CASCADE;
            DROP TABLE IF EXISTS billing_membershipplan CASCADE;
            DROP TABLE IF EXISTS content_article CASCADE;
            DROP TABLE IF EXISTS content_category CASCADE;
            DELETE FROM auth_permission
            WHERE content_type_id IN (
                SELECT id FROM django_content_type WHERE app_label IN ('billing', 'content')
            );
            DELETE FROM django_content_type WHERE app_label IN ('billing', 'content');
            DELETE FROM django_migrations WHERE app IN ('billing', 'content');
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
