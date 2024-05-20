import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import RootComponent from './src/routers/index';
import firestore from '@react-native-firebase/firestore';
import Setting from './src/views/Admin/Settings'

const App = () => {

  return (
    <RootComponent />
  );
};

export default App;


