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
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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

import { BleManager, Characteristic, Device } from 'react-native-ble-plx';
import base64 from 'react-native-base64';

const App = () => {
  
  const bleManager: BleManager = new BleManager();
  const [myDevice, setMyDevice] = useState<Device>();
  const [notifChar, setNotifChar] = useState<Characteristic>();
  const [writeMsg, setWriteMessage] = useState<String>("");
  const [readMsg, setReadMessage] = useState<String>("");
  
  const SERVICE_UUID = "a5b1194c-0d11-e0c0-50e5-c7db856efe37";
  const CHAR_UUID= "98234604-4499-8e00-79d3-44a0c5481593";

  async function requestPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permission Localisation Bluetooth',
          message: 'Requirement for Bluetooth',
          buttonNeutral: 'Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission for bluetooth scanning granted');
        return true;
      } else if(granted === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Location permission for bluetooth scanning denied');
        return false;
      } else{
        console.log('Location permission for bluetooth scanning revoked');
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  const scanDevices = async (deviceName: String) => {
    const permission = await requestPermission();
    if (permission) {}
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
    console.log("Device To Connect: ", myDevice?.id);
    bleManager.connectToDevice(myDevice?.id, {autoConnect: true})
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

  const writeToDevice = (data: String) => {
    console.log("Is Connected: ", myDevice?.isConnected());
    bleManager.writeCharacteristicWithResponseForDevice(
      myDevice?.id, SERVICE_UUID, CHAR_UUID, base64.encode(data).toString('utf-8')
    ).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log('Error in writing data: ', error);
    });
  }

  const readFromDevice = () => {
    console.log("Is Connected: ", myDevice?.isConnected());
    bleManager.readCharacteristicForDevice(
      myDevice?.id, SERVICE_UUID, CHAR_UUID
    ).then((char) => {
      const decodedValue = base64.decode(char?.value);
      console.log(decodedValue);
      setReadMessage(String(decodedValue));
    }).catch((error) => {
      console.log('Error in reading data: ', error);
    });
  }

  const subscribeToDevice = () => {
    console.log("Is Connected: ", myDevice?.isConnected());
    bleManager.monitorCharacteristicForDevice(myDevice?.id, SERVICE_UUID, CHAR_UUID, (error, characteristic) => {
      console.log("Monitoring...");

      if (error) {
        console.log(error.message);
        return;
      }

      //console.log(characteristic?.uuid);
      //console.log(characteristic?.value);
      const decodedValue = base64.decode(characteristic?.value);
      console.log(decodedValue);
      setNotifChar(characteristic);
    });
  }

  const disconnectDevice = () => {
    bleManager.cancelDeviceConnection(myDevice?.id)
      .then((results) => {
        console.log("Disconnect device: ", results);
      }).catch((error) => {
        console.log("Error in disconnecting device: ", error);
      });
  };

  const checkConnection = () => {
    bleManager.isDeviceConnected(myDevice?.id)
      .then((results) => {
        console.log("Connection check: ", results);
      }).catch((error) => {
        console.log("Error in connection check: ", error);
      });
  };

  return (
    <SafeAreaView>
      <Button title="Scan" onPress={() => scanDevices("MyBLEServer")} />
      <Button title="Connect" onPress={() => connectToDevice()} />
      <Button title="Write" onPress={() => writeToDevice(writeMsg)} />
      <Button title="Read" onPress={() => readFromDevice()} />
      <Button title="Subscribe" onPress={() => subscribeToDevice()} />
      <Button title="Disconnect" onPress={() => disconnectDevice()}></Button>
      <Button title="Check Connection" onPress={() => checkConnection()}></Button>
      <Text style={{fontSize: 30}}>Write Msg: {writeMsg}</Text>
      <Text style={{fontSize: 30}}>Read Msg: {readMsg}</Text>
      <Text style={{fontSize: 30}}>Notif Msg: {base64.decode(String(notifChar?.value))}</Text>
      <TextInput style={styles.input} onChangeText={(value) => setWriteMessage(value)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#dddddd',
    margin: 10
  },
  buttonGreen: {
    display: "flex",
    height: 40,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    margin: 12,
    flex: 1,
    alignItems: "center"
  },
  container2: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 30, 
    backgroundColor: '#fff' 
  }
});

export default App;
