import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const TrangCaNhan = (props) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 25, fontWeight: 'bold', color: 'black'}}>
        Trang cá nhân
      </Text>
      <TouchableOpacity onPress={()=>{
        props.navigation.goBack();
      }}>
        <Text>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TrangCaNhan;
