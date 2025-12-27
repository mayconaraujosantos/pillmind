import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from '@core/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
