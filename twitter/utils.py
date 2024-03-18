from django.utils import timezone

def get_timestamp_difference(timestamp):
    try:
        time_difference = timezone.now() - timestamp
        days = time_difference.days
        hours, remainder = divmod(time_difference.seconds, 3600)
        minutes, _ = divmod(remainder, 60)

        if days > 0:
            return f"{days}d ago"
        elif hours > 0:
            return f"{hours}h ago"
        elif minutes > 0:
            return f"{minutes}m ago"
        # elif seconds > 0:
        #     return f"{seconds}s ago"
        else:
            return "Just now"
    except:
        return None