import { Logo } from '../../assets'
import * as React from 'react';
import { useEffect } from 'react';
import { PrimaryButton} from '../../components';
import CApi from '../../lib/CApi';
import {  useDispatch } from 'react-redux'
import { 
  View, 
  Text, 
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  LogBox 
} from 'react-native';

import{
  setUserId,
  setUserFullName,
  setUserName
} from '../../store/reducer/userSlice'

function LoginScreen({navigation,props}) {
  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
}, [])
  const [isLoading, setLoading]= React.useState(false);
  const [username, setUsername]= React.useState(null);
  const [password, setPassword]= React.useState(null);
  const dispatch = useDispatch()
const onhandleLoginButton = async ()=>{
  setLoading(true)
  try{
      const body = {
        "dataSource":"Cluster0",
        "database":"puppet_uas",
        "collection":"users",
        "filter": {
            "username":username,
            "password":password
        }
      }

      const {data} = await CApi.post('/action/find',body)
      setLoading(false)
      if(data){
        if(data.documents.length > 0){
          dispatch(setUserId(data.documents[0]._id))
          dispatch(setUserFullName(data.documents[0].fullName))
          dispatch(setUserName(data.documents[0].username))

          navigation.navigate('Home')
        }else{
          alert('username dan password tidak ditemukan')
        }
      }
    }catch(err){
      setLoading(false)
      console.error(err)
    }
}

return (
  <SafeAreaView style={{flex:1}}>
    <ScrollView>
      <View style={{ flex: 1,margin:20}}>
        <Image source={Logo} style={{ width: 300,height: 130,resizeMode: 'contain'}} />
        <Text style={style.bodyText}></Text>
        
          <TextInput
            style={ {backgroundColor:'#ffffff',marginTop:20}}
            value={username}
            onChangeText={(val)=>setUsername(val)}
            placeholder="Phone Number, Email or Username"
          />

          <TextInput
            value={password}
            onChangeText={(val)=>setPassword(val)}
            style={{backgroundColor:'#ffffff',marginTop:10}}
            placeholder="Password"
            secureTextEntry={true}
          />

       
       
          <PrimaryButton 
          title="Login"
          onPress={onhandleLoginButton}
          />
   
          <TouchableOpacity>
           <Text style={[style.bodyText,{marginTop:20,color:'#ffffff'}]}>
          Forgot your password?
          <Text style={{color: '#1e95fc'}}>
            Click Here
          </Text>
        </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>

  </SafeAreaView>
);
}

const style = StyleSheet.create({
  bodyText:{
    textAlign: 'center',
    fontSize:16,
    color:'#6E6E6E'
  },


 
})

export default LoginScreen;
