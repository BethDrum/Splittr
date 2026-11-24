import { StyleSheet, Text, View } from 'react-native';

//local imports
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';


interface GuestSection {
    name: string;
    image?: string;
}

export default function PersonCard({name}: GuestSection) {
    //for changable themes
    const { theme, themeName, toggleTheme } = useTheme();
    const styles = createStyles(theme);

    
    return(
        <View style={styles.cardWrapper}>
            <View>
                <Text style={styles.name}>{name}</Text>
            </View>
        </View>
    );
}


const createStyles = (theme: typeof themes.default) => StyleSheet.create({
    cardWrapper: {
        alignSelf: 'center',
        backgroundColor: theme.mainBackground,
        borderRadius: 15,
        margin: '1%',
        width: '100%',
    },
    name: {
        color: theme.primaryTextColor,
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 25,
        padding: '2%', 
        paddingLeft: '5%',
    },
});