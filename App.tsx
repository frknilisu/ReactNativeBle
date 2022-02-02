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
  LogBox,
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

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

import { BleManager, Device } from 'react-native-ble-plx';

const App = () => {
  
  const bleManager: BleManager = new BleManager();
  const [myDevice, setMyDevice] = useState<Device>();
  

  const scanDevices = (deviceName: String) => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      console.log("Scanning...");

      if (error) {
        console.log(error.message);
        return;
      }

      if(device) {
        console.log("Device Name: ", device.name);
      
        if (device.name === deviceName) {
          console.log("Device Found: ", device);
          bleManager.stopDeviceScan();
          setMyDevice(device);
          return;
        }
      }
    });
  }

  const connectToDevice = () => {
    console.log("Device To Connect: ", myDevice.id);
    bleManager.connectToDevice(myDevice.id)
      .then((device) => {
        console.log("Connected: ", device.isConnected());
        console.log(device);
        console.log("Discovering services and characteristics");
        bleManager.discoverAllServicesAndCharacteristicsForDevice(device.id)
          .then((results) => { 
            console.log(results);
            bleManager.servicesForDevice(device.id)
              .then((services) => {
                console.log("Services: ", services);
                console.log(services.length);
                services.map((service, i) => {
                  console.log(service.id, service.uuid);
                });
              });
            });
      }).catch((error) => {
        console.log(error.message);
      });
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
