import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import notifee from '@notifee/react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

import {
  getFcmToken,
  notificationListener,
} from './src/services/notificationService';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const fetchToken = async () => {
      // Request permissions (required for iOS)
      await notifee.requestPermission();
      const token = await getFcmToken();
      if (token) {
        console.log('Your Firebase Token is:', token);
      }
    };

    void fetchToken();
    void notificationListener();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
