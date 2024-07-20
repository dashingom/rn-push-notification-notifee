import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

export async function requestUserPermission() {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus) {
    const enabled =
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authorizationStatus);
    }
  }
}

export async function getFcmToken() {
  try {
    const fcmToken = await messaging().getToken();
    return fcmToken;
  } catch (error: any) {
    console.log('Error getting FCM token:', error);
  }
}

export async function displayNotification(data: any) {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default4',
    name: 'Default Channel4',
  });

  const customNotification: any = {
    title: `<p style="color: #1B1C17;"><b>${data.notification.title}</p>`,
    body: `<p style="color: #45483C;">${data.notification.body}</p>`,
    android: {
      channelId,
      largeIcon: data.notification.android.imageUrl,
      actions: [
        {
          title: '<p style="color: #4C6707;"><b>View</b></p>',
          pressAction: {
            id: 'view',
          },
        },
        {
          title: '<p style="color: #4C6707;"><b>Share</b></p>',
          pressAction: {
            id: 'share',
          },
        },
      ],
    },
  };

  notifee.displayNotification(customNotification);
}

export const notificationListener = async () => {
  await messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    displayNotification(remoteMessage);
  });
  await messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );
  });
  await messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
      }
    });
};
