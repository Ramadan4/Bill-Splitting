import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

import { KeyboardDoneBar } from '@/components/ui/KeyboardDoneBar';
import { KEYBOARD_SCROLL_PROPS } from '@/components/ui/keyboardScroll';
import { Screen } from '@/components/ui/Screen';
import { Spacing } from '@/constants/layout';

type KeyboardScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * When false, only avoids the keyboard; the child must be a FlatList/ScrollView
   * so nested virtualized lists are not created.
   */
  scroll?: boolean;
};

/**
 * Form-screen shell: keeps content visible above the keyboard and lets the
 * user scroll the page behind it. Dragging the list dismisses the keyboard.
 */
export function KeyboardScreen({
  children,
  style,
  contentContainerStyle,
  scroll = true,
}: KeyboardScreenProps) {
  const headerHeight = useHeaderHeight();

  return (
    <Screen style={style}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={headerHeight}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            {...KEYBOARD_SCROLL_PROPS}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
        <KeyboardDoneBar />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: Spacing.md,
  },
});
