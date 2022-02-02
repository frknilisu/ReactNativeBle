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
import base64 from 'react-native-base64';

const App = () => {
  
  const bleManager: BleManager = new BleManager();
  const [myDevice, setMyDevice] = useState<Device>();
  
  const SERVICE_UUID = "a5b1194c-0d11-e0c0-50e5-c7db856efe37";
  const CHAR_UUID= "98234604-4499-8e00-79d3-44a0c5481593";

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
                  service.characteristics().then(characteristics => {
                    characteristics.map((char, j) => {
                      console.log(char.id, char.uuid);
                    });
                  });
                });
              });
            });
      }).catch((error) => {
        console.log(error.message);
      });
  }

  const writeToDevice = (data: any) => {
    console.log("Is Connected: ", myDevice.isConnected());
    bleManager.writeCharacteristicWithResponseForDevice(
      myDevice.id, SERVICE_UUID, CHAR_UUID, base64.encode(data).toString('utf-8')
    ).then(response => {
      console.log(response);
    }).catch((error) => {
      console.log('error in writing data');
      console.log(error);
    });
  }

  return (
    <SafeAreaView>
      <Text style={styles.highlight}>Highlighted Text</Text>
      <Button title="Scan" onPress={() => scanDevices("MyBLEServer")} />
      <Button title="Connect" onPress={() => connectToDevice()} />
      <Button title="Write" onPress={() => writeToDevice("hello")} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
  },
});

export default App;
