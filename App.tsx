/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { BleManager, Device } from 'react-native-ble-plx';

const App = () => {
  
  const [myDevice, setMyDevice] = useState<Device>(null);
  
  const bleManager = new BleManager();

  const scanDevices = (deviceName: String) => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      console.log("Scanning...");
      console.log(device.name);
      
      if (error) {
        console.log(error.message);
        return;
      }
      
      if (device.name === deviceName) {
        console.log("Device Found: ", device);
        bleManager.stopDeviceScan();
        setMyDevice(device);
        return;
      }

    });
  }

  return (
    <SafeAreaView>
      <Text style={styles.highlight}>Highlighted Text</Text>
      <Button title="Scan" onPress={()=>scanDevices("MyBLEProfile")} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
  },
});

export default App;
