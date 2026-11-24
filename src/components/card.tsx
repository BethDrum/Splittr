import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

//local imports
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';

type Props = {
    onPress: () => void;
};

export default function Card({ onPress }: Props) {
    //for changable themes
    const { theme, themeName, toggleTheme } = useTheme();
    const styles = createStyles(theme);

    //used in index.tsx for main card
    return(
        <View style={styles.cardWrapper}>
            <View style = {styles.mainCard}>
                <Pressable onPress={onPress}>
                    <View style={styles.recieptText}>
                    <Text style={styles.textPrimary}>ADD   NEW</Text>
                    <Text style={styles.textPrimary}>RECEIPT  +</Text>
                    </View>
                </Pressable>
                <View style={styles.imageWrapper}>
                    <Image style={styles.image} source={require('../../assets/images/reciept.png')} />
                </View>
            </View>
        </View>
    );
}


const createStyles = (theme: typeof themes.default) => StyleSheet.create({
    mainCard: {
        width: '100%',
        flex: 1,
        backgroundColor: theme.returnButton,
        margin: 5,
        borderRadius: 15,
        color: theme.secondaryTextColor,
    },
    cardWrapper: {
        flex: 1,
        width: '100%',
        alignSelf: 'flex-start',
    },
    textPrimary: {
        color: theme.secondaryTextColor,
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 60,
    },
    textSecondary: {
        color: theme.primaryTextColor,
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 20,
        padding: '2%', 
        paddingLeft: '5%',
    },
    imageWrapper: {
        flex: 1,
        alignSelf: 'flex-end',
        position: 'absolute',
        height: '100%',
    },
    image: {
        height: '100%',
        width: 250,
    },
    recieptText: {
        padding: '5%'
    }
});