import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pairedList: pairedlist;
  listToggle: boolean = false;
  pairedDeviceID: number = 0;


  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private bluetoothSerial: BluetoothSerial, private toastCtrl: ToastController) {
    this.checkBluetoothEnabled();
  }

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
      this.showError("please enable Bluetooth")
    });
  }


  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      this.showError("please Enable Bluetooth")
      this.listToggle = false;
    });
  }

  selectDevice() {
    let connectedDevice = this.pairedList[this.pairedDeviceID];
    this.showToast("trying to connecting to "+connectedDevice.name)
    if (!connectedDevice.address) {
      this.showError('select Device to connect');
      return;
    }
    let address = connectedDevice.address;
    //let name = connectedDevice.name;

    this.connect(address);
  }

  connect(address) {

    this.bluetoothSerial.connect(address).subscribe(success => {
      this.deviceConnected();
      this.showToast("connected successfullly");
    }, error => {
      this.showError("error while connecting to device");
    });
  }

  deviceConnected() {

    this.bluetoothSerial.subscribe('\n').subscribe(success => {
      this.showToast(success);
      this.showToast("connected successfullly");
    }, error => {
      this.showError(error);
    });
  }


  sendData( data:String ) {

    this.showToast("sending "+ data);

    this.bluetoothSerial.write(data).then(success => {
      this.showToast(success);
    }, error => {
      this.showError(error)
    });
  }

  disconnect(){
    this.bluetoothSerial.disconnect().then(isSuccess=>{
      this.showToast("Disconnected ");
    },error=>{
      this.showToast(" Something went wrong !");
    });
  }
  clear(){
    this.sendData("clear");
  }
  humidityLevel(){
    this.sendData("level");
  }
  Humidite(){
    this.sendData("HUM");
  }
  Temperature(){
    
    this.sendData("TEMP");
  }
  Luminosite(){
    this.sendData("LUM");
  }
  showError(error) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showToast(msj) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    toast.present();

  }

}

interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}
