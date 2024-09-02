from django.utils import timezone
from django.core.paginator import Paginator

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

def paginate(page_num, objects, per_page):
    paginator = Paginator(objects, per_page)
    result = paginator.get_page(page_num)
    has_next = result.has_next()
    if has_next:
        next_page_no = result.next_page_number()
    else:
        next_page_no = None

    return has_next, next_page_no, result


def create_image_url(img):
    return f'http://localhost:8000/media/{img}'