import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* MAP */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 26.8467,
          longitude: 80.9462,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* USER LOCATION */}
        <Marker
          coordinate={{ latitude: 26.8467, longitude: 80.9462 }}
          title="User Location"
        />

        {/* HOSPITAL */}
        <Marker
          coordinate={{ latitude: 26.8567, longitude: 80.9562 }}
          title="Apollo Hospital"
        />
      </MapView>

      {/* TOP INFO CARD */}
      <View
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          right: 20,
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 12,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          🗺 Emergency Map
        </Text>

        <Text style={{ marginTop: 5, color: 'gray' }}>
          Showing nearest hospital assigned to user
        </Text>
      </View>

      {/* BOTTOM INFO CARD */}
      <View
        style={{
          position: 'absolute',
          bottom: 80,
          left: 20,
          right: 20,
          backgroundColor: '#f1f5f9',
          padding: 15,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontWeight: '600' }}>
          🏥 Assigned Hospital: Apollo Hospital
        </Text>

        <Text style={{ marginTop: 5 }}>
          📍 Distance: 2.4 km
        </Text>

        <Text style={{ marginTop: 5 }}>
          ⏱ ETA: 7 minutes
        </Text>
      </View>
    </View>
  );
}