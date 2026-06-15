import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, SafeAreaView, ActivityIndicator, Alert 
} from 'react-native';

export default function App() {
  const [token, setToken] = useState('');
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock student stats
  const studentData = {
    name: 'John Doe',
    roll: '26CSE001',
    attendance: '87%',
    gpa: '8.5 / 10',
    pendingAssignments: '2',
    marks: [
      { code: 'CS601', name: 'Computer Networks', score: '82 / 100' },
      { code: 'CS602', name: 'Artificial Intelligence', score: '90 / 100' }
    ]
  };

  const handleLogin = (selectedRole) => {
    setLoading(true);
    setTimeout(() => {
      setRole(selectedRole.toUpperCase());
      setToken(`mock-token-${selectedRole.toLowerCase()}`);
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setRole(null);
    setToken('');
    setEmail('');
    setPassword('');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#107beb" />
        <Text style={styles.loadingText}>Connecting to Aegis Academia...</Text>
      </View>
    );
  }

  if (!role) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginCard}>
          <Text style={styles.logo}>AEGIS MOBILE</Text>
          <Text style={styles.subtitle}>AI-Powered College Platform</Text>

          <TextInput
            placeholder="Username / Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholderTextColor="#888"
            style={styles.input}
          />

          <Text style={styles.bypassTitle}>Instant Test Accounts Login</Text>
          <View style={styles.bypassContainer}>
            <TouchableOpacity style={styles.btnStudent} onPress={() => handleLogin('student')}>
              <Text style={styles.btnText}>STUDENT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFaculty} onPress={() => handleLogin('faculty')}>
              <Text style={styles.btnText}>FACULTY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnAdmin} onPress={() => handleLogin('admin')}>
              <Text style={styles.btnText}>ADMIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AEGIS MOBILE ({role})</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {role === 'STUDENT' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Welcome, {studentData.name}</Text>
            <Text style={styles.details}>Roll Number: {studentData.roll}</Text>

            {/* Dashboard Widgets */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Attendance</Text>
                <Text style={[styles.statValue, { color: '#22c55e' }]}>{studentData.attendance}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>CGPA Score</Text>
                <Text style={[styles.statValue, { color: '#107beb' }]}>{studentData.gpa}</Text>
              </View>
            </View>

            {/* Marks List */}
            <Text style={[styles.subSectionTitle, { marginTop: 20 }]}>Semester Grade Sheet</Text>
            {studentData.marks.map((m, idx) => (
              <View key={idx} style={styles.listRow}>
                <View>
                  <Text style={styles.rowTitle}>{m.name}</Text>
                  <Text style={styles.rowSub}>{m.code}</Text>
                </View>
                <Text style={styles.rowScore}>{m.score}</Text>
              </View>
            ))}
          </View>
        )}

        {role === 'FACULTY' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attendance Management</Text>
            <Text style={styles.details}>Prof. Jane Smith - Dept of Computer Science</Text>

            <View style={styles.facultyPanel}>
              <Text style={styles.cardHeader}>Select Active Session</Text>
              <Text style={styles.cardInfo}>CS601: Computer Networks (Section A)</Text>

              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => Alert.alert('Attendance Status', 'Loading Student Roll List...')}
              >
                <Text style={styles.actionBtnText}>Launch Mobile Attendance Scanner</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {role === 'ADMIN' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analytics Dashboard</Text>
            <Text style={styles.details}>Campus Stats Summary</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Students</Text>
                <Text style={styles.statValue}>1,280</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Faculty</Text>
                <Text style={styles.statValue}>84</Text>
              </View>
            </View>
            
            <View style={[styles.statCard, { marginTop: 15 }]}>
              <Text style={styles.statLabel}>Placement Success Ratio</Text>
              <Text style={[styles.statValue, { color: '#22c55e' }]}>92% Selected</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginCard: {
    padding: 24,
    justifyContent: 'center',
    height: '100%',
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bypassTitle: {
    color: '#f59e0b',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 12,
  },
  bypassContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  btnStudent: {
    flex: 1,
    backgroundColor: '#3b82f633',
    borderColor: '#3b82f655',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnFaculty: {
    flex: 1,
    backgroundColor: '#eab30833',
    borderColor: '#eab30855',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnAdmin: {
    flex: 1,
    backgroundColor: '#ef444433',
    borderColor: '#ef444455',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  header: {
    height: 60,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  logoutBtn: {
    padding: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subSectionTitle: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  listRow: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rowTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rowSub: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  rowScore: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  facultyPanel: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardInfo: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  actionBtn: {
    backgroundColor: '#107beb',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
