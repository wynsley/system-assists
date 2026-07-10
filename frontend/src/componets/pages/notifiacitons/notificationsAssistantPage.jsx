import { MyTemplate } from "../../templates/myTemplate";
import { useNotifications } from "../../../hooks/hooksAssistant/useNotifications";
import { NotificationsList } from "../../organims/notifications/assitantNotificationsList";
import { NotificationHeader } from "../../organims/notifications/assitantNotificationHeader";
import { StatsNotificationsAssistant } from "../../organims/notifications/cardsNotificationsAssitanat";


function NotificationsAssistantPage () {


  const {
    notifications, 
    unreadCount, 
    markAllRead,
    markAsRead,
    totalCount,
    todayCount
  } = useNotifications()

  return(
    <MyTemplate> 

      <NotificationHeader
        unreadCount={unreadCount}
        markAllRead={markAllRead}
      />
      <StatsNotificationsAssistant
        notifications={notifications}
        unread={unreadCount}
        today={todayCount}
        total={totalCount}
      />
      <NotificationsList
        notifications={notifications}
        markAsRead={markAsRead}
      />
    </MyTemplate>
  )
}

export {NotificationsAssistantPage}