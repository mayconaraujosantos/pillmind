import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { logger } from '@shared/utils/logger';
import { useTheme } from '@shared/theme';

interface PerformanceMetrics {
  avgRequestDuration: number;
  maxRequestDuration: number;
  minRequestDuration: number;
  totalRequests: number;
  errorRate: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    avgRequestDuration: 0,
    maxRequestDuration: 0,
    minRequestDuration: 0,
    totalRequests: 0,
    errorRate: 0,
  });
  const { isDark } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      const logs = logger.getLogs();
      const stats = logger.getLogStats();

      // Calcular métricas de performance
      const requestLogs = logs.filter((log) => log.duration !== undefined);
      if (requestLogs.length > 0) {
        const durations = requestLogs
          .map((log) => log.duration || 0)
          .filter((d) => d > 0);

        const avgDuration =
          durations.length > 0
            ? Math.round(
                durations.reduce((a, b) => a + b, 0) / durations.length
              )
            : 0;
        const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
        const minDuration = durations.length > 0 ? Math.min(...durations) : 0;

        const errorRate =
          stats.total > 0
            ? Math.round((stats.byLevel.ERROR / stats.total) * 100)
            : 0;

        setMetrics({
          avgRequestDuration: avgDuration,
          maxRequestDuration: maxDuration,
          minRequestDuration: minDuration,
          totalRequests: requestLogs.length,
          errorRate: errorRate,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getErrorRateColor = (errorRate: number) => {
    if (errorRate === 0) return '#4CAF50';
    if (errorRate <= 5) return '#FF9800';
    return '#F44336';
  };

  const getDurationColor = (duration: number) => {
    if (duration < 200) return '#4CAF50';
    if (duration < 500) return '#FF9800';
    return '#F44336';
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
        📊 Performance
      </Text>

      <View style={styles.metricsGrid}>
        {/* Avg Duration */}
        <View
          style={[
            styles.metric,
            { backgroundColor: isDark ? '#252525' : '#FFF' },
          ]}
        >
          <Text
            style={[styles.metricLabel, { color: isDark ? '#999' : '#666' }]}
          >
            Avg
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: getDurationColor(metrics.avgRequestDuration) },
            ]}
          >
            {metrics.avgRequestDuration}ms
          </Text>
        </View>

        {/* Max Duration */}
        <View
          style={[
            styles.metric,
            { backgroundColor: isDark ? '#252525' : '#FFF' },
          ]}
        >
          <Text
            style={[styles.metricLabel, { color: isDark ? '#999' : '#666' }]}
          >
            Max
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: getDurationColor(metrics.maxRequestDuration) },
            ]}
          >
            {metrics.maxRequestDuration}ms
          </Text>
        </View>

        {/* Total Requests */}
        <View
          style={[
            styles.metric,
            { backgroundColor: isDark ? '#252525' : '#FFF' },
          ]}
        >
          <Text
            style={[styles.metricLabel, { color: isDark ? '#999' : '#666' }]}
          >
            Requests
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: isDark ? '#4CAF50' : '#0066CC' },
            ]}
          >
            {metrics.totalRequests}
          </Text>
        </View>

        {/* Error Rate */}
        <View
          style={[
            styles.metric,
            { backgroundColor: isDark ? '#252525' : '#FFF' },
          ]}
        >
          <Text
            style={[styles.metricLabel, { color: isDark ? '#999' : '#666' }]}
          >
            Error
          </Text>
          <Text
            style={[
              styles.metricValue,
              { color: getErrorRateColor(metrics.errorRate) },
            ]}
          >
            {metrics.errorRate}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metric: {
    flex: 1,
    minWidth: '48%',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
