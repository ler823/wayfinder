import { Link } from 'expo-router';
import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MAX_CONTENT_WIDTH } from '@/constants/layout';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.inner, { maxWidth: MAX_CONTENT_WIDTH.tablet }]}>
        <ThemedText type="title">This is a modal</ThemedText>
        <Link href="/" dismissTo style={styles.link}>
          <ThemedText type="link">Go to home screen</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inner: {
    width: '100%',
    alignItems: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
