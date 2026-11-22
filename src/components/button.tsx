import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    label: string;
    theme?: 'confirm' | 'edit' | 'back' | 'addOption' | 'share' | 'save' | 'submit' | 'action' | 'next';
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
            <Pressable onPress={onPress} style={styles.group}>
                <Image style={styles.iconR} source={require('../../assets/images/icons/keyboard_return.png')} />
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (theme === 'addOption')
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
    else if (theme === 'share')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: '#C8D3B7'},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
                <Image style={styles.iconS} source={require('../../assets/images/icons/Share.png')} />
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (theme === 'save')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: '#C8D3B7'},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
                <Image style={styles.iconS} source={require('../../assets/images/icons/Save.png')} />
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (theme === 'submit')
        return(
            <View
            style={[
                styles.submit,
                { backgroundColor: '#EBACAD'},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (theme === 'action')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: '#EBACAD'},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (theme === 'next')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: '#A8B396'},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
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
        borderRadius: 40,
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
    iconS:{
        marginTop: 8,
    },
    iconR: {
        marginTop: 12,
    },
    group: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    submit: {
        width: '40%',
        height: '70%',
        marginHorizontal: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        borderRadius: 40,
        margin: 5,
    },
});