import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    label: string;
    theme?: 'confirm' | 'edit' | 'back';
    onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
    if (theme === 'confirm')
        return(
        <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: '#A8B396'},
            ]}>
            <Pressable onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (theme === 'edit')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: '#EBACAD'},
            ]}>
            <Pressable onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (theme === 'back')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: '#C8D3B7'},
            ]}>
            <Pressable onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )

    return (
    <View style={styles.buttonWrapper}>
      <Pressable onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    buttonWrapper: {
        width: '90%',
        height: 68,
        marginHorizontal: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        borderRadius: 10,
        margin: 5,
    },
    buttonLabel: {
        color: '#FFFFFF',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 25,
        padding: '2%', 
        paddingRight: '5%',
    },
});