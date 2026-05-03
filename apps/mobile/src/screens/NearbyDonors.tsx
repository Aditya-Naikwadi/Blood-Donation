import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const NearbyDonors = () => {
  const [donors, setDonors] = useState([
    { id: '1', name: 'John Doe', bloodType: 'O-', distance: '0.8 km', lat: 37.78825, lng: -122.4324 },
    { id: '2', name: 'Jane Smith', bloodType: 'A+', distance: '1.5 km', lat: 37.78925, lng: -122.4344 },
    { id: '3', name: 'Mike Ross', bloodType: 'B-', distance: '2.3 km', lat: 37.78525, lng: -122.4304 },
  ]);

  return (
    <View className="flex-1 bg-[#0a0a0f]">
      {/* Header */}
      <View className="pt-12 pb-6 px-6 bg-[#14141e] rounded-b-3xl shadow-xl">
        <Text className="text-white text-2xl font-bold">Nearby Donors</Text>
        <Text className="text-gray-400">Finding matches within 5km</Text>
      </View>

      {/* Map */}
      <View className="h-[40%] mt-4 mx-4 rounded-3xl overflow-hidden border border-white/10">
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          customMapStyle={darkMapStyle}
        >
          {donors.map(donor => (
            <Marker
              key={donor.id}
              coordinate={{ latitude: donor.lat, longitude: donor.lng }}
              title={donor.name}
              description={donor.bloodType}
            >
              <View className="bg-red-500 px-3 py-1 rounded-full border-2 border-white">
                <Text className="text-white font-bold text-xs">{donor.bloodType}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Donor List */}
      <View className="flex-1 px-4 pt-6">
        <Text className="text-white text-lg font-bold mb-4">Available Matches</Text>
        <FlatList
          data={donors}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity className="bg-[#14141e] p-5 rounded-2xl mb-4 border border-white/5 flex-row items-center">
              <View className="w-14 h-14 bg-red-500/10 rounded-full items-center justify-center border border-red-500/20">
                <Text className="text-red-500 font-bold text-lg">{item.bloodType}</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white font-bold text-lg">{item.name}</Text>
                <Text className="text-gray-500">Distance: {item.distance}</Text>
              </View>
              <TouchableOpacity className="bg-red-500 px-6 py-2 rounded-full">
                <Text className="text-white font-bold">Request</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  // ... more styles for dark mode
];

export default NearbyDonors;
