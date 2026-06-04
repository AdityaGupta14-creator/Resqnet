import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

export default function MapScreen() {
  const [selectedHospital, setSelectedHospital] = useState({
    name: 'Apollo Hospital',
    lat: 26.8567,
    lon: 80.9562,
    distance: '2.4 km',
    eta: '7 mins',
    beds: '4 Available',
    phone: '+91 522 6789000',
    type: 'Trauma & General Medicine',
    status: 'Ready',
  });

  const hospitalsList = [
    {
      name: 'Apollo Hospital',
      lat: 26.8567,
      lon: 80.9562,
      distance: '2.4 km',
      eta: '7 mins',
      beds: '4 Available',
      phone: '+91 522 6789000',
      type: 'Trauma & General Medicine',
      status: 'Ready',
    },
    {
      name: 'Sahara Hospital',
      lat: 26.8624,
      lon: 80.9815,
      distance: '4.8 km',
      eta: '12 mins',
      beds: '9 Available',
      phone: '+91 522 6781000',
      type: 'Multi-Specialty & Cardiac',
      status: 'Active',
    },
    {
      name: 'KGMU Trauma Centre',
      lat: 26.8698,
      lon: 80.9152,
      distance: '6.1 km',
      eta: '15 mins',
      beds: '12 Available',
      phone: '+91 522 2257540',
      type: 'Level 1 Trauma Care',
      status: 'High Load',
    },
  ];

  const handleHospitalChange = (hospital: typeof hospitalsList[0]) => {
    setSelectedHospital(hospital);
  };

  const mapUrl = `https://maps.google.com/maps?q=${selectedHospital.lat},${selectedHospital.lon}&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <View style={styles.container}>
      {/* CSS Injection for Animations and custom styling */}
      <div style={{ display: 'none' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 0.9; }
            100% { transform: scale(0.9); opacity: 0.6; }
          }
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-pulse-slow {
            animation: pulse 2s infinite ease-in-out;
          }
          .glass-panel {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
          }
          .map-container {
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .pulse-dot {
            width: 12px;
            height: 12px;
            background-color: #ef4444;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4);
            animation: pulse 1.5s infinite;
          }
        `}} />
      </div>

      {/* EMERGENCY HUD HEADER */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <div className="pulse-dot" />
          <Text style={styles.headerTitle}>RESQNET LIVE TRACKER</Text>
        </View>
        <Text style={styles.headerSub}>Real-Time Emergency Routing Panel</Text>
      </View>

      <View style={styles.mainLayout}>
        {/* MAP CONTAINER */}
        <View style={[styles.mapWrapper, { flex: 2 }]}>
          <div className="map-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <iframe
              title="Google Map Embed"
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
            />
            {/* FLOATING QUICK STATS */}
            <div className="glass-panel" style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              padding: '16px',
              borderRadius: '12px',
              maxWidth: '300px',
              pointerEvents: 'auto',
            }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#ef4444', marginBottom: 4 }}>
                📡 LIVE PATIENT GPS
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1e293b' }}>
                Lucknow, India (26.8467° N, 80.9462° E)
              </Text>
              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                Accuracy: High (~4 meters)
              </Text>
            </div>
          </div>
        </View>

        {/* DETAILS SIDEBAR */}
        <View style={styles.sidebar}>
          <ScrollView contentContainerStyle={styles.sidebarContent}>
            {/* CURRENT ROUTE INFO */}
            <View style={[styles.card, styles.primaryCard]}>
              <Text style={styles.cardHeader}>🚨 Active Route Dispatch</Text>
              
              <View style={styles.statRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statVal}>{selectedHospital.eta}</Text>
                  <Text style={styles.statLabel}>ETA</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statVal}>{selectedHospital.distance}</Text>
                  <Text style={styles.statLabel}>Distance</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statVal, { color: '#10b981' }]}>{selectedHospital.beds.split(' ')[0]}</Text>
                  <Text style={styles.statLabel}>ICU Beds</Text>
                </View>
              </View>

              <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>Target Facility:</Text>
                <Text style={styles.detailsText}>{selectedHospital.name}</Text>
                <Text style={styles.detailsSubText}>{selectedHospital.type}</Text>
                <Text style={styles.detailsSubText}>📞 {selectedHospital.phone}</Text>
              </View>

              <View style={styles.buttonGroup}>
                <a 
                  href={`tel:${selectedHospital.phone}`}
                  style={{ textDecoration: 'none', flex: 1, marginRight: 8 }}
                >
                  <Pressable style={styles.callButton}>
                    <Text style={styles.callButtonText}>📞 Call ER</Text>
                  </Pressable>
                </a>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&origin=26.8467,80.9462&destination=${selectedHospital.lat},${selectedHospital.lon}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', flex: 1 }}
                >
                  <Pressable style={styles.navButton}>
                    <Text style={styles.navButtonText}>↗️ Directions</Text>
                  </Pressable>
                </a>
              </View>
            </View>

            {/* NEAREST HOSPITALS FINDER */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>🏥 Hospital Options (DuckDB Sorted)</Text>
              <Text style={styles.cardSubHeader}>Select a hospital to recalculate live routing</Text>

              {hospitalsList.map((hosp) => (
                <Pressable
                  key={hosp.name}
                  onPress={() => handleHospitalChange(hosp)}
                  style={[
                    styles.hospitalItem,
                    selectedHospital.name === hosp.name && styles.hospitalItemActive
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[
                      styles.hospitalName,
                      selectedHospital.name === hosp.name && styles.hospitalNameActive
                    ]}>
                      {hosp.name}
                    </Text>
                    <View style={[
                      styles.badge,
                      hosp.status === 'Ready' ? styles.badgeGreen : 
                      hosp.status === 'Active' ? styles.badgeBlue : styles.badgeOrange
                    ]}>
                      <Text style={styles.badgeText}>{hosp.status}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                    <Text style={styles.hospitalMeta}>📍 {hosp.distance} • ⏱️ {hosp.eta}</Text>
                    <Text style={styles.hospitalBeds}>🛏️ {hosp.beds}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* AMBULANCE & PATIENT STATUS */}
            <View style={[styles.card, { backgroundColor: '#f8fafc' }]}>
              <Text style={styles.cardHeader}>🚑 Dispatch Status</Text>
              <View style={styles.dispatchStep}>
                <Text style={styles.stepDot}>✅</Text>
                <Text style={styles.stepText}>Emergency SOS Signal Confirmed</Text>
              </View>
              <View style={styles.dispatchStep}>
                <Text style={styles.stepDot}>✅</Text>
                <Text style={styles.stepText}>DuckDB Nearest Hospital Located</Text>
              </View>
              <View style={styles.dispatchStep}>
                <Text style={styles.stepDot}>🟢</Text>
                <Text style={styles.stepText}>Ambulance Dispatch Request Acknowledged</Text>
              </View>
              <View style={styles.dispatchStep}>
                <Text style={styles.stepDot}>📡</Text>
                <Text style={[styles.stepText, { color: '#2563eb', fontWeight: '600' }]}>Syncing telemetry data with ER team...</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 85, // leave room for bottom tabs
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
    minHeight: 500,
  },
  mapWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
  },
  sidebar: {
    flex: 1,
    minWidth: 320,
    maxWidth: 420,
  },
  sidebarContent: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  },
  primaryCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#ef4444',
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  cardSubHeader: {
    fontSize: 12,
    color: '#64748b',
    marginTop: -8,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  detailsBox: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  detailsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  detailsSubText: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    cursor: 'pointer',
    width: '100%',
  },
  callButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  navButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    cursor: 'pointer',
    width: '100%',
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  hospitalItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  hospitalItemActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  hospitalNameActive: {
    color: '#1e40af',
  },
  hospitalMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  hospitalBeds: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeGreen: {
    backgroundColor: '#d1fae5',
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
  },
  badgeOrange: {
    backgroundColor: '#ffedd5',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1e293b',
  },
  dispatchStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  stepDot: {
    fontSize: 14,
  },
  stepText: {
    fontSize: 13,
    color: '#475569',
  },
});
