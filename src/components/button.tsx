import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

//local import
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';

type Props = {
    label: string;
    buttonTheme?: 'confirm' | 'back' | 'share' | 'save' | 'submit' | 'action' | 'backButton' | 'service';
    onPress?: () => void;
};

export default function Button({ label, buttonTheme, onPress }: Props) {
    //for changable themes
    const { theme, themeName, toggleTheme } = useTheme();
    const styles = createStyles(theme);

    //for each button, alter colour and (possibly) change buttonWrapper style and/or add a image for a icon
    if (buttonTheme === 'confirm')
        return(
        <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: theme.continueButton},
            ]}>
            <Pressable onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (buttonTheme === 'back')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: theme.returnButton},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
                <Image style={styles.iconR} source={require('../../assets/images/icons/keyboard_return.png')} />
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (buttonTheme === 'share')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: theme.actionButton},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
                <Image style={styles.iconS} source={require('../../assets/images/icons/Share.png')} />
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (buttonTheme === 'save')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: theme.actionButton},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
                <Image style={styles.iconS} source={require('../../assets/images/icons/Save.png')} />
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (buttonTheme === 'submit')
        return(
            <View
            style={[
                styles.submit,
                { backgroundColor: theme.actionButton},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (buttonTheme === 'action')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: theme.actionButton},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (buttonTheme === 'backButton')
        return(
            <View
            style={[
                styles.back,
                { backgroundColor: theme.actionButton},
            ]}>
            <Pressable onPress={onPress} style={styles.group}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
    else if (buttonTheme === 'service')
        return(
            <View
            style={[
                styles.buttonWrapper,
                { backgroundColor: theme.alternateActionColour},
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

const createStyles = (theme: typeof themes.default) => StyleSheet.create({
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
        color: theme.secondaryTextColor,
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
    back: {
        width: '30%',
        height: 58,
        marginHorizontal: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        borderRadius: 40,
        margin: 5,
    },
});