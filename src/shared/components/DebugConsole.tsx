import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { logger, LogEntry, LogLevel } from '@shared/utils/logger';
import { useTheme } from '@shared/theme';

export const DebugConsole: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevel | 'ALL'>('ALL');
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  useEffect(() => {
    const updateLogs = () => {
      const allLogs = logger.getLogs();
      if (filter === 'ALL') {
        setLogs(allLogs);
      } else {
        setLogs(allLogs.filter((log) => log.level === filter));
      }
    };

    const interval = setInterval(updateLogs, 500);
    updateLogs();

    return () => clearInterval(interval);
  }, [filter]);

  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return '#888';
      case LogLevel.INFO:
        return '#4CAF50';
      case LogLevel.WARN:
        return '#FF9800';
      case LogLevel.ERROR:
        return '#F44336';
    }
  };

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'bug';
      case LogLevel.INFO:
        return 'information-circle';
      case LogLevel.WARN:
        return 'alert-circle';
      case LogLevel.ERROR:
        return 'close-circle';
    }
  };

  const handleExport = () => {
    const exported = logger.exportLogs();
    // Em um app real, você salvaria em arquivo ou enviaria para um servidor
    console.log('=== EXPORTED LOGS ===');
    console.log(exported);
    console.log('=== END LOGS ===');
  };

  const handleResetStorage = async () => {
    try {
      await AsyncStorage.clear();
      logger.info('Debug', 'AsyncStorage cleared');
      setVisible(false);
    } catch (err) {
      logger.error('Debug', 'Failed to clear storage', undefined, err as Error);
    }
  };

  return (
    <>
      {/* Fixed Header Button */}
      <View
        style={[
          styles.headerButton,
          { top: insets.top + 8 },
          { backgroundColor: isDark ? '#2C2C2C' : '#E0E0E0' },
        ]}
      >
        <TouchableOpacity
          style={styles.debugButton}
          onPress={() => setVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="bug" size={20} color={isDark ? '#4CAF50' : '#333'} />
          <Text
            style={[
              styles.debugButtonLabel,
              { color: isDark ? '#FFF' : '#000' },
            ]}
          >
            Debug
          </Text>
          {logs.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{logs.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Debug Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { backgroundColor: isDark ? '#2C2C2C' : '#E0E0E0' },
            ]}
          >
            <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
              🐛 Debug Console
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleExport}
                style={styles.headerActionButton}
              >
                <Ionicons
                  name="download"
                  size={20}
                  color={isDark ? '#4CAF50' : '#0066CC'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleResetStorage}
                style={styles.headerActionButton}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color={isDark ? '#FFD166' : '#D97706'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  logger.clearLogs();
                  setLogs([]);
                }}
                style={styles.headerActionButton}
              >
                <Ionicons
                  name="trash"
                  size={20}
                  color={isDark ? '#FF6B6B' : '#F44336'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.headerActionButton}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={isDark ? '#999' : '#666'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Filters */}
          <View
            style={[
              styles.filters,
              { borderBottomColor: isDark ? '#333' : '#DDD' },
            ]}
          >
            {(['ALL', 'DEBUG', 'INFO', 'WARN', 'ERROR'] as const).map(
              (level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setFilter(level as LogLevel | 'ALL')}
                  style={[
                    styles.filterButton,
                    filter === level && {
                      backgroundColor: isDark ? '#333' : '#DDD',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      {
                        color:
                          level === 'ALL'
                            ? isDark
                              ? '#999'
                              : '#666'
                            : getLogColor(level as LogLevel),
                        fontWeight: filter === level ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* Logs */}
          <ScrollView style={styles.logsContainer} showsVerticalScrollIndicator>
            {logs.length === 0 ? (
              <Text
                style={[styles.emptyText, { color: isDark ? '#666' : '#999' }]}
              >
                No logs yet...
              </Text>
            ) : (
              logs.slice().map((log, index) => (
                <View
                  key={index}
                  style={[
                    styles.logEntry,
                    {
                      borderLeftColor: getLogColor(log.level),
                      backgroundColor: isDark ? '#252525' : '#FFF',
                    },
                  ]}
                >
                  <View style={styles.logHeader}>
                    <Ionicons
                      name={getLogIcon(log.level)}
                      size={16}
                      color={getLogColor(log.level)}
                    />
                    <Text
                      style={[
                        styles.logLevel,
                        { color: getLogColor(log.level) },
                      ]}
                    >
                      {log.level}
                    </Text>
                    <Text
                      style={[
                        styles.logComponent,
                        { color: isDark ? '#999' : '#666' },
                      ]}
                    >
                      {log.component}
                    </Text>
                    <Text
                      style={[
                        styles.logTime,
                        { color: isDark ? '#666' : '#999' },
                      ]}
                    >
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.logMessage,
                      { color: isDark ? '#DDD' : '#333' },
                    ]}
                  >
                    {log.message}
                  </Text>

                  {log.data && (
                    <View style={styles.logData}>
                      <Text
                        style={[
                          styles.logDataText,
                          { color: isDark ? '#888' : '#666' },
                        ]}
                      >
                        {JSON.stringify(log.data, null, 2)}
                      </Text>
                    </View>
                  )}

                  {log.stack && (
                    <View style={styles.logStack}>
                      <Text
                        style={[
                          styles.logStackText,
                          { color: isDark ? '#888' : '#666' },
                        ]}
                      >
                        {log.stack.slice(0, 200)}...
                      </Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </ScrollView>

          {/* Stats */}
          <View
            style={[
              styles.stats,
              { backgroundColor: isDark ? '#2C2C2C' : '#E0E0E0' },
            ]}
          >
            <Text
              style={[styles.statsText, { color: isDark ? '#FFF' : '#000' }]}
            >
              Total: {logger.getLogs().length} | Filtered: {logs.length}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -45 }],
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    borderBottomLeftRadius: 8,
    zIndex: 9999,
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  debugButtonLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    padding: 8,
  },
  filters: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  logsContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 32,
    fontSize: 14,
  },
  logEntry: {
    marginVertical: 4,
    padding: 8,
    borderLeftWidth: 4,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  logLevel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  logComponent: {
    fontSize: 10,
    marginLeft: 4,
  },
  logTime: {
    fontSize: 10,
    marginLeft: 'auto',
  },
  logMessage: {
    fontSize: 12,
    marginBottom: 4,
  },
  logData: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  logDataText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  logStack: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 6,
    borderRadius: 3,
  },
  logStackText: {
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  stats: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  statsText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
