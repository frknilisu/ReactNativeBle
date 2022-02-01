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

  const connect = () => {
    console.log("Device To Connect: ", myDevice.id);
    myDevice.connect()
      .then((device) => {
        console.log("Connected: ", device.isConnected());
        console.log(device);
        return device.discoverAllServicesAndCharacteristics();
      }).then((device) => {
        console.log("services: ", device.serviceUUIDs);
      }).catch((error) => {
        console.log(error.message);
      });
  };

  const connectToDevice = () => {
    console.log("Device To Connect: ", myDevice.id);
    bleManager.connectToDevice(myDevice.id)
      .then((device) => {
        console.log("Connected: ", device.isConnected());
        console.log(device);
        console.log("Discovering services and characteristics");
        return device.discoverAllServicesAndCharacteristics();
      }).then((device) => {
        console.log("services: ", device.serviceUUIDs);
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  return (
    <SafeAreaView>
      <Text style={styles.highlight}>Highlighted Text</Text>
      <Button title="Scan" onPress={() => scanDevices("MyBLEServer")} />
      <Button title="Connect" onPress={() => connectToDevice()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
  },
});

export default App;
