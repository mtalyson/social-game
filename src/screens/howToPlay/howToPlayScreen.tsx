import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui/primaryButton';
import type { IRuleItem } from '@/types/rules/interfaces/rules';
import { HOW_TO_PLAY_RULES } from '@/constants/rules/rules';
import { colors } from '@/theme/colors';
import { styles } from './styles';

function RuleCard({ icon, title, description }: IRuleItem) {
  return (
    <View style={styles.ruleCard}>
      <Ionicons
        name={icon}
        size={26}
        color={colors.primary}
        style={styles.ruleIcon}
      />
      <View style={styles.ruleContent}>
        <Text style={styles.ruleTitle}>{title}</Text>
        <Text style={styles.ruleDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function HowToPlayScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>Como Jogar</Text>
          <Ionicons name="game-controller" size={26} color={colors.primary} />
        </View>

        <Text style={styles.subtitle}>
          Um jogo simples para beber com os amigos!
        </Text>

        {HOW_TO_PLAY_RULES.map((rule) => (
          <RuleCard key={rule.title} {...rule} />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Entendi! Vamos jogar"
          onPress={() => router.back()}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}
