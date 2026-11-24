import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';

type Props = {
    onPress: () => void;   
    name: string;
    date: string; 
};

export default function ReceiptCard({ onPress, name, date }: Props) {
    //for changable themes
    const { theme, themeName, toggleTheme } = useTheme();
    const styles = createStyles(theme);

    return(
        <View style={styles.cardWrapper}>
            <View>
                <Pressable onPress={onPress}>
                    <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Image style={styles.icon} source={require('../../assets/images/icons/Star 3.png')} />
                    </View>
                    <View>
                        <Text style={styles.textPrimary}>{name}</Text>
                        <Text style={styles.textSecondary}>{date}</Text>
                    </View>
                    </View>
                </Pressable>
            </View>
        </View>
  );
}


const createStyles = (theme: typeof themes.default) => StyleSheet.create({
    iconBox: {
        backgroundColor: theme.secondaryColor,
        width: '20%',
        height: '100%',
        borderRadius: 15,
        marginRight: '5%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardWrapper: {
        width: '100%',
        height: 120,
        backgroundColor: theme.mainBackground,
        borderRadius: 10,
        padding: '5%',
        marginBottom: '2%',
    },
    textPrimary: {
        color: theme.primaryTextColor,
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 40,
    },
    textSecondary: {
        color: theme.primaryTextColor,
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 30,
    },
    row: {
        flexDirection: 'row',
    },
    icon: {
        height: '70%',
        width: '60%',
    }
});