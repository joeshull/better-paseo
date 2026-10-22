import React from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "@getpaseo/plugin/client/react-native";
import type { ExtendedThemeTokens } from "./theme-tokens";
import type { ToolCallView } from "../tools/classify";
import { RunningDot } from "../ui/running-dot";

/** Cards remain in their original host slots; this button only shares disclosure. */
export function ToolRollup({ calls, expanded, onExpandedChange, tokens, compact }: {
  calls: readonly ToolCallView[];
  expanded: boolean;
  onExpandedChange(value: boolean): void;
  tokens: ExtendedThemeTokens;
  compact: boolean;
}) {
  const running = calls.filter((call) => call.status === "running").length;
  const title = `Called ${calls.length} tools`;
  const label = running ? `${title} · ${running} running` : title;
  return <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ expanded }}
    aria-expanded={expanded}
    onPress={() => onExpandedChange(!expanded)}
    style={{ flexDirection: "row", alignItems: "center", gap: 10, minHeight: compact ? 44 : 28 }}
  >
    <View style={{ width: 16, alignItems: "center" }}>
      {running ? <RunningDot color={tokens.accent} /> : <Icon name="Wrench" size={14} color={tokens.foregroundMuted} />}
    </View>
    <Text style={{ color: tokens.foregroundMuted, fontFamily: tokens.fontUi, fontSize: 13, flexShrink: 1 }}>{label}</Text>
    <Icon name={expanded ? "ChevronDown" : "ChevronRight"} size={14} color={tokens.foregroundMuted} />
  </Pressable>;
}
