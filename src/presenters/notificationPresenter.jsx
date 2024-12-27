import { observer } from "mobx-react-lite";
import { NotificationView } from "../views/notificationView";

export const Notification = observer(function Notification({ model }) {
  return (
    <NotificationView
      message={model.notificationState.message}
      isVisible={model.notificationState.isVisible}
      onClose={model.hideNotification.bind(model)}
      type={model.notificationState.type}
      action={model.notificationState.action}
      actionLabel={model.notificationState.actionLabel}
    />
  );
});
