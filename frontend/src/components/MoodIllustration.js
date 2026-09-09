import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SvgUri } from "react-native-svg";
import { colors } from "../theme";

export default function MoodIllustration({ uri, size = 52, active = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <View style={[styles.wrap, { width: size, height: size, opacity: active ? 1 : 0.55 }]}>
      {!failed ? (
        <SvgUri width={size} height={size} uri={uri} onError={() => setFailed(true)} />
      ) : (
        <View style={[styles.fallback, { width: size, height: size }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  fallback: {
    borderRadius: 999,
    backgroundColor: colors.hairline,
  },
});
